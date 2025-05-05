// db.js - расширенное хранилище
const PhotoStorage = {
    async init() {
      this.idb = await this._initIndexedDB();
      this.firebase = this._initFirebase();
    },
  
    // IndexedDB (до 50MB+)
    _initIndexedDB() {
      return new Promise((resolve) => {
        const request = indexedDB.open('PhotoCloudDB', 1);
        
        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains('photos')) {
            db.createObjectStore('photos', { keyPath: 'id' });
          }
        };
  
        request.onsuccess = (e) => resolve(e.target.result);
      });
    },
  
    // Firebase Backup (бесплатный тариф)
    _initFirebase() {
      const firebaseConfig = {
        apiKey: "AIzaSyCS5o_2e38kfAhpH4x8GKWmclLWuPwNKpw",
        authDomain: "kyrsovaya-bd3f2.firebaseapp.com",
        projectId: "kyrsovaya-bd3f2",
        storageBucket: "kyrsovaya-bd3f2.firebasestorage.app",
        messagingSenderId: "122860451331",
        appId: "1:122860451331:web:e0e5330e9e669f02e58036"
      };
      
      firebase.initializeApp(firebaseConfig);
      return firebase;
    },
  
    async saveAlbum(userId, album) {
      // Локальное сохранение
      localStorage.setItem(`${userId}_album_${album.id}`, JSON.stringify(album));
      
      // IndexedDB
      const tx = this.idb.transaction('photos', 'readwrite');
      tx.objectStore('photos').put({ 
        id: `${userId}_${album.id}`, 
        data: album 
      });
      
      // Firebase Backup (только для премиум)
      if (user.premium) {
        await firebase.firestore().collection('albums')
          .doc(`${userId}_${album.id}`)
          .set(album);
      }
    }
  };
  
  // Инициализация при загрузке
  PhotoStorage.init();

  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
createUserWithEmailAndPassword(auth, "test@example.com", "password123")
  .then((userCredential) => {
    console.log("Аккаунт создан!", userCredential.user.uid);
  })
  .catch((error) => {
    console.error("Ошибка регистрации:", error.message);
  });

  export const app = firebase.initializeApp(firebaseConfig);