
export interface IHistory {
    packageId: string,
    stripeSubscriptionId: string,
    amount: number,
    status: string,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    lastUpdated: Date,
}

export interface ISubscription {
    _id: string,
    userId: string,
    packageId: string,
    stripeSubscriptionId: string,
    amount: number,
    status: string,
    history: Array<IHistory>,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    creationDate: Date,
    lastUpdated: Date,
}