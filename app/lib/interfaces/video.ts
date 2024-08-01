
export interface IVideo {
    _id: string,
    userId: string,
    taskId: string,
    taskType: string,
    deliveryDate: Date,
    creationDate: Date,
    assessmentDetails: object
}