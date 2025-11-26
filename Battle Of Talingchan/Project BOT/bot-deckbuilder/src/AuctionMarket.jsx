import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 🟢 รวม Import ไว้บรรทัดเดียว
import { createPortal } from "react-dom";
import { googleLogout } from '@react-oauth/google';
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import AdminDashboardModal from './AdminDashboardModal';
import ReportModal from './ReportModal';
import NotificationCenter from './NotificationCenter';

// --- Imported Components ---
import SettingsDrawer from './components/SettingsDrawer';
import ProfileSetupModal from './components/ProfileSetupModal';
import RatingBadge from './components/RatingBadge';
import DeckListModal from './components/DeckListModal';
import { 
    MenuIcon, GavelIcon, ShoppingBagIcon, UserCogIcon, 
    CloseIcon, SunIcon, MoonIcon, HistoryIcon, 
    PackageIcon, BanIcon, CrownIcon, FlagIcon, 
    ShieldCheckIcon, ChatBubbleIcon, SendIcon, 
    TrashIcon, UsersIcon, DeckIcon, StoreIcon, 
    HomeIcon, MessageIcon, NeonLightningIcon, 
    ImageIcon, ArchiveIcon,
    ChevronLeftIcon
} from './components/Icons';

// === Helper Functions ===
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
const getCardImageUrl = (cardImagePath, cardId) => {
    if (!cardImagePath || !cardId) return '';
    const fileId = cardId.replace(' - Only#1', '');
    return `/cards/${encodePath(cardImagePath)}/${encodeURIComponent(fileId)}.png`;
};

// Custom Hook สำหรับ LocalStorage
function useLocalStorage(key, initial) { 
    const [v, s] = useState(() => { 
        try { 
            const raw = localStorage.getItem(key); 
            return raw ? JSON.parse(raw) : initial; 
        } catch { return initial; } 
    }); 
    useEffect(() => { 
        try { localStorage.setItem(key, JSON.stringify(v)); } catch {} 
    }, [key, v]); 
    return [v, s]; 
}

// === UI Components ===
const Button = ({ className = "", children, ...props }) => (
    <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-300/20 dark:border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 dark:hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`} {...props}>
      {children}
    </button>
);

// === Digital Clock TimeLeft Component ===
const TimeLeft = ({ endTime }) => {
    const [diff, setDiff] = useState(new Date(endTime) - new Date());
    
    useEffect(() => {
        const timer = setInterval(() => setDiff(new Date(endTime) - new Date()), 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    if (diff <= 0) return (
        <div className="px-3 py-1 bg-red-600/90 backdrop-blur text-white text-xs font-bold rounded-lg shadow-lg border border-red-400 animate-pulse">
            ENDED
        </div>
    );

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const textColor = "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]";

    return (
        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md border border-slate-700 rounded-lg px-2 py-1 shadow-xl">
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

// === Auction Room Modal ===
const AuctionRoomModal = ({ isOpen, onClose, auction, userProfile, onBid, onBuyNow }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showDesc, setShowDesc] = useState(false);
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

    // เช็คสถานะจบ
    const isEnded = auction.status !== 'active' || new Date(auction.end_time) < new Date();

    return createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[700] p-0 md:p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border-0 md:border border-slate-200 dark:border-emerald-500/30 rounded-none md:rounded-xl shadow-2xl w-full h-full md:h-[90vh] max-w-6xl flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* 🖼️ ส่วนซ้าย: รูปภาพ */}
                <div className="w-full md:w-2/3 h-[50vh] md:h-full flex flex-col bg-slate-100 dark:bg-slate-950 relative">
                    <button onClick={onClose} className="absolute top-4 left-4 z-20 bg-black/50 text-white p-2 rounded-full md:hidden hover:bg-red-500 transition-colors"><ChevronLeftIcon /></button>
                    
                    <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
                        <img 
                            src={getCardImageUrl(auction.card_image_path, auction.card_id)} 
                            className="max-w-full max-h-full object-contain drop-shadow-2xl" 
                            onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }}
                        />
                        <div className="absolute top-4 right-4 z-10">
                            <TimeLeft endTime={auction.end_time} />
                        </div>

                        {auction.description && (
                            <button 
                                onClick={() => setShowDesc(true)}
                                className="absolute bottom-4 left-4 z-20 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-full text-xs backdrop-blur-md flex items-center gap-1 transition-all border border-white/20"
                            >
                                <span className="text-lg">📝</span> อ่านรายละเอียด
                            </button>
                        )}

                        {showDesc && (
                            <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in" onClick={() => setShowDesc(false)}>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-slate-700 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                                    <h3 className="font-bold text-lg mb-4 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">รายละเอียดสินค้า</h3>
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                                        {auction.description}
                                    </p>
                                    <button onClick={() => setShowDesc(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><CloseIcon/></button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-emerald-500/20 flex items-center gap-4 shrink-0">
                        <div className="flex-grow min-w-0 flex flex-col justify-center">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 truncate">{auction.card_name}</h2>
                            </div>
                            <p className="text-xs text-slate-500">Seller: {auction.seller_name}</p>
                            {auction.winner_name && (
                                <p className="text-sm font-bold text-amber-500 mt-1">
                                    👑 Highest: <span className="text-slate-900 dark:text-white">{auction.winner_name}</span>
                                </p>
                            )}
                        </div>

                        <div className="flex-grow min-w-0 flex flex-col items-center justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                    {isEnded ? 'SOLD PRICE' : 'CURRENT BID'}
                                </span>
                                <div className="flex items-baseline leading-none">
                                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mr-1">฿</span>
                                    <span className="text-3xl md:text-4xl font-black font-mono text-slate-900 dark:text-white">{auction.current_price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Buttons Group */}
                        {userProfile?.email !== auction.seller_email && !isEnded && (
                            <div className="flex gap-2">
                                {auction.buy_now_price > 0 && (
                                    <div className="flex flex-col items-center">
                                        <button 
                                            onClick={() => onBuyNow(auction)} 
                                            className="px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform active:scale-95 flex flex-col items-center justify-center leading-none min-w-[80px]"
                                            title={`ราคาซื้อทันที: ${auction.buy_now_price.toLocaleString()} บาท`}
                                        >
                                            <span className="text-[10px] opacity-90 mb-0.5">BUY NOW</span>
                                            <span className="text-sm">฿{auction.buy_now_price.toLocaleString()}</span>
                                        </button>
                                    </div>
                                )}

                                <button 
                                    onClick={() => onBid(auction)} 
                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform active:scale-95 flex items-center gap-2"
                                >
                                    <GavelIcon /> <span className="hidden md:inline">Bid</span>
                                </button>
                            </div>
                        )}

                        {isEnded && (
                            <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-lg text-sm font-bold">
                                ปิดประมูลแล้ว
                            </div>
                        )}
                    </div>
                </div>

                {/* 💬 ส่วนขวา: ห้องแชท */}
                <div className="w-full md:w-1/3 h-[50vh] md:h-full flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-0">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><ChatBubbleIcon /> Live Chat</h3>
                        <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-red-500"><CloseIcon /></button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 min-h-0">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2"><span className="text-4xl opacity-20">💬</span><p>เริ่มการสนทนาได้เลย...</p></div>
                        ) : messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-2 ${msg.user_email === userProfile?.email ? 'flex-row-reverse' : ''}`}>
                                <img src={msg.user_picture} className="w-8 h-8 rounded-full bg-slate-700 object-cover shrink-0" />
                                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.user_email === userProfile?.email ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none'}`}>
                                    <p className="text-[10px] opacity-70 mb-0.5">{msg.user_name}</p><p>{msg.message}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-2 shrink-0">
                        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={userProfile ? "พิมพ์ข้อความ..." : "กรุณา Login"} disabled={!userProfile} className="flex-grow bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
                        <button type="submit" disabled={!newMessage.trim() || !userProfile} className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 disabled:opacity-50 transition-colors"><SendIcon /></button>
                    </form>
                </div>

            </div>
        </div>, document.body
    );
};

// === Bid History Modal ===
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

// === Confirm Transaction Modal ===
const ConfirmTransactionModal = ({ isOpen, onClose, auction, userProfile, fetchReputations }) => {
    const [action, setAction] = useState('good');
    const [reason, setReason] = useState('transaction_success');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !auction || !userProfile) return null;

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
            fetchReputations();
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

// === Completed Auctions Modal ===
const CompletedAuctionsModal = ({ isOpen, onClose, userProfile }) => {
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

    const handleDeleteHistory = async (id) => {
        if(!confirm("⚠️ ยืนยันลบประวัติรายการนี้ถาวร?")) return;
        
        const { data, error } = await supabase.rpc('admin_force_delete', { 
            p_admin_email: userProfile?.email, 
            p_target_input: id, 
            p_action_type: 'delete_auction' 
        });

        if(error) alert("Error: " + error.message);
        else {
            setItems(prev => prev.filter(item => item.id !== id));
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[600] p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
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

// === Main Component ===
export default function AuctionMarket() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('auction');
  const [auctions, setAuctions] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  const location = useLocation(); // 🟢 1. เพิ่มตัวแปร location เพื่อดึง URL

  // 🟢 2. Logic ตรวจ In-App Browser (LINE/FB)
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = /(Line|FBAN|FBAV|Instagram|Messenger)/i.test(ua);
    if (isInApp) {
      navigate('/open-browser', { replace: true });
    }
  }, [location, navigate]);
  
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

  // 🟢 [NEW] State สำหรับระบบกรองและค้นหา
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ending_soon"); // ending_soon, price_asc, price_desc
  const [filterStatus, setFilterStatus] = useState("all");     // all, active_bid, no_bid

  // 🟢 [ใหม่] State สำหรับจัดการ Deck
  const [isDeckListModalOpen, setIsDeckListModalOpen] = useState(false);

  const [userDecks, setUserDecks] = useLocalStorage("bot-userDecks-v1", {});
  const [mainDeck, setMainDeck] = useLocalStorage("bot-mainDeck-v32-final", []);
  const [lifeDeck, setLifeDeck] = useLocalStorage("bot-lifeDeck-v32-final", []);
  const [cardDb] = useLocalStorage("bot-cardDb-v32-final", []); // โหลดการ์ดทั้งหมดมาเพื่อใช้ Decode Deck

  const [userReputation, setUserReputation] = useState({});
  const [confirmTransaction, setConfirmTransaction] = useState(null);

  const fetchReputations = async () => {
      const { data } = await supabase.from('user_stats').select('user_email, total_score, penalty_level');
      const map = {};
      data?.forEach(u => map[u.user_email] = u);
      setUserReputation(map);
  };

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

  // 🟢 [NEW] Logic การกรองและเรียงลำดับ (ใช้ useMemo เพื่อประสิทธิภาพ)
  const filteredAuctions = useMemo(() => {
    return auctions
      .filter(item => {
        // 1. กรองตามชื่อ
        const matchName = item.card_name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 2. กรองตามสถานะ (เดือด/ซิง)
        let matchStatus = true;
        if (filterStatus === 'active_bid') {
           // ราคาปัจจุบัน > ราคาเริ่ม = มีคนบิดแล้ว (เดือด)
           matchStatus = item.current_price > item.start_price;
        } else if (filterStatus === 'no_bid') {
           // ราคาเท่าเดิม = ยังไม่มีใครเปิด (ซิง)
           matchStatus = item.current_price === item.start_price;
        }

        return matchName && matchStatus;
      })
      .sort((a, b) => {
        // 3. เรียงลำดับ
        if (sortOption === 'price_asc') return a.current_price - b.current_price; // ราคา ต่ำ->สูง
        if (sortOption === 'price_desc') return b.current_price - a.current_price; // ราคา สูง->ต่ำ
        // Default: เวลาเหลือน้อยขึ้นก่อน (ending_soon)
        return new Date(a.end_time) - new Date(b.end_time);
      });
  }, [auctions, searchTerm, sortOption, filterStatus]);

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
    fetchReputations();
  }, []);

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
    
    // 🟢 [แก้ไข] ดึงทั้ง "รายการที่ขาย" และ "รายการที่ชนะ"
    const { data } = await supabase
        .from('auctions')
        .select('*')
        .or(`seller_email.eq.${userProfile.email},winner_email.eq.${userProfile.email}`);
        
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

  async function handleBuyNow(auction) {
    if (!userProfile) return alert("กรุณา Login ก่อนครับ");
    if (userProfile.email === auction.seller_email) return alert("ซื้อของตัวเองไม่ได้ครับ");

    if (!confirm(`⚡ ยืนยันการซื้อทันที (Buy Now)?\n\n💰 ราคา: ${auction.buy_now_price.toLocaleString()} บาท\n\n(การประมูลจะจบลงทันทีและคุณจะเป็นผู้ชนะ)`)) return;

    const { data, error } = await supabase.rpc('buy_now_auction', {
      p_auction_id: auction.id,
      p_buyer_email: userProfile.email,
      p_buyer_name: displayUser.name,
      p_amount: auction.buy_now_price
    });

    if (error) {
       alert("Error: " + error.message);
    } else if (!data.success) {
       alert(data.message);
    } else {
       alert("🎉 ยินดีด้วย! คุณชนะการประมูลด้วยระบบ Buy Now");
       setChatAuction(null); // ปิดหน้าต่าง
       fetchAuctions(); // รีโหลดข้อมูล
    }
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

  async function handleDeleteMyAuction(auctionId) {
    if (!confirm("⚠️ ยืนยันการลบรายการนี้ออกจากประวัติของคุณ?\n(การกระทำนี้จะลบข้อมูลออกจากระบบอย่างถาวร)")) return;

    const { error } = await supabase.from('auctions').delete().eq('id', auctionId);

    if (error) {
      alert("ไม่สามารถลบได้ (อาจมีข้อมูลการบิดที่เชื่อมโยงอยู่): " + error.message);
    } else {
      setMyAuctions(prev => prev.filter(item => item.id !== auctionId));
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
      <main className="flex-grow p-0 md:p-8 w-full pb-40 min-h-[120vh]">
        {activeTab === 'my-auctions' && (
            <div className="animate-fade-in w-full">
                <div className="flex justify-between items-center mb-6 px-4"><h2 className="text-2xl font-bold flex items-center gap-2"><span className="text-blue-500">📦</span> สินค้าของฉัน</h2><span className="text-sm text-slate-500">{myAuctions.length} รายการ</span></div>
                {(!userProfile) ? (<div className="text-center py-20 text-slate-500 w-full">กรุณาเข้าสู่ระบบเพื่อดูรายการสินค้าของคุณ</div>) : myAuctions.length === 0 ? (<div className="text-center py-20 text-slate-500 w-full">คุณยังไม่ได้ลงประมูลสินค้าใดๆ</div>) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 w-full px-4">
                        {myAuctions.map(item => {
                            const isEnded = new Date(item.end_time) < new Date();
                            const isCancelled = item.status === 'cancelled';
                            const sellerScore = userReputation[item.seller_email]?.total_score || 0; 
                            const winnerConfirmed = isEnded && item.winner_email && item.seller_confirmed;
                            const buyerConfirmed = isEnded && item.winner_email && item.winner_confirmed;

                            const canConfirm = isEnded && item.winner_email && !isCancelled && (
                                (item.seller_email === userProfile.email && !item.seller_confirmed) || 
                                (item.winner_email === userProfile.email && !item.winner_confirmed)   
                            );

                            return (
                                <div key={item.id} 
                                     className={`bg-white dark:bg-slate-900 border ${!isEnded && !isCancelled ? 'border-blue-400 dark:border-blue-500/50' : 'border-slate-200 dark:border-slate-700 opacity-70'} rounded-xl shadow-lg overflow-hidden flex flex-col hover:border-blue-400 transition-all group relative cursor-pointer`}
                                     onClick={() => setChatAuction(item)}
                                >
                                    <div className="aspect-[5/7] bg-slate-200 dark:bg-slate-800 relative">
                                        <img src={getCardImageUrl(item.card_image_path, item.card_id)} className="w-full h-full object-contain p-2" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                                        
                                        {/* 🟢 [แก้ไข] ป้ายสถานะ (Badge) */}
                                        <div className={`
                                            absolute top-2 right-2 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm border font-bold shadow-sm
                                            ${isCancelled 
                                                ? 'bg-red-600/90 border-red-400' 
                                                : !isEnded 
                                                    ? 'bg-blue-600/90 border-blue-400' 
                                                    : (item.winner_email === userProfile.email && item.seller_email !== userProfile.email) // ถ้าจบแล้ว + เราชนะ + ไม่ใช่ของตัวเอง
                                                        ? 'bg-emerald-500/90 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)] text-white' // สีเขียวอ่อนมีแสง
                                                        : 'bg-slate-600/90 border-slate-500' // จบปกติ/ขายออก
                                            }
                                        `}>
                                            {isCancelled 
                                                ? 'ยกเลิกแล้ว' 
                                                : !isEnded 
                                                    ? 'กำลังประมูล' 
                                                    : (item.winner_email === userProfile.email && item.seller_email !== userProfile.email)
                                                        ? '🎉 ประมูลชนะ' 
                                                        : 'จบแล้ว'
                                            }
                                        </div>

                                        <button onClick={(e) => { e.stopPropagation(); setHistoryAuction(item); }} className="absolute top-2 left-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-1.5 rounded-full transition-colors"><div className="scale-75"><HistoryIcon /></div></button>
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col">
                                        <div className="flex justify-between items-center mb-2"><p className="text-[10px] text-slate-500">ผู้ขาย: {item.seller_name}</p><RatingBadge score={sellerScore} /></div>
                                        <h3 className="font-bold text-sm truncate mb-1">{item.card_name}</h3>
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
                                        
                                        {/* 🟢 FIXED: Correct button logic */}
                                        {item.status === 'active' ? (
                                            <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                                <button 
                                                    onClick={() => handleCancel(item.id)}
                                                    className="w-full py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <BanIcon /> ยกเลิกการประมูล
                                                </button>

                                                <button 
                                                    onClick={() => setManageAuction(item)}
                                                    className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <ShieldCheckIcon /> จัดการผู้บิด
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteMyAuction(item.id); }}
                                                className="mt-2 w-full py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-1"
                                                title="ลบออกจากรายการ"
                                            >
                                                <TrashIcon /> ลบประวัติ
                                            </button>
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
                
                {/* 🟢 [NEW] Integrated Toolbar (Search + Filter + History + Start Auction) */}
                <div className="mt-4 mb-6 flex flex-col md:flex-row gap-2 md:items-center bg-white dark:bg-slate-900/50 p-2 md:p-3 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-sm mx-4 md:mx-0">
                    
                    {/* 1. Search Bar (Left Side - Grow) */}
                    <div className="relative flex-grow w-full md:w-auto">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="ค้นหาชื่อการ์ด..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                        />
                    </div>

                    {/* 2. Action Group (Right Side - Sort, Filter, History) */}
                    <div className="flex gap-2 items-center overflow-x-auto pb-1 md:pb-0 no-scrollbar shrink-0">
                        
                        {/* Sort Dropdown */}
                        <select 
                            value={sortOption} 
                            onChange={(e) => setSortOption(e.target.value)}
                            className="px-2 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        >
                            <option value="ending_soon">⏳ เวลา</option>
                            <option value="price_asc">💰 ถูก➜แพง</option>
                            <option value="price_desc">💎 แพง➜ถูก</option>
                        </select>

                        {/* Filter Buttons */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
                            <button onClick={() => setFilterStatus('all')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all ${filterStatus === 'all' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>รวม</button>
                            <button onClick={() => setFilterStatus('active_bid')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all ${filterStatus === 'active_bid' ? 'bg-white dark:bg-slate-600 shadow text-red-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>เดือด</button>
                            <button onClick={() => setFilterStatus('no_bid')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all ${filterStatus === 'no_bid' ? 'bg-white dark:bg-slate-600 shadow text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>ซิง</button>
                        </div>

                        {/* Separator */}
                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                        {/* 🟢 ปุ่มเริ่มประมูล (เพิ่มใหม่ ตรงนี้ครับ) */}
                        <button 
                            onClick={() => navigate('/', { state: { showAuctionTutorial: true } })} 
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-emerald-500/30 transition-all active:scale-95 whitespace-nowrap"
                        >
                            <span className="text-lg leading-none mb-0.5">+</span> เริ่ม
                        </button>

                        {/* History Button (Compact) */}
                        <button 
                            onClick={() => setIsCompletedModalOpen(true)} 
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-all whitespace-nowrap"
                            title="ดูประวัติการประมูลที่จบแล้ว"
                        >
                            <HistoryIcon /> 
                            <span className="hidden sm:inline">ประวัติ</span>
                        </button>
                    </div>
                </div>

                {/* 🟢 Grid Layout (Updated with filteredAuctions) */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                    {filteredAuctions.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-32 text-slate-400 opacity-50">
                            <GavelIcon className="w-16 h-16 mb-4" />
                            <p className="text-xl font-bold">ไม่พบสินค้าตามเงื่อนไข...</p>
                        </div>
                    ) : filteredAuctions.map(item => {
                        const sellerScore = userReputation[item.seller_email]?.total_score || 0;
                        
                        return (
                            <div key={item.id} 
                                 className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col"
                                 onClick={() => setChatAuction(item)}
                            >
                                {/* === Image Section === */}
                                <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-60"></div>
                                    
                                    <img 
                                        src={getCardImageUrl(item.card_image_path, item.card_id)} 
                                        className="w-full h-full object-cover drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110 z-10" 
                                        onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} 
                                    />
                                    
                                    <button onClick={(e) => { e.stopPropagation(); setHistoryAuction(item); }} 
                                        className="absolute top-2 left-2 p-1.5 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-all z-20 border border-white/20" 
                                    >
                                        <div className="scale-75"><HistoryIcon /></div>
                                    </button>

                                    {userProfile?.email === 'koritros619@gmail.com' && (
                                        <button onClick={(e) => { e.stopPropagation(); handleCancel(item.id); }} className="absolute top-2 left-10 p-1.5 bg-red-600/90 text-white rounded-full z-20 scale-90"><TrashIcon /></button>
                                    )}

                                    {/* 📱 Mobile Badge */}
                                    {item.description && (
                                        <div className="md:hidden absolute bottom-2 left-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                                            <span className="text-xs">📝</span>
                                            <span className="text-[10px] text-white font-bold">มีรายละเอียด</span>
                                        </div>
                                    )}

                                    {/* 💻 PC Hover Overlay */}
                                    {item.description && (
                                        <div className="hidden md:flex absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col items-center justify-center p-6 text-center">
                                            <h4 className="text-emerald-400 font-bold text-sm mb-2 uppercase tracking-widest border-b border-emerald-500/30 pb-1 w-full">
                                                รายละเอียดสินค้า
                                            </h4>
                                            <div className="overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                                                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* === Info Section === */}
                                <div className="p-3 flex-1 flex flex-col gap-1">
                                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-1 mb-1">
                                        <div className="flex items-center gap-1 min-w-0">
                                            <p className="text-[10px] text-slate-500">Seller:</p>
                                            <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[80px]">{item.seller_name}</p>
                                        </div>
                                        <div onClick={e => e.stopPropagation()}>
                                            <RatingBadge score={sellerScore} />
                                        </div>
                                    </div>

                                    <div className="flex justify-center mb-1">
                                        <div className="scale-90 origin-center"><TimeLeft endTime={item.end_time} /></div>
                                    </div>
                                    
                                    <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white leading-tight line-clamp-1 text-center mb-1">
                                        {item.card_name}
                                    </h3>

                                    <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center relative group-hover:border-amber-400/50 transition-colors">
                                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Current Bid</p>
                                        <div className="flex items-baseline justify-center leading-none">
                                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mr-0.5">฿</span>
                                            <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{item.current_price.toLocaleString()}</span>
                                        </div>
                                        {item.winner_name && (
                                            <div className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-amber-500 rounded-full text-[10px] shadow-sm animate-bounce" title={`นำโดย: ${item.winner_name}`}>👑</div>
                                        )}
                                    </div>

                                    {/* 🟢 [Action Buttons with Buy Now] */}
                                    <div className="mt-2 flex gap-2">
                                        {item.buy_now_price > 0 && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleBuyNow(item); }}
                                                className="flex-1 py-2 bg-yellow-500/10 hover:bg-yellow-500/30 dark:bg-yellow-400/10 dark:hover:bg-yellow-400/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/50 hover:border-yellow-400 rounded-xl font-bold text-[10px] md:text-xs transition-all duration-300 flex flex-col items-center justify-center leading-none shadow-[0_0_5px_rgba(250,204,21,0.2)] hover:shadow-[0_0_15px_rgba(250,204,21,0.6)] group/buy"
                                            >
                                                <div className="flex items-center gap-1">
                                                    <NeonLightningIcon className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/buy:scale-110 transition-transform" />
                                                    <span className="uppercase">Buy</span>
                                                </div>
                                                <span className="text-[10px] md:text-[11px] font-medium opacity-90">฿{item.buy_now_price.toLocaleString()}</span>
                                            </button>
                                        )}

                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleBid(item); }}
                                            className={`py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs md:text-sm font-bold rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-1 ${item.buy_now_price > 0 ? 'flex-1' : 'w-full'}`}
                                        >
                                            <GavelIcon /> 
                                            <span>Bid</span>
                                        </button>
                                    </div>
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
        userStats={userReputation[userProfile?.email]}
        onOpenMyDecks={() => setIsDeckListModalOpen(true)}
      />
      <ProfileSetupModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userProfile={userProfile} onSave={handleSaveProfile} />
      <BidHistoryModal isOpen={!!historyAuction} onClose={() => setHistoryAuction(null)} auction={historyAuction} />
      <CompletedAuctionsModal isOpen={isCompletedModalOpen} onClose={() => setIsCompletedModalOpen(false)} userProfile={userProfile} />
      <AdminDashboardModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        adminEmail={userProfile?.email} 
      />
      <ReportModal 
        isOpen={!!reportTarget} 
        onClose={() => setReportTarget(null)} 
        reporterEmail={userProfile?.email}
        targetUser={reportTarget?.targetUser}
        context={reportTarget?.context}
      />
      <ManageBiddersModal isOpen={!!manageAuction} onClose={() => setManageAuction(null)} auction={manageAuction} userProfile={userProfile} />
      <AuctionRoomModal 
          isOpen={!!chatAuction} 
          onClose={() => setChatAuction(null)} 
          auction={chatAuction} 
          userProfile={displayUser} 
          onBid={handleBid} 
          onBuyNow={handleBuyNow} 
      />
      <ConfirmTransactionModal 
        isOpen={!!confirmTransaction}
        onClose={() => setConfirmTransaction(null)}
        auction={confirmTransaction?.auction}
        userProfile={userProfile}
        fetchReputations={fetchReputations}
        onBuyNow={handleBuyNow}
      />
      {/* 🟢 [ใหม่] Modal จัดการเด็ค */}
      <DeckListModal
        isOpen={isDeckListModalOpen}
        onClose={() => setIsDeckListModalOpen(false)}
        userProfile={displayUser}
        userDecks={userDecks}
        setUserDecks={setUserDecks}
        mainDeck={mainDeck}
        lifeDeck={lifeDeck}
        setMainDeck={setMainDeck}
        setLifeDeck={setLifeDeck}
        cardDb={cardDb}
      />
    </div> // <-- ปิด div หลัก
  );
}