import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 1. Import ตัว Provider
import { GoogleOAuthProvider } from "@react-oauth/google";

// 2. วาง Client ID ที่คุณได้มา
const GOOGLE_CLIENT_ID = "618176300223-rfano65abopbddenjppd972m57hhgstn.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. ห่อ (Wrap) <App /> ของคุณด้วย Provider นี้ */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)