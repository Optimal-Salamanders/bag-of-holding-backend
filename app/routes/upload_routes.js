/* ===== Import Required Files ===== */
// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')
// multer file upload set up
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
/* ===== Our Mongoose Models ===== */
const Upload = require('../models/upload')
const s3Upload = require('../../lib/aws-s3-upload.js')
const s3Delete = require('../../lib/aws-s3-delete.js')
/* ===== Passport ===== */
const requireToken = passport.authenticate('bearer', { session: false })
/* ===== Generic error handler ===== */
const handle = require('../../lib/error_handler')
/* ===== Customer error handler ===== */
const customErrors = require('../../lib/custom_errors')
/* ===== 404 ===== */
const handle404 = customErrors.handle404
/* ===== User ownership verification ===== */
const requireOwnership = customErrors.requireOwnership
/* ===== Express router ===== */
const router = express.Router()
/* ===== ===== ===== * / 

/* ===== GET Verbs ===== */
// Index all /uploads resources
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
// Get a single /upload resource
// router.get('/uploads/:id', (req, res) => {
//   Upload.findById(req.params.id)
//     .then(handle404)
//     .then(upload => res.status(200).json({ upload: upload.toObject() }))
//     .catch(err => handle(err, res))
// })


/* ===== POST Verb ===== */
// Create a /uploads resource
router.post('/uploads', requireToken, upload.single('image'), (req, res) => {
  console.log('req.user is', req.user)
  const file = {
    path: req.file.path,
    title: req.body.title,
    originalname: req.file.originalname,
    foldername: req.user.email.substring(req.user.email.indexOf('@'), 0),
    userId: req.user.id
  }
/* ===== Amazon S3 ===== */
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

/* ===== PATCH Verb ===== */
// update one /uploads resource
router.patch('/uploads/:id', requireToken, (req, res) => {
  // sanitize user input
  delete req.body.upload.owner
  delete req.body.upload.url
  Upload.findById(req.params.id)
    .then(handle404)
    .then(upload => {
      requireOwnership(req, upload)
      // prevent saving empty strings to database
      Object.keys(req.body.upload).forEach(key => {
        if (req.body.upload[key] === '') {
          delete req.body.upload[key]
        }
      })
      return upload.update(req.body.upload)
    })
    // if that succeeded, return 204 instead of a JSON object
    .then(() => res.sendStatus(204))
    .catch(err => handle(err, res))
})


/* ===== DELETE VERB ===== */
// Destroy a /uploads resource
router.delete('/uploads/:id', requireToken, (req, res) => {
  // save the id into a variable we can re-use
  const deleteId = req.params.id
  Upload.findById(deleteId)
  .then(upload => {
    requireOwnership(req, upload)
    return upload
  })
    .then((object) => s3Delete(object))
    .then((data) => {
      Upload.findById(deleteId)
        .then(handle404)
        .then((upload) => upload.remove())
        .then(() => res.sendStatus(204))
        .catch(err => handle(err, res))
    })
    .catch(err => handle(err, res))
})

module.exports = router
