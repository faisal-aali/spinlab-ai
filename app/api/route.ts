import { getServerSession } from "next-auth";
import { authOption } from "./auth/[...nextauth]/route";
import { NextResponse } from "next/server";


export async function GET(request: any) {
    const session = await getServerSession(authOption);
    console.log("get api", session)
    return NextResponse.json({ authenticated: !!session })
}
export async function POST(request: any){}
