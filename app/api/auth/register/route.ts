import { NextRequest, NextResponse } from 'next/server';
import util from 'util';
// import db from '../../../lib/db';
import { randomUUID } from 'crypto';
import { User } from '../../../lib/models'
import bcrypt from 'bcrypt'

// const query = util.promisify(db.query).bind(db);

export const POST = async (req: NextRequest) => {
    console.log('/api/register')
    const uniqID = randomUUID()

    const values = await req.json();

    console.log(values)

    const { _id, firstName, lastName, email, city, country, password, plan, role } = values
    console.log('salt is', process.env.BCRYPT_SALT)
    return User.create({
        _id,
        firstName,
        lastName,
        email,
        city,
        country,
        password: bcrypt.hashSync(password, process.env.BCRYPT_SALT as string),
        plan,
        role
    }).then((doc) => {
        console.log('created doc', doc)
        return new NextResponse(JSON.stringify(values), { status: 201 });
    }).catch((err) => {
        console.log(err)
        return new NextResponse(JSON.stringify({ error: err.errmsg }), { status: 400 });
    })

    // try {
    //     const results = await query(`
    //         INSERT INTO users 
    //         (uniqID, firstName, lastName, email, city, country, password, plan, role) 
    //         VALUES 
    //         ('${uniqID}','${values.firstName}', '${values.lastName}', '${values.email}', '${values.city}', 
    //         '${values.country}', '${values.password}', '${values.plan}', '${values.role}')
    //     `);
    //     if (results) {
    //         return new NextResponse(JSON.stringify(values), { status: 201 });
    //     }
    // } catch (error: any) {
    //     console.log(error);
    //     return new NextResponse(JSON.stringify({ error: error.message }), { status: 400 });
    // }
};
