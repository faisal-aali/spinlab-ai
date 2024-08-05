import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOption } from "../../auth/[...nextauth]/route";
import { User } from "@/app/lib/models";
import { createCustomer, handleSubscriptionSuccess, updateCustomer } from "@/app/lib/stripe";
import { validateError } from "@/app/lib/functions";

const stripeSecretKey: string = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey);

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user || !['player', 'trainer'].includes(session.user.role)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const user = await User.findOne({ _id: session.user._id })
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const { paymentMethodId, stripePlanId } = await req.json();

        if (!paymentMethodId || !stripePlanId) return NextResponse.json({ message: "Invalid request" }, { status: 400 });

        let customer;
        if (!user.stripeCustomerId) customer = await createCustomer({ user, paymentMethodId })
        else customer = await updateCustomer({ user, paymentMethodId })

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: stripePlanId }],
            expand: ['latest_invoice.payment_intent'],
        });

        if (!subscription.latest_invoice || typeof subscription.latest_invoice === "string" || !subscription.latest_invoice.payment_intent || typeof subscription.latest_invoice.payment_intent === "string") {
            return NextResponse.json({ message: "Unable to retrieve latest invoice." }, { status: 500 });
        }

        const paymentIntent = subscription.latest_invoice.payment_intent;

        if (paymentIntent.status === 'requires_action') {
            return NextResponse.json({
                requiresAction: true,
                paymentIntentClientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            });
        } else if (paymentIntent.status === 'succeeded') {
            // Handle successful subscription setup
            await handleSubscriptionSuccess({ subscription });
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ message: "Subscription failed. Please try again." }, { status: 500 });
        }

    } catch (err) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}
