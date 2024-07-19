import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
// import db from "../../../lib/db";
import util from 'util'
import { ResetToken, User } from "@/app/lib/models";
import * as Yup from 'yup'
// const query = util.promisify(db.query).bind(db);

export async function POST(req: NextRequest) {
  try {
    const schema = Yup.object({
      token: Yup.string().required("Token is required"),
      password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
    });

    const data = await req.json();

    await schema.validate(data)

    const { token, password } = data;

    return ResetToken.findOne({ token }).then(resetToken => {
      if (!resetToken) return NextResponse.json({ message: 'Invalid token' }, { status: 400 });

      if ((resetToken.expiration as number) <= new Date().getTime())
        return NextResponse.json({ message: "This token has expired" }, { status: 400 });

      return User.findOne({ _id: resetToken?.user_id }).then((user) => {
        if (!user) return NextResponse.json({ message: 'User does not exist' }, { status: 404 });

        user.password = bcrypt.hashSync(password, process.env.BCRYPT_SALT as string)

        return user.save().then(() => {
          ResetToken.findByIdAndDelete(resetToken._id).catch(err => console.error('error deleting resetToken document', err))
          return NextResponse.json({ message: "Password has been reset" });
        })
      })
    })
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(error, { status: 500 });
  }
}
