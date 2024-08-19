import { NextRequest, NextResponse } from "next/server";
import { Notification, User, Video } from "@/app/lib/models";
import { validateError } from "@/app/lib/functions";
import _3Motion from "@/app/lib/3motion";
import axios from 'axios'
import { IVideo } from "@/app/lib/interfaces/video";
import { sendEmail } from "@/app/lib/sendEmail";

export async function POST(req: NextRequest) {
    try {
        console.log(new Date(), '[/api/3motion/webhook] called')
        const data = await req.json()

        console.log(new Date(), '[/api/3motion/webhook] data', data)
        if (!data.TenantId || !data.TaskId) {
            console.log(new Date(), '[/api/3motion/webhook] Invalid Request')
            return NextResponse.json({ message: `Invalid Request` }, { status: 400 })
        }

        const updateAssessment = async () => {
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

            if (assessmentDetails.statusCode) {
                sendNotification(video)
            }

            if (assessmentDetails) {
                if (assessmentDetails.dataJsonUrl) {
                    assessmentDetails.stats = await axios.get(assessmentDetails.dataJsonUrl).then(res => res.data);
                } else {
                    console.log(new Date(), '[/api/3motion/webhook] dataJsonUrl is empty')
                }

                video.assessmentDetails = assessmentDetails
            } else {
                video.assessmentDetails = data
            }

            await video.save()

            console.log(new Date(), '[/api/3motion/webhook] assessmentDetails updated')
        }

        setTimeout(updateAssessment, 5000);

        return NextResponse.json({ message: `OK` }, { status: 200 })

        // return NextResponse.json({ message: `OK` }, { status: 200 })
    } catch (err: unknown) {
        console.error(new Date(), '[/api/3motion/webhook] error:', err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}

const sendNotification = async (_video: IVideo) => {
    try {
        const video = await Video.findOne({ _id: _video._id })
        if (!video) return console.error('[sendNotification] error: could not find video')

        const user = await User.findOne({ _id: video.userId })
        if (!user) return console.error('[sendNotification] error: could not find user')

        var trainer;

        if (user.roleData.trainerId) {
            trainer = await User.findOne({ _id: user.roleData.trainerId })
            if (!trainer) return console.error('[sendNotification] error: could not find trainer')
        }

        Notification.create({ message: 'Your video has been processed!', userId: user._id, type: 'video' })
        if (trainer) Notification.create({ message: 'Your player\'s video has been processed!', userId: trainer._id, type: 'video' })

        sendEmail({
            to: user.email,
            subject: 'Processing Completed',
            html: `
                <p>Hello, ${user.name}!</p>
                <p>Your video processing has been finished</p>
            `
        }).catch(console.error)


        if (trainer) {
            sendEmail({
                to: trainer.email,
                subject: 'Processing Completed',
                html: `
                    <p>Hello, ${trainer.name}!</p>
                    <p>Your video processing has been finished</p>
                `
            }).catch(console.error)
        }

    } catch (err) {
        console.error('[sendNotification] unexpected error:', err)
    }
}

// update pending assessment every 5 minutes
setInterval(() => {
    updateAssessments()
}, 300000);
// 3600000  

const updateAssessments = async () => {
    console.log(new Date(), 'updateAssessments timer called')
    const videos = await Video.find({}, { assessmentDetails: { stats: { ARR: 0, ANG: 0, VEL: 0 } } });
    videos.forEach(async video => {
        if (video.assessmentDetails.statusCode) return
        console.log(new Date(), 'updating pending assessment details for', video.taskId)
        const assessmentDetails = await _3Motion.getAssessmentDetails({ taskId: video.taskId, taskType: video.taskType });
        console.log(new Date(), 'assessmentDetails', assessmentDetails)

        if (!assessmentDetails) return console.error('Invalid response for for', video.taskId)

        if (assessmentDetails.statusCode) {
            sendNotification(video)
        }

        if (assessmentDetails.dataJsonUrl) {
            assessmentDetails.stats = await axios.get(assessmentDetails.dataJsonUrl).then(res => res.data);
        }

        video.assessmentDetails = assessmentDetails

        await video.save()

        console.log(new Date(), 'updated assessment details for', video.taskId)
    })
}