import { MongooseError } from 'mongoose'
import * as Yup from 'yup'
import Stripe from "stripe";

function validateError(err: any) {
    if (err instanceof Yup.ValidationError) {
        return { message: err.message, status: 400 }
    }
    if (err instanceof SyntaxError) {
        return { message: err.message, status: 400 }
    }
    if (err instanceof MongooseError) {
        return { message: err.message, status: 400 }
    }
    if (err instanceof Stripe.errors.StripeCardError) {
        return { message: err.message, status: 400 }
    }
    return { message: err?.message || 'Error occured', status: 500 }
}

export {
    validateError
}