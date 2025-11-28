import React, { useState, useRef } from 'react';
import { supabase } from './supabaseClient';
import { CameraIcon, CloseIcon } from './components/Icons'; 

const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_SIZE = 1000; // กำหนดด้านกว้างสุดไม่เกิน 1000px
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // แปลงกลับเป็น Blob -> File
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        }, 'image/jpeg', 0.8); // คุณภาพ 80% (ลดขนาดไฟล์ได้เยอะมาก)
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
  
  // 🟢 เปลี่ยนจากเก็บรูปเดียว เป็น Array
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);

  if (!isOpen || !card) return null;

  // 🟢 ฟังก์ชันจัดการเมื่อเลือกรูป (พร้อม Resize)
  const handleFileChange = async (e) => { // อย่าลืมเติม async
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // เช็คจำนวนรูป
    if (imageFiles.length + files.length > 6) {
        return alert("อัปโหลดได้สูงสุด 6 รูปครับ");
    }

    const newFiles = [];
    const newPreviews = [];

    // วนลูปย่อรูปทีละรูป
    for (const file of files) {
        // ข้ามไฟล์ที่ไม่ใช่รูป
        if (!file.type.startsWith('image/')) continue;

        try {
            // เรียกฟังก์ชันย่อรูป
            const resizedFile = await resizeImage(file);
            newFiles.push(resizedFile);
            newPreviews.push(URL.createObjectURL(resizedFile));
        } catch (err) {
            console.error("Resize error:", err);
            // ถ้าย่อไม่ได้จริงๆ ให้ใช้ไฟล์เดิม
            newFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        }
    }

    setImageFiles(prev => [...prev, ...newFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  // 🟢 ฟังก์ชันลบรูปตาม Index
  const handleRemoveImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
        // ลบ URL และ Revoke เพื่อคืน Memory
        const urlToRemove = prev[index];
        URL.revokeObjectURL(urlToRemove);
        return prev.filter((_, i) => i !== index);
    });
  };

  const handleCreate = async () => {
    if (!userProfile) return alert("กรุณา Login ก่อนตั้งขายครับ");
    if (parseInt(hours) < 1) return alert("ระยะเวลาต้องอย่างน้อย 1 ชั่วโมงครับ");
    if (parseInt(minBid) < 1) return alert("ขั้นต่ำในการบิดต้องมากกว่า 0 ครับ");
    if (buyNow && parseInt(buyNow) <= parseInt(price)) {
        return alert("ราคา 'บิดจบ' (Buy Now) ต้องสูงกว่าราคาเริ่มต้นครับ");
    }

    setLoading(true);

    try {
        const uploadedUrls = [];

        // 🟢 1. วนลูปอัปโหลดรูปทั้งหมด (Upload Multiple)
        if (imageFiles.length > 0) {
            // ใช้ Promise.all เพื่ออัปโหลดพร้อมกัน (เร็วขึ้น)
            const uploadPromises = imageFiles.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${userProfile.email}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('auction-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: publicData } = supabase.storage
                    .from('auction-images')
                    .getPublicUrl(filePath);
                
                return publicData.publicUrl;
            });

            // รอจนเสร็จครบทุกรูป
            const results = await Promise.all(uploadPromises);
            uploadedUrls.push(...results);
        }

        const endTime = new Date();
        endTime.setHours(endTime.getHours() + parseInt(hours));

        // 🟢 2. บันทึกเป็น JSON String (เพราะ Column เดิมเป็น text)
        // ถ้าไม่มีรูป จะเป็น null
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
          proof_image: proofImageValue // เก็บเป็น Array String ["url1", "url2"]
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
        
        {/* Warning Box */}
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
            {/* Price & Time Inputs */}
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

            {/* 🟢 Image Upload Section (Multi-File) */}
            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-2">
                    รูปภาพสินค้าจริง ({imageFiles.length}/6)
                </label>
                
                <div className="grid grid-cols-3 gap-2">
                    {/* Render Previews */}
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 group">
                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button 
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full shadow-lg hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <CloseIcon width="16" height="16" />
                            </button>
                        </div>
                    ))}

                    {/* Add Button (แสดงต่อเมื่อยังไม่ครบ 6 รูป) */}
                    {imageFiles.length < 6 && (
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-1 text-slate-400 hover:text-emerald-500 hover:border-emerald-500"
                        >
                            <CameraIcon />
                            <span className="text-xs">เพิ่มรูป</span>
                        </div>
                    )}
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    multiple // 🟢 อนุญาตให้เลือกหลายรูปในหน้าต่างเลือกไฟล์
                    className="hidden" 
                />
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