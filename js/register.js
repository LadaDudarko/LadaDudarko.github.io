document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    try {
      // 1. Регистрируем пользователя в Firebase Auth
      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
      console.log("Пользователь зарегистрирован. UID:", user.uid); // Для отладки

      // 2. Инициализируем Firestore
      const db = firebase.firestore();

      // 3. Сохраняем дополнительные данные в коллекцию "users"
      await db.collection("users").doc(user.uid).set({
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Автоматическая дата
        lastLogin: new Date().toISOString(),
        status: "active"
      });

      // 4. Сохраняем email в localStorage для быстрого доступа
      localStorage.setItem('currentUser', email);
      
      // 5. Уведомление и переход
      alert('Регистрация успешна 2.1 ! Данные сохранены.');
      window.location.href = 'profile.html';
      
    } catch (error) {
      console.error("Полная ошибка Firebase:", error);
      alert(`Ошибка: ${error.message}`);
    }
  });
});