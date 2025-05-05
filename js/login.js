document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      // 1. Пытаемся войти
      const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
      
      // 2. Сохраняем данные пользователя
      localStorage.setItem('currentUser', email);
      console.log("Вход выполнен:", user.uid);
      
      // 3. Перенаправляем в профиль
      window.location.href = 'profile.html';
      
    } catch (error) {
      console.error("Ошибка входа:", error);
      
      // Показываем пользователю понятное сообщение
      let errorMessage = "Ошибка входа";
      if (error.code === 'auth/wrong-password') {
        errorMessage = "Неверный пароль";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Пользователь не найден";
      }
      
      alert(errorMessage);
    }
  });
});