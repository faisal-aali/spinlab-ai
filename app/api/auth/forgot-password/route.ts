import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import crypto from "crypto";
// import db from "../../../lib/db";
import util from 'util'
import { ResetToken, User } from "@/app/lib/models";
import * as Yup from 'yup'

// const query = util.promisify(db.query).bind(db);

export async function POST(req: NextRequest) {
  const schema = Yup.object({
    email: Yup.string().email().required("Email is required"),
  });

  const data = await req.json();

  try {
    await schema.validate(data)
  } catch (err) {
    console.error(err)
    return new NextResponse(JSON.stringify({ error: err }), { status: 400 });
  }

  const { email } = data
  console.log("Received email for password reset:", email);
  const token = crypto.randomBytes(32).toString("hex");
  const expiration = new Date().getTime() + 3600000;

  return User.findOne({ email }).then(async user => {

    return ResetToken.create({
      token,
      expiration,
      user_id: user?._id
    }).then(async () => {

      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      const resetUrl = `${process.env.LOCALHOST_URL}/reset-password?token=${token}&email=${email}`;
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Password Reset",
        html: `
            <p>You are receiving this email because you (or someone else) have requested a password reset.</p>
            <p>Please click on the following link to reset your password:</p>
            <p><a href="${resetUrl}" target="_blank" rel="noopener noreferrer">Reset Password</a></p>
            <p>If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
          `,
      };

      return transporter.sendMail(mailOptions).then(() => {
        return NextResponse.json({ message: "Password reset email sent" });
      }).catch(err => {
        console.error(err)
        return NextResponse.json({ message: "An error occurred:" }, { status: 500 });
      })

    }).catch(err => {
      console.error(err)
      return NextResponse.json({ message: "An error occurred:" }, { status: 500 });
    })

  }).catch(err => {
    console.error(err)
    return NextResponse.json({ message: "An error occurred:" }, { status: 500 });
  })
}
