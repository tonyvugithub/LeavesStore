const {Product} = require('../models/product');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find().sort('category');
  res.send(products);
});

router.get('/:category', async (req, res) => {
  const products = await Product.find({category: req.params.category}).sort('category');
  res.send(products);
});

router.post('/', async (req, res) => {
  const {src,title,description,price,category,isBestSeller} = req.body;
  let product = new Product({ 
    src: src,
    title: title,
    description: description,
    price: price,
    category: category,
    isBestSeller: isBestSeller 
  });
  product = await product.save();
  res.send(product);
});

router.put('/:id', async(req, res) => {
  const obj = {};
  const {title, price, description, quantity} = req.body;
  if (title!=''){ obj.title = title;}
  if (price!=''){ obj.price = price;}
  if (description!=''){ obj.description = description;}
  if (quantity!=''){ obj.quantity = quantity;}
  const product = await Product.findByIdAndUpdate(
    req.params.id, 
    obj,
    {
      new: true
    }
  );
  if(!product) return res.status(404).send("Product with the given ID does not exist.");
  res.redirect(`/clerks/modify`);
});

router.delete('/:id',async(req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  if(!product) return res.status(404).send("Product with the given ID does not exist.");
  res.redirect(`/clerks/modify`);
});

module.exports = router;