import { NextRequest, NextResponse } from "next/server";
import { User, Subscription, Package, Video, Purchase } from "@/app/lib/models";
import * as Yup from 'yup'
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "@/app/lib/sendEmail";
import { calculateCredits, validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "@/app/lib/mongodb";

export async function GET(req: NextRequest) {
    await Video.deleteMany({ taskType: 'hit' })
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')
    const role = searchParams.get('role')
    const trainerId = searchParams.get('trainerId')
    const includeMetrics = Number(searchParams.get('includeMetrics'));

    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const query: { isDeleted: boolean, role?: string, _id?: mongoose.Types.ObjectId, 'roleData.trainerId'?: mongoose.Types.ObjectId } = {
            isDeleted: false
        };

        if (id) query._id = new mongoose.Types.ObjectId(id);
        if (role) query.role = role;
        if (trainerId) query['roleData.trainerId'] = new mongoose.Types.ObjectId(trainerId);

        // const users = await User.find(query).populate('subscription')

        const users = await User.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'subscriptions', // The name of the subscription collection
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'subscription'
                }
            },
            {
                $unwind: {
                    path: '$subscription',
                    preserveNullAndEmptyArrays: true // If you want to include users with no subscription
                }
            },
            {
                $lookup: {
                    from: 'packages', // Join with the packages collection
                    localField: 'subscription.packageId', // Field from the subscription
                    foreignField: '_id', // Field from the package
                    as: 'subscription.package' // Output field
                }
            },
            {
                $unwind: {
                    path: '$subscription.package',
                    preserveNullAndEmptyArrays: true // Include subscriptions with no package
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    let: { userRole: '$role' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$plan', 'free'] }, // Assuming 'Free' is the default package name
                                        { $eq: ['$role', '$$userRole'] } // Match the role with the user's role
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'freePackage'
                }
            },
            {
                $addFields: {
                    'subscription.package': {
                        $ifNull: ['$subscription.package', { $arrayElemAt: ['$freePackage', 0] }] // Use subscription package or default package
                    },
                    'subscription.freePackage': { $arrayElemAt: ['$freePackage', 0] },
                }
            },
            {
                $project: {
                    freePackage: 0
                }
            }
        ]);

        await Promise.all(users.map((user) => (
            calculateCredits(user._id).then(credits => {
                user.credits = credits
            })
        )))

        if (includeMetrics) {
            await Promise.all(users.map((user) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const videos = await Video.find({ userId: user._id, 'assessmentDetails.statusCode': 1 }, { assessmentDetails: { stats: { ARR: 0, ANG: 0, VEL: 0 } } })
                        if (videos.length === 0) user.metrics = {}
                        else user.metrics = videos.reduce((max, video) => video.assessmentDetails?.stats?.performance?.score3[0] > max.assessmentDetails?.stats?.performance?.score3[0] ? video : max).assessmentDetails
                        console.log(user.metrics)
                        resolve(true)
                    } catch (err) {
                        reject(err)
                    }
                })
            }))
        }

        return NextResponse.json(users)
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}