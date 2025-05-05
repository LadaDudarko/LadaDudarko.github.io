document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  
  loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      // Валидация email
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
          alert("Введите корректный email!");
          return;
      }

      // Проверяем, есть ли пользователь в localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser && storedUser === email) {
          // Сохраняем факт входа
          localStorage.setItem('isLoggedIn', 'true');
          // Переходим на страницу профиля
          window.location.href = 'profile.html';
      } else {
          alert("Пользователь не найден. Зарегистрируйтесь.");
      }
  });

  // Валидация email в реальном времени
  document.getElementById('login-email').addEventListener('input', (e) => {
      const email = e.target.value;
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
          e.target.setCustomValidity("Введите корректный email");
      } else {
          e.target.setCustomValidity("");
      }
  });
});