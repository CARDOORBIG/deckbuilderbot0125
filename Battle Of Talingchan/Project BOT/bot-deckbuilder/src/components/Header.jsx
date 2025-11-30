import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationCenter from '../NotificationCenter'; // ถอยกลับ 1 ชั้นเพราะอยู่ใน components
import { 
    MenuIcon, StoreIcon, HomeIcon, UsersIcon, CrownIcon 
} from './Icons';

// สร้าง Button เฉพาะกิจสำหรับ Header (หรือถ้ามีไฟล์กลางก็ import มาใช้ได้)
const HeaderButton = ({ className = "", children, ...props }) => (
  <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-300/20 dark:border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 dark:hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`} {...props}>
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

  return (
    <header className="px-3 md:px-6 py-2 border-b border-slate-300 dark:border-emerald-700/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 h-14 flex flex-col justify-center">
      <div className="flex items-center justify-between gap-2 w-full">  
        
        {/* 🟢 ฝั่งซ้าย: Menu + Title */}
        <div className="flex items-center gap-1.5 overflow-hidden">
            <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-800 dark:text-white transition-colors shrink-0">
                <div className="scale-90"><MenuIcon /></div>
            </button>
            
            {/* ปุ่ม Admin (แสดงเฉพาะแอดมิน) */}
            {userProfile?.email === 'koritros619@gmail.com' && (
                <button onClick={() => setIsAdminOpen(true)} className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-500/20 transition-all animate-pulse font-bold text-[10px] md:text-xs shrink-0">
                    <div className="scale-75"><CrownIcon /></div> <span className="hidden md:inline">ADMIN</span>
                </button>
            )}

            <h1 className="text-lg md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 bg-clip-text text-transparent truncate pt-0.5">
                Marketplace
            </h1>
        </div>

        {/* 🟢 ฝั่งขวา: ปุ่มนำทาง + แจ้งเตือน + โปรไฟล์ */}
        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
            <Link to="/">
                <HeaderButton className="!px-2 md:!px-4 bg-gradient-to-r from-rose-500 to-orange-600 text-white border-none shadow-md hover:shadow-lg hover:from-rose-400 hover:to-orange-500 ring-2 ring-offset-2 ring-rose-500/50 dark:ring-offset-slate-900">
                    <HomeIcon /> <span className="hidden md:inline ml-1">Home</span>
                </HeaderButton>
            </Link>
            <Link to="/public-decks">
                <HeaderButton as="span" className="!px-2 md:!px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg hover:from-blue-400 hover:to-purple-500">
                    <UsersIcon /> <span className="hidden md:inline">Public</span>
                </HeaderButton>
            </Link>
            
            <NotificationCenter userEmail={userProfile?.email} />

            {/* แสดง Wallet Balance */}
            {userProfile && (
                <div className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full shadow-sm mr-1">
                    <span className="text-base">💰</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-white text-sm">
                        ฿{(userReputation?.wallet_balance || 0).toLocaleString()}
                    </span>
                </div>
            )}

            {displayUser ? (
                <>
                    <img
                        src={displayUser.picture}
                        alt={displayUser.name}
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-emerald-500 object-cover ml-1 cursor-pointer hover:scale-105 transition-transform"
                        title={`Logged in as ${displayUser.name}`}
                        onClick={() => setIsSettingsOpen(true)} 
                    />
                    <span className="text-slate-900 dark:text-white hidden lg:block text-sm font-semibold max-w-[100px] truncate cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
                        {displayUser.name}
                    </span>
                </>
            ) : (
                <button 
                    onClick={() => navigate('/')} 
                    className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full shadow transition-all"
                >
                    Login
                </button>
            )}
        </div>
      </div>
    </header>
  );
}