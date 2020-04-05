const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  lastname: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024 //For hashing, what will be in MongoDB
  },
  isSaleClerk: Boolean
});

//userSchema.methods return an object that you can set key value pair
//This is part of the user object
userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this._id, email: this.email, isSaleClerk: this.isSaleClerk } , process.env.ACCESS_TOKEN_SECRET);
  return token;
};

const User = mongoose.model('Users', userSchema);

function validateSignup(req) {
  const schema = Joi.object({
    firstname: Joi.string()
      .alphanum()
      .min(1)
      .max(255)
      .required(),
    lastname: Joi.string()
      .alphanum()
      .min(1)
      .max(255)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})")
    ),
    repassword: Joi.ref("password")
  }).with("password", "repassword");
  return schema.validate(req, { abortEarly: false });
}

function validateSignin(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
    }).with('email','password');
  return schema.validate(req, { abortEarly: false });
}

exports.User = User;
exports.validateSignup = validateSignup;
exports.validateSignin = validateSignin;