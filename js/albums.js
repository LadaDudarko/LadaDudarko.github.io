document.addEventListener('DOMContentLoaded', () => {
    // Инициализация Firebase
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Проверка авторизации
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'register.html';
            return;
        }

        const currentUser = user.uid;
        let albums = [];
        let currentPage = 1;
        const ALBUMS_PER_PAGE = 6;

        // Загрузка альбомов из Firestore
        function loadAlbums() {
            db.collection('users').doc(currentUser).collection('albums')
                .orderBy('createdAt', 'desc')
                .get()
                .then(querySnapshot => {
                    albums = [];
                    querySnapshot.forEach(doc => {
                        albums.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    renderAlbums();
                })
                .catch(error => {
                    console.error("Ошибка загрузки альбомов:", error);
                    alert('Не удалось загрузить альбомы');
                });
        }

        // Инициализация
        loadAlbums();

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
                name,
                date,
                photos: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Добавляем альбом в Firestore
            db.collection('users').doc(currentUser).collection('albums').add(newAlbum)
                .then(() => {
                    currentPage = 1;
                    loadAlbums(); // Перезагружаем альбомы
                })
                .catch(error => {
                    console.error("Ошибка создания альбома:", error);
                    alert('Не удалось создать альбом');
                });
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

            albumsToShow.forEach(album => {
                const card = document.createElement('div');
                card.className = 'album-card';
                card.innerHTML = `
                    <h3>${album.name}</h3>
                    <p>Дата съёмки: ${album.date}</p>
                    <div class="album-actions">
                        <button class="view-album" data-id="${album.id}">Открыть альбом</button>
                        <button class="delete-album" data-id="${album.id}">Удалить альбом</button>
                    </div>
                `;
                grid.appendChild(card);
            });

            // Добавляем обработчики событий для новых кнопок
            addAlbumEventListeners();
            updatePagination();
        }

        function addAlbumEventListeners() {
            // Обработчики для кнопок "Открыть альбом"
            document.querySelectorAll('.view-album').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const albumId = e.target.getAttribute('data-id');
                    openAlbumView(albumId);
                });
            });

            // Обработчики для кнопок "Удалить альбом"
            document.querySelectorAll('.delete-album').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const albumId = e.target.getAttribute('data-id');
                    deleteAlbum(albumId);
                });
            });
        }

        function openAlbumView(albumId) {
            // Сохраняем ID альбома для просмотра
            localStorage.setItem('currentAlbumId', albumId);
            window.location.href = 'album-view.html';
        }

        function deleteAlbum(albumId) {
            const album = albums.find(a => a.id === albumId);
            if (!album) return;

            if (confirm(`Вы уверены, что хотите удалить альбом "${album.name}"?`)) {
                db.collection('users').doc(currentUser).collection('albums').doc(albumId).delete()
                    .then(() => {
                        loadAlbums(); // Перезагружаем альбомы после удаления
                        
                        // Корректируем номер страницы, если нужно
                        if (albums.length <= (currentPage - 1) * ALBUMS_PER_PAGE && currentPage > 1) {
                            currentPage--;
                        }
                    })
                    .catch(error => {
                        console.error("Ошибка удаления альбома:", error);
                        alert('Не удалось удалить альбом');
                    });
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
    });
});