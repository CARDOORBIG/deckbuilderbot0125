import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PublicDecks from './PublicDecks.jsx' // 1. Import หน้าใหม่
import './index.css'

import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // 2. Import router

const GOOGLE_CLIENT_ID = "618176300223-rfano65abopbddenjppd972m57hhgstn.apps.googleusercontent.com";

// 3. กำหนดเส้นทาง
const router = createBrowserRouter([
  {
    path: "/", // หน้าแรก (หน้าจัดเด็ค)
    element: <App />,
  },
  {
    path: "/public-decks", // หน้า Public Decks
    element: <PublicDecks />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* 4. เปลี่ยน <App /> เป็น <RouterProvider /> */}
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)