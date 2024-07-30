import { IResetToken } from './interfaces/resetTokens';
import { IUser } from './interfaces/users';
import mongoose from './mongodb'
import { IDrill } from './interfaces/drill';
import { ICategory } from './interfaces/category';

// const roleDataSchema = new mongoose.Schema({
//     age: { type: Number, required: false, default: null },
//     height: { type: Number, required: false, default: null },
//     weight: { type: Number, required: false, default: null },
//     handedness: { type: String, required: false, default: null },
//     anonymous: { type: Boolean, required: false, default: false },
// }, { _id: false }); // Disable _id for sub-documents

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: false, default: null },
    country: { type: String, required: false, default: null },
    avatarUrl: { type: String, required: false, default: null },
    bio: { type: String, required: false, default: null },
    credits: { type: Number, required: false, default: 0 },
    emailVerified: { type: Boolean, required: false, default: false },
    role: { type: String, required: true },
    roleData: { type: mongoose.Schema.Types.Mixed, required: true },
    isDeleted: { type: Boolean, required: false, default: false },
}, { minimize: false }); // minimize false in order to store empty objects

const drillSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    categoryId: { type: String, required: true, },
    videoLink: { type: String, required: true },
    title: { type: String, required: true, },
    isFree: { type: Boolean, required: true },
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const resetTokenSchema = new mongoose.Schema({
    token: String,
    expiration: Number,
    user_id: String,
});

export const User: mongoose.Model<IUser> = mongoose.models.user || mongoose.model<IUser>('user', userSchema);

export const Drill: mongoose.Model<IDrill> = mongoose.models.drill || mongoose.model<IDrill>('drill', drillSchema);

export const Category: mongoose.Model<ICategory> = mongoose.models.category || mongoose.model<ICategory>('category', categorySchema);

export const ResetToken: mongoose.Model<IResetToken> = mongoose.models.resetToken || mongoose.model<IUser>('resetToken', resetTokenSchema);