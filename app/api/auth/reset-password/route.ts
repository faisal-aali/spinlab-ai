import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "../../../lib/db";
import util from 'util'

const query = util.promisify(db.query).bind(db);

export async function POST(request: NextRequest) {
  try {
    const { email, token, newPassword, confirmNewPassword } =
      await request.json();

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }
    const queryResult = await query(
      `
      SELECT * FROM users 
      WHERE email = ?
    `,
      [email]
    );

    if (queryResult.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = queryResult[0];
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(newPassword, salt, 1000, 64, "sha512")
      .toString("hex");
    const updateResult = await query(
      `
      UPDATE users 
      SET password = ?
      WHERE email = ?
    `,
      [newPassword, email]
    );
    console.log("Update result:", updateResult);
    return NextResponse.json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
