import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOption } from "../../auth/[...nextauth]/route";
import { Package, Subscription, User } from "@/app/lib/models";
import { createCustomer, handlePaymentSuccess, handleSubscriptionSuccess, updateCustomer } from "@/app/lib/stripe";
import { validateError } from "@/app/lib/functions";
import { IPackage } from "@/app/lib/interfaces/package";
import { headers } from "next/headers";

const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey);

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        console.log('[/stripe/webhook] data', JSON.stringify(data))

        const body = await req.text()
        const signature = headers().get("stripe-signature") as string;

        const event = stripe.webhooks.constructEvent(body, signature, secret);

        // Handle the event
        switch (event.type) {
            case 'invoice.payment_succeeded':
                console.log('subscription succeed')
                // Update subscription status in the database
                const subscription = event.data.object.subscription;
                if (!subscription || typeof subscription === 'string') return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
                await handleSubscriptionSuccess({ subscription })
                break;
            case 'customer.subscription.deleted':
                console.log('subscription deleted')
                // Update subscription status in the database
                const deletedSubscription = event.data.object;
                await Subscription.findOneAndUpdate(
                    { stripeSubscriptionId: deletedSubscription.id },
                    { status: 'cancelled' }
                );
                break;
            case 'payment_intent.succeeded':
                console.log('payement succeed')
                const paymentIntent = event.data.object;
                handlePaymentSuccess({ paymentIntent });
                break;
        }

        return NextResponse.json('OK', { status: 200 })
    } catch (err) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}
