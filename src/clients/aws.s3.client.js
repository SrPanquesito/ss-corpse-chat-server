const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

// upload file to s3 parallelly in chunks
const fileUploadStream = async (req, res, next) => {
    try {
        const file = req.file;
        // params for s3 upload
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: file.originalname,
            Body: file.buffer,
        }
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
        const uploadParallel = new Upload({
            client: s3,
            queueSize: 4, // optional concurrency configuration
            partSize: 5542880, // optional size of each part (5 mb minimum)
            leavePartsOnError: false, // optional manually handle dropped parts
            params,
        })
      
        // checking progress of upload
        uploadParallel.on("httpUploadProgress", progress => {
            console.log(progress)
        })
      
        // after completion of upload
        uploadParallel.done().then(data => {
            console.log("upload completed!", { data })
        })

        res.send('File is being uploaded in the background!');
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
};

module.exports = { fileUploadStream };