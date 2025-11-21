import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OpenBrowser() {
  const navigate = useNavigate();

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

    // ตรวจสอบว่ายังอยู่ใน In-App Browser หรือไม่
    const isInApp = /(Line|FBAN|FBAV|Instagram|Messenger)/i.test(ua);

    // 1. ถ้าไม่ได้อยู่ใน In-App แล้ว (เช่น เปิดใน Chrome แล้ว) -> กลับหน้าแรก
    if (!isInApp) {
      navigate('/', { replace: true });
      return;
    }

    // 2. ถ้าเป็น Android -> สั่งเด้งไป Chrome อัตโนมัติ
    if (isAndroid) {
      // URL ปัจจุบันที่ต้องการให้เปิด (หน้าแรก)
      const targetUrl = window.location.href.replace('/open-browser', '/');
      
      // สร้าง Intent Scheme สำหรับ Android Chrome
      // syntax: intent://<url>#Intent;scheme=https;package=com.android.chrome;end
      const intentUrl = targetUrl.replace("https://", "intent://") + "#Intent;scheme=https;package=com.android.chrome;end";
      
      // สั่ง Redirect
      window.location.href = intentUrl;
    }

    // 3. ถ้าเป็น iOS -> ทำอะไรไม่ได้มาก ต้องแสดง UI บอกให้ user กดเปิดเอง (ข้อจำกัดของ Apple)
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-4 text-red-500">ไม่รองรับการเปิดในแอปนี้</h1>
        
        <p className="text-lg mb-6 text-slate-600 dark:text-slate-300">
          ระบบ Login ของ Google ไม่สามารถใช้งานผ่าน LINE หรือ Facebook Browser ได้
        </p>

        <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl mb-6 text-left">
          <p className="font-bold mb-2">วิธีแก้ไข:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>กดที่จุด 3 จุด <span className="font-bold text-xl">⋮</span> หรือ <span className="font-bold text-xl">…</span> ที่มุมขวาบน/ล่าง</li>
            <li>เลือกเมนู <span className="font-bold text-emerald-600 dark:text-emerald-400">"Open in External Browser"</span> หรือ <span className="font-bold text-blue-600 dark:text-blue-400">"Open in Safari/Chrome"</span></li>
          </ol>
        </div>
        
        {/* ปุ่มสำรองสำหรับ Android เผื่อ Auto Redirect ไม่ทำงาน */}
        <button
           onClick={() => {
             const targetUrl = window.location.href.replace('/open-browser', '/');
             const intentUrl = targetUrl.replace("https://", "intent://") + "#Intent;scheme=https;package=com.android.chrome;end";
             window.location.href = intentUrl;
           }}
           className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg active:scale-95 transition-all"
        >
          เปิดใน Google Chrome
        </button>
      </div>
    </div>
  );
}