import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
// import db from "../../../lib/db";
import util from 'util'
import { ResetToken, User } from "@/app/lib/models";
import { getServerSession } from "next-auth";
import { authOption } from "../[...nextauth]/route";
import * as Yup from 'yup'
// const query = util.promisify(db.query).bind(db);

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOption);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const schema = Yup.object({
    currentPassword: Yup.string().required("Old Password is required").min(8, "Password must be at least 8 characters"),
    newPassword: Yup.string().required("New Password is required").min(8, "Password must be at least 8 characters"),
  });

  try {
    const data = await req.json();

    await schema.validate(data)

    const { currentPassword, newPassword } = data

    if (currentPassword === newPassword)
      return NextResponse.json({ message: 'Old password cannot be the same as new password' }, { status: 400 })

    const user = await User.findById(session.user._id)

    if (bcrypt.hashSync(currentPassword, process.env.BCRYPT_SALT as string) !== user?.password) {
      return NextResponse.json({ message: 'Old password is incorrect' }, { status: 400 })
    }

    user.password = bcrypt.hashSync(newPassword, process.env.BCRYPT_SALT as string)

    await user.save()

    return NextResponse.json({ message: 'Password has been changed.' })

  } catch (err: unknown) {
    console.error(err)
    if (err instanceof Yup.ValidationError) {
      return NextResponse.json({ message: err.message }, { status: 400 })
    }
    return NextResponse.json({ message: err }, { status: 500 })
  }
}
