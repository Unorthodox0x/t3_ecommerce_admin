import { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe";
import {appRouter} from "@/server/routers";

//TODO: 
//Create an order when the customer originally completes their order
//then update the order with this webhook

const stripeKey = process.env.STRIPE_SECRET_KEY as string;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
	request:NextApiRequest, 
	response:NextApiResponse
) {
	if(request.method === 'POST'){
		const sig = request.headers['stripe-signature'];
		if(!sig) throw new Error("invalid request");

		let body = ''
    request.on('data', (data) => {
      body += data
    })
    request.on('end', async() => {
      try{
				await handleStripeWebhook(sig, body)
			}catch(err){
				response.status(400).send(`Webhook Error: ${err?.message}`);
			}
    })

		//undefined
		//need middleware to exract raw body??

		// const {type}:{type:string} = request.body;

		// Return a 200 response to acknowledge receipt of the event
		response.send(200);
	}
}


function handleStripeWebhook(sig, body) {
		const stripe = new Stripe(stripeKey, { apiVersion: "2022-11-15" })
		const caller = appRouter.createCaller({});

		let event;
		try {
			//Verify Webhook Signature belongs to stripe
			event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
		} catch (err) {
			console.error('err', err?.message)
			throw new Error('Webhook request error')
			return;
		}

		// Handle the event
		let paymentIntentStatus;
		switch (event.type) {
			case 'payment_intent.succeeded':
				paymentIntentStatus = event.data.object;
				console.log('paymentIntentStatus', paymentIntentStatus)
				caller.updateOrder({ 
					paymentId: paymentIntentStatus?.id,
					idempotencyKey: event.request?.idempotency_key,
					amount: paymentIntentStatus?.amount,
					amount_received: paymentIntentStatus?.amount_received,
					receipt_url: paymentIntentStatus?.receipt_url, 
					status: paymentIntentStatus.status,
					customerId: paymentIntentStatus.customerId
				})
				// Then define and call a function to handle the event payment_intent.payment_failed
				break;
			case 'payment_intent.failed':
				paymentIntentStatus = event.data.object;
				console.log('payment processing', paymentIntentStatus)
				// Then define and call a function to handle the event payment_intent.processing
				break;

			// ... handle other event types
			default:
			console.log(`Unhandled event type ${event.type}`);
		}
}


// paymentIntentStatus.id: 'ch_3MbAeMAU2xpKVkY10bfZ1rSD',
// paymentIntentStatus.amount: 520,
// paymentIntentStatus.amount_captured: 520,
// paymentIntentStatus.receipt_url: 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTVg1Y3lBVTJ4cEtWa1kxKMT3qp8GMgYY8aZ7mrA6LBZUlin9bC9Q0gRn28LudAvWaC-LnuM7_HbunlD1l1dahT_K4BkZ3UVU4P1a',
// paymentIntentStatus.status: 'succeeded',