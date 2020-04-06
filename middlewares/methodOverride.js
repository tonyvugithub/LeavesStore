module.exports = function(req,res,next){
  if (req.query._method == "PUT"){
    req.method = "PUT"
  } 
  else if (req.query._method == "DELETE"){
    req.method = "DELETE"
  }
  next();
}