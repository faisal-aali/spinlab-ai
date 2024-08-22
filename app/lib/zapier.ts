import axios from 'axios'
import { Package, Subscription, User } from './models'

const ZAPIER_WEBHOOK_ACCOUNT_CREATION = process.env.ZAPIER_WEBHOOK_ACCOUNT_CREATION || ""
const ZAPIER_WEBHOOK_SUBSCRIPTION_UPDATE = process.env.ZAPIER_WEBHOOK_SUBSCRIPTION_UPDATE || ""

async function getUserObject(userId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: userId }, { password: 0 })
            if (!user) return reject({ message: 'User not found' })

            if (user.role !== 'player' && user.role !== 'trainer') return reject({ message: 'User role is unsupported' })

            const subscription = await Subscription.findOne({ userId: user._id }, { history: 0 })

            const packageQuery: { _id?: string, role?: string, plan?: string } = {}
            if (subscription && subscription.status === 'active') {
                packageQuery._id = subscription.packageId
            } else {
                packageQuery.role = user.role;
                packageQuery.plan = 'free'
            }

            const _package = await Package.findOne(packageQuery)
            if (!_package) return reject({ message: 'Unable to find package' })

            resolve({
                ...user.toObject(),
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ')[1] || '',
                subscription: {
                    ...subscription?.toObject(),
                    package: _package.toObject()
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}

async function PostAccountCreation(userId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await getUserObject(userId)
            console.log('[Zapier] PostAccountCreation', user)
            axios.post(ZAPIER_WEBHOOK_ACCOUNT_CREATION, user).then(() => resolve({ message: 'Success' })).catch(reject)
        } catch (err) {
            reject(err)
        }
    })
}

async function PostSubscriptionUpdate(userId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await getUserObject(userId)
            console.log('[Zapier] PostSubscriptionUpdate', user)
            axios.post(ZAPIER_WEBHOOK_SUBSCRIPTION_UPDATE, user).then(() => resolve({ message: 'Success' })).catch(reject)
        } catch (err) {
            reject(err)
        }
    })
}

export {
    PostAccountCreation,
    PostSubscriptionUpdate
}