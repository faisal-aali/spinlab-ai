
export interface IAssessmentDetails {
    taskId: number,
    taskName: string,
    taskType: string,
    taskIdWithType: string,
    tenantId: number,
    tenantName: string,
    individualId: number,
    individualName: string,
    creationTime: string,
    statusCode: 0 | 1,
    statusText: string,
    fileUrl: string,
    taskScore: number,
    dataJsonUrl: string,
    reportPdfUrl: string,
    overlayVideoUrl: string,
    imgUrl: string | null,
    stats: any | undefined
}