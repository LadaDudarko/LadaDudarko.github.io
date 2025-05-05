const firebaseConfig = {
  apiKey: "AIzaSyCS5o_2e38kfAhpH4x8GKWmclLWuPwNKpw",
  authDomain: "kyrsovaya-bd3f2.firebaseapp.com",
  projectId: "kyrsovaya-bd3f2",
  storageBucket: "kyrsovaya-bd3f2.firebasestorage.app",
  messagingSenderId: "122860451331",
  appId: "1:122860451331:web:e0e5330e9e669f02e58036"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const email = `${username}@example.com`; // Формируем email

  // Валидация пароля
  if (password.length < 6 || password.length > 30) {
    alert("Пароль должен быть от 6 до 30 символов!");
    return;
  }

  // Валидация логина
  if (!/^[A-Za-z0-9_]{3,30}$/.test(username)) {
    alert("Логин должен содержать только латинские буквы, цифры и _ (от 3 до 30 символов)");
    return;
  }

  console.log("Регистрируем:", email, password);

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Успех! UID:", userCredential.user.uid);
      alert("Регистрация успешна!");
      window.location.href = 'profile.html';
    })
    .catch((error) => {
      console.error("Ошибка Firebase:", error.code, error.message);
      alert(`Ошибка: ${getFirebaseError(error.code)}`);
    });
});

function getFirebaseError(code) {
  const errors = {
    "auth/email-already-in-use": "Этот логин уже занят",
    "auth/invalid-email": "Некорректный email",
    "auth/weak-password": "Пароль слишком простой (минимум 6 символов)",
    "auth/network-request-failed": "Проблемы с интернет-соединением"
  };
  return errors[code] || "Произошла ошибка. Попробуйте еще раз.";
}