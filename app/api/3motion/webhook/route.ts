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
            console.log('[/api/3motion/webhook] Auth token not found')
            return NextResponse.json({ message: `INTERNAL ERROR` }, { status: 500 })
        }
        if (auth.tenantId !== data.TenantId) {
            console.log('[/api/3motion/webhook] Invalid TenantId')
            return NextResponse.json({ message: `Invalid TenantId` }, { status: 404 })
        }

        const video = await Video.findOne({
            $or: [{
                taskId: data.TaskId.toString()
            }, {
                assessmentMappingId: data.TaskId.toString()
            }]
        })
        if (!video) {
            console.log('[/api/3motion/webhook] Invalid TaskId')
            return NextResponse.json({ message: `Invalid TaskId` }, { status: 404 })
        }

        const assessmentDetails = await _3Motion.getAssessmentDetails({ taskId: video.taskId, taskType: video.taskType });

        console.log('[/api/3motion/webhook] assessmentDetails', assessmentDetails)

        if (assessmentDetails) {
            if (assessmentDetails.dataJsonUrl) {
                assessmentDetails.stats = await axios.get(assessmentDetails.dataJsonUrl).then(res => res.data);
            } else {
                console.log('[/api/3motion/webhook] dataJsonUrl is empty')
            }

            video.assessmentDetails = assessmentDetails
        } else {
            video.assessmentDetails = data
        }

        await video.save()

        console.log('[/api/3motion/webhook] assessmentDetails updated')

        return NextResponse.json({ message: `OK` }, { status: 200 })
    } catch (err: unknown) {
        console.error('[/api/3motion/webhook] error:', err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}

// update pending assessment every one hour
setInterval(() => {
    updateAssessments()
}, 3600000);

const updateAssessments = async () => {
    const videos = await Video.find({}, { assessmentDetails: { stats: { ARR: 0, ANG: 0, VEL: 0 } } });
    videos.forEach(async video => {
        if (video.assessmentDetails.statusCode) return
        console.log('updating assessment details for', video.taskId)
        const assessmentDetails = await _3Motion.getAssessmentDetails({ taskId: video.taskId, taskType: video.taskType });

        if (!assessmentDetails) return console.error('Invalid response for for', video.taskId)

        if (assessmentDetails.dataJsonUrl) {
            assessmentDetails.stats = await axios.get(assessmentDetails.dataJsonUrl).then(res => res.data);
        }

        video.assessmentDetails = assessmentDetails

        await video.save()

        console.log('updated assessment details for', video.taskId)
    })
}