'use strict'

// As early as possible in your application, require and configure dotenv
require('dotenv').config()

// require aws-sdk library
const AWS = require('aws-sdk')

// require file system module
const fs = require('fs')

// require mime-types for getting file type
// https://www.npmjs.com/package/mime-types
const mime = require('mime-types')

// instantiate an s3 instance
const s3 = new AWS.S3()

// returns a promise based on s3.upload response
const s3Upload = function (file) {
  const mimeType = mime.lookup(file.originalname)
  const extension = mime.extension(mimeType)

  // const folder = (new Date()).toISOString().split('T')[0]
  const folder = file.userId
  // const dateTime = new Date().toISOString().split('T')[0]

  const params = {
    // allow public read
    ACL: 'public-read',
    // the bucket to upload to
    Bucket: process.env.BUCKET_NAME,
    // key is the title of the file
    Key: `${folder}/${file.title}.${extension}`,
    // Body is what gets uploaded
    Body: fs.createReadStream(file.path),
    ContentType: mimeType
  }

  // return the promise so we can do a promise chain
  return new Promise((resolve, reject) => {
    // run s3.upload
    s3.upload(params, function (err, data) {
      // reject if error
      if (err) {
        reject(err)
      // promise resolves with the data if succesful
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = s3Upload
