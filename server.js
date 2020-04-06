require('express-async-errors');
require('dotenv').config({path:"./config/keys.env"});

const express = require("express");
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
//const FileStore = require('session-file-store')(session);

//Authentication Packages
const session = require('express-session');
const passport = require('passport');

//Create express app object 
const app = express();

require('./config/passport-config')(passport);

//Load database MongoDB
require('./startup/db')();

//Load the view engine
require('./startup/view')(app);

//Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(require('./middlewares/methodOverride'));
app.use(session({
  genid: (req) => uuidv4(),
  //store: new FileStore(),
  secret: process.env.SESS_SECRET,
  resave: true,
  //You dont want an uninitialized cookie to be stored on client
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//Set up all the routes and middlewares
require('./startup/routes')(app);

//PORT listening
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("web server is established");
});
