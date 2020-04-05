const {Category} = require('../models/category');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const categories = await Category.find().sort('title');
  res.send(categories);
});

router.post('/', async (req, res) => {
  const {title, src} = req.body;
  let category = new Category({ 
    title: title,
    src: src
  });
  category = await category.save();
  res.send(category);
});

module.exports = router;