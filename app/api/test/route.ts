import { NextRequest, NextResponse } from "next/server";
import { Category, Drill, User } from "@/app/lib/models";
import * as Yup from 'yup'
import { validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { PostAccountCreation } from "@/app/lib/zapier";

export async function GET(req: NextRequest) {
    try {
        await PostAccountCreation('66a7ead2a0e8ff3c451b4b00')
        return NextResponse.json({ message: 'success' })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}