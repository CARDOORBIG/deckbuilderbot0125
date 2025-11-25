import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function CreateAuctionModal({ isOpen, onClose, card, userProfile }) {
  const [price, setPrice] = useState(100);
  const [hours, setHours] = useState(24);
  const [minBid, setMinBid] = useState(50);
  const [buyNow, setBuyNow] = useState('');
  const [description, setDescription] = useState(''); // 🟢 เพิ่ม State สำหรับ Description
  const [loading, setLoading] = useState(false);

  if (!isOpen || !card) return null;

  const handleCreate = async () => {
    if (!userProfile) return alert("กรุณา Login ก่อนตั้งขายครับ");
    if (parseInt(hours) < 1) return alert("ระยะเวลาต้องอย่างน้อย 1 ชั่วโมงครับ");
    if (parseInt(minBid) < 1) return alert("ขั้นต่ำในการบิดต้องมากกว่า 0 ครับ");
    
    // เช็ค Buy Now ต้องมากกว่าราคาเริ่ม
    if (buyNow && parseInt(buyNow) <= parseInt(price)) {
        return alert("ราคา 'บิดจบ' (Buy Now) ต้องสูงกว่าราคาเริ่มต้นครับ");
    }

    setLoading(true);

    const endTime = new Date();
    endTime.setHours(endTime.getHours() + parseInt(hours));

    // เตรียมข้อมูลส่งเข้า Supabase
    const payload = {
      seller_email: userProfile.email,
      seller_name: userProfile.name,
      card_id: card.id,
      card_name: card.name,
      card_image_path: card.imagePath,
      start_price: parseInt(price),
      current_price: parseInt(price),
      end_time: endTime.toISOString(),
      status: 'active',
      min_bid_increment: parseInt(minBid),
      buy_now_price: buyNow ? parseInt(buyNow) : null,
      description: description.trim() // 🟢 ส่ง Description ไปด้วย
    };

    const { error } = await supabase.from('auctions').insert(payload);

    setLoading(false);
    if (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาด: " + error.message + "\n(กรุณาเช็คว่า Table auctions มี column 'description' หรือยัง)");
    } else {
      alert("ลงขายสำเร็จ! 🔨");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[500] p-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-lg border border-slate-300 dark:border-emerald-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
           <span className="text-2xl">⚖️</span> เปิดประมูล: {card.name}
        </h2>
        
        {/* กล่องคำเตือน */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 p-4 rounded-xl mb-5 text-sm md:text-base text-red-700 dark:text-red-300">
            <p className="font-bold mb-2 text-lg">⚠️ คำเตือนสำคัญ</p>
            <ul className="list-disc list-inside space-y-1">
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
            {/* Row 1: ราคาเริ่ม & เวลา */}
            <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">ระยะเวลา (ชม.)</label>
                    <input 
                        type="number" 
                        value={hours} 
                        onChange={e => setHours(e.target.value)} 
                        className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-amber-500 font-mono" 
                        min="1"
                    />
                </div>
            </div>

            {/* Row 2: บิดขั้นต่ำ & Buy Now */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-emerald-600 dark:text-emerald-400 mb-1 font-bold">บิดขั้นต่ำ (+ทีละ)</label>
                    <input 
                        type="number" 
                        value={minBid} 
                        onChange={e => setMinBid(e.target.value)} 
                        className="w-full p-2 rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 dark:text-white outline-none focus:border-emerald-500 font-mono" 
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm text-amber-600 dark:text-amber-400 mb-1 font-bold">ราคาบิดจบ (Buy Now)</label>
                    <input 
                        type="number" 
                        value={buyNow} 
                        onChange={e => setBuyNow(e.target.value)} 
                        placeholder="ไม่บังคับ"
                        className="w-full p-2 rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 dark:text-white outline-none focus:border-amber-500 font-mono placeholder:text-slate-400" 
                    />
                </div>
            </div>

            {/* 🟢 Row 3: Description (เพิ่มใหม่) */}
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">รายละเอียดสินค้า / สภาพการ์ด</label>
                <textarea 
                    rows="3"
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="เช่น การ์ดสภาพ 99% ไม่มีตำหนิ หรือ นัดรับได้ที่..."
                    className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-amber-500 resize-none text-sm" 
                />
            </div>
            
            <p className="text-xs text-slate-500 text-center pt-2">
                *หากใส่ราคาบิดจบ ผู้ที่ยอมจ่ายราคานี้จะชนะทันที
            </p>

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-sm">ยกเลิก</button>
                <button onClick={handleCreate} disabled={loading} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-sm shadow-lg">
                    {loading ? "กำลังตรวจสอบ..." : "ยืนยันลงประมูล"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}