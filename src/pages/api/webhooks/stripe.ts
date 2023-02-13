import { NextApiRequest, NextApiResponse } from "next"
import Stripe from "stripe";
import {trpc} from "@/utils/trpc";

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
	const { mutate } = trpc.createOrder.useMutation({});
	const stripe = new Stripe(stripeKey, { apiVersion: "2022-11-15" })
	if(request.method === 'post'){
		//possibly require raw body;
		console.log(request.body)

		const sig = request.headers['stripe-signature'];
		if(!sig) throw new Error("invalid request");

		let event;
		//Verify Webhook Signature belongs to stripe
		try {
			event = stripe.webhooks.constructEvent(request.body, sig, webhookSecret);
		} catch (err) {
			response.status(400).send(`Webhook Error: ${err?.message}`);
			return;
		}

		// Handle the event
		let paymentIntentStatus;
		switch (event.type) {
			case 'payment_intent.payment_failed':
				paymentIntentStatus = event.data.object;
				console.log('payment failed', paymentIntentStatus)
				// Then define and call a function to handle the event payment_intent.payment_failed
				break;
			case 'payment_intent.processing':
				paymentIntentStatus = event.data.object;
				console.log('payment processing', paymentIntentStatus)
				// Then define and call a function to handle the event payment_intent.processing
				break;
			case 'payment_intent.succeeded':
				paymentIntentStatus = event.data.object;

				console.log('payment success', paymentIntentStatus)
				mutate(paymentIntentStatus);

				// Then define and call a function to handle the event payment_intent.succeeded
				break;
			// ... handle other event types
			default:
			console.log(`Unhandled event type ${event.type}`);
		}

		// Return a 200 response to acknowledge receipt of the event
		response.send(200);
	}
}