import Stripe from "stripe";
import { IUser } from "./interfaces/user";
import { Purchase, Subscription, User } from "./models";

const stripeSecretKey: string = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "";

const stripe = new Stripe(stripeSecretKey, {});

async function createCustomer({ user, paymentMethodId }: { user: IUser, paymentMethodId: string }): Promise<Stripe.Response<Stripe.Customer>> {
    return new Promise(async (resolve, reject) => {
        try {
            const customer = await stripe.customers.create({
                payment_method: paymentMethodId,
                email: user.email,
                name: user.name,
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
            await User.updateOne({ _id: user._id }, { stripeCustomerId: customer.id })
            resolve(customer)
        } catch (err) {
            reject(err)
        }
    })
}

async function updateCustomer({ user, paymentMethodId }: { user: IUser, paymentMethodId: string }): Promise<Stripe.Response<Stripe.Customer>> {
    return new Promise(async (resolve, reject) => {
        try {
            const customer = await stripe.customers.update(user.stripeCustomerId as string, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
            resolve(customer)
        } catch (err) {
            reject(err)
        }
    })
}

async function handleSubscriptionSuccess({ subscription }: { subscription: Stripe.Subscription }): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ stripeCustomerId: subscription.customer as string })
            if (!user) return reject({ message: 'Customer not found' })

            const plan = subscription.items.data[0].plan
            await Subscription.create({
                userId: user._id,
                amount: plan.amount,
                currentPeriodStart: subscription.current_period_start,
                currentPeriodEnd: subscription.current_period_end,
                packageId: plan.id,
                status: subscription.status,
                stripeSubscriptionId: subscription.id,
            })
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

async function handlePaymentSuccess({ paymentIntent }: { paymentIntent: Stripe.PaymentIntent }): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: paymentIntent.metadata.userId as string })
            if (!user) return reject({ message: 'Customer not found' })

            await Purchase.create({
                userId: user._id,
                amount: paymentIntent.amount,
                credits: paymentIntent.metadata.credits,
                stripeIntentId: paymentIntent.id,
                type: 'purchase',
            })
            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

export {
    createCustomer,
    updateCustomer,
    handleSubscriptionSuccess,
    handlePaymentSuccess
}