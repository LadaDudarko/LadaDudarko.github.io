const supabaseUrl = 'https://yejqvggvucldtyplcezm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllanF2Z2d2dWNsZHR5cGxjZXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NDcwNjEsImV4cCI6MjA2MjAyMzA2MX0.PoBc7i1oXWarnMeGQKR-BIJ6u3LtM4QG5pmyvZEnK1c';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;

  // Валидация email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Введите корректный email!");
    return;
  }

  try {
    // 1. Регистрация в Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    // 2. Сохранение пользователя в localStorage
    const newUser = {
      email,
      id: data.user.id,
      createdAt: new Date().toISOString()
    };
    
    Storage.setUsers([...Storage.getUsers(), newUser]);
    Storage.setCurrentUser(email);
    
    // 3. Переход на profile.html
    window.location.href = 'profile.html';
    
  } catch (error) {
    alert(`Ошибка регистрации: ${error.message}`);
  }
});