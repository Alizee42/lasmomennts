import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

const firebaseConfig = {

  apiKey: "AIzaSyB4yUUhICCR_Qg_WjSIL0GqzAbSutICKCY",

  authDomain: "moments-dc6fd.firebaseapp.com",

  projectId: "moments-dc6fd",

  storageBucket: "moments-dc6fd.appspot.com",

  messagingSenderId: "128640568268",

  appId: "1:128640568268:web:f61fb4453e0580bf6e6b69",

  measurementId: "G-4QCJF8EWL6"

};
// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
const db = getFirestore(app);

// Initialiser l'authentification
const auth = getAuth(app);

// Initialiser Firebase Storage
const storage = getStorage(app);

export { db, auth, storage };