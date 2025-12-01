import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { CloseIcon, CameraIcon } from './Icons'; 

// ✅ ไอคอนถูก (Success)
const BigCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-emerald-500">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

// ✅ ไอคอนเตือน (Warning)
const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-amber-500">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

export default function ShipmentModal({ isOpen, onClose, auction, onSuccess }) {
  const [tracking, setTracking] = useState('');
  const [courier, setCourier] = useState('');
  const [shipDate, setShipDate] = useState(new Date().toISOString().split('T')[0]); 
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State ควบคุมหน้าจอ
  const [showConfirm, setShowConfirm] = useState(false); // 🟢 เปิด Pop-up ยืนยัน
  const [isSuccess, setIsSuccess] = useState(false);     // 🟢 เปิดหน้า Success

  const fileInputRef = useRef(null);

  if (!isOpen || !auction) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // 1. ตรวจสอบข้อมูลเบื้องต้น แล้วเปิด Pop-up ยืนยัน
  const handlePreSubmit = () => {
    if (!tracking.trim()) return alert("กรุณากรอกหมายเลขพัสดุ");
    if (!courier.trim()) return alert("กรุณาระบุบริษัทขนส่ง");
    if (!shipDate) return alert("กรุณาระบุวันที่ส่ง");
    if (!file) return alert("กรุณาอัปโหลดรูปหลักฐาน (สลิป/กล่อง/หน้าร้าน)");
    
    // เปิด Pop-up แจ้งเตือนเงื่อนไข
    setShowConfirm(true);
  };

  // 2. ฟังก์ชันบันทึกจริง (ทำงานเมื่อกดยืนยันใน Pop-up)
  const handleFinalSubmit = async () => {
    setShowConfirm(false); // ปิด Pop-up ยืนยัน
    setLoading(true);      // เริ่มโหลด

    try {
      // Upload Image
      const fileExt = file.name.split('.').pop();
      const fileName = `ship_${auction.id}_${Date.now()}.${fileExt}`;
      const filePath = `shipping_proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('auction-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('auction-images')
        .getPublicUrl(filePath);

      // Update Database
      const { error } = await supabase.rpc('submit_shipping', {
        p_auction_id: auction.id,
        p_tracking: tracking,
        p_courier: courier,
        p_date: new Date(shipDate).toISOString(),
        p_proof: urlData.publicUrl
      });

      if (error) throw error;

      // สำเร็จ -> โชว์หน้า Success
      setIsSuccess(true);

      // ปิดอัตโนมัติ
      setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
          // Reset state
          setTimeout(() => {
            setIsSuccess(false);
            setTracking('');
            setCourier('');
            setFile(null);
            setPreview(null);
          }, 300);
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1100] p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* หน้าจอ Success */}
        {isSuccess ? (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center animate-fade-in-up">
                <div className="mb-4 animate-bounce">
                    <BigCheckIcon />
                </div>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    บันทึกสำเร็จ!
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    ระบบแจ้งสถานะไปยังผู้ซื้อเรียบร้อยแล้ว
                </p>
            </div>
        ) : (
            // หน้าฟอร์มปกติ
            <>
                <div className="p-4 bg-blue-600 text-white flex justify-between items-center shrink-0">
                  <h3 className="font-bold text-lg flex items-center gap-2">🚚 แจ้งส่งสินค้า</h3>
                  <button onClick={onClose}><CloseIcon /></button>
                </div>

                <div className="p-5 overflow-y-auto space-y-4">
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
                    <strong>สินค้า:</strong> {auction.card_name}<br/>
                    <strong>ผู้รับ:</strong> {auction.winner_name}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">บริษัทขนส่ง</label>
                    <input type="text" value={courier} onChange={e => setCourier(e.target.value)} placeholder="เช่น Flash, Kerry, ไปรษณีย์ไทย" className="w-full p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white outline-none focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">หมายเลขพัสดุ (Tracking)</label>
                    <input type="text" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="เลข Tracking..." className="w-full p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white outline-none focus:border-blue-500 font-mono" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">วันที่ส่ง</label>
                    <input type="date" value={shipDate} onChange={e => setShipDate(e.target.value)} className="w-full p-2 rounded border dark:bg-slate-800 dark:border-slate-600 dark:text-white outline-none focus:border-blue-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">รูปหลักฐาน (สลิป/กล่องพัสดุ)</label>
                    <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 relative bg-slate-50 dark:bg-slate-900 transition-colors">
                      {preview ? (
                        <img src={preview} className="h-full object-contain rounded-lg" alt="Preview" />
                      ) : (
                        <div className="text-center text-slate-400">
                          <div className="flex justify-center mb-2"><CameraIcon /></div>
                          <span className="text-xs block">แตะเพื่อถ่าย/เลือกรูป</span>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                  </div>

                  <button 
                    onClick={handlePreSubmit} 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg transition-colors"
                  >
                    ตรวจสอบและยืนยัน
                  </button>

                </div>
            </>
        )}
      </div>

      {/* ✅✅✅ POPUP แจ้งเตือนเงื่อนไข (ซ้อนทับอีกที) ✅✅✅ */}
      {showConfirm && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white dark:bg-slate-900 border-[3px] border-red-500 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(239,68,68,0.4)] transform scale-100 animate-bounce-in relative overflow-hidden flex flex-col items-center text-center">
                
                {/* แถบแดงด้านบน */}
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

                {/* ไอคอนตกใจ */}
                <div className="mb-4 animate-pulse"><WarningIcon /></div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                    ยืนยันการส่งสินค้า?
                </h3>

                {/* ข้อความเตือนละเอียด */}
                <div className="text-slate-600 dark:text-slate-300 mb-6 space-y-3 text-xs md:text-sm text-left bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p>1. กรุณาตรวจสอบ <b>เลขพัสดุ</b> และ <b>รูปภาพ</b> ว่าถูกต้องครบถ้วน</p>
                    <p>2. ระบบจะแจ้งเตือนผู้ซื้อว่าสินค้าถูกจัดส่งแล้ว</p>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-600 mt-2">
                        <p className="text-red-600 dark:text-red-400 font-bold">⚠️ คำเตือนบทลงโทษ:</p>
                        <p>หากตรวจสอบพบว่าเป็นข้อมูลเท็จ หรือไม่ได้ส่งสินค้าจริง:</p>
                        <ul className="list-disc list-inside pl-1 mt-1 text-red-500">
                            <li>ระงับการใช้งาน <b>7 วัน</b> (ครั้งแรก)</li>
                            <li>ระงับการใช้งาน <b>ถาวร</b> (ครั้งต่อไป)</li>
                        </ul>
                    </div>
                </div>

                <div className="flex gap-3 w-full">
                    <button 
                        onClick={() => setShowConfirm(false)} 
                        className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                        แก้ไขข้อมูล
                    </button>
                    <button 
                        onClick={handleFinalSubmit} 
                        disabled={loading}
                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-500 transition-transform active:scale-95"
                    >
                        {loading ? "กำลังบันทึก..." : "ยืนยันส่งสินค้า"}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}