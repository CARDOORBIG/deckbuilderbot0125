import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Import หน้าต่างๆ
import DeckBuilder from './DeckBuilder';   // หน้าจัดเด็คเดิม (ที่เปลี่ยนชื่อมา)
import AuctionMarket from './AuctionMarket'; // หน้าตลาด
import PublicDecks from './PublicDecks';
import Login from './components/Login';
import OpenBrowser from './OpenBrowser';
import PlayGround from './PlayGround';     // หน้าเกมใหม่

export default function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* หน้าแรก (Home) ให้เป็นหน้าจัดเด็ค */}
      <Route path="/" element={<DeckBuilder />} />
      
      {/* หน้าอื่นๆ */}
      <Route path="/auction" element={<AuctionMarket />} /> 
      <Route path="/public-decks" element={<PublicDecks />} />
      <Route path="/login" element={<Login />} />
      <Route path="/open-browser" element={<OpenBrowser />} />
      
      {/* 🟢 Route สำหรับ PlayGround ที่เคย Error */}
      <Route path="/playground" element={<PlayGround />} />
    </Routes>
  );
}