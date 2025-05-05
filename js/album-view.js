// Инициализация Supabase
const supabaseUrl = 'https://yejqvggvucldtyplcezm.supabase.co';
const supabaseKey = 'ваш_ключ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const backBtn = document.getElementById('back-to-albums');
    const albumTitle = document.getElementById('album-title');
    const albumDate = document.getElementById('album-date');
    const photosGrid = document.getElementById('photos-grid');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const currentUser = Storage.getCurrentUser();
    
    // Получаем ID альбома из URL (например: album-view.html?albumId=123)
    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('albumId');
    
    // Загружаем данные альбома
    const album = Storage.getUserAlbums(currentUser).find(a => a.id === albumId);
    if (!album) {
        alert('Альбом не найден!');
        window.location.href = 'albums.html';
        return;
    }
    
    // Отображаем информацию об альбоме
    albumTitle.textContent = album.name;
    albumDate.textContent = `Создан: ${new Date(album.createdAt).toLocaleDateString()}`;
    
    // Загружаем фотографии альбома
    await loadAlbumPhotos(albumId);
    
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
        
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                // 1. Загружаем фото в Supabase Storage
                const fileName = `${currentUser}_${albumId}_${Date.now()}_${file.name}`;
                const { data, error } = await supabase.storage
                    .from('photos')
                    .upload(`albums/${albumId}/${fileName}`, file);
                
                if (error) throw error;
                
                // 2. Сохраняем ссылку в локальное хранилище
                const photoUrl = supabase.storage
                    .from('photos')
                    .getPublicUrl(`albums/${albumId}/${fileName}`).data.publicUrl;
                
                const updatedAlbum = {
                    ...album,
                    photos: [...(album.photos || []), { id: fileName, url: photoUrl }]
                };
                
                Storage.setUserAlbums(
                    currentUser,
                    Storage.getUserAlbums(currentUser).map(a => 
                        a.id === albumId ? updatedAlbum : a
                    )
                );
                
                // 3. Обновляем интерфейс
                await loadAlbumPhotos(albumId);
                alert('Фото успешно добавлено!');
            } catch (error) {
                alert(`Ошибка: ${error.message}`);
            }
        });
    });
    
    // Функция загрузки фотографий альбома
    async function loadAlbumPhotos(albumId) {
        const album = Storage.getUserAlbums(currentUser).find(a => a.id === albumId);
        photosGrid.innerHTML = '';
        
        if (!album.photos || album.photos.length === 0) {
            photosGrid.innerHTML = '<p class="empty-album">В альбоме пока нет фотографий.</p>';
            return;
        }
        
        album.photos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.innerHTML = `
                <img src="${photo.url}" alt="Фото">
                <button class="delete-photo-btn" data-photo-id="${photo.id}">×</button>
            `;
            photosGrid.appendChild(photoElement);
            
            // Кнопка удаления фото
            photoElement.querySelector('.delete-photo-btn').addEventListener('click', async () => {
                if (!confirm('Удалить фотографию?')) return;
                
                try {
                    // Удаляем из Supabase Storage
                    await supabase.storage
                        .from('photos')
                        .remove([`albums/${albumId}/${photo.id}`]);
                    
                    // Удаляем из локального хранилища
                    const updatedAlbum = {
                        ...album,
                        photos: album.photos.filter(p => p.id !== photo.id)
                    };
                    
                    Storage.setUserAlbums(
                        currentUser,
                        Storage.getUserAlbums(currentUser).map(a => 
                            a.id === albumId ? updatedAlbum : a
                        )
                    );
                    
                    // Обновляем интерфейс
                    await loadAlbumPhotos(albumId);
                } catch (error) {
                    alert(`Ошибка удаления: ${error.message}`);
                }
            });
        });
    }
});