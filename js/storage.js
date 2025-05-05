const supabaseUrl = 'https://yejqvggvucldtyplcezm.supabase.co';
const supabaseKey = 'ваш_ключ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const Storage = {
  // ===== Локальное хранилище (оставляем как было) =====
  getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
  setUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
  getCurrentUser: () => localStorage.getItem('currentUser'),
  setCurrentUser: (username) => localStorage.setItem('currentUser', username),
  clearCurrentUser: () => localStorage.removeItem('currentUser'),
  getUserAlbums: (username) => JSON.parse(localStorage.getItem(`${username}_albums`)) || [],
  setUserAlbums: (username, albums) => localStorage.setItem(`${username}_albums`, JSON.stringify(albums)),

  // ===== Supabase Storage =====
  async uploadPhoto(file, userId) {
    const fileName = `${userId}_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(`users/${userId}/${fileName}`, file);

    if (error) throw new Error(`Ошибка загрузки: ${error.message}`);
    return fileName;
  },

  async getPhotoUrl(fileName) {
    const { data } = supabase.storage
      .from('photos')
      .getPublicUrl(`users/${userId}/${fileName}`);
    return data.publicUrl;
  },

  async deletePhoto(fileName) {
    const { error } = await supabase.storage
      .from('photos')
      .remove([`users/${userId}/${fileName}`]);
    if (error) throw new Error(`Ошибка удаления: ${error.message}`);
  }
};

// Валидация (оставляем без изменений)
const Validator = {
  username: (value) => /^[A-Za-z0-9_\-]{1,30}$/.test(value),
  password: (value) => /^[A-Za-z0-9!@#$%^&*]{1,15}$/.test(value),
  sanitizeUsername: (value) => value.replace(/[^A-Za-z0-9_\-]/g, '').slice(0, 30),
  sanitizePassword: (value) => value.replace(/[^A-Za-z0-9!@#$%^&*]/g, '').slice(0, 15)
};

// Проверка авторизации (без изменений)
function checkAuth() {
  const protectedPages = ['profile.html', 'albums.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (protectedPages.includes(currentPage) && !Storage.getCurrentUser()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}