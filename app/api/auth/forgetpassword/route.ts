import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import crypto from "crypto";
import db from "../../../../util/db";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log("Received email for password reset:", email);
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = Date.now() + 3600000;
    await db.query(`
      UPDATE users 
      SET resetPasswordToken='${token}', resetPasswordExpires=${expiration}
      WHERE email='${email}'
    `);
    const transporter = createTransport({
      host: "smtp.ethereal.email", 
      port: 587,
      auth: {
        user: "morgan31@ethereal.email",
        pass: "aggUGt5g8hq9uCZUwr",
      },
    });
    const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${email}`;
    const mailOptions = {
      from: "morgan31@ethereal.email", 
      to: email,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) have requested a password reset. Please click on the following link, or paste this into your browser to complete the process: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
