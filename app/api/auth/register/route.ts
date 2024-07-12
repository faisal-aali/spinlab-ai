import { NextRequest, NextResponse } from 'next/server';
import util from 'util';
import db from '../../../lib/db';
import { randomUUID } from 'crypto';

const query = util.promisify(db.query).bind(db);

export const POST = async (req: NextRequest) => {
    const uniqID = randomUUID()

    const values = await req.json();
    try {
        const results = await query(`
            INSERT INTO users 
            (uniqID, firstName, lastName, email, city, country, password, plan, role) 
            VALUES 
            ('${uniqID}','${values.firstName}', '${values.lastName}', '${values.email}', '${values.city}', 
            '${values.country}', '${values.password}', '${values.plan}', '${values.role}')
        `);
        if (results) {
            return new NextResponse(JSON.stringify(values), { status: 201 });
        }
    } catch (error: any) {
        console.log(error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 400 });
    }
};
