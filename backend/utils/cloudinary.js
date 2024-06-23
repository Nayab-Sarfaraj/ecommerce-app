// import { v2 as cloudinary } from 'cloudinary';
const v2 = require("cloudinary")
const fs = require("fs")
v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})


const uploadOnCloudnary = async function (localFilePath) {
    try {
        const response = await v2.uploader.upload(localFilePath, { resource_type: "auto" }
        );
        console.log(+ response);
        console.log("the url is " + response.url);
        return response
    } catch (error) {
        // fs.unlink(localFilePath)
        fs.unlink(localFilePath, (err) => { console.log(err) })
    }
}

module.exports = uploadOnCloudnary