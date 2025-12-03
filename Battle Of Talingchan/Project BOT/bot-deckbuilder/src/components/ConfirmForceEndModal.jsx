import React from 'react';
import { createPortal } from 'react-dom';

// Icon แบบเดียวกับ CreateAuctionModal
const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-amber-500 drop-shadow-lg">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

export default function ConfirmForceEndModal({ isOpen, onClose, onConfirm, item }) {
  if (!isOpen || !item) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        // ใช้ Class เดียวกับ CreateAuctionModal (Theme สีส้ม-ดำ)
        className="bg-[#0f172a] border-[3px] border-amber-500 rounded-3xl p-6 w-full max-w-sm shadow-[0_0_30px_rgba(245,158,11,0.3)] relative overflow-hidden flex flex-col items-center text-center transform scale-100 transition-all"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header Icon */}
        <div className="flex justify-center mb-4">
            <div className="bg-amber-500/10 p-3 rounded-full">
                <WarningIcon />
            </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-1">ยืนยันจบการขาย?</h3>
        <p className="text-slate-400 text-xs mb-5">(Force End: ปิดประมูลทันที)</p>

        {/* Info Box (กล่องข้อความเตือน) */}
        <div className="bg-[#1c1917] border border-amber-900/50 rounded-xl p-4 mb-6 text-left w-full">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-500 text-lg">⚠️</span>
                <span className="text-gray-200 font-bold text-sm">ผลที่จะเกิดขึ้น:</span>
            </div>
            <ul className="list-disc list-outside ml-4 space-y-2 text-xs text-gray-300 leading-relaxed">
                <li>
                    ผู้ชนะคือคุณ <span className="text-white font-bold text-sm">{item.winner_name}</span>
                </li>
                <li>
                    รายการจะย้ายไปที่เมนู <span className="text-amber-400 font-bold">"ต้องจัดส่ง"</span>
                </li>
                <li>
                    ท่านมีหน้าที่ต้อง <span className="text-white underline">ส่งสินค้า</span> ตามเงื่อนไขทันที
                </li>
            </ul>
        </div>

        {/* Buttons (ปุ่มใหญ่ด้านล่าง) */}
        <div className="flex gap-3 w-full">
            <button 
                onClick={onClose}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-colors border border-slate-700"
            >
                ยกเลิก
            </button>
            <button 
                onClick={() => onConfirm(item)}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
            >
                ยืนยันจบการขาย
            </button>
        </div>

      </div>
    </div>,
    document.body
  );
}