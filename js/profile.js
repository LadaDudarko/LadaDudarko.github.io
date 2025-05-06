// Инициализация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAU_wsqmoLRXa1qc-VMw-oWeQIuVJvLqmY",
    authDomain: "photoapp-8ca2b.firebaseapp.com",
    projectId: "photoapp-8ca2b",
    storageBucket: "photoapp-8ca2b.appspot.com",
    messagingSenderId: "245208033102",
    appId: "1:245208033102:web:e20153a5a36add1bd3e01f",
    measurementId: "G-TQC7CG4C36"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

document.addEventListener('DOMContentLoaded', () => {
    // Проверка авторизации
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'register.html';
            return;
        }
        
        const currentUser = user.uid;
        
        // Элементы DOM
        const avatarUpload = document.getElementById('avatar-upload');
        const avatarImage = document.getElementById('avatar-image');
        const avatarIcon = document.getElementById('avatar-icon');
        const profileAvatar = document.getElementById('profile-avatar');
        
        // Загрузка данных профиля из Firestore
        function loadProfileData() {
            db.collection('users').doc(currentUser).get()
                .then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        
                        // Обновляем данные на странице
                        updateProfileDisplay(data);
                        
                        // Загружаем аватар, если он есть
                        if (data.avatarUrl) {
                            avatarImage.src = data.avatarUrl;
                            avatarImage.style.display = 'block';
                            avatarIcon.style.display = 'none';
                        }
                    } else {
                        // Создаем новый документ для пользователя, если его нет
                        db.collection('users').doc(currentUser).set({
                            firstName: "",
                            lastName: "",
                            city: "",
                            profession: "",
                            price: "",
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                })
                .catch(error => {
                    console.error("Ошибка загрузки данных:", error);
                });
        }
        
        // Обновление отображения профиля
        function updateProfileDisplay(data) {
            const profileData = {
                'first-name': data.firstName || "Не указано",
                'last-name': data.lastName || "Не указано",
                'city': data.city || "Не указано",
                'profession': data.profession || "Не указано",
                'price': data.price || "Не указано"
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
            
            // Загружаем файл в Firebase Storage
            const storageRef = storage.ref(`avatars/${currentUser}/${file.name}`);
            const uploadTask = storageRef.put(file);
            
            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Прогресс загрузки
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                }, 
                (error) => {
                    console.error("Ошибка загрузки:", error);
                    alert('Ошибка загрузки изображения');
                }, 
                () => {
                    // После успешной загрузки получаем URL
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        // Обновляем документ пользователя с новым URL аватара
                        db.collection('users').doc(currentUser).update({
                            avatarUrl: downloadURL,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => {
                            // Отображаем аватар
                            avatarImage.src = downloadURL;
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
                        })
                        .catch(error => {
                            console.error("Ошибка обновления профиля:", error);
                        });
                    });
                }
            );
        });
        
        // Редактирование профиля
        document.getElementById('edit-profile').addEventListener('click', () => {
            db.collection('users').doc(currentUser).get()
                .then(doc => {
                    const data = doc.data();
                    
                    const firstName = prompt("Имя:", data.firstName || '');
                    const lastName = prompt("Фамилия:", data.lastName || '');
                    const city = prompt("Город:", data.city || '');
                    const profession = prompt("Род деятельности:", data.profession || '');
                    const price = prompt("Стоимость съёмки:", data.price || '');
                    
                    const updates = {
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    if (firstName !== null) updates.firstName = firstName;
                    if (lastName !== null) updates.lastName = lastName;
                    if (city !== null) updates.city = city;
                    if (profession !== null) updates.profession = profession;
                    if (price !== null) updates.price = price;
                    
                    return db.collection('users').doc(currentUser).update(updates);
                })
                .then(() => {
                    // Перезагружаем данные профиля
                    return db.collection('users').doc(currentUser).get();
                })
                .then(doc => {
                    updateProfileDisplay(doc.data());
                    
                    // Анимация успешного обновления
                    const card = document.querySelector('.profile-card');
                    card.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'transform 0.3s ease';
                    }, 300);
                })
                .catch(error => {
                    console.error("Ошибка обновления профиля:", error);
                });
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
                    auth.signOut().then(() => {
                        window.location.href = 'login.html';
                    }).catch(error => {
                        console.error("Ошибка выхода:", error);
                    });
                }, 500);
            }
        });
        
        // Инициализация профиля
        loadProfileData();
    });
});