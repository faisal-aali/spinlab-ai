import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { string } from 'yup';
const stripeSecretKey: string = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '';

const stripe = new Stripe(stripeSecretKey, {
  // Additional configuration options
});

export async function POST(req: NextRequest) {
  try {
    const { items, customerEmail } = await req.json();

    // Create a customer
    const customer = await stripe.customers.create({
      email: customerEmail,
    });

    // Assuming you have a predefined price ID for your subscription plan
    const priceId = process.env.PRICE_ID; // Replace with your actual price ID

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete', // To handle failed payments more gracefully
      expand: ['latest_invoice.payment_intent'],
    });

    if (!subscription.latest_invoice || typeof subscription.latest_invoice === 'string') {
      return NextResponse.json({ error: 'Unable to retrieve latest invoice.' }, { status: 500 });
    }

    const paymentIntent = subscription.latest_invoice.payment_intent;
    if (!paymentIntent || typeof paymentIntent === 'string') {
      return NextResponse.json({ error: 'Unable to retrieve payment intent.' }, { status: 500 });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}


