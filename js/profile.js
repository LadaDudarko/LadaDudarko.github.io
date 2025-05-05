document.addEventListener('DOMContentLoaded', () => {
    // Проверка авторизации
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'register.html';
        return;
    }

    // Элементы DOM
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarImage = document.getElementById('avatar-image');
    const avatarIcon = document.getElementById('avatar-icon');
    const profileAvatar = document.getElementById('profile-avatar');
    
    // Загрузка сохранённого аватара
    const savedAvatar = localStorage.getItem(`${currentUser}_avatar`);
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
            localStorage.setItem(`${currentUser}_avatar`, event.target.result);
            
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
  
    // Обновление данных профиля
    function updateProfile() {
        const profileData = {
            'first-name': localStorage.getItem(`${currentUser}_firstName`) || "Не указано",
            'last-name': localStorage.getItem(`${currentUser}_lastName`) || "Не указано",
            'city': localStorage.getItem(`${currentUser}_city`) || "Не указано",
            'profession': localStorage.getItem(`${currentUser}_profession`) || "Не указано",
            'price': localStorage.getItem(`${currentUser}_price`) || "Не указано"
        };
        
        // Анимированное обновление значений
        Object.keys(profileData).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.opacity = 0;
                setTimeout(() => {
                    element.textContent = profileData[id];
                    element.style.opacity = 1;
                    element.style.transition = 'opacity 0.3s ease';
                }, 100);
            }
        });
    }
    
    // Инициализация профиля
    updateProfile();

    // Редактирование профиля
    document.getElementById('edit-profile').addEventListener('click', () => {
        const firstName = prompt("Имя:", localStorage.getItem(`${currentUser}_firstName`) || '');
        const lastName = prompt("Фамилия:", localStorage.getItem(`${currentUser}_lastName`) || '');
        const city = prompt("Город:", localStorage.getItem(`${currentUser}_city`) || '');
        const profession = prompt("Род деятельности:", localStorage.getItem(`${currentUser}_profession`) || '');
        const price = prompt("Стоимость съёмки:", localStorage.getItem(`${currentUser}_price`) || '');

        if (firstName !== null) localStorage.setItem(`${currentUser}_firstName`, firstName);
        if (lastName !== null) localStorage.setItem(`${currentUser}_lastName`, lastName);
        if (city !== null) localStorage.setItem(`${currentUser}_city`, city);
        if (profession !== null) localStorage.setItem(`${currentUser}_profession`, profession);
        if (price !== null) localStorage.setItem(`${currentUser}_price`, price);
        
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
                localStorage.removeItem('isLoggedIn');
                window.location.href = 'login.html';
            }, 500);
        }
    });
});