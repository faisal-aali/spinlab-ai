import { NextRequest, NextResponse } from "next/server";
import { Category, Drill, Promocode, Purchase, User, Request } from "@/app/lib/models";
import * as Yup from 'yup'
import { validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user || session.user.role !== 'admin') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(req.url);
        const isViewed = searchParams.get('isViewed')
        console.log('isViewed is', isViewed)
        const query: { isViewed?: boolean } = {};
        if (isViewed) query.isViewed = (isViewed === 'true' ? true : isViewed === 'false' ? false : undefined);

        console.log('query is', query)

        const requests = await Request.find(query);

        return NextResponse.json(requests)
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}