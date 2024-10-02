import { MongooseError } from 'mongoose'
import * as Yup from 'yup'
import Stripe from "stripe";
import { IVideo } from './interfaces/video';
import { ICredit, IUser } from './interfaces/user';
import { IPurchase } from './interfaces/purchase';
import { Purchase, User, Video } from './models';
import mongoose from './mongodb';
import crypto from 'crypto'
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

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

async function extractVideoFramerate(video: File): Promise<number> {
    return new Promise(async (resolve, reject) => {
        try {
            // Convert the file to a buffer
            const videoBuffer = Buffer.from(await video.arrayBuffer())

            // Create a PassThrough stream from the buffer
            const stream = new PassThrough();
            stream.end(videoBuffer);

            // Extract video metadata and calculate the framerate
            ffmpeg(stream)
                .ffprobe((err, metadata) => {
                    if (err) {
                        console.error('Error reading video metadata:', err);
                        throw new Error('Error: Unable to read video metadata')
                    }

                    const videoStream = metadata.streams.find((stream) => stream.codec_type === 'video');

                    if (!videoStream) throw new Error('Error: No video stream found')
                    if (!videoStream.avg_frame_rate) throw new Error('Error: Failed to determine fps')
                    return resolve(eval(videoStream.avg_frame_rate))
                    // videoStream.frame
                    // const frameCount = videoStream.nb_frames ? parseInt(videoStream.nb_frames, 10) : null;
                    // const duration = videoStream.duration ? parseFloat(videoStream.duration) : null;

                    // if (frameCount && duration) {
                    //     const calculatedFramerate = frameCount / duration;
                    //     console.log(`Calculated Framerate: ${calculatedFramerate} fps`);

                    //     // Respond with the calculated framerate
                    //     Promise.resolve(calculatedFramerate)
                    // } else {
                    //     throw new Error('Unable to determine framerate')
                    // }
                });
        } catch (err) {
            return reject(err)
        }
    })
}

export {
    validateError,
    calculateCredits,
    calculatePlayerMetrics,
    extractVideoFramerate
}