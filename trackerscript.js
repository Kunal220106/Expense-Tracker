const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const incomeForm = document.getElementById('income-form');
const monthlyIncomeInput = document.getElementById('monthly-income');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let monthlyIncome = Number(localStorage.getItem('monthlyIncome')) || 0;

// Add new transaction - treats all amounts as expenses
function addTransaction(e) {
  e.preventDefault();
  if(text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add both text and amount');
    return;
  }
  const transaction = {
    id: generateID(),
    text: text.value,
    amount: Math.abs(+amount.value) // Always positive, treated as expense
  };
  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  text.value = '';
  amount.value = '';
}

// Set monthly income
incomeForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const incomeValue = Number(monthlyIncomeInput.value);
  if (isNaN(incomeValue) || incomeValue < 0) {
    alert('Enter a valid monthly income');
    return;
  }
  monthlyIncome = incomeValue;
  localStorage.setItem('monthlyIncome', monthlyIncome);
  updateValues();
  monthlyIncomeInput.value = '';
});

// Generate random ID for transaction
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add transaction item to history list
function addTransactionDOM(transaction) {
  const item = document.createElement("li");
  item.classList.add("minus"); // treat all as expenses
  item.innerHTML = `
    ${transaction.text} <span>₹${transaction.amount}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(item);
}

// Update displayed values
function updateValues() {
  const totalExpense = transactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const remainingMoney = monthlyIncome - totalExpense;

  money_plus.innerHTML = `+₹${monthlyIncome.toFixed(2)}`;
  money_minus.innerHTML = `-₹${totalExpense.toFixed(2)}`;
  
  const remainingElem = document.getElementById("remaining");
  if (remainingElem) {
    remainingElem.innerHTML = `Remaining: ₹${remainingMoney.toFixed(2)}`;
  }

  balance.innerHTML = `₹${monthlyIncome.toFixed(2)}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  Init();
}

// Update transactions in localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app UI on load
function Init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

Init();
form.addEventListener('submit', addTransaction);
