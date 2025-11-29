import React, { useState, useRef, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { CameraIcon, CloseIcon, ShieldCheckIcon } from './components/Icons'; 

const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_SIZE = 1000; 
        let width = img.width;
        let height = img.height;
        if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } 
        else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });
          resolve(resizedFile);
        }, 'image/jpeg', 0.8); 
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default function CreateAuctionModal({ isOpen, onClose, card, userProfile }) {
  const [price, setPrice] = useState(100);
  const [hours, setHours] = useState(24);
  const [minBid, setMinBid] = useState(50);
  const [buyNow, setBuyNow] = useState('');
  const [description, setDescription] = useState('');
  
  // State สำหรับระบบ Escrow
  const [useEscrow, setUseEscrow] = useState(false);

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);

  // คำนวณค่าธรรมเนียม (ประมาณการจากราคาเริ่ม)
  const feeInfo = useMemo(() => {
      const startPrice = parseInt(price) || 0;
      // สูตร: 5% ของราคา แต่ไม่ต่ำกว่า 25 บาท
      const fee = Math.max(25, Math.ceil(startPrice * 0.05));
      const net = startPrice - fee;
      return { fee, net };
  }, [price]);

  if (!isOpen || !card) return null;

  const handleFileChange = async (e) => { 
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (imageFiles.length + files.length > 6) return alert("อัปโหลดได้สูงสุด 6 รูปครับ");

    const newFiles = [];
    const newPreviews = [];

    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        try {
            const resizedFile = await resizeImage(file);
            newFiles.push(resizedFile);
            newPreviews.push(URL.createObjectURL(resizedFile));
        } catch (err) {
            console.error("Resize error:", err);
            newFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        }
    }
    setImageFiles(prev => [...prev, ...newFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
        const urlToRemove = prev[index];
        URL.revokeObjectURL(urlToRemove);
        return prev.filter((_, i) => i !== index);
    });
  };

  const handleCreate = async () => {
    if (!userProfile) return alert("กรุณา Login ก่อนตั้งขายครับ");
    if (parseInt(hours) < 1) return alert("ระยะเวลาต้องอย่างน้อย 1 ชั่วโมงครับ");
    if (parseInt(minBid) < 1) return alert("ขั้นต่ำในการบิดต้องมากกว่า 0 ครับ");
    if (buyNow && parseInt(buyNow) <= parseInt(price)) return alert("ราคา 'บิดจบ' (Buy Now) ต้องสูงกว่าราคาเริ่มต้นครับ");

    // แจ้งเตือนยืนยันเรื่องค่าธรรมเนียมอีกรอบ
    if (useEscrow) {
        const confirmMsg = 
`ยืนยันเงื่อนไขระบบประกัน (Escrow):

⚠️ โปรดทราบ: ค่าธรรมเนียม 5% (ขั้นต่ำ 25 บ.) จะถูกหักจาก "ยอดจบประมูลจริง"
(ตัวอย่าง: หากเริ่ม 500 แต่จบที่ 1,000 ระบบจะหักจากยอด 1,000)

โดยประมาณการจากราคาเริ่ม:
- หักค่าธรรมเนียม: ~${feeInfo.fee.toLocaleString()} บาท
- คุณจะได้รับสุทธิ: ~${feeInfo.net.toLocaleString()} บาท

ยืนยันที่จะลงประมูลหรือไม่?`;
        if (!confirm(confirmMsg)) return;
    }

    setLoading(true);

    try {
        const uploadedUrls = [];
        if (imageFiles.length > 0) {
            const uploadPromises = imageFiles.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${userProfile.email}/${fileName}`;
                const { error: uploadError } = await supabase.storage.from('auction-images').upload(filePath, file);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('auction-images').getPublicUrl(filePath);
                return data.publicUrl;
            });
            const results = await Promise.all(uploadPromises);
            uploadedUrls.push(...results);
        }

        const endTime = new Date();
        endTime.setHours(endTime.getHours() + parseInt(hours));
        const proofImageValue = uploadedUrls.length > 0 ? JSON.stringify(uploadedUrls) : null;

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
          description: description.trim(),
          proof_image: proofImageValue,
          is_escrow: useEscrow 
        };

        const { error } = await supabase.from('auctions').insert(payload);
        if (error) throw error;

        alert("ลงขายสำเร็จ! 🔨");
        onClose();

    } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[500] p-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-lg border border-slate-300 dark:border-emerald-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
           <span className="text-2xl">⚖️</span> เปิดประมูล: {card.name}
        </h2>
        
        {/* 🔴 กฎการประมูล (คงไว้ครบถ้วน) */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 p-4 rounded-xl mb-5 text-sm md:text-base text-red-700 dark:text-red-300">
            <p className="font-bold mb-2 text-lg">⚠️ คำเตือนสำคัญ</p>
            <ul className="list-disc list-inside space-y-1">
                <li>โปรดตรวจสอบให้แน่ใจว่า <b>ท่านมีการ์ดใบนี้อยู่จริง</b> และพร้อมส่งมอบเมื่อจบการประมูล</li>
                <li>การตั้งประมูลเพื่อปั่นป่วน ก่อกวน หรือไม่มีสินค้าจริง ถือเป็นการกระทำผิดร้ายแรงต่อชุมชน</li>
                <li>หากตรวจสอบพบ <b>ไอดีของท่านจะถูกระงับถาวร (Ban)</b> ทันทีโดยไม่มีการแจ้งเตือนล่วงหน้า</li>
            </ul>
        </div>

        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">ราคาเริ่มต้น (บาท)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-amber-500 font-mono" min="0" />
                </div>
                <div>
                    <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">ระยะเวลา (ชม.)</label>
                    <input type="number" value={hours} onChange={e => setHours(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-amber-500 font-mono" min="1" />
                </div>
            </div>

            {/* 🟢 ส่วนระบบ Escrow (ปรับปรุงคำอธิบาย) */}
            <div className={`p-4 rounded-xl border transition-all ${useEscrow ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={useEscrow} 
                        onChange={(e) => setUseEscrow(e.target.checked)}
                        className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                            <ShieldCheckIcon /> เปิดใช้ระบบคุ้มครอง (Escrow)
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            ผู้ซื้อต้องวางเงินประกันเข้าระบบก่อนบิด ช่วยคัดกรองผู้ซื้อและป้องกันการบิดเล่น
                        </p>
                    </div>
                </label>

                {/* ตารางคำนวณค่าธรรมเนียม */}
                {useEscrow && (
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700/50 text-sm space-y-2 animate-fade-in">
                        {/* คำอธิบายเพิ่มเติม */}
                        <div className="bg-white/80 dark:bg-black/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30 mb-3">
                             <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                ℹ️ <b>ค่าธรรมเนียม 5%</b> (ขั้นต่ำ 25 บ.) จะถูกหักจาก <u>ราคาสุดท้ายที่ผู้ประมูลชนะ</u>
                                <br/>
                                <span className="text-slate-500 dark:text-slate-400 block mt-1">
                                    (เช่น ราคาเริ่ม 500 แต่จบที่ 1,000 บาท ระบบจะหักจากยอด 1,000 บาท)
                                </span>
                             </p>
                        </div>

                        <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                            <span>ประมาณการจากราคาเริ่ม:</span>
                            <span className="font-mono font-bold">{parseInt(price || 0).toLocaleString()} ฿</span>
                        </div>
                        <div className="flex justify-between items-center text-red-600 dark:text-red-400">
                            <span>หักค่าธรรมเนียมโดยประมาณ:</span>
                            <span className="font-mono font-bold">- {feeInfo.fee.toLocaleString()} ฿</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 mt-1 border-t border-blue-200 dark:border-blue-700/50 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                            <span>รายรับสุทธิ (เริ่มต้น):</span>
                            <span className="font-mono">{feeInfo.net.toLocaleString()} ฿</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-emerald-600 dark:text-emerald-400 mb-1 font-bold">บิดขั้นต่ำ (+ทีละ)</label>
                    <input type="number" value={minBid} onChange={e => setMinBid(e.target.value)} className="w-full p-2 rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 dark:text-white outline-none focus:border-emerald-500 font-mono" min="1" />
                </div>
                <div>
                    <label className="block text-sm text-amber-600 dark:text-amber-400 mb-1 font-bold">ราคาบิดจบ (Buy Now)</label>
                    <input type="number" value={buyNow} onChange={e => setBuyNow(e.target.value)} placeholder="ไม่บังคับ" className="w-full p-2 rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 dark:text-white outline-none focus:border-amber-500 font-mono placeholder:text-slate-400" />
                </div>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-2">รูปภาพสินค้าจริง ({imageFiles.length}/6)</label>
                <div className="grid grid-cols-3 gap-2">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 group">
                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full shadow-lg hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"><CloseIcon width="16" height="16" /></button>
                        </div>
                    ))}
                    {imageFiles.length < 6 && (
                        <div onClick={() => fileInputRef.current.click()} className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-1 text-slate-400 hover:text-emerald-500 hover:border-emerald-500">
                            <CameraIcon />
                            <span className="text-xs">เพิ่มรูป</span>
                        </div>
                    )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">รายละเอียดสินค้า / ตำหนิ</label>
                <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="เช่น การ์ดสภาพ 99% ไม่มีตำหนิ หรือ นัดรับได้ที่..." className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-amber-500 resize-none text-sm" />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-sm">ยกเลิก</button>
                <button onClick={handleCreate} disabled={loading} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-sm shadow-lg flex items-center justify-center gap-2">
                    {loading && <span className="animate-spin text-white">⏳</span>}
                    {loading ? "กำลังอัปโหลด..." : "ยืนยันลงประมูล"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}