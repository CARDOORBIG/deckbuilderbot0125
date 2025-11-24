import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function CreateAuctionModal({ isOpen, onClose, card, userProfile }) {
  const [price, setPrice] = useState(100);
  const [hours, setHours] = useState(24);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !card) return null;

  const handleCreate = async () => {
    if (!userProfile) return alert("กรุณา Login ก่อนตั้งขายครับ");
    setLoading(true);

    const endTime = new Date();
    endTime.setHours(endTime.getHours() + parseInt(hours));

    const { error } = await supabase.from('auctions').insert({
      seller_email: userProfile.email,
      seller_name: userProfile.name,
      card_id: card.id,
      card_name: card.name,
      card_image_path: card.imagePath,
      start_price: parseInt(price),
      current_price: parseInt(price),
      end_time: endTime.toISOString(),
      status: 'active'
    });

    setLoading(false);
    if (error) alert("เกิดข้อผิดพลาด: " + error.message);
    else {
      alert("ลงขายสำเร็จ! 🔨");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[500] p-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-sm border border-slate-300 dark:border-emerald-500/30 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">เปิดประมูล: {card.name}</h2>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">ราคาเริ่มต้น (บาท)</label>
                <input type="number" value={price} onChange={e=>setPrice(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
            </div>
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">ระยะเวลา (ชั่วโมง)</label>
                <select value={hours} onChange={e=>setHours(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                    <option value="1">1 ชั่วโมง (Test)</option>
                    <option value="6">6 ชั่วโมง</option>
                    <option value="12">12 ชั่วโมง</option>
                    <option value="24">24 ชั่วโมง (1 วัน)</option>
                    <option value="48">48 ชั่วโมง (2 วัน)</option>
                </select>
            </div>
            
            <div className="flex gap-3 pt-4">
                <button onClick={onClose} className="flex-1 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">ยกเลิก</button>
                <button onClick={handleCreate} disabled={loading} className="flex-1 py-2 rounded bg-amber-500 text-white font-bold hover:bg-amber-600 disabled:opacity-50">
                    {loading ? "กำลังส่ง..." : "เริ่มประมูล"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}