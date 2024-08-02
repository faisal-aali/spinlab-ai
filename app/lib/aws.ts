
import AWS from 'aws-sdk';

const bucket = process.env.AWS_BUCKET || ''
// Configure the AWS SDK with your credentials and the region
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

/**
 * List all S3 buckets.
 * @returns A promise that resolves with the list of buckets.
 */
const listS3Buckets = (): Promise<AWS.S3.ListBucketsOutput> => {
    return new Promise((resolve, reject) => {
        s3.listBuckets((err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};


const uploadFileToS3 = (file: Buffer | Uint8Array | Blob | string) => {
    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: bucket,
            Key: crypto.randomUUID(),
            Body: file
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
    uploadFileToS3,
    listS3Buckets
}