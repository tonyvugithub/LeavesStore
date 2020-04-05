const express = require('express');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const { User } = require("../models/user");

const router = express.Router();

router.get('/', async (req, res) => {
  let products, categories;
  const host = req.get('host')
  await fetch(`${host}/api/product`)
    .then(res => res.json())
    .then(data => (products = data))
    .catch(err => console.log(err));

  await fetch(`${host}/api/category`)
    .then(res => res.json())
    .then(data => (categories = data))
    .catch(err => console.log(err));

  let user;
  if(req.cookies.userJwtToken){
    const payLoad = jwt.verify(req.cookies.userJwtToken, process.env.ACCESS_TOKEN_SECRET);
    user = await User.findOne({email:payLoad.email});
  }
  res.render('home', {
    title: 'Home',
    categories: categories,
    bestSellers: products.filter(product => product.isBestSeller == true),
    home_active: true,
    topPromote: 'Free Shipping on Order more than $50',
    userLoggedIn: req.isAuthenticated(),
    userFirstname: req.isAuthenticated() ? req.user.firstname : "",
    dashboardLink: req.isAuthenticated() && req.user.isSaleClerk ? '/users/clerk/myaccount' : '/users/myaccount'
  });
});

module.exports = router;
