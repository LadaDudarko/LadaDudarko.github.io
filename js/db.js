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
        apiKey: "YOUR_API_KEY",
        authDomain: "your-app.firebaseapp.com",
        projectId: "your-app",
        storageBucket: "your-app.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
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