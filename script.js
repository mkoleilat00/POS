let inventory = [];
let cart = [];
let salesLog = [];

function addInventory() {
  const name = document.getElementById("item-name").value;
  const base = parseFloat(document.getElementById("base-price").value);
  const margin = parseFloat(document.getElementById("profit-margin").value);
  const upc = document.getElementById("upc").value;

  if (!name || isNaN(base) || isNaN(margin) || !upc) return alert("Please fill out all fields correctly.");

  const price = (base * (1 + margin / 100)).toFixed(2);
  const item = { name, base, margin, price: parseFloat(price), upc };
  inventory.push(item);
  displayInventory();
}

function displayInventory() {
  const ul = document.getElementById("inventory");
  ul.innerHTML = "";
  inventory.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - $${item.price} <button onclick="addToCart(${index})">Add to Cart</button>`;
    ul.appendChild(li);
  });
}

function addToCart(index) {
  const item = inventory[index];
  cart.push(item);
  displayCart();
}

function displayCart() {
  const ul = document.getElementById("cart");
  ul.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    ul.appendChild(li);
    total += item.price;
  });
  document.getElementById("total").textContent = total.toFixed(2);
}

function checkout() {
  const now = new Date();
  cart.forEach(item => {
    salesLog.push({ item: item.name, price: item.price, date: now });
  });
  cart = [];
  displayCart();
  alert("Checkout complete!");
}

function showSales(period) {
  const now = new Date();
  let start;

  switch (period) {
    case "daily":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly":
      const day = now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
      break;
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  const filtered = salesLog.filter(s => new Date(s.date) >= start);
  const totalSales = filtered.reduce((sum, s) => sum + s.price, 0);

  const itemCounts = {};
  filtered.forEach(s => {
    itemCounts[s.item] = (itemCounts[s.item] || 0) + 1;
  });

  let topItem = "N/A";
  let maxCount = 0;
  for (let item in itemCounts) {
    if (itemCounts[item] > maxCount) {
      maxCount = itemCounts[item];
      topItem = item;
    }
  }

  document.getElementById("sales-summary").textContent = `Total ${period} sales: $${totalSales.toFixed(2)} (${filtered.length} items sold)`;
  document.getElementById("top-item").textContent = topItem;
}
