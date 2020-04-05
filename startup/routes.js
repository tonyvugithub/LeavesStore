const express = require('express');

//Import Router modules
const homeRouter = require('../controller/home');
const productsRouter = require('../controller/products');
const clerkRouter = require('../controller/clerks');
const usersRouter = require('../controller/users');
const productApi = require('../api/productApi');
const categoryApi = require('../api/categoryApi');
module.exports = function(app) {
  //Use Routers
  app.use('/api/product',productApi);
  app.use('/api/category',categoryApi);
  app.use('/', homeRouter);
  app.use('/products', productsRouter);
  app.use('/clerks', clerkRouter);
  app.use('/users', usersRouter);
};
