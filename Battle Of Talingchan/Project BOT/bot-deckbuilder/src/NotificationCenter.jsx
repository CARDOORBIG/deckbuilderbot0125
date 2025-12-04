import React, { useState, useRef, useEffect } from 'react';

// ไอคอนต่างๆ
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const ChevronUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>;

export default function NotificationCenter({ userEmail }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // ✅ เพิ่มสถานะการขยาย
  const dropdownRef = useRef(null);

  // ข้อมูลจำลอง (Mock Data)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'ยินดีต้อนรับ!', message: 'เข้าสู่ระบบ Deck Builder สำเร็จ ขอให้สนุกกับการจัดเด็คนะครับ', time: 'เมื่อสักครู่', type: 'info', read: false },
    { id: 2, title: 'อัปเดตระบบ', message: 'เพิ่มฟีเจอร์ "My Decks" ใหม่แล้ว ลองใช้งานได้เลย', time: '10 นาทีที่แล้ว', type: 'system', read: false },
    { id: 3, title: 'ตลาดประมูล', message: 'การ์ดที่คุณติดตามกำลังจะหมดเวลา', time: '1 ชม. ที่แล้ว', type: 'alert', read: true },
    { id: 4, title: 'การชำระเงิน', message: 'ได้รับยอดเงิน 500 บาทเข้ากระเป๋าแล้ว', time: '2 ชม. ที่แล้ว', type: 'success', read: true },
    { id: 5, title: 'แจ้งเตือนระบบ', message: 'จะมีการปิดปรับปรุงเซิร์ฟเวอร์ในคืนนี้', time: '5 ชม. ที่แล้ว', type: 'system', read: true },
    { id: 6, title: 'กิจกรรมใหม่', message: 'เข้าร่วมกิจกรรมแจกการ์ดฟรีได้ที่หน้ากิจกรรม', time: '1 วันที่แล้ว', type: 'info', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsExpanded(false); // ✅ รีเซ็ตขนาดเมื่อปิด
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // ล้างทั้งหมด
  const handleClearAll = () => {
    if (confirm("คุณต้องการล้างการแจ้งเตือนทั้งหมดหรือไม่?")) {
      setNotifications([]);
    }
  };

  // อ่านแล้ว
  const handleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* ปุ่มกระดิ่ง */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* กล่องแจ้งเตือน */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[1000] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right flex flex-col transition-all ease-in-out ${isExpanded ? 'max-h-[80vh]' : 'max-h-[350px]'}`}>
          
          {/* Header (Fixed) */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">การแจ้งเตือน ({notifications.length})</h3>
            {notifications.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                title="ล้างทั้งหมด"
              >
                <TrashIcon /> ล้างทั้งหมด
              </button>
            )}
          </div>

          {/* รายการแจ้งเตือน (Scrollable Area) */}
          {/* ✅ ส่วนนี้จะยืดหดตาม max-h ของ container แม่ */}
          <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm flex flex-col items-center justify-center h-full">
                <div className="text-3xl mb-2 opacity-50">🔕</div>
                ไม่มีการแจ้งเตือนใหม่
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((item) => (
                  <li 
                    key={item.id} 
                    onClick={() => handleRead(item.id)}
                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${!item.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${!item.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {!item.read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 mb-0.5"></span>}
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 break-words">
                          {item.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer (Fixed Toggle Button) */}
          <div className="flex-shrink-0 p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center">
            {/* ✅ ปุ่มกดเพื่อขยาย/ย่อ */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 py-1.5 rounded transition-colors font-medium"
            >
                {isExpanded ? (
                    <>ย่อลง <ChevronUp /></>
                ) : (
                    <>ดูทั้งหมด <ChevronDown /></>
                )}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}