import React, { useState, useRef } from 'react';
import { supabase } from './supabaseClient';
import { CameraIcon, CloseIcon } from './components/Icons'; 

// ฟังก์ชันย่อรูป (เหมือนเดิม)
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

export default function CreateBulkAuctionModal({ isOpen, onClose, userProfile }) {
  // 🟢 1. เพิ่ม State สำหรับชื่อสินค้า (เพราะไม่ได้เลือกจาก DB)
  const [customName, setCustomName] = useState('');
  
  const [price, setPrice] = useState(100);
  const [hours, setHours] = useState(24);
  const [minBid, setMinBid] = useState(50);
  const [buyNow, setBuyNow] = useState('');
  const [description, setDescription] = useState('');
  
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
        URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
    });
  };

  const handleCreate = async () => {
    if (!userProfile) return alert("กรุณา Login ก่อนตั้งขายครับ");
    if (!customName.trim()) return alert("กรุณาระบุชื่อสินค้าครับ"); // 🟢 บังคับชื่อ
    if (imageFiles.length === 0) return alert("การประมูลแบบนี้ **ต้องแนบรูปภาพอย่างน้อย 1 รูป** ครับ"); // 🟢 บังคับรูป
    
    if (parseInt(hours) < 1) return alert("ระยะเวลาขั้นต่ำ 1 ชม.");
    if (parseInt(minBid) < 1) return alert("บิดขั้นต่ำต้อง > 0");
    if (buyNow && parseInt(buyNow) <= parseInt(price)) return alert("ราคา Buy Now ต้องมากกว่าราคาเริ่ม");

    setLoading(true);

    try {
        // อัปโหลดรูป
        const uploadedUrls = [];
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

        const endTime = new Date();
        endTime.setHours(endTime.getHours() + parseInt(hours));

        // 🟢 สร้าง Payload สำหรับสินค้า Custom
        const payload = {
          seller_email: userProfile.email,
          seller_name: userProfile.name,
          
          // ใช้ชื่อที่กรอกเอง
          card_name: customName.trim(), 
          
          // สร้าง ID ปลอมๆ ขึ้นมาเพื่อให้ระบบทำงานได้ (ขึ้นต้นด้วย CUSTOM)
          card_id: `CUSTOM-${Date.now()}`, 
          
          // ใช้ Marker พิเศษเพื่อให้ Frontend รู้ว่าต้องเอารูปจาก proof_image มาโชว์
          card_image_path: 'CUSTOM_ITEM', 
          
          start_price: parseInt(price),
          current_price: parseInt(price),
          end_time: endTime.toISOString(),
          status: 'active',
          min_bid_increment: parseInt(minBid),
          buy_now_price: buyNow ? parseInt(buyNow) : null,
          description: description.trim(),
          proof_image: JSON.stringify(uploadedUrls) // เก็บรูปทั้งหมด
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
           <span className="text-2xl">📦</span> เปิดประมูล: ยกกล่อง/อื่นๆ
        </h2>
        
        {/* Warning Box */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-800 p-4 rounded-xl mb-5 text-sm text-amber-800 dark:text-amber-200">
            <p className="font-bold mb-1">💡 คำแนะนำ</p>
            <ul className="list-disc list-inside">
                <li>โหมดนี้สำหรับสินค้าที่ <b>ไม่มีในฐานข้อมูล</b> (เช่น ยกกล่อง, Playmat, ซองสุ่ม)</li>
                <li><b>จำเป็นต้อง</b> ถ่ายรูปสินค้าจริงให้ชัดเจน (อย่างน้อย 1 รูป)</li>
                <li>
            โปรดตรวจสอบให้แน่ใจว่า <b>ท่านมีการ์ดหรือสินค้านี้อยู่จริง</b> และพร้อมส่งมอบเมื่อจบการประมูล
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
            {/* 🟢 ชื่อสินค้า (Input ใหม่) */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">ชื่อสินค้า (ระบุให้ชัดเจน)</label>
                <input 
                    type="text" 
                    value={customName} 
                    onChange={e => setCustomName(e.target.value)} 
                    placeholder="เช่น Box BT01 ซีลเดิม, Playmat ลาย..." 
                    className="w-full p-2.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-emerald-500 font-bold" 
                    autoFocus
                />
            </div>

            {/* Price & Time */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">ราคาเริ่มต้น</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-emerald-500 font-mono" min="0" />
                </div>
                <div>
                    <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">ระยะเวลา (ชม.)</label>
                    <input type="number" value={hours} onChange={e => setHours(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-emerald-500 font-mono" min="1" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-emerald-600 dark:text-emerald-400 mb-1 font-bold">บิดขั้นต่ำ</label>
                    <input type="number" value={minBid} onChange={e => setMinBid(e.target.value)} className="w-full p-2 rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 dark:text-white outline-none focus:border-emerald-500 font-mono" min="1" />
                </div>
                <div>
                    <label className="block text-sm text-amber-600 dark:text-amber-400 mb-1 font-bold">Buy Now</label>
                    <input type="number" value={buyNow} onChange={e => setBuyNow(e.target.value)} placeholder="ไม่บังคับ" className="w-full p-2 rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 dark:text-white outline-none focus:border-amber-500 font-mono placeholder:text-slate-400" />
                </div>
            </div>

            {/* Image Upload (Required) */}
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-2">
                    รูปภาพสินค้าจริง <span className="text-red-500">*จำเป็น</span> ({imageFiles.length}/6)
                </label>
                
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
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">รายละเอียดสินค้า</label>
                <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="สภาพสินค้า, สิ่งที่ได้รับ, การจัดส่ง..." className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-emerald-500 resize-none text-sm" />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-sm">ยกเลิก</button>
                <button onClick={handleCreate} disabled={loading} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-sm shadow-lg flex items-center justify-center gap-2">
                    {loading && <span className="animate-spin text-white">⏳</span>}
                    {loading ? "กำลังอัปโหลด..." : "ลงประมูลเลย"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}