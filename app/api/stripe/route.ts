import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripeSecretKey: string = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "";

const stripe = new Stripe(stripeSecretKey, {});

export async function POST(req: NextRequest) {
  try {
    const { items, customerEmail, paymentMethodId } = await req.json();
    const customer = await stripe.customers.create({
      email: customerEmail,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    const priceId = process.env.PRICE_ID;
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    if (
      !subscription.latest_invoice ||
      typeof subscription.latest_invoice === "string"
    ) {
      return NextResponse.json(
        { error: "Unable to retrieve latest invoice." },
        { status: 500 }
      );
    }

    const paymentIntent = subscription.latest_invoice.payment_intent;
    if (!paymentIntent || typeof paymentIntent === "string") {
      return NextResponse.json(
        { error: "Unable to retrieve payment intent." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
