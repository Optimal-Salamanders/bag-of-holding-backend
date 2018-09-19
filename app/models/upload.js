const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  tag: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Upload', uploadSchema)
