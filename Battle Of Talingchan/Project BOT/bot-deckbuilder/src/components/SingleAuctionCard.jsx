import React from 'react';
// 🟢 Import ไอคอนที่จะใช้เพิ่มเข้ามา
import { ShieldCheckIcon, ShoppingBagIcon, GavelIcon } from './Icons';
import TimeLeft from './TimeLeft';
import { getAuctionThumbnail } from '../utils/auctionUtils';

const SingleAuctionCard = ({ item, onChat, onBid, onBuyNow }) => {
    return (
        <div 
            className="relative group cursor-pointer bg-white dark:bg-slate-900/70 backdrop-blur-sm p-2 md:p-3 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-lg transition-all hover:border-amber-400/50 hover:shadow-amber-500/10 flex flex-col h-full"
            onClick={() => onChat(item)}
        >
            {/* Image Section */}
            <div className="aspect-[5/7] w-full rounded mb-2 overflow-hidden bg-slate-200 dark:bg-slate-800 relative shadow-inner">
                <img 
                    src={getAuctionThumbnail(item)} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy" 
                    alt={item.card_name}
                />
                
                {/* 🟢 Escrow Icon (แก้ไขใหม่: ใหญ่ขึ้น 1.6x, สีฟ้า-ขาว) */}
                {item.is_escrow && (
                    <div 
                        className="absolute top-2 right-2 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-2 rounded-full shadow-lg shadow-blue-500/30 border border-blue-300/50 z-10 scale-110" 
                        title="Escrow - มีระบบดูแลความปลอดภัย"
                    >
                        <ShieldCheckIcon width="20" height="20" className="drop-shadow-sm"/>
                    </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-center">
                        <TimeLeft endTime={item.end_time} />
                    </div>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 leading-tight">
                {item.card_name}
            </h3>
            
            {/* Info Row: Seller & Price */}
            <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-1.5 overflow-hidden max-w-[40%]">
                    {item.seller_name && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                            {item.seller_name}
                        </span>
                    )}
                </div>
                <div className="text-right flex-1 pl-2">
                    <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-0.5">Current Bid</p>
                    {/* ราคาตัวใหญ่ (จากโค้ดก่อนหน้า) */}
                    <p className="text-3xl md:text-4xl font-black text-emerald-500 dark:text-emerald-400 leading-none drop-shadow-sm tracking-tighter">
                        ฿{item.current_price.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Action Buttons (Glossy Style + New Icons) */}
            <div className="mt-auto flex gap-2">
                {item.buy_now_price > 0 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onBuyNow(item); }} 
                        className="btn-glossy flex-1 px-3 py-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-black shadow-lg shadow-emerald-500/30 border-t border-white/20 flex items-center justify-center gap-1.5"
                    >
                        {/* 🟢 ใช้ ShoppingBagIcon แทนอิโมจิ */}
                        <ShoppingBagIcon className="w-5 h-5 drop-shadow-sm" />
                        <span>BUY ฿{item.buy_now_price.toLocaleString()}</span>
                    </button>
                )}
                <button 
                    onClick={(e) => { e.stopPropagation(); onBid(item); }} 
                    className={`btn-glossy px-4 py-2 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 text-white text-xs font-black shadow-lg shadow-orange-500/30 border-t border-white/20 flex items-center justify-center gap-1.5 ${item.buy_now_price > 0 ? 'flex-1' : 'w-full'}`}
                >
                    {/* 🟢 ใช้ GavelIcon แทน SVG เดิม */}
                    <GavelIcon className="w-5 h-5 drop-shadow-sm" />
                    <span>BID <span className="text-orange-100">+{item.min_bid_increment.toLocaleString()}</span></span>
                    
                    {/* Pulse Dot */}
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default SingleAuctionCard;