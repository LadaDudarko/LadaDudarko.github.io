const supabaseUrl = 'https://ваш-проект.supabase.co';
const supabaseKey = 'ваш-публичный-ключ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  // Валидация email (если браузер не поддерживает type="email")
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    alert("Введите корректный email (например, user@example.com)");
    return;
  }

  // Валидация пароля
  if (password.length < 6 || password.length > 30) {
    alert("Пароль должен быть от 6 до 30 символов!");
    return;
  }

  // Регистрация в Supabase
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(`Ошибка: ${error.message}`);
  } else {
    alert("Регистрация успешна! Проверьте почту для подтверждения.");
    window.location.href = 'login.html';
  }
});

document.getElementById('reg-email').addEventListener('input', (e) => {
  const email = e.target.value;
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    e.target.setCustomValidity("Введите корректный email");
  } else {
    e.target.setCustomValidity("");
  }
});