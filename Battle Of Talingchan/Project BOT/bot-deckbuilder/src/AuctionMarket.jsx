import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from "react-dom";
import { googleLogout } from '@react-oauth/google';
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import AdminDashboardModal from './AdminDashboardModal';
import ReportModal from './ReportModal';
import NotificationCenter from './NotificationCenter';

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
const UsersIcon = () => <Svg p={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></>} />;
const DeckIcon = () => <Svg p={<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></>} />;
const StoreIcon = () => <Svg p={<><path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8-8"/><path d="m21 11-8-8"/></>} />;
const HomeIcon = () => <Svg p={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></>} />;
// --- Rating Badge Component ---
const RatingBadge = ({ score, penaltyLevel = 'Normal' }) => {
    const scoreNum = parseInt(score);
    let color = 'text-emerald-600';
    let bg = 'bg-emerald-500/10';
    let statusIcon = '✅';

    if (scoreNum === 0) { color = 'text-slate-500'; bg = 'bg-slate-500/10'; statusIcon = '🆕'; }
    if (scoreNum < 0) { color = 'text-amber-600'; bg = 'bg-amber-500/10'; statusIcon = '⚠️'; }
    if (scoreNum < -5) { color = 'text-red-600'; bg = 'bg-red-600/10'; statusIcon = '⛔'; }
    
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] md:text-xs font-bold ${color} ${bg} px-2 py-0.5 rounded-full`} title={`เครดิตรวม: ${scoreNum} (สถานะ: ${penaltyLevel})`}>
            {statusIcon}
            {scoreNum >= 0 ? '+' : ''}{scoreNum}
        </span>
    );
};

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

// === 🟢 [ใหม่] Digital Clock TimeLeft Component ===
const TimeLeft = ({ endTime }) => {
    const [diff, setDiff] = useState(new Date(endTime) - new Date());
    
    useEffect(() => {
        const timer = setInterval(() => setDiff(new Date(endTime) - new Date()), 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    // สไตล์เมื่อจบแล้ว
    if (diff <= 0) return (
        <div className="px-3 py-1 bg-red-600/90 backdrop-blur text-white text-xs font-bold rounded-lg shadow-lg border border-red-400 animate-pulse">
            ENDED
        </div>
    );

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    // สีตัวเลขเปลี่ยนตามความเร่งด่วน
    const textColor = "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]";
    const isUrgent = h === 0 && m < 5; // เหลือ < 5 นาที

    return (
        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md border border-slate-700 rounded-lg px-2 py-1 shadow-xl">
            {/* ตัวเลขแบบ Digital Font */}
            <div className={`font-mono text-lg font-black tracking-widest tabular-nums ${textColor} leading-none`} style={{ fontFamily: "'Courier New', monospace" }}>
                {String(h).padStart(2, '0')}:
                {String(m).padStart(2, '0')}:
                {String(s).padStart(2, '0')}
            </div>
        </div>
    );
};

// === 1. Manage Bidders Modal ===
const ManageBiddersModal = ({ isOpen, onClose, auction, userProfile }) => {
    const [bidders, setBidders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reportTarget, setReportTarget] = useState(null); 
    const [reason, setReason] = useState('fake_bid');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (isOpen && auction) fetchBidders();
    }, [isOpen, auction]);
  
    const fetchBidders = async () => {
      setLoading(true);
      const { data: bids } = await supabase.from('bids').select('bidder_email, bidder_name').eq('auction_id', auction.id);
      const unique = []; const seen = new Set();
      bids?.forEach(b => { if (!seen.has(b.bidder_email)) { seen.add(b.bidder_email); unique.push(b); } });
      setBidders(unique);
      setLoading(false);
    };
  
    const handleSubmitReport = async () => {
        if (!description.trim()) return alert("กรุณาระบุเหตุผลเพิ่มเติม");
        setIsSubmitting(true);
        const { error } = await supabase.from('user_reports').insert({
            reporter_email: userProfile.email, target_email: reportTarget.bidder_email, target_name: reportTarget.bidder_name,
            context_type: 'bidder_report', context_id: auction.id, reason: reason, description: description, status: 'pending'
        });
        setIsSubmitting(false);
        if (error) alert("Error: " + error.message);
        else { alert(`ส่งรายงานคุณ "${reportTarget.bidder_name}" เรียบร้อย!\nเรื่องจะถูกส่งไปยัง Admin Dashboard`); setReportTarget(null); setDescription(''); }
    };
  
    if (!isOpen || !auction) return null;
  
    return createPortal(
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[800] p-4" onClick={onClose}>
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-red-500/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
          <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><ShieldCheckIcon /> {reportTarget ? 'แจ้งรายงานผู้บิด' : 'จัดการผู้บิด'}</h3>
              <button onClick={onClose}>✕</button>
          </div>
          <div className="p-4 flex-grow overflow-y-auto">
              {reportTarget ? (
                  <div className="space-y-4 animate-fade-in">
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"><p className="text-sm text-slate-700 dark:text-slate-300">กำลังรายงาน: <span className="font-bold">{reportTarget.bidder_name}</span></p><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">อีเมล: {reportTarget.bidder_email}</p></div>
                      <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">หัวข้อการกระทำผิด</label><select value={reason} onChange={e=>setReason(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500"><option value="fake_bid">บิดเล่น / ไม่ชำระเงิน</option><option value="harassment">ก่อกวน / ใช้คำหยาบ</option><option value="spam">สแปมการประมูล</option><option value="other">อื่นๆ</option></select></div>
                      <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">อธิบายเหตุผล</label><textarea rows="3" value={description} onChange={e=>setDescription(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-red-500 resize-none" placeholder="เช่น บิดชนะแล้วเงียบหาย..." /></div>
                      <div className="flex gap-2 pt-2"><button onClick={()=>setReportTarget(null)} className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold text-sm">ย้อนกลับ</button><button onClick={handleSubmitReport} disabled={isSubmitting} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 disabled:opacity-50">{isSubmitting ? 'กำลังส่ง...' : 'ยืนยันส่งเรื่อง'}</button></div>
                  </div>
              ) : (
                  <>
                    <p className="text-xs text-slate-500 mb-4">เลือกผู้ใช้งานที่ต้องการรายงานพฤติกรรม (เรื่องจะถูกส่งไปที่ Admin)</p>
                    {loading ? <p className="text-center text-slate-500">กำลังโหลดรายชื่อ...</p> : bidders.length === 0 ? (<div className="text-center py-10 text-slate-400"><p>ยังไม่มีใครบิดสินค้านี้</p></div>) : (
                        <div className="space-y-2">{bidders.map((user) => (<div key={user.bidder_email} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"><div><p className="font-bold text-sm text-slate-900 dark:text-white">{user.bidder_name}</p><p className="text-[10px] text-slate-500">{user.bidder_email}</p></div><button onClick={() => setReportTarget(user)} className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded text-xs font-bold transition-colors flex items-center gap-1"><GavelIcon /> รายงาน</button></div>))}</div>
                    )}
                  </>
              )}
          </div>
        </div>
      </div>, document.body
    );
};

// === 2. Auction Room Modal (Classic Layout + Digital Clock) ===
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
                
                {/* 🖼️ ส่วนซ้าย: รูปภาพ (กลับไปใช้ Layout เดิม) */}
                <div className="w-full md:w-2/3 h-[50vh] md:h-full flex flex-col bg-slate-100 dark:bg-slate-950 relative">
                    <button onClick={onClose} className="absolute top-4 left-4 z-20 bg-black/50 text-white p-2 rounded-full md:hidden hover:bg-red-500 transition-colors"><ChevronLeftIcon /></button>
                    
                    {/* 🟢 Image Area */}
                    <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
                        <img 
                            src={getCardImageUrl(auction.card_image_path, auction.card_id)} 
                            className="max-w-full max-h-full object-contain drop-shadow-2xl" 
                            onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }}
                        />
                        
                        {/* 🟢 Digital Clock (วางมุมขวาบน) */}
                        <div className="absolute top-4 right-4 z-10">
                            <TimeLeft endTime={auction.end_time} />
                        </div>
                    </div>

                    {/* 🟢 Action Bar (แถบขาวด้านล่าง) */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-emerald-500/20 flex items-center gap-4 shrink-0">
                        
                        <div className="flex-grow min-w-0 flex flex-col justify-center">
                            {/* 🟢 [แก้ไข] ย้ายราคาลงมาอยู่บรรทัดเดียวกับชื่อการ์ด */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 truncate">{auction.card_name}</h2>
                                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white flex items-center">
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">Seller: {auction.seller_name}</p>
                            
                            {/* 🟢 [เพิ่มโค้ดใหม่]: แสดงชื่อผู้ประมูลสูงสุด */}
                            {auction.winner_name && (
                                <p className="text-sm font-bold text-amber-500 mt-1">
                                    👑 Highest Bid: <span className="text-slate-900 dark:text-white">{auction.winner_name}</span>
                                </p>
                            )}
                        </div>
                        <div className="flex-grow min-w-0 flex flex-col items-center justify-center">
                            
                            {/* 🟢 [เพิ่ม] กล่องราคาหลัก: ใหญ่ขึ้นและจัดกึ่งกลาง */}
                            
                            <div className="flex flex-col items-center justify-center mb-2">
                                {/* 1. คำว่า "CURRENT PRICE" (ใหญ่ขึ้นเล็กน้อย) */}
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 mr-1 uppercase tracking-widest">
                                    CURRENT BID
                                </span>
                                
                                <div className="flex items-baseline leading-none">
                                    {/* 2. สัญลักษณ์ ฿ (ใหญ่ขึ้น) */}
                                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mr-1">฿</span>
                                    {/* 3. ตัวเลขราคา (ใหญ่ขึ้นมาก) */}
                                    <span className="text-4xl md:text-5xl font-black font-mono text-slate-900 dark:text-white">
                                        {auction.current_price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* 🟢 [ย้าย] ชื่อการ์ดและผู้ขายมาอยู่ใต้ราคา (เพื่อเน้นราคา) */}
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 text-center">{auction.card_name}</h2>
                        
                        </div>
                        
                        {userProfile?.email !== auction.seller_email && (
                            <button 
                                onClick={() => onBid(auction)} 
                                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform active:scale-95 flex items-center gap-2"
                            >
                                <GavelIcon /> สู้ราคา!
                            </button>
                        )}
                    </div>
                </div>

                {/* 💬 ส่วนขวา: ห้องแชท (เหมือนเดิม) */}
                <div className="w-full md:w-1/3 h-[50vh] md:h-full flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-0">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <ChatBubbleIcon /> Live Chat
                        </h3>
                        <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-red-500"><CloseIcon /></button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 min-h-0">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
                                <span className="text-4xl opacity-20">💬</span>
                                <p>เริ่มการสนทนาได้เลย...</p>
                            </div>
                        ) : messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-2 ${msg.user_email === userProfile?.email ? 'flex-row-reverse' : ''}`}>
                                <img src={msg.user_picture} className="w-8 h-8 rounded-full bg-slate-700 object-cover shrink-0" />
                                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.user_email === userProfile?.email ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none'}`}>
                                    <p className="text-[10px] opacity-70 mb-0.5">{msg.user_name}</p>
                                    <p>{msg.message}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-2 shrink-0">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder={userProfile ? "พิมพ์ข้อความ..." : "กรุณา Login"}
                            disabled={!userProfile}
                            className="flex-grow bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500" 
                        />
                        <button type="submit" disabled={!newMessage.trim() || !userProfile} className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 disabled:opacity-50 transition-colors">
                            <SendIcon />
                        </button>
                    </form>
                </div>

            </div>
        </div>, document.body
    );
};

// === Notification Dropdown ===
const NotificationDropdown = ({ isOpen, onClose, userEmail }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userEmail) return;
        const fetchNotifications = async () => {
            const { data } = await supabase.from('notifications').select('*').or(`user_email.eq.${userEmail},user_email.eq.GLOBAL`).order('created_at', { ascending: false }).limit(20);
            if(data) setNotifications(data);
        };
        fetchNotifications();
        const channel = supabase.channel(`noti:${userEmail}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_email=eq.${userEmail}` }, (payload) => { setNotifications(prev => [payload.new, ...prev]); }).subscribe();
        return () => supabase.removeChannel(channel);
    }, [userEmail]);

    const markAllAsRead = async () => {
        if(notifications.length === 0) return;
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        await supabase.from('notifications').update({ is_read: true }).eq('user_email', userEmail);
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100]" onClick={onClose}></div>
            <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-2xl z-[101] overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center"><h3 className="font-bold text-slate-800 dark:text-white text-sm">การแจ้งเตือน</h3><div className="flex gap-2">{unreadCount > 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unreadCount} ใหม่</span>}<button onClick={markAllAsRead} className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline">อ่านทั้งหมด</button></div></div>
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (<div className="p-8 text-center text-slate-500 text-xs">ไม่มีการแจ้งเตือน</div>) : (
                        notifications.map(n => (
                            <div key={n.id} className={`p-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.is_read ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${n.type === 'admin_announce' ? 'text-red-500 dark:text-red-400' : n.type === 'bid' ? 'text-emerald-600 dark:text-emerald-400' : n.type === 'outbid' ? 'text-amber-600 dark:text-amber-400' : n.type === 'cancel' ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>{n.type === 'admin_announce' ? '📢 ' : ''}{n.title}</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{new Date(n.created_at).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

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

// === Confirm Transaction Modal (Rating) ===
const ConfirmTransactionModal = ({ isOpen, onClose, auction, userProfile, fetchReputations }) => {
    const [action, setAction] = useState('good'); // 'good' | 'bad'
    const [reason, setReason] = useState('transaction_success');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !auction || !userProfile) return null;

    // 1. ตรวจสอบบทบาทของ User ที่กำลัง Login
    const isSeller = userProfile.email === auction.seller_email;
    const targetEmail = isSeller ? auction.winner_email : auction.seller_email;
    const targetName = isSeller ? auction.winner_name : auction.seller_name;
    
    if (auction.end_time > new Date().toISOString()) return null;

    const handleSubmit = async () => {
        const score = action === 'good' ? 1 : -1;
        
        if (score === -1 && !confirm(`⚠️ ยืนยันหักเครดิตคุณ ${targetName} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;

        setIsSubmitting(true);
        
        const { data, error } = await supabase.rpc('submit_reputation', {
            p_auction_id: auction.id,
            p_reporter_email: userProfile.email,
            p_target_email: targetEmail,
            p_score_change: score,
            p_reason_code: reason
        });

        setIsSubmitting(false);

        if (error) alert("Error: " + error.message);
        else {
            alert(data.message);
            fetchReputations(); // รีโหลดคะแนนเครดิต
            onClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[850] p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">ยืนยันธุรกรรม: {auction.card_name}</h3>
                    <button onClick={onClose}>✕</button>
                </div>
                
                <div className="p-5 space-y-5">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        โปรดให้เครดิตการซื้อขายกับ <span className="font-bold">{targetName}</span> (ผู้{isSeller ? 'ชนะ' : 'ขาย'})
                    </p>

                    {/* Radio Buttons for Score */}
                    <div className="flex gap-4">
                        <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${action === 'good' ? 'bg-emerald-100 border-emerald-500' : 'bg-slate-100 border-slate-300'}`}>
                            <input type="radio" name="score" value="good" checked={action === 'good'} onChange={() => { setAction('good'); setReason('transaction_success'); }} className="mr-2" />
                            <span className="font-bold text-emerald-600">👍 ให้เครดิต (+1)</span>
                        </label>
                        <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${action === 'bad' ? 'bg-red-100 border-red-500' : 'bg-slate-100 border-slate-300'}`}>
                            <input type="radio" name="score" value="bad" checked={action === 'bad'} onChange={() => { setAction('bad'); setReason('non_payment'); }} className="mr-2" />
                            <span className="font-bold text-red-600">👎 หักเครดิต (-1)</span>
                        </label>
                    </div>

                    {/* Reason Select */}
                    {action === 'bad' && (
                        <div>
                            <label className="text-xs font-bold text-red-500 uppercase mb-1 block">ระบุสาเหตุ</label>
                            <select value={reason} onChange={e=>setReason(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 outline-none">
                                <option value="non_payment">ไม่ชำระเงิน / เงียบหาย</option>
                                <option value="non_delivery">ผู้ขายไม่จัดส่งสินค้า</option>
                                <option value="fake_item">สินค้าไม่ตรงปก / ปลอม</option>
                                <option value="cancellation_abuse">ยกเลิกหลังการบิดจบ</option>
                            </select>
                        </div>
                    )}
                    
                    <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50">
                        {isSubmitting ? 'กำลังส่ง...' : 'ส่งคะแนนเครดิต'}
                    </button>
                </div>
            </div>
        </div>, document.body
    );
};

// === Completed Auctions Modal (Admin Delete Added) ===
const CompletedAuctionsModal = ({ isOpen, onClose, userProfile }) => { // 🟢 1. เพิ่มรับ prop userProfile
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (isOpen) {
            fetchCompleted();
        }
    }, [isOpen]);

    // 🟢 2. ฟังก์ชันลบประวัติ (เฉพาะ Admin)
    const handleDeleteHistory = async (id) => {
        if(!confirm("⚠️ ยืนยันลบประวัติรายการนี้ถาวร?")) return;
        
        const { data, error } = await supabase.rpc('admin_force_delete', { 
            p_admin_email: userProfile?.email, 
            p_target_input: id, 
            p_action_type: 'delete_auction' 
        });

        if(error) alert("Error: " + error.message);
        else {
            // ลบออกจากหน้าจอทันที ไม่ต้องโหลดใหม่
            setItems(prev => prev.filter(item => item.id !== id));
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[600] p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    {/* 🟢 แก้ไขไอคอนเป็น HistoryIcon */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><HistoryIcon /> ประวัติการประมูลที่จบแล้ว</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors"><CloseIcon /></button>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    {loading ? (<div className="text-center py-20 text-slate-500">กำลังโหลด...</div>) : items.length === 0 ? (<div className="text-center py-20 text-slate-500">ยังไม่มีรายการที่จบแล้ว</div>) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-lg relative group">
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

                                    {/* 🟢 3. ปุ่มลบสำหรับ Admin (จะโผล่เมื่อเอาเมาส์ไปชี้) */}
                                    {userProfile?.email === 'koritros619@gmail.com' && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteHistory(item.id); }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-10"
                                            title="Admin Delete History"
                                        >
                                            <TrashIcon />
                                        </button>
                                    )}
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
            {userProfile?.email === 'koritros619@gmail.com' && (<button onClick={() => { onOpenAdmin(); onClose(); }} className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-2 animate-pulse"><CrownIcon /> ADMIN DASHBOARD</button>)}
            <img src={userProfile?.picture} alt={userProfile?.name} className="w-24 h-24 rounded-full border-4 border-emerald-500 shadow-lg object-cover" onError={(e) => (e.target.src = "https://placehold.co/100x100/1e293b/ffffff?text=User")} />
            <div className="text-center"><h3 className="text-xl font-bold text-slate-900 dark:text-white">{userProfile?.name}</h3><p className="text-sm text-slate-500 dark:text-gray-400">{userProfile?.email}</p></div>
            <Button onClick={() => { onEditProfile(); onClose(); }} className="w-full mt-4 bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-emerald-700 dark:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700">แก้ไขโปรไฟล์</Button>
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
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [unreadNotiCount, setUnreadNotiCount] = useState(0);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); 
  const [manageAuction, setManageAuction] = useState(null);

  // 🟢 [ใหม่] State สำหรับระบบเครดิต
  const [userReputation, setUserReputation] = useState({}); // เก็บคะแนนของผู้ใช้ทั้งหมด
  const [confirmTransaction, setConfirmTransaction] = useState(null); // Modal ยืนยันธุรกรรม

  // 🟢 [ใหม่] โหลดคะแนนเครดิตของผู้ใช้ทั้งหมด
  const fetchReputations = async () => {
      const { data } = await supabase.from('user_stats').select('user_email, total_score, penalty_level');
      const map = {};
      data?.forEach(u => map[u.user_email] = u);
      setUserReputation(map);};

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
    if (!userProfile?.email) return;
    const fetchUnread = async () => {
        const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_email', userProfile.email).eq('is_read', false);
        setUnreadNotiCount(count || 0);
    };
    fetchUnread();
    const channel = supabase.channel(`noti_count:${userProfile.email}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_email=eq.${userProfile.email}` }, (payload) => { setUnreadNotiCount(prev => prev + 1); }).subscribe();
    return () => supabase.removeChannel(channel);
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

  return (
    <div className="h-full overflow-y-auto bg-slate-100 dark:bg-black text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <header className="px-3 md:px-6 py-2 border-b border-slate-300 dark:border-emerald-700/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 h-14 flex flex-col justify-center">
         <div className="flex items-center justify-between gap-2 w-full">  
            <div className="flex items-center gap-1.5 overflow-hidden">
                <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-800 dark:text-white transition-colors shrink-0">
                    <div className="scale-90"><MenuIcon /></div>
                </button>
                
                {userProfile?.email === 'koritros619@gmail.com' && (
                    <button onClick={() => setIsAdminOpen(true)} className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-500/20 transition-all animate-pulse font-bold text-[10px] md:text-xs shrink-0">
                        <div className="scale-75"><CrownIcon /></div> <span className="hidden md:inline">ADMIN</span>
                    </button>
                )}

                <h1 className="text-lg md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 bg-clip-text text-transparent truncate pt-0.5">
                    Marketplace
                </h1>
            </div>
            
            <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
                <Link to="/">
                    <Button className="!px-2 md:!px-4 bg-gradient-to-r from-rose-500 to-orange-600 text-white border-none shadow-md hover:shadow-lg hover:from-rose-400 hover:to-orange-500 ring-2 ring-offset-2 ring-rose-500/50 dark:ring-offset-slate-900">
                        <HomeIcon /> 
                        <span className="hidden md:inline ml-1">Home</span>
                    </Button>
                </Link>

                <Link to="/public-decks">
                    <Button
                        as="span"
                        className="!px-2 md:!px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg hover:from-blue-400 hover:to-purple-500"
                    >
                        <UsersIcon />{" "}
                        <span className="hidden md:inline">Public</span>
                    </Button>
                </Link>

                <NotificationCenter userEmail={userProfile?.email} />

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
            <button 
                onClick={() => setActiveTab('my-auctions')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'my-auctions' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                <PackageIcon /> <span className="hidden sm:inline">สินค้าที่ลงประมูล</span><span className="inline sm:hidden">รายการที่เคยประมูล</span>
            </button>      

        </div>
      </div>

      {/* Content */}
      <main className="flex-grow p-0 md:p-8 w-full"> {/* 🟢 [แก้ไข]: p-0 สำหรับ Mobile Flush */}
        {activeTab === 'my-auctions' && (
            <div className="animate-fade-in w-full">
                <div className="flex justify-between items-center mb-6 px-4"><h2 className="text-2xl font-bold flex items-center gap-2"><span className="text-blue-500">📦</span> สินค้าของฉัน</h2><span className="text-sm text-slate-500">{myAuctions.length} รายการ</span></div>
                {(!userProfile) ? (<div className="text-center py-20 text-slate-500 w-full">กรุณาเข้าสู่ระบบเพื่อดูรายการสินค้าของคุณ</div>) : myAuctions.length === 0 ? (<div className="text-center py-20 text-slate-500 w-full">คุณยังไม่ได้ลงประมูลสินค้าใดๆ</div>) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 w-full px-4">
                        {myAuctions.map(item => {
                            const isEnded = new Date(item.end_time) < new Date();
                            const isCancelled = item.status === 'cancelled';
                            
                            // 🟢 [แก้ไข] ประกาศตัวแปรที่ขาดหายไป
                            const sellerScore = userReputation[item.seller_email]?.total_score || 0; 
                            const winnerConfirmed = isEnded && item.winner_email && item.seller_confirmed;
                            const buyerConfirmed = isEnded && item.winner_email && item.winner_confirmed;

                            const canConfirm = isEnded && item.winner_email && !isCancelled && (
                                (item.seller_email === userProfile.email && !item.seller_confirmed) || 
                                (item.winner_email === userProfile.email && !item.winner_confirmed)   
                            );
                            // ------------------------------------

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
                                        {/* 🟢 แสดง Score ผู้ขาย */}
                                        <div className="flex justify-between items-center mb-2"><p className="text-[10px] text-slate-500">ผู้ขาย: {item.seller_name}</p><RatingBadge score={sellerScore} penaltyLevel={userReputation[item.seller_email]?.penalty_level} /></div>
                                        <h3 className="font-bold text-sm truncate mb-1">{item.card_name}</h3>
                                        {/* 🟢 ปุ่ม Confirm Transaction (แสดงเมื่อจบประมูล) */}
                                        {canConfirm && (
                                            <button 
                                                onClick={() => setConfirmTransaction({ auction: item })}
                                                className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg shadow transition-all hover:bg-blue-500 mt-2"
                                            >
                                                ยืนยันธุรกรรม / ให้คะแนน
                                            </button>
                                        )}
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
            <div className="animate-fade-in w-full md:px-8">
                <div className="flex justify-between items-center mb-6 px-4 md:px-0"> {/* เพิ่ม px-4 สำหรับ Header ของ Grid */}
                    <h2 className="text-xl font-black flex items-center gap-3 text-slate-800 dark:text-white">
                        <span className="text-xl"></span>
                    </h2>
                    <button 
                        onClick={() => setIsCompletedModalOpen(true)} 
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-0 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400 transition-all shadow-sm"
                    >
                        <HistoryIcon /> <span>ประวัติการประมูล</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"> {/* 🟢 [แก้ไข]: ลบ px-4 เพื่อให้ Flush */}
                    {auctions.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 text-slate-400 opacity-50">
                            <GavelIcon className="w-16 h-16 mb-4" />
                            <p className="text-xl font-bold">ยังไม่มีการประมูลขณะนี้...</p>
                        </div>
                    ) : auctions.map(item => {
                        const sellerScore = userReputation[item.seller_email]?.total_score || 0;
                        const sellerPenalty = userReputation[item.seller_email]?.penalty_level || 'Normal';
                        return (
                            <div key={item.id} 
                                 className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col"
                                 onClick={() => setChatAuction(item)}
                            >
                                {/* รูปภาพ (ปรับ Padding: p-1) */}
                                <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/30 dark:to-black/40 opacity-50"></div>
                                    
                                    {/* 🟢 [สำคัญ] ขยายรูปภาพให้เต็มกรอบ (object-cover) */}
                                    <img 
                                        src={getCardImageUrl(item.card_image_path, item.card_id)} 
                                        className="w-full h-full object-cover drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110 z-10" 
                                        onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} 
                                    />
                                    
                                    {/* 🟢 [แก้ไข 1]: ปุ่ม History (มุมซ้ายบน) */}
                                    <button onClick={(e) => { e.stopPropagation(); setHistoryAuction(item); }} 
                                        className="absolute top-2 left-2 p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full shadow-lg backdrop-blur-md transition-all z-20 border border-white/10" 
                                        title="ประวัติการบิด"
                                    >
                                        <div className="scale-75"><HistoryIcon /></div>
                                    </button>

                                    {/* 🟢 [แก้ไข 1]: ปุ่ม Admin Cancel (ถัดจาก History) */}
                                    {userProfile?.email === 'koritros619@gmail.com' && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleCancel(item.id); }} 
                                            className="absolute top-2 left-12 p-1.5 bg-red-600/90 text-white rounded-full shadow-lg hover:bg-red-700 z-20 transition-transform hover:scale-110" 
                                            title="Admin Force Cancel"
                                        >
                                            <div className="scale-75"><TrashIcon /></div>
                                        </button>
                                    )}
                                </div>
                                
                                {/* 📝 ส่วนข้อมูล (ปรับสเกล) */}
                                <div className="p-3 md:p-4 flex-1 flex flex-col">
    <div className="flex justify-between items-center mb-1 border-b border-slate-100 dark:border-slate-800 pb-1">
        {/* แสดง Score ผู้ขาย */}
        <p className="text-[10px] text-slate-500 truncate">ผู้ขาย: {item.seller_name}</p>
        <RatingBadge score={sellerScore} penaltyLevel={userReputation[item.seller_email]?.penalty_level} />
        
        {userProfile?.email !== item.seller_email && (
            <button onClick={(e) => { e.stopPropagation(); setReportTarget({ targetUser: { email: item.seller_email, name: item.seller_name }, context: { type: 'auction', id: item.id } }); }} className="text-slate-300 hover:text-red-500 transition-colors shrink-0" title="แจ้งรายงาน"><div className="scale-75"><FlagIcon /></div></button>
        )}
    </div>

    {/* 🟢 [แก้ไข 2]: ตัวนับเวลาอยู่ใต้ชื่อการ์ด (ย้าย TimeLeft ลงมาบรรทัดนี้) */}
    <div className="flex justify-center items-center mb-2">
        
        {/* 🟢 [วาง TimeLeft ตรงนี้] (จัดกลาง) */}
        <div className="shrink-0 scale-130">
            <TimeLeft endTime={item.end_time} />
        </div>
    </div>
    
    {/* 🟢 [เพิ่มชื่อการ์ดกลับมา แต่ให้แสดงผลอยู่ต่ำกว่าตัวนับเวลา] */}
    <h3 className="font-black text-base md:text-xl text-slate-900 dark:text-white leading-tight line-clamp-1 mb-2 text-center">
        {item.card_name}
    </h3>


    {/* 🟢 กล่องราคา: ลด Padding และขนาดตัวอักษร */}
    <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center mb-2">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Current Bid</p>
        
        <div className="flex items-baseline justify-center my-0.5 leading-none">
            {/* ฿ ตัวใหญ่ (ลดขนาด) */}
            <span className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 mr-1">฿</span>
            {/* ตัวเลข (ลดขนาด) */}
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none">
                {item.current_price.toLocaleString()}
            </span>
        </div>

        {item.winner_name && (
            <div className="flex items-center justify-center gap-1 text-[10px] text-amber-500 bg-amber-500/10 rounded-full px-2 py-0.5 w-fit mx-auto">
                <span>👑</span> <span className="truncate max-w-[80px]">{item.winner_name}</span>
            </div>
        )}
    </div>

    {/* 🟢 ปุ่มสู้ราคา: ลดความสูงและขนาดตัวอักษร */}
    <button 
        onClick={(e) => { e.stopPropagation(); handleBid(item); }}
        className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-sm font-bold rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1"
    >
        <GavelIcon /> สู้ราคา!
    </button>
</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {activeTab === 'market' && (
            <div className="animate-fade-in text-center py-20 w-full">
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
      <CompletedAuctionsModal isOpen={isCompletedModalOpen} onClose={() => setIsCompletedModalOpen(false)} userProfile={userProfile} />
      <AdminDashboardModal 
  isOpen={isAdminOpen} 
  onClose={() => setIsAdminOpen(false)} // ต้องมีฟังก์ชันที่ตั้งค่า state 'isAdminOpen' เป็น false
  adminEmail={userProfile?.email} 
/><ReportModal 
        isOpen={!!reportTarget} 
        onClose={() => setReportTarget(null)} 
        reporterEmail={userProfile?.email}
        targetUser={reportTarget?.targetUser}
        context={reportTarget?.context}
      />
      <ManageBiddersModal isOpen={!!manageAuction} onClose={() => setManageAuction(null)} auction={manageAuction} userProfile={userProfile} />
      <AuctionRoomModal isOpen={!!chatAuction} onClose={() => setChatAuction(null)} auction={chatAuction} userProfile={displayUser} onBid={handleBid} />
    {/* 🟢 [ใหม่] Modal ยืนยันธุรกรรม */}
      <ConfirmTransactionModal 
        isOpen={!!confirmTransaction}
        onClose={() => setConfirmTransaction(null)}
        auction={confirmTransaction?.auction}
        userProfile={userProfile}
        fetchReputations={fetchReputations}
      /> 
    </div>
  );
}