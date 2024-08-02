import axios from 'axios'
import { I3MotionAuth } from './interfaces/3motion';
import fs from 'fs'
import { IAssessmentDetails } from './interfaces/assessmentDetails';

const BASE_URL = 'https://3m.3motionai.com/api/v1'
var auth: I3MotionAuth | null = null;

authorize().catch(console.error)

// refresh token every 1h
setInterval(() => {
    authorize().catch(console.error)
}, 3600000)

function getAuth() {
    return auth
}

function authorize() {
    return new Promise((resolve, reject) => {
        axios.post(BASE_URL + '/Account/Authenticate', {
            usernameOrEmailAddress: process.env._3MOTION_EMAIL,
            password: process.env._3MOTION_PASSWORD,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': 'Dsi.Localization.CultureName=en'
            }
        }).then(res => {
            if (!res.data.success) return reject({ message: res.data.message || 'Unexpected error' })
            auth = res.data.result;
            console.info('Updated 3motion auth')
            resolve({ message: 'success' })
        }).catch(err => {
            reject({ message: err.response.data?.message || err.message || 'INTERNAL ERROR' })
        })
    })
}

function getUser() {
    return new Promise((resolve, reject) => {
        if (!auth) return reject({ message: 'Unauthorized' })
        axios.post(BASE_URL + '/User/GetUsers', {
            pageSize: 30,
            pageNo: 1,
            searchText: ""
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': 'Dsi.Localization.CultureName=en',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        }).then(res => {
            if (!res.data.success) return reject({ message: res.data.message || 'Unexpected error' })

            const user = res.data.result[0]
            if (!user) return reject({ message: 'Invalid API response' })

            resolve(user)
        }).catch(err => {
            reject({ message: err.response.data?.message || err.message || 'INTERNAL ERROR' })
        })
    })
}

function getAssessments({
    searchText,
    pageno,
    sort_key,
    sort_direction,
    pageSize,
} = {
        searchText: "",
        pageno: 1,
        sort_key: "",
        sort_direction: "ascd",
        pageSize: 100
    }) {
    return new Promise((resolve, reject) => {
        if (!auth) return reject({ message: 'Unauthorized' })
        axios.post(BASE_URL + '/Assessment/GetAssessments', {
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
                'Authorization': `Bearer ${auth.accessToken}`
            }
        }).then(res => {
            if (!res.data.success) return reject({ message: res.data.message || 'Unexpected error' })
            resolve(res.data.result)
        }).catch(err => {
            reject({ message: err.response.data?.message || err.message || 'INTERNAL ERROR' })
        })
    })
}

function getAssessmentDetails({ taskId, taskType }: { taskId: string, taskType: string }): Promise<IAssessmentDetails> {
    return new Promise((resolve, reject) => {
        if (!auth) return reject({ message: 'Unauthorized' })

        if (!taskId || !taskType) return reject({ message: 'Should provide valid parameters' })

        axios.get(BASE_URL + '/Assessment/GetAssessmentDetails', {
            params: {
                taskId,
                taskType
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': 'Dsi.Localization.CultureName=en',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        }).then(res => {
            if (!res.data.success) return reject({ message: res.data.message || 'Unexpected error' })
            resolve(res.data.result)
        }).catch(err => {
            reject({ message: err.response.data?.message || err.message || 'INTERNAL ERROR' })
        })
    })
}

function createAssessment({
    individualId,
    taskType,
    height,
    weight,
    uploadfile,
}: { individualId?: number, taskType: string, height: number, weight: number, uploadfile: File, }): Promise<{
    assessmentId: number,
    assessmentMappingId: number
}> {
    return new Promise((resolve, reject) => {
        console.log('createAssessment called', auth, uploadfile)
        if (!auth) return reject({ message: 'Unauthorized' })

        individualId = individualId || 124923
        if (!taskType || !height || !weight || !uploadfile) return reject({ message: 'Should provide valid parameters' })

        const formData = new FormData();
        // const file = new Blob([fs.readFileSync(`./spinlab-test-video.mp4`)]);
        // const fileStream = fs.createReadStream('./example.jpg');
        // console.log(file)
        formData.append('individualId', individualId.toString())
        formData.append('taskType', taskType)
        formData.append('height', height.toString())
        formData.append('weight', weight.toString())
        formData.append('uploadfile', uploadfile)

        console.log(formData)

        axios.post(BASE_URL + '/Assessment/CreateAssessment', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'Cookie': 'Dsi.Localization.CultureName=en',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        }).then(res => {
            if (!res.data.success) return reject({ message: res.data.message || 'Unexpected error' })
            resolve(res.data.result)
        }).catch(err => {
            reject({ message: err.response.data?.message || err.message || 'INTERNAL ERROR' })
        })
    })
}

const _3Motion = {
    getAuth,
    authorize,
    getUser,
    getAssessments,
    getAssessmentDetails,
    createAssessment
}

export default _3Motion