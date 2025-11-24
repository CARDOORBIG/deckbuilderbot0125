import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function CreateAuctionModal({ isOpen, onClose, card, userProfile }) {
  const [price, setPrice] = useState(100);
  const [hours, setHours] = useState(24); // ค่าเริ่มต้น 24 ชม.
  const [loading, setLoading] = useState(false);

  if (!isOpen || !card) return null;

  const handleCreate = async () => {
    if (!userProfile) return alert("กรุณา Login ก่อนตั้งขายครับ");
    if (parseInt(hours) < 1) return alert("ระยะเวลาต้องอย่างน้อย 1 ชั่วโมงครับ");
    
    setLoading(true);

    // คำนวณเวลาจบ (บวกชั่วโมงเพิ่มจากเวลาปัจจุบัน)
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
    // 🟢 [แก้ไข] ปรับขนาด Modal เป็น max-w-lg
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[500] p-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-lg border border-slate-300 dark:border-emerald-500/30 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
           <span className="text-2xl">⚖️</span> เปิดประมูล: {card.name}
        </h2>
        
        {/* กล่องคำเตือน */}
        {/* กล่องคำเตือนแบบใหญ่พิเศษ */}
<div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 
                p-5 rounded-xl mb-5 
                text-lg md:text-xl lg:text-2xl 
                text-red-700 dark:text-red-300 leading-relaxed font-medium">

    <p className="font-bold mb-3 
                  text-xl md:text-2xl lg:text-3xl 
                  text-red-800 dark:text-red-200">
        ⚠️ คำเตือนสำคัญ
    </p>

    <ul className="list-disc list-inside space-y-2">
        <li>
            โปรดตรวจสอบให้แน่ใจว่า <b>ท่านมีการ์ดใบนี้อยู่จริง</b> และพร้อมส่งมอบเมื่อจบการประมูล
        </li>
        <li>
            การตั้งประมูลเพื่อปั่นป่วน ก่อกวน หรือไม่มีสินค้าจริง ถือเป็นการกระทำผิดร้ายแรงต่อชุมชน
        </li>
        <li>
            หากตรวจสอบพบ <b>ไอดีของท่านจะถูกระงับถาวร (Ban)</b> ทันทีโดยไม่มีการแจ้งเตือนล่วงหน้า
        </li>
    </ul>
</div>


        <div className="space-y-4">
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">ราคาเริ่มต้น (บาท)</label>
                <input 
                    type="number" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-amber-500 font-mono" 
                    min="0"
                />
            </div>
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">ระยะเวลา (หน่วย: ชั่วโมง)</label>
                <div className="relative">
                    {/* 🟢 [แก้ไข] Input: p-3 และ text-lg */}
                    <input 
                        type="number" 
                        value={hours} 
                        onChange={e => setHours(e.target.value)} 
                        className="w-full p-3 pr-12 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-amber-500 font-mono text-lg" 
                        min="1"
                        placeholder="เช่น 24"
                    />
                    {/* 🟢 [แก้ไข] Span: top-3 และ text-lg */}
                    <span className="absolute right-3 top-3 text-lg text-slate-400">ชม.</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                    *เช่น 24 = 1 วัน, 48 = 2 วัน
                </p>
            </div>
            
            <div className="flex gap-3 pt-4">
                <button onClick={onClose} className="flex-1 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-sm">ยกเลิก</button>
                <button onClick={handleCreate} disabled={loading} className="flex-1 py-2 rounded bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-sm">
                    {loading ? "กำลังตรวจสอบ..." : "ข้าพเจ้ายอมรับและเริ่มประมูล"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}