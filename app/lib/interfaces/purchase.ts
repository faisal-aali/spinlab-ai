import mongoose from "../mongodb";

export interface IPurchase {
    _id: string,
    userId: string,
    stripeSubscriptionId: string | null,
    stripeIntentId: string | null,
    promocodeId: mongoose.Schema.Types.ObjectId | null,
    amount: number,
    credits: number,
    type: string,
    giftedBy: mongoose.Schema.Types.ObjectId | null,
    creationDate: Date,
    isForfeited: boolean,
    forfeitReason: string | null,
    activateAfter: Date
}