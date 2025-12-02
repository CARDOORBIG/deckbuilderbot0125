import React, { useState, useRef, useMemo, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { CameraIcon, CloseIcon, ShieldCheckIcon } from './components/Icons'; 

// --- Icons ---
const BigCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-emerald-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;
const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-amber-500"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>;
const ShieldInfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-blue-500"><path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;

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
  
  const [useEscrow, setUseEscrow] = useState(false);
  const [topupStatus, setTopupStatus] = useState('open'); 
  const [loading, setLoading] = useState(false);

  const [showEscrowConfirm, setShowEscrowConfirm] = useState(false);
  const [showNormalConfirm, setShowNormalConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
        const checkSystem = async () => {
            const { data } = await supabase.from('system_config').select('value').eq('key', 'topup_status').single();
            if (data) {
                setTopupStatus(data.value);
                if (data.value !== 'open') setUseEscrow(false);
            }
        };
        checkSystem();
    }
  }, [isOpen]);

  const isSystemDown = topupStatus !== 'open';

  const feeInfo = useMemo(() => {
      const startPrice = parseInt(price) || 0;
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

  const handleValidateAndCheck = () => {
    if (!userProfile) return alert("กรุณา Login ก่อนตั้งขายครับ");
    if (parseInt(hours) < 1) return alert("ระยะเวลาต้องอย่างน้อย 1 ชั่วโมงครับ");
    if (parseInt(minBid) < 1) return alert("ขั้นต่ำในการบิดต้องมากกว่า 0 ครับ");
    if (buyNow && parseInt(buyNow) <= parseInt(price)) return alert("ราคา 'บิดจบ' (Buy Now) ต้องสูงกว่าราคาเริ่มต้นครับ");

    if (useEscrow && isSystemDown) {
        setUseEscrow(false);
        return alert("⛔ ระบบเติมเงินปิดปรับปรุง ไม่สามารถใช้ระบบ Escrow ได้ในขณะนี้ครับ");
    }

    if (useEscrow) setShowEscrowConfirm(true);
    else setShowNormalConfirm(true);
  };

  const submitAuction = async () => {
    setShowEscrowConfirm(false);
    setShowNormalConfirm(false);
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
          is_escrow: isSystemDown ? false : useEscrow 
        };

        const { error } = await supabase.from('auctions').insert(payload);
        if (error) throw error;

        setIsSuccess(true);
        setTimeout(() => {
            onClose();
            setTimeout(() => {
                setIsSuccess(false);
                setPrice(100);
                setImageFiles([]);
                setPreviewUrls([]);
            }, 300);
        }, 2500);

    } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[500] p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-lg border border-slate-300 dark:border-emerald-500/30 shadow-2xl max-h-[90vh] overflow-y-auto relative">
        
        {/* Success Screen */}
        {isSuccess ? (
             <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in-up">
                <div className="mb-6 animate-bounce"><BigCheckIcon /></div>
                <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-2">ลงประมูลสำเร็จ!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg">สินค้าของคุณเข้าสู่ลานประมูลแล้ว 🔨</p>
            </div>
        ) : (
            // Form Screen
            <>
                <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                   <span className="text-2xl">⚖️</span> เปิดประมูล: {card.name}
                </h2>
                
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 p-4 rounded-xl mb-5 text-sm md:text-base text-red-700 dark:text-red-300">
                    <p className="font-bold mb-2 text-lg">⚠️ คำเตือนสำคัญ</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>โปรดตรวจสอบให้แน่ใจว่า <b>ท่านมีการ์ดใบนี้อยู่จริง</b> และพร้อมส่งมอบเมื่อจบการประมูล</li>
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

                    {/* Escrow Section */}
                    <div className={`p-4 rounded-xl border transition-all ${isSystemDown ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 opacity-70 cursor-not-allowed' : (useEscrow ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600')}`}>
                        <label className={`flex items-start gap-3 ${isSystemDown ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}>
                            <input type="checkbox" checked={useEscrow && !isSystemDown} onChange={(e) => { if (isSystemDown) return; setUseEscrow(e.target.checked); }} disabled={isSystemDown} className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer disabled:cursor-not-allowed" />
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white"><ShieldCheckIcon /> เปิดใช้ระบบคุ้มครอง (Escrow)</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ผู้ซื้อต้องวางเงินประกันเข้าระบบก่อนบิด ช่วยคัดกรองผู้ซื้อและป้องกันการบิดเล่น</p>
                                {isSystemDown && (<div className="mt-2 p-2 bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded text-red-600 dark:text-red-300 text-xs font-bold flex items-center gap-2"><span>⛔</span> ระบบปิดปรับปรุงชั่วคราว</div>)}
                            </div>
                        </label>
                        {useEscrow && !isSystemDown && (<div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700/50 text-sm space-y-2 animate-fade-in"><div className="flex justify-between items-center text-slate-600 dark:text-slate-300"><span>ประมาณการจากราคาเริ่ม:</span><span className="font-mono font-bold">{parseInt(price || 0).toLocaleString()} ฿</span></div><div className="flex justify-between items-center text-red-600 dark:text-red-400"><span>หักค่าธรรมเนียมโดยประมาณ:</span><span className="font-mono font-bold">- {feeInfo.fee.toLocaleString()} ฿</span></div><div className="flex justify-between items-center pt-2 mt-1 border-t border-blue-200 dark:border-blue-700/50 text-emerald-600 dark:text-emerald-400 font-bold text-base"><span>รายรับสุทธิ (เริ่มต้น):</span><span className="font-mono">{feeInfo.net.toLocaleString()} ฿</span></div></div>)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm text-emerald-600 dark:text-emerald-400 mb-1 font-bold">บิดขั้นต่ำ (+ทีละ)</label><input type="number" value={minBid} onChange={e => setMinBid(e.target.value)} className="w-full p-2 rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 dark:text-white outline-none focus:border-emerald-500 font-mono" min="1" /></div>
                        <div><label className="block text-sm text-amber-600 dark:text-amber-400 mb-1 font-bold">ราคาบิดจบ (Buy Now)</label><input type="number" value={buyNow} onChange={e => setBuyNow(e.target.value)} placeholder="ไม่บังคับ" className="w-full p-2 rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 dark:text-white outline-none focus:border-amber-500 font-mono placeholder:text-slate-400" /></div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-2">รูปภาพสินค้าจริง ({imageFiles.length}/6)</label>
                        <div className="grid grid-cols-3 gap-2">
                            {previewUrls.map((url, index) => (<div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 group"><img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" /><button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full shadow-lg hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"><CloseIcon width="16" height="16" /></button></div>))}
                            {imageFiles.length < 6 && (<div onClick={() => fileInputRef.current.click()} className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-1 text-slate-400 hover:text-emerald-500 hover:border-emerald-500"><CameraIcon /><span className="text-xs">เพิ่มรูป</span></div>)}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">รายละเอียดสินค้า / ตำหนิ</label>
                        <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="เช่น การ์ดสภาพ 99% ไม่มีตำหนิ หรือ นัดรับได้ที่..." className="w-full p-2 rounded border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-amber-500 resize-none text-sm" />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                        <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-sm">ยกเลิก</button>
                        <button onClick={handleValidateAndCheck} disabled={loading} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-sm shadow-lg flex items-center justify-center gap-2">{loading && <span className="animate-spin text-white">⏳</span>}{loading ? "กำลังอัปโหลด..." : "ยืนยันลงประมูล"}</button>
                    </div>
                </div>
            </>
        )}
      </div>

      {/* Escrow Popup */}
      {showEscrowConfirm && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white dark:bg-slate-900 border-[3px] border-blue-500 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(59,130,246,0.4)] transform scale-100 animate-bounce-in relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                <div className="mb-4 animate-pulse text-blue-500"><ShieldInfoIcon /></div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">ยืนยันระบบ Escrow</h3>
                <div className="text-slate-600 dark:text-slate-300 mb-6 space-y-3 text-sm text-left bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-bold text-blue-700 dark:text-blue-300 border-b border-blue-300 pb-2 mb-2">เงื่อนไขการใช้งาน:</p>
                    <p>1. ค่าธรรมเนียม <b>5% (ขั้นต่ำ 25 บ.)</b> จะถูกหักจาก "ยอดจบประมูลจริง"</p>
                    <div className="text-xs bg-white dark:bg-slate-800 p-2 rounded border border-blue-100 dark:border-blue-900"><p>ตัวอย่าง (ราคาเริ่ม {parseInt(price).toLocaleString()} บ.):</p><p className="text-red-500">- หักค่าธรรมเนียม: ~{feeInfo.fee.toLocaleString()} บ.</p><p className="text-emerald-500 font-bold">- ได้รับสุทธิ: ~{feeInfo.net.toLocaleString()} บ.</p></div><p className="text-xs text-slate-500 mt-2">*ราคาสุดท้ายอาจเปลี่ยนแปลงตามยอดบิดจบ</p>
                </div>
                <div className="flex gap-3 w-full">
                    <button onClick={() => setShowEscrowConfirm(false)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">กลับไปแก้ไข</button>
                    <button onClick={submitAuction} disabled={loading} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-500 transition-transform active:scale-95">{loading ? "กำลังสร้าง..." : "ยอมรับและลงขาย"}</button>
                </div>
            </div>
        </div>
      )}

      {/* Normal Popup */}
      {showNormalConfirm && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white dark:bg-slate-900 border-[3px] border-amber-500 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(245,158,11,0.4)] transform scale-100 animate-bounce-in relative overflow-hidden flex flex-col items-center text-center">
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
                <div className="mb-4 animate-pulse"><WarningIcon /></div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">ยืนยันการลงประมูล?</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">(โหมดทั่วไป: นัดรับ/โอนตรง)</p>
                <div className="text-slate-600 dark:text-slate-300 mb-6 space-y-3 text-sm text-left bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p>⚠️ <b>ข้อควรระวัง:</b></p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>ท่านต้องมีสินค้าจริงและพร้อมส่งมอบ</li>
                        <li>หากมีผู้บิดแล้ว <b>ห้ามยกเลิก</b> กลางคัน</li>
                        <li>หากตรวจพบการทุจริต หรือเบี้ยวส่งของ ระบบจะ <b>ระงับบัญชีถาวร</b> และหักเครดิตความน่าเชื่อถือ</li>
                    </ul>
                </div>
                <div className="flex gap-3 w-full">
                    <button onClick={() => setShowNormalConfirm(false)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">กลับไปแก้ไข</button>
                    <button onClick={submitAuction} disabled={loading} className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl shadow-lg hover:bg-amber-600 transition-transform active:scale-95">{loading ? "กำลังสร้าง..." : "ยืนยันลงขาย"}</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}