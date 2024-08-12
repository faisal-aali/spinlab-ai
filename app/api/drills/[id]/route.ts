import { NextRequest, NextResponse } from "next/server";
import { Category, Drill } from "@/app/lib/models";
import * as Yup from 'yup'
import { validateError } from "@/app/lib/functions";
import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user || session.user.role !== 'admin') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { pathname } = new URL(req.url);
        const id = pathname.split('/').pop(); // /api/drills/:id
        if (!id) return NextResponse.json({ message: 'id is required' }, { status: 400 })

        const drill = await Drill.findOne({ _id: id })
        if (!drill) return NextResponse.json({ message: 'Invalid drill Id' }, { status: 404 });

        const data = await req.json()

        const schema = Yup.object({
            categoryId: Yup.string().optional(),
            videoLink: Yup.string().optional(),
            title: Yup.string().optional(),
            description: Yup.string().optional(),
            isFree: Yup.boolean().optional(),
        });

        await schema.validate(data)

        if (Object.keys(data).length == 0) return NextResponse.json({ message: 'BAD REQUEST' }, { status: 400 })

        if (data.categoryId) {
            const category = await Category.findOne({ _id: data.categoryId })
            if (!category) return NextResponse.json({ message: 'Invalid category Id' }, { status: 400 });
        }

        drill.categoryId = (data.categoryId || drill.categoryId);
        drill.videoLink = (data.videoLink || drill.videoLink);
        drill.title = (data.title || drill.title);
        drill.description = (data.description || drill.description);
        drill.isFree = (data.isFree !== undefined ? data.isFree : drill.isFree);

        await drill.save()

        return NextResponse.json({ message: `drill has been updated` }, { status: 200 })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user || session.user.role !== 'admin') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { pathname } = new URL(req.url);
        const id = pathname.split('/').pop(); // /api/drills/:id
        if (!id) return NextResponse.json({ message: 'id is required' }, { status: 400 })

        const drill = await Drill.findOne({ _id: id })
        if (!drill) return NextResponse.json({ message: 'Invalid drill Id' }, { status: 404 });

        await drill.deleteOne()

        return NextResponse.json({ message: 'drill has been deleted' }, { status: 200 })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}