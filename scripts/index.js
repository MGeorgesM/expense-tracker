const logoutBtn = document.getElementById('logout-btn');

const modalOverlay = document.getElementById('modal-bg');
const transactionsContainer = document.getElementById('transactions-container');
const transactionsTable = document.getElementById('transactions-table');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const submitTransactionBtn = document.getElementById('submit-transaction-btn');
const addTransactionModal = document.getElementById('add-transaction-modal');
const cancelAddTransactionBtn = document.getElementById('cancel-add-transaction-btn');
const notFoundPrompt = document.getElementById('not-found');

const transactionHiddenId = document.getElementById('transactionId');
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
let currentTypeFilterApplied = null;
let filters = {
    type: null,
    amountFrom: null,
    amountTo: null,
    currency: null,
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
            currency: 'AED',
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

const currenciesApi = 'https://dull-pink-sockeye-tie.cyclic.app/students/available';
const convertApi = 'https://dull-pink-sockeye-tie.cyclic.app/students/convert';

const getCurrentUser = () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || user1;
    originalUserTransactions = currentUser.transactions;
    userGreeting.innerHTML = currentUser.firstname;
};

const saveCurrentUser = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const index = storedUsers.findIndex((user) => user.id === currentUser.id);
    if (index !== -1) {
        storedUsers[index] = currentUser;
        localStorage.setItem('currentUser', JSON.stringify(storedUsers[index]));
    } else {
        storedUsers.push(currentUser);
    }
    localStorage.setItem('users', JSON.stringify(storedUsers));
};

const logout = () => {
    saveCurrentUser();
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

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

const calculateBalance = async () => {
    let balance = 0;

    for (const transaction of originalUserTransactions) {
        let amount = transaction.amount;
        if (transaction.currency != 'USD') {
            try {
                amount = await convertAmount(transaction.currency, 'USD', transaction.amount);
            } catch (error) {
                console.error('Error converting amount:', amount);
            }
        } else {
            amount = transaction.amount;
        }

        balance += transaction.type === 'Income' ? amount : -amount;
    }

    userBalanceDisplay.innerHTML = `${balance.toFixed(2)}`;
    currentUser.balance = balance;
    saveCurrentUser();
};

const populateDescriptionInput = () => {
    descriptions.forEach((description) => {
        descriptionInput.innerHTML += `<option value="${description}">${description}</option>`;
    });
};

const populateTransaction = (transaction) => {
    const formattedDate = formatDate(transaction.date);
    let transactionFormat = '';
    transaction.type === 'Income' ? (transactionFormat = 'income') : (transactionFormat = 'expense');

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
    transactionsContainer.innerHTML = '';
    if (transactions.length === 0) {
        transactionsTable.classList.add('hidden');
        notFoundPrompt.classList.remove('hidden');
        return;
    }
    transactions.sort((a,b) => new Date(b.date) - new Date(a.date));
    transactionsTable.classList.remove('hidden');
    notFoundPrompt.classList.add('hidden');
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

    populateCurrencies();
};

const handleEditTransaction = (event) => {
    const transactionId = event.target.dataset.id;
    const transaction = findTransactionById(transactionId);

    transactionHiddenId.value = transaction.id;
    dateInput.value = formatDate(transaction.date);
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

const addTransactionToUser = async (transaction) => {
    currentUser.transactions.push(transaction);
    saveCurrentUser();
    populateTransactions(originalUserTransactions);
    await calculateBalance();
};

const createTransactionFromInput = () => {
    const transactionIdValue = transactionHiddenId.value;
    const dateInputValue = new Date(dateInput.value);
    const amountInputValue = parseFloat(amountInput.value);
    const descriptionInputValue = descriptionInput.value;
    const currencyInputValue = currencyInput.value;

    let selectedTypeValue = null;

    for (const input of typeInputs) {
        if (input.checked) {
            selectedTypeValue = input.value;
            break;
        }
    }

    return {
        id: parseInt(transactionIdValue) || getUniqueId(originalUserTransactions),
        date: dateInputValue,
        amount: amountInputValue,
        currency: currencyInputValue,
        description: descriptionInputValue,
        type: selectedTypeValue,
    };
};

const removeTransaction = async (transactionId) => {
    const idToRemove = parseInt(transactionId);
    currentUser.transactions = currentUser.transactions.filter((transaction) => transaction.id !== idToRemove);
    originalUserTransactions = currentUser.transactions;
    saveCurrentUser();
    populateTransactions(originalUserTransactions);
    await calculateBalance();
};

const findTransactionById = (transactionId) => {
    const idToFind = parseInt(transactionId);
    return currentUser.transactions.find((transaction) => transaction.id === idToFind);
};

const editTransaction = async (transactionId, updatedTransaction) => {
    const transaction = findTransactionById(transactionId);
    if (transaction) {
        for (let property in updatedTransaction) {
            if (updatedTransaction.hasOwnProperty(property)) {
                transaction[property] = updatedTransaction[property];
            }
        }
        saveCurrentUser();
        populateTransactions(originalUserTransactions);
        await calculateBalance();
    } else {
        throw new Error('Transaction not Found');
    }
};

// Filters
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

// Modals
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

const resetModalInputsValues = () => {
    transactionId.value = null;
    dateInput.value = '';
    amountInput.value = '';
    descriptionInput.value = 'Salary';
    currencyInput.value = 'USD';
    document.getElementById('incomeCheckbox').checked = true;
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
    currencyInput.innerHTML = '';
    currencyFilter.innerHTML = `<option value="All">All</option>`;
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

    currencyFilter.value = filters.currency || 'All';
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
        filters.currency = currencyFilter.value !== 'All' ? currencyFilter.value : null;
        filterTransactions();
        currencyFilter.value = filters.currency || 'All';
    });

    // Add Transaction-Form Listener
    addTransactionBtn.addEventListener('click', () => {
        showAddTransactionModal();
    });

    submitTransactionBtn.addEventListener('click', (event) => {
        event.preventDefault();
        const transactionid = transactionHiddenId.value;
        const transaction = createTransactionFromInput();

        transactionid ? editTransaction(transactionid, transaction) : addTransactionToUser(transaction);

        closeAddTransactionModal();
        resetModalInputsValues();
    });

    cancelAddTransactionBtn.addEventListener('click', () => {
        closeAddTransactionModal();
        resetModalInputsValues();
    });

    cancelDeletTransactionBtn.addEventListener('click', () => closeConfirmationModal());

    logoutBtn.addEventListener('click', logout);

    getCurrentUser();
    saveCurrentUser();
    calculateBalance();
    populateDescriptionInput();
    populateTransactions(originalUserTransactions);
}
