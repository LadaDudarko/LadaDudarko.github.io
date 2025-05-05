document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    const currentUser = Storage.getCurrentUser();
    const albums = Storage.getUserAlbums(currentUser) || [];
    const albumIndex = sessionStorage.getItem('currentAlbumIndex');
    const album = albums[albumIndex];
    const photosGrid = document.getElementById('photos-grid');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    
    // Проверка на существование альбома
    if (!album) {
        alert('Альбом не найден');
        window.location.href = 'albums.html';
        return;
    }
    
    // Инициализация альбома
    document.getElementById('album-title').textContent = album.name;
    document.getElementById('album-date').textContent = `Дата съёмки: ${album.date}`;
    
    // Кнопка "Назад"
    document.getElementById('back-to-albums').addEventListener('click', () => {
        window.location.href = 'albums.html';
    });
    
    // Загрузка и отображение фотографий
    renderPhotos();
    
    // Функция отображения фотографий
    function renderPhotos() {
        photosGrid.innerHTML = '';
        
        if (!album.photos || album.photos.length === 0) {
            photosGrid.innerHTML = `
                <div class="empty-album">
                    <i class="fas fa-images"></i>
                    <p>В альбоме пока нет фотографий</p>
                </div>
            `;
            return;
        }
        
        album.photos.forEach((photo, index) => {
            const photoItem = createPhotoElement(photo, index);
            photosGrid.appendChild(photoItem);
        });
    }
    
    // Создание элемента фотографии
    function createPhotoElement(photo, index) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo}" alt="Фото ${index + 1}">
            <button class="delete-photo" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        // Обработчик удаления фото
        photoItem.querySelector('.delete-photo').addEventListener('click', (e) => {
            e.stopPropagation();
            deletePhoto(index);
        });
        
        return photoItem;
    }
    
    // Функция добавления фото
    addPhotoBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;
            
            files.forEach((file, i) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Добавляем фото в альбом
                    if (!album.photos) album.photos = [];
                    album.photos.push(event.target.result);
                    Storage.setUserAlbums(currentUser, albums);
                    
                    // Создаем и добавляем элемент фото с анимацией
                    const photoItem = createPhotoElement(event.target.result, album.photos.length - 1);
                    photoItem.style.opacity = '0';
                    photoItem.style.transform = 'scale(0.8)';
                    photosGrid.appendChild(photoItem);
                    
                    // Убираем сообщение "нет фотографий" если оно есть
                    const emptyMessage = document.querySelector('.empty-album');
                    if (emptyMessage) emptyMessage.remove();
                    
                    // Анимация появления
                    setTimeout(() => {
                        photoItem.style.opacity = '1';
                        photoItem.style.transform = 'scale(1)';
                        photoItem.style.transition = 'all 0.3s ease';
                    }, 50 * i); // Задержка для каждого фото
                };
                reader.readAsDataURL(file);
            });
        };
        input.click();
    });
    
    // Функция удаления фото
    function deletePhoto(index) {
        if (confirm('Удалить эту фотографию?')) {
            album.photos.splice(index, 1);
            Storage.setUserAlbums(currentUser, albums);
            renderPhotos();
        }
    }
});