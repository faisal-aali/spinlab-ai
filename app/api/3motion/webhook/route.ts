import { NextRequest, NextResponse } from "next/server";
import { Video } from "@/app/lib/models";
import { validateError } from "@/app/lib/functions";
import _3Motion from "@/app/lib/3motion";
import axios from 'axios'

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()

        if (!data.TenantId || !data.TaskId) return NextResponse.json({ message: `Invalid Request` }, { status: 400 })

        const auth = _3Motion.getAuth()
        if (!auth) return NextResponse.json({ message: `INTERNAL ERROR` }, { status: 500 })
        if (auth.tenantId !== data.TenantId) return NextResponse.json({ message: `Invalid TenantId` }, { status: 404 })

        const video = await Video.findOne({ taskId: data.TaskId })
        if (!video) return NextResponse.json({ message: `Invalid TaskId` }, { status: 404 })

        const assessmentDetails = await _3Motion.getAssessmentDetails({ taskId: video.taskId, taskType: video.taskType });
        assessmentDetails.stats = await axios.get(assessmentDetails.dataJsonUrl).then(res => res.data);

        video.assessmentDetails = assessmentDetails as object

        await video.save()

        return NextResponse.json({ message: `OK` }, { status: 200 })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}