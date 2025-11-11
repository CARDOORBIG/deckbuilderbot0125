import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🛑 [สำคัญมาก]
// วางโค้ด config ที่คัดลอกมาจาก Firebase Console ของคุณ
const firebaseConfig = {
  apiKey: "AIz...YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);