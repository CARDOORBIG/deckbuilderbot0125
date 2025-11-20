export default function OpenBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  // ใช้ regex เพื่อตรวจหา iOS อย่างแม่นยำขึ้น
  const isIOS = /iphone|ipad|ipod/.test(ua); 
  const isAndroid = /android/.test(ua);

  // ใช้ window.location.origin เพื่อให้ URL ไม่ซ้ำซ้อน
  const currentUrl = window.location.origin + window.location.pathname; // เพิ่ม pathname เพื่อให้กลับมาหน้าเดิมได้

  const handleOpenBrowser = () => {
    // โค้ดนี้ใช้สำหรับพยายาม Deep Link ไปที่เบราว์เซอร์จริง
    if (isIOS) {
      // open Safari
      // ในบาง IAB การตั้งค่า location.href ใหม่อาจช่วยเปิด Safari ได้
      window.location.href = currentUrl;
    } else if (isAndroid) {
      // open Chrome
      // ใช้ googlechrome:// เพื่อบังคับเปิดใน Chrome (Deep Link)
      const targetUrl = currentUrl.replace(/^https?:\/\//, "");
      window.location.href = `googlechrome://${targetUrl}`;
    }
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }} className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">⚠️ โปรดเปิดผ่านเบราว์เซอร์ภายนอก</h2>
      <p className="text-base mb-6">เพื่อใช้งาน **Google Login** ได้อย่างถูกต้อง</p>

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