// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// multer file upload set up
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// pull in Mongoose model for uploads
const Upload = require('../models/upload')
const s3Upload = require('../../lib/aws-s3-upload.js')
const s3Delete = require('../../lib/aws-s3-delete.js')

// Auth
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
// const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /uploads
router.get('/uploads', requireToken, (req, res) => {
  Upload.find()
    .then(uploads => {
      // `uploads` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return uploads.map(upload => upload.toObject())
    })
    // respond with status 200 and JSON of the uploads
    .then(uploads => res.status(200).json({ uploads: uploads }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

/* ===== SHOW INDIVIDUAL RESOURCE NOT MVP ===== */
// // GET /uploads/5a7db6c74d55bc51bdf39793
// router.get('/uploads/:id', (req, res) => {
//   // req.params.id will be set based on the `:id` in the route
//   Upload.findById(req.params.id)
//     .then(handle404)
//     // if `findById` is succesful, respond with 200 and "upload" JSON
//     .then(upload => res.status(200).json({ upload: upload.toObject() }))
//     // if an error occurs, pass it to the handler
//     .catch(err => handle(err, res))
// })

// CREATE
// POST /uploads
router.post('/uploads', requireToken, upload.single('image'), (req, res) => {
  // prepare file
  const file = {
    path: req.file.path,
    title: req.body.title,
    originalname: req.file.originalname
  }
  // upload file to S3
  s3Upload(file)
    .then((data) => {
      return Upload.create({
        title: file.title,
        url: data.Location,
        tag: req.body.tag,
        owner: req.user.id
      })
    })
    .then(upload => {
      res.status(201).json({ upload: upload.toObject() })
    })
    .catch(err => handle(err, res))
})

// UPDATE
// PATCH /uploads/5a7db6c74d55bc51bdf39793
router.patch('/uploads/:id', requireToken, (req, res) => {
  console.log(req)
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  // delete req.body.upload.owner

  // Upload.findById(req.params.id)
  Upload.findOne({_id: req.params.id})
    .then(handle404)
    .then(upload => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      console.log('upload is ', upload)
      requireOwnership(req, upload)

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.upload).forEach(key => {
        if (req.body.upload[key] === '') {
          delete req.body.upload[key]
        }
      })

      // pass the result of Mongoose's `.update` to the next `.then`
      return upload.update(req.body.upload)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /uploads/5a7db6c74d55bc51bdf39793
router.delete('/uploads/:id', requireToken, (req, res) => {
  const file = {
    // path: req.file.path,
    title: req.body.title
    // originalname: req.file.originalname
  }

  const deleteId = req.params.id

  Upload.findById(deleteId)
    .then((object) => s3Delete(object))
    .then((data) => {
      Upload.findById(deleteId)
        .then(handle404)
        .then(upload => {
          upload.remove()
        })
        .then(() => res.sendStatus(204))
        .catch(err => handle(err, res))
    })
    .catch(err => handle(err, res))

  // Upload.findById(req.params.id)
  //   .then(handle404)
  //   .then(upload => {
  //     // throw an error if current user doesn't own `upload`
  //     // requireOwnership(req, upload)
  //     // delete the upload ONLY IF the above didn't throw
  //     upload.remove()
  //   })
  //   // send back 204 and no content if the deletion succeeded
  //   .then(() => res.sendStatus(204))
  //   // if an error occurs, pass it to the handler
  //   .catch(err => handle(err, res))
})

module.exports = router
