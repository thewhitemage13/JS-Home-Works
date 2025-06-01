let shoppingList = [
  { product: "Хліб", quantity: 1, bought: false },
  { product: "Молоко", quantity: 2, bought: true },
  { product: "Яблука", quantity: 5, bought: false }
];

function showShoppingList(list) {
  const sorted = [...list].sort((a, b) => a.bought - b.bought);
  console.log("Список покупок:");
  sorted.forEach(item => {
    console.log(`${item.product}, кількість: ${item.quantity}, куплено: ${item.bought}`);
  });
}

function addProduct(productName, quantity) {
  let existing = shoppingList.find(item => item.product === productName);
  if (existing) {
    existing.quantity += quantity;
  } else {
    shoppingList.push({ product: productName, quantity, bought: false });
  }
}

function buyProduct(productName) {
  let product = shoppingList.find(item => item.product === productName);
  if (product) {
    product.bought = true;
  }
}
