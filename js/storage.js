const Storage = {
    getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
    setUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
    getCurrentUser: () => localStorage.getItem('currentUser'),
    setCurrentUser: (username) => localStorage.setItem('currentUser', username),
    clearCurrentUser: () => localStorage.removeItem('currentUser'),
    getUserAlbums: (username) => JSON.parse(localStorage.getItem(`${username}_albums`)) || [],
    setUserAlbums: (username, albums) => localStorage.setItem(`${username}_albums`, JSON.stringify(albums)),
    getUserData: (username, key) => localStorage.getItem(`${username}_${key}`),
    setUserData: (username, key, value) => localStorage.setItem(`${username}_${key}`, value)
  };
  
  const Validator = {
    username: (value) => /^[A-Za-z0-9_\-]{1,30}$/.test(value),
    password: (value) => /^[A-Za-z0-9!@#$%^&*]{1,15}$/.test(value),
    sanitizeUsername: (value) => value.replace(/[^A-Za-z0-9_\-]/g, '').slice(0, 30),
    sanitizePassword: (value) => value.replace(/[^A-Za-z0-9!@#$%^&*]/g, '').slice(0, 15)
  };
  
  // Проверка авторизации для защищенных страниц
  function checkAuth() {
    const protectedPages = ['profile.html', 'albums.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !Storage.getCurrentUser()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }