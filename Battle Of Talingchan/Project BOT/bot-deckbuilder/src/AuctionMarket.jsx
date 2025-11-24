import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from "react-dom";
import { googleLogout } from '@react-oauth/google';
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import AdminDashboardModal from './AdminDashboardModal';
import ReportModal from './ReportModal';
import ManageBiddersModal from './ManageBiddersModal';
import NotificationCenter from './NotificationCenter'; // 🟢 เพิ่มบรรทัดนี้ครับ (แก้ Error)

// === Icons ===
const Svg = ({ p, ...r }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...r}>{p}</svg>;
const MenuIcon = () => <Svg p={<><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>} />;
const ChevronLeftIcon = () => <Svg p={<polyline points="15 18 9 12 15 6"></polyline>} />;
const GavelIcon = () => <Svg p={<><path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8-8"/><path d="m21 11-8-8"/></>} />;
const ShoppingBagIcon = () => <Svg p={<><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></>} />;
const UserCogIcon = () => <Svg p={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><circle cx="12" cy="12" r="3"></circle></>} />;
const CloseIcon = () => <Svg p={<><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>} />;
const SunIcon = () => <Svg p={<><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></>} />;
const MoonIcon = () => <Svg p={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>} />;
const ImageIcon = () => <Svg p={<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>} />;
const HistoryIcon = () => <Svg p={<><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></>} />;
const PackageIcon = () => <Svg p={<><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></>} />;
const ArchiveIcon = () => <Svg p={<><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></>} />;
const BanIcon = () => <Svg p={<><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></>} />;
const CrownIcon = () => <Svg p={<><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5z"></path></>} />;
const FlagIcon = () => <Svg p={<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></>} />;
const ShieldCheckIcon = () => <Svg p={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></>} />;
const ChatBubbleIcon = () => <Svg p={<><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></>} />;
const SendIcon = () => <Svg p={<><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></>} />;
const TrashIcon = () => <Svg p={<><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></>} />;

// 🟢 เพิ่มไอคอนที่ขาดไปสำหรับ Header ใหม่
const UsersIcon = () => <Svg p={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></>} />;
const DeckIcon = () => <Svg p={<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></>} />;
const StoreIcon = () => <Svg p={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></>} />;


// === Helper Functions ===
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
const getCardImageUrl = (cardImagePath, cardId) => {
    if (!cardImagePath || !cardId) return '';
    const fileId = cardId.replace(' - Only#1', '');
    return `/cards/${encodePath(cardImagePath)}/${encodeURIComponent(fileId)}.png`;
};
const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_SIZE = 256;
          let width = img.width;
          let height = img.height;
          if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } 
          else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
};

// === UI Components ===
const Button = ({ className = "", children, ...props }) => (
    <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-300/20 dark:border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 dark:hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`} {...props}>
      {children}
    </button>
);

// === Bid History Modal (Without Image) ===
const BidHistoryModal = ({ isOpen, onClose, auction }) => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && auction) {
            const fetchBids = async () => {
                setLoading(true);
                const { data } = await supabase.from('bids').select('*').eq('auction_id', auction.id).order('created_at', { ascending: false });
                setBids(data || []);
                setLoading(false);
            };
            fetchBids();
            const channel = supabase.channel(`bids:${auction.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids', filter: `auction_id=eq.${auction.id}` }, (payload) => { setBids(prev => [payload.new, ...prev]); }).subscribe();
            return () => supabase.removeChannel(channel);
        }
    }, [isOpen, auction]);

    if (!isOpen || !auction) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[700] p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><HistoryIcon /> ประวัติการบิด</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors"><CloseIcon /></button>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    <div className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{auction.card_name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ราคาปัจจุบัน: <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl ml-1">฿{auction.current_price.toLocaleString()}</span></p>
                    </div>
                    {loading ? (<div className="text-center py-8 text-slate-500">กำลังโหลด...</div>) : bids.length === 0 ? (<div className="text-center py-8 text-slate-500">ยังไม่มีใครบิด เป็นคนแรกเลย!</div>) : (
                        <div className="space-y-2">
                            {bids.map((bid, index) => (
                                <div key={bid.id} className={`flex justify-between items-center p-3 rounded-lg border ${index === 0 ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-500/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-700'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-amber-500' : 'bg-slate-400 dark:bg-slate-600'}`}>{index + 1}</div>
                                        <div><p className="text-sm font-bold text-slate-900 dark:text-white">{bid.bidder_name}</p><p className="text-[10px] text-slate-500">{new Date(bid.created_at).toLocaleString('th-TH')}</p></div>
                                    </div>
                                    <span className={`font-mono font-bold ${index === 0 ? 'text-emerald-600 dark:text-emerald-400 text-lg' : 'text-slate-600 dark:text-slate-400'}`}>฿{bid.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>, document.body
    );
};

// === Completed Auctions Modal ===
const CompletedAuctionsModal = ({ isOpen, onClose }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchCompleted = async () => {
                setLoading(true);
                const { data } = await supabase
                    .from('auctions')
                    .select('*')
                    .lt('end_time', new Date().toISOString())
                    .order('end_time', { ascending: false })
                    .limit(50);
                setItems(data || []);
                setLoading(false);
            };
            fetchCompleted();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[600] p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><ArchiveIcon /> ประวัติการประมูลที่จบแล้ว</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors"><CloseIcon /></button>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    {loading ? (<div className="text-center py-20 text-slate-500">กำลังโหลด...</div>) : items.length === 0 ? (<div className="text-center py-20 text-slate-500">ยังไม่มีรายการที่จบแล้ว</div>) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-lg">
                                    <div className="w-16 h-20 bg-slate-200 dark:bg-slate-700 rounded shrink-0 overflow-hidden">
                                        <img src={getCardImageUrl(item.card_image_path, item.card_id)} className="w-full h-full object-contain" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                                    </div>
                                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                                        <div><h4 className="font-bold text-slate-900 dark:text-white truncate">{item.card_name}</h4><p className="text-xs text-slate-500 dark:text-slate-400">จบเมื่อ: {new Date(item.end_time).toLocaleDateString('th-TH')}</p></div>
                                        <div className="flex justify-between items-end mt-2">
                                            <div><p className="text-[10px] text-slate-400">จบที่ราคา</p><p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">฿{item.current_price.toLocaleString()}</p></div>
                                            {item.winner_name ? (<div className="text-right"><p className="text-[10px] text-slate-400">ผู้ชนะ</p><p className="text-xs font-bold text-amber-600 dark:text-amber-400 truncate max-w-[100px]">👑 {item.winner_name}</p></div>) : (<p className="text-xs text-slate-400 italic">ไม่มีผู้บิด</p>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>, document.body
    );
};

// === Settings Drawer ===
const SettingsDrawer = ({ isOpen, onClose, userProfile, onEditProfile, onLogout, theme, setTheme, onOpenAdmin }) => {
    return (
      <>
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
        <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-300 dark:border-emerald-700/30 shadow-2xl z-[610] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-6 border-b border-slate-200 dark:border-emerald-700/20 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><UserCogIcon /> ตั้งค่าผู้ใช้</h2><button onClick={onClose} className="text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white"><CloseIcon /></button></div>
          <div className="p-6 flex flex-col items-center gap-4">
            <img src={userProfile?.picture} alt={userProfile?.name} className="w-24 h-24 rounded-full border-4 border-emerald-500 shadow-lg object-cover" onError={(e) => (e.target.src = "https://placehold.co/100x100/1e293b/ffffff?text=User")} />
            <div className="text-center"><h3 className="text-xl font-bold text-slate-900 dark:text-white">{userProfile?.name}</h3><p className="text-sm text-slate-500 dark:text-gray-400">{userProfile?.email}</p></div>
            <Button onClick={() => { onEditProfile(); onClose(); }} className="w-full mt-4 bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-emerald-700 dark:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700">แก้ไขโปรไฟล์</Button><button 
                onClick={() => { onOpenMyDecks(); onClose(); }}
                className="w-full py-3 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-bold rounded-xl shadow-sm hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
                <DeckIcon /> My Decks
            </button>
            <div className="mt-4 w-full"><label className="text-sm font-semibold text-slate-500 dark:text-gray-400">เลือกธีม</label><div className="mt-2 grid grid-cols-2 gap-2"><Button onClick={() => setTheme("light")} className={`text-sm ${theme === "light" ? "bg-amber-500/50 border-amber-400" : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400"}`}><SunIcon /> สว่าง</Button><Button onClick={() => setTheme("dark")} className={`text-sm ${theme === "dark" ? "bg-amber-500/50 border-amber-400" : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400"}`}><MoonIcon /> มืด</Button></div></div>
          </div>
          <div className="mt-auto p-6 border-t border-slate-200 dark:border-emerald-700/20"><Button onClick={onLogout} className="w-full bg-red-200 dark:bg-red-900/30 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 hover:bg-red-300 dark:hover:bg-red-900/50 dark:hover:text-white">ออกจากระบบ</Button></div>
        </div>
      </>
    );
};

// === Profile Setup Modal ===
const ProfileSetupModal = ({ isOpen, onClose, userProfile, onSave }) => {
    const [nickname, setNickname] = useState(userProfile?.name || "");
    const [avatarUrl, setAvatarUrl] = useState(userProfile?.picture || "");
    const [useGoogleAvatar, setUseGoogleAvatar] = useState(true);
    const fileInputRef = useRef(null);
  
    useEffect(() => { if (isOpen) { setNickname(userProfile?.name || ""); setAvatarUrl(userProfile?.picture || ""); setUseGoogleAvatar(true); } }, [isOpen, userProfile]);
    const handleFileChange = async (e) => { if (e.target.files && e.target.files[0]) { const resized = await resizeImage(e.target.files[0]); setAvatarUrl(resized); setUseGoogleAvatar(false); } };
    const handleSave = () => { onSave({ displayName: nickname, avatarUrl: useGoogleAvatar ? userProfile.picture : avatarUrl, }); };
    if (!isOpen) return null;
  
    return createPortal(
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[700] p-4">
        <div className="bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-emerald-500/50 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
          <div className="text-center"><h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 mb-2">แก้ไขโปรไฟล์</h2><p className="text-slate-600 dark:text-gray-400">อัปเดตข้อมูลของคุณให้เป็นปัจจุบัน</p></div>
          <div className="space-y-4"><div className="flex flex-col items-center gap-3"><div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg relative group"><img src={useGoogleAvatar ? userProfile.picture : avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" onError={(e) => (e.target.src = "https://placehold.co/100x100/1e293b/ffffff?text=User")} />{!useGoogleAvatar && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current.click()}><div className="text-white text-xs">เปลี่ยนรูป</div></div>)}</div><div className="flex gap-2 text-sm"><button onClick={() => setUseGoogleAvatar(true)} className={`px-3 py-1 rounded-full border ${useGoogleAvatar ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-400 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800"}`}>รูป Google</button><button onClick={() => fileInputRef.current.click()} className={`px-3 py-1 rounded-full border ${!useGoogleAvatar ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-400 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800"}`}><div className="flex items-center gap-1"><ImageIcon /> อัปโหลดรูป</div></button><input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} /></div></div><div className="space-y-3"><div><label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">นามแฝง (Display Name)</label><input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-emerald-500 outline-none" placeholder="ชื่อเท่ๆ ของคุณ" /></div></div></div>
          <div className="flex gap-3 mt-2"><Button onClick={onClose} className="flex-1 bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-slate-700">ยกเลิก</Button><Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 border-none text-white hover:shadow-lg hover:scale-105">บันทึก</Button></div>
        </div>
      </div>, document.body
    );
};

// === 2. Auction Room Modal (Chat) ===
const AuctionRoomModal = ({ isOpen, onClose, auction, userProfile, onBid }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && auction) {
            const fetchMessages = async () => {
                const { data } = await supabase.from('auction_comments').select('*').eq('auction_id', auction.id).order('created_at', { ascending: true });
                setMessages(data || []); scrollToBottom();
            };
            fetchMessages();
            const channel = supabase.channel(`chat:${auction.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'auction_comments', filter: `auction_id=eq.${auction.id}` }, (payload) => { setMessages(prev => [...prev, payload.new]); scrollToBottom(); }).subscribe();
            return () => supabase.removeChannel(channel);
        }
    }, [isOpen, auction]);

    const scrollToBottom = () => { setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); };
    const handleSendMessage = async (e) => { e.preventDefault(); if (!newMessage.trim() || !userProfile) return; await supabase.from('auction_comments').insert({ auction_id: auction.id, user_email: userProfile.email, user_name: userProfile.name, user_picture: userProfile.picture, message: newMessage.trim() }); setNewMessage(""); };

    if (!isOpen || !auction) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[700] p-0 md:p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border-0 md:border border-slate-200 dark:border-emerald-500/30 rounded-none md:rounded-xl shadow-2xl w-full h-full md:h-[90vh] max-w-6xl flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="w-full md:w-2/3 h-[50vh] md:h-full flex flex-col bg-slate-100 dark:bg-slate-950 relative">
                    <button onClick={onClose} className="absolute top-4 left-4 z-20 bg-black/50 text-white p-2 rounded-full md:hidden"><ChevronLeftIcon /></button>
                    <div className="flex-grow flex items-center justify-center p-4 relative">
                        <img src={getCardImageUrl(auction.card_image_path, auction.card_id)} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-emerald-500/50 flex flex-col items-center shadow-xl"><span className="text-xs text-emerald-400 uppercase tracking-wide">Current Price</span><span className="text-3xl font-bold font-mono">฿{auction.current_price.toLocaleString()}</span></div>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-emerald-500/20 flex items-center gap-4">
                        <div className="flex-grow"><h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{auction.card_name}</h2><p className="text-xs text-slate-500">Seller: {auction.seller_name}</p></div>
                        {userProfile?.email !== auction.seller_email && (<button onClick={() => onBid(auction)} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform active:scale-95">สู้ราคา! 🔨</button>)}
                    </div>
                </div>
                <div className="w-full md:w-1/3 h-[50vh] md:h-full flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center"><h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><ChatBubbleIcon /> Live Chat</h3><button onClick={onClose} className="hidden md:block text-slate-400 hover:text-red-500"><CloseIcon /></button></div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                        {messages.length === 0 ? (<div className="text-center text-slate-400 py-10 text-sm">เริ่มการสนทนาได้เลย...</div>) : messages.map((msg) => (<div key={msg.id} className={`flex gap-2 ${msg.user_email === userProfile?.email ? 'flex-row-reverse' : ''}`}><img src={msg.user_picture} className="w-8 h-8 rounded-full bg-slate-700" /><div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.user_email === userProfile?.email ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none'}`}><p className="text-[10px] opacity-70 mb-0.5">{msg.user_name}</p><p>{msg.message}</p></div></div>))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-2"><input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={userProfile ? "พิมพ์ข้อความ..." : "กรุณา Login"} disabled={!userProfile} className="flex-grow bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500" /><button type="submit" disabled={!newMessage.trim() || !userProfile} className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 disabled:opacity-50 transition-colors"><SendIcon /></button></form>
                </div>
            </div>
        </div>, document.body
    );
};

// === Main Component ===
export default function AuctionMarket() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('auction');
  const [auctions, setAuctions] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  
  // States for Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [historyAuction, setHistoryAuction] = useState(null); 
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); 
  const [manageAuction, setManageAuction] = useState(null);
  const [chatAuction, setChatAuction] = useState(null);

  const [customProfile, setCustomProfile] = useState(null);
  
  const [userProfile, setUserProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bot-userProfile-v1")); } catch { return null; }
  });
  const [theme, setThemeState] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bot-theme")) || 'dark'; } catch { return 'dark'; }
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("bot-theme", JSON.stringify(newTheme));
  };

  const displayUser = useMemo(() => {
    if (!userProfile) return null;
    if (!customProfile) return userProfile;
    return { ...userProfile, name: customProfile.displayName || userProfile.name, picture: customProfile.avatarUrl || userProfile.picture };
  }, [userProfile, customProfile]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userProfile?.email) {
        try {
          const docSnap = await getDoc(doc(db, "users", userProfile.email));
          if (docSnap.exists()) setCustomProfile(docSnap.data());
        } catch (e) { console.error("Profile fetch error", e); }
      }
    };
    fetchProfile();
  }, [userProfile]);

  useEffect(() => {
    if (activeTab === 'my-auctions' && userProfile?.email) {
        fetchMyAuctions();
    } else {
        fetchAuctions();
    }

    const channel = supabase.channel('public:auctions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, (payload) => {
          if (activeTab === 'my-auctions') fetchMyAuctions();
          else fetchAuctions();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [activeTab, userProfile]);

  async function fetchAuctions() {
    const now = new Date().toISOString();
    const { data } = await supabase
        .from('auctions')
        .select('*')
        .eq('status', 'active')
        .gt('end_time', now)
        .order('end_time', { ascending: true });
    if (data) setAuctions(data);
  }

  async function fetchMyAuctions() {
    if (!userProfile?.email) return;
    const { data } = await supabase.from('auctions').select('*').eq('seller_email', userProfile.email);
    if (data) {
        const sorted = data.sort((a, b) => {
            const aActive = new Date(a.end_time) > new Date();
            const bActive = new Date(b.end_time) > new Date();
            if (aActive && !bActive) return -1;
            if (!aActive && bActive) return 1;
            return new Date(b.created_at) - new Date(a.created_at);
        });
        setMyAuctions(sorted);
    }
  }

  async function handleBid(auction) {
    if (!userProfile) return alert("กรุณา Login ที่หน้าแรกก่อนครับ");
    if (userProfile.email === auction.seller_email) return alert("ห้ามบิดของตัวเองครับ!");

    const minBid = auction.current_price + auction.min_bid_increment;
    const amountStr = prompt(`🔥 บิดสินค้า: ${auction.card_name}\n💰 ราคาปัจจุบัน: ${auction.current_price.toLocaleString()} บาท\n📈 ขั้นต่ำที่ต้องบิด: ${minBid.toLocaleString()} บาท\nกรอกราคาที่คุณต้องการสู้:`, minBid);
    if (!amountStr) return;
    const amount = parseInt(amountStr);
    if (amount < minBid) return alert(`ต้องบิดอย่างน้อย ${minBid} บาทครับ`);

    const { data, error } = await supabase.rpc('place_bid', {
      p_auction_id: auction.id,
      p_bidder_email: userProfile.email,
      p_bidder_name: displayUser.name,
      p_amount: amount
    });

    if (error) alert("Error: " + error.message);
    else if (!data.success) alert(data.message);
    else alert("บิดสำเร็จ! 🎉");
  }

  async function handleCancel(auctionId) {
    const isAdmin = userProfile?.email === 'koritros619@gmail.com';
    const confirmMsg = isAdmin
        ? "👑 Admin Force Cancel:\nต้องการยกเลิกการประมูลนี้ใช่หรือไม่?\n(ผู้ใช้งานจะไม่ได้รับโทษ แต่การประมูลจะยุติทันที)"
        : "⚠️ ยืนยันการยกเลิก?\n- ยกเลิกได้ 3 ครั้ง/วัน\n- หากเกินจะติดคูลดาวน์ 3 ชม.\n- ผู้ที่บิดไปแล้วจะได้รับการแจ้งเตือน";

    if (!confirm(confirmMsg)) return;

    const { data, error } = await supabase.rpc('cancel_auction', {
      p_auction_id: auctionId,
      p_user_email: userProfile.email
    });

    if (error) alert("Error: " + error.message);
    else if (!data.success) alert(data.message);
    else {
        alert(data.message);
        fetchAuctions();
        fetchMyAuctions();
    }
  }

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("bot-userProfile-v1");
    setUserProfile(null);
    navigate('/');
  };

  const handleSaveProfile = async (data) => {
    if (!userProfile) return;
    try {
      await setDoc(doc(db, "users", userProfile.email), { displayName: data.displayName, avatarUrl: data.avatarUrl, isSetup: true, updatedAt: serverTimestamp() }, { merge: true });
      setCustomProfile(p => ({ ...p, ...data }));
      setIsProfileModalOpen(false);
      alert("บันทึกข้อมูลเรียบร้อย!");
    } catch (e) { console.error(e); alert("บันทึกไม่สำเร็จ"); }
  };

  const TimeLeft = ({ endTime }) => {
    const [diff, setDiff] = useState(new Date(endTime) - new Date());
    useEffect(() => {
        const timer = setInterval(() => setDiff(new Date(endTime) - new Date()), 1000);
        return () => clearInterval(timer);
    }, [endTime]);
    
    if (diff <= 0) return <span className="text-red-500 font-bold">จบแล้ว</span>;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return <span className="text-amber-600 font-mono">{h}h {m}m {s}s</span>;
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-100 dark:bg-black text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      
      {/* ================================================================= */}
      {/* 🎨 Header (Full Navigation - เหมือน App.jsx) */}
      {/* ================================================================= */}
      <header className="px-3 md:px-6 py-2 border-b border-slate-300 dark:border-emerald-700/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 h-14 flex flex-col justify-center">
         <div className="flex items-center justify-between gap-2 w-full">
            
            {/* 🟢 ฝั่งซ้าย: Menu + Admin + Title */}
            <div className="flex items-center gap-1.5 overflow-hidden">
                <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-800 dark:text-white transition-colors shrink-0">
                    <div className="scale-90"><MenuIcon /></div>
                </button>
                
                {/* ปุ่ม Admin เฉพาะผู้ดูแล */}
                {userProfile?.email === 'koritros619@gmail.com' && (
                    <button onClick={() => setIsAdminOpen(true)} className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-500/20 transition-all animate-pulse font-bold text-[10px] md:text-xs shrink-0">
                        <div className="scale-75"><CrownIcon /></div> <span className="hidden md:inline">ADMIN</span>
                    </button>
                )}

                <h1 className="text-lg md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 bg-clip-text text-transparent truncate pt-0.5">
                    Marketplace
                </h1>
            </div>
            
            {/* 🟢 ฝั่งขวา: เรียงลำดับ (Market -> Public -> My Decks -> Bell -> Profile) */}
            <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
                
                {/* 1. Market (Active Page) */}
                <Link to="/">
                    <Button className="!px-2 md:!px-4 bg-gradient-to-r from-rose-500 to-orange-600 text-white border-none shadow-md hover:shadow-lg hover:from-rose-400 hover:to-orange-500 ring-2 ring-offset-2 ring-rose-500/50 dark:ring-offset-slate-900">
                        <StoreIcon /> 
                        <span className="hidden md:inline ml-1">Market</span>
                    </Button>
                </Link>

                {/* 2. Public Decks */}
                <Link to="/public-decks">
                    <Button
                        as="span"
                        className="!px-2 md:!px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg hover:from-blue-400 hover:to-purple-500"
                    >
                        <UsersIcon />{" "}
                        <span className="hidden md:inline">Public</span>
                    </Button>
                </Link>

                {/* 4. Bell (Notification) */}
                <NotificationCenter userEmail={userProfile?.email} />

                {/* 5. Profile Picture */}
                <img
                    src={displayUser.picture}
                    alt={displayUser.name}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-emerald-500 object-cover ml-1 cursor-pointer hover:scale-105 transition-transform"
                    title={`Logged in as ${displayUser.name}`}
                    onClick={() => setIsSettingsOpen(true)} 
                />
                <span className="text-slate-900 dark:text-white hidden lg:block text-sm font-semibold max-w-[100px] truncate">
                    {displayUser.name}
                </span>
            </div>
         </div>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mt-4 px-2 md:px-4">
        <div className="flex w-full md:w-auto bg-slate-200 dark:bg-slate-800 rounded-full p-1 shadow-inner">
            <button 
                onClick={() => setActiveTab('my-auctions')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'my-auctions' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <PackageIcon /> <span className="hidden sm:inline">สินค้าที่ลงประมูล</span><span className="inline sm:hidden">ของฉัน</span>
            </button>

            <button 
                onClick={() => setActiveTab('auction')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'auction' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <GavelIcon /> ลานประมูล
            </button>

            <button 
                onClick={() => setActiveTab('market')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'market' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <ShoppingBagIcon /> <span className="hidden sm:inline">ตลาดซื้อขาย</span><span className="inline sm:hidden">ตลาด</span>
            </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-grow p-2 md:p-8 w-full">
        {activeTab === 'my-auctions' && (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold flex items-center gap-2"><span className="text-blue-500">📦</span> สินค้าของฉัน</h2><span className="text-sm text-slate-500">{myAuctions.length} รายการ</span></div>
                {(!userProfile) ? (<div className="text-center py-20 text-slate-500">กรุณาเข้าสู่ระบบเพื่อดูรายการสินค้าของคุณ</div>) : myAuctions.length === 0 ? (<div className="text-center py-20 text-slate-500">คุณยังไม่ได้ลงประมูลสินค้าใดๆ</div>) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {myAuctions.map(item => {
                            const isEnded = new Date(item.end_time) < new Date();
                            const isCancelled = item.status === 'cancelled';
                            return (
                                <div key={item.id} 
                                     className={`bg-white dark:bg-slate-900 border ${!isEnded && !isCancelled ? 'border-blue-400 dark:border-blue-500/50' : 'border-slate-200 dark:border-slate-700 opacity-70'} rounded-xl shadow-lg overflow-hidden flex flex-col hover:border-blue-400 transition-all group relative cursor-pointer`}
                                     onClick={() => setChatAuction(item)}
                                >
                                    <div className="aspect-[5/7] bg-slate-200 dark:bg-slate-800 relative">
                                        <img src={getCardImageUrl(item.card_image_path, item.card_id)} className="w-full h-full object-contain p-2" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                                        <div className={`absolute top-2 right-2 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm border font-bold ${isCancelled ? 'bg-red-600/80 border-red-400' : !isEnded ? 'bg-blue-600/80 border-blue-400' : 'bg-slate-600/80 border-slate-500'}`}>{isCancelled ? 'ยกเลิกแล้ว' : !isEnded ? 'กำลังประมูล' : 'จบแล้ว'}</div>
                                        <button onClick={(e) => { e.stopPropagation(); setHistoryAuction(item); }} className="absolute top-2 left-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-1.5 rounded-full transition-colors"><div className="scale-75"><HistoryIcon /></div></button>
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col">
                                        <h3 className="font-bold text-sm truncate mb-1">{item.card_name}</h3>
                                        <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700 text-center mb-2">
                                            <p className="text-[10px] text-slate-400 uppercase">{!isEnded && !isCancelled ? 'Current Bid' : 'Sold Price'}</p>
                                            <p className={`text-xl font-bold ${isCancelled ? 'text-red-500 line-through' : 'text-blue-600 dark:text-blue-400'}`}>฿{item.current_price.toLocaleString()}</p>
                                            {item.winner_name && !isCancelled ? <p className="text-[10px] text-amber-500 mt-0.5 truncate">👑 {item.winner_name}</p> : <p className="text-[10px] text-slate-400 mt-0.5">-</p>}
                                        </div>
                                        
                                        {/* 🟢 ส่วนปุ่มจัดการ (แสดงเฉพาะตอน Active) */}
                                        {item.status === 'active' && (
                                            <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                                {/* ปุ่ม 1: ยกเลิกการประมูล */}
                                                <button 
                                                    onClick={() => handleCancel(item.id)}
                                                    className="w-full py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <BanIcon /> ยกเลิกการประมูล
                                                </button>

                                                {/* ปุ่ม 2: จัดการผู้บิด (เพิ่มใหม่) */}
                                                <button 
                                                    onClick={() => setManageAuction(item)}
                                                    className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <ShieldCheckIcon /> จัดการผู้บิด
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'auction' && (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><span className="text-amber-500">🔥</span> กำลังเดือด</h2>
                    <button onClick={() => setIsCompletedModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors"><ArchiveIcon /> <span>ประวัติ</span></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {auctions.length === 0 ? (<div className="col-span-full text-center py-20 text-slate-500">ยังไม่มีการประมูลขณะนี้...</div>) : auctions.map(item => (
                        <div key={item.id} 
                             className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-xl shadow-lg overflow-hidden flex flex-col hover:border-amber-400/50 transition-all group cursor-pointer"
                             onClick={() => setChatAuction(item)} // 🟢 คลิกเปิดห้องแชท
                        >
                            <div className="aspect-[5/7] bg-slate-200 dark:bg-slate-800 relative">
                                <img src={getCardImageUrl(item.card_image_path, item.card_id)} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm border border-white/10"><TimeLeft endTime={item.end_time} /></div>
                                
                                {/* 🟢 ปุ่ม Admin Force Delete (เฉพาะ Admin) */}
                                {userProfile?.email === 'koritros619@gmail.com' && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleCancel(item.id); }}
                                        className="absolute top-2 left-10 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 z-20 transition-transform hover:scale-110"
                                        title="Admin Force Cancel"
                                    >
                                        <div className="scale-75"><TrashIcon /></div>
                                    </button>
                                )}

                                {/* ปุ่มดูประวัติ */}
                                <button onClick={(e) => { e.stopPropagation(); setHistoryAuction(item); }} className="absolute top-2 left-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-1.5 rounded-full transition-colors"><div className="scale-75"><HistoryIcon /></div></button>
                            </div>
                            
                            <div className="p-3 flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[10px] text-slate-500">ผู้ขาย: {item.seller_name}</p>
                                    {/* ปุ่ม Report ผู้ขาย */}
                                    {userProfile?.email !== item.seller_email && (
                                        <button onClick={(e) => { e.stopPropagation(); setReportTarget({ targetUser: { email: item.seller_email, name: item.seller_name }, context: { type: 'auction', id: item.id } }); }} className="text-slate-400 hover:text-red-500 transition-colors" title="แจ้งรายงาน"><div className="scale-75"><FlagIcon /></div></button>
                                    )}
                                </div>
                                <h3 className="font-bold text-sm truncate mb-1">{item.card_name}</h3>
                                <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700 text-center mb-2"><p className="text-[10px] text-slate-400 uppercase">Current Bid</p><p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">฿{item.current_price.toLocaleString()}</p>{item.winner_name && <p className="text-[10px] text-amber-500 mt-0.5 truncate">👑 {item.winner_name}</p>}</div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleBid(item); }}
                                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-sm font-bold rounded-lg shadow-md active:scale-95 transition-all"
                                >
                                    สู้ราคา!
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'market' && (
            <div className="animate-fade-in text-center py-20">
                <div className="inline-block p-6 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"><ShoppingBagIcon width="48" height="48" className="text-emerald-500" /></div>
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">ตลาดซื้อขาย (Coming Soon)</h2>
                <p className="text-slate-500">ระบบวางขายการ์ดแบบกำหนดราคาตายตัว กำลังพัฒนาครับ...</p>
            </div>
        )}
      </main>

      {/* Settings & Modals */}
      <SettingsDrawer 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userProfile={displayUser} 
        onEditProfile={() => setIsProfileModalOpen(true)} 
        onLogout={handleLogout} 
        theme={theme} 
        setTheme={setTheme}
        onOpenAdmin={() => setIsAdminOpen(true)} 
      />
      <ProfileSetupModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userProfile={userProfile} onSave={handleSaveProfile} />
      <BidHistoryModal isOpen={!!historyAuction} onClose={() => setHistoryAuction(null)} auction={historyAuction} />
      <CompletedAuctionsModal isOpen={isCompletedModalOpen} onClose={() => setIsCompletedModalOpen(false)} />
      <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} adminEmail={userProfile?.email} />
      <ReportModal 
        isOpen={!!reportTarget} 
        onClose={() => setReportTarget(null)} 
        reporterEmail={userProfile?.email}
        targetUser={reportTarget?.targetUser}
        context={reportTarget?.context}
      />
      <ManageBiddersModal isOpen={!!manageAuction} onClose={() => setManageAuction(null)} auction={manageAuction} userProfile={userProfile} />
      <AuctionRoomModal isOpen={!!chatAuction} onClose={() => setChatAuction(null)} auction={chatAuction} userProfile={displayUser} onBid={handleBid} />
    </div>
  );
}