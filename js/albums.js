document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) return;
  
  const currentUser = Storage.getCurrentUser();
  let albums = Storage.getUserAlbums(currentUser) || [];
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
          name,
          date,
          photos: []
      };
      
      albums.unshift(newAlbum);
      Storage.setUserAlbums(currentUser, albums);
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
              <p>Фотографий: ${album.photos ? album.photos.length : 0}</p>
              <div class="album-actions">
                  <button class="view-album" data-index="${globalIndex}">Открыть альбом</button>
                  <button class="delete-album" data-index="${globalIndex}">Удалить альбом</button>
              </div>
          `;
          grid.appendChild(card);
      });

      // Обработчики для кнопок
      document.querySelectorAll('.view-album').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const index = e.target.getAttribute('data-index');
              openAlbumView(index);
          });
      });

      document.querySelectorAll('.delete-album').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const index = e.target.getAttribute('data-index');
              deleteAlbum(index);
          });
      });

      updatePagination();
  }

  function openAlbumView(index) {
      // Сохраняем индекс альбома для использования в album-view.html
      sessionStorage.setItem('currentAlbumIndex', index);
      window.location.href = 'album-view.html';
  }

  function deleteAlbum(index) {
      if (confirm(`Вы уверены, что хотите удалить альбом "${albums[index].name}"?`)) {
          albums.splice(index, 1);
          Storage.setUserAlbums(currentUser, albums);
          
          if (albums.length <= (currentPage - 1) * ALBUMS_PER_PAGE && currentPage > 1) {
              currentPage--;
          }
          
          renderAlbums();
      }
  }

  function updatePagination() {
      const paginationInfo = document.getElementById('page-info');
      paginationInfo.textContent = `Страница ${currentPage} из ${Math.ceil(albums.length / ALBUMS_PER_PAGE)}`;
      
      document.getElementById('prev-page').disabled = currentPage === 1;
      document.getElementById('next-page').disabled = 
          currentPage === Math.ceil(albums.length / ALBUMS_PER_PAGE);
  }
});