import { IUser } from './interfaces/users';
import mongoose from './mongodb'

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    city: String,
    country: String,
    plan: String,
    role: String,
});

export const User: mongoose.Model<IUser> = mongoose.models.user || mongoose.model<IUser>('user', userSchema);