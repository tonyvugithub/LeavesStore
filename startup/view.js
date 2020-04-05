const exphbs = require('express-handlebars');


module.exports = function(app) {
  //Set View Engine
  app.engine('handlebars', exphbs());
  app.set('view engine', 'handlebars');
};
