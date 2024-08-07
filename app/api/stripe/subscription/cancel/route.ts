import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOption } from "../../../auth/[...nextauth]/route";
import { User, Package, Subscription } from "@/app/lib/models";
import { createCustomer, handleSubscriptionCancel, handleSubscriptionSuccess, updateCustomer } from "@/app/lib/stripe";
import { validateError } from "@/app/lib/functions";

const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey);

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user || !['player', 'trainer'].includes(session.user.role)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const user = await User.findOne({ _id: session.user._id })
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const subscription = await Subscription.findOne({ userId: user._id })
        if (!subscription) return NextResponse.json({ message: "No subscription found" }, { status: 404 });

        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

        await handleSubscriptionCancel({ userId: user._id })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}
