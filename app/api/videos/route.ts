import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";
import { validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User, Video } from "@/app/lib/models";
import _3Motion from "@/app/lib/3motion";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const userId = searchParams.get('userId');

        const query: { _id?: string, userId?: string } = {};

        if (id) query._id = id;
        if (userId) query.userId = userId;

        const videos = await Video.find(query, { assessmentDetails: { stats: 0 } });
        return NextResponse.json(videos);
    } catch (err: unknown) {
        console.error(err);
        const obj = validateError(err);
        return NextResponse.json({ message: obj.message }, { status: obj.status });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user || session.user.role !== 'player') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const formData = await req.formData();

        const uploadfile = formData.get('file') as File
        if (!uploadfile) return NextResponse.json({ message: 'File is required' }, { status: 400 });

        const user = await User.findOne({ _id: session.user._id })
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
        if (!user.roleData.weight || !user.roleData.height) return NextResponse.json({ message: 'Weight and height is required' }, { status: 400 });

        const height = Math.round(user.roleData.height)
        const weight = Math.round(user.roleData.weight)
        const taskType = "hit"

        const task = await _3Motion.createAssessment({
            height,
            weight,
            taskType,
            uploadfile,
        })

        const newVideo = await Video.create({
            userId: session.user._id,
            taskId: task.assessmentId,
            assessmentMappingId: task.assessmentMappingId,
            taskType: taskType,
            deliveryDate: new Date().getTime() + 600000,
        });

        return NextResponse.json({ message: `Video has been queued with id ${newVideo._id}` }, { status: 200 });
    } catch (err: unknown) {
        console.error(err);
        const obj = validateError(err);
        return NextResponse.json({ message: obj.message }, { status: obj.status });
    }
}
