import { MongooseError } from 'mongoose'
import * as Yup from 'yup'
import Stripe from "stripe";
import { IVideo } from './interfaces/video';
import { IUser } from './interfaces/user';
import { IPurchase } from './interfaces/purchase';
import { Purchase, Video } from './models';

function validateError(err: any) {
    if (err instanceof Yup.ValidationError) {
        return { message: err.message, status: 400 }
    }
    if (err instanceof SyntaxError) {
        return { message: err.message, status: 400 }
    }
    if (err instanceof MongooseError) {
        return { message: err.message, status: 400 }
    }
    if (err instanceof Stripe.errors.StripeCardError) {
        return { message: err.message, status: 400 }
    }
    return { message: err?.message || 'Error occured', status: 500 }
}

function calculateCredits({ user }: { user: IUser }) {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(user)
            const videos = await Video.find({ userId: user._id })
            // console.log(videos)
            const purchases = await Purchase.find({ userId: user._id })
            var credits = {
                purchased: 0,
                used: 0,
                remaining: 0
            };
            purchases.forEach(purchase => {
                if (purchase.isForfeited || new Date(purchase.activateAfter).getTime() > new Date().getTime())
                    return
                credits.purchased += purchase.credits
            })
            videos.forEach(video => {
                credits.used += 1
            })
            credits.remaining = credits.purchased - credits.used
            console.log('calculateCredits', credits)
            return resolve(credits)
        } catch (err) {
            reject(err)
        }
    })
}

export {
    validateError,
    calculateCredits
}