  const saveCurrentUser = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const register = (usernameInput, favoritemealInput, passwordInput) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || users;
  
    for (let i = 0; i < storedUsers.length; i++) {
      if (storedUsers[i].username === usernameInput) {
        console.log('username taken');
        return;
      }
    }
  
    const newUser = {
      id: getUniqueId(),
      username: usernameInput,
      password: passwordInput,
      favoritemeal: favoritemealInput,
      isAdmin: false,
      favoriteRestaurants: [],
    };
  
    storedUsers.push(newUser);
    console.log(users);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    saveCurrentUser(newUser);
    window.location.href = '/index.html';
  };

  const login = (usernameInput, passwordInput) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || users;
    console.log(storedUsers);
    for (let i = 0; i < storedUsers.length; i++) {
      if (storedUsers[i].username === usernameInput && storedUsers[i].password === passwordInput) {
        saveCurrentUser(storedUsers[i]);
        window.location.href = '/index.html';
        return;
      }
    }
    console.error('Invalid username or password.');
  };
  