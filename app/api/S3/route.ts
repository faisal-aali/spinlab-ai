import { NextRequest, NextResponse } from "next/server";
import { Category, Drill, User } from "@/app/lib/models";
import * as Yup from 'yup'
import { validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { uploadFileToS3 } from "@/app/lib/aws";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const formData = await req.formData()
        const file = formData.get('file')
        if (!file) return NextResponse.json({ message: 'File is required' }, { status: 400 });

        console.log('file', file)
        const url = await uploadFileToS3(file, (file as File).name)

        return NextResponse.json({ url }, { status: 200 })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}