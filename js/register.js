document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const usernameInput = document.getElementById('reg-username');
    const passwordInput = document.getElementById('reg-password');
  
    // Валидация в реальном времени
    usernameInput.addEventListener('input', () => {
      usernameInput.value = Validator.sanitizeUsername(usernameInput.value);
    });
  
    passwordInput.addEventListener('input', () => {
      passwordInput.value = Validator.sanitizePassword(passwordInput.value);
    });
  
    // Обработка отправки формы
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = usernameInput.value;
      const password = passwordInput.value;
  
      if (!Validator.username(username)) {
        alert('Логин должен содержать только латинские буквы, цифры, "_" или "-"');
        return;
      }
  
      if (!Validator.password(password)) {
        alert('Пароль содержит недопустимые символы');
        return;
      }
  
      const users = Storage.getUsers();
  
      if (users.some(u => u.username === username)) {
        alert('Пользователь уже существует!');
        return;
      }
  
      users.push({ username, password });
      Storage.setUsers(users);
      Storage.setCurrentUser(username); // Автоматический вход после регистрации
      alert('Регистрация успешна!');
      window.location.href = 'profile.html';
    });
  });