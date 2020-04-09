const emailGenerator = (orderedItemList) => {
  let orderConfirmation = 'Thank you for shopping with us <br> Please find below your receipt for the order <br> <hr>'
  let total = 0;
  orderedItemList.forEach(item => {
    orderConfirmation += `Product: ${item.title}. Quantity: ${item.orderedQuantity} <br>`;
    total += item.price * item.orderedQuantity; 
  });
  orderConfirmation += '<hr>'
  orderConfirmation += `Total Cost: ${total}`;
  return orderConfirmation;
};

module.exports = emailGenerator;