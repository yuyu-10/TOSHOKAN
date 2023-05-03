const multer = require('multer')
const path = require('path')
require("dotenv").config()
const upload = multer({ dest: 'uploads/' })
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY,
})

module.exports = {
    upload,
    cloudinary,
    path
}