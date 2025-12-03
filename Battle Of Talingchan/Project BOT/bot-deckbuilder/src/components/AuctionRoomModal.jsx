import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../supabaseClient';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getCardImageUrl } from '../utils/auctionUtils';
import TimeLeft from './TimeLeft';
import RatingBadge from './RatingBadge';
// 🟢 Import GavelIcon และ ShoppingBagIcon เพิ่ม
import { 
    ChevronLeftIcon, ChevronRightIcon, ExpandIcon, 
    ChatBubbleIcon, CloseIcon, SendIcon, GavelIcon, ShoppingBagIcon
} from './Icons';

export default function AuctionRoomModal({ isOpen, onClose, auction, userProfile, onBid, onBuyNow }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);
    const [sellerAvatar, setSellerAvatar] = useState(null);
    const [sellerStats, setSellerStats] = useState(null);
    const [showDesc, setShowDesc] = useState(false);
    const [showFullGallery, setShowFullGallery] = useState(false);
    const [activeProofIndex, setActiveProofIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchMove, setTouchMove] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const minSwipeDistance = 50;

    // ... (ส่วน logic useMemo, useEffect ต่างๆ คงเดิม ไม่มีการเปลี่ยนแปลง) ...
    const allImages = useMemo(() => {
        if (!auction) return [];
        let images = [];
        if (auction.card_image_path && auction.card_image_path !== 'CUSTOM_ITEM') {
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

    const scrollToBottom = () => { setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); };
    const handleSendMessage = async (e) => { e.preventDefault(); if (!newMessage.trim() || !userProfile) return; await supabase.from('auction_comments').insert({ auction_id: auction.id, user_email: userProfile.email, user_name: userProfile.name, user_picture: userProfile.picture, message: newMessage.trim() }); setNewMessage(""); };
    
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

    if (!isOpen || !auction) return null;
    
    const isEnded = auction.status !== 'active' || new Date(auction.end_time) < new Date();
    const isCompleted = auction.status === 'completed'; 
    const isChatDisabled = isCompleted || !userProfile;
    const isOwner = userProfile?.email === auction.seller_email;
    const isRestricted = (auction.status === 'sold' || auction.status === 'completed') && !(isOwner || userProfile?.email === auction.winner_email);

    if (isRestricted) {
        // ... (ส่วน Restricted view คงเดิม) ...
        return (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[700] p-4" onClick={onClose}>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center max-w-sm shadow-2xl border border-red-500/50" onClick={e => e.stopPropagation()}>
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">เนื้อหานี้ถูกจำกัด</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">สินค้านี้อยู่ระหว่างการเจรจาซื้อขาย<br/>อนุญาตให้เฉพาะผู้ซื้อและผู้ขายเข้าถึงได้เท่านั้น</p>
                    <button onClick={onClose} className="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-300 transition-colors">ปิด</button>
                </div>
            </div>
        );
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[700] p-0 md:p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border-0 md:border border-slate-200 dark:border-emerald-500/30 rounded-none md:rounded-xl shadow-2xl w-full h-full md:h-[90vh] max-w-6xl flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Left Side: Images (ส่วนนี้คงเดิม) */}
                <div className="w-full md:w-2/3 h-[50vh] md:h-full flex flex-col bg-slate-100 dark:bg-slate-950 relative group">
                    <button onClick={onClose} className="absolute top-4 left-4 z-20 bg-black/50 text-white p-2 rounded-full md:hidden hover:bg-red-500 transition-colors"><ChevronLeftIcon /></button>
                    <div className="flex-grow relative overflow-hidden bg-black/5 touch-pan-y" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                        <div style={getTrackStyle()}>{allImages.map((img, index) => (<div key={index} className="h-full flex items-center justify-center relative shrink-0" style={{ width: `${100 / allImages.length}%` }}><img src={img} className="max-h-full max-w-full object-contain drop-shadow-2xl select-none pointer-events-none" onClick={(e) => { e.stopPropagation(); setShowFullGallery(true); }} /></div>))}</div>
                        {allImages.length > 1 && (<><button onClick={handlePrev} className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all hidden md:block ${activeProofIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}><ChevronLeftIcon width="24" height="24" /></button><button onClick={handleNext} className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all hidden md:block ${activeProofIndex === allImages.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}><ChevronRightIcon width="24" height="24" /></button></>)}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white p-1.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"><ExpandIcon /></div>
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">{allImages.length > 1 && (<div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-md font-mono border border-white/10">{activeProofIndex + 1} / {allImages.length}</div>)}{(auction.min_bid_increment > 0 && !isEnded) && <TimeLeft endTime={auction.end_time} />}</div>
                        {auction.description && (<div className="absolute bottom-4 left-4 z-20"><button onClick={(e) => { e.stopPropagation(); setShowDesc(true); }} className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-full text-xs backdrop-blur-md flex items-center gap-1 transition-all border border-white/20"><span className="text-lg">📝</span> อ่านรายละเอียด</button></div>)}
                    </div>
                    {showDesc && (<div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in" onClick={(e) => { e.stopPropagation(); setShowDesc(false); }}><div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-slate-700 shadow-2xl relative" onClick={e => e.stopPropagation()}><h3 className="font-bold text-lg mb-4 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">รายละเอียดสินค้า</h3><p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">{auction.description}</p><button onClick={() => setShowDesc(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><CloseIcon/></button></div></div>)}
                    {showFullGallery && (<div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col touch-pan-y" onClick={() => setShowFullGallery(false)} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}><div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50"><div className="text-white font-mono text-sm opacity-80">{activeProofIndex + 1} / {allImages.length}</div><button onClick={() => setShowFullGallery(false)} className="text-white p-2 rounded-full hover:bg-white/10"><CloseIcon /></button></div><div className="flex-grow overflow-hidden relative flex items-center" onClick={(e) => e.stopPropagation()}><div style={getTrackStyle()}>{allImages.map((img, index) => (<div key={index} className="h-full flex items-center justify-center shrink-0" style={{ width: `${100 / allImages.length}%` }}><img src={img} className="max-h-full max-w-full object-contain select-none pointer-events-none" /></div>))}</div>{allImages.length > 1 && (<><button onClick={handlePrev} className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full hidden md:block"><ChevronLeftIcon /></button><button onClick={handleNext} className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full hidden md:block"><ChevronRightIcon /></button></>)}</div></div>)}
                </div>

                {/* Right Side: Chat & Actions */}
                <div className="w-full md:w-1/3 h-[50vh] md:h-full flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-0">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center shrink-0"><h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2"><ChatBubbleIcon /> {auction.status === 'sold' ? 'Private Chat' : 'Live Chat'}</h3><button onClick={onClose} className="hidden md:block text-slate-400 hover:text-red-500"><CloseIcon /></button></div>
                    <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800"><div className="flex items-start gap-3"><img src={sellerAvatar || `https://ui-avatars.com/api/?name=${auction.seller_name}`} className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 object-cover"/><div className="flex-grow min-w-0"><div className="flex items-center justify-between"><span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[120px]">{auction.seller_name}</span>{sellerStats && <RatingBadge score={sellerStats.total_score} />}</div><p className="text-[10px] text-slate-400 mt-0.5">สถานะ: {auction.status === 'sold' ? '🔴 ขายแล้ว' : '🟢 กำลังขาย'}</p></div></div></div>
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

                    {/* 🔥 Action Bar with New Buttons & Icons */}
                    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-emerald-500/20">
                         <div className="flex items-center justify-between mb-3">
                            <div><span className="text-[10px] text-slate-500 uppercase">{auction.type === 'market' ? 'Price' : 'Current Bid'}</span><div className="text-xl font-black text-slate-900 dark:text-white">฿{auction.current_price.toLocaleString()}</div></div>
                            
                            {/* Buttons */}
                            {userProfile?.email !== auction.seller_email && !isEnded && (
                                <div className="flex gap-2">
                                    {auction.buy_now_price > 0 && (
                                        <button 
                                            onClick={() => onBuyNow(auction)} 
                                            className="btn-glossy px-3 py-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-black shadow-lg shadow-emerald-500/30 border-t border-white/20 flex items-center justify-center gap-1.5"
                                        >
                                            {/* 🟢 ใช้ ShoppingBagIcon */}
                                            <ShoppingBagIcon className="w-5 h-5 drop-shadow-sm" />
                                            <span>Buy ฿{auction.buy_now_price.toLocaleString()}</span>
                                        </button>
                                    )}
                                    {(auction.min_bid_increment > 0) && (
                                        <button 
                                            onClick={() => onBid(auction)} 
                                            className="btn-glossy px-4 py-1.5 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 text-white text-xs font-black shadow-lg shadow-orange-500/30 border-t border-white/20 flex items-center justify-center gap-1.5"
                                        >
                                            {/* 🟢 ใช้ GavelIcon */}
                                            <GavelIcon className="w-5 h-5 drop-shadow-sm" />
                                            <span>Bid +{auction.min_bid_increment.toLocaleString()}</span>
                                            {/* Pulse Dot */}
                                            <span className="absolute top-1 right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span></span>
                                        </button>
                                    )}
                                </div>
                            )}
                         </div>
                         <form onSubmit={handleSendMessage} className="flex gap-2"><input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={isChatDisabled ? "🔒 การสนทนาถูกปิด" : "พิมพ์ข้อความ..."} disabled={isChatDisabled} className={`flex-grow bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 ${isChatDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} /><button type="submit" disabled={!newMessage.trim() || isChatDisabled} className={`p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-colors ${isChatDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}><SendIcon /></button></form>
                    </div>
                </div>
            </div>
        </div>, document.body
    );
}