const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Product = mongoose.model('Products', new mongoose.Schema({
  src: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required:true,
    maxlength: 255
  },
  description: {
    type: String,
    required: true,
    maxlength: 255
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  isBestSeller: {
    type: Boolean
  }
}));

function validateProduct(req){
  const schema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    quantity: Joi.number().integer().required(),
    isBestSeller: Joi.boolean()
  });
  return schema.validate(req, { abortEarly : false });
};

exports.Product = Product;
exports.validateProduct = validateProduct;