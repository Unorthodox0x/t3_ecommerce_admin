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

		//EXTRACT SIGNATURE FOR VERIFICATION
		const sig = request.headers['stripe-signature'];
		if(!sig) throw new Error("invalid request");

		//EXTRACT INFORMATION IN BODY FROM REQUEST
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
		
		// Return a 200 response to acknowledge receipt of the event
		// else a second request wil be sent
		response.send(200);
	}
}


function handleStripeWebhook(sig, body) {
		//INSTANTIATE STRIPE INSTANCE
		const stripe = new Stripe(stripeKey, { apiVersion: "2022-11-15" })
		//INSTANTIATE TRPC FUNCTION CALLER
		const caller = appRouter.createCaller({});

		let event;
		try {
			//Verify Webhook Signature belongs to stripe
			event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
		} catch (err) {
			//INVALID WEBHOOK, THROW ERR
			console.error('err', err?.message)
			throw new Error('Webhook request error')
			return;
		}

		// WEBHOOK VALID, Handle the event
		let paymentIntentStatus;
		switch (event.type) {
			case 'payment_intent.succeeded':
				paymentIntentStatus = event.data.object;
				//UPDATE PAYMENT STATUS OF CUSTOMER ORDER
				caller.updateOrder({ 
					paymentId: paymentIntentStatus?.id,
					idempotencyKey: event.request?.idempotency_key,
					amount: paymentIntentStatus?.amount,
					amount_received: paymentIntentStatus?.amount_received,
					receipt_url: paymentIntentStatus?.receipt_url, 
					status: paymentIntentStatus.status,
					customerId: paymentIntentStatus.customerId
				})
				break;
			case 'payment_intent.failed':
				paymentIntentStatus = event.data.object;
				//DELETE INFO FOR INVALID ORDER
				caller.deleteOrder({
					customerId: paymentIntentStatus.customerId
				})
				break;
			default:
				console.log(`Unhandled event type ${event.type}`);
				throw new Error(`Unhandled event type ${event.type}`)
		}
}