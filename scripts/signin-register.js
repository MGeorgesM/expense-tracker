const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const validationDisplay = document.getElementById('validation');

if (document.title === 'Sign In') {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        login(usernameInput, passwordInput);
    });
}

if (document.title === 'Sign Up') {
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        const firstNameInput = document.getElementById('firstname').value;
        const lastNameInput = document.getElementById('lastname').value;
        register(usernameInput, firstNameInput, lastNameInput, passwordInput);
    });
}

const register = (usernameInput, firstNameInput, lastNameInput, passwordInput) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    try {
        if (storedUsers.length > 0) {
            for (let i = 0; i < storedUsers.length; i++) {
                if (storedUsers[i].username === usernameInput) {
                    throw Error('Username is already taken');
                }
            }
        }
        const newUser = {
            id: getUniqueId(storedUsers),
            username: usernameInput,
            password: passwordInput,
            firstname: firstNameInput,
            lastname: lastNameInput,
            balance: null,
            transactions: [],
        };
        storedUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(storedUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = '/index.html';
    } catch (error) {
        validationDisplay.innerHTML = error.message;
    }
};

const login = (usernameInput, passwordInput) => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));

    try {
        if (!storedUsers) {
            throw Error('No Users In Database');
        }
        for (let i = 0; i < storedUsers.length; i++) {
            if (storedUsers[i].username === usernameInput && storedUsers[i].password === passwordInput) {
                localStorage.setItem('currentUser', JSON.stringify(storedUsers[i]));
                window.location.href = '/index.html';
                return;
            }
        }
        throw Error('Invalid Username or Password');
    } catch (error) {
        validationDisplay.innerHTML = error.message;
    }
};
