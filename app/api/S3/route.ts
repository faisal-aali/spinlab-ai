import { NextRequest, NextResponse } from "next/server";
import { Category, Drill, User } from "@/app/lib/models";
import * as Yup from 'yup'
import { validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { listS3Buckets } from "@/app/lib/aws";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const formData = await req.formData()
        const file = formData.get('file')
        if (!file) return NextResponse.json({ message: 'File is required' }, { status: 400 });

        // const user = await User.findOne({ _id: data.userId })
        // if (!user) return NextResponse.json({ message: 'Invalid user Id' }, { status: 400 });


        const data = await listS3Buckets();
        console.log('S3 Buckets:', data.Buckets);

        // const drill = await Drill.create({
        //     userId: session.user._id,
        //     categoryId: data.categoryId,
        //     videoLink: data.videoLink,
        //     title: data.title,
        //     isFree: data.isFree,
        // })

        // return NextResponse.json({ message: `Drill has been created with id ${drill._id}` }, { status: 200 })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}