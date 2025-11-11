"use client"; // <--- บอก Next.js ว่านี่คือ Client Component

import React from 'react';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// 🛑 [สำคัญมาก]
// ใส่ Client ID ของคุณที่นี่ (อันเดียวกับใน main.jsx เก่า)
const GOOGLE_CLIENT_ID = "618176300223-rfano65abopbddenjppd972m57hhgstn.apps.googleusercontent.com";

export function Providers({ children }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider>
    </GoogleOAuthProvider>
  );
}