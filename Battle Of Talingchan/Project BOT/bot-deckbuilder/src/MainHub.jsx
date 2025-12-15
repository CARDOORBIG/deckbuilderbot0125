import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayersIcon, StoreIcon, GamepadIcon, 
  MessageCircleIcon, UsersIcon, ChevronRightIcon, 
  NeonLightningIcon, CrownIcon
} from './components/Icons';
// import Header from './components/Header'; // ❌ เอา Header ออกตามที่ขอ
import SettingsDrawer from './components/SettingsDrawer';
import AdminDashboardModal from './AdminDashboardModal';

export default function MainHub({ userProfile }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('bot-theme') || 'dark');
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isAdmin = userProfile && ['koritros619@gmail.com', 'sarun.psx@gmail.com', 'srirujinanon.k@gmail.com'].includes(userProfile?.email);

  const handleSetTheme = (newTheme) => {
      setTheme(newTheme);
      localStorage.setItem('bot-theme', newTheme);
      const root = document.documentElement;
      if (newTheme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
  };

  const handleLogout = () => {
      localStorage.removeItem('bot-userProfile-v1'); 
      window.location.reload(); 
  };

  useEffect(() => {
    // 🟢 1. บันทึกว่า "ผู้ใช้ได้เข้ามาเห็นหน้า Home แล้ว"
    // (เพื่อให้ App.jsx รู้ว่าไม่ต้องดีดกลับมาที่นี่อีก ถ้าเขาจะไปหน้าอื่น)
    sessionStorage.setItem("app_visited_v1", "true");

    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // ❌ ไม่มี logic ตรวจสอบ userProfile แล้ว (ไม่เด้งไป login เองแล้ว)

  const SECTIONS = [
    {
      id: 'deck',
      title: 'เครื่องมือจัดเด็ค',
      subtitle: 'Deck Builder',
      tag: 'STRATEGY',
      desc: 'จัดเด็คของคุณด้วยเครื่องมือขั้นสูง เพื่อชัยชนะในทุกการประลอง',
      link: '/deck-builder',
      icon: <LayersIcon className="w-full h-full object-contain" />, 
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bgGradient: 'from-slate-900 via-[#0a1520] to-cyan-950', 
      img: '/assets/deck_cover.png' 
    },
    {
      id: 'market',
      title: 'ตลาดประมูลซื้อขาย',
      subtitle: 'Auction Market',
      tag: 'TRADE',
      desc: 'บิด, ซื้อ, ขาย, จัดการการ์ดในตลาดประมูลแบบเรียลไทม์',
      link: '/auction',
      icon: <StoreIcon className="w-full h-full object-contain" />,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bgGradient: 'from-slate-900 via-[#051f15] to-emerald-950',
      img: '/assets/market_cover.png'
    },
    {
      id: 'community',
      title: 'คอมมูนิตี้',
      subtitle: 'Community Hub',
      tag: 'SOCIAL',
      desc: 'พูดคุยข่าวสารแลกเปลี่ยน ไอเดียกับผู้เล่นคนอื่นๆ',
      link: '/community',
      icon: <MessageCircleIcon className="w-full h-full object-contain" />,
      color: 'text-pink-400',
      border: 'border-pink-500/30',
      bgGradient: 'from-slate-900 via-[#250815] to-pink-950',
      img: '/assets/community_cover.png'
    },
    {
      id: 'public',
      title: 'เด็คสาธารณะ',
      subtitle: 'Public Decks',
      tag: 'LIBRARY',
      desc: 'แชร์เด็คของคุณกับชุมชน หรือเรียกดูเด็คจากผู้เล่นคนอื่นๆ',
      link: '/public-decks',
      icon: <UsersIcon className="w-full h-full object-contain" />,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bgGradient: 'from-slate-900 via-[#261505] to-amber-950',
      img: '/assets/archive_cover.png'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden relative">
      
      {/* Mouse Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(29, 78, 216, 0.1), transparent 80%)`
        }}
      ></div>

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-ping duration-[3000ms]"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-cyan-500/30 rounded-full animate-pulse duration-[5000ms]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center pt-0 overflow-hidden perspective-1000">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
         
         <div className="z-10 text-center relative w-full px-4" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
            <div className="flex items-center justify-center gap-4 mb-8 opacity-70">
                <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent to-white"></div>
                <span className="text-[10px] md:text-xs font-bold tracking-[0.5em] text-indigo-300 uppercase animate-pulse">System Online</span>
                <div className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent to-white"></div>
            </div>
            
            {/* LOGO */}
            <div className="flex justify-center relative py-4">
                <div className="relative w-full max-w-[400px] md:max-w-[600px] hover:scale-105 transition-transform duration-700"> 
                    <img 
                        src="/assets/LOGO.png" 
                        alt="LOGO" 
                        className="relative z-10 w-full h-auto object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                    />
                </div>
            </div>

            <h2 className="text-sm md:text-xl font-light text-slate-400 mt-4 tracking-[0.3em] uppercase opacity-80">
                Deck Builder & Community
            </h2>

            {/* LOGIN / PROFILE */}
            <div className="mt-10 flex justify-center">
                {userProfile ? (
                    <div 
                        onClick={() => setShowLogoutConfirm(true)} 
                        className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 pr-6 rounded-full backdrop-blur-md animate-in fade-in zoom-in duration-700 hover:bg-white/10 hover:border-red-500/30 transition-all cursor-pointer group"
                        title="Click to Logout"
                    >
                        <img 
                            src={userProfile.picture} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full border border-white/20 shadow-sm group-hover:border-red-500/50 transition-colors"
                        />
                        <div className="text-left">
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1 group-hover:text-red-300">Player Profile</div>
                            <div className="text-sm font-bold text-white leading-none group-hover:text-red-100 transition-colors">{userProfile.name}</div>
                        </div>
                    </div>
                ) : (
                    <Link 
                        to="/login" 
                        className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-full font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-indigo-500/40 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Enter System <ChevronRightIcon className="w-4 h-4" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </Link>
                )}
            </div>

            <div className="mt-16 animate-bounce">
                <div className="w-[1px] h-24 bg-gradient-to-b from-indigo-500 to-transparent mx-auto"></div>
            </div>
         </div>
      </section>

      {/* Main Navigation (Cards) */}
      <section className="relative z-10 w-full max-w-[1400px] mx-auto px-6 pb-32 -mt-20">
        <div className="flex flex-col gap-8 md:gap-12">
            {SECTIONS.map((item, index) => (
                <Link to={item.link} key={item.id} className="group relative block w-full">
                    
                    <div className={`relative w-full h-[280px] md:h-[400px] rounded-3xl overflow-hidden border border-white/5 bg-[#0a0a0a] transition-all duration-500 hover:border-white/40 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 ${index % 2 === 0 ? 'md:ml-0 md:mr-12' : 'md:ml-12 md:mr-0'}`}>
                        
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100 group-hover:scale-110 opacity-60 group-hover:opacity-80 grayscale group-hover:grayscale-0"
                            style={{ backgroundImage: `url(${item.img})` }} 
                        ></div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-90 group-hover:opacity-60 transition-all duration-500 mix-blend-hard-light`}></div>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"></div>

                        <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 max-w-5xl">
                            <div className="flex items-center gap-3 mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
                                <div className={`px-3 py-1 rounded-full border ${item.border} bg-black/40 backdrop-blur-md`}>
                                    <span className={`text-[10px] font-bold tracking-widest ${item.color}`}>{item.tag}</span>
                                </div>
                                <div className="h-[1px] w-12 bg-white/20"></div>
                            </div>

                            <div className="flex items-start md:items-center gap-4 md:gap-6 mb-2">
                                <h3 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg leading-normal break-words py-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all flex-1">
                                    {item.title}
                                </h3>
                                <div className={`hidden md:flex shrink-0 w-20 h-20 md:w-28 md:h-28 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 ${item.color} drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]`}>
                                    <div className="w-[70%] h-[70%] flex items-center justify-center">
                                        {item.icon}
                                    </div>
                                </div>
                            </div>

                            <div className="text-lg md:text-2xl font-medium text-slate-300 mb-6 flex items-center gap-2">
                                <span className={`${item.color}`}>{item.subtitle}</span>
                                <ChevronRightIcon className="w-5 h-5 text-white/30" />
                            </div>

                            <p className="text-slate-400 text-sm md:text-lg font-light leading-relaxed max-w-lg group-hover:text-white transition-colors drop-shadow-md">
                                {item.desc}
                            </p>

                            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-${item.color.split('-')[1]}-500 to-transparent w-0 group-hover:w-full transition-all duration-700 ease-in-out`}></div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 bg-black text-center relative z-10 w-full">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
            <span className="text-[10px] uppercase tracking-widest text-slate-400">All Systems Operational</span>
        </div>
        <p className="text-slate-600 text-xs font-mono">
            © 2024 DECK BUILDER PROJECT.
        </p>
      </footer>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-white mb-2 text-center">System Logout</h3>
                <p className="text-slate-400 text-center mb-6 text-sm">
                    คุณต้องการออกจากระบบหรือไม่?
                </p>
                <div className="flex gap-3">
                    <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide">Cancel</button>
                    <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20 transition-all text-sm font-bold uppercase tracking-wide">Confirm</button>
                </div>
            </div>
        </div>
      )}

      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userProfile={userProfile} onOpenAdmin={() => setIsAdminOpen(true)} theme={theme} setTheme={handleSetTheme} />
      {isAdmin && <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}