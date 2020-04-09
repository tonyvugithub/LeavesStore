const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

//Route to display product page
router.get("/", async (req, res) => {
  let categories;
  await fetch(`${process.env.BASE_URL}/api/category`)
    .then((res) => res.json())
    .then((data) => (categories = data))
    .catch((err) => console.log(err));
  res.render("products", {
    title: "Products Page",
    categories: categories,
    products_active: true,
    topPromote: "Free Shipping on Order more than $50",
    userLoggedIn: req.isAuthenticated(),
    isSaleClerk: req.isAuthenticated() && req.user.isSaleClerk ? true : false,
    userFirstname: req.isAuthenticated() ? req.user.firstname : "",
    dashboardLink: req.isAuthenticated() && req.user.isSaleClerk ? "/users/clerk/myaccount" : "/users/myaccount",
    numItems: req.session.cartData && req.session.cartData.arrOfItems.length > 0 ? req.session.cartData.arrOfItems.length : 0,
  });
});

//Route to display products by category
router.get("/collection", async (req, res) => {
  let products, categories;

  //Call to categoryAPI to fetch all categories
  await fetch(`${process.env.BASE_URL}/api/category`)
    .then((res) => res.json())
    .then((data) => (categories = data))
    .catch((err) => console.log(err));

  if (req.query.sortBy == "all") {
    //Call to productAPI to fetch data of ALL product
    await fetch(`${process.env.BASE_URL}/api/product`)
      .then((res) => res.json())
      .then((data) => (products = data))
      .catch((err) => console.log(err));

    res.render("products", {
      title: "Products Page",
      categories: categories,
      productList: products,
      products_active: true,
      categoryTitle: "full",
      topPromote: "Buy One, Get One Free",
      userLoggedIn: req.isAuthenticated(),
      userFirstname: req.isAuthenticated() ? req.user.firstname : "",
      dashboardLink: req.isAuthenticated() && req.user.isSaleClerk ? "/users/clerk/myaccount" : "/users/myaccount",
    });
  } else {
    //Call to productAPI to fetch data of provided CATEGORY
    await fetch(`${process.env.BASE_URL}/api/product/${req.query.sortBy}`)
      .then((res) => res.json())
      .then((data) => (products = data))
      .catch((err) => console.log(err));

    res.render("products", {
      title: "Products Page",
      categories: categories,
      productList: products,
      products_active: true,
      categoryTitle: req.params.sortBy,
      topPromote: "Buy One, Get One Free",
      userLoggedIn: req.isAuthenticated(),
      isSaleClerk: req.isAuthenticated() && req.user.isSaleClerk ? true : false,
      userFirstname: req.isAuthenticated() ? req.user.firstname : "",
      dashboardLink: req.isAuthenticated() && req.user.isSaleClerk ? "/users/clerk/myaccount" : "/users/myaccount",
      numItems: req.session.cartData && req.session.cartData.arrOfItems.length > 0 ? req.session.cartData.arrOfItems.length : 0,
    });
  }

  //Route to display single product description
  router.get('/:id', async (req,res) => {
    let product;
    await fetch(`${process.env.BASE_URL}/api/product/info/${req.params.id}`)
      .then((res) => res.json())
      .then((data) => product = data)
      .catch((err) => console.log(err));
    res.render('productDescription', {
      product: product,
      inStock: product.quantity > 0 ? true :  false,
      userLoggedIn: req.isAuthenticated(),
    userFirstname: req.isAuthenticated() ? req.user.firstname : "",
    isSaleClerk: req.isAuthenticated() && req.user.isSaleClerk ? true : false,
    dashboardLink: req.isAuthenticated() && req.user.isSaleClerk ? "/users/clerk/myaccount" : "/users/myaccount",
    numItems: req.session.cartData && req.session.cartData.arrOfItems.length > 0 ? req.session.cartData.arrOfItems.length : 0,
    });
  });
});

module.exports = router;
