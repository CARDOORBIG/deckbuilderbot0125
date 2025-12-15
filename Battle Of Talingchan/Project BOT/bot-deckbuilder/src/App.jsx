import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; 

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
    // ตรวจสอบว่าถ้ามี User อยู่แล้ว ให้เด้งไปหน้า Home เลย (ไม่ต้อง Login ซ้ำ)
    const userProfile = JSON.parse(localStorage.getItem('bot-userProfile-v1'));

    useEffect(() => {
        if (userProfile) {
            navigate('/home'); // 🟢 ถ้ามี User ให้ไป Home
        }
    }, [userProfile, navigate]);

    const handleLoginSuccess = (credentialResponse) => {
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
            
            // 🟢 เมื่อ Login สำเร็จ ให้ไปที่ /home
            navigate('/home'); 
            window.location.reload(); 

        } catch (error) {
            console.error("Login Error:", error);
            alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        }
    };

    return <Login onSuccess={handleLoginSuccess} onError={() => alert("เข้าสู่ระบบไม่สำเร็จ")} />;
};

// 🟢 COMPONENT: ผู้คุมกฎ (Route Guard)
const RouteGuard = ({ children }) => {
  const location = useLocation();
  const hasVisitedHome = sessionStorage.getItem("app_visited_v1");

  // 🛡️ ข้อยกเว้น: หน้าเหล่านี้เข้าได้เลยโดยไม่ต้องผ่านกฎเหล็ก
  const isExceptionRoute = 
      location.pathname.startsWith('/auction') || 
      location.pathname.startsWith('/market') ||
      location.pathname === '/' || // 🟢 หน้า Login (Root) ต้องเข้าได้เสมอ
      location.pathname === '/login' || // (เพิ่ม /login เป็นข้อยกเว้นเพื่อให้มันเรนเดอร์ Navigate ได้)
      location.pathname === '/open-browser';

  useEffect(() => {
      if (isExceptionRoute) {
          sessionStorage.setItem("app_visited_v1", "true");
      }
  }, [isExceptionRoute]);

  // 🔒 กฎเหล็ก: ถ้ายังไม่เคยเข้าเว็บ (ไม่ผ่าน Home/Login) ให้ดีดกลับไปหน้าแรก (Login)
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
          
          {/* 🟢 1. หน้าแรก (/) คือ Login */}
          <Route path="/" element={<LoginHandler />} />

          {/* 🟢 ส่วนที่เพิ่ม: ดักจับ /login แล้วดีดกลับไป / ทันที */}
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* 🟢 2. หน้า Home (/home) คือ MainHub */}
          <Route path="/home" element={<MainHub userProfile={userProfile} />} />
          
          <Route path="/deck-builder" element={<DeckBuilder />} />
          <Route path="/auction" element={<AuctionMarket />} /> 
          <Route path="/public-decks" element={<PublicDecks />} />
          
          <Route path="/open-browser" element={<OpenBrowser />} />
          <Route path="/playground" element={<PlayGround />} />
          <Route path="/community" element={<PublicChat userProfile={userProfile} />} />

          {/* (Optional) ดักหน้ามั่วๆ อื่นๆ ให้กลับไป Login */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
    </RouteGuard>
  );
}