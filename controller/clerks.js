const express = require('express');
const router = express.Router();
const admin = require('../middlewares/admin');
const {Product} = require('../models/product');
const {authUser, authAdmin, forwardAuthenticated} = require('../middlewares/authorize');
//const path = require('path');
const fetch = require('node-fetch');

router.get('/add', admin, (req,res) => {
  res.render('addProduct',{
    title: 'Add product',
    userLoggedIn: req.isAuthenticated(),
    userFirstname: req.isAuthenticated() ? req.user.firstname : "",
    isSaleClerk: req.isAuthenticated() && req.user.isSaleClerk ? true : false,
    dashboardLink: req.isAuthenticated() && req.user.isSaleClerk ? "/users/clerk/myaccount" : "/users/myaccount",
  });
});

router.post('/add', async (req,res) => {
  const {title, price, description, category, quantity} = req.body;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const userID = req.user._id;
  let file = req.files.productPhoto;
  const relativePath = `/img/products/${category}/${userID}${req.files.productPhoto.name}`
  const pathName = `./public${relativePath}`;
  const isBestSeller = req.body.isBestSeller === 'true' ? true : false;
  file.mv(pathName, function(err) {
    if (err)
      return res.status(500).send(err);
  });
  const product = new Product ({
    title: title,
    price: price,
    description: description,
    category: category,
    quantity: quantity,
    src: relativePath,
    isBestSeller: isBestSeller
  });

  await product.save();
  res.redirect('/clerks/add');
});

router.get('/modify', admin ,async (req,res) => {
  let products; 
  await fetch(`${process.env.BASE_URL}/api/product`)
      .then(res => res.json())
      .then(data => (products = data))
      .catch(err => console.log(err));
  res.render('modifyProduct',{
    products: products,
    title: 'Modify Product',
    userLoggedIn: req.isAuthenticated(),
    userFirstname: req.isAuthenticated() ? req.user.firstname : "",
    isSaleClerk: req.isAuthenticated() && req.user.isSaleClerk ? true : false,
    dashboardLink: req.isAuthenticated() && req.user.isSaleClerk ? "/users/clerk/myaccount" : "/users/myaccount",
  });
});

module.exports = router;