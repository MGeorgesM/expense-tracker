const logoutBtn = document.getElementById('logout-btn');

const modalOverlay = document.getElementById('modal-bg');
const transactionsContainer = document.getElementById('transactions-container');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const submitTransactionBtn = document.getElementById('submit-transaction-btn');
const addTransactionModal = document.getElementById('add-transaction-modal');
const cancelAddTransactionBtn = document.getElementById('cancel-add-transaction-btn');

const hiddenId = document.getElementById('transactionId');
const dateInput = document.getElementById('dateInput');
const amountInput = document.getElementById('amountInput');
const descriptionInput = document.getElementById('descriptionInput');
const currencyInput = document.getElementById('currencyInput');
const typeInputs = document.getElementsByName('transaction-type');

const confirmationModal = document.getElementById('confirmation-modal');
const confirmDeleteTransactionBtn = document.getElementById('delete-transaction-btn');
const cancelDeletTransactionBtn = document.getElementById('cancel-delete-transaction-btn');

const userGreeting = document.getElementById('user-greet');
const userBalanceDisplay = document.getElementById('user-balance');

const incomeFilter = document.getElementById('income-filter');
const expenseFilter = document.getElementById('expense-filter');
const currencyFilter = document.getElementById('currency-filter');
const amountToFilter = document.getElementById('amount-to-filter');
const amountFromFilter = document.getElementById('amount-from-filter');

let editTransactionBtns = [];
let deleteTransactionBtns = [];

let currentUser = null;
let originalUserTransactions = [];
let filteredTransactions = [];
let apiCurrenciesFound = [];

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
    username: 'user',
    password: 'user',
    firstname: 'Georges',
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

const currenciesApi = 'https://crowded-cyan-wildebeest.cyclic.app/students/available';
const convertApi = 'https://ivory-ostrich-yoke.cyclic.app/students/convert';

const users = [user1];

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
    window.location.href = '/pages/sign-in.html';
};

const getUniqueId = (array) => {
    if (array.length === 0) {
        return 1;
    }
    const latestId = array[array.length - 1].id;
    return latestId + 1;
};

const formatDateToEdit = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

// const formatDateToEdit = (date) => {
//     if (!(date instanceof Date)) {
//         return 'Invalid Date';
//     }
//     const options = {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     };
//     return date.toLocaleString('en-US', options);
// };

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
        descriptionInput.innerHTML += `<option value="${description}">${description}</option>`;
    });
};

const populateTransaction = (transaction) => {
    // const dateOptions = {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: '2-digit',
    //     hour: '2-digit',
    //     minute: '2-digit',
    // };

    // let formattedDate = transaction.date;

    // if (typeof transaction.date === 'string') {
    //     const parsedDate = new Date(transaction.date);
    //     if (!isNaN(parsedDate.getTime())) {
    //         formattedDate = parsedDate.toLocaleDateString('en-US', dateOptions);
    //     }
    // } else if (transaction.date instanceof Date) {
    //     formattedDate = transaction.date.toLocaleDateString('en-US', dateOptions);
    // }

    const formattedDate = formatDate(transaction.date);
    let transactionFormat = '';
    transaction.type === 'Income' ? transactionFormat = 'income' : ''

    transactionsContainer.innerHTML += `<tr class="${transactionFormat}">
                                            <td>${transaction.id}</td>
                                            <td>${transaction.type}</td>
                                            <td>${transaction.description}</td>
                                            <td>${formattedDate}</td>
                                            <td>${transaction.amount}</td>
                                            <td>${transaction.currency}</td>
                                            <td class="table-actions flex center">
                                            <i class="edit-transaction fa-regular fa-pen-to-square" data-id="${transaction.id}"></i>
                                            <i class="delete-transaction fa-regular fa-square-minus" data-id="${transaction.id}"></i>
                                            </td>
                                        </tr>`;
};

const populateTransactions = (transactions) => {
    console.log(hiddenId.value);
    transactionsContainer.innerHTML = '';
    transactions.forEach((transaction) => {
        populateTransaction(transaction);
    });

    editTransactionBtns = document.querySelectorAll('.edit-transaction');
    deleteTransactionBtns = document.querySelectorAll('.delete-transaction');

    deleteTransactionBtns.forEach((element) => {
        element.addEventListener('click', handleRemoveTransaction);
    });

    editTransactionBtns.forEach((element) => {
        element.addEventListener('click', handleEditTransaction);
    });
};

const handleEditTransaction = (event) => {
    const transactionId = event.target.dataset.id;
    const transaction = findTransactionById(transactionId);

    hiddenId.value = transaction.id;
    dateInput.value = formatDateToEdit(transaction.date);
    amountInput.value = transaction.amount;
    descriptionInput.value = transaction.description;
    currencyInput.value = transaction.currency;

    if (transaction.type === 'Income') {
        incomeCheckbox.checked = true;
    } else {
        expenseCheckbox.checked = true;
    }

    showAddTransactionModal();
};

const handleRemoveTransaction = (event) => {
    const transactionId = event.target.dataset.id;
    showConfirmationModal();
    confirmDeleteTransactionBtn.addEventListener('click', () => {
        removeTransaction(transactionId);
        closeConfirmationModal();
    });
    cancelDeletTransactionBtn.addEventListener('click', () => {
        closeConfirmationModal();
    });
};

const addTransactionToUser = (transaction) => {
    currentUser.transactions.push(transaction);
    saveCurrentUser();
    populateTransactions(originalUserTransactions);
};

const createTransactionFromInput = () => {
    const transactionId = document.getElementById('transactionId').value;
    const dateInput = new Date(document.getElementById('dateInput').value);
    const amountInput = parseFloat(document.getElementById('amountInput').value);
    const descriptionInput = document.getElementById('descriptionInput').value;
    const currencyInput = document.getElementById('currencyInput').value;
    const typeInputs = document.getElementsByName('transaction-type');

    console.log(transactionId);

    let selectedType = null;

    for (const input of typeInputs) {
        if (input.checked) {
            selectedType = input.value;
            break;
        }
    }

    return {
        id: parseInt(transactionId) || getUniqueId(originalUserTransactions),
        date: dateInput,
        amount: amountInput,
        currency: currencyInput,
        description: descriptionInput,
        type: selectedType,
    };
};

const removeTransaction = (transactionId) => {
    const idToRemove = parseInt(transactionId);
    currentUser.transactions = currentUser.transactions.filter((transaction) => transaction.id !== idToRemove);
    originalUserTransactions = currentUser.transactions;
    saveCurrentUser();
    populateTransactions(originalUserTransactions);
};

const findTransactionById = (transactionId) => {
    const idToFind = parseInt(transactionId);
    return currentUser.transactions.find((transaction) => transaction.id === idToFind);
};

const editTransaction = (transactionId, updatedTransaction) => {
    console.log('editing transaction');
    const transaction = findTransactionById(transactionId);
    if (transaction) {
        for (let property in updatedTransaction) {
            if (updatedTransaction.hasOwnProperty(property)) {
                transaction[property] = updatedTransaction[property];
            }
        }
        saveCurrentUser();
        populateTransactions(originalUserTransactions);
    } else {
        throw new Error('Transaction not Found');
    }
};

// Filters

let currentTypeFilterApplied = null;

let filters = {
    type: null,
    amountFrom: null,
    amountTo: null,
    currency: null,
};

const filterTransactions = () => {
    let filteredTransactions = [...originalUserTransactions];

    if (filters.type) {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.type === filters.type);
    }

    if (filters.amountFrom !== null) {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.amount >= filters.amountFrom);
    }

    if (filters.amountTo !== null) {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.amount <= filters.amountTo);
    }

    if (filters.currency) {
        filteredTransactions = filteredTransactions.filter((transaction) => transaction.currency === filters.currency);
    }

    populateTransactions(filteredTransactions);
};

// Modal
const showAddTransactionModal = () => {
    addTransactionModal.classList.remove('hidden');
    modalOverlay.classList.add('modal-overlay');
};

const closeAddTransactionModal = () => {
    addTransactionModal.classList.add('hidden');
    modalOverlay.classList.remove('modal-overlay');
};

const showConfirmationModal = () => {
    confirmationModal.classList.remove('hidden');
    modalOverlay.classList.add('modal-overlay');
};

const closeConfirmationModal = () => {
    confirmationModal.classList.add('hidden');
    modalOverlay.classList.remove('modal-overlay');
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
        currencyInput.innerHTML += `<option value="${currency.code}">${currency.code}</option>`;
    });
};

if (document.title === 'Dashboard') {
    incomeFilter.addEventListener('click', () => {
        incomeFilter.classList.toggle('clicked');
        expenseFilter.classList.contains('clicked') && expenseFilter.classList.remove('clicked');
        filters.type = incomeFilter.classList.contains('clicked') ? 'Income' : null;
        filterTransactions();
    });

    expenseFilter.addEventListener('click', () => {
        expenseFilter.classList.toggle('clicked');
        incomeFilter.classList.contains('clicked') && incomeFilter.classList.remove('clicked');
        filters.type = expenseFilter.classList.contains('clicked') ? 'Expense' : null;
        filterTransactions();
    });

    amountToFilter.addEventListener('input', (event) => {
        filters.amountTo = parseFloat(event.target.value) || null;
        filterTransactions();
    });

    amountFromFilter.addEventListener('input', (event) => {
        filters.amountFrom = parseFloat(event.target.value) || null;
        filterTransactions();
    });

    currencyFilter.addEventListener('change', () => {
        filters.currency = currencyFilter.value !== 'all' ? currencyFilter.value : null;
        filterTransactions();
    });

    // Add Transaction-Form Listener
    addTransactionBtn.addEventListener('click', () => {
        console.log('adding transaction');
        showAddTransactionModal();
    });

    submitTransactionBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const transactionid = hiddenId.value;
        console.log('event listener id found', transactionid);

        const transaction = createTransactionFromInput();

        transactionid ? editTransaction(transactionid, transaction) : addTransactionToUser(transaction);

        closeAddTransactionModal();
    });

    cancelAddTransactionBtn.addEventListener('click', () => closeAddTransactionModal());

    cancelDeletTransactionBtn.addEventListener('click', () => closeConfirmationModal());

    logoutBtn.addEventListener('click', logout);

    getCurrentUser();
    calculateBalance();
    populateDescriptionInput();
    populateCurrencies();
    populateTransactions(originalUserTransactions);
}
