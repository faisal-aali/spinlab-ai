import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "../../../../util/db";

export async function POST(request:NextRequest) {
  try {
    const { email, token, newPassword, confirmNewPassword } = await request.json();

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    // Fetch the user with the given email
    const queryResult = await db.query(`
      SELECT * FROM users 
      WHERE email = ?
    `, [email]);

    if (queryResult.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = queryResult[0];

    // For simplicity, assume the user exists and proceed with the password reset logic

    // Generate a salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash the new password with the salt
    const hashedPassword = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512').toString('hex');

    // Update the password in the database
    const updateResult = await db.query(`
      UPDATE users 
      SET password = ? , confirmPassword = ?
      WHERE email = ?
    `, [newPassword, newPassword, email]);

    console.log("Update result:", updateResult);

    return NextResponse.json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
