document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) return;
  
  const currentUser = Storage.getCurrentUser();

    const avatarUpload = document.getElementById('avatar-upload');
    const avatarImage = document.getElementById('avatar-image');
    const avatarIcon = document.getElementById('avatar-icon');
    const profileAvatar = document.getElementById('profile-avatar');
    
    // Загрузка сохранённого аватара
    const savedAvatar = Storage.getUserData(currentUser, 'avatar');
    if (savedAvatar) {
        avatarImage.src = savedAvatar;
        avatarImage.style.display = 'block';
        avatarIcon.style.display = 'none';
    }
    
    // Обработчик клика по аватарке
    profileAvatar.addEventListener('click', () => {
        avatarUpload.click();
    });
    
    // Обработчик загрузки файла
    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите файл изображения');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            // Сохраняем аватар
            Storage.setUserData(currentUser, 'avatar', event.target.result);
            
            // Отображаем аватар
            avatarImage.src = event.target.result;
            avatarImage.style.display = 'block';
            avatarIcon.style.display = 'none';
            
            // Анимация
            avatarImage.style.opacity = '0';
            avatarImage.style.transform = 'scale(0.8)';
            setTimeout(() => {
                avatarImage.style.opacity = '1';
                avatarImage.style.transform = 'scale(1)';
                avatarImage.style.transition = 'all 0.3s ease';
            }, 10);
        };
        reader.readAsDataURL(file);
    });
  
  // Заполнение данных профиля с анимацией
  function updateProfile() {
      const elements = {
          'first-name': Storage.getUserData(currentUser, 'firstName') || "Не указано",
          'last-name': Storage.getUserData(currentUser, 'lastName') || "Не указано",
          'city': Storage.getUserData(currentUser, 'city') || "Не указано",
          'profession': Storage.getUserData(currentUser, 'profession') || "Не указано",
          'price': Storage.getUserData(currentUser, 'price') || "Не указано"
      };
      
      // Анимированное обновление значений
      Object.keys(elements).forEach(id => {
          const element = document.getElementById(id);
          element.style.opacity = 0;
          setTimeout(() => {
              element.textContent = elements[id];
              element.style.opacity = 1;
              element.style.transition = 'opacity 0.3s ease';
          }, 100);
      });
  }
  
  // Инициализация
  updateProfile();

  // Редактирование профиля
  document.getElementById('edit-profile').addEventListener('click', () => {
      const firstName = prompt("Имя:", Storage.getUserData(currentUser, 'firstName') || '');
      const lastName = prompt("Фамилия:", Storage.getUserData(currentUser, 'lastName') || '');
      const city = prompt("Город:", Storage.getUserData(currentUser, 'city') || '');
      const profession = prompt("Род деятельности:", Storage.getUserData(currentUser, 'profession') || '');
      const price = prompt("Стоимость съёмки:", Storage.getUserData(currentUser, 'price') || '');

      if (firstName !== null) Storage.setUserData(currentUser, 'firstName', firstName);
      if (lastName !== null) Storage.setUserData(currentUser, 'lastName', lastName);
      if (city !== null) Storage.setUserData(currentUser, 'city', city);
      if (profession !== null) Storage.setUserData(currentUser, 'profession', profession);
      if (price !== null) Storage.setUserData(currentUser, 'price', price);
      
      updateProfile();
      
      // Анимация успешного обновления
      const card = document.querySelector('.profile-card');
      card.style.transform = 'scale(1.02)';
      setTimeout(() => {
          card.style.transform = 'scale(1)';
          card.style.transition = 'transform 0.3s ease';
      }, 300);
  });

  // Переход к альбомам
  document.getElementById('view-albums').addEventListener('click', () => {
      document.querySelector('.profile-content').style.opacity = 0;
      setTimeout(() => {
          window.location.href = 'albums.html';
      }, 300);
  });

  // Выход
  document.getElementById('logout-btn').addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
          document.querySelector('.profile-wrapper').style.animation = 'fadeOut 0.5s ease';
          setTimeout(() => {
              Storage.clearCurrentUser();
              window.location.href = 'login.html';
          }, 500);
      }
  });
});