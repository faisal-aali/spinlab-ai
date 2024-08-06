
export interface IPurchase {
    _id: string,
    userId: string,
    stripeSubscriptionId: string | null,
    stripeIntentId: string | null,
    amount: number,
    credits: number,
    type: string,
    giftedBy: string | null,
    creationDate: Date,
    isForfeited: boolean,
    forfeitReason: string | null
}