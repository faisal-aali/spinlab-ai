import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOption } from "../../auth/[...nextauth]/route";
import { Package, Subscription, User } from "@/app/lib/models";
import { createCustomer, handlePaymentSuccess, handleSubscriptionSuccess, updateCustomer } from "@/app/lib/stripe";
import { validateError } from "@/app/lib/functions";
import { IPackage } from "@/app/lib/interfaces/package";

const stripeSecretKey: string = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey);

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        console.log('[/stripe/webhook] data', data)
        const event = stripe.webhooks.constructEvent(
            data,
            req.headers.get('stripe-signature') as string,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );

        // Handle the event
        switch (event.type) {
            case 'invoice.payment_succeeded':
                // Update subscription status in the database
                const subscription = event.data.object.subscription;
                if (!subscription || typeof subscription === 'string') return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
                await handleSubscriptionSuccess({ subscription })
                break;
            case 'customer.subscription.deleted':
                // Update subscription status in the database
                const deletedSubscription = event.data.object;
                await Subscription.findOneAndUpdate(
                    { stripeSubscriptionId: deletedSubscription.id },
                    { status: 'cancelled' }
                );
                break;
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                handlePaymentSuccess({ paymentIntent });
                break;
        }

        return NextResponse.json({ message: 'OK' }, { status: 200 })
    } catch (err) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}
