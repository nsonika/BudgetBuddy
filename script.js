const balanceElement = document.getElementById("balance");
const moneyPlusElement = document.getElementById("money-plus");
const moneyMinusElement = document.getElementById("money-minus");
const listElement = document.getElementById("list");
const formElement = document.getElementById("form");
const textElement = document.getElementById("text");
const amountElement = document.getElementById("amount");

let transactions = [];
let editID = null;

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add transaction to the list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <div class="edit-delete">
      <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button>
    </div>
  `;

  listElement.appendChild(item);
}

// Update the balance, income, and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balanceElement.innerText = `₹${total}`;
  moneyPlusElement.innerText = `₹${income}`;
  moneyMinusElement.innerText = `₹${expense}`;
}

// Add a new transaction
function addTransaction(e) {
  e.preventDefault();
  if (textElement.value.trim() === "" || amountElement.value.trim() === "") {
    alert("Please enter text and amount");
  } else {
    const text = textElement.value;
    const amount = +amountElement.value;

    if (editID) {
      transactions = transactions.map(transaction => {
        if (transaction.id === editID) {
          return { ...transaction, text, amount };
        }
        return transaction;
      });

      editID = null;
    } else {
      const transaction = {
        id: generateID(),
        text,
        amount
      };
      transactions.push(transaction);
    }

    updateLocalStorage();
    init();

    textElement.value = "";
    amountElement.value = "";
  }
}

// Delete a transaction
function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Edit a transaction
function editTransaction(id) {
  const transaction = transactions.find(transaction => transaction.id === id);

  if (transaction) {
    editID = id;
    textElement.value = transaction.text;
    amountElement.value = Math.abs(transaction.amount);
  }
}

// Initialize the application
function init() {
  listElement.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Load transactions from local storage
function loadTransactions() {
  const transactionsData = JSON.parse(localStorage.getItem("transactions"));

  if (transactionsData) {
    transactions = transactionsData;
    init();
  }
}

// Event listeners
formElement.addEventListener("submit", addTransaction);

// Load transactions on initial load
loadTransactions();
