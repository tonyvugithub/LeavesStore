const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

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
    userFirstname: req.isAuthenticated() ? req.user.firstname : "",
    dashboardLink:
      req.isAuthenticated() && req.user.isSaleClerk
        ? "/users/clerk/myaccount"
        : "/users/myaccount",
  });
});

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
      dashboardLink:
        req.isAuthenticated() && req.user.isSaleClerk ? "/users/clerk/myaccount" : "/users/myaccount",
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
      userFirstname: req.isAuthenticated() ? req.user.firstname : "",
      dashboardLink:
        req.isAuthenticated() && req.user.isSaleClerk ? "/users/clerk/myaccount" : "/users/myaccount",
    });
  }
});

module.exports = router;
