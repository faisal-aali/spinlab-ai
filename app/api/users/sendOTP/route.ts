import { NextRequest, NextResponse } from "next/server";
// import db from "../../../lib/db";
import { User } from "@/app/lib/models";
import * as Yup from 'yup'
import { validateError } from "@/app/lib/functions";
import { generateOtp } from "@/app/lib/otps";
import { getServerSession } from "next-auth";
import { sendEmail } from "@/app/lib/sendEmail";

// const query = util.promisify(db.query).bind(db);

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()

        const schema = Yup.object({
            email: Yup.string().email('Email must be valid').required("Email is required"),
            receiverEmail: Yup.string().email('Receiver Email must be valid').optional(),
        });

        await schema.validate(data)

        const user = await User.findOne({ email: data.email })
        if (!user) return NextResponse.json({ message: `The email is not registered` }, { status: 404 })

        const code = generateOtp(user._id)

        console.log('/users/sendOTP code:', code)

        await sendEmail({
            to: data.receiverEmail || data.email,
            subject: 'SpinLab Verification Code',
            html: `
                <p>Hello, ${data.name}!</p>
                <p>Please enter the following code on the website. This code will expire in 15 minutes.</p>
                <p>Code: ${code}</p>
            `
        })

        return NextResponse.json({ message: `Code has been sent on the email` }, { status: 200 })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}
