import { NextRequest, NextResponse } from "next/server";
import { Category, Drill, User } from "@/app/lib/models";
import * as Yup from 'yup'
import { validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id')

        const query: { _id?: string } = {};

        if (id) query._id = id;

        const drill = await Drill.find(query)
        return NextResponse.json(drill)
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user || session.user.role !== 'admin') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const data = await req.json()

        const schema = Yup.object({
            // userId: Yup.string().required("User Id is required"),
            categoryId: Yup.string().required("Category Id is required"),
            videoLink: Yup.string().required("Video Link is required"),
            title: Yup.string().required("Title is required"),
            isFree: Yup.boolean().required("isFree is required"),
        });

        await schema.validate(data)

        const category = await Category.findOne({ _id: data.categoryId })
        if (!category) return NextResponse.json({ message: 'Invalid category Id' }, { status: 400 });

        // const user = await User.findOne({ _id: data.userId })
        // if (!user) return NextResponse.json({ message: 'Invalid user Id' }, { status: 400 });

        const drill = await Drill.create({
            userId: session.user._id,
            categoryId: data.categoryId,
            videoLink: data.videoLink,
            title: data.title,
            isFree: data.isFree,
        })

        return NextResponse.json({ message: `Drill has been created with id ${drill._id}` }, { status: 200 })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}