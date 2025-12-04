import React from 'react';
import { GavelIcon, ClockIcon } from './Icons'; // ใช้ไอคอนเดิมที่คุณมี
import UserBadge from './UserBadge'; // ✅ 1. Import ตัวนี้เข้ามา

export default function AuctionCard({ auction, onBid }) {
  // คำนวณเวลาที่เหลือ (ตัวอย่าง)
  const timeLeft = "2ชม. 30น."; 

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:shadow-xl transition-all flex flex-col">
      
      {/* ส่วนรูปภาพการ์ด */}
      <div className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-900">
        <img 
          src={auction.cardImage} 
          alt={auction.cardName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <ClockIcon /> {timeLeft}
        </div>
      </div>

      {/* ส่วนเนื้อหา */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white truncate text-lg">
            {auction.cardName}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {auction.set_name || "Base Set"}
          </p>
        </div>

        {/* ราคาปัจจุบัน */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-100 dark:border-amber-800/30 flex justify-between items-center">
          <span className="text-xs text-amber-700 dark:text-amber-400">ราคาปัจจุบัน</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-300">
            ฿{auction.currentPrice.toLocaleString()}
          </span>
        </div>

        {/* ✅ 2. ส่วนแสดงผู้ขายพร้อมยศ (ไฮไลท์สำคัญ) */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
          <p className="text-[10px] text-slate-400 mb-1.5 uppercase tracking-wide">
            Seller (ผู้ขาย)
          </p>
          <UserBadge 
            email={auction.sellerEmail} 
            name={auction.sellerName} 
            picture={auction.sellerPicture} 
            size="sm" // ขนาดกะทัดรัด
          />
        </div>

        {/* ปุ่มประมูล */}
        <button 
          onClick={() => onBid(auction)}
          className="mt-auto w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <GavelIcon /> เสนอราคา
        </button>
      </div>
    </div>
  );
}