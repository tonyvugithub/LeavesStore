const mongoose = require('mongoose');

const Category = mongoose.model('Categories', new mongoose.Schema({
  title: String,
  src: String,
}));

exports.Category = Category;