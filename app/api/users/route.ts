import { NextRequest, NextResponse } from "next/server";
import { User, Subscription, Package } from "@/app/lib/models";
import * as Yup from 'yup'
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "@/app/lib/sendEmail";
import { validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "@/app/lib/mongodb";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')
    const role = searchParams.get('role')

    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const query: { isDeleted: boolean, role?: string, _id?: mongoose.Types.ObjectId } = {
            isDeleted: false
        };

        if (id) query._id = new mongoose.Types.ObjectId(id);
        if (role) query.role = role;

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

        return NextResponse.json(users)
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}