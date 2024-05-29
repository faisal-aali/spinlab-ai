import { NextResponse } from "next/server";
import util from "util";
import db from "../../../../util/db";

const query = util.promisify(db.query).bind(db);


export const POST = async (req: { json: () => any; }) => {
    const user = await req.json();
    try {
        const results = await query(`INSERT INTO users (uniqID,username, email, password )
        VALUES (UUID(), '${user.username}','${user.email}', '${user.password}')`)
        if (results) return new NextResponse(user, { status: 201 });
    } catch (error :any) {
        console.log(error)
        return new NextResponse(error, { status: 400 });
    }
}