import { IAssessmentDetails } from "./assessmentDetails";

export interface IVideo {
    _id: string,
    userId: string,
    uploadedBy: string,
    thumbnailUrl: string | null,
    taskId: string,
    assessmentMappingId: string,
    taskType: string,
    deliveryDate: Date,
    creationDate: Date,
    assessmentDetails: IAssessmentDetails,
}