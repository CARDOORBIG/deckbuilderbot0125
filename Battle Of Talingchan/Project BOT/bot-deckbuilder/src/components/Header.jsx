import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationCenter from '../NotificationCenter'; 
import { 
    MenuIcon, StoreIcon, HomeIcon, UsersIcon, CrownIcon 
} from './Icons';

// 🟢 ปรับ HeaderButton:
// - px-2 (มือถือ) / md:px-4 (จอคอม) -> ประหยัดพื้นที่แนวนอน
// - text-[10px] (มือถือ) / md:text-sm (จอคอม) -> ลดขนาดตัวอักษรปุ่ม
const HeaderButton = ({ className = "", children, ...props }) => (
  <button className={`flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-[10px] md:text-sm transition-all active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed border ${className}`} {...props}>
    {children}
  </button>
);

export default function Header({ 
  userProfile, 
  displayUser, 
  userReputation, 
  setIsSettingsOpen, 
  setIsAdminOpen 
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    // 🟢 ปรับ px-2 (มือถือ) ให้ชิดขอบจอมากขึ้นเพื่อเพิ่มพื้นที่ตรงกลาง
    <header className="px-2 md:px-6 py-2 border-b border-slate-300 dark:border-emerald-700/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 h-14 flex flex-col justify-center">
      <div className="flex items-center justify-between gap-1 md:gap-2 w-full">  
        
        {/* ฝั่งซ้าย: Menu + Title */}
        <div className="flex items-center gap-1 md:gap-1.5 overflow-hidden min-w-0 shrink">
            <button onClick={() => setIsSettingsOpen(true)} className="p-1 md:p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-800 dark:text-white transition-colors shrink-0">
                <div className="scale-75 md:scale-90"><MenuIcon /></div>
            </button>
            
            {userProfile?.email === 'koritros619@gmail.com' && (
                <button onClick={() => setIsAdminOpen(true)} className="flex items-center gap-1 px-1.5 md:px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-500/20 transition-all animate-pulse font-bold text-[9px] md:text-xs shrink-0">
                    <div className="scale-75"><CrownIcon /></div> <span className="hidden md:inline">ADMIN</span>
                </button>
            )}

            {/* 🟢 ปรับขนาด Text Title: text-base (มือถือ) -> text-3xl (คอม) */}
            <h1 className="text-base sm:text-xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 bg-clip-text text-transparent truncate pt-0.5">
                Marketplace
            </h1>
        </div>

        {/* ฝั่งขวา: ปุ่มนำทาง */}
        {/* 🟢 ปรับ gap-1 (มือถือ) ให้ปุ่มชิดกันมากขึ้น */}
        <div className="flex items-center gap-1 md:gap-3 shrink-0">
            
            {/* 1. ปุ่ม Home */}
            <Link to="/">
                <HeaderButton className={
                    isActive('/') 
                    ? "bg-gradient-to-r from-rose-500 to-orange-600 text-white border-transparent shadow-md shadow-rose-500/30" 
                    : "text-rose-600 dark:text-rose-400 bg-transparent border-transparent hover:bg-rose-50 dark:hover:bg-rose-900/20"
                }>
                    <div className="scale-90 md:scale-100"><HomeIcon /></div> 
                    <span className="hidden lg:inline ml-1">Home</span>
                </HeaderButton>
            </Link>

            {/* 2. ปุ่ม Market */}
            <Link to="/auction">
                <HeaderButton className={
                    isActive('/auction') 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-md shadow-emerald-500/30" 
                    : "text-emerald-600 dark:text-emerald-400 bg-transparent border-transparent hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                }>
                    <div className="scale-90 md:scale-100"><StoreIcon /></div>
                    <span className="hidden lg:inline ml-1">Market</span>
                </HeaderButton>
            </Link>

            {/* 3. ปุ่ม Public */}
            <Link to="/public-decks">
                <HeaderButton as="span" className={
                    isActive('/public-decks')
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-md shadow-blue-500/30"
                    : "text-blue-600 dark:text-blue-400 bg-transparent border-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }>
                    <div className="scale-90 md:scale-100"><UsersIcon /></div>
                    <span className="hidden lg:inline ml-1">Public</span>
                </HeaderButton>
            </Link>
            
            <div className="scale-90 md:scale-100">
                <NotificationCenter userEmail={userProfile?.email} />
            </div>

            {/* Wallet: ซ่อนบนมือถือเพื่อประหยัดที่ (ไปดูใน SettingsDrawer แทน) */}
            {userProfile && (
                <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full shadow-sm mr-1">
                    <span className="text-base">💰</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-white text-sm">
                        ฿{(userReputation?.wallet_balance || 0).toLocaleString()}
                    </span>
                </div>
            )}

            {/* Profile Picture */}
            {displayUser ? (
                <>
                    <img
                        src={displayUser.picture}
                        alt={displayUser.name}
                        className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-emerald-500 object-cover ml-1 cursor-pointer hover:scale-105 transition-transform"
                        title={`Logged in as ${displayUser.name}`}
                        onClick={() => setIsSettingsOpen(true)} 
                    />
                    {/* ชื่อแสดงเฉพาะจอใหญ่มากเท่านั้น (XL) */}
                    <span className="text-slate-900 dark:text-white hidden xl:block text-sm font-semibold max-w-[100px] truncate cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
                        {displayUser.name}
                    </span>
                </>
            ) : (
                <button 
                    onClick={() => navigate('/')} 
                    className="ml-1 md:ml-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] md:text-xs font-bold rounded-full shadow transition-all whitespace-nowrap"
                >
                    Login
                </button>
            )}
        </div>
      </div>
    </header>
  );
}