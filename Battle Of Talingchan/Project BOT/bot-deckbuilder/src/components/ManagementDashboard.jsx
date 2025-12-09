import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    ShieldCheckIcon, BanIcon, CheckIcon, TrashIcon, 
    ChatBubbleIcon, TruckIcon, GavelIcon, CloseIcon, UploadIcon, CameraIcon
} from './Icons';
import { supabase } from '../supabaseClient'; 
import TimeLeft from './TimeLeft';

// 🟢 Popup Component
const DashboardPopup = ({ isOpen, onClose, title, message, type, onConfirm, isLoading }) => {
    if (!isOpen) return null;
    
    let icon = <div className="text-4xl text-blue-500">ℹ️</div>;
    let colorClass = "border-slate-300";
    let btnClass = "bg-slate-800 hover:bg-slate-700";

    if (type === 'success') {
        icon = <div className="text-4xl animate-bounce">✅</div>;
        colorClass = "border-emerald-500";
        btnClass = "bg-emerald-600 hover:bg-emerald-500";
    } else if (type === 'error') {
        icon = <div className="text-4xl animate-pulse">❌</div>;
        colorClass = "border-red-500";
        btnClass = "bg-red-600 hover:bg-red-500";
    } else if (type === 'confirm') {
        icon = <div className="text-4xl animate-pulse">⚠️</div>;
        colorClass = "border-amber-500";
        btnClass = "bg-amber-500 hover:bg-amber-600";
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-fade-in" onClick={e => { e.stopPropagation(); if(type !== 'confirm') onClose(); }}>
            <div className={`bg-white dark:bg-slate-900 border-[3px] ${colorClass} rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center transform scale-100 transition-all`} onClick={e => e.stopPropagation()}>
                <div className="mb-4">{icon}</div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{title}</h3>
                <div className="text-slate-600 dark:text-slate-300 mb-6 text-sm whitespace-pre-wrap leading-relaxed">
                    {message}
                </div>
                <div className="flex gap-3 w-full">
                    {type === 'confirm' && (
                        <button onClick={(e) => { e.stopPropagation(); onClose(); }} disabled={isLoading} className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                            ยกเลิก
                        </button>
                    )}
                    <button 
                        onClick={(e) => { e.stopPropagation(); if (onConfirm) onConfirm(); else onClose(); }} 
                        disabled={isLoading}
                        className={`flex-1 py-2.5 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 ${btnClass} ${type !== 'confirm' ? 'w-full' : ''}`}
                    >
                        {isLoading ? 'กำลังดำเนินการ...' : 'ตกลง'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const getAuctionThumbnail = (item) => {
    if (item.card_image_path === 'CUSTOM_ITEM') {
        try { const images = JSON.parse(item.proof_image); return images[0] || 'https://placehold.co/300x420/1e293b/ffffff?text=No+Image'; } catch { return 'https://placehold.co/300x420/1e293b/ffffff?text=Error'; }
    }
    if (!item.card_image_path || !item.card_id) return '';
    const fileId = item.card_id.replace(' - Only#1', '');
    const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
    return `/cards/${encodePath(item.card_image_path)}/${encodeURIComponent(fileId)}.png`;
};

const getStatusColor = (status, isShipped) => {
    if (status === 'completed') return 'bg-emerald-500';
    if (status === 'cancelled' || status === 'payment_rejected') return 'bg-red-500';
    if (status === 'waiting_seller_confirmation') return 'bg-amber-500';
    if (status === 'verifying_payment') return 'bg-blue-500';
    if (status === 'pending_ship') return 'bg-indigo-500';
    if (isShipped) return 'bg-blue-600';
    return 'bg-amber-500';
};

const getStatusLabel = (status, isShipped) => {
    if (status === 'completed') return '✅ สำเร็จ';
    if (status === 'cancelled') return '❌ ยกเลิก';
    if (status === 'waiting_seller_confirmation') return '⏳ รอยืนยัน';
    if (status === 'verifying_payment') return '🔎 ตรวจสลิป';
    if (status === 'payment_rejected') return '❌ สลิปผิด';
    if (status === 'pending_ship') return '📦 รอจัดส่ง';
    if (isShipped) return '🚚 ส่งแล้ว';
    return '📦 รอจัดส่ง';
};

export default function ManagementDashboard({ 
    myAuctions, 
    userProfile, 
    setChatAuction, 
    handleCancel, 
    handlePenaltyCancel, 
    handleDeleteMyAuction, 
    handleConfirmReceipt, 
    setShipmentData,
    handleForceEnd,
    onRefresh 
}) {
    const [managementTab, setManagementTab] = useState('selling'); 
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [popup, setPopup] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null, isLoading: false });

    const openPopup = (title, message, type = 'info', onConfirm = null) => {
        setPopup({ isOpen: true, title, message, type, onConfirm, isLoading: false });
    };

    // Counters
    const sellingBadge = myAuctions.filter(i => i.seller_email === userProfile?.email && ['waiting_seller_confirmation', 'verifying_payment'].includes(i.status)).length;
    const buyingBadge = myAuctions.filter(i => i.winner_email === userProfile?.email && (['pending_payment', 'payment_rejected'].includes(i.status) || (i.is_shipped && i.status !== 'completed'))).length;
    const shippingBadge = myAuctions.filter(i => i.seller_email === userProfile?.email && (['pending_ship', 'sold'].includes(i.status) || (i.status === 'ended' && i.winner_email)) && !i.is_shipped).length;

    const handleSellerConfirmSale = (item) => {
        openPopup("ยืนยันการขาย", `ต้องการขายให้กับคุณ "${item.winner_name}" ใช่หรือไม่?\n(ผู้ซื้อจะมีเวลา 24 ชม. ในการโอนเงิน)`, 'confirm', async () => {
            setPopup(p => ({ ...p, isLoading: true }));
            const dueDate = new Date(); dueDate.setHours(dueDate.getHours() + 24);
            const table = item.type === 'market' ? 'market_listings' : 'auctions';
            const { error } = await supabase.from(table).update({ status: 'pending_payment', payment_due_date: dueDate.toISOString() }).eq('id', item.id);
            setPopup(p => ({ ...p, isLoading: false, isOpen: false }));
            if (error) openPopup("Error", error.message, 'error');
            else {
                await supabase.from('notifications').insert({ user_email: item.winner_email, type: 'seller_confirmed', title: '✅ ผู้ขายยืนยันการขายแล้ว', message: `กรุณาโอนเงินภายใน 24 ชม. สำหรับรายการ "${item.card_name}"`, auction_id: item.id });
                if (onRefresh) onRefresh();
                openPopup("สำเร็จ", "ยืนยันเรียบร้อย รอผู้ซื้อโอนเงิน", 'success');
            }
        });
    };

    const handleSellerRejectSale = (item) => {
        openPopup("ปฏิเสธการขาย", "ยืนยันที่จะปฏิเสธรายการนี้?\nคุณจะถูก 'หักเครดิตความน่าเชื่อถือ' และรายการจะถูกยกเลิก", 'confirm', async () => {
            setPopup(p => ({ ...p, isLoading: true }));
            const { data, error } = await supabase.rpc('cancel_order_with_penalty', { p_item_id: item.id, p_seller_email: userProfile.email });
            setPopup(p => ({ ...p, isLoading: false, isOpen: false }));
            if (error) openPopup("Error", error.message, 'error');
            else {
                openPopup("เรียบร้อย", data.message, 'info');
                if (onRefresh) onRefresh();
            }
        });
    };

    const handleUploadSlip = async (e, item) => {
        e.stopPropagation(); // 🟢 สำคัญ: หยุด event ที่ input file
        const file = e.target.files[0];
        if (!file) return;
        
        openPopup("ยืนยันส่งสลิป", "ต้องการส่งรูปนี้เป็นหลักฐานการโอนเงินใช่หรือไม่?", 'confirm', async () => {
            setPopup(p => ({ ...p, isLoading: true }));
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `slip_${item.id}_${Date.now()}.${fileExt}`;
                const filePath = `payment_slips/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('auction-images').upload(filePath, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('auction-images').getPublicUrl(filePath);
                
                const table = item.type === 'market' ? 'market_listings' : 'auctions';
                await supabase.from(table).update({ status: 'verifying_payment', payment_slip_url: data.publicUrl }).eq('id', item.id);
                
                setPopup(p => ({ ...p, isLoading: false, isOpen: false }));
                openPopup("สำเร็จ", "ส่งสลิปเรียบร้อย รอผู้ขายตรวจสอบ", 'success');
                if (onRefresh) onRefresh();
            } catch (err) {
                console.error(err);
                setPopup(p => ({ ...p, isLoading: false, isOpen: false }));
                openPopup("ล้มเหลว", "อัปโหลดไม่สำเร็จ: " + err.message, 'error');
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = ""; 
            }
        });
    };

    const handleVerifySlip = (item, isCorrect) => {
        const table = item.type === 'market' ? 'market_listings' : 'auctions';
        if (isCorrect) {
            openPopup("ยืนยันสลิปถูกต้อง", "หลักฐานการโอนถูกต้องและได้รับเงินแล้ว?\n(สถานะจะเปลี่ยนเป็น 'รอจัดส่ง')", 'confirm', async () => {
                setPopup(p => ({ ...p, isLoading: true }));
                await supabase.from(table).update({ status: 'pending_ship' }).eq('id', item.id); 
                setPopup(p => ({ ...p, isLoading: false, isOpen: false }));
                openPopup("บันทึกแล้ว", "กรุณาจัดส่งสินค้าตามกำหนด", 'success');
                if (onRefresh) onRefresh();
            });
        } else {
            openPopup("ปฏิเสธสลิป", "หลักฐานไม่ถูกต้อง หรือไม่ได้รับยอดเงิน?\n(ระบบจะแจ้งให้ผู้ซื้อส่งใหม่)", 'confirm', async () => {
                setPopup(p => ({ ...p, isLoading: true }));
                await supabase.from(table).update({ status: 'payment_rejected' }).eq('id', item.id);
                await supabase.from('notifications').insert({ user_email: item.winner_email, type: 'slip_rejected', title: '❌ สลิปไม่ถูกต้อง', message: `ผู้ขายปฏิเสธสลิปของคุณในรายการ "${item.card_name}" กรุณาตรวจสอบและส่งใหม่`, auction_id: item.id });
                setPopup(p => ({ ...p, isLoading: false, isOpen: false }));
                openPopup("ดำเนินการแล้ว", "ระบบแจ้งเตือนผู้ซื้อให้ส่งใหม่แล้ว", 'info');
                if (onRefresh) onRefresh();
            });
        }
    };

    // Wrapper สำหรับปุ่มทั่วไป
    const onBtnClick = (e, callback) => {
        e.stopPropagation(); // 🟢 หัวใจสำคัญ: หยุด Event ที่ปุ่ม
        callback();
    };

    return (
        <div className="animate-fade-in w-full md:px-8">
            <div className="flex justify-center mb-6 mt-6">
                <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-lg flex gap-2 overflow-visible relative z-10">
                    {['selling', 'buying', 'to-ship'].map(tab => (
                        <button key={tab} onClick={() => setManagementTab(tab)} className={`relative px-4 py-2 rounded-md text-xs font-bold transition-all capitalize ${managementTab === tab ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                            {tab === 'selling' ? 'สินค้าที่ลงขาย' : tab === 'buying' ? 'สินค้าที่ซื้อ' : 'สินค้าต้องจัดส่ง'}
                            {tab === 'selling' && sellingBadge > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-white dark:border-slate-900"></span>}
                            {tab === 'buying' && buyingBadge > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-white dark:border-slate-900"></span>}
                            {tab === 'to-ship' && shippingBadge > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-white dark:border-slate-900"></span>}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                
                {/* Selling Tab */}
                {managementTab === 'selling' && myAuctions.filter(i => i.seller_email === userProfile?.email).map(item => {
                    const isCompleted = item.status === 'completed';
                    const isCancelled = item.status === 'cancelled';
                    const isWaitingConfirm = item.status === 'waiting_seller_confirmation';
                    const isVerifying = item.status === 'verifying_payment';
                    const isPendingPay = item.status === 'pending_payment';
                    const isPendingShip = item.status === 'pending_ship' || item.status === 'sold';
                    return (
                        <div key={item.id} className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative group`} onClick={() => setChatAuction(item)}>
                            <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-4 flex items-center justify-center">
                                <img src={getAuctionThumbnail(item)} className={`w-full h-full object-cover drop-shadow-md ${isCompleted || isCancelled ? 'grayscale opacity-50' : ''}`} onError={(e) => { e.currentTarget.src = "https://placehold.co/300x400?text=No+Image"; }} />
                                {isCompleted && <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"><div className="border-[5px] border-emerald-500 text-emerald-500 text-3xl font-black px-4 py-2 rounded-xl transform -rotate-12 uppercase tracking-widest bg-white/80 backdrop-blur-sm shadow-2xl mix-blend-normal">SUCCESS</div></div>}
                                {isCancelled && <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"><div className="border-[5px] border-slate-600 text-slate-600 text-2xl font-black px-4 py-2 rounded-xl transform -rotate-12 uppercase tracking-widest bg-white/70 backdrop-blur-sm shadow-xl">CANCELLED</div></div>}
                                <div className={`absolute bottom-2 left-2 right-2 text-center text-xs font-bold py-1 rounded shadow text-white ${getStatusColor(item.status, item.is_shipped)}`}>
                                    {getStatusLabel(item.status, item.is_shipped)}
                                </div>
                            </div>
                            <div className="p-3 flex-1 flex flex-col gap-2">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{item.card_name}</h3>
                                <div className="text-center font-mono font-black text-xl text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 rounded py-1">฿{item.current_price.toLocaleString()}</div>
                                <div onClick={e => e.stopPropagation()} className="mt-auto space-y-2">
                                    {isWaitingConfirm && (<div className="flex flex-col gap-2"><button onClick={(e) => onBtnClick(e, () => handleSellerConfirmSale(item))} className="w-full py-2 bg-emerald-500 text-white rounded font-bold text-xs hover:bg-emerald-600 shadow-lg animate-pulse">✅ ยืนยันขาย</button><button onClick={(e) => onBtnClick(e, () => handleSellerRejectSale(item))} className="w-full py-1 bg-red-100 text-red-600 rounded font-bold text-[10px] hover:bg-red-200">❌ ปฏิเสธ (เสียเครดิต)</button></div>)}
                                    {isPendingPay && item.payment_due_date && (<div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800 flex flex-col items-center"><p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mb-1">⏳ ลูกค้าต้องโอนภายใน:</p><div className="scale-90"><TimeLeft endTime={item.payment_due_date} /></div></div>)}
                                    {isVerifying && (<div className="flex flex-col gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"><p className="text-[10px] text-center font-bold text-blue-600 dark:text-blue-300">🔎 ผู้ซื้อส่งสลิปมาแล้ว</p><a href={item.payment_slip_url} onClick={e => e.stopPropagation()} target="_blank" className="block w-full h-20 bg-slate-200 rounded overflow-hidden relative group"><img src={item.payment_slip_url} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">คลิกดูรูป</div></a><div className="flex gap-1"><button onClick={(e) => onBtnClick(e, () => handleVerifySlip(item, true))} className="flex-1 py-1.5 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600">ถูก ✅</button><button onClick={(e) => onBtnClick(e, () => handleVerifySlip(item, false))} className="flex-1 py-1.5 bg-red-500 text-white text-xs rounded hover:bg-red-600">ผิด ❌</button></div></div>)}
                                    {isPendingShip && !item.is_shipped && (<div className="flex flex-col gap-2"><div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded text-center border border-indigo-200 dark:border-indigo-800"><p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300">📦 สถานะ: รอการจัดส่ง</p><p className="text-[9px] text-slate-500">กรุณาจัดส่งและแจ้งเลขพัสดุ (Tab: สินค้าต้องจัดส่ง)</p></div><button onClick={(e) => onBtnClick(e, () => setShipmentData(item))} className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow flex justify-center items-center gap-1 animate-pulse"><TruckIcon /> แจ้งส่งสินค้า</button></div>)}
                                    {!isWaitingConfirm && !isVerifying && !isPendingShip && !isCompleted && !isCancelled && item.status === 'active' && (<button onClick={(e) => onBtnClick(e, () => handleCancel(item))} className="w-full py-1.5 bg-red-100 text-red-600 rounded text-xs font-bold">ยกเลิกขาย</button>)}
                                    <button onClick={(e) => onBtnClick(e, () => setChatAuction(item))} className="w-full py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-bold flex justify-center items-center gap-1"><ChatBubbleIcon /> แชท</button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Buying Tab */}
                {managementTab === 'buying' && myAuctions.filter(i => i.winner_email === userProfile?.email).map(item => {
                     const isWaitingSeller = item.status === 'waiting_seller_confirmation';
                     const isPendingPay = item.status === 'pending_payment';
                     const isRejected = item.status === 'payment_rejected';
                     const isVerifying = item.status === 'verifying_payment';
                     const isPendingShip = item.status === 'pending_ship' || item.status === 'sold';
                     const isShipped = item.is_shipped;
                     const isCompleted = item.status === 'completed';
                     const isCancelled = item.status === 'cancelled';
                     return (
                        <div key={item.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative group" onClick={() => setChatAuction(item)}>
                            <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-4 flex items-center justify-center">
                                <img src={getAuctionThumbnail(item)} className="w-full h-full object-cover drop-shadow-md" onError={(e) => { e.currentTarget.src = "https://placehold.co/300x400?text=No+Image"; }} />
                                {isCompleted && <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"><div className="border-[5px] border-emerald-500 text-emerald-500 text-3xl font-black px-4 py-2 rounded-xl transform -rotate-12 uppercase tracking-widest bg-white/80 backdrop-blur-sm shadow-2xl mix-blend-normal">SUCCESS</div></div>}
                                {isCancelled && <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"><div className="border-[5px] border-slate-600 text-slate-600 text-2xl font-black px-4 py-2 rounded-xl transform -rotate-12 uppercase tracking-widest bg-white/70 backdrop-blur-sm shadow-xl">CANCELLED</div></div>}
                                <div className={`absolute bottom-2 left-2 right-2 text-center text-xs font-bold py-1 rounded shadow text-white ${getStatusColor(item.status, item.is_shipped)}`}>
                                    {getStatusLabel(item.status, item.is_shipped)}
                                </div>
                            </div>
                            <div className="p-3 flex-1 flex flex-col gap-2">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{item.card_name}</h3>
                                <div className="text-center font-mono font-black text-xl text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded py-1">฿{item.current_price.toLocaleString()}</div>
                                <div onClick={e => e.stopPropagation()} className="mt-auto space-y-2">
                                    {isWaitingSeller && (<div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded border border-amber-200 dark:border-amber-800 text-[10px] text-amber-800 dark:text-amber-200 text-center leading-tight">⏳ รอผู้ขายยืนยันการขาย<br/>(หากเกิน 24 ชม. ผู้ขายอาจยกเลิกได้)</div>)}
                                    {(isPendingPay || isRejected) && (<div className="space-y-2">{isRejected && <p className="text-xs text-red-500 font-bold text-center animate-pulse">❌ สลิปไม่ถูกต้อง โปรดส่งใหม่</p>}{item.payment_due_date && (<div className="flex flex-col items-center bg-slate-100 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700"><span className="text-[10px] text-red-500 font-bold mb-1">⏰ ต้องโอนภายใน:</span><TimeLeft endTime={item.payment_due_date} /></div>)}<button onClick={(e) => onBtnClick(e, () => fileInputRef.current.click())} className="w-full py-2 bg-blue-600 text-white rounded font-bold text-xs hover:bg-blue-500 shadow flex items-center justify-center gap-1"><UploadIcon /> {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดสลิป"}</button><input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => handleUploadSlip(e, item)} /></div>)}
                                    {isVerifying && (<div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-xs text-blue-600 dark:text-blue-300 text-center font-bold">🔎 รอผู้ขายตรวจสอบสลิป...</div>)}
                                    {isPendingShip && !isShipped && (<div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded text-xs text-indigo-600 dark:text-indigo-300 text-center font-bold">📦 ผู้ขายกำลังจัดส่ง...</div>)}
                                    {isShipped && (<div className="space-y-2"><button onClick={(e) => onBtnClick(e, () => setShipmentData(item))} className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"><TruckIcon /> ดูหลักฐานการส่ง</button>{item.status !== 'completed' && (<button onClick={(e) => onBtnClick(e, () => handleConfirmReceipt(item))} className="w-full py-2 bg-emerald-500 text-white rounded font-bold text-xs hover:bg-emerald-600 shadow animate-pulse flex items-center justify-center gap-1"><CheckIcon /> ยืนยันรับสินค้า</button>)}</div>)}
                                    {isCompleted && !isShipped && (<button disabled className="w-full py-1.5 bg-slate-400 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-not-allowed">✅ ได้รับสินค้าแล้ว</button>)}
                                    {isCancelled && (<button disabled className="w-full py-1.5 bg-red-100 text-red-500 rounded-lg text-xs font-bold cursor-not-allowed">❌ รายการถูกยกเลิก</button>)}
                                    <button onClick={(e) => onBtnClick(e, () => setChatAuction(item))} className="w-full py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold flex justify-center items-center gap-1"><ChatBubbleIcon /> แชท</button>
                                </div>
                            </div>
                        </div>
                     );
                })}

                {/* To Ship Tab */}
                {managementTab === 'to-ship' && myAuctions.filter(i => i.seller_email === userProfile?.email && i.winner_email && (i.status === 'pending_ship' || i.status === 'shipped' || i.status === 'sold' || (i.status === 'ended' && i.winner_email))).map(item => {
                    const isFinished = item.status === 'completed';
                    return (
                    <div key={item.id} className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col ${isFinished ? 'grayscale opacity-80' : ''}`} onClick={() => setChatAuction(item)}>
                        <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                            <img src={getAuctionThumbnail(item)} className="w-full h-full object-cover drop-shadow-2xl" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                            <div className={`absolute bottom-3 left-0 right-0 text-center text-xs md:text-sm font-bold py-1.5 mx-2 rounded-full shadow-md text-white border-2 border-white dark:border-slate-800 ${item.is_shipped ? 'bg-blue-500' : 'bg-amber-500 animate-pulse'}`}>
                                {item.is_shipped ? '⏳ รอการยืนยัน' : '📦 รอการจัดส่ง'}
                            </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col gap-1">
                            <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white text-center mb-1 line-clamp-1">{item.card_name}</h3>
                            <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center"><p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Sold Price</p><span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">฿{item.current_price.toLocaleString()}</span></div>
                            <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                {isFinished ? (
                                    <div className="w-full py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 rounded-lg text-sm font-bold border border-emerald-200 dark:border-emerald-800 flex justify-center items-center gap-2 cursor-default">🎉 จบการขายแล้ว</div>
                                ) : item.is_shipped ? (
                                    <div className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-sm font-bold border border-blue-200 dark:border-blue-800 flex justify-center items-center gap-2 cursor-default">⏳ รอผู้ซื้อยืนยันรับ</div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <button onClick={(e) => onBtnClick(e, () => setShipmentData(item))} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg flex justify-center items-center gap-2 transition-transform active:scale-95"><TruckIcon /> แจ้งส่งสินค้า (Shipping)</button>
                                        <button onClick={(e) => onBtnClick(e, () => handlePenaltyCancel(item))} className="w-full py-1 text-[10px] text-red-500 hover:text-red-700 underline text-center">ยกเลิกออเดอร์ (เสียเครดิต)</button>
                                    </div>
                                )}
                                <div className="flex gap-2"><button onClick={(e) => onBtnClick(e, () => setChatAuction(item))} className="flex-1 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-300 flex items-center justify-center gap-1"><ChatBubbleIcon/> แชท</button></div>
                            </div>
                        </div>
                    </div>
                )})}
            </div>

            {/* Popup */}
            <DashboardPopup 
                isOpen={popup.isOpen} 
                onClose={() => setPopup({ ...popup, isOpen: false })}
                title={popup.title}
                message={popup.message}
                type={popup.type}
                onConfirm={popup.onConfirm}
                isLoading={popup.isLoading}
            />
        </div>
    );
}