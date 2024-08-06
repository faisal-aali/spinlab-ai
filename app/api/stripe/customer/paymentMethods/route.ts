import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOption } from "../../../auth/[...nextauth]/route";
import { Package, Subscription, User } from "@/app/lib/models";
import { createCustomer, handlePaymentSuccess, updateCustomer } from "@/app/lib/stripe";
import { validateError } from "@/app/lib/functions";
import { IPackage } from "@/app/lib/interfaces/package";

const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey);

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const user = await User.findOne({ _id: session.user._id })
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })
        if (!user.stripeCustomerId) return NextResponse.json({ message: 'Stripe profile not found' }, { status: 404 })

        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: 'card',
        });

        const customer = await stripe.customers.retrieve(user.stripeCustomerId);

        if (customer.deleted) return NextResponse.json({ message: 'Customer profile has been deleted' }, { status: 400 })

        const defaultPaymentMethod = paymentMethods.data.find(pm => pm.id === customer.invoice_settings.default_payment_method)

        return NextResponse.json(defaultPaymentMethod)
    } catch (err) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}
