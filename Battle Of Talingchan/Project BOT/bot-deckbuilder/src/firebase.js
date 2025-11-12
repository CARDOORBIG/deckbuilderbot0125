import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🛑 [สำคัญมาก]
// วางโค้ด config ที่คัดลอกมาจาก Firebase Console ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyBdP9emGgja_VWZDXUhW11RP9fMZnePLuU",
  authDomain: "battle-of-talingchan-builder.firebaseapp.com",
  projectId: "battle-of-talingchan-builder",
  storageBucket: "battle-of-talingchan-builder.firebasestorage.app",
  messagingSenderId: "618176300223",
  appId: "1:618176300223:web:a917a3d7a07c11b973b20a",
  measurementId: "G-RW09XRTQFN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);