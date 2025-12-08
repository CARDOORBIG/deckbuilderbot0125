import React, { useState } from 'react';
import { CloseIcon, UploadIcon } from './Icons';

// ✅ เพิ่มไอคอน Download แบบ Inline SVG (เผื่อในไฟล์ Icons.jsx ไม่มี)
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
  </svg>
);

export default function TopUpModal({ isOpen, onClose, userProfile, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUploadAndCheck = async () => {
    if (!file) return alert("กรุณาเลือกรูปสลิปก่อนครับ");
    if (!userProfile) return alert("กรุณา Login ก่อนครับ");
    
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', userProfile?.email
);

      // 👇 URL ของ Supabase Function
      const SUPABASE_FUNCTION_URL = "https://whrirlmtsowzlabnyaib.supabase.co/functions/v1/topup";
      
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ เติมเงินสำเร็จ! +${result.amount} บาท`);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        throw new Error(result.message || "สลิปไม่ถูกต้อง");
      }

    } catch (error) {
      console.error(error);
      alert("❌ เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Path ของไฟล์รูป QR Code
  const qrCodePath = "/assets/QR%20CODE%20PP.jpg";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-4 bg-emerald-600 text-white flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg flex items-center gap-2">
             💰 เติมเงิน (Top Up)
          </h3>
          <button onClick={onClose}><CloseIcon /></button>
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          
          {/* ✅✅✅ ส่วนแสดงข้อมูลบัญชี (แก้ไขใหม่) ✅✅✅ */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
            
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mb-3">สแกน QR Code เพื่อเติมเงิน</p>
            
            {/* 1. รูป QR Code (ปรับขนาดให้เต็มขึ้น) */}
            <img 
              src={qrCodePath}
              alt="QR Code รับเงิน" 
              // 🔥 แก้ไข CSS ตรงนี้: เปลี่ยนจาก w-48 h-48 เป็น w-full max-w-[320px] h-auto
              className="w-full max-w-[320px] h-auto object-contain rounded-xl shadow-md border border-slate-100 dark:border-slate-600 bg-white mb-4"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML += '<p class="text-red-500 text-sm">❌ ไม่พบรูป QR Code</p>';
              }}
            />

            {/* ✅ 2. เพิ่มปุ่มบันทึกรูปภาพ */}
            <a 
              href={qrCodePath} 
              download="KBANK-QR-BattleOfTalingchan.jpg" // ชื่อไฟล์ตอนดาวน์โหลด
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors mb-4 shadow-sm border border-slate-200 dark:border-slate-600"
            >
              <DownloadIcon />
              บันทึกรูป QR Code
            </a>

            {/* เส้นคั่น */}
            <div className="w-full border-t border-slate-200 dark:border-slate-700 my-2"></div>

            {/* 3. รายละเอียดเลขบัญชี */}
            <div className="space-y-1 mt-2">
              <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                ธนาคารกสิกรไทย (KBANK)
              </p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 select-all tracking-wider font-mono">
                221-1-53897-2
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                ชื่อบัญชี: นาย ศิวกร เรืองจินดา
              </p>
            </div>

          </div>
          {/* ✅✅✅ จบส่วนแสดงข้อมูล ✅✅✅ */}


          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative h-32 group shrink-0">
            {preview ? (
              <img src={preview} className="h-full object-contain z-10 rounded-lg" alt="Slip Preview" />
            ) : (
              <div className="text-center text-slate-400">
                <UploadIcon />
                <span className="text-sm mt-2 block">อัปโหลดสลิปโอนเงิน</span>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleUploadAndCheck} 
            disabled={loading || !file}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shrink-0"
          >
            {loading ? "กำลังตรวจสอบสลิป..." : "ยืนยันการเติมเงิน"}
          </button>
        </div>
      </div>
    </div>
  );
}