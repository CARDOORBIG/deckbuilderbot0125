import React, { useState } from 'react';
import { createPortal } from "react-dom";
import { supabase } from '../supabaseClient';
import { MessageIcon } from './Icons';

// UI Helper
const Button = ({ className = "", children, ...props }) => (
  <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all active:scale-[.98] disabled:opacity-50 ${className}`} {...props}>
    {children}
  </button>
);

export default function FeedbackModal({ isOpen, onClose, userProfile, showAlert }) {
  const [text, setText] = useState("");
  const [type, setType] = useState("suggestion");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!userProfile) return showAlert("กรุณา Login", "ต้องเข้าสู่ระบบก่อนแจ้งปัญหาครับ");
    if (!text.trim()) return showAlert("ข้อความว่างเปล่า", "กรุณากรอกรายละเอียดครับ");
    
    setIsSubmitting(true);
    try {
      // 1. สร้าง Ticket ใหม่
      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
            user_email: userProfile.email,
            user_name: userProfile.name,
            user_avatar: userProfile.picture,
            subject: type,
            status: 'open',
            last_message: text.substring(0, 50) + "..."
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // 2. ใส่ข้อความแรกลงในแชท
      const { error: msgError } = await supabase
        .from('support_messages')
        .insert({
            ticket_id: ticket.id,
            sender_email: userProfile.email,
            message: text,
            is_admin: false
        });

      if (msgError) throw msgError;
      
      showAlert("✅ เปิดเคสสำเร็จ!", "เจ้าหน้าที่ได้รับเรื่องแล้ว คุณสามารถติดตามและพูดคุยต่อได้ที่เมนู 'ติดต่อทีมงาน' ในช่องแชท");
      setText("");
      onClose();

    } catch (e) {
      console.error(e);
      showAlert("Error", "เกิดข้อผิดพลาด: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1100] p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageIcon /> เปิด Ticket แจ้งปัญหา
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">หัวข้อเรื่อง</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="suggestion">💡 เสนอแนะ / ฟีดแบค</option>
              <option value="bug">🐛 แจ้งบั๊ก / ปัญหาการใช้งาน</option>
              <option value="account">👤 ปัญหาบัญชี / เติมเงิน</option>
              <option value="other">💬 อื่นๆ</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">รายละเอียด</label>
            <textarea rows="4" value={text} onChange={(e) => setText(e.target.value)} placeholder="อธิบายปัญหาให้เราทราบ..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-slate-700">ยกเลิก</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 text-white hover:bg-emerald-500">{isSubmitting ? "กำลังสร้าง..." : "เปิด Ticket"}</Button>
        </div>
      </div>
    </div>, document.body
  );
};