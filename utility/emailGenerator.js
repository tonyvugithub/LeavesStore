module.exports = function emailGenerator (orderedItemList) {
  let orderConfirmation = 'Thank you for shopping with us <br/> Please find below your receipt for the order <br/> <hr/>'
  let total = 0;
  orderConfirmation += `<table style='text-align: left; table-layout:fixed; width: 400px'>
    <caption style='font-weight: bold; font-size: 1.5em; text-align: left;'>Order Summary</caption>
    <tr style='font-size: 1.2em;'>
      <th>Name</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>`;
  orderedItemList.forEach(item => {
    total += item.price * item.orderedQuantity;
    orderConfirmation += `
    <tr style='font-size: 1.2em;'>
      <td>${item.title}</td>
      <td>${item.orderedQuantity}</td>
      <td>$${item.price}</td>
    </tr>`;
  });
  orderConfirmation += '</table><br/><hr/>'
  orderConfirmation += `<span style='font-size: 1.2em;'><strong>Total Cost:</strong> $${total.toFixed(2)}</span>`;
  return orderConfirmation;
};;