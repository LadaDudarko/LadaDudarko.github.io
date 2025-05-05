// 1. Инициализация Supabase (должна быть в самом начале файла)
const supabaseUrl = 'https://yejqvggvucldtyplcezm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllanF2Z2d2dWNsZHR5cGxjZXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NDcwNjEsImV4cCI6MjA2MjAyMzA2MX0.PoBc7i1oXWarnMeGQKR-BIJ6u3LtM4QG5pmyvZEnK1c';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Обработчик формы регистрации
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;

      // Валидация email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Введите корректный email (например: user@example.com)");
        return;
      }

      try {
        console.log("Попытка регистрации:", email);
        
        // Регистрация в Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) throw error;

        // Сохраняем пользователя в localStorage
        Storage.setCurrentUser(email);
        alert("Регистрация успешна! Проверьте почту для подтверждения.");
        
        // Переход на страницу профиля
        window.location.href = 'profile.html';
        
      } catch (error) {
        console.error("Ошибка регистрации:", error);
        alert(`Ошибка: ${error.message}`);
      }
    });
  }
});