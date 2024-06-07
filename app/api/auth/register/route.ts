import { NextResponse } from "next/server";
import util from "util";
import db from "../../../../util/db";

const query = util.promisify(db.query).bind(db);

export const POST = async (req: { json: () => any }) => {
    const values = await req.json();
    try {
        const results = await query(`
            INSERT INTO users 
            (uniqID, firstName, lastName, email, city, country, password, confirmPassword, plan) 
            VALUES 
            (UUID(), '${values.firstName}', '${values.lastName}', '${values.email}', '${values.city}', 
            '${values.country}', '${values.password}', '${values.confirmPassword}', '${values.plan}')
        `);
        if (results) {
            return new NextResponse(values, { status: 201 });
        }
    } catch (error: any) {
        console.log(error);
        return new NextResponse(error, { status: 400 });
    }
};
