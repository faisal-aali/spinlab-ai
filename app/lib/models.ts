import { IResetToken } from './interfaces/resetTokens';
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
    membership: String
});

const resetTokenSchema = new mongoose.Schema({
    token: String,
    expiration: Number,
    user_id: String,
});

export const User: mongoose.Model<IUser> = mongoose.models.user || mongoose.model<IUser>('user', userSchema);

export const ResetToken: mongoose.Model<IResetToken> = mongoose.models.resetToken || mongoose.model<IUser>('resetToken', resetTokenSchema);