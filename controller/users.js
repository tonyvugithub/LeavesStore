const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const passport = require('passport');
const { User, validateSignup, validateSignin } = require("../models/user");
const router = express.Router();
const admin = require('../middlewares/admin');
const {authUser, authAdmin, forwardAuthenticated} = require('../middlewares/authorize');
const { Product } = require('../models/product');

//Route to display registration page
router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("signup", {
    title: "Signup Page",
    signup_active: true
  });
});

//Route to register user into database
router.post("/register", async (req, res) => {
    const { firstname, lastname, email, password, repassword } = req.body;

    const { error } = validateSignup(req.body);

    let firstnameErrMsg = "";
    let lastnameErrMsg = "";
    let emailErrMsg = "";
    let passwordErrMsg = "";
    let repasswordErrMsg = "";

    if (!error) {
      //If the data input is valid, transfer it to the userAPI POST request to save to the database
      let user = await User.findOne({ email: email });
      if (user)
        return res
          .status(400)
          .send(
            "Email is already registered. Please choose a different email or log in."
          );

      //Using lodash to pick fields from req.body
      user = new User(
        _.pick(req.body, ["lastname", "firstname", "email", "password"])
      );

      //Hash the password using bcrypt module
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      user = await user.save();
      //Send email confirmation to new user
      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: `${email}`,
        from: "ken.k.vu@gmail.com",
        subject: "Tony E-shop Registration Confirmation",
        html: `Welcome <strong>${firstname} ${lastname}</strong> to Tony E-Shop`
      };

      sgMail
        .send(msg)
        .then(() =>
          res.redirect(`/users/signin`)
        )
        .catch(err => res.send(new Error(err)));
    } 
    else {
      error.details.forEach(e => {
        if (e.path[0] === "firstname" && e.type === "string.empty")
          firstnameErrMsg = "Enter your first name";
        else if (e.path[0] === "lastname" && e.type === "string.empty")
          lastnameErrMsg = "Enter your last name";
        else if (e.path[0] === "email" && e.type === "string.empty")
          emailErrMsg = "Enter your email";
        else if (e.path[0] === "password" && e.type === "string.empty")
          passwordErrMsg = "Enter your password";
        else if (e.path[0] === "firstname" && e.type === "string.alphanum")
          firstnameErrMsg =
            "No space, number, or special character in first name";
        else if (e.path[0] === "lastname" && e.type === "string.alphanum")
          lastnameErrMsg =
            "No space, number, or special character in first name";
        else if (e.path[0] === "password" && e.type === "string.pattern.base")
          passwordErrMsg =
            "Password must have at least 6 characters and include 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character";
      });

      //Checking password pattern and match
      if (!passwordErrMsg && !repassword) {
        repasswordErrMsg = "Type your password again";
      } else if (password !== repassword && repassword) {
        repasswordErrMsg = "Passwords must match!";
      }

      //Rerender the page if errors persist
      res.render("signup", {
        title: "Signup Page",
        firstnameError: firstnameErrMsg,
        lastnameError: lastnameErrMsg,
        emailError: emailErrMsg,
        passwordError: passwordErrMsg,
        repasswordError: repasswordErrMsg,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
      });
    }
});

//Route to display signin page
router.get("/signin", forwardAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("signin", {
    title: "Signin Page",
    signin_active: true
  });
});

//Route to authenticate user
router.post("/signin", async (req, res, next) => {
  let emailErrMsg = "";
  let passwordErrMsg = "";
  const { email } = req.body;

  const { error } = validateSignin(req.body);
  if (error) {
    error.details.forEach(e => {
      if (e.path[0] === "email" && e.type === "string.empty")
        emailErrMsg = "Enter your email";
      else if (e.path[0] === "password" && e.type === "string.empty")
        passwordErrMsg = "Enter your password";
    });
    res.render("signin", {
      title: "Signin Page",
      emailError: emailErrMsg,
      passwordError: passwordErrMsg,
      email: email
    });
  } 
  else {
    const user = await User.findOne( { email } );
    if (!user) return res.render('signin',{errMessage:'Invalid email or password'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.render('signin',{errMessage:'Invalid email or password'});

    //Passport authentication using local strategy
    passport.authenticate('local', (err, user, info) => {
      //Custom call back, need to call login()
      req.login(user, err => next(err));
      //If the user logged in is a sale clerk, direct to the clerk dashboard
      if(user.isSaleClerk) return res.redirect('/users/clerk/myaccount');
      //Else direct to the regular dashboard
      return res.redirect('/users/myaccount');
    })(req, res, next);
  }
});

//Route to logout user
router.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/users/signin');
});

//Route to display regular user dashboard
router.get('/myaccount/', authUser,(req,res) => {
  res.render('userDashboard',{
    title: 'User Dashboard',
    firstname: req.user.firstname,
    lastname: req.user.lasttname,
    userLoggedIn: req.isAuthenticated(),
    userFirstname: req.isAuthenticated() ? req.user.firstname : "",
    isSaleClerk: req.isAuthenticated() && req.user.isSaleClerk ? true : false,
    dashboardLink: '/users/myaccount/',
    numItems: req.session.cartData && req.session.cartData.length > 0 ? req.session.cartData.length : 0
  });
});

//Route to display clerk dashboard
router.get('/clerk/myaccount/', [authAdmin, admin], async (req,res) => {
  res.render('clerkDashboard',{
    title: 'Inventory Clerk Dashboard',
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    userLoggedIn: req.isAuthenticated(),
    userFirstname: req.isAuthenticated() ? req.user.firstname : "",
    isSaleClerk: req.isAuthenticated() && req.user.isSaleClerk ? true : false,
    dashboardLink: '/users/clerk/myaccount/'
  });
});

//Route to get the original look of the cart
router.get('/cart', authUser, (req, res) => {
  res.render('cart',{
    title: 'Shopping Cart',
    cartData: req.session.cartData,
    userLoggedIn: req.isAuthenticated(),
    userFirstname: req.isAuthenticated() ? req.user.firstname : "",
    isSaleClerk: req.isAuthenticated() && req.user.isSaleClerk ? true : false,
    dashboardLink: req.isAuthenticated() && req.user.isSaleClerk ? "/users/clerk/myaccount" : "/users/myaccount",
    numItems: req.session.cartData && req.session.cartData.length > 0 ? req.session.cartData.length : 0
  });
});

//Route to add product to cart
router.post('/cart', async(req, res) => {
  const product = (await Product.findById(req.query.productId).select('_id src title description price')).toObject();
  product.orderedQuantity = parseInt(req.body.orderedQuantity);
  if(req.session.cartData){
    const index = req.session.cartData.findIndex((e) => e._id == req.query.productId);
    if(index !== -1){
      req.session.cartData[index].orderedQuantity += parseInt(req.body.orderedQuantity);  
    } else {
      req.session.cartData.push(product);
    }
  } else {
    const cartData = [];
    cartData.push(product);
    req.session.cartData = cartData;
  }
  res.redirect(`/products/${req.query.productId}`);
});

//Route to delete the item from cart
router.delete('/cart/delete', async(req, res) => {
  const indexFound = req.session.cartData.findIndex((e) => e._id === req.query.productId);
  console.log(indexFound);
  req.session.cartData.splice(indexFound,1);
  res.redirect('/users/cart');
});

//Route to empty cart
router.delete('/cart/delete/all', async(req, res) => {
  req.session.cartData = null;
  res.redirect('/users/cart');
});

//Route to update quantity ordered for a specific item
router.put('/cart/edit', async(req, res) => {
  const productFound = req.session.cartData.find((e) => e._id === req.query.productId);
  productFound.orderedQuantity = req.body.orderedQuantity;
  res.redirect('/users/cart');
});
module.exports = router;
