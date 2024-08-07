import Stripe from "stripe";
import { IUser } from "./interfaces/user";
import { Package, Purchase, Subscription, User } from "./models";

const stripeSecretKey: string = process.env.STRIPE_SECRET_KEY || "";

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
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: user.stripeCustomerId as string,
            });

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
            console.log('handleSubscriptionSuccess', subscription)
            const user = await User.findOne({ stripeCustomerId: subscription.customer as string })
            if (!user) return reject({ message: 'Customer not found' })

            const _package = await Package.findOne({ _id: subscription.metadata.packageId as string })
            if (!_package) return reject({ message: 'Package not found' })

            const plan = subscription.items.data[0].plan

            const db_subscription = await Subscription.findOne({ userId: user._id })

            if (!db_subscription) {
                await Subscription.create({
                    userId: user._id,
                    amount: plan.amount,
                    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
                    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
                    packageId: _package._id,
                    status: subscription.status,
                    stripeSubscriptionId: subscription.id,
                })
            } else {
                db_subscription.history = [...db_subscription.history, {
                    amount: db_subscription.amount,
                    currentPeriodStart: db_subscription.currentPeriodStart,
                    currentPeriodEnd: db_subscription.currentPeriodEnd,
                    packageId: db_subscription.packageId,
                    status: db_subscription.status,
                    stripeSubscriptionId: db_subscription.stripeSubscriptionId,
                    lastUpdated: db_subscription.lastUpdated,
                }];
                db_subscription.amount = plan.amount as number;
                db_subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
                db_subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
                db_subscription.lastUpdated = new Date();
                db_subscription.packageId = _package._id;
                db_subscription.status = subscription.status;
                db_subscription.stripeSubscriptionId = subscription.id;

                await db_subscription.save()
            }

            if (_package.throwsPerMonth) {
                await Purchase.create({
                    userId: user._id,
                    stripeSubscriptionId: subscription.id,
                    credits: _package.throwsPerMonth,
                    type: 'subscription',
                })
            }

            resolve()
        } catch (err) {
            reject(err)
        }
    })
}

async function handleSubscriptionCancel({ userId }: { userId: string }): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const subscription = await Subscription.findOne({ userId })
            if (!subscription) return reject('Subscription not found')

            subscription.status = 'canceled'
            subscription.lastUpdated = new Date();
            await subscription.save()

            await Purchase.updateMany({ stripeSubscriptionId: subscription.stripeSubscriptionId }, {
                isForfeited: true,
                forfeitReason: 'Subscription cancelled'
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
    handleSubscriptionCancel,
    handlePaymentSuccess
}