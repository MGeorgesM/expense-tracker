const transactionsContainer = document.getElementById('transactions-container');
const addTransactionBtn = document.getElementById('add-transaction-btn');

const submitTransactionBtn = document.getElementById('submit-transaction-btn');
const addTransactionModal = document.getElementById('add-transaction-modal');
const addTransactionModalOverlay = document.getElementById('modal-bg');
const cancelAddTransactionBtn = document.getElementById('cancel-add-transaction-btn');

const incomeFilter = document.getElementById('income-filter');
const expenseFilter = document.getElementById('expense-filter');
const currencyFilter = document.getElementById('currency-filter');
const amountToFilter = document.getElementById('amount-to-filter');
const amountFromFilter = document.getElementById('amount-from-filter');

let currentUser = null;
let currentUserTransactions = [];
let fitleredTransactions = [];
let incomeFilterApplied = false;
let expenseFilterApplied = false;

// const defaultTransaction = {
//     id: getUniqueId(),
//     date: new Date(),
//     amount: null,
//     currency: 'USD',
//     description: null,
//     type: null,
// };

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



// const defaultUser = {
//     id: getUniqueId(users),
//     name: null,
//     lastName: null,
//     balance: null,
//     transactions: [],
// };

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
            currency: 'USD',
            description: 'Groceries',
            type: 'Expense',
        },
        {
            id: 2,
            date: new Date(2024, 3, 15),
            amount: 50.0,
            currency: 'USD',
            description: 'Transportation',
            type: 'Expense',
        },
        {
            id: 3,
            date: new Date(2024, 4, 10),
            amount: 120.0,
            currency: 'USD',
            description: 'Dining Out',
            type: 'Expense',
        },
        {
            id: 4,
            date: new Date(2024, 5, 5),
            amount: 1000.0,
            currency: 'USD',
            description: 'Salary',
            type: 'Income',
        },
    ],
};

const users = [user1];

const types = ['Income', 'Expense'];

const loadCurrentUser = () => {
    if ((currentUser = JSON.parse(localStorage.getItem('currentUser')))) {
        currentUserTransactions = currentUser.transactions;
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

const populateTransaction = (transaction) => {
    transactionsContainer.innerHTML += ``;
};

const populateTransactions = (transactions) => {
    transactionsContainer.innerHTML = '';
    transactions.forEach((transaction) => {
        populateTransaction(transaction);
    });
};

const addTransactionToUser = (user, transaction) => {
    user.transactions.push(transaction);
};

const createTransactionFromInput = () => {
    const dateInput = new Date(document.getElementById('dateInput').value);
    const amountInput = parseFloat(document.getElementById('amountInput').value);
    const descriptionInput = document.getElementById('descriptionInput').value;
    const currencyInput = document.getElementById('currencyInput').value;
    const typeInput = document.getElementById('typeInput').value;

    return {
        id: getUniqueId(),
        date: dateInput,
        amount: amountInput,
        currency: currencyInput,
        description: descriptionInput,
        type: typeInput,
    };
};

const removeTransation = (user, transactionToRemove) => {
    user.transaction = user.transactions.filter((transaction) => transaction !== transactionToRemove);
};

const editTransaction = (user, transactionId, updatedTransaction) => {
    const transaction = user.transactions.find((transaction) => transaction.id === transactionId);
    if (transaction) {
        for (let property in updatedTransaction) {
            transaction[property] = updatedTransaction[property];
        }
    } else {
        throw new Error('Transaction not Found');
    }
};

// Filters

const filterByTransactionType = (type, transactions) => {
    const filterResult = transactions.filter((transaction) => transaction.type === type) || currentUserTransactions;
    populateTransactions(filterResult.length > 0 ? filterResult : currentUserTransactions);
};

const filterByAmountTo = (amountTo, transactions) => {
    const filterResult =
        transactions.filter((transaction) => transaction.amount <= amountTo) || currentUserTransactions;
    populateTransactions(filterResult.length > 0 ? filterResult : currentUserTransactions);
};

const filterByAmountFrom = (amountFrom, transactions) => {
    const filterResult =
        transactions.filter((transaction) => transaction.amount > amountFrom) || currentUserTransactions;
    populateTransactions(filterResult.length > 0 ? filterResult : currentUserTransactions);
};

const filterByCurrency = (currency, transactions) => {
    const filterResult =
        transactions.filter((transaction) => transaction.currency === currency) || currentUserTransactions;
    populateTransactions(filterResult.length > 0 ? filterResult : currentUserTransactions);
};

// Modal
const showAddTransactionModal = () => {
    addTransactionModal.classList.remove('hidden');
    addTransactionModalOverlay.classList.add('modal-overlay');
    
};

const closeAddTransactionModal = () => {
    addTransactionModal.classList.add('hidden');
    add.classList.remove('modal-overlay');
};

// Add Transaction-Form Listener
submitTransactionBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const transaction = createTransactionFromInput();

    addTransactionToUser(currentUser, transaction);

    closeAddTransactionModal();
});

cancelAddTransactionBtn.addEventListener('click', () => closeAddTransactionModal());

// Filter Listeners

//Add Transaction Listener
addTransactionBtn.addEventListener('click', () => {
    showAddTransactionModal();
});

loadCurrentUser();
