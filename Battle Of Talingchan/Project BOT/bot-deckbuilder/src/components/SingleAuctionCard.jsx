// src/components/SingleAuctionCard.jsx
import React from 'react';
import { GavelIcon, ShieldCheckIcon } from './Icons';
import TimeLeft from './TimeLeft';
import { getAuctionThumbnail } from '../utils/auctionUtils'; // Import จากไฟล์ข้อ 1

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
                
                {item.is_escrow && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full shadow-md z-10" title="Escrow">
                        <ShieldCheckIcon width="12" height="12"/>
                    </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-center">
                        <TimeLeft endTime={item.end_time} />
                    </div>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 leading-tight">
                {item.card_name}
            </h3>
            
            {/* Info Row: Seller & Price */}
            <div className="flex justify-between items-end mb-3">
                <div className="flex items-center gap-1.5 overflow-hidden max-w-[60%]">
                    {item.seller_name && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                            โดย {item.seller_name}
                        </span>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-[9px] text-slate-400 uppercase font-bold leading-none">Current Bid</p>
                    <p className="text-lg md:text-xl font-black text-emerald-500 dark:text-emerald-400 leading-none">
                        ฿{item.current_price.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex gap-2">
                {item.buy_now_price > 0 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onBuyNow(item); }} 
                        className="flex-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs font-bold shadow-sm hover:bg-pink-200 transition-colors"
                    >
                        Buy ฿{item.buy_now_price.toLocaleString()}
                    </button>
                )}
                <button 
                    onClick={(e) => { e.stopPropagation(); onBid(item); }} 
                    className={`px-4 py-1.5 btn-fire text-white rounded-lg text-xs font-bold shadow-lg transition-transform active:scale-95 ${item.buy_now_price > 0 ? 'flex-1' : 'w-full'}`}
                >
                    <span className="flex items-center justify-center gap-1">
                        <GavelIcon /> BID +{item.min_bid_increment.toLocaleString()}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default SingleAuctionCard;