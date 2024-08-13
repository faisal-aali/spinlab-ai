import { NextRequest, NextResponse } from "next/server";
import { Video } from "@/app/lib/models";
import { validateError } from "@/app/lib/functions";
import _3Motion from "@/app/lib/3motion";
import axios from 'axios'

export async function GET(req: NextRequest) {
    try {

        const assessmentDetails = await _3Motion.getAssessmentDetails({ taskId: '22202', taskType: 'qbthrow' });

        console.log('assessmentDetails', assessmentDetails)


    } catch (err) {
        console.error(err)
    }
}