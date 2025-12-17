import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; 

// 🟢 1. เพิ่ม Import Firebase
import { db } from './firebase'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Import หน้าต่างๆ
import MainHub from './MainHub'; 
import DeckBuilder from './DeckBuilder';
import AuctionMarket from './AuctionMarket';
import PublicDecks from './PublicDecks';
import Login from './components/Login';
import OpenBrowser from './OpenBrowser';
import PlayGround from './PlayGround';
import PublicChat from './PublicChat';

// Helper สำหรับ Decode JWT
const parseJwt = (token) => {
    try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
};

const LoginHandler = () => {
    const navigate = useNavigate();
    const userProfile = JSON.parse(localStorage.getItem('bot-userProfile-v1'));

    useEffect(() => {
        if (userProfile) {
            navigate('/home'); 
        }
    }, [userProfile, navigate]);

    // 🟢 2. แก้ไขฟังก์ชันนี้ให้เป็น async และบันทึกเวลาเข้าสู่ระบบ
    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const decoded = typeof jwtDecode === 'function' ? jwtDecode(credentialResponse.credential) : parseJwt(credentialResponse.credential);
            if (!decoded) throw new Error("Decode failed");

            const userProfile = {
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture,
                id: decoded.sub
            };

            localStorage.setItem("bot-userProfile-v1", JSON.stringify(userProfile));
            
            // 🟢 เพิ่มส่วนนี้: บันทึกข้อมูลลง Firebase Firestore
            try {
                await setDoc(doc(db, "users", userProfile.email), {
                    email: userProfile.email,
                    displayName: userProfile.name, // ใช้ชื่อเดียวกับ Google
                    avatarUrl: userProfile.picture,
                    lastLogin: serverTimestamp(), // 🕒 บันทึกเวลาปัจจุบัน
                    id: userProfile.id
                }, { merge: true }); // merge: true เพื่อไม่ให้ทับข้อมูลเก่า (เช่น เงินในกระเป๋า)
                
                console.log("บันทึกเวลาเข้าสู่ระบบเรียบร้อย");
            } catch (dbError) {
                console.error("Error saving user to DB:", dbError);
                // ไม่ต้อง throw error เพื่อให้ user ยังเข้าใช้งานได้แม้เน็ต DB มีปัญหา
            }

            // ไปที่หน้า Home
            navigate('/home'); 
            window.location.reload(); 

        } catch (error) {
            console.error("Login Error:", error);
            alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        }
    };

    return <Login onSuccess={handleLoginSuccess} onError={() => alert("เข้าสู่ระบบไม่สำเร็จ")} />;
};

// ... (ส่วน RouteGuard และ App ด้านล่างเหมือนเดิม ไม่ต้องแก้)
const RouteGuard = ({ children }) => {
  const location = useLocation();
  const hasVisitedHome = sessionStorage.getItem("app_visited_v1");

  const isExceptionRoute = 
      location.pathname.startsWith('/auction') || 
      location.pathname.startsWith('/market') ||
      location.pathname === '/' || 
      location.pathname === '/login' ||
      location.pathname === '/open-browser';

  useEffect(() => {
      if (isExceptionRoute) {
          sessionStorage.setItem("app_visited_v1", "true");
      }
  }, [isExceptionRoute]);

  if (!hasVisitedHome && !isExceptionRoute) {
      return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  const location = useLocation();
  const userProfile = JSON.parse(localStorage.getItem('bot-userProfile-v1'));

  return (
    <RouteGuard>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LoginHandler />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/home" element={<MainHub userProfile={userProfile} />} />
          <Route path="/deck-builder" element={<DeckBuilder />} />
          <Route path="/auction" element={<AuctionMarket />} /> 
          <Route path="/public-decks" element={<PublicDecks />} />
          <Route path="/open-browser" element={<OpenBrowser />} />
          <Route path="/playground" element={<PlayGround />} />
          <Route path="/community" element={<PublicChat userProfile={userProfile} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </RouteGuard>
  );
}