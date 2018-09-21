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
const s3Delete = function (file) {
  console.log("file is", file)
  let url = file.url
  console.log("url is", file.url)
  let subString = url.substring(url.indexOf(".com/"))
  let fileName = subString.substring(5)
  // const mimeType = mime.lookup(file)
  // console.log("mime type is", mimeType)
  // const extension = mime.extension(mimeType)
  // console.log("extension is", extension)
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName
  }

  // return the promise so we can do a promise chain
  return new Promise((resolve, reject) => {
    // run s3.upload
    s3.deleteObject(params, function (err, data) {
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

module.exports = s3Delete
