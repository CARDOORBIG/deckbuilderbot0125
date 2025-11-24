import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PublicDecks from './PublicDecks.jsx'
import OpenBrowser from './OpenBrowser.jsx'
import AuctionMarket from './AuctionMarket.jsx' // 🟢 1. เพิ่มบรรทัดนี้ (Import)

import './index.css'

import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const GOOGLE_CLIENT_ID = "618176300223-rfano65abopbddenjppd972m57hhgstn.apps.googleusercontent.com";

const router = createBrowserRouter([
  {
    path: "/", 
    element: <App />,
  },
  {
    path: "/public-decks", 
    element: <PublicDecks />,
  },
  {
    path: "/open-browser", 
    element: <OpenBrowser />,
  },
  // 🟢 2. เพิ่มก้อนนี้เข้าไปครับ (Route)
  {
    path: "/auction",
    element: <AuctionMarket />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)