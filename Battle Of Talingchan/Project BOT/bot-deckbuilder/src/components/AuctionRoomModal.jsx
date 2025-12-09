import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../supabaseClient';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getCardImageUrl } from '../utils/auctionUtils';
import TimeLeft from './TimeLeft';
import RatingBadge from './RatingBadge';
import { 
    ChevronLeftIcon, ChevronRightIcon, ExpandIcon, 
    ChatBubbleIcon, CloseIcon, SendIcon, GavelIcon, ShoppingBagIcon,
    CoinIcon 
} from './Icons';
import UserBadge from './UserBadge';
import UserProfilePopup from './UserProfilePopup';

export default function AuctionRoomModal({ isOpen, onClose, auction, userProfile, onBid, onBuyNow }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);
    const [sellerAvatar, setSellerAvatar] = useState(null);
    const [showDesc, setShowDesc] = useState(false);
    const [showFullGallery, setShowFullGallery] = useState(false);
    const [activeProofIndex, setActiveProofIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchMove, setTouchMove] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const minSwipeDistance = 50;

    const [bidders, setBidders] = useState([]);
    const [showBidders, setShowBidders] = useState(false);
    
    const [selectedProfileId, setSelectedProfileId] = useState(null);

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
            };
            fetchData();
        }
    }, [isOpen, auction]);

    useEffect(() => {
        if (isOpen && auction && auction.type !== 'market') {
            const fetchBidders = async () => {
                const { data } = await supabase
                    .from('bids')
                    .select('bidder_email, bidder_name, amount, created_at')
                    .eq('auction_id', auction.id)
                    .order('amount', { ascending: false });
                
                if (data) setBidders(data);
            };
            fetchBidders();

            const bidChannel = supabase.channel(`bids_list:${auction.id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids', filter: `auction_id=eq.${auction.id}` }, () => {
                    fetchBidders();
                })
                .subscribe();
            
            return () => supabase.removeChannel(bidChannel);
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

    const handleSendMessage = async (e) => { 
        e.preventDefault(); 
        if (!newMessage.trim() || !userProfile) return; 
        
        const msgContent = newMessage.trim();
        await supabase.from('auction_comments').insert({ 
            auction_id: auction.id, 
            user_email: userProfile.email, 
            user_name: userProfile.name, 
            user_picture: userProfile.picture, 
            message: msgContent 
        }); 
        
        setNewMessage("");

        try {
            const isSeller = userProfile.email === auction.seller_email;
            const notiTitle = `💬 ข้อความใหม่จาก ${userProfile.name}`;
            const notiMsg = `ในรายการ "${auction.card_name}": ${msgContent}`;

            if (!isSeller) {
                await supabase.from('notifications').insert({
                    user_email: auction.seller_email, type: 'chat', title: notiTitle, message: notiMsg, auction_id: auction.id, is_read: false
                });
            } else {
                const { data: chatHistory } = await supabase.from('auction_comments').select('user_email').eq('auction_id', auction.id).neq('user_email', userProfile.email);
                if (chatHistory && chatHistory.length > 0) {
                    const uniqueEmails = [...new Set(chatHistory.map(c => c.user_email))];
                    const notifications = uniqueEmails.map(email => ({ user_email: email, type: 'chat', title: `💬 ข้อความใหม่จากผู้ขาย`, message: notiMsg, auction_id: auction.id, is_read: false }));
                    if (notifications.length > 0) await supabase.from('notifications').insert(notifications);
                }
            }
        } catch (err) { console.error(err); }
    };
    
    const handleNext = (e) => { e?.stopPropagation(); if(activeProofIndex < allImages.length - 1) setActiveProofIndex(prev => prev + 1); };
    const handlePrev = (e) => { e?.stopPropagation(); if(activeProofIndex > 0) setActiveProofIndex(prev => prev - 1); };
    const onTouchStart = (e) => { setIsSwiping(true); setTouchStart(e.targetTouches[0].clientX); };
    const onTouchMove = (e) => { setTouchMove(e.targetTouches[0].clientX - touchStart); };
    const onTouchEnd = () => { setIsSwiping(false); if (touchMove < -minSwipeDistance) handleNext(); else if (touchMove > minSwipeDistance) handlePrev(); setTouchMove(0); };
    const getTrackStyle = () => { const count = allImages.length || 1; const percentagePerSlide = 100 / count; const baseTranslate = activeProofIndex * percentagePerSlide; const translateValue = isSwiping ? `calc(-${baseTranslate}% + ${touchMove}px)` : `-${baseTranslate}%`; return { transform: `translateX(${translateValue})`, transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)', width: `${count * 100}%`, display: 'flex', height: '100%' }; };

    if (!isOpen || !auction) return null;
    
    // 🟢 ตรวจสอบสถานะ: มีการตกลงซื้อขายแล้วหรือไม่ (ไม่ใช่ Active และ ไม่ใช่ Cancelled)
    const isOwner = userProfile?.email === auction.seller_email;
    const isWinner = userProfile?.email === auction.winner_email;
    const hasWinner = !!auction.winner_email;
    const isActive = auction.status === 'active';
    const isCancelled = auction.status === 'cancelled';
    
    // ดีลเกิดขึ้นแล้ว (Deal Active)
    const isDealActive = hasWinner && !isActive && !isCancelled;

    // 🟢 Lock Room: ถ้าดีลเกิดแล้ว คนอื่นห้ามเข้า
    const isRestricted = isDealActive && !(isOwner || isWinner);

    const isEnded = auction.status !== 'active' || (auction.end_time && new Date(auction.end_time) < new Date());
    const isCompleted = auction.status === 'completed'; 
    const isChatDisabled = isCompleted || !userProfile;
    
    const currentPrice = auction.current_price || auction.price || 0;
    const buyNowPrice = auction.buy_now_price || auction.price || 0;
    const minBid = auction.min_bid_increment || 0;

    if (isRestricted) {
        return (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[700] p-4 animate-fade-in" onClick={onClose}>
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
                
                {/* Left Side: Images */}
                <div className="w-full md:w-2/3 h-[40vh] md:h-full flex flex-col bg-slate-100 dark:bg-slate-950 relative group shrink-0">
                    <button onClick={onClose} className="absolute top-4 left-4 z-20 bg-black/50 text-white p-2 rounded-full md:hidden hover:bg-red-500 transition-colors"><ChevronLeftIcon /></button>
                    <div className="flex-grow relative overflow-hidden bg-black/5 touch-pan-y" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                        {allImages.length > 0 ? (
                            <div style={getTrackStyle()}>{allImages.map((img, index) => (<div key={index} className="h-full flex items-center justify-center relative shrink-0" style={{ width: `${100 / allImages.length}%` }}><img src={img} className="max-h-full max-w-full object-contain drop-shadow-2xl select-none pointer-events-none" onClick={(e) => { e.stopPropagation(); setShowFullGallery(true); }} /></div>))}</div>
                        ) : (
                             <div className="h-full flex items-center justify-center text-slate-400">ไม่มีรูปภาพ</div>
                        )}
                        
                        {allImages.length > 1 && (<><button onClick={handlePrev} className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all hidden md:block ${activeProofIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}><ChevronLeftIcon width="24" height="24" /></button><button onClick={handleNext} className={`absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-all hidden md:block ${activeProofIndex === allImages.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}><ChevronRightIcon width="24" height="24" /></button></>)}
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white p-1.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"><ExpandIcon /></div>
                        
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">{allImages.length > 1 && (<div className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-md font-mono border border-white/10">{activeProofIndex + 1} / {allImages.length}</div>)}{(minBid > 0 && !isEnded && auction.end_time) && <TimeLeft endTime={auction.end_time} />}</div>
                        {auction.description && (<div className="absolute bottom-4 left-4 z-20"><button onClick={(e) => { e.stopPropagation(); setShowDesc(true); }} className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-full text-xs backdrop-blur-md flex items-center gap-1 transition-all border border-white/20"><span className="text-lg">📝</span> อ่านรายละเอียด</button></div>)}
                    </div>
                    {showDesc && (<div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in" onClick={(e) => { e.stopPropagation(); setShowDesc(false); }}><div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-slate-700 shadow-2xl relative" onClick={e => e.stopPropagation()}><h3 className="font-bold text-lg mb-4 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">รายละเอียดสินค้า</h3><p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">{auction.description}</p><button onClick={() => setShowDesc(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><CloseIcon/></button></div></div>)}
                    {showFullGallery && (<div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col touch-pan-y" onClick={() => setShowFullGallery(false)} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}><div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50"><div className="text-white font-mono text-sm opacity-80">{activeProofIndex + 1} / {allImages.length}</div><button onClick={() => setShowFullGallery(false)} className="text-white p-2 rounded-full hover:bg-white/10"><CloseIcon /></button></div><div className="flex-grow overflow-hidden relative flex items-center" onClick={(e) => e.stopPropagation()}><div style={getTrackStyle()}>{allImages.map((img, index) => (<div key={index} className="h-full flex items-center justify-center shrink-0" style={{ width: `${100 / allImages.length}%` }}><img src={img} className="max-h-full max-w-full object-contain select-none pointer-events-none" /></div>))}</div>{allImages.length > 1 && (<><button onClick={handlePrev} className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full hidden md:block"><ChevronLeftIcon /></button><button onClick={handleNext} className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full hidden md:block"><ChevronRightIcon /></button></>)}</div></div>)}
                </div>

                {/* Right Side: Chat & Actions */}
                <div className="w-full md:w-1/3 flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full max-h-[60vh] md:max-h-full">
                    
                    {/* Header - 🟢 เปลี่ยนสีตามสถานะ Deal */}
                    <div className={`p-3 border-b shrink-0 flex justify-between items-center transition-colors duration-300 ${
                        isDealActive 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' 
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                    }`}>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h3 className={`font-bold flex items-center gap-2 ${isDealActive ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200'}`}>
                                    <ChatBubbleIcon /> {isDealActive ? 'Private Chat' : 'Live Chat'}
                                </h3>
                                {auction.type !== 'market' && (
                                    <button 
                                        onClick={() => setShowBidders(!showBidders)} 
                                        className={`ml-2 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${showBidders ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-300'}`}
                                        title="ดูประวัติการบิด"
                                    >
                                        <CoinIcon /> <span>{bidders.length}</span>
                                    </button>
                                )}
                            </div>
                            
                            {/* 🟢 เพิ่มข้อความเล็กๆ บอกให้ติดต่อ */}
                            {isDealActive && (
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 ml-6 font-bold flex items-center gap-1 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {isOwner ? `ติดต่อผู้ซื้อโดยตรง (${auction.winner_name || 'Buyer'})` : `ติดต่อผู้ขายโดยตรง (${auction.seller_name})`}
                                </p>
                            )}
                        </div>
                        <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-red-500"><CloseIcon /></button>
                    </div>

                    {/* Seller Info */}
                    <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <div className="flex items-center justify-between">
                            <UserBadge 
                                email={auction.seller_email}
                                name={auction.seller_name}
                                picture={sellerAvatar}
                                size="md"
                            />
                            <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                สถานะ: {auction.status === 'sold' || auction.status === 'completed' ? '🔴 ขายแล้ว' : '🟢 กำลังขาย'}
                            </span>
                        </div>
                    </div>
                    
                    {/* Content Area (Chat/Bidders) */}
                    {showBidders ? (
                        <div className="flex-grow overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 min-h-0 bg-slate-50 dark:bg-black/20">
                            {/* ... (Bidder List logic same as before) ... */}
                            {bidders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm gap-2"><span className="text-3xl opacity-30">📭</span><p>ยังไม่มีใครบิด</p></div>
                            ) : (
                                <div className="space-y-2">
                                    {bidders.map((b, i) => {
                                        const prevBid = bidders[i + 1] ? bidders[i + 1].amount : auction.start_price;
                                        const isTop = i === 0;
                                        return (
                                            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${isTop ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 shadow-sm' : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm text-white ${isTop ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-slate-400'}`}>{isTop ? '1st' : i + 1}</div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-xs font-bold truncate max-w-[100px] ${isTop ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>{b.bidder_name}</span>
                                                        <span className="text-[9px] text-slate-400">{new Date(b.created_at).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right"><div className={`font-bold font-mono ${isTop ? 'text-lg text-emerald-600 dark:text-emerald-400' : 'text-sm text-slate-600 dark:text-slate-400'}`}>฿{b.amount.toLocaleString()}</div><div className="text-[9px] text-slate-400">(ก่อนหน้า: {prevBid.toLocaleString()})</div></div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 min-h-0">
                            {messages.length === 0 ? (<div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2"><span className="text-4xl opacity-20">💬</span><p>เริ่มการสนทนาได้เลย...</p></div>) : messages.map((msg, i) => {
                                const isSystem = msg.user_email === 'SYSTEM';
                                const isMe = msg.user_email === userProfile?.email;
                                
                                if (isSystem) return <div key={i} className="flex justify-center my-2"><div className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm"><span>🔔</span> {msg.message}</div></div>;
                                
                                return (
                                    <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <div 
                                            className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity self-start mt-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedProfileId(msg.user_email); 
                                            }}
                                            title="ดูโปรไฟล์"
                                        >
                                            <img 
                                                src={msg.user_picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                                                onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                            />
                                        </div>

                                        <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm shadow-sm break-words leading-relaxed ${
                                            isMe 
                                            ? 'bg-emerald-600 text-white rounded-tr-none' 
                                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                                        }`}>
                                            {msg.message}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef}></div>
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-emerald-500/20 shrink-0 pb-safe">
                         <div className="flex items-center justify-between mb-3">
                            <div><span className="text-[10px] text-slate-500 uppercase">{auction.type === 'market' ? 'Price' : 'Current Bid'}</span><div className="text-xl font-black text-slate-900 dark:text-white">฿{currentPrice.toLocaleString()}</div></div>
                            
                            {userProfile?.email !== auction.seller_email && !isEnded && (
                                <div className="flex gap-2">
                                    {buyNowPrice > 0 && (
                                        <button onClick={() => onBuyNow(auction)} className="btn-glossy px-3 py-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-black shadow-lg shadow-emerald-500/30 border-t border-white/20 flex items-center justify-center gap-1.5">
                                            <ShoppingBagIcon className="w-5 h-5 drop-shadow-sm" /><span>Buy ฿{buyNowPrice.toLocaleString()}</span>
                                        </button>
                                    )}
                                    {(minBid > 0) && (
                                        <button onClick={() => onBid(auction)} className="btn-glossy px-4 py-1.5 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 text-white text-xs font-black shadow-lg shadow-orange-500/30 border-t border-white/20 flex items-center justify-center gap-1.5">
                                            <GavelIcon className="w-5 h-5 drop-shadow-sm" /><span>Bid +{minBid.toLocaleString()}</span><span className="absolute top-1 right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span></span>
                                        </button>
                                    )}
                                </div>
                            )}
                         </div>
                         <form onSubmit={handleSendMessage} className="flex gap-2">
                             <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={isChatDisabled ? "🔒 การสนทนาถูกปิด" : "พิมพ์ข้อความ..."} disabled={isChatDisabled} className={`flex-grow bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-base md:text-sm text-black dark:text-white outline-none focus:ring-1 focus:ring-emerald-500 ${isChatDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} />
                             <button type="submit" disabled={!newMessage.trim() || isChatDisabled} className={`p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-colors ${isChatDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}><SendIcon /></button>
                         </form>
                    </div>
                </div>
            </div>

            <UserProfilePopup 
                isOpen={!!selectedProfileId} 
                onClose={() => setSelectedProfileId(null)} 
                userId={selectedProfileId} 
            />

        </div>, document.body
    );
}