export default function OpenBrowser() {
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua); 
  const isAndroid = /android/.test(ua);

  const currentUrl = window.location.origin + window.location.pathname;

  const handleOpenBrowser = () => {
    const targetUrl = currentUrl; // URL ที่ต้องการเปิด

    if (isIOS) {
      // 1. iOS: พยายามใช้ window.location.href (พยายามครั้งที่ 1)
      window.location.href = targetUrl;

      // เนื่องจาก iOS ปลอดภัยมาก อาจไม่สามารถเปิด Safari ได้เสมอ
      // เราจึงต้องพึ่งพาคำแนะนำสำรองบนหน้าจอ (ให้ผู้ใช้กดเมนู '...' เอง)
    } else if (isAndroid) {
      // 2. Android: ใช้ Intent Scheme เพื่อบังคับเปิดใน Chrome
      const intentUrl = 
        "intent://" + 
        targetUrl.replace(/^https?:\/\//, "") + 
        "#Intent;scheme=https;package=com.android.chrome;end";
      
      window.location.href = intentUrl;
    }

    // Fallback: หากยังไม่เด้งไปไหน ให้แสดงคำแนะนำ (ซึ่งมีอยู่แล้วใน UI)
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