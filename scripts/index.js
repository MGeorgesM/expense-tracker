const transactionsContainer = document.getElementById('transactions-container');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const submitTransactionBtn = document.getElementById('submit-transaction-btn');
const addTransactionModal = document.getElementById('add-transaction-modal');
const addTransactionModalOverlay = document.getElementById('modal-bg');
const cancelAddTransactionBtn = document.getElementById('cancel-add-transaction-btn');
const descriptionInputOptions = document.getElementById('descriptionInput');
const currencyInputOptions = document.getElementById('currencyInput');

const userGreeting = document.getElementById('user-greet');
const userBalanceDisplay = document.getElementById('user-balance');

const incomeFilter = document.getElementById('income-filter');
const expenseFilter = document.getElementById('expense-filter');
const currencyFilter = document.getElementById('currency-filter');
const amountToFilter = document.getElementById('amount-to-filter');
const amountFromFilter = document.getElementById('amount-from-filter');

let currentUser = null;
let originalUserTransactions = [];
let filteredTransactions = [];
let apiCurrenciesFound = [];
let currentTypeFilterApplied = null;
let currentAmountFromFilterApplied = null;
let currentAmountToFilterApplied = null;
let currentCurrencyFilterApplied = null;

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
            amount: 2000.0,
            currency: 'EUR',
            description: 'Dining Out',
            type: 'Income',
        },
        {
            id: 4,
            date: new Date(2024, 5, 5),
            amount: 1000.0,
            currency: 'EUR',
            description: 'Salary',
            type: 'Income',
        },
    ],
};

const currenciesApi = 'https://ivory-ostrich-yoke.cyclic.app/students/available';
const convertApi = 'https://ivory-ostrich-yoke.cyclic.app/students/convert';

const users = [user1, user2, user3];

const types = ['Income', 'Expense'];

const getCurrentUser = () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || user1;
    originalUserTransactions = currentUser.transactions;
    console.log('Currently in home', currentUser);
    console.log('Original Transactions', originalUserTransactions);
};

const saveCurrentUser = () => {
    const index = users.findIndex((user) => user.id === currentUser.id);
    index !== -1 && (users[index] = currentUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
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

const calculateBalance = async () => {
    let balance = 0;

    for (const transaction of originalUserTransactions) {
        let amount = transaction.amount;
        if (transaction.currency != 'USD') {
            try {
                amount = await convertAmount(transaction.currency, 'USD', transaction.amount);
            } catch (error) {
                console.error('Error converting amount:', error);
            }
        } else {
            amount = transaction.amount;
        }

        balance += transaction.type === 'Income' ? amount : -amount;
    }

    userBalanceDisplay.innerHTML = `${balance.toFixed(2)}`;
};

const populateDescriptionInput = () => {
    descriptions.forEach((description) => {
        descriptionInputOptions.innerHTML += `<option value="${description}">${description}</option>`;
    });
};

const populateTransaction = (transaction) => {
    const dateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };
    const formattedDate = transaction.date.toLocaleDateString('en-US', dateOptions);

    transactionsContainer.innerHTML += `<tr>
                                            <td>${transaction.id}</td>
                                            <td>${transaction.type}</td>
                                            <td>${transaction.description}</td>
                                            <td>${formattedDate}</td>
                                            <td>${transaction.amount}</td>
                                            <td>${transaction.currency}</td>
                                            <td><i class="fa-regular fa-square-minus"></i></td>
                                        </tr>`;
};

const populateTransactions = (transactions) => {
    console.log(transactions);
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

const filterByTransactionType = (type) => {
    currentTypeFilterApplied = currentTypeFilterApplied === type ? null : type;

    filteredTransactions = currentTypeFilterApplied
        ? originalUserTransactions.filter((transaction) => transaction.type === currentTypeFilterApplied)
        : originalUserTransactions;

    populateTransactions(filteredTransactions);
};

const filterByAmountTo = (amountTo) => {
    const amountFrom = parseFloat(amountFromFilter.value);
    filteredTransactions = originalUserTransactions.filter((transaction) => {
        if (isNaN(amountTo)) return !amountFrom || transaction.amount >= amountFrom;
        return (!amountFrom || transaction.amount >= amountFrom) && transaction.amount <= amountTo;
    });
    populateTransactions(filteredTransactions);
};

const filterByAmountFrom = (amountFrom) => {
    const amountTo = parseFloat(amountToFilter.value);
    filteredTransactions = originalUserTransactions.filter((transaction) => {
        if (isNaN(amountFrom)) return !amountTo || transaction.amount <= amountTo;
        return (!amountTo || transaction.amount <= amountTo) && transaction.amount >= amountFrom;
    });
    populateTransactions(filteredTransactions);
};

const filterByCurrency = (currency) => {
    filteredTransactions = originalUserTransactions.filter((transaction) => transaction.currency === currency);
    populateTransactions(filteredTransactions.length > 0 ? filteredTransactions : originalUserTransactions);
};

incomeFilter.addEventListener('click', () => {
    filterByTransactionType('Income');
});

expenseFilter.addEventListener('click', () => {
    filterByTransactionType('Expense');
});

amountToFilter.addEventListener('input', (event) => {
    const amountTo = parseFloat(event.target.value);
    console.log(amountTo);
    filterByAmountTo(amountTo);
});

amountFromFilter.addEventListener('input', (event) => {
    const amountFrom = parseFloat(event.target.value);
    filterByAmountFrom(amountFrom ? amountFrom : 0);
});

currencyFilter.addEventListener('change', () => {
    const selectedCurrency = currencyFilter.value;
    filterByCurrency(selectedCurrency);
});

// Modal
const showAddTransactionModal = () => {
    addTransactionModal.classList.remove('hidden');
    addTransactionModalOverlay.classList.add('modal-overlay');
};

const closeAddTransactionModal = () => {
    addTransactionModal.classList.add('hidden');
    addTransactionModalOverlay.classList.remove('modal-overlay');
};

// Fetching APIs
const getApiCurrencies = async () => {
    const response = await fetch(currenciesApi);
    apiCurrenciesFound = await response.json();
};

const convertAmount = async (from, to, amount) => {
    const data = {
        from: from,
        to: to,
        amount: parseFloat(amount),
    };
    const response = await axios.post(convertApi, data);
    return response.data;
};

const populateCurrencies = async () => {
    const userUniqueCurrencies = {};

    await getApiCurrencies();

    currentUser.transactions.forEach((transaction) => {
        userUniqueCurrencies[transaction.currency] = true;
    });

    for (const currency in userUniqueCurrencies) {
        currencyFilter.innerHTML += `<option value="${currency}">${currency}</option>`;
    }

    apiCurrenciesFound.forEach((currency) => {
        currencyInputOptions.innerHTML += `<option value="${currency.code}">${currency.code}</option>`;
    });
};

// Add Transaction-Form Listener
addTransactionBtn.addEventListener('click', () => {
    showAddTransactionModal();
});

submitTransactionBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const transaction = createTransactionFromInput();

    addTransactionToUser(currentUser, transaction);

    closeAddTransactionModal();
});

cancelAddTransactionBtn.addEventListener('click', () => closeAddTransactionModal());

getCurrentUser();
calculateBalance();
populateDescriptionInput();
populateCurrencies();
populateTransactions(originalUserTransactions);
