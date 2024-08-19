import { NextRequest, NextResponse } from "next/server";
import { Category, Drill, Promocode, Purchase, User } from "@/app/lib/models";
import * as Yup from 'yup'
import { validateError } from "@/app/lib/functions";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id')
        const code = searchParams.get('code')

        if (session.user.role !== 'admin') {
            if (!code) return NextResponse.json({ message: 'Code is required' }, { status: 400 })
        }

        const query: { _id?: string, code?: string, isDeleted: boolean } = { isDeleted: false };

        if (id) query._id = id;
        if (code) query.code = code.toUpperCase().trim();

        const promocodes = await Promocode.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "purchases",               // The collection to join
                    localField: "_id",               // Field from the `promocodes` collection
                    foreignField: "promocodeId",     // Field from the `purchases` collection
                    as: "products"                  // The resulting array field in the output
                }
            },
        ])

        if (session.user.role !== 'admin') {
            const promocode = promocodes[0]
            if (!promocode) return NextResponse.json({ message: "Invalid promo code provided" }, { status: 400 });
            if (new Date(promocode.expirationDate).getTime() < new Date().getTime()) return NextResponse.json({ message: "Promo code has expired" }, { status: 400 });
            if (promocode.products.length >= promocode.uses) return NextResponse.json({ message: "Promo code has reached usage limit" }, { status: 400 });
        }

        return NextResponse.json(promocodes)
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOption);
        if (!session || !session.user || session.user.role !== 'admin') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const data = await req.json()

        const schema = Yup.object({
            code: Yup.string().required("Code is required"),
            description: Yup.string().required("Description is required"),
            discountPercentage: Yup.number().min(1, 'Discount % must be greater than 0').max(100, 'Discount % must be less than 101').required("Discount % is required").strict(),
            uses: Yup.number().min(1, 'Uses must be greater than 0').required("Uses is required").strict(),
            type: Yup.string().oneOf(['purchase'], 'Invalid type provided').required("Type is required"),
            productId: Yup.string().optional(),
            expirationDate: Yup.date().required('Date is required'),
        });

        await schema.validate(data)

        data.code = data.code.toUpperCase().trim().replace(/ /g, '')

        const dups = await Promocode.find({ code: data.code })
        if (dups.length > 0) return NextResponse.json({ message: 'The promo code already exists' }, { status: 400 })

        const promocode = await Promocode.create({
            code: data.code,
            description: data.description,
            discountPercentage: data.discountPercentage,
            uses: data.uses,
            type: data.type,
            productId: data.productId || null,
            expirationDate: data.expirationDate,
        })

        return NextResponse.json({ message: `Promocode has been created with id ${promocode._id}` }, { status: 200 })
    } catch (err: unknown) {
        console.error(err)
        const obj = validateError(err)
        return NextResponse.json({ message: obj.message }, { status: obj.status })
    }
}