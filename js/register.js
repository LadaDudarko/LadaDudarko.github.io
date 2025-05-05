// Вариант 1: Только модульная версия (Firebase 9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCS5o_2e38kfAhpH4x8GKWmclLWuPwNKpw",
  authDomain: "kyrsovaya-bd3f2.firebaseapp.com",
  projectId: "kyrsovaya-bd3f2",
  storageBucket: "kyrsovaya-bd3f2.firebasestorage.app",
  messagingSenderId: "122860451331",
  appId: "1:122860451331:web:e0e5330e9e669f02e58036"
};

// Инициализация
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Только это объявление!

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('reg-username').value + '@example.com';
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

function getFirebaseError(code) {
  const errors = {
    "auth/email-already-in-use": "Email уже занят",
    "auth/invalid-email": "Некорректный email",
    "auth/weak-password": "Пароль слишком простой (минимум 6 символов)"
  };
  return errors[code] || code;
}