// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И УТИЛИТЫ =====
const Storage = {
    getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
    setUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
    getCurrentUser: () => localStorage.getItem('currentUser'),
    setCurrentUser: (username) => localStorage.setItem('currentUser', username),
    clearCurrentUser: () => localStorage.removeItem('currentUser'),
    getUserAlbums: (username) => JSON.parse(localStorage.getItem(`${username}_albums`)) || [],
    setUserAlbums: (username, albums) => localStorage.setItem(`${username}_albums`, JSON.stringify(albums)),
    getUserData: (username, key) => localStorage.getItem(`${username}_${key}`),
    setUserData: (username, key, value) => localStorage.setItem(`${username}_${key}`, value)
  };
  
  const Validator = {
    username: (value) => /^[A-Za-z0-9_\-]{1,30}$/.test(value),
    password: (value) => /^[A-Za-z0-9!@#$%^&*]{1,15}$/.test(value),
    sanitizeUsername: (value) => value.replace(/[^A-Za-z0-9_\-]/g, '').slice(0, 30),
    sanitizePassword: (value) => value.replace(/[^A-Za-z0-9!@#$%^&*]/g, '').slice(0, 15)
  };
  
  // ===== ОСНОВНОЙ МОДУЛЬ =====
  const PhotoCloudApp = {
    currentUser: null,
    albums: [],
    currentPage: 1,
    ALBUMS_PER_PAGE: 6,
  
    init() {
      // Проверка авторизации для защищенных страниц
      const protectedPages = ['profile.html', 'albums.html'];
      const currentPage = window.location.pathname.split('/').pop();
      
      if (protectedPages.includes(currentPage)) {
        this.currentUser = Storage.getCurrentUser();
        if (!this.currentUser) {
          window.location.href = 'login.html';
          return;
        }
        this.albums = Storage.getUserAlbums(this.currentUser);
      }
  
      // Инициализация компонентов
      if (document.getElementById('login-form')) this.initLoginForm();
      if (document.getElementById('register-form')) this.initRegisterForm();
      if (document.getElementById('edit-profile')) this.initProfile();
      if (document.getElementById('albums-grid')) this.initAlbums();
      if (document.getElementById('logout-btn')) this.initLogout();
      if (document.getElementById('back-to-profile')) this.initBackButton();
    },
  
    // ===== АВТОРИЗАЦИЯ =====
    initLoginForm() {
      const form = document.getElementById('login-form');
      const usernameInput = document.getElementById('login-username');
      const passwordInput = document.getElementById('login-password');
  
      // Валидация в реальном времени
      usernameInput.addEventListener('input', () => {
        usernameInput.value = Validator.sanitizeUsername(usernameInput.value);
      });
  
      passwordInput.addEventListener('input', () => {
        passwordInput.value = Validator.sanitizePassword(passwordInput.value);
      });
  
      // Обработка отправки формы
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = usernameInput.value;
        const password = passwordInput.value;
  
        if (!Validator.username(username)) {
          alert('Логин должен содержать только латинские буквы, цифры, "_" или "-"');
          return;
        }
  
        if (!Validator.password(password)) {
          alert('Пароль содержит недопустимые символы');
          return;
        }
  
        const users = Storage.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
  
        if (user) {
          Storage.setCurrentUser(username);
          window.location.href = 'profile.html';
        } else {
          alert('Неверный логин или пароль!');
        }
      });
    },
  
    // ===== РЕГИСТРАЦИЯ =====
    initRegisterForm() {
      const form = document.getElementById('register-form');
      const usernameInput = document.getElementById('reg-username');
      const passwordInput = document.getElementById('reg-password');
  
      // Валидация в реальном времени
      usernameInput.addEventListener('input', () => {
        usernameInput.value = Validator.sanitizeUsername(usernameInput.value);
      });
  
      passwordInput.addEventListener('input', () => {
        passwordInput.value = Validator.sanitizePassword(passwordInput.value);
      });
  
      // Обработка отправки формы
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = usernameInput.value;
        const password = passwordInput.value;
  
        if (!Validator.username(username)) {
          alert('Логин должен содержать только латинские буквы, цифры, "_" или "-"');
          return;
        }
  
        if (!Validator.password(password)) {
          alert('Пароль содержит недопустимые символы');
          return;
        }
  
        const users = Storage.getUsers();
  
        if (users.some(u => u.username === username)) {
          alert('Пользователь уже существует!');
          return;
        }
  
        users.push({ username, password });
        Storage.setUsers(users);
        Storage.setCurrentUser(username); // Автоматическая авторизация после регистрации
        alert('Регистрация успешна!');
        window.location.href = 'profile.html';
      });
    },
  
    // ===== ПРОФИЛЬ =====
    initProfile() {
      this.currentUser = Storage.getCurrentUser();
      if (!this.currentUser) {
        window.location.href = 'login.html';
        return;
      }
  
      this.updateProfile();
  
      document.getElementById('welcome-msg').textContent = `Профиль: ${this.currentUser}`;
  
      document.getElementById('edit-profile').addEventListener('click', () => {
        const firstName = prompt("Имя:", Storage.getUserData(this.currentUser, 'firstName') || '');
        const lastName = prompt("Фамилия:", Storage.getUserData(this.currentUser, 'lastName') || '');
        const city = prompt("Город:", Storage.getUserData(this.currentUser, 'city') || '');
        const profession = prompt("Род деятельности:", Storage.getUserData(this.currentUser, 'profession') || '');
        const price = prompt("Стоимость съёмки:", Storage.getUserData(this.currentUser, 'price') || '');
  
        if (firstName !== null) Storage.setUserData(this.currentUser, 'firstName', firstName);
        if (lastName !== null) Storage.setUserData(this.currentUser, 'lastName', lastName);
        if (city !== null) Storage.setUserData(this.currentUser, 'city', city);
        if (profession !== null) Storage.setUserData(this.currentUser, 'profession', profession);
        if (price !== null) Storage.setUserData(this.currentUser, 'price', price);
        
        this.updateProfile();
      });
  
      document.getElementById('view-albums').addEventListener('click', () => {
        window.location.href = 'albums.html';
      });
    },
  
    updateProfile() {
      document.getElementById('first-name').textContent = 
        Storage.getUserData(this.currentUser, 'firstName') || "Не указано";
      document.getElementById('last-name').textContent = 
        Storage.getUserData(this.currentUser, 'lastName') || "Не указано";
      document.getElementById('city').textContent = 
        Storage.getUserData(this.currentUser, 'city') || "Не указано";
      document.getElementById('profession').textContent = 
        Storage.getUserData(this.currentUser, 'profession') || "Не указано";
      document.getElementById('price').textContent = 
        Storage.getUserData(this.currentUser, 'price') || "Не указано";
    },
  
    // ===== АЛЬБОМЫ =====
    initAlbums() {
      this.currentUser = Storage.getCurrentUser();
      if (!this.currentUser) {
        window.location.href = 'login.html';
        return;
      }
  
      this.albums = Storage.getUserAlbums(this.currentUser);
      this.currentPage = 1;
      this.renderAlbums();
  
      document.getElementById('prev-page').addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderAlbums();
        }
      });
  
      document.getElementById('next-page').addEventListener('click', () => {
        if (this.currentPage * this.ALBUMS_PER_PAGE < this.albums.length) {
          this.currentPage++;
          this.renderAlbums();
        }
      });
  
      document.getElementById('add-album').addEventListener('click', () => {
        const name = prompt("Название альбома:");
        const date = prompt("Дата съёмки (например, 01.01.2023):");
        
        if (name && date) {
          this.albums.unshift({ name, date, photos: [] });
          Storage.setUserAlbums(this.currentUser, this.albums);
          this.currentPage = 1;
          this.renderAlbums();
        }
      });
    },
  
    renderAlbums() {
      const grid = document.getElementById('albums-grid');
      const paginationInfo = document.getElementById('page-info');
      grid.innerHTML = '';
  
      const startIndex = (this.currentPage - 1) * this.ALBUMS_PER_PAGE;
      const endIndex = startIndex + this.ALBUMS_PER_PAGE;
      const albumsToShow = this.albums.slice(startIndex, endIndex);
  
      if (this.albums.length === 0) {
        grid.innerHTML = '<p class="no-albums">У вас пока нет альбомов</p>';
        paginationInfo.textContent = '';
        return;
      }
  
      albumsToShow.forEach((album, index) => {
        const globalIndex = startIndex + index;
        const card = document.createElement('div');
        card.className = 'album-card';
        card.innerHTML = `
          <h3>${album.name}</h3>
          <p>Дата съёмки: ${album.date}</p>
          <div class="album-actions">
            <input type="file" class="add-photos" data-album="${globalIndex}" multiple accept="image/*">
            <button class="view-album" data-album="${globalIndex}">Просмотр</button>
            <button class="delete-album" data-index="${globalIndex}">Удалить</button>
          </div>
        `;
        grid.appendChild(card);
      });
  
      // Обработчики для добавления фото
      document.querySelectorAll('.add-photos').forEach(input => {
        input.addEventListener('change', (e) => {
          const albumIndex = e.target.getAttribute('data-album');
          const files = Array.from(e.target.files);
          
          if (files.length > 0) {
            files.forEach(file => {
              const reader = new FileReader();
              reader.onload = (event) => {
                this.albums[albumIndex].photos.push(event.target.result);
                Storage.setUserAlbums(this.currentUser, this.albums);
              };
              reader.readAsDataURL(file);
            });
            alert(`Добавлено ${files.length} фото в альбом`);
          }
        });
      });
  
      // Обработчики для просмотра альбома
      document.querySelectorAll('.view-album').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const albumIndex = e.target.getAttribute('data-album');
          const album = this.albums[albumIndex];
          if (album.photos && album.photos.length > 0) {
            alert(`В альбоме "${album.name}" ${album.photos.length} фото`);
          } else {
            alert('В этом альбоме пока нет фото');
          }
        });
      });
  
      paginationInfo.textContent = `Страница ${this.currentPage} из ${Math.ceil(this.albums.length / this.ALBUMS_PER_PAGE)}`;
  
      document.getElementById('prev-page').disabled = this.currentPage === 1;
      document.getElementById('next-page').disabled = 
        this.currentPage === Math.ceil(this.albums.length / this.ALBUMS_PER_PAGE);
  
      document.querySelectorAll('.delete-album').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          if (confirm(`Удалить альбом "${this.albums[index].name}"?`)) {
            this.albums.splice(index, 1);
            Storage.setUserAlbums(this.currentUser, this.albums);
            
            if (this.albums.length <= (this.currentPage - 1) * this.ALBUMS_PER_PAGE && this.currentPage > 1) {
              this.currentPage--;
            }
            
            this.renderAlbums();
          }
        });
      });
    },
  
    // ===== НАВИГАЦИЯ =====
    initBackButton() {
      document.getElementById('back-to-profile').addEventListener('click', () => {
        window.location.href = 'profile.html';
      });
    },
  
    // ===== ВЫХОД =====
    initLogout() {
      document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите выйти?')) {
          Storage.clearCurrentUser();
          window.location.href = 'login.html';
        }
      });
    }
  };
  
  // Инициализация приложения при загрузке страницы
  document.addEventListener('DOMContentLoaded', () => {
    PhotoCloudApp.init();
  });