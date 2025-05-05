const supabaseUrl = 'https://ваш-проект.supabase.co';
const supabaseKey = 'ваш-публичный-ключ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  // Валидация email
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    alert("Введите корректный email!");
    return;
  }

  // Вход через Supabase
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert("Неверный email или пароль!");
  } else {
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'profile.html';
  }
});

document.getElementById('login-email').addEventListener('input', (e) => {
  const email = e.target.value;
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    e.target.setCustomValidity("Введите корректный email");
  } else {
    e.target.setCustomValidity("");
  }
});