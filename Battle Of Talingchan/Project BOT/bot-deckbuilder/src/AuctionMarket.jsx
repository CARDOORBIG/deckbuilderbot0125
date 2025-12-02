import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { createPortal } from "react-dom";
import { googleLogout } from '@react-oauth/google';
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import FleaMarket from './FleaMarket';
import ManagementDashboard from './components/ManagementDashboard';
// --- Local Modals ---
import AdminDashboardModal from './AdminDashboardModal';
import ReportModal from './ReportModal';
import ChatWidget from './ChatWidget';
import FeedbackModal from './components/FeedbackModal';
import CreateBulkAuctionModal from './CreateBulkAuctionModal'; 
import TopUpModal from './components/TopUpModal'; 
import ShipmentModal from './components/ShipmentModal';

// --- Imported Components ---
import Header from './components/Header';
import SettingsDrawer from './components/SettingsDrawer';
import ProfileSetupModal from './components/ProfileSetupModal';
import RatingBadge from './components/RatingBadge';
import DeckListModal from './components/DeckListModal';
import { 
    GavelIcon, ShoppingBagIcon, UserCogIcon, 
    CloseIcon, SunIcon, MoonIcon, HistoryIcon, 
    PackageIcon, BanIcon, FlagIcon, 
    ShieldCheckIcon, ChatBubbleIcon, SendIcon, 
    TrashIcon, DeckIcon, StoreIcon, 
    MessageIcon, NeonLightningIcon, 
    ImageIcon, ArchiveIcon,
    ChevronLeftIcon,
    ChevronRightIcon, 
    UserPlusIcon,
    EyeIcon,
    ExpandIcon 
} from './components/Icons';

// Icons
const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-yellow-400">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);

// === Helper Functions ===
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
const getAuctionThumbnail = (item) => {
    if (item.card_image_path === 'CUSTOM_ITEM') {
        try { const images = JSON.parse(item.proof_image); return images[0] || 'https://placehold.co/300x420/1e293b/ffffff?text=No+Image'; } catch { return 'https://placehold.co/300x420/1e293b/ffffff?text=Error'; }
    }
    if (!item.card_image_path || !item.card_id) return '';
    const fileId = item.card_id.replace(' - Only#1', '');
    return `/cards/${encodePath(item.card_image_path)}/${encodeURIComponent(fileId)}.png`;
};
const getCardImageUrl = (cardImagePath, cardId) => { if (!cardImagePath || !cardId) return ''; const fileId = cardId.replace(' - Only#1', ''); return `/cards/${encodePath(cardImagePath)}/${encodeURIComponent(fileId)}.png`; };
function useLocalStorage(key, initial) { const [v, s] = useState(() => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; } }); useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]); return [v, s]; }
const Button = ({ className = "", children, ...props }) => ( <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-300/20 dark:border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 dark:hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`} {...props}> {children} </button> );
const TimeLeft = ({ endTime }) => { const [diff, setDiff] = useState(new Date(endTime) - new Date()); useEffect(() => { const timer = setInterval(() => setDiff(new Date(endTime) - new Date()), 1000); return () => clearInterval(timer); }, [endTime]); if (diff <= 0) return <div className="px-3 py-1 bg-red-600/90 backdrop-blur text-white text-xs font-bold rounded-lg shadow-lg border border-red-400 animate-pulse">ENDED</div>; const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000); const textColor = "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"; return ( <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md border border-slate-700 rounded-lg px-2 py-1 shadow-xl"> <div className={`font-mono text-lg font-black tracking-widest tabular-nums ${textColor} leading-none`} style={{ fontFamily: "'Courier New', monospace" }}> {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')} </div> </div> ); };

// Modals Placeholder
const ManageBiddersModal = ({ isOpen, onClose, auction, userProfile }) => { if(!isOpen) return null; return <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white">Manage Bidders (Placeholder) <button onClick={onClose} className="ml-4 bg-red-500 px-2">Close</button></div>; };
const BidHistoryModal = ({ isOpen, onClose, auction }) => { if(!isOpen) return null; return <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white">Bid History (Placeholder) <button onClick={onClose} className="ml-4 bg-red-500 px-2">Close</button></div>; };
const CompletedAuctionsModal = ({ isOpen, onClose, userProfile }) => { if(!isOpen) return null; return <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white">Completed Auctions (Placeholder) <button onClick={onClose} className="ml-4 bg-red-500 px-2">Close</button></div>; };

// ✅ Tracking Info Modal (สำหรับผู้ซื้อดูข้อมูลจัดส่ง)
const TrackingModal = ({ isOpen, onClose, item }) => {
    if (!isOpen || !item) return null;
    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[950] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2"><TruckIcon/> ข้อมูลการจัดส่ง</h3>
                    <button onClick={onClose}><CloseIcon/></button>
                </div>
                <div className="p-5 space-y-4">
                    {/* ขนส่ง */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                         <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm"><PackageIcon className="text-blue-500"/></div>
                         <div>
                             <p className="text-[10px] text-slate-400 uppercase font-bold">บริษัทขนส่ง</p>
                             <p className="text-base font-bold text-slate-900 dark:text-white">{item.courier_name || 'ไม่ระบุ'}</p>
                         </div>
                    </div>

                    {/* Tracking */}
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">หมายเลขพัสดุ (Tracking)</p>
                        <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-slate-700">
                            <span className="font-mono font-black text-xl text-slate-700 dark:text-slate-200 tracking-widest">{item.tracking_number || '-'}</span>
                            <button onClick={() => { navigator.clipboard.writeText(item.tracking_number); alert('คัดลอกเรียบร้อย!'); }} className="text-blue-500 hover:text-blue-400 bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600"><CopyIcon/></button>
                        </div>
                    </div>

                    {/* รูปหลักฐาน */}
                    {item.shipping_proof && (
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-2">หลักฐานการส่ง</p>
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer group relative" onClick={() => window.open(item.shipping_proof, '_blank')}>
                                <img src={item.shipping_proof} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/30">คลิกเพื่อดูรูปใหญ่</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                        <p className="text-[10px] text-center text-slate-400">ส่งเมื่อ: {item.shipping_date ? new Date(item.shipping_date).toLocaleString('th-TH') : '-'}</p>
                    </div>
                    
                    <button onClick={onClose} className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">ปิด</button>
                </div>
            </div>
        </div>, document.body
    );
};

// Auction Room Modal (แก้ไขลำดับ Hooks แก้ Error)
const AuctionRoomModal = ({ isOpen, onClose, auction, userProfile, onBid, onBuyNow }) => {
    // 1. Hooks ทั้งหมดต้องอยู่บนสุด ห้ามมี return คั่น
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);
    const [sellerAvatar, setSellerAvatar] = useState(null);
    const [sellerStats, setSellerStats] = useState(null); 
    const [toastMessage, setToastMessage] = useState(null);
    
    // UI States
    const [showDesc, setShowDesc] = useState(false);
    const [showFullGallery, setShowFullGallery] = useState(false);
    const [activeProofIndex, setActiveProofIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchMove, setTouchMove] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const minSwipeDistance = 50;

    // useMemo
    const allImages = useMemo(() => {
        if (!auction) return [];
        let images = [];
        if (auction.card_image_path !== 'CUSTOM_ITEM') {
             images.push(getCardImageUrl(auction.card_image_path, auction.card_id));
        }
        try {
            if (auction.proof_image?.trim().startsWith('[')) {
                images.push(...JSON.parse(auction.proof_image));
            } else if (auction.proof_image) {
                images.push(auction.proof_image);
            }
        } catch { }
        return images.filter(Boolean);
    }, [auction]);

    // useEffects
    useEffect(() => {
        if (isOpen && auction?.seller_email) {
            const fetchData = async () => {
                try {
                    const docSnap = await getDoc(doc(db, "users", auction.seller_email));
                    if (docSnap.exists()) setSellerAvatar(docSnap.data().avatarUrl);
                } catch (e) {}
                try {
                    const { data } = await supabase.from('user_stats').select('*').eq('user_email', auction.seller_email).maybeSingle();
                    if (data) setSellerStats(data);
                    else setSellerStats({ total_score: 0, penalty_level: 0 });
                } catch (e) {}
            };
            fetchData();
        }
    }, [isOpen, auction]);

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

    useEffect(() => {
        if (!isOpen || allImages.length <= 1) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'Escape' && showFullGallery) setShowFullGallery(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, showFullGallery, allImages.length]);

    // Helper Functions (ที่ไม่ใช่ Hooks)
    const scrollToBottom = () => { setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); };
    const handleSendMessage = async (e) => { e.preventDefault(); if (!newMessage.trim() || !userProfile) return; await supabase.from('auction_comments').insert({ auction_id: auction.id, user_email: userProfile.email, user_name: userProfile.name, user_picture: userProfile.picture, message: newMessage.trim() }); setNewMessage(""); };
    const handleAddFriend = async () => { 
        if (!userProfile) return alert("กรุณา Login ก่อนครับ");
        if (userProfile.email === auction.seller_email) return;
        const { data: existing } = await supabase.from('friendships').select('*').or(`and(requester_id.eq.${userProfile.email},receiver_id.eq.${auction.seller_email}),and(requester_id.eq.${auction.seller_email},receiver_id.eq.${userProfile.email})`);
        if (existing && existing.length > 0) { setToastMessage("เป็นเพื่อนกันแล้ว หรือส่งคำขอไปแล้ว"); } 
        else {
            const { error } = await supabase.from('friendships').insert({ requester_id: userProfile.email, receiver_id: auction.seller_email });
            if (!error) setToastMessage(`ส่งคำขอเป็นเพื่อนหา ${auction.seller_name} แล้ว!`);
            else alert(error.message);
        }
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleNext = (e) => { e?.stopPropagation(); if(activeProofIndex < allImages.length - 1) setActiveProofIndex(prev => prev + 1); };
    const handlePrev = (e) => { e?.stopPropagation(); if(activeProofIndex > 0) setActiveProofIndex(prev => prev - 1); };
    const onTouchStart = (e) => { setIsSwiping(true); setTouchStart(e.targetTouches[0].clientX); };
    const onTouchMove = (e) => { setTouchMove(e.targetTouches[0].clientX - touchStart); };
    const onTouchEnd = () => { setIsSwiping(false); if (touchMove < -minSwipeDistance) handleNext(); else if (touchMove > minSwipeDistance) handlePrev(); setTouchMove(0); };
    
    const getTrackStyle = () => {
        const count = allImages.length || 1;
        const percentagePerSlide = 100 / count;
        const baseTranslate = activeProofIndex * percentagePerSlide; 
        const translateValue = isSwiping ? `calc(-${baseTranslate}% + ${touchMove}px)` : `-${baseTranslate}%`;
        return { transform: `translateX(${translateValue})`, transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)', width: `${count * 100}%`, display: 'flex', height: '100%' };
    };

    // 2. หลังจากประกาศ Hooks ครบแล้ว ค่อยเช็คเงื่อนไข return
    if (!isOpen || !auction) return null;

    // 3. Logic อื่นๆ
    const isEnded = auction.status !== 'active' || new Date(auction.end_time) < new Date();
    const isCompleted = auction.status === 'completed'; 
    const isChatDisabled = isCompleted || !userProfile;

    // ตรวจสอบสิทธิ์ (Restricted View)
    const isOwner = userProfile?.email === auction.seller_email;
    const isWinner = userProfile?.email === auction.winner_email;
    const isAuthorized = isOwner || isWinner;
    const isRestricted = (auction.status === 'sold' || auction.status === 'completed') && !isAuthorized;

    if (isRestricted) {
        return (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[700] p-4" onClick={onClose}>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center max-w-sm shadow-2xl border border-red-500/50" onClick={e => e.stopPropagation()}>
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">เนื้อหานี้ถูกจำกัด</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        สินค้านี้อยู่ระหว่างการเจรจาซื้อขาย<br/>อนุญาตให้เฉพาะผู้ซื้อและผู้ขายเข้าถึงได้เท่านั้น
                    </p>
                    <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-300 transition-colors">ปิด</button>
                </div>
            </div>
        );
    }

    // 4. Render Main Content
    return createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[700] p-0 md:p-4" onClick={onClose}>
            {toastMessage && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-[800] bg-black/80 text-white px-6 py-3 rounded-full shadow-2xl border border-emerald-500 animate-fade-in-up flex items-center gap-2">
                    <span className="text-xl">✅</span> {toastMessage}
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 border-0 md:border border-slate-200 dark:border-emerald-500/30 rounded-none md:rounded-xl shadow-2xl w-full h-full md:h-[90vh] max-w-6xl flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* ส่วนซ้าย: รูปภาพ */}
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
                            {(auction.min_bid_increment > 0) && <TimeLeft endTime={auction.end_time} />}
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

                {/* ส่วนขวา: Chat & Action Bar */}
                <div className="w-full md:w-1/3 h-[50vh] md:h-full flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-0">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <ChatBubbleIcon /> {auction.status === 'sold' ? 'Private Chat (ซื้อขาย)' : 'Live Chat'}
                        </h3>
                        <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-red-500"><CloseIcon /></button>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-start gap-3">
                             <img src={sellerAvatar || `https://ui-avatars.com/api/?name=${auction.seller_name}`} className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 object-cover"/>
                             <div className="flex-grow min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[120px]">{auction.seller_name}</span>
                                    {sellerStats && <RatingBadge score={sellerStats.total_score} />}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5">สถานะ: {auction.status === 'sold' ? '🔴 ขายแล้ว' : '🟢 กำลังขาย'}</p>
                             </div>
                        </div>
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

                    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-emerald-500/20">
                         <div className="flex items-center justify-between mb-3">
                            <div>
                                <span className="text-[10px] text-slate-500 uppercase">{auction.type === 'market' ? 'Price' : 'Current Bid'}</span>
                                <div className="text-xl font-black text-slate-900 dark:text-white">฿{auction.current_price.toLocaleString()}</div>
                            </div>
                            
                            {/* ปุ่ม Action (ซ่อนถ้าขายแล้ว) */}
                            {userProfile?.email !== auction.seller_email && auction.status === 'active' && !isEnded && (
                                <div className="flex gap-2">
                                    {/* ปุ่ม Buy Now (Market/Auction) */}
                                    {auction.buy_now_price > 0 && (
                                        <button onClick={() => onBuyNow(auction)} className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs font-bold">
                                            Buy ฿{auction.buy_now_price.toLocaleString()}
                                        </button>
                                    )}
                                    {/* ปุ่ม Bid (เฉพาะ Auction) */}
                                    {(auction.min_bid_increment > 0) && (
                                        <button onClick={() => onBid(auction)} className="px-4 py-1.5 btn-fire text-white rounded-lg text-xs font-bold shadow-lg">
                                            Bid +{auction.min_bid_increment.toLocaleString()}
                                        </button>
                                    )}
                                </div>
                            )}
                         </div>
                         
                         <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input 
                                type="text" 
                                value={newMessage} 
                                onChange={e => setNewMessage(e.target.value)} 
                                placeholder={isChatDisabled ? "🔒 การสนทนาถูกปิด" : "พิมพ์ข้อความ..."} 
                                disabled={isChatDisabled} 
                                className={`flex-grow bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 ${isChatDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            />
                            <button type="submit" disabled={!newMessage.trim() || isChatDisabled} className={`p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-colors ${isChatDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}><SendIcon /></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>, document.body
    );
};

// ✅ Confirm Transaction Modal (เพิ่มแจ้งเตือนผู้ขายเมื่อจบงาน)
const ConfirmTransactionModal = ({ isOpen, onClose, auction, userProfile, fetchReputations }) => {
    const [action, setAction] = useState('good');
    const [reason, setReason] = useState('transaction_success');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFinalConfirm, setShowFinalConfirm] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); 

    if (!isOpen || !auction || !userProfile) return null;
    const isSeller = userProfile.email === auction.seller_email;
    const targetEmail = isSeller ? auction.winner_email : auction.seller_email;
    const targetName = isSeller ? auction.winner_name : auction.seller_name;
    if (auction.end_time > new Date().toISOString()) return null;

    const handlePreSubmit = () => {
        const score = action === 'good' ? 1 : -1;
        if (score === -1) {
            if (!confirm(`⚠️ ยืนยันหักเครดิตคุณ ${targetName} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;
            submitReputation();
        } else {
            if (auction.is_escrow) { setShowFinalConfirm(true); } 
            else { submitReputation(); }
        }
    };

    const submitReputation = async () => {
        const score = action === 'good' ? 1 : -1;
        setIsSubmitting(true);
        setShowFinalConfirm(false); 
        const { data, error } = await supabase.rpc('submit_reputation', {
            p_auction_id: auction.id, p_reporter_email: userProfile.email, p_target_email: targetEmail,
            p_score_change: score, p_reason_code: reason
        });
        if (error) { alert("Error: " + error.message); setIsSubmitting(false); }
        else { 
            // 🟢🟢🟢 เพิ่ม: แจ้งเตือนผู้ขาย (ว่าจบงานแล้ว + ได้เงิน/เครดิต) 🟢🟢🟢
            if (targetEmail) {
                 await supabase.from('notifications').insert({
                    user_email: targetEmail, // ส่งหาผู้ขาย
                    type: 'transaction_complete',
                    title: '✅ ปิดการขายสำเร็จ!',
                    message: `ผู้ซื้อยืนยันรับสินค้า "${auction.card_name}" แล้ว\nคุณได้รับเครดิต: ${score > 0 ? '+1' : '-1'}`,
                    auction_id: auction.id,
                    is_read: false
                });
            }

            setIsSuccess(true);
            fetchReputations(); 
            setTimeout(() => { setIsSuccess(false); onClose(); }, 2500);
        }
    };

    const BigCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-emerald-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[850] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative" onClick={e => e.stopPropagation()}>
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center h-72 p-6 text-center animate-fade-in-up">
                        <div className="mb-6 animate-bounce"><BigCheckIcon /></div>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-2">ขอบคุณครับ!</h3>
                        <p className="text-slate-500 dark:text-slate-400">คะแนนของคุณช่วยสร้างสังคมให้ดีขึ้น พระอิศวรอวยพรคุณ!!</p>
                    </div>
                ) : (
                    <>
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">ยืนยันธุรกรรม: {auction.card_name}</h3>
                        <button onClick={onClose}>✕</button>
                    </div>
                    <div className="p-5 space-y-5">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                            <p className="text-sm text-slate-700 dark:text-slate-200 font-bold mb-1">📢 คำเตือนก่อนให้คะแนน</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">"โปรดมั่นใจว่าสินค้าที่คุณได้รับนั้นตรงตามที่ผู้ขายโฆษณาไว้จริง<br/>กดเพื่อให้คะแนนเครดิตผู้ขาย เพื่อสังคมเกมการ์ดที่ดีของเราต่อไป"</p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 text-center">ให้เครดิตกับคุณ <span className="font-bold text-slate-900 dark:text-white">{targetName}</span></p>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${action === 'good' ? 'bg-emerald-100 border-emerald-500' : 'bg-slate-100 border-slate-300'}`}><input type="radio" name="score" value="good" checked={action === 'good'} onChange={() => { setAction('good'); setReason('transaction_success'); }} className="mr-2" /><span className="font-bold text-emerald-600">👍 ให้เครดิต (+1)</span></label>
                            <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${action === 'bad' ? 'bg-red-100 border-red-500' : 'bg-slate-100 border-slate-300'}`}><input type="radio" name="score" value="bad" checked={action === 'bad'} onChange={() => { setAction('bad'); setReason('non_payment'); }} className="mr-2" /><span className="font-bold text-red-600">👎 หักเครดิต (-1)</span></label>
                        </div>
                        {action === 'bad' && (<div><label className="text-xs font-bold text-red-500 uppercase mb-1 block">ระบุสาเหตุ</label><select value={reason} onChange={e=>setReason(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 outline-none"><option value="non_payment">ไม่ชำระเงิน / เงียบหาย</option><option value="non_delivery">ผู้ขายไม่จัดส่งสินค้า</option><option value="fake_item">สินค้าไม่ตรงปก / ปลอม</option><option value="cancellation_abuse">ยกเลิกหลังการบิดจบ</option></select></div>)}
                        <button onClick={handlePreSubmit} disabled={isSubmitting} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50">{isSubmitting ? 'กำลังประมวลผล...' : 'ยืนยันและส่งคะแนน'}</button>
                    </div>
                    </>
                )}
            </div>
            {showFinalConfirm && !isSuccess && (
                <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white dark:bg-slate-900 border-[3px] border-red-500 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(239,68,68,0.4)] transform scale-100 animate-bounce-in relative overflow-hidden flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                        <div className="mb-4 animate-pulse"><WarningIcon /></div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">ยืนยันรับสินค้า?</h3>
                        <div className="text-slate-600 dark:text-slate-300 mb-6 space-y-2 text-sm">
                            <p>ท่านได้รับของจริงๆ แล้วใช่ไหม?</p>
                            <p className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800">⚠️ การกดยืนยันนี้จะเป็นการ<br/>อนุมัติเงินประกันให้ผู้ขายทันที</p>
                        </div>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setShowFinalConfirm(false)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">ยกเลิก</button>
                            <button onClick={submitReputation} disabled={isSubmitting} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 transition-transform active:scale-95">{isSubmitting ? 'กำลังโอน...' : 'ยืนยันอนุมัติ'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>, document.body
    );
};

// ✅ Action Confirm Modal (Popup ยืนยันการซื้อ/ประมูล แบบครบเครื่อง)
const ActionConfirmModal = ({ isOpen, onClose, actionData, userBalance, onConfirm, onTopUp }) => {
    const [bidAmount, setBidAmount] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false); // State สำหรับหน้า Success
    
    useEffect(() => { 
        if (isOpen && actionData?.type === 'bid') {
            setBidAmount(actionData.auction.current_price + actionData.auction.min_bid_increment);
        }
        setIsExpanded(false);
        setIsSuccess(false);
    }, [isOpen, actionData]);

    if (!isOpen || !actionData) return null;

    const { type, auction } = actionData;
    const isEscrow = auction.is_escrow;
    const requiredAmount = (type === 'buy' || type === 'buy_market') ? auction.buy_now_price : bidAmount;
    const isInsufficient = isEscrow && (userBalance < requiredAmount);
    const canProceed = !isEscrow || !isInsufficient;

    const BigCheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-emerald-500 drop-shadow-xl">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
    );

    const handleSubmit = async () => { 
        if (!canProceed) return; 
        
        // เรียก function และรอผลลัพธ์
        const result = await onConfirm(type === 'bid' ? bidAmount : null);
        
        // ถ้าสำเร็จ ให้โชว์หน้า Success
        if (result && result.success) {
            setIsSuccess(true);
            setTimeout(() => { onClose(); }, 2500); // ปิดเองใน 2.5 วิ
        } else if (type === 'bid') {
             // กรณี Bid อาจจะ Alert มาแล้ว ให้ปิดเลยก็ได้
             onClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[950] p-4 animate-fade-in" onClick={isSuccess ? undefined : onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
                
                {/* ✅✅✅ หน้าจอสำเร็จ (Success Screen) ✅✅✅ */}
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center h-80 p-6 text-center animate-fade-in-up">
                        <div className="mb-6 animate-bounce">
                            <BigCheckIcon />
                        </div>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-2">
                            {type === 'bid' ? 'บิดสำเร็จ!' : 'ทำรายการสำเร็จ!'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            {type === 'bid' ? 'คุณเป็นผู้นำสูงสุดในขณะนี้' : 'คุณได้เป็นเจ้าของสินค้านี้แล้ว'}
                        </p>
                    </div>
                ) : (
                    // หน้าฟอร์มยืนยันปกติ
                    <>
                        <div className={`p-4 flex items-center gap-3 border-b ${type !== 'bid' ? 'bg-pink-100 dark:bg-pink-900/20 border-pink-200' : 'bg-amber-100 dark:bg-amber-900/20 border-amber-200'}`}>
                            <div className={`p-2 rounded-full ${type !== 'bid' ? 'bg-pink-500' : 'bg-amber-500'} text-white shadow-sm`}>
                                {type !== 'bid' ? <ShoppingBagIcon /> : <GavelIcon />}
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                {type !== 'bid' ? 'ยืนยันการซื้อ (Buy Now)' : 'ยืนยันการประมูล (Bid)'}
                            </h3>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* ข้อมูลสินค้า */}
                            <div className="text-center">
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold mb-1">สินค้า</p>
                                <p className="font-bold text-slate-900 dark:text-white text-xl leading-tight">{auction.card_name}</p>
                            </div>

                            {/* ยอดเงิน */}
                            {type === 'bid' ? (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">ระบุยอดเงินประมูล</label>
                                    <input 
                                        type="number" 
                                        value={bidAmount} 
                                        onChange={e => setBidAmount(parseInt(e.target.value) || 0)} 
                                        className="w-full p-3 bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-slate-600 rounded-xl text-center text-xl font-bold font-mono outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                                    />
                                    <p className="text-xs text-center mt-1 text-slate-500">ขั้นต่ำ: {(auction.current_price + auction.min_bid_increment).toLocaleString()} ฿</p>
                                </div>
                            ) : (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase font-bold">ราคาสินค้า</p>
                                    <p className="text-4xl font-black text-pink-600 dark:text-pink-400 font-mono tracking-tight">
                                        ฿{requiredAmount.toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {/* 🟢 เงื่อนไข & คำเตือน (แยกตามประเภท) */}
                            {isEscrow ? (
                                // กรณี Escrow (ระบบปลอดภัย)
                                <div className={`rounded-xl p-4 border transition-colors ${isInsufficient ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5 text-sm">
                                            <ShieldCheckIcon className="text-blue-500" width="18" /> ระบบ Escrow
                                        </span>
                                        <span className="text-[10px] bg-white dark:bg-black/30 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-300 font-bold">ปลอดภัย 100%</span>
                                    </div>
                                    
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">กระเป๋าของคุณ:</span>
                                            <span className="font-mono font-bold text-slate-700 dark:text-white">฿{userBalance.toLocaleString()}</span>
                                        </div>
                                        {isInsufficient && (
                                            <div className="flex justify-between text-red-600 font-bold border-t border-red-200 dark:border-red-800 pt-1 mt-1">
                                                <span>ยอดเงินขาด:</span>
                                                <span>-฿{(requiredAmount - userBalance).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // 🟡 กรณี Non-Escrow (ระบบตกลงเอง)
                                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 shrink-0"><WarningIcon /></div>
                                        <div>
                                            <p className="font-bold text-amber-700 dark:text-amber-400">รายการนี้ไม่ผ่านคนกลาง</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                คุณต้องติดต่อผู้ขายเพื่อชำระเงินและรับสินค้าด้วยตนเอง
                                            </p>
                                            
                                            {/* ปุ่มอ่านเพิ่มเติม */}
                                            <button onClick={() => setIsExpanded(!isExpanded)} className="text-xs text-amber-600 dark:text-amber-300 underline mt-2 font-bold">
                                                {isExpanded ? "ซ่อนคำเตือน" : "อ่านคำเตือนความปลอดภัย ▾"}
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/50 text-xs space-y-2 text-slate-700 dark:text-slate-300 animate-fade-in">
                                            <p>🚫 <b>ห้ามบิด/สั่งซื้อเล่น:</b> หากกดยืนยันแล้วไม่รับผิดชอบ มีโทษระงับบัญชี</p>
                                            <p>🤝 <b>ความรับผิดชอบ:</b> ทางเว็บไซต์เป็นเพียงสื่อกลาง ไม่รับผิดชอบต่อความเสียหายที่เกิดจากการโอนเงินโดยตรง</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ปุ่มกด */}
                            <div className="flex gap-3 pt-2">
                                {isEscrow && isInsufficient ? (
                                    <button 
                                        onClick={onTopUp} 
                                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 animate-pulse"
                                    >
                                        <span className="text-lg">💰</span> เติมเงิน (Top Up)
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={onClose} className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:brightness-95">
                                            ยกเลิก
                                        </button>
                                        <button 
                                            onClick={handleSubmit} 
                                            className={`flex-1 py-3 font-bold rounded-xl text-white shadow-lg transition-transform active:scale-95 ${type !== 'bid' ? 'bg-pink-600 hover:bg-pink-500' : 'bg-amber-500 hover:bg-amber-600'}`}
                                        >
                                            {type !== 'bid' ? 'ยืนยันทำรายการ' : 'ยืนยันประมูล'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>, 
        document.body
    );
};

// === Main Component ===
export default function AuctionMarket() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useLocalStorage('bot-market-active-tab', 'auction');
  const [managementTab, setManagementTab] = useState('selling'); 

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
  const [actionModalData, setActionModalData] = useState(null); 
  const [isTopUpOpen, setIsTopUpOpen] = useState(false); 
  const [shipmentData, setShipmentData] = useState(null); 

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

  // Effects
  useEffect(() => { const ua = navigator.userAgent || navigator.vendor || window.opera; const isInApp = /(Line|FBAN|FBAV|Instagram|Messenger)/i.test(ua); if (isInApp) { navigate(`/open-browser?redirect=${encodeURIComponent(location.pathname + location.search)}`, { replace: true }); } }, [location, navigate]);
  useEffect(() => { const root = document.documentElement; if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark'); }, [theme]);
  const setTheme = (newTheme) => { setThemeState(newTheme); localStorage.setItem("bot-theme", JSON.stringify(newTheme)); };
  const displayUser = useMemo(() => { if (!userProfile) return null; if (!customProfile) return userProfile; return { ...userProfile, name: customProfile.displayName || userProfile.name, picture: customProfile.avatarUrl || userProfile.picture }; }, [userProfile, customProfile]);
  useEffect(() => { if (userProfile?.email) { const fetchProfile = async () => { try { const docSnap = await getDoc(doc(db, "users", userProfile.email)); if (docSnap.exists()) setCustomProfile(docSnap.data()); } catch (e) { console.error("Profile fetch error", e); } }; fetchProfile(); } }, [userProfile]);
  const fetchReputations = async () => { const { data } = await supabase.from('user_stats').select('user_email, total_score, penalty_level, wallet_balance'); const map = {}; data?.forEach(u => map[u.user_email] = u); setUserReputation(map); };
  useEffect(() => { const channel = supabase.channel('market_balance_update').on('postgres_changes', { event: '*', schema: 'public', table: 'user_stats' }, (payload) => { fetchReputations(); }).subscribe(); return () => { supabase.removeChannel(channel); }; }, []);
  useEffect(() => { fetchReputations(); }, []);
  useEffect(() => { const openFromNoti = async () => { if (location.state?.openAuctionId) { const auctionId = location.state.openAuctionId; let targetAuction = auctions.find(a => a.id === auctionId) || myAuctions.find(a => a.id === auctionId); if (!targetAuction) { const { data } = await supabase.from('auctions').select('*').eq('id', auctionId).single(); if (data) targetAuction = data; } if (targetAuction) { setChatAuction(targetAuction); window.history.replaceState({}, document.title); } } }; openFromNoti(); }, [location, auctions, myAuctions]);
  useEffect(() => { if (activeTab === 'management' && userProfile?.email) { fetchMyAuctions(); } else { fetchAuctions(); } const channel = supabase.channel('public:auctions').on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, () => { if (activeTab === 'management') fetchMyAuctions(); else fetchAuctions(); }).subscribe(); return () => supabase.removeChannel(channel); }, [activeTab, userProfile]);
  
  // 🟢 Fetch Data (Modified Logic)
  async function fetchAuctions() { const now = new Date().toISOString(); const { data } = await supabase.from('auctions').select('*').eq('status', 'active').gt('end_time', now).order('end_time', { ascending: true }); if (data) setAuctions(data); }
  
  // 🟢 รวม Market Listings เข้ามาใน MyAuctions
  async function fetchMyAuctions() {
    if (!userProfile?.email) return;
    
    const { data: auctionData } = await supabase.from('auctions').select('*').or(`seller_email.eq.${userProfile.email},winner_email.eq.${userProfile.email}`);
    const { data: marketData } = await supabase.from('market_listings').select('*').or(`seller_email.eq.${userProfile.email},buyer_email.eq.${userProfile.email}`);

    const mappedMarket = (marketData || []).map(m => ({
        ...m,
        id: m.id,
        card_name: m.title,
        card_image_path: 'CUSTOM_ITEM',
        proof_image: m.images,
        current_price: m.price,
        start_price: m.price,
        buy_now_price: m.price,
        min_bid_increment: 0,
        end_time: m.created_at, // Sort key
        seller_email: m.seller_email,
        seller_name: m.seller_name,
        winner_email: m.buyer_email, // Buyer
        winner_name: m.buyer_name,
        status: m.status, // 'active', 'sold', 'completed'
        is_escrow: m.is_escrow,
        is_shipped: m.is_shipped,
        tracking_number: m.tracking_number,
        type: 'market' // Marker
    }));

    // 4. Merge & Sort
    const combined = [...(auctionData || []), ...mappedMarket].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });
    
    setMyAuctions(combined);
  }
  const filteredAuctions = useMemo(() => { return auctions.filter(item => { const matchName = item.card_name.toLowerCase().includes(searchTerm.toLowerCase()); let matchStatus = true; if (filterStatus === 'active_bid') matchStatus = item.current_price > item.start_price; else if (filterStatus === 'no_bid') matchStatus = item.current_price === item.start_price; return matchName && matchStatus; }).sort((a, b) => { if (sortOption === 'price_asc') return a.current_price - b.current_price; if (sortOption === 'price_desc') return b.current_price - a.current_price; return new Date(a.end_time) - new Date(b.end_time); }); }, [auctions, searchTerm, sortOption, filterStatus]);

  async function handleBid(auction) { if (!userProfile) return alert("กรุณา Login ก่อนครับ"); if (userProfile.email === auction.seller_email) return alert("ห้ามบิดของตัวเองครับ!"); setActionModalData({ type: 'bid', auction }); }
  async function handleBuyNow(auction) { if (!userProfile) return alert("กรุณา Login ก่อนครับ"); if (userProfile.email === auction.seller_email) return alert("ซื้อของตัวเองไม่ได้ครับ"); setActionModalData({ type: 'buy', auction }); }
  // ✅ เพิ่มฟังก์ชันซื้อของตลาดนัด
  async function handleBuyMarketItem(item) {
      if (!userProfile) return alert("กรุณา Login ก่อนครับ");
      if (userProfile.email === item.seller_email) return alert("ซื้อของตัวเองไม่ได้ครับ");
      setActionModalData({ 
          type: 'buy_market', 
          auction: { id: item.id, card_name: item.title, buy_now_price: item.price, is_escrow: true, ...item } 
      });
  }
  
  
  // 🟢 แก้ไข handleFinalSubmit: ลบ Alert, คืนค่า success
  async function handleFinalSubmit(amount) {
    if (!actionModalData) return;
    const { type, auction } = actionModalData;

    if (type === 'bid') {
        const { data, error } = await supabase.rpc('place_bid', { p_auction_id: auction.id, p_bidder_email: userProfile.email, p_bidder_name: displayUser.name, p_amount: amount });
        if (error) alert("Error: " + error.message); 
        else if (!data.success) alert(data.message); 
        else {
            return { success: true }; 
        }
    } 
    else if (type === 'buy') {
        const { data, error } = await supabase.rpc('buy_now_auction', { p_auction_id: auction.id, p_buyer_email: userProfile.email, p_buyer_name: displayUser.name, p_amount: auction.buy_now_price });
        if (error) alert("Error: " + error.message); 
        else if (!data.success) alert(data.message); 
        else { 
            setChatAuction(null); 
            fetchAuctions(); 
            return { success: true }; 
        }
    }
    else if (type === 'buy_market') {
        let rpcName = 'buy_market_item'; 
        if (!auction.is_escrow) rpcName = 'buy_non_escrow_item';

        const { data, error } = await supabase.rpc(rpcName, { 
            p_item_id: auction.id, 
            p_buyer_email: userProfile.email, 
            p_buyer_name: displayUser.name, 
            p_amount: auction.buy_now_price 
        });
        
        if (error) alert("Error: " + error.message); 
        else if (!data.success) alert(data.message); 
        else { 
            fetchMyAuctions(); 
            return { success: true }; 
        }
    }
  }

  async function handleCancel(item) { 
    if (item.type === 'market') {
        if (!confirm("⚠️ ยืนยันการยกเลิกการขาย? (รายการจะถูกลบออกจากตลาด)")) return;
        const { error } = await supabase.from('market_listings').delete().eq('id', item.id);
        if (error) alert("ลบไม่สำเร็จ: " + error.message); else { setMyAuctions(prev => prev.filter(i => i.id !== item.id)); alert("ยกเลิกการขายเรียบร้อย"); }
    } else {
        const isAdmin = userProfile?.email === 'koritros619@gmail.com';
        const confirmMsg = isAdmin ? "👑 Admin Force Cancel:\nยืนยัน?" : "⚠️ ยืนยันการยกเลิกการประมูล?";
        if (!confirm(confirmMsg)) return;
        const { data, error } = await supabase.rpc('cancel_auction', { p_auction_id: item.id, p_user_email: userProfile.email });
        if (error) alert("Error: " + error.message); else if (!data.success) alert(data.message); else { alert(data.message); fetchAuctions(); fetchMyAuctions(); }
    }
  }
  
  async function handleDeleteMyAuction(item, e) { 
      if (e && e.stopPropagation) e.stopPropagation(); 
      if (item.type === 'market') {
           if (!confirm("⚠️ ยืนยันการลบประกาศนี้?")) return;
           const { error } = await supabase.from('market_listings').delete().eq('id', item.id);
           if (error) alert("Error: " + error.message); else setMyAuctions(prev => prev.filter(i => i.id !== item.id));
      } else {
          if (!confirm("⚠️ ยืนยันการลบประวัติรายการนี้ถาวร?")) return; 
          const { error } = await supabase.from('auctions').delete().eq('id', item.id); 
          if (error) alert("Error: " + error.message); else setMyAuctions(prev => prev.filter(i => i.id !== item.id)); 
      }
  }

  const handleLogout = () => { googleLogout(); localStorage.removeItem("bot-userProfile-v1"); setUserProfile(null); navigate('/'); };
  const handleSaveProfile = async (data) => { if (!userProfile) return; try { await setDoc(doc(db, "users", userProfile.email), { displayName: data.displayName, avatarUrl: data.avatarUrl, isSetup: true, updatedAt: serverTimestamp() }, { merge: true }); setCustomProfile(p => ({ ...p, ...data })); setIsProfileModalOpen(false); alert("บันทึกข้อมูลเรียบร้อย!"); } catch (e) { console.error(e); alert("บันทึกไม่สำเร็จ"); } };
  const handleStartAuctionClick = () => { setIsTypeSelectionOpen(true); };
  const handleSelectType = (type) => { setIsTypeSelectionOpen(false); if (type === 'single') { navigate('/', { state: { showAuctionTutorial: true } }); } else { setIsBulkModalOpen(true); } };
  const handleConfirmReceipt = (item) => { if (!item.is_shipped) { return alert("ผู้ขายยังไม่ได้กดส่งสินค้าครับ กรุณารอผู้ขายจัดส่งก่อน"); } setConfirmTransaction({ auction: item }); };

  const handleMarkSold = async (item) => {
      if (!confirm(`ยืนยันว่าขายสินค้านี้แล้ว?\n(รายการจะเปลี่ยนสถานะเป็น "ขายแล้ว")`)) return;
      const { error } = await supabase.from('market_listings').update({ status: 'sold' }).eq('id', item.id);
      if (error) alert(error.message); else { setMyAuctions(prev => prev.map(i => i.id === item.id ? { ...i, status: 'sold' } : i)); }
  };

  const handleTopUpClick = async () => {
    try {
        const { data, error } = await supabase.from('system_config').select('value').eq('key', 'topup_status').single();
        if (error) { setIsTopUpOpen(true); return; } 
        const status = data?.value || 'open';
        if (status === 'maintenance') alert("⚠️ ระบบอยู่ในระหว่างการปรับปรุงค่ะ");
        else if (status === 'closed') alert("⛔ ปิดระบบเติมเงินชั่วคราว");
        else setIsTopUpOpen(true);
    } catch (e) { setIsTopUpOpen(true); }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-100 dark:bg-black text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <style>{` @keyframes fire-2d-glow { 0% { box-shadow: 0 0 5px #ffcc00, 0 0 10px #ff4500; border-color: #ffcc00; } 50% { box-shadow: 0 0 15px #ffd700, 0 0 30px #ff0000; border-color: #ffff00; transform: scale(1.03); } 100% { box-shadow: 0 0 5px #ffcc00, 0 0 10px #ff4500; border-color: #ffcc00; } } .btn-fire { background: linear-gradient(180deg, #ff5500 0%, #cc0000 100%); border: 2px solid #ffcc00; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); animation: fire-2d-glow 1s ease-in-out infinite; position: relative; overflow: hidden; } .btn-fire::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 40%; background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%); pointer-events: none; } .btn-fire:active { transform: scale(0.95); filter: brightness(0.9); } `}</style>
      <Header userProfile={userProfile} displayUser={displayUser} userReputation={userReputation[userProfile?.email]} setIsSettingsOpen={setIsSettingsOpen} setIsAdminOpen={setIsAdminOpen} />
      <div className="flex justify-center mt-4 px-2 md:px-4 shrink-0">
        <div className="flex w-full md:w-auto bg-slate-200 dark:bg-slate-800 rounded-full p-1 shadow-inner overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('auction')} className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'auction' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><GavelIcon /> ลานประมูล</button>
            <button onClick={() => setActiveTab('market')} className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'market' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><ShoppingBagIcon /> ตลาดซื้อขาย</button>
            <button onClick={() => setActiveTab('management')} className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'management' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><PackageIcon /> การจัดการ</button>
        </div>
      </div>

      <main className="flex-grow p-0 md:p-8 w-full pb-40 min-h-[120vh]">
        {activeTab === 'auction' && (
            <div className="animate-fade-in w-full md:px-8">
                <div className="mt-4 mb-6 flex flex-col gap-2 bg-white dark:bg-slate-900/50 p-2 md:p-3 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-sm mx-4 md:mx-0">
                    <div className="relative flex-grow w-full"><div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><input type="text" placeholder="ค้นหาชื่อการ์ด..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all" /></div>
                    <div className="flex flex-col md:flex-row gap-2 md:items-center shrink-0">
                        <div className="flex gap-2 items-center overflow-x-auto pb-1 md:pb-0 no-scrollbar shrink-0"><select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="px-2 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shrink-0"><option value="ending_soon">เวลา</option><option value="price_asc">ถูก➜แพง</option><option value="price_desc">แพง➜ถูก</option></select><div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1 shrink-0"><button onClick={() => setFilterStatus('all')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all shrink-0 ${filterStatus === 'all' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>รวม</button><button onClick={() => setFilterStatus('active_bid')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all shrink-0 ${filterStatus === 'active_bid' ? 'bg-white dark:bg-slate-600 shadow text-red-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>เดือด</button><button onClick={() => setFilterStatus('no_bid')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all shrink-0 ${filterStatus === 'no_bid' ? 'bg-white dark:bg-slate-600 shadow text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>ใหม่</button></div><div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 shrink-0"></div><button onClick={() => setIsCompletedModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-all whitespace-nowrap shrink-0" title="ดูประวัติการประมูลที่จบแล้ว"><HistoryIcon /> <span className="hidden sm:inline">ประวัติ</span></button></div>
                        <button onClick={handleStartAuctionClick} className="w-full md:w-auto flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-emerald-500/30 transition-all active:scale-95 whitespace-nowrap justify-center shrink-0"><span className="text-lg leading-none mb-0.5">+</span> ลงประมูล</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                    {/* Auction Items ... (เหมือนเดิม) */}
                </div>
            </div>
        )}

        {activeTab === 'market' && <FleaMarket userProfile={displayUser} onChat={(item) => setChatAuction(item)} onBuy={handleBuyMarketItem} />}

        {activeTab === 'management' && (
            <ManagementDashboard 
                myAuctions={myAuctions}
                userProfile={userProfile}
                setChatAuction={setChatAuction}
                handleCancel={handleCancel}
                handleMarkSold={handleMarkSold}
                setManageAuction={setManageAuction}
                handleDeleteMyAuction={handleDeleteMyAuction}
                handleConfirmReceipt={handleConfirmReceipt}
                setConfirmTransaction={setConfirmTransaction}
                setShipmentData={setShipmentData}
            />
        )}

      </main>

      {/* All Modals ... */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userProfile={displayUser} onEditProfile={() => setIsProfileModalOpen(true)} onLogout={handleLogout} theme={theme} setTheme={setTheme} onOpenAdmin={() => setIsAdminOpen(true)} userStats={userReputation[userProfile?.email]} onOpenMyDecks={() => setIsDeckListModalOpen(true)} onOpenFeedback={() => setIsFeedbackOpen(true)} />
      <ProfileSetupModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userProfile={userProfile} onSave={handleSaveProfile} />
      <BidHistoryModal isOpen={!!historyAuction} onClose={() => setHistoryAuction(null)} auction={historyAuction} />
      <CompletedAuctionsModal isOpen={isCompletedModalOpen} onClose={() => setIsCompletedModalOpen(false)} userProfile={userProfile} />
      <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} adminEmail={userProfile?.email} />
      <ReportModal isOpen={!!reportTarget} onClose={() => setReportTarget(null)} reporterEmail={userProfile?.email} targetUser={reportTarget?.targetUser} context={reportTarget?.context} />
      <ManageBiddersModal isOpen={!!manageAuction} onClose={() => setManageAuction(null)} auction={manageAuction} userProfile={userProfile} />
      <AuctionRoomModal isOpen={!!chatAuction} onClose={() => setChatAuction(null)} auction={chatAuction} userProfile={displayUser} onBid={handleBid} onBuyNow={handleBuyNow} />
      <ConfirmTransactionModal isOpen={!!confirmTransaction} onClose={() => setConfirmTransaction(null)} auction={confirmTransaction?.auction} userProfile={userProfile} fetchReputations={fetchReputations} onBuyNow={handleBuyNow} />
      <DeckListModal isOpen={isDeckListModalOpen} onClose={() => setIsDeckListModalOpen(false)} userProfile={displayUser} userDecks={userDecks} setUserDecks={setUserDecks} mainDeck={mainDeck} lifeDeck={lifeDeck} setMainDeck={setMainDeck} setLifeDeck={setLifeDeck} cardDb={cardDb} />
      <CreateBulkAuctionModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} userProfile={displayUser} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} userProfile={displayUser} showAlert={(title, msg) => alert(`${title}\n${msg}`)} />
      {!chatAuction && (<ChatWidget userProfile={displayUser} isMobileMenuOpen={isSettingsOpen} />)}
      
      <ActionConfirmModal isOpen={!!actionModalData} onClose={() => setActionModalData(null)} actionData={actionModalData} userBalance={userReputation[userProfile?.email]?.wallet_balance || 0} onConfirm={handleFinalSubmit} onTopUp={() => { setActionModalData(null); handleTopUpClick(); }} />
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} userProfile={displayUser} onSuccess={() => fetchReputations()} />
      <ShipmentModal isOpen={!!shipmentData} onClose={() => setShipmentData(null)} auction={shipmentData} onSuccess={() => { fetchMyAuctions(); fetchAuctions(); }} />
      
      {isTypeSelectionOpen && (createPortal(<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[900] p-4 animate-fade-in" onClick={() => setIsTypeSelectionOpen(false)}><div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 transform scale-100 transition-transform" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold text-center mb-6 text-slate-900 dark:text-white">ต้องการลงขายแบบไหน?</h3><div className="flex flex-col gap-3"><button onClick={() => handleSelectType('single')} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 transition-all group"><div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🃏</div><div className="text-left"><h4 className="font-bold text-slate-900 dark:text-white">การ์ดเดี่ยว (Single)</h4><p className="text-xs text-slate-500 dark:text-slate-400">เลือกการ์ดจากฐานข้อมูล</p></div></button><button onClick={() => handleSelectType('bulk')} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-500 transition-all group"><div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📦</div><div className="text-left"><h4 className="font-bold text-slate-900 dark:text-white">ยกกล่อง / อื่นๆ</h4><p className="text-xs text-slate-500 dark:text-slate-400">ระบุชื่อเอง + ต้องถ่ายรูป</p></div></button></div><button onClick={() => setIsTypeSelectionOpen(false)} className="mt-6 w-full py-2 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">ยกเลิก</button></div></div>, document.body))}
    </div>
  );
}