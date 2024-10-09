import { NextRequest, NextResponse } from "next/server";
import { Notification, User, Video } from "@/app/lib/models";
import { validateError } from "@/app/lib/functions";
import _3Motion from "@/app/lib/3motion";
import axios from 'axios'
import { IVideo } from "@/app/lib/interfaces/video";
import { sendEmail } from "@/app/lib/sendEmail";
import { PostVideoUpload } from "@/app/lib/zapier";

export async function POST(req: NextRequest) {
    try {
        console.log(new Date(), '[/api/3motion/webhook] called')
        const data = await req.json()

        console.log(new Date(), '[/api/3motion/webhook] data', data)
        if (!data.TenantId || !data.TaskId) {
            console.log(new Date(), '[/api/3motion/webhook] Invalid Request')
            return NextResponse.json({ message: `Invalid Request` }, { status: 400 })
        }

        const auth = _3Motion.getAuth()
        if (!auth) {
            console.log(new Date(), '[/api/3motion/webhook] Auth token not found')
            return NextResponse.json({ message: `INTERNAL ERROR` }, { status: 500 })
        }
        if (auth.tenantId !== data.TenantId) {
            console.log(new Date(), '[/api/3motion/webhook] Invalid TenantId')
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
            console.log(new Date(), '[/api/3motion/webhook] Invalid TaskId')
            return NextResponse.json({ message: `Invalid TaskId` }, { status: 404 })
        }

        const assessmentDetails = await _3Motion.getAssessmentDetails({ taskId: video.taskId, taskType: video.taskType });

        console.log(new Date(), '[/api/3motion/webhook] assessmentDetails', assessmentDetails)

        sendNotification(video, assessmentDetails.statusCode)

        if (assessmentDetails) {
            video.assessmentDetails = assessmentDetails
        } else {
            video.assessmentDetails = data
        }

        await video.save()

        if (assessmentDetails.statusCode === 1) {
            PostVideoUpload(video._id).catch(err => console.error('[Zapier] FATAL ERROR:', err))
        }

        console.log(new Date(), '[/api/3motion/webhook] assessmentDetails updated')

        return NextResponse.json({ message: `OK` }, { status: 200 })

        // return NextResponse.json({ message: `OK` }, { status: 200 })
    } catch (err: unknown) {
        console.error(new Date(), '[/api/3motion/webhook] error:', err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}

const sendNotification = async (_video: IVideo, statusCode: Number) => {
    try {
        if (!statusCode) return console.error('[sendNotification] Invalid status code', statusCode)
        const video = await Video.findOne({ _id: _video._id })
        if (!video) return console.error('[sendNotification] error: could not find video')

        const user = await User.findOne({ _id: video.userId })
        if (!user) return console.error('[sendNotification] error: could not find user')

        var trainer;

        if (user.roleData.trainerId) {
            trainer = await User.findOne({ _id: user.roleData.trainerId })
            if (!trainer) return console.error('[sendNotification] error: could not find trainer')
        }

        const success = statusCode === 1;

        Notification.create({ message: success ? 'Your video has been processed!' : 'Sorry, your video has failed to process', userId: user._id, type: 'video' })
        if (trainer) Notification.create({ message: success ? 'Your player\'s video has been processed!' : 'Sorry, your player\'s video has failed to process', userId: trainer._id, type: 'video' })

        const email = {
            subject: success ? 'Processing Completed' : 'Processing Failed',
            html: `
                    <p>Hello, ${user.name}!</p>
                    <p>${success ? 'Your video processing has been finished.' : 'Something went wrong, your video has failed to process.'}</p>
                `
        }

        sendEmail({
            to: user.email,
            ...email
        }).catch(console.error)


        if (trainer) {
            sendEmail({
                to: trainer.email,
                ...email
            }).catch(console.error)
        }

    } catch (err) {
        console.error('[sendNotification] unexpected error:', err)
    }
}

// update pending assessment every 1 hour
setInterval(() => {
    updateAssessments()
}, 3600000);
// 3600000  

const updateAssessments = async () => {
    console.log(new Date(), 'updateAssessments timer called')
    const videos = await Video.find();
    videos.forEach(async video => {
        if (video.assessmentDetails.statusCode) return
        console.log(new Date(), 'updating pending assessment details for', video.taskId)
        const assessmentDetails = await _3Motion.getAssessmentDetails({ taskId: video.taskId, taskType: video.taskType });
        console.log(new Date(), 'assessmentDetails', assessmentDetails)

        if (!assessmentDetails) return console.error('Invalid response for', video.taskId)

        sendNotification(video, assessmentDetails.statusCode)

        video.assessmentDetails = assessmentDetails

        await video.save()

        if (assessmentDetails.statusCode === 1) {
            PostVideoUpload(video._id).catch(err => console.error('[Zapier] FATAL ERROR:', err))
        }

        console.log(new Date(), 'updated assessment details for', video.taskId)
    })
}