const form = document.getElementById('transactionForm');

const availableTransactions = [
  {
    id: 1,
    date: new Date(2024, 1, 20),
    amount: 75.2,
    description: 'Groceries',
    notes: 'Weekly grocery shopping',
    type: 'Expense',
  },
  {
    id: 2,
    date: new Date(2024, 3, 15),
    amount: 50.0,
    description: 'Transportation',
    notes: 'Uber ride to work',
    type: 'Expense',
  },
  {
    id: 3,
    date: new Date(2024, 4, 10),
    amount: 120.0,
    description: 'Dining Out',
    notes: 'Dinner with friends',
    type: 'Expense',
  },
  {
    id: 4,
    date: new Date(2024, 5, 5),
    amount: 1000.0,
    description: 'Salary',
    notes: 'Monthly paycheck',
    type: 'Income',
  },
];

const defaultTransaction = {
  id: getUniqueId(),
  date: new Date(),
  amount: null,
  description: null,
  notes: null,
  type: null,
};

const descriptions = [
  'Groceries',
  'Rent/Mortgage',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Health Care',
  'Education',
  'Debt',
  'Donation',
  'Salary',
  'Other',
];

const users = [user1];

const user = {
  id: getUniqueId(users),
  name: null,
  lastName: null,
  balance: null,
  transactions: [],
};

const user1 = {
  id: 1,
  name: 'Jacob',
  lastName: 'Mouawad',
  balance: null,
  transactions: [
    {
      id: 1,
      date: new Date(2024, 1, 20),
      amount: 75.2,
      description: 'Groceries',
      notes: 'Weekly grocery shopping',
      type: 'Expense',
    },
    {
      id: 2,
      date: new Date(2024, 3, 15),
      amount: 50.0,
      description: 'Transportation',
      notes: 'Uber ride to work',
      type: 'Expense',
    },
    {
      id: 3,
      date: new Date(2024, 4, 10),
      amount: 120.0,
      description: 'Dining Out',
      notes: 'Dinner with friends',
      type: 'Expense',
    },
    {
      id: 4,
      date: new Date(2024, 5, 5),
      amount: 1000.0,
      description: 'Salary',
      notes: 'Monthly paycheck',
      type: 'Income',
    },
  ],
};

const types = ['Income', 'Expense'];

let currentUser = null;

const loadCurrentUser = () => {
  if ((currentUser = JSON.parse(localStorage.getItem('currentUser')))) {
    console.log('current in home', currentUser);
  }
};

const logout = () => {
  localStorage.removeItem('currentUser');
  currentUser = null;
};

const getUniqueId = (array) => {
  if (array.length === 0) {
    return 1;
  }
  const latestId = array[array.length - 1].id;
  return latestId + 1;
};

const calculateBalance = (transactions) => {
  let balance = 0;

  transactions.forEach((transaction) => {
    balance += transaction.type === 'Income' ? transaction.amount : -transaction.amount;
  });

  return balance;
};

const addTransaction = (user, transaction) => {
  user.transactions.push(transaction);
};

const createTransaction = () => {
  const dateInput = new Date(document.getElementById('dateInput').value);
  const amountInput = parseFloat(document.getElementById('amountInput').value);
  const descriptionInput = document.getElementById('descriptionInput').value;
  const notesInput = document.getElementById('notesInput').value;
  const typeInput = document.getElementById('typeInput').value;

  return {
    id: getUniqueId(),
    dateInput,
    amountInput,
    descriptionInput,
    notesInput,
    typeInput,
  };
};

// Add Transaction-Form Listener
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const transaction = createTransaction();

  addTransaction(user, transaction);

  form.reset();
});

loadCurrentUser();
