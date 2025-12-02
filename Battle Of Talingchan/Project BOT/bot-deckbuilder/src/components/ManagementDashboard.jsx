import React, { useState } from 'react';
import { 
    ShieldCheckIcon, BanIcon, CheckIcon, TrashIcon, 
    ChatBubbleIcon, TruckIcon 
} from './Icons';

// Helper สำหรับดึงรูป (ก๊อปมาไว้ที่นี่ด้วย หรือจะ import จาก utils กลางก็ได้)
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
    handleMarkSold, 
    setManageAuction, 
    handleDeleteMyAuction, 
    handleConfirmReceipt, 
    setConfirmTransaction, 
    setShipmentData 
}) {
    const [managementTab, setManagementTab] = useState('selling'); 

    return (
        <div className="animate-fade-in w-full md:px-8">
            {/* Sub-tab Navigation */}
            <div className="flex justify-center mb-6">
                <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-lg flex gap-1">
                    {['selling', 'buying', 'to-ship'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setManagementTab(tab)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${managementTab === tab ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            {tab === 'selling' && 'สินค้าที่ลงขาย'}
                            {tab === 'buying' && 'สินค้าที่ซื้อ'}
                            {tab === 'to-ship' && 'สินค้าที่ต้องจัดส่ง'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                
                {/* --- 1. Selling --- */}
                {managementTab === 'selling' && myAuctions.filter(i => i.seller_email === userProfile?.email).map(item => {
                        const isCompleted = item.status === 'completed' || item.status === 'sold';
                        return (
                        <div key={item.id} className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col ${isCompleted ? 'grayscale opacity-80' : ''}`} onClick={() => setChatAuction(item)}>
                        <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                            <img src={getAuctionThumbnail(item)} className="w-full h-full object-cover drop-shadow-2xl" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                            {item.is_escrow && (<div className="absolute top-2 left-2 bg-blue-600 text-white p-1 rounded-full shadow-md z-20" title="ระบบ Escrow คุ้มครอง"><ShieldCheckIcon width="16" height="16" /></div>)}
                            {!item.is_escrow && item.type !== 'market' && (<div className="absolute top-2 right-2 bg-slate-600/90 text-white text-[10px] px-2 py-1 rounded-full font-bold border border-slate-500">{item.status === 'cancelled' ? 'ยกเลิกแล้ว' : (new Date(item.end_time) < new Date() ? 'จบแล้ว' : 'กำลังประมูล')}</div>)}
                            {item.type === 'market' && isCompleted && (<div className="absolute bottom-0 left-0 right-0 bg-emerald-600 text-white text-center text-[10px] font-bold py-1">ขายแล้ว</div>)}
                        </div>
                        <div className="p-3 flex-1 flex flex-col gap-1">
                            <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white text-center mb-1 line-clamp-1">{item.card_name}</h3>
                            <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{item.type === 'market' ? 'Price' : 'Current Bid'}</p>
                                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">฿{item.current_price.toLocaleString()}</span>
                            </div>
                            <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                {item.status === 'active' ? (
                                    <div className="mt-2 space-y-2">
                                        <button onClick={() => handleCancel(item)} className="w-full py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center justify-center gap-1"><BanIcon /> ยกเลิก</button>
                                        {item.type === 'market' ? (
                                            <button onClick={() => handleMarkSold(item)} className="w-full py-1.5 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-200 flex items-center justify-center gap-1"><CheckIcon /> ปิดการขาย</button>
                                        ) : (
                                            <button onClick={() => setManageAuction(item)} className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"><ShieldCheckIcon /> จัดการ</button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-2 text-center">
                                        {!isCompleted && <button onClick={(e) => handleDeleteMyAuction(item, e)} className="w-full py-1.5 bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-200 flex items-center justify-center gap-1 mt-1"><TrashIcon /> ลบประวัติ</button>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );})}

                {/* --- 2. Buying --- */}
                {managementTab === 'buying' && myAuctions.filter(i => i.winner_email === userProfile?.email && i.status !== 'active').map(item => {
                    const isCompleted = item.status === 'completed';
                    return (
                        <div key={item.id} className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col ${isCompleted ? 'grayscale opacity-80' : ''}`} onClick={() => setChatAuction(item)}>
                            <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                                <img src={getAuctionThumbnail(item)} className="w-full h-full object-cover drop-shadow-2xl" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                                {item.is_escrow && (<div className="absolute top-2 left-2 bg-blue-600 text-white p-1 rounded-full shadow-md z-20" title="ระบบ Escrow คุ้มครอง"><ShieldCheckIcon width="16" height="16" /></div>)}
                                {item.is_escrow ? ( <div className={`absolute bottom-2 left-0 right-0 text-center text-[10px] font-bold py-1 mx-4 rounded-full shadow-md ${item.is_shipped ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>{item.is_shipped ? `🚚 ส่งแล้ว: ${item.tracking_number}` : '⏳ รอผู้ขายจัดส่ง'}</div> ) : ( <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm z-10">ชนะประมูล!</div> )}
                            </div>
                            <div className="p-3 flex-1 flex flex-col gap-1">
                                <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white text-center mb-1 line-clamp-1">{item.card_name}</h3>
                                <div className="mt-auto bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center"><p className="text-[9px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider mb-0.5">ราคาจบ</p><span className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400">฿{item.current_price.toLocaleString()}</span></div>
                                <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                    {isCompleted ? ( <button disabled className="w-full py-1.5 bg-slate-400 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-not-allowed">✅ ทำรายการเสร็จสิ้น</button> ) : item.is_escrow ? ( <button onClick={() => handleConfirmReceipt(item)} disabled={!item.is_shipped} className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-md transition-colors ${item.is_shipped ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}>{item.is_shipped ? <><CheckIcon /> ยืนยันรับสินค้า</> : '⏳ รอผู้ขายจัดส่ง'}</button> ) : ( <button onClick={() => setConfirmTransaction({ auction: item })} className="w-full py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 shadow-md">ให้คะแนนผู้ขาย</button> )}
                                    <div className="flex gap-2"><button onClick={() => setChatAuction(item)} className="w-full py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-300 flex items-center justify-center gap-1"><ChatBubbleIcon/> แชทกับผู้ขาย</button></div>
                                </div>
                            </div>
                        </div>
                    );})}

                {/* --- 3. To Ship (สินค้าที่ต้องจัดส่ง) --- */}
                    {managementTab === 'to-ship' && myAuctions.filter(i => 
                        i.seller_email === userProfile?.email &&    // ของเรา
                        i.is_escrow &&                              // เป็น Escrow
                        i.winner_email &&                           // มีคนซื้อแล้ว
                        // 🟢 เอา !i.is_shipped ออก เพื่อให้รายการที่ส่งแล้วยังแสดงอยู่ (จนกว่าจะจบ)
                        (
                            i.status === 'completed' || 
                            i.status === 'ended' || 
                            i.status === 'sold' || 
                            (i.type !== 'market' && new Date(i.end_time) < new Date())
                        )
                    ).map(item => {
                        // 🟢 กำหนดตัวแปรสถานะ
                        const isWaitingForBuyer = item.is_shipped && item.status !== 'completed';
                        const isFinished = item.status === 'completed';

                        return (
                        <div 
                            key={item.id} 
                            // 🟢 เอา grayscale ออกตอนรอผู้ซื้อ (ใส่เฉพาะตอนจบแล้วจริงๆ)
                            className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col ${isFinished ? 'grayscale opacity-80' : ''}`} 
                            onClick={() => setChatAuction(item)}
                        >
                            
                            <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                                <img 
                                    src={getAuctionThumbnail(item)} 
                                    className="w-full h-full object-cover drop-shadow-2xl" 
                                    onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} 
                                />
                                
                                {item.is_escrow && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white p-1 rounded-full shadow-md z-20" title="ระบบ Escrow คุ้มครอง">
                                        <ShieldCheckIcon width="16" height="16" />
                                    </div>
                                )}

                                {/* 🟢 ปรับ Badge สถานะ */}
                                <div className={`absolute bottom-2 left-0 right-0 text-center text-[10px] font-bold py-1 mx-4 rounded-full shadow-md text-white ${isWaitingForBuyer ? 'bg-blue-500' : (isFinished ? 'bg-slate-500' : 'bg-amber-500 animate-pulse')}`}>
                                    {isFinished ? '✅ รายการเสร็จสิ้น' : (isWaitingForBuyer ? '⏳ รอการยืนยันจากผู้ซื้อ' : '📦 รอการจัดส่ง')}
                                </div>
                            </div>

                            <div className="p-3 flex-1 flex flex-col gap-1">
                                <h3 className="font-black text-sm md:text-base text-slate-900 dark:text-white text-center mb-1 line-clamp-1">
                                    {item.card_name}
                                </h3>
                                
                                <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                                        {item.type === 'market' ? 'Sold Price' : 'Winning Bid'}
                                    </p>
                                    <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                                        ฿{item.current_price.toLocaleString()}
                                    </span>
                                </div>
                                
                                <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                    
                                    {/* 🟢 ปุ่ม Action */}
                                    {item.is_shipped ? (
                                        <div className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-800 flex justify-center items-center gap-2 cursor-default">
                                            {isFinished ? '🎉 ได้รับเงินแล้ว' : '⏳ รอผู้ซื้อยืนยันรับสินค้า'}
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setShipmentData(item)} 
                                            className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-lg flex justify-center items-center gap-2 transition-transform active:scale-95"
                                        >
                                            <TruckIcon /> แจ้งส่งสินค้า (Shipping)
                                        </button>
                                    )}

                                    <div className="flex gap-2">
                                        <button onClick={() => setChatAuction(item)} className="flex-1 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-300 flex items-center justify-center gap-1">
                                            <ChatBubbleIcon/> ติดต่อผู้ซื้อ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
            </div>
            
            {/* Empty States */}
            {managementTab === 'selling' && myAuctions.filter(i => i.seller_email === userProfile?.email).length === 0 && <div className="text-center py-20 text-slate-500"><p>ยังไม่มีรายการที่ลงขาย</p></div>}
            {managementTab === 'buying' && myAuctions.filter(i => i.winner_email === userProfile?.email && i.status !== 'active').length === 0 && <div className="text-center py-20 text-slate-500"><p>ยังไม่มีรายการที่ซื้อสำเร็จ</p></div>}
            {managementTab === 'to-ship' && myAuctions.filter(i => i.seller_email === userProfile?.email && i.is_escrow && i.winner_email && !i.is_shipped && (i.status === 'completed' || i.status === 'ended' || i.status === 'sold' || (i.type !== 'market' && new Date(i.end_time) < new Date()))).length === 0 && <div className="text-center py-20 text-slate-500"><p>ไม่มีสินค้าที่ต้องจัดส่ง</p></div>}
        </div>
    );
}