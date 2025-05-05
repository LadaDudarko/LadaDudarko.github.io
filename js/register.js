document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;

      // Валидация email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Введите корректный email (например: user@example.com)");
        return;
      }

      try {
        console.log("Регистрация:", email);
        
        // Сохраняем пользователя в localStorage
        localStorage.setItem('currentUser', email);
        alert("Регистрация успешна! 1.0");
        
        // Переход на страницу профиля
        window.location.href = 'profile.html';
        
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Произошла ошибка при регистрации");
      }
    });
  }
});

console.log("Firebase подключен:", firebase.app().name); // Должно вывести "[DEFAULT]"