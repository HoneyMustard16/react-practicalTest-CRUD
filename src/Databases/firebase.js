import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyByRSZUvLc1deqeF5mi8F_ifpeATrSPjEQ",
  authDomain: "nutech-crud.firebaseapp.com",
  projectId: "nutech-crud",
  storageBucket: "nutech-crud.appspot.com",
  messagingSenderId: "398995979490",
  appId: "1:398995979490:web:60caf21a85cfea6db0f2bb",
  measurementId: "G-VL0E7QWVHB",
});

const db = firebaseApp.firestore();
const storage = firebase.storage();

export { db, storage };
