import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom'; // 🟢 1. Import useNavigate

// === Icons ===
const Svg = ({ p, ...r }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...r}>{p}</svg>;
const BellIcon = () => <Svg p={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></>} />;

export default function NotificationCenter({ userEmail }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const navigate = useNavigate(); // 🟢 2. เรียกใช้ Hook

    // ปิด Dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // โหลดข้อมูล & Realtime
    useEffect(() => {
        if (!userEmail) return;

        const fetchNotifications = async () => {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .or(`user_email.eq.${userEmail},user_email.eq.GLOBAL`)
                .order('created_at', { ascending: false })
                .limit(20);
            
            if (data) {
                setNotifications(data);
                const unread = data.filter(n => !n.is_read && n.user_email !== 'GLOBAL').length;
                setUnreadCount(unread);
            }
        };
        fetchNotifications();

        const channel = supabase.channel(`noti_center:${userEmail}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'notifications', 
                filter: `user_email=eq.${userEmail}` 
            }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
                setUnreadCount(prev => prev + 1);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [userEmail]);

    const markAllAsRead = async () => {
        if (notifications.length === 0) return;
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
        await supabase.from('notifications').update({ is_read: true }).eq('user_email', userEmail);
    };

    // 🟢 3. ฟังก์ชันคลิกแจ้งเตือน
    const handleClickNotification = async (notification) => {
        // อ่านแล้ว
        if (!notification.is_read) {
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            supabase.from('notifications').update({ is_read: true }).eq('id', notification.id).then();
        }

        setIsOpen(false); // ปิด Dropdown

        // เช็คประเภทแล้วพาไปหน้า Auction พร้อมเปิดห้องแชท
        if (notification.type === 'bid' || notification.type === 'outbid') {
            // สมมติว่าในตาราง notification มี column 'reference_id' เก็บ auction_id ไว้
            // ถ้าคุณตั้งชื่อ column อื่น (เช่น action_url, context_id) ให้แก้ตรงนี้ครับ
            const auctionId = notification.reference_id || notification.context_id; 
            
            if (auctionId) {
                navigate('/auction', { state: { openAuctionId: auctionId } });
            }
        }
    };

    if (!userEmail) return null;

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors relative text-slate-600 dark:text-slate-300"
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">การแจ้งเตือน</h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unreadCount} ใหม่</span>}
                            <button onClick={markAllAsRead} className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline">อ่านทั้งหมด</button>
                        </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-xs">ไม่มีการแจ้งเตือน</div>
                        ) : (
                            notifications.map(n => (
                                <div 
                                    key={n.id} 
                                    onClick={() => handleClickNotification(n)} // 🟢 4. ใส่ onClick
                                    className={`p-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.is_read ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                        <div>
                                            <h4 className={`text-sm font-bold ${
                                                n.type === 'admin_announce' ? 'text-red-500 dark:text-red-400' : 
                                                n.type === 'bid' ? 'text-emerald-600 dark:text-emerald-400' : 
                                                n.type === 'outbid' ? 'text-amber-600 dark:text-amber-400' : 
                                                'text-slate-800 dark:text-white'
                                            }`}>
                                                {n.type === 'admin_announce' ? '📢 ' : ''}{n.title}
                                            </h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{new Date(n.created_at).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}