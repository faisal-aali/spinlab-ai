import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authOption } from "../../auth/[...nextauth]/route";
import { Package, Subscription, User } from "@/app/lib/models";
import { createCustomer, handlePaymentSuccess, updateCustomer } from "@/app/lib/stripe";
import { validateError } from "@/app/lib/functions";
import { IPackage } from "@/app/lib/interfaces/package";

const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey);

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user || !['player', 'trainer'].includes(session.user.role)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const user = await User.findOne({ _id: session.user._id })
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const { paymentMethodId, credits } = await req.json();
        if (!paymentMethodId || !credits) return NextResponse.json({ message: "Invalid request" }, { status: 400 });

        let _package: IPackage | null;
        const subscription = await Subscription.findOne({ userId: user._id, status: 'active' })
        if (!subscription) _package = await Package.findOne({ name: 'Free', role: user.role })
        else _package = await Package.findOne({ _id: subscription.packageId })

        if (!_package) return NextResponse.json({ message: "Could not find the package" }, { status: 500 });

        console.log('_package', _package)

        let customer;
        if (!user.stripeCustomerId) customer = await createCustomer({ user, paymentMethodId })
        else customer = await updateCustomer({ user, paymentMethodId })

        const paymentIntent = await stripe.paymentIntents.create({
            amount: (credits * _package.amountPerCredit), // Amount in cents
            currency: 'usd',
            payment_method: paymentMethodId,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            confirm: true,
            customer: customer.id,
            metadata: {
                userId: user._id.toString(),
                credits
            }
        });

        if (paymentIntent.status === 'requires_action') {
            return NextResponse.json({
                requiresAction: true,
                paymentIntentClientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            });
        } else if (paymentIntent.status === 'succeeded') {
            // await handlePaymentSuccess({ paymentIntent });
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ message: "Payment failed. Please try again." }, { status: 500 });
        }

    } catch (err) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}
