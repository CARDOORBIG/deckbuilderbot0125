import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 🟢 1. เพิ่มบรรทัดนี้

const firebaseConfig = {
  apiKey: "AIzaSyBdP9emGgja_VWZDXUhW11RP9fMZnePLuU",
  authDomain: "battle-of-talingchan-builder.firebaseapp.com",
  projectId: "battle-of-talingchan-builder",
  storageBucket: "battle-of-talingchan-builder.firebasestorage.app",
  messagingSenderId: "618176300223",
  appId: "1:618176300223:web:a917a3d7a07c11b973b20a",
  measurementId: "G-RW09XRTQFN"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // 🟢 2. เพิ่มบรรทัดนี้ (Export auth ออกไปใช้)