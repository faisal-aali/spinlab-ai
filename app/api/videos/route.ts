import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";
import { validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Video } from "@/app/lib/models";
import { Terminal } from "@mui/icons-material";

 
const videoSchema = Yup.object({
    videoUrl: Yup.string().required("Video URL is required"),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const userId = searchParams.get('userId');

        const query: { _id?: string , userId?: string } = {};

        if (id) query._id = id;
        if (userId) query.userId = userId;

        const videos = await Video.find(query);
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
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        
        await videoSchema.validate(data);

        const taskType = "hit"
        // const task = createAssesment();

        const newVideo = await Video.create({
            userId: session.user._id,
            // taskId: task.assesmentId,
            taskType: taskType,
            deliveryDate: new Date().getTime()+600000,
        });

        return NextResponse.json({ message: `Video has been queued with id ${newVideo._id}` }, { status: 200 });
    } catch (err: unknown) {
        console.error(err);
        const obj = validateError(err);
        return NextResponse.json({ message: obj.message }, { status: obj.status });
    }
}
