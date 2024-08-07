import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/lib/models";
import * as Yup from 'yup'
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "@/app/lib/sendEmail";
import { validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import mongoose from "@/app/lib/mongodb";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id')

        const query: { role: string, isDeleted: boolean, _id?: string } = {
            role: 'player',
            isDeleted: false
        };

        if (id) query._id = id;

        const users = await User.find(query)
        return NextResponse.json(users)
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}

export async function POST(req: NextRequest) {
    try {

        const data = await req.json()

        const schema = Yup.object({
            email: Yup.string().email('Email must be valid').required("Email is required"),
            password: Yup.string().min(8, "Password must be at least 8 characters").optional(),
            name: Yup.string().required("Name is required"),
            avatarUrl: Yup.string().optional(),
            height: Yup.number().min(1).optional(),
            weight: Yup.number().min(1).optional(),
            handedness: Yup.string().oneOf(['left', 'right']).optional(),
            city: Yup.string().optional(),
            country: Yup.string().optional(),
            emailVerified: Yup.boolean().optional(),
        });

        await schema.validate(data)

        const randomPassword = data.password ? undefined : crypto.randomBytes(4).toString("hex");

        const dups = await User.find({ email: data.email })
        if (dups.length > 0) return NextResponse.json({ message: 'The email has already been registered.' }, { status: 400 })

        let trainerId = null
        const session = await getServerSession(authOption);
        if (session && session.user && ['trainer', 'staff'].includes(session.user.role)) trainerId = new mongoose.Types.ObjectId(session.user._id)

        const user = await User.create({
            email: data.email,
            password: bcrypt.hashSync((data.password || randomPassword), process.env.BCRYPT_SALT as string),
            name: data.name,
            avatarUrl: data.avatarUrl,
            city: data.city,
            country: data.country,
            emailVerified: data.emailVerified,
            role: 'player',
            roleData: {
                age: null,
                height: data.height || null,
                weight: data.weight || null,
                handedness: data.handedness || null,
                anonymous: false,
                trainerId: trainerId
            }
        })

        if (randomPassword && !trainerId) {
            sendEmail({
                to: data.email,
                subject: 'Welcome to SpinLab',
                html: `
                    <p>Hello, ${data.name}!</p>
                    <p>Please use the following credentials to login to the dashboard</p>
                    <p>Email: ${data.email}</p>
                    <p>Password: ${randomPassword}</p>
                `
            }).catch(console.error)
        }

        return NextResponse.json({ message: `Player has been created with id ${user._id}` }, { status: 200 })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}