import React, { useState } from 'react';
import { createPortal } from "react-dom";
import { db } from '../firebase'; // ถอยกลับ 1 ชั้นเพื่อหา firebase.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { MessageIcon } from './Icons'; // ดึงไอคอนจาก Icons.jsx ที่อยู่ในโฟลเดอร์เดียวกัน

// UI Component ย่อยสำหรับปุ่ม
const Button = ({ className = "", children, ...props }) => (
  <button 
    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-300/20 dark:border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 dark:hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`} 
    {...props}
  >
    {children}
  </button>
);

export default function FeedbackModal({ isOpen, onClose, userProfile, showAlert }) {
  const [text, setText] = useState("");
  const [type, setType] = useState("suggestion");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!text.trim()) {
      if(showAlert) showAlert("ข้อความว่างเปล่า", "กรุณากรอกข้อความก่อนส่งครับ");
      else alert("กรุณากรอกข้อความ");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        text: text.trim(),
        type: type,
        user: userProfile ? { 
          name: userProfile.name, 
          email: userProfile?.email
, 
          uid: userProfile?.email
 
        } : "Anonymous",
        createdAt: serverTimestamp(),
        status: "new",
        version: "1.0"
      });
      
      if(showAlert) showAlert("ขอบคุณครับ! 🙏", "เราได้รับข้อมูลของท่านแล้ว ทีมงานจะนำไปปรับปรุงให้ดียิ่งขึ้น");
      else alert("ส่งข้อมูลเรียบร้อย ขอบคุณครับ");
      
      setText("");
      onClose();
    } catch (e) {
      console.error("Feedback error: ", e);
      if(showAlert) showAlert("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้ โปรดลองใหม่ภายหลัง");
      else alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999] p-4" onClick={onClose}>
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageIcon /> ติดต่อผู้พัฒนา / แจ้งปัญหา
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">หัวข้อเรื่อง</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="suggestion">💡 เสนอแนะ / ฟีดแบค</option>
              <option value="bug">🐛 แจ้งบั๊ก / ปัญหาการใช้งาน</option>
              <option value="other">💬 อื่นๆ</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">รายละเอียด</label>
            <textarea
              rows="4"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="เล่าให้เราฟังหน่อยครับ..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button 
            onClick={onClose} 
            className="bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-emerald-600 text-white hover:bg-emerald-500 border-none shadow-lg"
          >
            {isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}