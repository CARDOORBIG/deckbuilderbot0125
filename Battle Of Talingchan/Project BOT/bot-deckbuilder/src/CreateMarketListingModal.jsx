import React, { useState, useRef } from 'react';
import { supabase } from './supabaseClient';
import { CameraIcon, CloseIcon, ShoppingBagIcon } from './components/Icons'; 

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

export default function CreateMarketListingModal({ isOpen, onClose, userProfile }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Played');
  const [category, setCategory] = useState('General'); // 🟢 เพิ่ม State หมวดหมู่
  
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (imageFiles.length + files.length > 6) return alert("ลงรูปได้สูงสุด 6 รูปครับ");

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
    if (!userProfile) return alert("กรุณา Login ก่อนลงขายครับ");
    if (!title.trim()) return alert("กรุณาระบุชื่อสินค้า");
    if (!price || parseInt(price) < 0) return alert("กรุณาระบุราคาที่ถูกต้อง");
    if (imageFiles.length === 0) return alert("ต้องแนบรูปสินค้าอย่างน้อย 1 รูป");

    setLoading(true);

    try {
        const uploadedUrls = [];
        const uploadPromises = imageFiles.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `market_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${userProfile.email}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('auction-images').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('auction-images').getPublicUrl(filePath);
            return data.publicUrl;
        });

        const results = await Promise.all(uploadPromises);
        uploadedUrls.push(...results);

        const payload = {
          seller_email: userProfile.email,
          seller_name: userProfile.name,
          seller_avatar: userProfile.picture,
          title: title.trim(),
          price: parseInt(price),
          description: description.trim(),
          condition,
          category, // 🟢 ส่งหมวดหมู่ไปด้วย
          images: JSON.stringify(uploadedUrls),
          status: 'active'
        };

        const { error } = await supabase.from('market_listings').insert(payload);
        if (error) throw error;

        alert("ลงขายสำเร็จ! 🏪");
        onClose();
    } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[600] p-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-lg border border-slate-300 dark:border-emerald-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
           <ShoppingBagIcon /> ลงขายสินค้า (ตลาดนัด)
        </h2>
        
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">ชื่อสินค้า</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="เช่น ขายเหมาฟอย, เด็คเมต้า..." className="w-full p-2.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-emerald-500 font-bold" autoFocus />
            </div>

            {/* หมวดหมู่ & สภาพ */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">หมวดหมู่</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-emerald-500">
                        <option value="General">ทั่วไป</option>
                        <option value="Single">การ์ดเดี่ยว</option>
                        <option value="Bulk">ยกกอง / Box</option>
                        <option value="Deck">เด็ค</option>
                        <option value="Accessories">อุปกรณ์เสริม</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">สภาพสินค้า</label>
                    <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-emerald-500">
                        <option value="Played">Played (มีรอยเล่น)</option>
                        <option value="Mint">Mint (ใหม่กริบ)</option>
                        <option value="Near Mint">Near Mint (สวยมาก)</option>
                        <option value="Damaged">Damaged (มีตำหนิเยอะ)</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">ราคา (บาท)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-emerald-500 font-mono text-lg font-bold text-emerald-600" min="0" />
            </div>

            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-2">รูปภาพสินค้า ({imageFiles.length}/6)</label>
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

            <div>
                <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="รายละเอียดการ์ด, การจัดส่ง, นัดรับ..." className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-emerald-500 resize-none text-sm" />
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-sm">ยกเลิก</button>
                {/* 🟢 ปุ่มสีเขียว */}
                <button onClick={handleCreate} disabled={loading} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-sm shadow-lg flex items-center justify-center gap-2">
                    {loading ? "กำลังบันทึก..." : "ยืนยันลงขาย"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}