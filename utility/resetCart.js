module.exports = function resetCart(req) {
  req.session.cartData.arrOfItems = [];
  req.session.cartData.total = 0;
}