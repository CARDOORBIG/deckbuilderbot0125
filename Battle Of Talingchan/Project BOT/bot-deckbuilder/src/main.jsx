import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // ต้องมีอันนี้

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ห่อ App ด้วย BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)