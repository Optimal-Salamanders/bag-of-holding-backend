'use strict'

// require s3Upload
const s3Upload = require('./../lib/aws-s3-upload.js')

// pull in mongoose and Upload model
const Upload = require('./../app/models/upload')
const mongoose = require('mongoose')
const db = require('./../config/db')
// assign native promises
mongoose.Promise = global.Promise
mongoose.connect(db, {
  useMongoClient: true
})

// accept filepath and title from command line
const filePath = process.argv[2]
const title = process.argv[3]

s3Upload(filePath, title)
  .then((s3Response) => {
    return Upload.create({
      title: s3Response.Key,
      url: s3Response.Location
    })
  })
  .then((upload) => {
    console.log('upload is ', upload)
    return upload
  })
  .catch(console.error)
  .then(() => {
    mongoose.connection.close()
  })
