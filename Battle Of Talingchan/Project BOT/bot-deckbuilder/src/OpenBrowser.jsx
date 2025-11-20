// ไฟล์: OpenBrowser.jsx
import { useEffect } from 'react'; // <--- 💡 ต้องเพิ่ม useEffect
import { useNavigate } from 'react-router-dom'; // <--- 💡 ต้องเพิ่ม useNavigate

export default function OpenBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua); 
  const isAndroid = /android/.test(ua);
  
  // 💡 [ใหม่] ใช้ useNavigate hook สำหรับการเปลี่ยนหน้า
  const navigate = useNavigate();

  const currentUrl = window.location.origin + window.location.pathname;

  // =================================================================
  // 💡 [ใหม่] Check 1: ตรวจสอบว่าเปิดในเบราว์เซอร์จริงหรือไม่
  // =================================================================
  useEffect(() => {
    // ตรวจสอบว่า UA ไม่มีคำว่า IAB อีกแล้ว (แสดงว่าเปิดใน Chrome/Safari แล้ว)
    const isStillInAppBrowser =
      ua.includes("fbav") ||
      ua.includes("fban") ||
      ua.includes("fb_iab") ||
      ua.includes("instagram") ||
      ua.includes("line") ||
      ua.includes("messenger");

    // ถ้า 'ไม่ได้' อยู่ใน IAB แล้ว (เช่น เปิดใน Chrome) ให้ Redirect กลับไปหน้าหลัก
    if (!isStillInAppBrowser) {
      console.log("Redirecting to Home: Browser environment confirmed.");
      // ใช้ replace เพื่อไม่ให้ผู้ใช้กดปุ่มย้อนกลับมาที่หน้านี้อีก
      window.location.replace('/'); 
    }
    // Note: If you want to use react-router's navigate:
    // navigate('/', { replace: true });
    
  }, []); 
  
  // =================================================================

  const handleOpenBrowser = () => {
    // โค้ดนี้ใช้สำหรับพยายาม Deep Link ไปที่เบราว์เซอร์จริง
    const targetUrl = currentUrl.replace(window.location.pathname, '/'); // ส่งกลับไปหน้าหลัก

    if (isIOS) {
      // 1. iOS: พยายามใช้ window.location.href (พยายามครั้งที่ 1)
      window.location.href = targetUrl;
    } else if (isAndroid) {
      // 2. Android: ใช้ Intent Scheme เพื่อบังคับเปิดใน Chrome
      const intentUrl = 
        "intent://" + 
        targetUrl.replace(/^https?:\/\//, "") + 
        "#Intent;scheme=https;package=com.android.chrome;end";
      
      window.location.href = intentUrl;
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }} className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">⚠️ โปรดเปิดผ่านเบราว์เซอร์ภายนอก</h2>
      <p className="text-base mb-6">เพื่อใช้งาน **Google Login** ได้อย่างถูกต้อง</p>
      
      {/* 🛑 แสดงหน้านี้ต่อเมื่อยังอยู่ใน IAB เท่านั้น */}
      <button
        onClick={handleOpenBrowser}
        className="text-white font-semibold transition duration-200 hover:opacity-80"
        style={{
          marginTop: 20,
          padding: "12px 20px",
          background: "#4285F4", // Google Blue
          color: "white",
          borderRadius: 8,
          fontSize: 16,
        }}
      >
        เปิดในเบราว์เซอร์จริง
      </button>

      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        หากเปิดไม่ได้ ให้ลองทำตามขั้นตอนต่อไปนี้:
        <br/>
        กด **⋮** หรือ **…** แล้วเลือก 
        <br/>
        <b>“Open in Chrome / Safari”</b>
      </p>
    </div>
  );
}