import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { createPortal } from "react-dom";
import { googleLogout } from '@react-oauth/google';
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// --- Local Modals ---
import AdminDashboardModal from './AdminDashboardModal';
import ReportModal from './ReportModal';
import NotificationCenter from './NotificationCenter';
import ChatWidget from './ChatWidget';
import FeedbackModal from './components/FeedbackModal';
import CreateBulkAuctionModal from './CreateBulkAuctionModal'; 

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
    ChevronLeftIcon,
    ChevronRightIcon, 
    UserPlusIcon,
    EyeIcon,
    ExpandIcon 
} from './components/Icons';

// === Helper Functions ===
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';

const getAuctionThumbnail = (item) => {
    if (item.card_image_path === 'CUSTOM_ITEM') {
        try {
            const images = JSON.parse(item.proof_image);
            return images[0] || 'https://placehold.co/300x420/1e293b/ffffff?text=No+Image';
        } catch {
            return 'https://placehold.co/300x420/1e293b/ffffff?text=Error';
        }
    }
    if (!item.card_image_path || !item.card_id) return '';
    const fileId = item.card_id.replace(' - Only#1', '');
    return `/cards/${encodePath(item.card_image_path)}/${encodeURIComponent(fileId)}.png`;
};

const getCardImageUrl = (cardImagePath, cardId) => {
    if (!cardImagePath || !cardId) return '';
    const fileId = cardId.replace(' - Only#1', '');
    return `/cards/${encodePath(cardImagePath)}/${encodeURIComponent(fileId)}.png`;
};

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

const TimeLeft = ({ endTime }) => {
    const [diff, setDiff] = useState(new Date(endTime) - new Date());
    useEffect(() => {
        const timer = setInterval(() => setDiff(new Date(endTime) - new Date()), 1000);
        return () => clearInterval(timer);
    }, [endTime]);
    if (diff <= 0) return <div className="px-3 py-1 bg-red-600/90 backdrop-blur text-white text-xs font-bold rounded-lg shadow-lg border border-red-400 animate-pulse">ENDED</div>;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const textColor = "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]";
    return (
        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md border border-slate-700 rounded-lg px-2 py-1 shadow-xl">
            <div className={`font-mono text-lg font-black tracking-widest tabular-nums ${textColor} leading-none`} style={{ fontFamily: "'Courier New', monospace" }}>
                {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
            </div>
        </div>
    );
};

// ... (ManageBiddersModal - ยังคงเดิม) ...
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

// === Auction Room Modal (Live Chat & Card - Updated with Slider V2 & Stats Fix & FIRE BUTTON) ===
const AuctionRoomModal = ({ isOpen, onClose, auction, userProfile, onBid, onBuyNow }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    
    // UI States
    const [showDesc, setShowDesc] = useState(false);
    const [showFullGallery, setShowFullGallery] = useState(false); 
    const [activeProofIndex, setActiveProofIndex] = useState(0); 

    // Swipe Logic States
    const [touchStart, setTouchStart] = useState(0);
    const [touchMove, setTouchMove] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    
    const minSwipeDistance = 50; 

    const chatEndRef = useRef(null);
    const [sellerAvatar, setSellerAvatar] = useState(null);
    const [sellerStats, setSellerStats] = useState(null); // เก็บยศผู้ขาย
    const [toastMessage, setToastMessage] = useState(null);

    // รวมรูปภาพ
    const allImages = useMemo(() => {
        if (!auction) return [];
        const mainImage = getCardImageUrl(auction.card_image_path, auction.card_id);
        let proofImages = [];
        try {
            if (auction.proof_image?.trim().startsWith('[')) {
                proofImages = JSON.parse(auction.proof_image); 
            } else if (auction.proof_image) {
                proofImages = [auction.proof_image];
            }
        } catch { proofImages = []; }
        return [mainImage, ...proofImages].filter(Boolean);
    }, [auction]);

    // 🟢 ดึงข้อมูลผู้ขาย (Avatar + Stats Fix)
    useEffect(() => {
        if (isOpen && auction?.seller_email) {
            const fetchData = async () => {
                // 1. Firebase Profile (Avatar)
                try {
                    const docSnap = await getDoc(doc(db, "users", auction.seller_email));
                    if (docSnap.exists()) setSellerAvatar(docSnap.data().avatarUrl);
                } catch (e) { console.error("Err fetching avatar", e); }

                // 2. Supabase Stats (Rank)
                try {
                    const { data, error } = await supabase.from('user_stats').select('*').eq('user_email', auction.seller_email).maybeSingle();
                    
                    if (data) {
                        setSellerStats(data);
                    } else {
                        // ถ้าไม่เจอข้อมูล (คนขายหน้าใหม่) ให้เซ็ตค่าเริ่มต้นเป็น 0 เพื่อให้โชว์ยศ "หน้าใหม่"
                        setSellerStats({ total_score: 0, penalty_level: 0 });
                    }
                } catch (e) { 
                    console.error("Err fetching stats", e); 
                }
            };
            fetchData();
        }
    }, [isOpen, auction]);

    // Realtime Chat
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

    // Keyboard Navigation Logic
    useEffect(() => {
        if (!isOpen || allImages.length <= 1) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') handlePrevImage();
            if (e.key === 'ArrowRight') handleNextImage();
            if (e.key === 'Escape' && showFullGallery) setShowFullGallery(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, showFullGallery, allImages.length]);

    const scrollToBottom = () => { setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); };
    const handleSendMessage = async (e) => { e.preventDefault(); if (!newMessage.trim() || !userProfile) return; await supabase.from('auction_comments').insert({ auction_id: auction.id, user_email: userProfile.email, user_name: userProfile.name, user_picture: userProfile.picture, message: newMessage.trim() }); setNewMessage(""); };

    const handleAddFriend = async () => {
        if (!userProfile) return alert("กรุณา Login ก่อนครับ");
        if (userProfile.email === auction.seller_email) return;
        const { data: existing } = await supabase.from('friendships').select('*').or(`and(requester_id.eq.${userProfile.email},receiver_id.eq.${auction.seller_email}),and(requester_id.eq.${auction.seller_email},receiver_id.eq.${userProfile.email})`);
        if (existing && existing.length > 0) {
            setToastMessage("เป็นเพื่อนกันแล้ว หรือส่งคำขอไปแล้ว");
        } else {
            const { error } = await supabase.from('friendships').insert({ requester_id: userProfile.email, receiver_id: auction.seller_email });
            if (!error) setToastMessage(`ส่งคำขอเป็นเพื่อนหา ${auction.seller_name} แล้ว!`);
            else alert(error.message);
        }
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Gallery Navigation Logic
    const goToSlide = (index) => {
        if (index < 0) index = 0;
        if (index >= allImages.length) index = allImages.length - 1;
        setActiveProofIndex(index);
        setTouchMove(0); 
    };

    const handleNext = (e) => { e?.stopPropagation(); goToSlide(activeProofIndex + 1); };
    const handlePrev = (e) => { e?.stopPropagation(); goToSlide(activeProofIndex - 1); };

    const onTouchStart = (e) => {
        setIsSwiping(true);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        const currentX = e.targetTouches[0].clientX;
        setTouchMove(currentX - touchStart); 
    };

    const onTouchEnd = () => {
        setIsSwiping(false);
        if (touchMove < -minSwipeDistance) {
            handleNext(); 
        } else if (touchMove > minSwipeDistance) {
            handlePrev(); 
        } else {
            setTouchMove(0); 
        }
    };

    const getTrackStyle = () => {
        const count = allImages.length || 1;
        const percentagePerSlide = 100 / count;
        const baseTranslate = activeProofIndex * percentagePerSlide; 
        const translateValue = isSwiping ? `calc(-${baseTranslate}% + ${touchMove}px)` : `-${baseTranslate}%`;
        return {
            transform: `translateX(${translateValue})`,
            transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)', 
            width: `${count * 100}%`,
            display: 'flex',
            height: '100%'
        };
    };

    if (!isOpen || !auction) return null;
    const isEnded = auction.status !== 'active' || new Date(auction.end_time) < new Date();

    return createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[700] p-0 md:p-4" onClick={onClose}>
            
            {toastMessage && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-[800] bg-black/80 text-white px-6 py-3 rounded-full shadow-2xl border border-emerald-500 animate-fade-in-up flex items-center gap-2">
                    <span className="text-xl">✅</span> {toastMessage}
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 border-0 md:border border-slate-200 dark:border-emerald-500/30 rounded-none md:rounded-xl shadow-2xl w-full h-full md:h-[90vh] max-w-6xl flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* 🖼️ ส่วนซ้าย: รูปภาพ (Slider V2) */}
                <div className="w-full md:w-2/3 h-[50vh] md:h-full flex flex-col bg-slate-100 dark:bg-slate-950 relative group">
                    <button onClick={onClose} className="absolute top-4 left-4 z-20 bg-black/50 text-white p-2 rounded-full md:hidden hover:bg-red-500 transition-colors"><ChevronLeftIcon /></button>
                    
                    <div className="flex-grow relative overflow-hidden bg-black/5 touch-pan-y" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                        <div style={getTrackStyle()}>
                            {allImages.map((img, index) => (
                                <div key={index} className="h-full flex items-center justify-center relative shrink-0" style={{ width: `${100 / allImages.length}%` }}>
                                    <img src={img} className="max-h-full max-w-full object-contain drop-shadow-2xl select-none pointer-events-none" onClick={(e) => { e.stopPropagation(); setShowFullGallery(true); }} />
                                </div>
                            ))}
                        </div>
                        {allImages.length > 1 && (
                            <>
                                <button onClick={handlePrev} className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all hidden md:block ${activeProofIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}><ChevronLeftIcon width="24" height="24" /></button>
                                <button onClick={handleNext} className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all hidden md:block ${activeProofIndex === allImages.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}><ChevronRightIcon width="24" height="24" /></button>
                            </>
                        )}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white p-1.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"><ExpandIcon /></div>
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                            {allImages.length > 1 && (<div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-md font-mono border border-white/10">{activeProofIndex + 1} / {allImages.length}</div>)}
                            <TimeLeft endTime={auction.end_time} />
                        </div>
                        {auction.description && (
                            <div className="absolute bottom-4 left-4 z-20">
                                <button onClick={(e) => { e.stopPropagation(); setShowDesc(true); }} className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-full text-xs backdrop-blur-md flex items-center gap-1 transition-all border border-white/20">
                                    <span className="text-lg">📝</span> อ่านรายละเอียด
                                </button>
                            </div>
                        )}
                    </div>

                    {showDesc && (
                        <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in" onClick={(e) => { e.stopPropagation(); setShowDesc(false); }}>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-slate-700 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                                <h3 className="font-bold text-lg mb-4 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">รายละเอียดสินค้า</h3>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">{auction.description}</p>
                                <button onClick={() => setShowDesc(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><CloseIcon/></button>
                            </div>
                        </div>
                    )}

                    {showFullGallery && (
                        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col touch-pan-y" onClick={() => setShowFullGallery(false)} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
                                <div className="text-white font-mono text-sm opacity-80">{activeProofIndex + 1} / {allImages.length}</div>
                                <button onClick={() => setShowFullGallery(false)} className="text-white p-2 rounded-full hover:bg-white/10"><CloseIcon /></button>
                            </div>
                            <div className="flex-grow overflow-hidden relative flex items-center" onClick={(e) => e.stopPropagation()}>
                                <div style={getTrackStyle()}>
                                    {allImages.map((img, index) => (
                                        <div key={index} className="h-full flex items-center justify-center shrink-0" style={{ width: `${100 / allImages.length}%` }}>
                                            <img src={img} className="max-h-full max-w-full object-contain select-none pointer-events-none" />
                                        </div>
                                    ))}
                                </div>
                                {allImages.length > 1 && (
                                    <>
                                        <button onClick={handlePrev} className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full hidden md:block"><ChevronLeftIcon /></button>
                                        <button onClick={handleNext} className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full hidden md:block"><ChevronRightIcon /></button>
                                    </>
                                )}
                            </div>
                            {allImages.length > 1 && (
                                <div className="h-20 md:h-24 bg-black/40 flex justify-center items-center gap-2 p-2 overflow-x-auto z-50" onClick={e => e.stopPropagation()}>
                                    {allImages.map((img, idx) => (
                                        <button key={idx} onClick={() => goToSlide(idx)} className={`h-14 w-14 md:h-16 md:w-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeProofIndex === idx ? 'border-emerald-500 scale-110 opacity-100' : 'border-transparent opacity-50'}`}>
                                            <img src={img} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 🟢 ส่วนขวา: Chat & Action Bar (เพิ่มข้อมูลผู้ขาย) */}
                <div className="w-full md:w-1/3 h-[50vh] md:h-full flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-0">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><ChatBubbleIcon /> Live Chat</h3>
                        <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-red-500"><CloseIcon /></button>
                    </div>
                    
                    {/* 🟢 ส่วนแสดงข้อมูลผู้ขาย (Seller Info) */}
                    <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                         <div className="flex items-start gap-3">
                            <img 
                                src={sellerAvatar || `https://ui-avatars.com/api/?name=${auction.seller_name}&background=random`} 
                                className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 object-cover"
                            />
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[120px]">{auction.seller_name}</span>
                                        {sellerStats && <RatingBadge score={sellerStats.total_score} />}
                                    </div>
                                    {userProfile && userProfile.email !== auction.seller_email && (
                                        <button onClick={handleAddFriend} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full font-bold border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1">
                                            <UserPlusIcon /> เพิ่มเพื่อน
                                        </button>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                    ลงขายเมื่อ: {new Date(auction.created_at).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                         </div>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 min-h-0">
                        {messages.length === 0 ? (<div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2"><span className="text-4xl opacity-20">💬</span><p>เริ่มการสนทนาได้เลย...</p></div>) : messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-2 ${msg.user_email === userProfile?.email ? 'flex-row-reverse' : ''}`}>
                                <img src={msg.user_picture} className="w-8 h-8 rounded-full bg-slate-700 object-cover shrink-0" />
                                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.user_email === userProfile?.email ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none'}`}><p className="text-[10px] opacity-70 mb-0.5">{msg.user_name}</p><p>{msg.message}</p></div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    {/* Action Bar */}
                    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-emerald-500/20">
                         <div className="flex items-center justify-between mb-3">
                            <div>
                                <span className="text-[10px] text-slate-500 uppercase">Current Bid</span>
                                <div className="text-xl font-black text-slate-900 dark:text-white">฿{auction.current_price.toLocaleString()}</div>
                            </div>
                            {userProfile?.email !== auction.seller_email && !isEnded && (
                                <div className="flex gap-2">
                                    {auction.buy_now_price > 0 && <button onClick={() => onBuyNow(auction)} className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs font-bold">Buy ฿{auction.buy_now_price}</button>}
                                    {/* 🟢 ปุ่ม Bid ไฟลุก (btn-fire) */}
                                    <button 
                                        onClick={() => onBid(auction)} 
                                        className="px-4 py-1.5 btn-fire text-white rounded-lg text-xs font-bold shadow-lg transition-all"
                                    >
                                        Bid
                                    </button>
                                </div>
                            )}
                         </div>
                         <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input 
                                type="text" 
                                value={newMessage} 
                                onChange={e => setNewMessage(e.target.value)} 
                                placeholder={userProfile ? "พิมพ์ข้อความ..." : "กรุณา Login"} 
                                disabled={!userProfile} 
                                className="flex-grow bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-emerald-500" 
                            />
                            <button type="submit" disabled={!newMessage.trim() || !userProfile} className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-colors"><SendIcon /></button>
                        </form>
                    </div>
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

// === Completed Auctions Modal (Grid Layout Updated) ===
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
            .limit(20);
        setItems(data || []);
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchCompleted();
        }
    }, [isOpen]);

    const handleDeleteHistory = async (item) => { // รับทั้ง object item แทนที่จะรับแค่ id
        if(!confirm("⚠️ ยืนยันลบประวัติรายการนี้ถาวร? (รูปภาพจะถูกลบด้วย)")) return;
        
        // 1. ลบรูปภาพออกจาก Storage ก่อน (ถ้ามี)
        if (item.proof_image) {
            try {
                let imagesToDelete = [];
                // แปลงข้อมูลกลับเป็น Array
                if (item.proof_image.startsWith('[')) {
                    const urls = JSON.parse(item.proof_image);
                    // ดึง Path ออกจาก URL (ตัด domain ทิ้ง)
                    // ตัวอย่าง URL: .../storage/v1/object/public/auction-images/email/file.jpg
                    // สิ่งที่ต้องใช้ลบ: email/file.jpg
                    imagesToDelete = urls.map(url => {
                        const parts = url.split('/auction-images/');
                        return parts[1] ? decodeURIComponent(parts[1]) : null;
                    }).filter(Boolean);
                } else {
                    // รองรับข้อมูลเก่าที่เป็น string เดียว
                    const parts = item.proof_image.split('/auction-images/');
                    if (parts[1]) imagesToDelete.push(decodeURIComponent(parts[1]));
                }

                if (imagesToDelete.length > 0) {
                    const { error: storageError } = await supabase.storage
                        .from('auction-images')
                        .remove(imagesToDelete);
                    
                    if (storageError) console.error("Error deleting images:", storageError);
                    else console.log("Deleted images:", imagesToDelete);
                }
            } catch (e) {
                console.error("Error parsing proof_image:", e);
            }
        }

        // 2. ลบข้อมูลใน Database (ตามปกติ)
        const { error } = await supabase.rpc('admin_force_delete', { 
            p_admin_email: userProfile?.email, 
            p_target_input: item.id, 
            p_action_type: 'delete_auction' 
        });

        if(error) alert("Error: " + error.message);
        else {
            setItems(prev => prev.filter(i => i.id !== item.id));
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[600] p-4" onClick={onClose}>
            {/* 🟢 ปรับขนาด Modal ให้กว้างขึ้นเพื่อรองรับ 5 คอลัมน์ */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <HistoryIcon /> ประวัติการประมูลที่จบแล้ว
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors"><CloseIcon /></button>
                </div>

                {/* Content */}
                <div className="p-4 flex-grow overflow-y-auto bg-slate-100 dark:bg-black/20">
                    {loading ? (
                        <div className="text-center py-20 text-slate-500">กำลังโหลด...</div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">ยังไม่มีรายการที่จบแล้ว</div>
                    ) : (
                        // 🟢 Grid Layout: มือถือ 2, Tablet 3-4, PC 5 ช่อง
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {items.map(item => (
                                <div 
                                    key={item.id} 
                                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col relative group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Image Section */}
                                    <div className="aspect-[5/7] bg-slate-200 dark:bg-slate-700/50 p-3 relative flex items-center justify-center">
                                        <img 
                                            src={getCardImageUrl(item.card_image_path, item.card_id)} 
                                            className="w-full h-full object-contain drop-shadow-md" 
                                            onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} 
                                        />
                                        
                                        {/* Admin Delete Button */}
                                        {userProfile?.email === 'koritros619@gmail.com' && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteHistory(item); }}
                                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-10 scale-90"
                                                title="Admin Delete"
                                            >
                                                <TrashIcon />
                                            </button>
                                        )}
                                    </div>

                                    {/* Info Section */}
                                    <div className="p-2.5 flex flex-col flex-grow">
                                        <h4 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white line-clamp-1 mb-0.5" title={item.card_name}>
                                            {item.card_name}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                                            จบเมื่อ: {new Date(item.end_time).toLocaleDateString('th-TH')}
                                        </p>
                                        
                                        <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[9px] text-slate-400 uppercase tracking-wide">Sold Price</p>
                                                    <p className="text-sm md:text-base font-black text-emerald-600 dark:text-emerald-400">
                                                        ฿{item.current_price.toLocaleString()}
                                                    </p>
                                                </div>
                                                {item.winner_name ? (
                                                    <div className="text-right max-w-[50%]">
                                                        <p className="text-[9px] text-slate-400">Winner</p>
                                                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 truncate flex items-center justify-end gap-0.5">
                                                            👑 {item.winner_name}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-slate-400 italic self-center">ไม่มีผู้บิด</p>
                                                )}
                                            </div>
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

// === Main Component ===
export default function AuctionMarket() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('auction');
  const [auctions, setAuctions] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [historyAuction, setHistoryAuction] = useState(null); 
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); 
  const [manageAuction, setManageAuction] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ending_soon");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDeckListModalOpen, setIsDeckListModalOpen] = useState(false);
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false); 
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false); 

  const [userDecks, setUserDecks] = useLocalStorage("bot-userDecks-v1", {});
  const [mainDeck, setMainDeck] = useLocalStorage("bot-mainDeck-v32-final", []);
  const [lifeDeck, setLifeDeck] = useLocalStorage("bot-lifeDeck-v32-final", []);
  const [cardDb] = useLocalStorage("bot-cardDb-v32-final", []);
  const [userReputation, setUserReputation] = useState({});
  const [confirmTransaction, setConfirmTransaction] = useState(null);
  const [chatAuction, setChatAuction] = useState(null);
  const [customProfile, setCustomProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(() => { try { return JSON.parse(localStorage.getItem("bot-userProfile-v1")); } catch { return null; } });
  const [theme, setThemeState] = useState(() => { try { return JSON.parse(localStorage.getItem("bot-theme")) || 'dark'; } catch { return 'dark'; } });

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = /(Line|FBAN|FBAV|Instagram|Messenger)/i.test(ua);
    if (isInApp) { navigate(`/open-browser?redirect=${encodeURIComponent(location.pathname + location.search)}`, { replace: true }); }
  }, [location, navigate]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, [theme]);

  const setTheme = (newTheme) => { setThemeState(newTheme); localStorage.setItem("bot-theme", JSON.stringify(newTheme)); };

  const displayUser = useMemo(() => {
    if (!userProfile) return null;
    if (!customProfile) return userProfile;
    return { ...userProfile, name: customProfile.displayName || userProfile.name, picture: customProfile.avatarUrl || userProfile.picture };
  }, [userProfile, customProfile]);

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

  const fetchReputations = async () => {
      const { data } = await supabase.from('user_stats').select('user_email, total_score, penalty_level');
      const map = {};
      data?.forEach(u => map[u.user_email] = u);
      setUserReputation(map);
  };

  useEffect(() => { fetchReputations(); }, []);

  useEffect(() => {
    const openFromNoti = async () => {
        if (location.state?.openAuctionId) {
            const auctionId = location.state.openAuctionId;
            let targetAuction = auctions.find(a => a.id === auctionId) || myAuctions.find(a => a.id === auctionId);
            if (!targetAuction) {
                const { data } = await supabase.from('auctions').select('*').eq('id', auctionId).single();
                if (data) targetAuction = data;
            }
            if (targetAuction) {
                setChatAuction(targetAuction);
                window.history.replaceState({}, document.title);
            }
        }
    };
    openFromNoti();
  }, [location, auctions, myAuctions]);

  useEffect(() => {
    if (activeTab === 'my-auctions' && userProfile?.email) { fetchMyAuctions(); } else { fetchAuctions(); }
    const channel = supabase.channel('public:auctions').on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, () => { if (activeTab === 'my-auctions') fetchMyAuctions(); else fetchAuctions(); }).subscribe();
    return () => supabase.removeChannel(channel);
  }, [activeTab, userProfile]);

  async function fetchAuctions() {
    const now = new Date().toISOString();
    const { data } = await supabase.from('auctions').select('*').eq('status', 'active').gt('end_time', now).order('end_time', { ascending: true });
    if (data) setAuctions(data);
  }

  async function fetchMyAuctions() {
    if (!userProfile?.email) return;
    const { data } = await supabase.from('auctions').select('*').or(`seller_email.eq.${userProfile.email},winner_email.eq.${userProfile.email}`);
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

  const filteredAuctions = useMemo(() => {
    return auctions.filter(item => {
        const matchName = item.card_name.toLowerCase().includes(searchTerm.toLowerCase());
        let matchStatus = true;
        if (filterStatus === 'active_bid') matchStatus = item.current_price > item.start_price;
        else if (filterStatus === 'no_bid') matchStatus = item.current_price === item.start_price;
        return matchName && matchStatus;
    }).sort((a, b) => {
        if (sortOption === 'price_asc') return a.current_price - b.current_price;
        if (sortOption === 'price_desc') return b.current_price - a.current_price;
        return new Date(a.end_time) - new Date(b.end_time);
    });
  }, [auctions, searchTerm, sortOption, filterStatus]);

  async function handleBid(auction) {
    if (!userProfile) return alert("กรุณา Login ที่หน้าแรกก่อนครับ");
    if (userProfile.email === auction.seller_email) return alert("ห้ามบิดของตัวเองครับ!");
    const minBid = auction.current_price + auction.min_bid_increment;
    const amountStr = prompt(`🔥 บิดสินค้า: ${auction.card_name}\n💰 ราคาปัจจุบัน: ${auction.current_price.toLocaleString()} บาท\n📈 ขั้นต่ำที่ต้องบิด: ${minBid.toLocaleString()} บาท\nกรอกราคาที่คุณต้องการสู้:`, minBid);
    if (!amountStr) return;
    const amount = parseInt(amountStr);
    if (amount < minBid) return alert(`ต้องบิดอย่างน้อย ${minBid} บาทครับ`);
    const { data, error } = await supabase.rpc('place_bid', { p_auction_id: auction.id, p_bidder_email: userProfile.email, p_bidder_name: displayUser.name, p_amount: amount });
    if (error) alert("Error: " + error.message); else if (!data.success) alert(data.message); else alert("บิดสำเร็จ! 🎉");
  }

  async function handleBuyNow(auction) {
    if (!userProfile) return alert("กรุณา Login ก่อนครับ");
    if (userProfile.email === auction.seller_email) return alert("ซื้อของตัวเองไม่ได้ครับ");
    if (!confirm(`⚡ ยืนยันการซื้อทันที (Buy Now)?\n\n💰 ราคา: ${auction.buy_now_price.toLocaleString()} บาท\n\n(การประมูลจะจบลงทันทีและคุณจะเป็นผู้ชนะ)`)) return;
    const { data, error } = await supabase.rpc('buy_now_auction', { p_auction_id: auction.id, p_buyer_email: userProfile.email, p_buyer_name: displayUser.name, p_amount: auction.buy_now_price });
    if (error) alert("Error: " + error.message); else if (!data.success) alert(data.message); else { alert("🎉 ยินดีด้วย! คุณชนะการประมูลด้วยระบบ Buy Now"); setChatAuction(null); fetchAuctions(); }
  }

  async function handleCancel(auctionId) {
    const isAdmin = userProfile?.email === 'koritros619@gmail.com';
    const confirmMsg = isAdmin ? "👑 Admin Force Cancel:\nยืนยัน?" : "⚠️ ยืนยันการยกเลิก?";
    if (!confirm(confirmMsg)) return;
    const { data, error } = await supabase.rpc('cancel_auction', { p_auction_id: auctionId, p_user_email: userProfile.email });
    if (error) alert("Error: " + error.message); else if (!data.success) alert(data.message); else { alert(data.message); fetchAuctions(); fetchMyAuctions(); }
  }

  async function handleDeleteMyAuction(auctionId) {
    if (!confirm("⚠️ ยืนยันการลบรายการนี้?")) return;
    const { error } = await supabase.from('auctions').delete().eq('id', auctionId);
    if (error) alert("ลบไม่ได้: " + error.message); else setMyAuctions(prev => prev.filter(item => item.id !== auctionId));
  }

  const handleLogout = () => { googleLogout(); localStorage.removeItem("bot-userProfile-v1"); setUserProfile(null); navigate('/'); };
  const handleSaveProfile = async (data) => { if (!userProfile) return; try { await setDoc(doc(db, "users", userProfile.email), { displayName: data.displayName, avatarUrl: data.avatarUrl, isSetup: true, updatedAt: serverTimestamp() }, { merge: true }); setCustomProfile(p => ({ ...p, ...data })); setIsProfileModalOpen(false); alert("บันทึกข้อมูลเรียบร้อย!"); } catch (e) { console.error(e); alert("บันทึกไม่สำเร็จ"); } };
  const handleStartAuctionClick = () => { setIsTypeSelectionOpen(true); };
  const handleSelectType = (type) => { setIsTypeSelectionOpen(false); if (type === 'single') { navigate('/', { state: { showAuctionTutorial: true } }); } else { setIsBulkModalOpen(true); } };

  return (
    <div className="h-full overflow-y-auto bg-slate-100 dark:bg-black text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      
      <style>{`
        @keyframes fire-2d-glow {
          0% {
            box-shadow: 0 0 5px #ffcc00, 0 0 10px #ff4500; /* แสงเงาเริ่ม */
            border-color: #ffcc00;
          }
          50% {
            box-shadow: 0 0 15px #ffd700, 0 0 30px #ff0000; /* แสงเงาขยาย (ไฟลุก) */
            border-color: #ffff00;
            transform: scale(1.03); /* ขยายปุ่มนิดหน่อย */
          }
          100% {
            box-shadow: 0 0 5px #ffcc00, 0 0 10px #ff4500; /* กลับมาที่เดิม */
            border-color: #ffcc00;
          }
        }

        .btn-fire {
          /* ไล่สีแนวตั้ง ส้ม -> แดงเข้ม (เหมือนรูปตัวอย่าง) */
          background: linear-gradient(180deg, #ff5500 0%, #cc0000 100%);
          
          /* เส้นขอบสีเหลืองทอง */
          border: 2px solid #ffcc00;
          
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5); /* เงาตัวหนังสือ */
          
          /* เรียกใช้ Animation */
          animation: fire-2d-glow 1s ease-in-out infinite;
          
          position: relative;
          overflow: hidden;
        }

        /* เพิ่มเงาสะท้อนด้านบนปุ่ม ให้ดูนูนมีมิติ */
        .btn-fire::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 40%;
          background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
          pointer-events: none;
        }

        .btn-fire:active { 
          transform: scale(0.95); 
          filter: brightness(0.9);
        }
      `}</style>

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
                        <HomeIcon /> <span className="hidden md:inline ml-1">Home</span>
                    </Button>
                </Link>
                <Link to="/public-decks">
                    <Button as="span" className="!px-2 md:!px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg hover:from-blue-400 hover:to-purple-500">
                        <UsersIcon /> <span className="hidden md:inline">Public</span>
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
                    {displayUser.name} <span className="hidden">{userReputation[userProfile?.email]?.total_score || 0}</span>
                </span>
            </div>
         </div>
      </header>

      <div className="flex justify-center mt-4 px-2 md:px-4">
        <div className="flex w-full md:w-auto bg-slate-200 dark:bg-slate-800 rounded-full p-1 shadow-inner">
            <button onClick={() => setActiveTab('auction')} className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'auction' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <GavelIcon /> ลานประมูล
            </button>
            <button onClick={() => setActiveTab('market')} className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'market' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <ShoppingBagIcon /> <span className="hidden sm:inline">ตลาดซื้อขาย</span><span className="inline sm:hidden">ตลาด</span>
            </button>
            <button onClick={() => setActiveTab('my-auctions')} className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'my-auctions' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <PackageIcon /> <span className="hidden sm:inline">สินค้าที่ลงประมูล</span><span className="inline sm:hidden">รายการที่เคยประมูล</span>
            </button>      
        </div>
      </div>

      <main className="flex-grow p-0 md:p-8 w-full pb-40 min-h-[120vh]">
        {activeTab === 'auction' && (
            <div className="animate-fade-in w-full md:px-8">
                <div className="mt-4 mb-6 flex flex-col gap-2 bg-white dark:bg-slate-900/50 p-2 md:p-3 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-sm mx-4 md:mx-0">
                    <div className="relative flex-grow w-full">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                        <input type="text" placeholder="ค้นหาชื่อการ์ด..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:items-center shrink-0">
                        <div className="flex gap-2 items-center overflow-x-auto pb-1 md:pb-0 no-scrollbar shrink-0">
                            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="px-2 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shrink-0">
                                <option value="ending_soon">เวลา</option>
                                <option value="price_asc">ถูก➜แพง</option>
                                <option value="price_desc">แพง➜ถูก</option>
                            </select>
                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1 shrink-0">
                                <button onClick={() => setFilterStatus('all')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all shrink-0 ${filterStatus === 'all' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>รวม</button>
                                <button onClick={() => setFilterStatus('active_bid')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all shrink-0 ${filterStatus === 'active_bid' ? 'bg-white dark:bg-slate-600 shadow text-red-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>เดือด</button>
                                <button onClick={() => setFilterStatus('no_bid')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all shrink-0 ${filterStatus === 'no_bid' ? 'bg-white dark:bg-slate-600 shadow text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>ใหม่</button>
                            </div>
                            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 shrink-0"></div>
                            <button onClick={() => setIsCompletedModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-all whitespace-nowrap shrink-0" title="ดูประวัติการประมูลที่จบแล้ว">
                                <HistoryIcon /> <span className="hidden sm:inline">ประวัติ</span>
                            </button>
                        </div>
                        <button onClick={handleStartAuctionClick} className="w-full md:w-auto flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-emerald-500/30 transition-all active:scale-95 whitespace-nowrap justify-center shrink-0">
                            <span className="text-lg leading-none mb-0.5">+</span> ลงประมูล
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                    {filteredAuctions.map(item => (
                        <div key={item.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col" onClick={() => setChatAuction(item)}>
                            <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                                <img src={getAuctionThumbnail(item)} className="w-full h-full object-cover drop-shadow-2xl" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                                {item.winner_name && <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm z-10">👑 {item.winner_name}</div>}
                            </div>
                            <div className="p-3 flex-1 flex flex-col gap-1">
                                <div className="flex justify-center mb-1"><TimeLeft endTime={item.end_time} /></div>
                                <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white text-center mb-1 line-clamp-1">{item.card_name}</h3>
                                <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Current Bid</p>
                                    <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">฿{item.current_price.toLocaleString()}</span>
                                </div>
                                <div className="mt-2 flex gap-2">
                                    {item.buy_now_price > 0 && (
                                        <button onClick={(e) => { e.stopPropagation(); handleBuyNow(item); }} className="flex-1 py-2 bg-yellow-500/10 hover:bg-yellow-500/30 dark:bg-yellow-400/10 text-yellow-700 dark:text-yellow-300 border border-yellow-500/50 rounded-xl font-bold text-[10px] md:text-xs flex flex-col items-center justify-center leading-none">
                                            <span className="uppercase mb-0.5">Buy</span><span>฿{item.buy_now_price.toLocaleString()}</span>
                                        </button>
                                    )}
                                    {/* 🟢 แก้ไขปุ่ม Bid (Grid) */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleBid(item); }} 
                                        className={`py-2 btn-fire text-white text-xs md:text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-1 ${item.buy_now_price > 0 ? 'flex-1' : 'w-full'}`}
                                    >
                                        <GavelIcon /> <span>Bid +{item.min_bid_increment.toLocaleString()} B</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'my-auctions' && (
            <div className="animate-fade-in w-full px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 w-full">
                    {myAuctions.map(item => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer" onClick={() => setChatAuction(item)}>
                            <div className="aspect-[5/7] bg-slate-200 dark:bg-slate-800 relative">
                                <img src={getAuctionThumbnail(item)} className="w-full h-full object-contain p-2" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                                <div className="absolute top-2 right-2 bg-slate-600/90 text-white text-[10px] px-2 py-1 rounded-full font-bold border border-slate-500">
                                    {item.status === 'cancelled' ? 'ยกเลิกแล้ว' : (new Date(item.end_time) < new Date() ? 'จบแล้ว' : 'กำลังประมูล')}
                                </div>
                            </div>
                            <div className="p-3 flex-1 flex flex-col">
                                <h3 className="font-bold text-sm truncate mb-1">{item.card_name}</h3>
                                <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700 text-center mb-2">
                                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">฿{item.current_price.toLocaleString()}</p>
                                </div>
                                {item.status === 'active' && (
                                    <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => handleCancel(item.id)} className="w-full py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center justify-center gap-1"><BanIcon /> ยกเลิก</button>
                                        <button onClick={() => setManageAuction(item)} className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"><ShieldCheckIcon /> จัดการ</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'market' && (
            <div className="text-center py-20 w-full"><ShoppingBagIcon width="48" height="48" className="inline-block text-emerald-500 mb-4" /><h2 className="text-2xl font-bold">ตลาดซื้อขาย (Coming Soon)</h2></div>
        )}
      </main>

      {/* Modals & Drawers */}
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
        onOpenFeedback={() => setIsFeedbackOpen(true)} 
      />
      
      <ProfileSetupModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userProfile={userProfile} onSave={handleSaveProfile} />
      <BidHistoryModal isOpen={!!historyAuction} onClose={() => setHistoryAuction(null)} auction={historyAuction} />
      <CompletedAuctionsModal isOpen={isCompletedModalOpen} onClose={() => setIsCompletedModalOpen(false)} userProfile={userProfile} />
      <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} adminEmail={userProfile?.email} />
      <ReportModal isOpen={!!reportTarget} onClose={() => setReportTarget(null)} reporterEmail={userProfile?.email} targetUser={reportTarget?.targetUser} context={reportTarget?.context} />
      <ManageBiddersModal isOpen={!!manageAuction} onClose={() => setManageAuction(null)} auction={manageAuction} userProfile={userProfile} />
      
      {/* Auction & Transaction Modals */}
      <AuctionRoomModal isOpen={!!chatAuction} onClose={() => setChatAuction(null)} auction={chatAuction} userProfile={displayUser} onBid={handleBid} onBuyNow={handleBuyNow} />
      <ConfirmTransactionModal isOpen={!!confirmTransaction} onClose={() => setConfirmTransaction(null)} auction={confirmTransaction?.auction} userProfile={userProfile} fetchReputations={fetchReputations} onBuyNow={handleBuyNow} />
      <DeckListModal isOpen={isDeckListModalOpen} onClose={() => setIsDeckListModalOpen(false)} userProfile={displayUser} userDecks={userDecks} setUserDecks={setUserDecks} mainDeck={mainDeck} lifeDeck={lifeDeck} setMainDeck={setMainDeck} setLifeDeck={setLifeDeck} cardDb={cardDb} />
      
      {/* 🟢 5. Modal เลือกประเภทการประมูล */}
      {isTypeSelectionOpen && (
        createPortal(
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[900] p-4 animate-fade-in" onClick={() => setIsTypeSelectionOpen(false)}>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 transform scale-100 transition-transform" onClick={e => e.stopPropagation()}>
                    <h3 className="text-xl font-bold text-center mb-6 text-slate-900 dark:text-white">ต้องการลงขายแบบไหน?</h3>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => handleSelectType('single')} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🃏</div>
                            <div className="text-left">
                                <h4 className="font-bold text-slate-900 dark:text-white">การ์ดเดี่ยว (Single)</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">เลือกการ์ดจากฐานข้อมูล</p>
                            </div>
                        </button>
                        <button onClick={() => handleSelectType('bulk')} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-500 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📦</div>
                            <div className="text-left">
                                <h4 className="font-bold text-slate-900 dark:text-white">ยกกล่อง / อื่นๆ</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">ระบุชื่อเอง + ต้องถ่ายรูป</p>
                            </div>
                        </button>
                    </div>
                    <button onClick={() => setIsTypeSelectionOpen(false)} className="mt-6 w-full py-2 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">ยกเลิก</button>
                </div>
            </div>, document.body
        )
      )}

      {/* 🟢 6. Modal ลงขายแบบ Bulk */}
      <CreateBulkAuctionModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
        userProfile={displayUser} 
      />

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        userProfile={displayUser} 
        showAlert={(title, msg) => alert(`${title}\n${msg}`)} 
      />

      {/* Chat Widget */}
      {!chatAuction && (
        <ChatWidget 
            userProfile={displayUser} 
            isMobileMenuOpen={isSettingsOpen} 
        />
      )}

    </div>
  );
}