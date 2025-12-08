import React from 'react';
import { ShieldCheckIcon, ShoppingBagIcon, GavelIcon, ShareIcon } from './Icons';
import TimeLeft from './TimeLeft';
import { getAuctionThumbnail } from '../utils/auctionUtils';
import UserBadge from './UserBadge'; // 🟢 Import UserBadge

const SingleAuctionCard = ({ item, onChat, onBid, onBuyNow }) => {
    
    const handleShare = (e) => {
        e.stopPropagation();
        const url = `${window.location.origin}/auction?id=${item.id}&type=${item.type || 'auction'}`;
        navigator.clipboard.writeText(url).then(() => {
            alert("✅ คัดลอกลิงก์เรียบร้อย!");
        }).catch(() => {
            alert("❌ คัดลอกไม่สำเร็จ");
        });
    };

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
                
                <button 
                    onClick={handleShare}
                    className="absolute top-2 left-2 p-1.5 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-emerald-500 transition-colors z-20"
                    title="แชร์ลิงก์"
                >
                    <ShareIcon />
                </button>

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
            
            {/* 🟢 แก้ไขส่วนแสดงผู้ขาย: ใช้ UserBadge แทน text ธรรมดา */}
            <div className="flex justify-between items-end mb-4">
                <div className="flex-1 overflow-hidden">
                    {item.seller_name && (
                        <div className="scale-90 origin-bottom-left">
                            <UserBadge 
                                email={item.seller_email}
                                name={item.seller_name}
                                size="sm" // ใช้ขนาดเล็ก
                            />
                        </div>
                    )}
                </div>
                <div className="text-right flex-shrink-0 pl-1">
                    <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-0.5">Price</p>
                    <p className="text-2xl md:text-3xl font-black text-emerald-500 dark:text-emerald-400 leading-none drop-shadow-sm tracking-tighter">
                        ฿{item.current_price.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex gap-2">
                {item.buy_now_price > 0 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onBuyNow(item); }} 
                        className="btn-glossy flex-1 px-3 py-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-black shadow-lg shadow-emerald-500/30 border-t border-white/20 flex items-center justify-center gap-1.5"
                    >
                        <ShoppingBagIcon className="w-5 h-5 drop-shadow-sm" />
                        <span>BUY ฿{item.buy_now_price.toLocaleString()}</span>
                    </button>
                )}
                <button 
                    onClick={(e) => { e.stopPropagation(); onBid(item); }} 
                    className={`btn-glossy px-4 py-2 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 text-white text-xs font-black shadow-lg shadow-orange-500/30 border-t border-white/20 flex items-center justify-center gap-1.5 ${item.buy_now_price > 0 ? 'flex-1' : 'w-full'}`}
                >
                    <GavelIcon className="w-5 h-5 drop-shadow-sm" />
                    <span>BID <span className="text-orange-100">+{item.min_bid_increment.toLocaleString()}</span></span>
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