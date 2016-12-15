var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var PostEntry = require('./postEntry');

var UserSchema = new mongoose.Schema({
  local : {
    email    : String,
    password : String
  }
});

UserSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
