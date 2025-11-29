import React, { useState } from 'react'; // ✅ เพิ่ม { useState }
import TopUpModal from './TopUpModal'; // ✅ Import Modal ที่สร้างไว้
import { 
    UserCogIcon, CloseIcon, CrownIcon, DeckIcon, 
    SunIcon, MoonIcon, MessageIcon 
} from './Icons'; 
import RatingBadge from './RatingBadge'; 

// ปุ่ม Button แบบง่ายๆ
const Button = ({ className = "", children, ...props }) => (
    <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-300/20 dark:border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 dark:hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`} {...props}>
      {children}
    </button>
);

const SettingsDrawer = ({
  isOpen, onClose, userProfile, onEditProfile, onLogout, 
  theme, setTheme, onOpenFeedback, onOpenAdmin, onOpenMyDecks, 
  userStats
}) => {
  // ✅ สร้าง State สำหรับเปิด/ปิด Modal เติมเงิน
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  return (
    <>
      {/* Background Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      
      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-300 dark:border-emerald-700/30 shadow-2xl z-[610] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-emerald-700/20 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCogIcon /> ตั้งค่าผู้ใช้
          </h2>
          <button onClick={onClose} className="text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white"><CloseIcon /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-6">
          
          {/* Admin Button */}
          {userProfile?.email === 'koritros619@gmail.com' && (
            <button onClick={() => { onOpenAdmin(); onClose(); }} className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-2 animate-pulse">
              <CrownIcon /> ADMIN DASHBOARD
            </button>
          )}

          {/* Profile Section */}
          <div className="flex flex-col items-center gap-3 w-full">
            <img src={userProfile?.picture} alt={userProfile?.name} className="w-24 h-24 rounded-full border-4 border-emerald-500 shadow-lg object-cover bg-slate-200" onError={(e) => (e.target.src = "https://placehold.co/100x100/1e293b/ffffff?text=User")} />
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{userProfile?.name}</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-2">{userProfile?.email}</p>
              <div className="transform scale-110 mt-1 flex justify-center">
                <RatingBadge score={userStats?.total_score} />
              </div>
            </div>
          </div>

          {/* 💰 Wallet Section (ส่วนเติมเงินที่เพิ่มเข้ามา) */}
          <div className="w-full bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-emerald-500/20 flex justify-between items-center shadow-sm">
              <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">Wallet Balance</p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      ฿{parseFloat(userStats?.wallet_balance || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
              </div>
              <button 
                  onClick={() => setIsTopUpOpen(true)} // กดแล้วเปิด Modal
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-lg shadow hover:shadow-emerald-500/30 hover:scale-105 transition-all active:scale-95"
              >
                  + เติมเงิน
              </button>
          </div>

          {/* Menu Buttons */}
          <div className="w-full space-y-3">
            <Button onClick={() => { onEditProfile(); onClose(); }} className="w-full bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-emerald-700 dark:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700">แก้ไขโปรไฟล์</Button>
            <button onClick={() => { onOpenMyDecks(); onClose(); }} className="w-full py-3 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold rounded-xl shadow-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 border border-amber-200 dark:border-amber-800/30"><DeckIcon /> My Decks</button>
          </div>

          {/* Theme Selector */}
          <div className="w-full pt-2 border-t border-slate-200 dark:border-emerald-700/20 mt-2">
            <label className="text-sm font-semibold text-slate-500 dark:text-gray-400 block mb-2">เลือกธีม</label>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => setTheme("light")} className={`text-sm ${theme === "light" ? "bg-amber-500/50 border-amber-400 text-amber-900" : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400"}`}><SunIcon /> สว่าง</Button>
              <Button onClick={() => setTheme("dark")} className={`text-sm ${theme === "dark" ? "bg-amber-500/50 border-amber-400 text-white" : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400"}`}><MoonIcon /> มืด</Button>
            </div>
          </div>

          {/* Feedback */}
          <div className="w-full pt-4 mt-4 border-t border-slate-200 dark:border-emerald-700/20">
            <Button onClick={() => { onOpenFeedback(); onClose(); }} className="w-full bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/30"><MessageIcon /> ติดต่อ / แจ้งปัญหา</Button>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="mt-auto p-6 border-t border-slate-200 dark:border-emerald-700/20 bg-slate-50 dark:bg-slate-900/50 shrink-0">
          <Button onClick={onLogout} className="w-full bg-red-200 dark:bg-red-900/30 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 hover:bg-red-300 dark:hover:bg-red-900/50 dark:hover:text-white">ออกจากระบบ</Button>
        </div>
      </div>

      {/* ✅ TopUp Modal (วางไว้นอก Drawer แต่ใน Fragment) */}
      <TopUpModal 
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        userProfile={userProfile}
        onSuccess={() => {
            // ถ้ามีฟังก์ชันโหลดข้อมูล User ใหม่ ใส่ตรงนี้ได้ครับ
            console.log("Topup Success");
        }}
      />
    </>
  );
};

export default SettingsDrawer;