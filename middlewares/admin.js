module.exports = function(req,res,next) {
  if(!req.user.isSaleClerk) {
    return res.status(403).redirect('/');
  }
  next();
}