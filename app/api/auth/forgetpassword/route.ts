import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import crypto from "crypto";
// import db from "../../../lib/db";
import util from 'util'

// const query = util.promisify(db.query).bind(db);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log("Received email for password reset:", email);
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = Date.now() + 3600000;
    // await query(`
    //   UPDATE users 
    //   SET resetPasswordToken='${token}', resetPasswordExpires=${expiration}
    //   WHERE email='${email}'
    // `);
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
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    };


    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
