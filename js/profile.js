document.addEventListener('DOMContentLoaded', () => {
    // Инициализация Firestore
    const db = firebase.firestore();
    
    // Проверка авторизации
    firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'register.html';
            return;
        }

        const userId = user.uid;
        const currentUser = user.email;
        localStorage.setItem('currentUser', currentUser);

        // Элементы DOM
        const avatarUpload = document.getElementById('avatar-upload');
        const avatarImage = document.getElementById('avatar-image');
        const avatarIcon = document.getElementById('avatar-icon');
        const profileAvatar = document.getElementById('profile-avatar');
        
        // Загрузка данных профиля из Firestore
        async function loadProfile() {
            const doc = await db.collection("users").doc(userId).get();
            if (doc.exists) {
                const data = doc.data();
                
                // Обновляем UI
                document.getElementById('first-name').textContent = data.firstName || "Не указано";
                document.getElementById('last-name').textContent = data.lastName || "Не указано";
                document.getElementById('city').textContent = data.city || "Не указано";
                document.getElementById('profession').textContent = data.profession || "Не указано";
                document.getElementById('price').textContent = data.price || "Не указано";

                // Загрузка аватара
                if (data.avatarUrl) {
                    avatarImage.src = data.avatarUrl;
                    avatarImage.style.display = 'block';
                    avatarIcon.style.display = 'none';
                }
            }
        }
        
        // Обработчик аватара
        profileAvatar.addEventListener('click', () => avatarUpload.click());
        
        avatarUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file?.type.match('image.*')) {
                alert('Пожалуйста, выберите файл изображения');
                return;
            }
            
            try {
                // Загрузка в Firebase Storage
                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(`users/${userId}/avatar/${file.name}`);
                await fileRef.put(file);
                const avatarUrl = await fileRef.getDownloadURL();
                
                // Сохранение ссылки в Firestore
                await db.collection("users").doc(userId).set({
                    avatarUrl: avatarUrl
                }, { merge: true });
                
                // Обновление UI
                avatarImage.src = avatarUrl;
                avatarImage.style.display = 'block';
                avatarIcon.style.display = 'none';
                
            } catch (error) {
                console.error("Ошибка загрузки аватара:", error);
                alert('Ошибка при загрузке аватара');
            }
        });
        
        // Редактирование профиля
        document.getElementById('edit-profile').addEventListener('click', async () => {
            const doc = await db.collection("users").doc(userId).get();
            const currentData = doc.exists ? doc.data() : {};
            
            const newData = {
                firstName: prompt("Имя:", currentData.firstName || '') || currentData.firstName,
                lastName: prompt("Фамилия:", currentData.lastName || '') || currentData.lastName,
                city: prompt("Город:", currentData.city || '') || currentData.city,
                profession: prompt("Род деятельности:", currentData.profession || '') || currentData.profession,
                price: prompt("Стоимость съёмки:", currentData.price || '') || currentData.price,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection("users").doc(userId).set(newData, { merge: true });
            loadProfile();
        });
        
        // Остальной функционал без изменений
        document.getElementById('view-albums').addEventListener('click', () => {
            window.location.href = 'albums.html';
        });
        
        document.getElementById('logout-btn').addEventListener('click', () => {
            if (confirm('Выйти из аккаунта?')) {
                firebase.auth().signOut();
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        });
        
        // Первоначальная загрузка
        loadProfile();
    });
});