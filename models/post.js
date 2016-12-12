var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title:         { type: String,  required: true },
  },
  { timestamps: true }  // createdAt, updatedAt
);

module.exports = mongoose.model('Post', PostSchema);
