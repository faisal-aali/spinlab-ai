import mongoose from './mongodb'
import { IUser } from './interfaces/user';
import { IDrill } from './interfaces/drill';
import { ICategory } from './interfaces/category';
import { IVideo } from './interfaces/video';
import { IPackage } from './interfaces/package';
import { IHistory, ISubscription } from './interfaces/subscription';
import { IPurchase } from './interfaces/purchase';
import { ICalendar } from './interfaces/calendar';

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
    emailVerified: { type: Boolean, required: false, default: false },
    stripeCustomerId: { type: String, required: false, default: null },
    creationDate: { type: Date, required: false, default: () => new Date().toISOString() },
    role: { type: String, required: true, enum: ['player', 'trainer', 'staff', 'admin'] },
    roleData: { type: mongoose.Schema.Types.Mixed, required: true },
    isDeleted: { type: Boolean, required: false, default: false },
}, { minimize: false }); // minimize false in order to store empty objects

const drillSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, },
    videoLink: { type: String, required: true },
    title: { type: String, required: true, },
    isFree: { type: Boolean, required: true },
    creationDate: { type: Date, required: false, default: () => new Date().toISOString() },
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const videoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    taskId: { type: String, required: true, unique: true },
    assessmentMappingId: { type: String, required: true, unique: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    taskType: { type: String, required: true, },
    deliveryDate: { type: Date, required: true },
    creationDate: { type: Date, required: false, default: () => new Date().toISOString() },
    assessmentDetails: { type: mongoose.Schema.Types.Mixed, required: false, default: {} },
}, { minimize: false });

const packageSchema = new mongoose.Schema({
    stripePlanId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    role: { type: String, required: true, enum: ['player', 'trainer'] },
    throwsPerMonth: { type: Number, required: true },
    amountPerCredit: { type: Number, required: true },
    amount: { type: Number, required: true },
    plan: { type: String, required: true, enum: ['monthly', 'yearly', 'free'] },
});

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, required: true },
    stripeSubscriptionId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    history: { type: Array<IHistory>, required: false, default: [] },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    creationDate: { type: Date, required: false, default: () => new Date().toISOString() },
    lastUpdated: { type: Date, required: false, default: () => new Date().toISOString() },
}, { minimize: false });

const purchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    stripeSubscriptionId: { type: String, required: false, default: null },
    stripeIntentId: { type: String, required: false, default: null },
    amount: { type: Number, required: false, default: 0 },
    credits: { type: Number, required: true },
    type: { type: String, required: true, enum: ['purchase', 'subscription', 'gift'] },
    giftedBy: { type: mongoose.Schema.Types.ObjectId, required: false, default: null },
    isForfeited: { type: Boolean, required: false, default: false },
    forfeitReason: { type: String, required: false, default: null },
    creationDate: { type: Date, required: false, default: () => new Date().toISOString() },
    activateAfter: { type: Date, required: false, default: () => new Date().toISOString() },
}, { minimize: false });

const calendarSchema = new mongoose.Schema({
    src: { type: String, required: true },
});

export const User: mongoose.Model<IUser> = mongoose.models.user || mongoose.model<IUser>('user', userSchema, 'users');

export const Drill: mongoose.Model<IDrill> = mongoose.models.drill || mongoose.model<IDrill>('drill', drillSchema, 'drills');

export const Category: mongoose.Model<ICategory> = mongoose.models.category || mongoose.model<ICategory>('category', categorySchema, 'categories');

export const Video: mongoose.Model<IVideo> = mongoose.models.video || mongoose.model<IVideo>('video', videoSchema, 'videos');

export const Package: mongoose.Model<IPackage> = mongoose.models.package || mongoose.model<IPackage>('package', packageSchema, 'packages');

export const Subscription: mongoose.Model<ISubscription> = mongoose.models.subscription || mongoose.model<ISubscription>('subscription', subscriptionSchema, 'subscriptions');

export const Purchase: mongoose.Model<IPurchase> = mongoose.models.purchase || mongoose.model<IPurchase>('purchase', purchaseSchema, 'purchases');

export const Calendar: mongoose.Model<ICalendar> = mongoose.models.calendar || mongoose.model<IPurchase>('calendar', calendarSchema, 'calendars');