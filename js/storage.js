const Storage = {
  // Работа с пользователями
  getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
  setUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
  
  // Текущий пользователь
  getCurrentUser: () => localStorage.getItem('currentUser'),
  setCurrentUser: (email) => localStorage.setItem('currentUser', email),
  clearCurrentUser: () => localStorage.removeItem('currentUser'),
  
  // Данные пользователя
  getUserData: (email, key) => {
      const data = JSON.parse(localStorage.getItem(`${email}_data`)) || {};
      return key ? data[key] : data;
  },
  setUserData: (email, key, value) => {
      const data = JSON.parse(localStorage.getItem(`${email}_data`)) || {};
      data[key] = value;
      localStorage.setItem(`${email}_data`, JSON.stringify(data));
  },
  
  // Альбомы пользователя
  getUserAlbums: (email) => JSON.parse(localStorage.getItem(`${email}_albums`)) || [],
  setUserAlbums: (email, albums) => localStorage.setItem(`${email}_albums`, JSON.stringify(albums)),
  
  // Фото в альбомах (хранятся как Data URLs)
  addPhotoToAlbum: (email, albumId, photoData) => {
      const albums = JSON.parse(localStorage.getItem(`${email}_albums`)) || [];
      const album = albums.find(a => a.id === albumId);
      if (album) {
          album.photos = album.photos || [];
          album.photos.push(photoData);
          localStorage.setItem(`${email}_albums`, JSON.stringify(albums));
      }
  },
  
  // Удаление фото из альбома
  removePhotoFromAlbum: (email, albumId, photoId) => {
      const albums = JSON.parse(localStorage.getItem(`${email}_albums`)) || [];
      const album = albums.find(a => a.id === albumId);
      if (album && album.photos) {
          album.photos = album.photos.filter(p => p.id !== photoId);
          localStorage.setItem(`${email}_albums`, JSON.stringify(albums));
      }
  }
};

// Валидация
const Validator = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value) => value.length >= 6 && value.length <= 30,
  sanitizeInput: (value) => value.trim()
};

// Проверка авторизации
function checkAuth() {
  const protectedPages = ['profile.html', 'albums.html', 'album-view.html'];
  const currentPage = window.location.pathname.split('/').pop();
  if (protectedPages.includes(currentPage) && !Storage.getCurrentUser()) {
      window.location.href = 'login.html';
      return false;
  }
  return true;
}