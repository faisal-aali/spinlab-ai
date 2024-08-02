import { NextRequest, NextResponse } from "next/server";
import { Video } from "@/app/lib/models";
import { validateError } from "@/app/lib/functions";
import _3Motion from "@/app/lib/3motion";
import axios from 'axios'

export async function POST(req: NextRequest) {
    try {
        console.log('[/api/3motion/webhook] called')
        const data = await req.json()

        console.log('[/api/3motion/webhook] data', data)
        if (!data.TenantId || !data.TaskId) {
            console.log('[/api/3motion/webhook] Invalid Request')
            return NextResponse.json({ message: `Invalid Request` }, { status: 400 })
        }

        const auth = _3Motion.getAuth()
        if (!auth) {
            console.log('[/api/3motion/webhook] INTERNAL ERROR')
            return NextResponse.json({ message: `INTERNAL ERROR` }, { status: 500 })
        }
        if (auth.tenantId !== data.TenantId) {
            console.log('[/api/3motion/webhook] Invalid TenantId')
            return NextResponse.json({ message: `Invalid TenantId` }, { status: 404 })
        }

        const video = await Video.findOne({ taskId: data.TaskId })
        if (!video) {
            console.log('[/api/3motion/webhook] Invalid TaskId')
            return NextResponse.json({ message: `Invalid TaskId` }, { status: 404 })
        }

        const assessmentDetails = await _3Motion.getAssessmentDetails({ taskId: video.taskId, taskType: video.taskType });
        assessmentDetails.stats = await axios.get(assessmentDetails.dataJsonUrl).then(res => res.data);

        video.assessmentDetails = assessmentDetails as object

        await video.save()

        console.log('[/api/3motion/webhook] assessmentDetails updated')

        return NextResponse.json({ message: `OK` }, { status: 200 })
    } catch (err: unknown) {
        console.error('[/api/3motion/webhook] error:', err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}