const firebaseConfig = {
  apiKey: "AIzaSyAFX3qi4kU8UdTNzSTqsw-qscxDxIsmNqM",
  authDomain: "doan50cntt1-ca81c.firebaseapp.com",
  projectId: "doan50cntt1-ca81c",
  storageBucket: "doan50cntt1-ca81c.firebasestorage.app",
  messagingSenderId: "92575491997",
  appId: "1:92575491997:web:8df7c81f97664b9abe3174",
  measurementId: "G-E3V743Z1F0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
