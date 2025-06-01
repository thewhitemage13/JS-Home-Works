let receipt = [
  { name: "Молоко", quantity: 2, price: 25 },
  { name: "Хліб", quantity: 1, price: 18 },
  { name: "Сир", quantity: 1, price: 80 }
];

function printReceipt(receipt) {
  console.log("Чек:");
  receipt.forEach(item => {
    console.log(`${item.name} — ${item.quantity} x ${item.price} = ${item.quantity * item.price} грн`);
  });
}

function totalAmount(receipt) {
  return receipt.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

function mostExpensive(receipt) {
  return receipt.reduce((max, item) => 
    (item.price * item.quantity > max.price * max.quantity ? item : max)
  );
}

function averagePrice(receipt) {
  let totalItems = receipt.reduce((sum, item) => sum + item.quantity, 0);
  return totalAmount(receipt) / totalItems;
}
