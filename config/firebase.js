// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgqgYjicuNAfYRW6RjhHsi6cd-6TaIFNw",
  authDomain: "recetapp-3dce3.firebaseapp.com",
  databaseURL: "https://recetapp-3dce3-default-rtdb.firebaseio.com",
  projectId: "recetapp-3dce3",
  storageBucket: "recetapp-3dce3.firebasestorage.app",
  messagingSenderId: "552602386488",
  appId: "1:552602386488:web:295c85770d1f5a9e37a6cd",
  measurementId: "G-93YZCT003D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database, analytics };
export default app;
