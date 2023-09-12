// to make a .env file to store AWS credentials
const dotenv = require('dotenv');
// allow AWS credentials to be supplied
const aws = require('aws-sdk');
const crypto = require('crypto');
const { promisify } = require('util');
const fs = require('fs').promises;

const randomBytes = promisify(crypto.randomBytes);

dotenv.config()

// required to get URL to upload 
const region = 'us-east-1';
const bucketName = 'direct-video-upload';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
});

async function generateUploadURL() {
    // prevent video locations from being guessed by their name
    const rawBytes = await randomBytes(16);
    return rawBytes.toString('hex');
}

async function uploadVideo(videoName, filetype, video) {
    const params = ({
        Bucket: bucketName,
        Key: videoName + filetype, // keep filetype of video
        Expires: 10 // accounting for lag and video size
    });

    // put video data into buffer before pushing to S3 bucket
    const videoBuffer = await fs.readFile(video.path);
    // get credentialed URL to upload video to
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        headers: {
            "Content-Type": "video/" + filetype, // maintain video's filetype
            'Content-Length': videoBuffer.byteLength.toString()
        },
        body: videoBuffer
    });

    return uploadResponse;
}

async function downloadVideo(fileID) {
  return new Promise((resolve, reject) => {
    // attempt to download video from S3 bucket
    s3.getObject(
        {
            Bucket: bucketName,
            Key: fileID,
        },
        function(error, videoData) {
            if (error != null) {
                reject(error); // Reject the promise with an error
            } else {
                resolve(videoData.Body); // Resolve the promise with the video data
            }
        }
    );
  });
}

module.exports = { generateUploadURL, uploadVideo, downloadVideo };