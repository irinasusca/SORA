// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAy8ydnCHFS-qsaDW6LYKlW5N3wb6etJ4w",

    authDomain: "sora-fb.firebaseapp.com",
  
    projectId: "sora-fb",
  
    storageBucket: "sora-fb.firebasestorage.app",
  
    messagingSenderId: "360125552848",
  
    appId: "1:360125552848:web:a80a365e91264f0e06e6d5"
  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
