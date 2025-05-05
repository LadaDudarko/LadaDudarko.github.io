// Подключаем Firebase
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./db.js"; // Импортируем инициализированный Firebase

const auth = getAuth(app);

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('reg-username').value + '@example.com'; // Делаем email
  const password = document.getElementById('reg-password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Успешная регистрация! UID:", userCredential.user.uid);
    alert("Регистрация успешна!");
    window.location.href = 'profile.html';
  } catch (error) {
    console.error("Ошибка:", error.code);
    alert(`Ошибка: ${getFirebaseError(error.code)}`);
  }
});

// Перевод ошибок Firebase
function getFirebaseError(code) {
  const errors = {
    "auth/email-already-in-use": "Email уже занят",
    "auth/invalid-email": "Некорректный email",
    "auth/weak-password": "Пароль слишком простой (минимум 6 символов)"
  };
  return errors[code] || code;
}