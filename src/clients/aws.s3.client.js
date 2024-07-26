const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const prepareSdk = (file) => {
    // create s3 client
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
        }
    });
    // upload file to s3 parallelly in chunks
    // it supports min 5MB of file size
    return new Upload({
        client: s3,
        queueSize: 4, // optional concurrency configuration
        partSize: 5542880, // optional size of each part (5 mb minimum)
        leavePartsOnError: false, // optional manually handle dropped parts
        params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: file.originalname,
            Body: file.buffer,
        },
    })
}

const uploadFileToS3 = async (file) => {
    try {
        const uploadParallel = prepareSdk(file);

        uploadParallel.on("httpUploadProgress", progress => {
            console.log(progress)
        })

        const data = await uploadParallel.done();
        console.log("Upload completed!", { data });
        return data;
    } catch(error) {
        if (!error.statusCode) { error.statusCode = 500 };
        console.log("Upload file error: ", error);
        throw error;
    }
}

module.exports = { uploadFileToS3 };