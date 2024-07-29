import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/lib/models";
import * as Yup from 'yup'
import crypto from "crypto";
import { validateError } from "@/app/lib/functions";
import { authOption } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { pathname } = new URL(req.url);
        const id = pathname.split('/').pop(); // /api/trainers/:id
        if (!id) return NextResponse.json({ message: 'id is required' }, { status: 400 })

        if (session.user.role !== 'admin' && id !== session.user._id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const user = await User.findOne({ _id: id, role: 'trainer', isDeleted: false })
        if (!user) return NextResponse.json({ message: 'Trainer does not exist' }, { status: 400 })

        const data = await req.json()

        const schema = Yup.object({
            avatarUrl: Yup.string().optional(),
            name: Yup.string().optional(),
            bio: Yup.string().optional(),
            city: Yup.string().optional(),
            country: Yup.string().optional(),
        });

        await schema.validate(data)

        if (Object.keys(data).length == 0) return NextResponse.json({ message: 'BAD REQUEST' }, { status: 400 })

        user.avatarUrl = (data.avatarUrl || user.avatarUrl);
        user.name = (data.name || user.name);
        user.bio = (data.bio || user.bio);
        user.city = (data.city || user.city);
        user.country = (data.country || user.country);

        await user.save()

        return NextResponse.json({ message: `Trainer has been updated` }, { status: 200 })
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
        const id = pathname.split('/').pop(); // /api/trainers/:id
        if (!id) return NextResponse.json({ message: 'id is required' }, { status: 400 })

        const user = await User.findOne({ _id: id, role: 'trainer', isDeleted: false })
        if (!user) return NextResponse.json({ message: 'Trainer does not exist' }, { status: 400 })

        user.email = `${crypto.randomBytes(8).toString('hex')}@random.com`
        user.isDeleted = true

        await user.save()

        return NextResponse.json({ message: 'Trainer has been deleted' }, { status: 200 })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}