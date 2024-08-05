
export interface IHistory {
    packageId: string,
    stripeSubscriptionId: string,
    amount: number,
    status: boolean,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
}

export interface ISubscription {
    _id: string,
    userId: string,
    packageId: string,
    stripeSubscriptionId: string,
    amount: number,
    status: boolean,
    history: Array<IHistory>,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    creationDate: Date,
}