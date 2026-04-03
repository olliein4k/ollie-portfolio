import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "ollie-portfolio-223da.firebaseapp.com",
  projectId: "ollie-portfolio-223da",
  storageBucket: "ollie-portfolio-223da.firebasestorage.app",
  messagingSenderId: "133940273771",
  appId: "1:133940273771:web:e0c766419dada64ac7872e",
  measurementId: "G-GEYKKPZF84"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);