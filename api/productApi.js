const {Product} = require('../models/product');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find().select('_id src title description price quantity').sort('category');
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
  const product = await Product.findByIdAndUpdate(
    req.params.id, 
    req.body,
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