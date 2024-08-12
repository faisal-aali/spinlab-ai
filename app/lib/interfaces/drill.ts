
export interface IDrill {
    _id: string,
    userId: string,
    categoryId: string,
    videoLink: string,
    title: string,
    description: string,
    isFree: boolean,
    creationDate: Date,
}