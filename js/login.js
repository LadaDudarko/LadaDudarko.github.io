form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // 1. Проверка в Supabase
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .eq('password', password);

  if (error || data.length === 0) {
    alert('Неверный email или пароль');
  } else {
    localStorage.setItem('currentUser', email); // Сохраняем вход локально
    window.location.href = 'profile.html';
  }
});