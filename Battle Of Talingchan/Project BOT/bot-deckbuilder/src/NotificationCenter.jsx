import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

// ไอคอนต่างๆ
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const ChevronUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>;
// 🟢 เพิ่มไอคอนอ่านทั้งหมด
const CheckAllIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

export default function NotificationCenter({ userEmail }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // 🟢 ใช้ State เพื่อนับจำนวน (เคลียร์ได้ทันที)
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 1. ดึงข้อมูลเริ่มต้น + Realtime
  useEffect(() => {
    if (!userEmail) return;

    const fetchNotis = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }
    };
    fetchNotis();

    // Subscribe Realtime
    const channel = supabase
      .channel(`noti:${userEmail}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_email=eq.${userEmail}` },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userEmail]);

  // ปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // 🟢 เมื่อเปิด: เคลียร์ Red Mark ทันที (Visual Only)
  const handleToggle = () => {
    if (!isOpen) {
        setUnreadCount(0); // เคลียร์ตัวเลขแดงทันทีที่กด
    }
    setIsOpen(!isOpen);
  };

  // 🟢 ปุ่ม "อ่านทั้งหมด"
  const handleMarkAllRead = async () => {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      await supabase.from('notifications').update({ is_read: true }).eq('user_email', userEmail);
  };

  // ล้างทั้งหมด (ลบ)
  const handleClearAll = async () => {
    if (confirm("คุณต้องการลบประวัติการแจ้งเตือนทั้งหมดหรือไม่?")) {
      await supabase.from('notifications').delete().eq('user_email', userEmail);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // 🟢 กดที่รายการ -> ไปหน้า Chat
  const handleItemClick = async (item) => {
    // 1. Mark Read (เฉพาะรายการที่กด)
    if (!item.is_read) {
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, is_read: true } : n));
        await supabase.from('notifications').update({ is_read: true }).eq('id', item.id);
    }

    // 2. Redirect to Auction Room
    if (item.auction_id) {
        navigate('/auction', { state: { openAuctionId: item.auction_id } });
        setIsOpen(false);
    }
  };

  // Helper: แปลงเวลา
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // วินาที

    if (diff < 60) return 'เมื่อสักครู่';
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชม. ที่แล้ว`;
    return date.toLocaleDateString('th-TH');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* ปุ่มกระดิ่ง */}
      <button 
        onClick={handleToggle} 
        className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white dark:border-black"></span>
          </span>
        )}
      </button>

      {/* กล่องแจ้งเตือน */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[1000] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right flex flex-col transition-all ease-in-out ${isExpanded ? 'max-h-[80vh]' : 'max-h-[400px]'}`}>
          
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">การแจ้งเตือน</h3>
            <div className="flex gap-2">
                {/* 🟢 ปุ่มอ่านทั้งหมด */}
                <button 
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="อ่านทั้งหมด"
                >
                    <CheckAllIcon /> อ่านทั้งหมด
                </button>
                {notifications.length > 0 && (
                <button 
                    onClick={handleClearAll}
                    className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="ลบทั้งหมด"
                >
                    <TrashIcon /> ลบ
                </button>
                )}
            </div>
          </div>

          {/* รายการแจ้งเตือน */}
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
                    onClick={() => handleItemClick(item)} // 🟢 กดแล้วไปหน้าแชท
                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${!item.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${!item.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {!item.is_read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 mb-0.5"></span>}
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 break-words">
                          {item.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">{formatTime(item.created_at)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 py-1.5 rounded transition-colors font-medium"
            >
                {isExpanded ? <><ChevronUp /> ย่อลง</> : <><ChevronDown /> ดูทั้งหมด</>}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}