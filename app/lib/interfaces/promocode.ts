import mongoose from "../mongodb";

export interface IPromocode {
    _id: mongoose.Schema.Types.ObjectId,
    code: string,
    description: string,
    discountPercentage: number,
    uses: number,
    type: string,
    productId: mongoose.Schema.Types.ObjectId | null,
    creationDate: Date,
    expirationDate: Date,
    isDeleted: boolean
}