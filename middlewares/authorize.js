module.exports = {
  authUser : function(req, res, next) {
    if(req.isAuthenticated() && !req.user.isSaleClerk){
      next();
    } else {
      if(!req.isAuthenticated()) return res.status(401).redirect('/users/signin');
      if(req.user.isSaleClerk) return res.redirect('/users/clerk/myaccount');
    }
  },
  authAdmin : function(req, res, next) {
    if(req.isAuthenticated() && req.user.isSaleClerk){
      next();
    } else {
      return res.status(401).redirect('/users/signin');
    }
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    else {
      res.redirect(req.user.isSaleClerk ? '/users/clerk/myaccount' : '/users/myaccount');
    }      
  }
} 

