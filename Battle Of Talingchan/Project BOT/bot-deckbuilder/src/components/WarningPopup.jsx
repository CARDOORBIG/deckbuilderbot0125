import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function WarningPopup({ message, onConfirm }) {
  const [isChecked, setIsChecked] = useState(false);

  if (!message) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-slate-900 border-[3px] border-red-500 rounded-2xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-bounce-in text-center relative overflow-hidden">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-4 relative z-10">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full border-4 border-red-50 dark:border-red-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 relative z-10">⚠️ ประกาศแจ้งเตือน</h2>
        <p className="text-xs text-slate-500 mb-4">จากผู้ดูแลระบบ (Admin)</p>

        {/* Message Box */}
        <div className="bg-red-50 dark:bg-red-950/30 p-5 rounded-xl border border-red-200 dark:border-red-900/50 mb-6 relative z-10">
            <p className="text-slate-800 dark:text-red-100 text-lg leading-relaxed font-bold">
                "{message}"
            </p>
        </div>

        {/* Checkbox Acknowledge */}
        <div 
            className="flex items-center justify-center gap-3 mb-6 cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" 
            onClick={() => setIsChecked(!isChecked)}
        >
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-400 bg-white dark:bg-slate-700'}`}>
                {isChecked && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-bold select-none text-sm">รับทราบและเข้าใจข้อความแล้ว</span>
        </div>

        {/* Confirm Button */}
        <button 
            onClick={onConfirm} 
            disabled={!isChecked}
            className={`w-full py-3 rounded-xl font-black text-lg transition-all transform active:scale-95 shadow-lg ${isChecked ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}
        >
            ตกลง (Confirm)
        </button>

        {/* Background Effect */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
      </div>
    </div>,
    document.body
  );
}