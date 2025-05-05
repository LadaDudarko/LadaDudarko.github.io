document.addEventListener('DOMContentLoaded', () => {
    // Проверка авторизации
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'register.html';
        return;
    }

    // Загрузка альбомов из localStorage
    let albums = JSON.parse(localStorage.getItem(`${currentUser}_albums`)) || [];
    let currentPage = 1;
    const ALBUMS_PER_PAGE = 6;

    // Инициализация
    renderAlbums();

    // Кнопка "Назад в профиль"
    document.getElementById('back-to-profile').addEventListener('click', () => {
        window.location.href = 'profile.html';
    });

    // Добавление альбома
    document.getElementById('add-album').addEventListener('click', () => {
        const name = prompt("Введите название альбома:");
        if (!name) return;
        
        const date = prompt("Введите дату съёмки (например, 01.01.2023):");
        if (!date) return;
        
        const newAlbum = {
            id: Date.now(), // Уникальный ID для альбома
            name,
            date,
            photos: []
        };
        
        albums.unshift(newAlbum);
        saveAlbums();
        currentPage = 1;
        renderAlbums();
    });

    // Пагинация
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderAlbums();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage * ALBUMS_PER_PAGE < albums.length) {
            currentPage++;
            renderAlbums();
        }
    });

    function renderAlbums() {
        const grid = document.getElementById('albums-grid');
        const paginationInfo = document.getElementById('page-info');
        grid.innerHTML = '';

        const startIndex = (currentPage - 1) * ALBUMS_PER_PAGE;
        const endIndex = startIndex + ALBUMS_PER_PAGE;
        const albumsToShow = albums.slice(startIndex, endIndex);

        if (albums.length === 0) {
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
                <p>Фотографий: ${album.photos.length}</p>
                <div class="album-actions">
                    <button class="view-album" data-id="${album.id}">Открыть альбом</button>
                    <button class="delete-album" data-id="${album.id}">Удалить альбом</button>
                </div>
            `;
            grid.appendChild(card);
        });

        // Обработчики для кнопок
        document.querySelectorAll('.view-album').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const albumId = parseInt(e.target.getAttribute('data-id'));
                openAlbumView(albumId);
            });
        });

        document.querySelectorAll('.delete-album').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const albumId = parseInt(e.target.getAttribute('data-id'));
                deleteAlbum(albumId);
            });
        });

        updatePagination();
    }

    function openAlbumView(albumId) {
        // Сохраняем ID альбома для просмотра
        localStorage.setItem('currentAlbumId', albumId);
        window.location.href = 'album-view.html';
    }

    function deleteAlbum(albumId) {
        const albumIndex = albums.findIndex(a => a.id === albumId);
        if (albumIndex === -1) return;

        if (confirm(`Вы уверены, что хотите удалить альбом "${albums[albumIndex].name}"?`)) {
            albums.splice(albumIndex, 1);
            saveAlbums();
            
            if (albums.length <= (currentPage - 1) * ALBUMS_PER_PAGE && currentPage > 1) {
                currentPage--;
            }
            
            renderAlbums();
        }
    }

    function updatePagination() {
        const paginationInfo = document.getElementById('page-info');
        const totalPages = Math.ceil(albums.length / ALBUMS_PER_PAGE);
        paginationInfo.textContent = `Страница ${currentPage} из ${totalPages || 1}`;
        
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = 
            currentPage === totalPages || totalPages === 0;
    }

    function saveAlbums() {
        localStorage.setItem(`${currentUser}_albums`, JSON.stringify(albums));
    }
});