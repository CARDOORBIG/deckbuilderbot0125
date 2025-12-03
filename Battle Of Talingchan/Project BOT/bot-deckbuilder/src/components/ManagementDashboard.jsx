import React, { useState } from 'react';
import { 
    ShieldCheckIcon, BanIcon, CheckIcon, TrashIcon, 
    ChatBubbleIcon, TruckIcon, GavelIcon
} from './Icons';

const getAuctionThumbnail = (item) => {
    if (item.card_image_path === 'CUSTOM_ITEM') {
        try { const images = JSON.parse(item.proof_image); return images[0] || 'https://placehold.co/300x420/1e293b/ffffff?text=No+Image'; } catch { return 'https://placehold.co/300x420/1e293b/ffffff?text=Error'; }
    }
    if (!item.card_image_path || !item.card_id) return '';
    const fileId = item.card_id.replace(' - Only#1', '');
    const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
    return `/cards/${encodePath(item.card_image_path)}/${encodeURIComponent(fileId)}.png`;
};

export default function ManagementDashboard({ 
    myAuctions, 
    userProfile, 
    setChatAuction, 
    handleCancel, 
    handlePenaltyCancel, 
    setManageAuction, 
    handleDeleteMyAuction, 
    handleConfirmReceipt, 
    setConfirmTransaction, 
    setShipmentData,
    handleForceEnd // 🟢 Receives the function to open the modal
}) {
    const [managementTab, setManagementTab] = useState('selling'); 

    const toShipCount = myAuctions.filter(i => i.seller_email === userProfile?.email && (i.status === 'pending_ship' || (i.status === 'sold' && !i.is_shipped) || (i.status === 'ended' && i.winner_email && !i.is_shipped))).length;
    const toReceiveCount = myAuctions.filter(i => i.winner_email === userProfile?.email && i.is_shipped && i.status !== 'completed').length;

    return (
        <div className="animate-fade-in w-full md:px-8">
            {/* Sub-tab Navigation */}
            <div className="flex justify-center mb-6">
                {/* 🟢 Fix: overflow-visible ensures Red Mark is not clipped */}
                <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-lg flex gap-2 overflow-visible relative z-10">
                    
                    <button 
                        onClick={() => setManagementTab('selling')}
                        className={`relative px-4 py-2 rounded-md text-xs font-bold transition-all ${managementTab === 'selling' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        สินค้าที่ลงขาย
                    </button>

                    <button 
                        onClick={() => setManagementTab('buying')}
                        className={`relative px-4 py-2 rounded-md text-xs font-bold transition-all overflow-visible ${managementTab === 'buying' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        {toReceiveCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white dark:ring-slate-900 shadow-md z-50 animate-bounce">
                                {toReceiveCount}
                            </span>
                        )}
                        สินค้าที่ซื้อ
                    </button>

                    <button 
                        onClick={() => setManagementTab('to-ship')}
                        className={`relative px-4 py-2 rounded-md text-xs font-bold transition-all overflow-visible ${managementTab === 'to-ship' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        {toShipCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white dark:ring-slate-900 shadow-md z-50 animate-bounce">
                                {toShipCount}
                            </span>
                        )}
                        สินค้าที่ต้องจัดส่ง
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                
                {/* 1. Selling Tab */}
                {managementTab === 'selling' && myAuctions.filter(i => 
                    i.seller_email === userProfile?.email && 
                    (i.status === 'active' || i.status === 'completed' || i.status === 'cancelled')
                ).map(item => {
                        const isCompleted = item.status === 'completed';
                        const isCancelled = item.status === 'cancelled';

                        return (
                        <div key={item.id} className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col ${isCompleted || isCancelled ? 'opacity-90' : ''}`} onClick={() => setChatAuction(item)}>
                            <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                                <img 
                                    src={getAuctionThumbnail(item)} 
                                    className={`w-full h-full object-cover drop-shadow-2xl transition-all ${isCompleted || isCancelled ? 'grayscale' : ''}`} 
                                    onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} 
                                />
                                
                                {item.is_escrow 
                                    ? (<div className="absolute top-2 left-2 bg-blue-600 text-white p-1 rounded-full shadow-md z-20" title="Escrow"><ShieldCheckIcon width="16" height="16" /></div>)
                                    : (<div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md z-20">โอนตรง</div>)
                                }
                                
                                {isCompleted && (
                                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                                        <div className="border-[5px] border-red-600 text-red-600 text-3xl font-black px-6 py-2 rounded-xl transform -rotate-12 uppercase tracking-widest bg-white/80 backdrop-blur-sm shadow-2xl mix-blend-normal">
                                            SOLD
                                        </div>
                                    </div>
                                )}

                                {isCancelled && (
                                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                                        <div className="border-[5px] border-slate-600 text-slate-600 text-2xl font-black px-4 py-2 rounded-xl transform -rotate-12 uppercase tracking-widest bg-white/70 backdrop-blur-sm shadow-xl">
                                            CANCELLED
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 flex-1 flex flex-col gap-1">
                                <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white text-center mb-1 line-clamp-1">{item.card_name}</h3>
                                <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{item.type === 'market' ? 'Price' : 'Current Bid'}</p>
                                    <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">฿{item.current_price.toLocaleString()}</span>
                                </div>
                                
                                <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                    {item.status === 'active' && (
                                        <div className="mt-2 space-y-2">
                                            {/* 🟢 Force End Button - Triggers Modal via Prop */}
                                            {item.type !== 'market' && item.winner_email && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleForceEnd(item); }} 
                                                    className="w-full py-2 bg-amber-400 text-white border border-amber-500 rounded-lg text-xs font-bold hover:bg-amber-500 shadow-sm flex items-center justify-center gap-1 animate-pulse"
                                                >
                                                    <GavelIcon /> จบการขายเดี๋ยวนี้
                                                </button>
                                            )}

                                            <button onClick={() => handleCancel(item)} className="w-full py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-200 flex items-center justify-center gap-1">
                                                <BanIcon /> ยกเลิกการขาย
                                            </button>
                                            
                                            <div className="text-[10px] text-center text-slate-400">
                                                {item.winner_email ? `ผู้นำ: ${item.winner_name}` : 'รอผู้ซื้อกดสั่งซื้อ...'}
                                            </div>
                                        </div>
                                    )}
                                    {(isCompleted || isCancelled) && (
                                        <button onClick={(e) => handleDeleteMyAuction(item, e)} className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-all flex items-center justify-center gap-1 mt-1">
                                            <TrashIcon /> ลบประวัติ
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );})}

                {/* 2. Buying Tab */}
                {managementTab === 'buying' && myAuctions.filter(i => i.winner_email === userProfile?.email && i.status !== 'active').map(item => {
                    const isCompleted = item.status === 'completed';
                    const isCancelled = item.status === 'cancelled';
                    return (
                        <div key={item.id} className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col ${isCancelled ? 'opacity-80' : ''}`} onClick={() => setChatAuction(item)}>
                            <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                                <img 
                                    src={getAuctionThumbnail(item)} 
                                    className={`w-full h-full object-cover drop-shadow-2xl ${isCompleted || isCancelled ? 'grayscale' : ''}`} 
                                    onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} 
                                />
                                {item.is_escrow 
                                    ? (<div className="absolute top-2 left-2 bg-blue-600 text-white p-1 rounded-full shadow-md z-20"><ShieldCheckIcon width="16" height="16" /></div>)
                                    : (<div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md z-20">โอนตรง</div>)
                                }
                                {item.is_shipped && !isCompleted ? ( 
                                    <div className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold py-1.5 mx-2 rounded-full shadow-md bg-emerald-500 text-white border-2 border-white dark:border-slate-800">🚚 ส่งแล้ว: {item.tracking_number}</div> 
                                ) : isCancelled ? (
                                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md z-10">ถูกยกเลิก</div>
                                ) : ( 
                                    <div className="absolute top-2 right-2 bg-slate-700 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md z-10 border border-slate-500">{item.is_escrow ? 'ชำระเงินแล้ว' : 'จองแล้ว'}</div> 
                                )}
                            </div>
                            <div className="p-3 flex-1 flex flex-col gap-1">
                                <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white text-center mb-1 line-clamp-1">{item.card_name}</h3>
                                <div className="mt-auto bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center"><p className="text-[9px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider mb-0.5">ราคาจบ</p><span className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">฿{item.current_price.toLocaleString()}</span></div>
                                <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                    {isCompleted ? ( 
                                        <button disabled className="w-full py-1.5 bg-slate-400 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-not-allowed">✅ ได้รับสินค้าแล้ว</button> 
                                    ) : isCancelled ? (
                                        <button disabled className="w-full py-1.5 bg-red-100 text-red-500 rounded-lg text-xs font-bold cursor-not-allowed">❌ รายการถูกยกเลิก</button>
                                    ) : ( 
                                        <button onClick={() => handleConfirmReceipt(item)} disabled={!item.is_shipped} className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 shadow-md transition-colors ${item.is_shipped ? 'bg-emerald-600 text-white hover:bg-emerald-700 animate-pulse' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>
                                            {item.is_shipped ? <><CheckIcon /> ยืนยันรับสินค้า</> : '⏳ รอผู้ขายส่งของ'}
                                        </button> 
                                    )}
                                    <div className="flex gap-2">
                                        <button onClick={() => setChatAuction(item)} className="flex-1 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-300 flex items-center justify-center gap-1"><ChatBubbleIcon/> แชท</button>
                                        {item.is_shipped && (<button onClick={() => setShipmentData(item)} className="px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-200 flex items-center justify-center gap-1"><TruckIcon /></button>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );})}

                {/* 3. To Ship Tab */}
                {managementTab === 'to-ship' && myAuctions.filter(i => 
                    i.seller_email === userProfile?.email && 
                    i.winner_email && 
                    // 🟢 Filter: แสดงเมื่ออยู่ในสถานะ "ซื้อขาย" เท่านั้น (รวมถึง ended ที่มีคนชนะแต่ยังไม่ส่ง)
                    (i.status === 'pending_ship' || i.status === 'shipped' || i.status === 'sold' || (i.status === 'ended' && i.winner_email))
                ).map(item => {
                    const isFinished = item.status === 'completed';
                    return (
                    <div key={item.id} className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col ${isFinished ? 'grayscale opacity-80' : ''}`} onClick={() => setChatAuction(item)}>
                        <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                            <img src={getAuctionThumbnail(item)} className="w-full h-full object-cover drop-shadow-2xl" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                            {item.is_escrow 
                                ? (<div className="absolute top-2 left-2 bg-blue-600 text-white p-1 rounded-full shadow-md z-20"><ShieldCheckIcon width="16" height="16" /></div>)
                                : (<div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md z-20">โอนตรง</div>)
                            }
                            <div className={`absolute bottom-3 left-0 right-0 text-center text-xs md:text-sm font-bold py-1.5 mx-2 rounded-full shadow-md text-white border-2 border-white dark:border-slate-800 ${item.is_shipped ? 'bg-blue-500' : 'bg-amber-500 animate-pulse'}`}>
                                {item.is_shipped ? '⏳ รอการยืนยัน' : '📦 รอการจัดส่ง'}
                            </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col gap-1">
                            <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white text-center mb-1 line-clamp-1">{item.card_name}</h3>
                            <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center"><p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Sold Price</p><span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">฿{item.current_price.toLocaleString()}</span></div>
                            
                            {!item.is_escrow && !item.is_shipped && !isFinished && (
                                <div className="text-xs text-red-500 font-bold text-center bg-red-50 dark:bg-red-900/20 p-1.5 rounded mt-1 border border-red-200 dark:border-red-800">
                                    ⚠️ เช็คยอดเงินเข้าบัญชี ก่อนกดส่ง
                                </div>
                            )}

                            <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                {isFinished ? (
                                    <div className="w-full py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 rounded-lg text-sm font-bold border border-emerald-200 dark:border-emerald-800 flex justify-center items-center gap-2 cursor-default">
                                        🎉 จบการขายแล้ว
                                    </div>
                                ) : item.is_shipped ? (
                                    <div className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-sm font-bold border border-blue-200 dark:border-blue-800 flex justify-center items-center gap-2 cursor-default">
                                        ⏳ รอผู้ซื้อยืนยันรับ
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => setShipmentData(item)} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg flex justify-center items-center gap-2 transition-transform active:scale-95"><TruckIcon /> แจ้งส่งสินค้า (Shipping)</button>
                                        <button onClick={() => handlePenaltyCancel(item)} className="w-full py-1 text-[10px] text-red-500 hover:text-red-700 underline text-center">ยกเลิกออเดอร์ (เสียเครดิต)</button>
                                    </div>
                                )}
                                <div className="flex gap-2"><button onClick={() => setChatAuction(item)} className="flex-1 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-300 flex items-center justify-center gap-1"><ChatBubbleIcon/> แชท</button></div>
                            </div>
                        </div>
                    </div>
                )})}
            </div>
            
            {/* Empty States */}
            {managementTab === 'selling' && myAuctions.filter(i => i.seller_email === userProfile?.email && (i.status === 'active' || i.status === 'completed')).length === 0 && <div className="text-center py-20 text-slate-500"><p>ยังไม่มีรายการที่ลงขาย</p></div>}
            {managementTab === 'buying' && myAuctions.filter(i => i.winner_email === userProfile?.email && i.status !== 'active').length === 0 && <div className="text-center py-20 text-slate-500"><p>ยังไม่มีรายการที่ซื้อสำเร็จ</p></div>}
            {managementTab === 'to-ship' && myAuctions.filter(i => i.seller_email === userProfile?.email && i.winner_email && (i.status === 'pending_ship' || i.status === 'shipped' || i.status === 'sold' || i.status === 'ended')).length === 0 && <div className="text-center py-20 text-slate-500"><p>ไม่มีสินค้าที่ต้องจัดส่ง</p></div>}
        </div>
    );
}