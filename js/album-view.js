document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
  
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'register.html';
            return;
        }
  
        // Кнопка "Назад"
        document.getElementById('back-to-albums').addEventListener('click', () => {
            window.location.href = 'albums.html';
        });
        
        // Загрузка статических фотографий
        loadStaticPhotos();
    });
  
    function loadStaticPhotos() {
        const photosGrid = document.getElementById('photos-grid');
        
        // Массив статических фотографий
        const staticPhotos = [
            {
                url: "https://i.pinimg.com/736x/30/86/f0/3086f08e90bb98ecb3e0eae4870a941f.jpg", 
                description: "Кот маленький"
            },
            {
                url: "https://i.pinimg.com/736x/82/6c/b2/826cb2420a677369979e15f8e279e678.jpg",
                description: "Собака работящая"
            },
            {
                url: "https://i.pinimg.com/736x/23/12/44/2312442b9b43b683edc5ac0d1dc6a741.jpg",
                description: "Собака стильная"
            }
            // Добавьте больше фото по необходимости
        ];
        
        // Установка заголовка альбома
        document.getElementById('album-title').textContent = "Мой фотоальбом";
        
        // Очистка сетки
        photosGrid.innerHTML = '';
        
        // Добавление фотографий в сетку
        staticPhotos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.innerHTML = `
                <img src="${photo.url}" alt="${photo.description}">
                <p>${photo.description}</p>
            `;
            photosGrid.appendChild(photoElement);
        });
    }
});