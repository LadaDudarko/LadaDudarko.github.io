// Настройка Supabase (вставьте свои данные)
const supabaseUrl = 'Вhttps://msosadsjjrqolwxwnuya.supabase.coАШ_PROJECT_URL';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zb3NhZHNqanJxb2x3eHdudXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjMxOTksImV4cCI6MjA2MjAzOTE5OX0.ozGJ-IMsCtzhwHPc8juXyKshuosO80ZFAA17bhNepqk';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Обработчик формы регистрации
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // 1. Регистрация в Supabase
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password }])
    .select();

  if (error) {
    alert('Ошибка: ' + error.message);
  } else {
    alert('Регистрация успешна! Версия кода 1.0');
    window.location.href = 'profile.html';
  }
});