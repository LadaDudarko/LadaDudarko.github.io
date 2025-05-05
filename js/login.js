document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
  
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
      const user = users.find(u => u.username === username && u.password === password);
  
      if (user) {
        Storage.setCurrentUser(username);
        window.location.href = 'profile.html';
      } else {
        alert('Неверный логин или пароль!');
      }
    });
  });