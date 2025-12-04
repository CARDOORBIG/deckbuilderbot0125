import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationCenter from '../NotificationCenter'; 
import { 
  MenuIcon, StoreIcon, HomeIcon, UsersIcon, CrownIcon 
} from './Icons';

// 🟢 ไอคอนต่างๆ
const ChevronDownIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const ShieldBanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const MedalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
const MessageCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8m-4-9v9m-8-3h16M6 4h12a2 2 0 0 1 2 2v2a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2z"></path></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const LayersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;

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
  setIsAdminOpen,
  setIsMyDecksOpen
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // ฟังก์ชันสำหรับกดปุ่ม My Decks
  const handleMyDecksClick = () => {
    if (setIsMyDecksOpen) {
        setIsMyDecksOpen(true);
    }
    setIsPanelOpen(false);
  };

  const comingSoonItems = [
    { icon: <ShieldBanIcon />, label: "บัญชี BlackList" },
    { icon: <BookOpenIcon />, label: "กฏการใช้งาน" },
    { icon: <MedalIcon />, label: "ยศต่างๆ" },
    { icon: <MessageCircleIcon />, label: "พูดคุยสาธารณะ" },
    { icon: <TrophyIcon />, label: "Leader Board" },
    { icon: <AlertIcon />, label: "แจ้งปัญหา" },
    { icon: <SettingsIcon />, label: "การตั้งค่า" }
  ];

  return (
    <header className="border-b border-slate-300 dark:border-emerald-700/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 flex flex-col justify-center transition-all duration-300">
      
      {/* --- ส่วนที่ 1: Main Header (ด้านบน) --- */}
      <div className="px-2 md:px-6 py-2 h-14 flex items-center justify-between gap-1 md:gap-2 w-full relative z-20 bg-inherit"> 
        
        {/* ฝั่งซ้าย */}
        <div className="flex items-center gap-1 md:gap-1.5 overflow-hidden min-w-0 shrink">
            <button onClick={() => setIsSettingsOpen(true)} className="p-1 md:p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-800 dark:text-white transition-colors shrink-0">
                <div className="scale-75 md:scale-90"><MenuIcon /></div>
            </button>
            
            {userProfile?.email === 'koritros619@gmail.com' && (
                <button onClick={() => setIsAdminOpen(true)} className="flex items-center gap-1 px-1.5 md:px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-500/20 transition-all animate-pulse font-bold text-[9px] md:text-xs shrink-0">
                    <div className="scale-75"><CrownIcon /></div> <span className="hidden md:inline">ADMIN</span>
                </button>
            )}

            {/* ✅✅✅ แทนที่ข้อความ Marketplace ด้วยรูป LOGO.png ✅✅✅ */}
            <Link to="/" className="flex items-center ml-1">
                <img 
                    src="/assets/LOGO.png" 
                    alt="Logo" 
                    className="h-16 md:h-18 w-auto object-contain hover:scale-105 transition-transform" 
                    onError={(e) => { 
                        // กรณีโหลดรูปไม่ได้ ให้แสดงข้อความแทน (เผื่อ path ผิด)
                        e.target.style.display = 'none'; 
                        e.target.nextSibling.style.display = 'block'; 
                    }}
                />
                <span style={{ display: 'none' }} className="text-xl font-bold bg-gradient-to-r from-amber-500 to-emerald-600 bg-clip-text text-transparent">
                    Marketplace
                </span>
            </Link>
        </div>

        {/* ฝั่งขวา */}
        <div className="flex items-center gap-1 md:gap-3 shrink-0">
            <Link to="/">
                <HeaderButton className={isActive('/') ? "bg-gradient-to-r from-rose-500 to-orange-600 text-white border-transparent shadow-md shadow-rose-500/30" : "text-rose-600 dark:text-rose-400 bg-transparent border-transparent hover:bg-rose-50 dark:hover:bg-rose-900/20"}>
                    <div className="scale-90 md:scale-100"><HomeIcon /></div> <span className="hidden lg:inline ml-1">Home</span>
                </HeaderButton>
            </Link>

            <Link to="/auction">
                <HeaderButton className={isActive('/auction') ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-md shadow-emerald-500/30" : "text-emerald-600 dark:text-emerald-400 bg-transparent border-transparent hover:bg-emerald-50 dark:hover:bg-emerald-900/20"}>
                    <div className="scale-90 md:scale-100"><StoreIcon /></div> <span className="hidden lg:inline ml-1">Market</span>
                </HeaderButton>
            </Link>

            <Link to="/public-decks">
                <HeaderButton as="span" className={isActive('/public-decks') ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-md shadow-blue-500/30" : "text-blue-600 dark:text-blue-400 bg-transparent border-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20"}>
                    <div className="scale-90 md:scale-100"><UsersIcon /></div> <span className="hidden lg:inline ml-1">Public</span>
                </HeaderButton>
            </Link>
            
            <div className="scale-90 md:scale-100"><NotificationCenter userEmail={userProfile?.email} /></div>

            {userProfile && (
                <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full shadow-sm mr-1">
                    <span className="text-base">💰</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-white text-sm">฿{(userReputation?.wallet_balance || 0).toLocaleString()}</span>
                </div>
            )}

            {displayUser ? (
                <>
                    <img src={displayUser.picture} alt={displayUser.name} className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-emerald-500 object-cover ml-1 cursor-pointer hover:scale-105 transition-transform" title={`Logged in as ${displayUser.name}`} onClick={() => setIsSettingsOpen(true)} />
                    <span className="text-slate-900 dark:text-white hidden xl:block text-sm font-semibold max-w-[100px] truncate cursor-pointer" onClick={() => setIsSettingsOpen(true)}>{displayUser.name}</span>
                </>
            ) : (
                <button onClick={() => navigate('/')} className="ml-1 md:ml-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] md:text-xs font-bold rounded-full shadow transition-all whitespace-nowrap">Login</button>
            )}
        </div>
      </div>

      {/* --- ส่วนที่ 2: แผงเลื่อน (Slide Panel) --- */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/95 ${isPanelOpen ? 'max-h-80 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}>
          <div className="max-w-7xl mx-auto px-4">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest text-center">เมนูเพิ่มเติม (Quick Actions)</p>
              
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 justify-items-center">
                  
                  <button onClick={handleMyDecksClick} className="flex flex-col items-center gap-1 group w-full">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 group-hover:text-violet-500 group-hover:border-violet-500 transition-all shadow-sm">
                          <LayersIcon />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">My Decks</span>
                  </button>

                  {comingSoonItems.map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-1 w-full opacity-50 grayscale cursor-not-allowed select-none">
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 shadow-sm">
                              {item.icon}
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{item.label}</span>
                          <span className="text-[8px] bg-slate-200 dark:bg-slate-700 px-1.5 rounded text-slate-500">Coming Soon</span>
                      </div>
                  ))}

              </div>
          </div>
      </div>

      {/* --- ส่วนที่ 3: ปุ่มกดเลื่อน (Handle Bar) --- */}
      <div className="h-3 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group absolute -bottom-3 left-0 right-0 shadow-sm rounded-b-lg z-40" onClick={() => setIsPanelOpen(!isPanelOpen)} title="คลิกเพื่อเปิด/ปิด แผงเมนู">
          <div className={`transition-transform duration-300 ${isPanelOpen ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDownIcon className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
          </div>
      </div>

    </header>
  );
}