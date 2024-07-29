import { MongooseError } from 'mongoose'
import * as Yup from 'yup'

function validateError(err: unknown) {
    if (err instanceof Yup.ValidationError) {
        return { message: err.message, status: 400 }
    }
    if (err instanceof SyntaxError) {
        return { message: err.message, status: 400 }
    }
    if (err instanceof MongooseError) {
        return { message: err.message, status: 400 }
    }
    return { message: 'Error occured', status: 500 }
}

export {
    validateError
}