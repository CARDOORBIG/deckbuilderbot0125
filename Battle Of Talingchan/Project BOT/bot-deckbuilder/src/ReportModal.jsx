import React, { useState } from 'react';
import { supabase } from './supabaseClient';

// ไอคอนธง
const FlagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
);

export default function ReportModal({ isOpen, onClose, reporterEmail, targetUser, context }) {
  const [reason, setReason] = useState('spam');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = async () => {
    if (!reporterEmail) return alert("กรุณาเข้าสู่ระบบก่อนแจ้งรายงาน");
    
    setIsSubmitting(true);
    
    // 🚀 หัวใจสำคัญ: ส่ง targetUser.email (อีเมลจริง) ไปเก็บในฐานข้อมูล
    const { error } = await supabase.from('user_reports').insert({
      reporter_email: reporterEmail,
      target_email: targetUser.email, 
      target_name: targetUser.name,
      context_type: context.type,
      context_id: context.id,
      reason: reason,
      description: description
    });

    setIsSubmitting(false);
    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      alert("ส่งรายงานเรียบร้อย! แอดมินจะตรวจสอบโดยเร็วที่สุด");
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-red-500/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-900/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
            <FlagIcon /> แจ้งรายงานผู้ใช้
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-white">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
            <p>คุณกำลังรายงานผู้ใช้: <span className="font-bold text-slate-900 dark:text-white">{targetUser.name}</span></p>
            <p className="text-xs text-slate-400 mt-1">ID: {targetUser.email} (ระบบบันทึกไว้อัตโนมัติ)</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">หัวข้อความผิด</label>
            <select 
              value={reason} 
              onChange={e => setReason(e.target.value)} 
              className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="spam">สแปม / โฆษณา</option>
              <option value="rude">ใช้คำหยาบคาย / ไม่เหมาะสม</option>
              <option value="fake">สินค้าปลอม / หลอกลวง</option>
              <option value="cancel_abuse">ปั่นป่วนการประมูล / ยกเลิกบ่อย</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">รายละเอียดเพิ่มเติม</label>
            <textarea 
              rows="3" 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="อธิบายสิ่งที่เกิดขึ้น..."
              className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'กำลังส่ง...' : 'ส่งรายงาน'}
          </button>
        </div>
      </div>
    </div>
  );
}