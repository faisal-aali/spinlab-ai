
import AWS from 'aws-sdk';

const bucket = process.env.AWS_BUCKET || ''
// Configure the AWS SDK with your credentials and the region
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadFileToS3 = (file: Buffer | File | Uint8Array | Blob | string) => {
    return new Promise(async (resolve, reject) => {
        let fileBody;

        if (file instanceof Blob) {
            const arrayBuffer = await file.arrayBuffer();
            fileBody = Buffer.from(arrayBuffer);
        } else {
            fileBody = file;
        }

        const fileName = `${crypto.randomUUID()}${(file instanceof File && `.${file.name.split('.').pop()}`) || ''}`

        s3.upload({
            Bucket: bucket,
            Key: fileName,
            Body: fileBody
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
};

export {
    uploadFileToS3
}