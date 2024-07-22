import { NextRequest, NextResponse } from 'next/server';
import util from 'util';
// import db from '../../../lib/db';
import { randomUUID } from 'crypto';
import { User } from '../../../lib/models'
import bcrypt from 'bcrypt'
import * as Yup from 'yup'

// const query = util.promisify(db.query).bind(db);

export const POST = async (req: NextRequest) => {
    const schema = Yup.object({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        email: Yup.string().email().required("Email is required"),
        password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
        city: Yup.string().required("City is required"),
        country: Yup.string().required("Country is required"),
        plan: Yup.string().oneOf(['monthly', 'annual'], "Plan must be a valid string").required("Plan is required"),
        role: Yup.string().oneOf(['player', 'trainer'], "Role must be a valid string").required("Role is required"),
    });

    const data = await req.json();
    data.email = data.email.toLowerCase()

    return schema.validate(data).then(async () => {
        const { _id, firstName, lastName, email, city, country, password, plan, role } = data

        if (await User.findOne({ email }))
            return new NextResponse(JSON.stringify({ error: 'Email already exists' }), { status: 400 });

        return User.create({
            _id,
            firstName,
            lastName,
            email,
            city,
            country,
            password: bcrypt.hashSync(password, process.env.BCRYPT_SALT as string),
            plan,
            role,
            membership: 'basic'
        }).then((doc) => {
            console.log('created doc', doc)
            return new NextResponse(JSON.stringify(data), { status: 201 });
        }).catch((err) => {
            console.log(err)
            return new NextResponse(JSON.stringify({ error: err.errmsg }), { status: 400 });
        })

    }).catch((err) => {
        console.log(err)
        return new NextResponse(JSON.stringify({ error: err.errors }), { status: 400 });
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
