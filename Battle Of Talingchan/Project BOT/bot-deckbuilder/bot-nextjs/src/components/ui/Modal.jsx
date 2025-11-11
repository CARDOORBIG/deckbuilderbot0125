import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Common'; // <--- Import จากไฟล์ที่เราเพิ่งสร้าง
import { ClearIcon } from './Icons'; // <--- Import จากไฟล์ที่เราเพิ่งสร้าง

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", confirmIcon = <ClearIcon/>, maxWidth = 'max-w-md' }) => {
  if (!isOpen) return null;
  
  // [สำคัญ] เพิ่ม check นี้สำหรับ Next.js
  // เพื่อป้องกัน Error "document is not defined" ตอนรันบน Server
  if (typeof window === 'undefined') return null; 

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className={`bg-slate-800 border border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full m-4 ${maxWidth}`}>
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="text-gray-300 mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} className="bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600">
            {onConfirm ? "Cancel" : "Close"}
          </Button>
          {onConfirm && (
            <Button onClick={onConfirm} className="bg-emerald-900/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-800/50 hover:text-white">
              {confirmIcon} {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body // สั่งให้ Modal นี้ไป render ที่ <body>
  );
};

export default Modal;