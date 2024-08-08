import axios from 'axios';
import { I3MotionAuth } from './interfaces/3motion';
import { IAssessmentDetails } from './interfaces/assessmentDetails';

const BASE_URL = 'https://3m.3motionai.com/api/v1';

class MotionAPI {
    private auth: I3MotionAuth | null = null;

    constructor() {
        this.authorize().catch(console.error);
        this.startTokenRefresh();
    }

    private startTokenRefresh() {
        // Refresh token every 1 hour
        setInterval(() => {
            this.authorize().catch(console.error);
        }, 3600000);
    }

    public getAuth(): I3MotionAuth | null {
        return this.auth;
    }

    private async authorize(): Promise<void> {
        try {
            const res = await axios.post(BASE_URL + '/Account/Authenticate', {
                usernameOrEmailAddress: process.env._3MOTION_EMAIL,
                password: process.env._3MOTION_PASSWORD,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': 'Dsi.Localization.CultureName=en'
                }
            });

            if (!res.data.success) {
                throw new Error(res.data.message || 'Unexpected error');
            }

            this.auth = res.data.result;
            console.info('Updated 3motion auth');
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || 'INTERNAL ERROR');
        }
    }

    public async getUser(): Promise<any> {
        try {
            if (!this.auth) await this.authorize()
            if (!this.auth) throw new Error('Unauthorized');

            const res = await axios.post(BASE_URL + '/User/GetUsers', {
                pageSize: 30,
                pageNo: 1,
                searchText: ""
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': 'Dsi.Localization.CultureName=en',
                    'Authorization': `Bearer ${this.auth.accessToken}`
                }
            });

            if (!res.data.success) {
                throw new Error(res.data.message || 'Unexpected error');
            }

            const user = res.data.result[0];
            if (!user) {
                throw new Error('Invalid API response');
            }

            return user;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || 'INTERNAL ERROR');
        }
    }

    public async getAssessments({
        searchText = "",
        pageno = 1,
        sort_key = "",
        sort_direction = "ascd",
        pageSize = 100,
    }: {
        searchText?: string;
        pageno?: number;
        sort_key?: string;
        sort_direction?: string;
        pageSize?: number;
    }): Promise<any> {
        try {
            if (!this.auth) await this.authorize()
            if (!this.auth) throw new Error('Unauthorized');

            const res = await axios.post(BASE_URL + '/Assessment/GetAssessments', {
                searchText,
                pageno,
                sort_key,
                sort_direction,
                pageSize,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': 'Dsi.Localization.CultureName=en',
                    'Authorization': `Bearer ${this.auth.accessToken}`
                }
            });

            if (!res.data.success) {
                throw new Error(res.data.message || 'Unexpected error');
            }

            return res.data.result;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || 'INTERNAL ERROR');
        }
    }

    public async getAssessmentDetails({ taskId, taskType }: { taskId: string; taskType: string; }): Promise<IAssessmentDetails> {
        if (!taskId || !taskType) {
            throw new Error('Should provide valid parameters');
        }

        try {
            if (!this.auth) await this.authorize()
            if (!this.auth) throw new Error('Unauthorized');

            const res = await axios.get(BASE_URL + '/Assessment/GetAssessmentDetails', {
                params: { taskId, taskType },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cookie': 'Dsi.Localization.CultureName=en',
                    'Authorization': `Bearer ${this.auth.accessToken}`
                }
            });

            if (!res.data.success) {
                throw new Error(res.data.message || 'Unexpected error');
            }

            return res.data.result;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || 'INTERNAL ERROR');
        }
    }

    public async createAssessment({
        individualId = 124923,
        taskType,
        height,
        weight,
        uploadfile,
    }: {
        individualId?: number;
        taskType: string;
        height: number;
        weight: number;
        uploadfile: File;
    }): Promise<{ assessmentId: number; assessmentMappingId: number; }> {

        if (!taskType || !height || !weight || !uploadfile) {
            throw new Error('Should provide valid parameters');
        }

        const formData = new FormData();
        formData.append('individualId', individualId.toString());
        formData.append('taskType', taskType);
        formData.append('height', height.toString());
        formData.append('weight', weight.toString());
        formData.append('uploadfile', uploadfile);

        try {
            if (!this.auth) await this.authorize()
            if (!this.auth) throw new Error('Unauthorized');

            const res = await axios.post(BASE_URL + '/Assessment/CreateAssessment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'Cookie': 'Dsi.Localization.CultureName=en',
                    'Authorization': `Bearer ${this.auth.accessToken}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    console.log(`[3motion.createAssessment] uploaded ${percentCompleted}%`);
                },
            });

            if (!res.data.success) {
                throw new Error(res.data.message || 'Unexpected error');
            }

            return res.data.result;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || err.message || 'INTERNAL ERROR');
        }
    }
}

const _3Motion = new MotionAPI();
export default _3Motion;
