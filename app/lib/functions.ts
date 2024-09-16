import { MongooseError } from 'mongoose'
import * as Yup from 'yup'
import Stripe from "stripe";
import { IVideo } from './interfaces/video';
import { ICredit, IUser } from './interfaces/user';
import { IPurchase } from './interfaces/purchase';
import { Purchase, User, Video } from './models';
import mongoose from './mongodb';
import crypto from 'crypto'

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

function calculateCredits(userId: string): Promise<ICredit> {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(user)
            const user = await User.findOne({ _id: userId })
            if (!user) return reject('User not found')

            var playerIds = [userId]
            if (['trainer', 'staff'].includes(user.role)) {
                const players = await User.find({ 'roleData.trainerId': userId })
                playerIds = players.map(p => p._id.toString())
                // console.log('playerIds', playerIds)
            }

            const videos = await Video.find({ userId: { $in: playerIds } })
            // console.log(videos)
            const purchases = await Purchase.find({ userId: userId })
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
                if (video.uploadedBy?.toString() === userId?.toString()) {
                    if ([undefined, 0, 1].includes(video.assessmentDetails?.statusCode))
                        credits.used += 1
                }
            })
            credits.remaining = credits.purchased - credits.used
            // console.log('calculateCredits', credits)
            return resolve(credits)
        } catch (err) {
            reject(err)
        }
    })
}

function calculatePlayerMetrics(playerId: string) {
    return new Promise(async (resolve, reject) => {
        try {
            const player = await User.findOne({ _id: playerId })
            if (!player) return reject('Player not found')

            const videos = await Video.find({ userId: playerId })


        } catch (err) {
            reject(err)
        }
    })
}

export {
    validateError,
    calculateCredits,
    calculatePlayerMetrics,
}