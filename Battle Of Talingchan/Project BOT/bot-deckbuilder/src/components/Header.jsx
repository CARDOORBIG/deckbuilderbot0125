import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationCenter from '../NotificationCenter'; 
import { 
  MenuIcon, StoreIcon, HomeIcon, UsersIcon, CrownIcon,
  ShieldBanIcon, BookOpenIcon, MedalIcon, MessageCircleIcon,
  TrophyIcon, AlertIcon, LayersIcon, SettingsIcon
} from './Icons';
import CreditCheckModal from './CreditCheckModal'; 
import BlackListModal from './BlackListModal'; 
import RulesModal from './RulesModal'; 

const ChevronDownIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>;

const HeaderButton = ({ className = "", children, ...props }) => (
  <button className={`flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-[10px] md:text-sm transition-all active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed border ${className}`} {...props}>
    {children}
  </button>
);

// 🟢 เพิ่มรายชื่อ Admin ที่นี่
const ADMIN_EMAILS = [
  'koritros619@gmail.com',
  'sarun.psx@gmail.com',
  'srirujinanon.k@gmail.com'
];

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
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false); 
  const [isBlackListOpen, setIsBlackListOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleMyDecksClick = () => {
    if (setIsMyDecksOpen) setIsMyDecksOpen(true);
    setIsPanelOpen(false);
  };

  const handleCreditCheckClick = () => {
      setIsCreditModalOpen(true);
      setIsPanelOpen(false);
  };

  const handleBlackListClick = () => {
      setIsBlackListOpen(true);
      setIsPanelOpen(false);
  };

  const handleRulesClick = () => {
      setIsRulesOpen(true);
      setIsPanelOpen(false);
  };

  const comingSoonItems = [
    { icon: <MessageCircleIcon />, label: "พูดคุยสาธารณะ" },
    { icon: <AlertIcon />, label: "แจ้งปัญหา" },
    { icon: <SettingsIcon />, label: "การตั้งค่า" }
  ];

  return (
    <header className="border-b border-slate-300 dark:border-emerald-700/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 flex flex-col justify-center transition-all duration-300 mb-8">
      
      {/* --- ส่วนที่ 1: Main Header --- */}
      <div className="px-2 md:px-6 py-2 h-14 flex items-center justify-between gap-1 md:gap-2 w-full relative z-20 bg-inherit"> 
        
        {/* ฝั่งซ้าย */}
        <div className="flex items-center gap-1 md:gap-1.5 overflow-hidden min-w-0 shrink">
            <button onClick={() => setIsSettingsOpen(true)} className="p-1 md:p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-800 dark:text-white transition-colors shrink-0">
                <div className="scale-75 md:scale-90"><MenuIcon /></div>
            </button>
            
            {/* 🟢 ตรวจสอบสิทธิ์ Admin จาก List */}
            {ADMIN_EMAILS.includes(userProfile?.email) && (
                <button onClick={() => setIsAdminOpen(true)} className="flex items-center gap-1 px-1.5 md:px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-500/20 transition-all animate-pulse font-bold text-[9px] md:text-xs shrink-0">
                    <div className="scale-75"><CrownIcon /></div> <span className="hidden md:inline">ADMIN</span>
                </button>
            )}

            <Link to="/" className="flex items-center ml-1">
                <img 
                    src="/assets/LOGO.png" 
                    alt="Logo" 
                    className="h-16 md:h-18 w-auto object-contain hover:scale-105 transition-transform" 
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                />
                <span style={{ display: 'none' }} className="text-xl font-bold bg-gradient-to-r from-amber-500 to-emerald-600 bg-clip-text text-transparent">Marketplace</span>
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

                  <button onClick={handleCreditCheckClick} className="flex flex-col items-center gap-1 group w-full">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-500 group-hover:text-blue-600 group-hover:border-blue-500 transition-all shadow-sm">
                          <MedalIcon />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">เครดิตผู้ใช้</span>
                  </button>

                  <button onClick={handleBlackListClick} className="flex flex-col items-center gap-1 group w-full">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-red-500 group-hover:text-red-600 group-hover:border-red-500 transition-all shadow-sm">
                          <ShieldBanIcon />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">ตรวจสอบประวัติ</span>
                  </button>

                  <button onClick={handleRulesClick} className="flex flex-col items-center gap-1 group w-full">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-amber-500 group-hover:text-amber-600 group-hover:border-amber-500 transition-all shadow-sm">
                          <BookOpenIcon />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">คู่มือ / กฏ</span>
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

      {/* --- ส่วนที่ 3: ปุ่มกดเลื่อน --- */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none drop-shadow-md">
          <button 
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="pointer-events-auto cursor-pointer bg-white/95 dark:bg-slate-900/95 backdrop-blur-md w-32 h-6 flex items-center justify-center rounded-b-2xl border-x border-b border-emerald-500/30 dark:border-emerald-500/50 hover:h-8 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-all duration-200 group active:scale-95"
              title="คลิกเพื่อเปิดเมนูเพิ่มเติม"
          >
              <div className={`flex items-center gap-1 transition-all duration-300 ${isPanelOpen ? 'rotate-180' : 'rotate-0'}`}>
                  <div className={`h-1 w-8 bg-slate-300 dark:bg-slate-600 rounded-full absolute -top-3 left-1/2 -translate-x-1/2 group-hover:bg-emerald-400 transition-colors ${isPanelOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                  <ChevronDownIcon className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 dark:text-slate-300 dark:group-hover:text-emerald-400" />
              </div>
          </button>
      </div>

      {/* Render Modals */}
      <CreditCheckModal isOpen={isCreditModalOpen} onClose={() => setIsCreditModalOpen(false)} />
      <BlackListModal isOpen={isBlackListOpen} onClose={() => setIsBlackListOpen(false)} userProfile={userProfile} />
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

    </header>
  );
}