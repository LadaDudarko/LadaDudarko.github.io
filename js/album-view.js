document.addEventListener('DOMContentLoaded', () => {
    // Проверка авторизации
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'register.html';
        return;
    }

    // Элементы DOM
    const backBtn = document.getElementById('back-to-albums');
    const albumTitle = document.getElementById('album-title');
    const albumDate = document.getElementById('album-date');
    const photosGrid = document.getElementById('photos-grid');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    
    // Получаем ID альбома из localStorage
    const albumId = localStorage.getItem('currentAlbumId');
    if (!albumId) {
        alert('Альбом не найден!');
        window.location.href = 'albums.html';
        return;
    }
    
    // Загружаем альбомы пользователя
    const albums = JSON.parse(localStorage.getItem(`${currentUser}_albums`)) || [];
    const album = albums.find(a => a.id.toString() === albumId);
    
    if (!album) {
        alert('Альбом не найден!');
        window.location.href = 'albums.html';
        return;
    }
    
    // Отображаем информацию об альбоме
    albumTitle.textContent = album.name;
    albumDate.textContent = `Дата создания: ${album.date || 'не указана'}`;
    
    // Загружаем фотографии альбома
    loadAlbumPhotos(album);
    
    // Кнопка "Назад"
    backBtn.addEventListener('click', () => {
        window.location.href = 'albums.html';
    });
    
    // Кнопка "Добавить фотографию"
    addPhotoBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                // Создаем уникальный ID для фото
                const photoId = Date.now();
                
                // Добавляем фото в альбом
                const newPhoto = {
                    id: photoId,
                    dataUrl: event.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type
                };
                
                album.photos.push(newPhoto);
                saveAlbums(albums);
                loadAlbumPhotos(album);
            };
            reader.readAsDataURL(file);
        });
    });
    
    // Функция загрузки фотографий альбома
    function loadAlbumPhotos(album) {
        photosGrid.innerHTML = '';
        
        if (!album.photos || album.photos.length === 0) {
            photosGrid.innerHTML = '<p class="empty-album">В альбоме пока нет фотографий.</p>';
            return;
        }
        
        album.photos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.innerHTML = `
                <img src="${photo.dataUrl}" alt="${photo.name}">
                <button class="delete-photo-btn" data-photo-id="${photo.id}">×</button>
            `;
            photosGrid.appendChild(photoElement);
            
            // Кнопка удаления фото
            photoElement.querySelector('.delete-photo-btn').addEventListener('click', () => {
                if (!confirm('Удалить фотографию?')) return;
                
                // Удаляем фото из альбома
                const photoIndex = album.photos.findIndex(p => p.id === photo.id);
                if (photoIndex !== -1) {
                    album.photos.splice(photoIndex, 1);
                    saveAlbums(albums);
                    loadAlbumPhotos(album);
                }
            });
        });
    }
    
    // Сохранение альбомов в localStorage
    function saveAlbums(albums) {
        localStorage.setItem(`${currentUser}_albums`, JSON.stringify(albums));
    }
});