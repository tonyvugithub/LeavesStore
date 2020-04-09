const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/', async (req, res) => {
  let products, categories;
  await fetch(`${process.env.BASE_URL}/api/product`)
    .then(res => res.json())
    .then(data => (products = data))
    .catch(err => console.log(err));

  await fetch(`${process.env.BASE_URL}/api/category`)
    .then(res => res.json())
    .then(data => (categories = data))
    .catch(err => console.log(err));

  res.render('home', {
    title: 'Home',
    categories: categories,
    bestSellers: products.filter(product => product.isBestSeller == true),
    home_active: true,
    topPromote: 'Free Shipping on Order more than $50',
    userLoggedIn: req.isAuthenticated(),
    isSaleClerk: req.isAuthenticated() && req.user.isSaleClerk ? true : false,
    userFirstname: req.isAuthenticated() ? req.user.firstname : "",
    dashboardLink: req.isAuthenticated() && req.user.isSaleClerk ? '/users/clerk/myaccount' : '/users/myaccount',
    numItems: req.session.cartData && req.session.cartData.arrOfItems.length > 0 ? req.session.cartData.arrOfItems.length : 0,
  });
});

module.exports = router;
