import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOption } from "../../auth/[...nextauth]/route";
import { Package, Subscription, User } from "@/app/lib/models";
import { createCustomer, handlePaymentSuccess, handleSubscriptionCancel, handleSubscriptionSuccess, updateCustomer } from "@/app/lib/stripe";
import { validateError } from "@/app/lib/functions";
import { IPackage } from "@/app/lib/interfaces/package";
import { headers } from "next/headers";
import { PostSubscriptionUpdate } from "@/app/lib/zapier";

const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey);

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
    try {
        const data = await req.text()
        // console.log('[/stripe/webhook] data', data)

        const signature = headers().get("stripe-signature") as string;

        const event = stripe.webhooks.constructEvent(data, signature, secret);

        // Handle the event
        switch (event.type) {
            case 'invoice.payment_succeeded':
                console.log('subscription succeed')
                // Update subscription status in the database
                let subscription = event.data.object.subscription;
                console.log(subscription)
                if (typeof subscription === 'string') {
                    subscription = await stripe.subscriptions.retrieve(subscription);
                }
                if (!subscription || typeof subscription === 'string') return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
                await handleSubscriptionSuccess({ subscription })
                break;
            case 'customer.subscription.updated':
                console.log('subscription updated')
                // Update subscription status in the database
                const updatedSubscription = event.data.object;

                await Subscription.updateOne({
                    stripeSubscriptionId: updatedSubscription.id
                }, {
                    status: updatedSubscription.status
                })

                Subscription.findOne({ stripeSubscriptionId: updatedSubscription.id }).then(subscription => {
                    if (subscription) PostSubscriptionUpdate(subscription.userId).catch(err => console.error('[Zapier] FATAL ERROR:', err))
                }).catch(console.error)

                break;
            case 'customer.subscription.deleted':
                console.log('subscription deleted')
                // Update subscription status in the database
                const deletedSubscription = event.data.object;

                const dbSubscription = await Subscription.findOne({ stripeSubscriptionId: deletedSubscription.id })
                if (!dbSubscription) return NextResponse.json({ message: 'Invalid request' }, { status: 400 })

                await handleSubscriptionCancel({ userId: dbSubscription.userId })
                break;
            case 'payment_intent.succeeded':
                console.log('payement succeed')
                const paymentIntent = event.data.object;
                if (paymentIntent.metadata.userId)
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
