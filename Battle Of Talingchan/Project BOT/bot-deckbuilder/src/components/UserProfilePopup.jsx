import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CloseIcon, FacebookIcon, PhoneIcon, LineIcon, ChatBubbleIcon } from './Icons'; 
import RatingBadge from './RatingBadge';
import { supabase } from '../supabaseClient';

export default function UserProfilePopup({ isOpen, onClose, userId }) {
    const [userData, setUserData] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && userId) {
            fetchData();
        }
    }, [isOpen, userId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            }
            const { data } = await supabase.from('user_stats').select('total_score').eq('user_email', userId).single();
            if (data) setUserStats(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleChatClick = () => {
        const targetUser = {
            email: userId,
            profile: {
                displayName: userData?.displayName || userId,
                avatarUrl: userData?.avatarUrl
            }
        };
        const event = new CustomEvent('OPEN_CHAT_WITH_USER', { detail: targetUser });
        window.dispatchEvent(event);
        onClose();
    };

    const isLink = (str) => str && (str.startsWith('http://') || str.startsWith('https://'));

    if (!isOpen) return null;

    return createPortal(
        // 🟢 แก้ไขตรงนี้: เปลี่ยน Z-Index เป็น 60000 (เพื่อให้ทับหน้า BlacklistModal ที่เป็น 20000-50000)
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60000] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-emerald-500/30 overflow-hidden relative" onClick={e => e.stopPropagation()}>
                
                <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
                    <button onClick={onClose} className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition-colors"><CloseIcon /></button>
                </div>

                <div className="flex justify-center -mt-12 relative z-10">
                    <img 
                        src={userData?.avatarUrl || "https://placehold.co/150"} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 shadow-lg object-cover bg-slate-200"
                    />
                </div>

                <div className="px-6 pb-6 pt-2 text-center">
                    {loading ? (
                        <p className="text-slate-500 py-4">กำลังโหลดข้อมูล...</p>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                                {userData?.displayName || "Unknown User"}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{userId}</p>
                            
                            <div className="flex justify-center mb-4 scale-110">
                                <RatingBadge score={userStats?.total_score || 0} />
                            </div>

                            <button 
                                onClick={handleChatClick}
                                className="w-full mb-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                            >
                                <ChatBubbleIcon /> แชทเลย (Message Request)
                            </button>

                            <div className="space-y-3 mt-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ช่องทางติดต่ออื่น</p>
                                
                                {userData?.facebook ? (
                                    isLink(userData.facebook) ? (
                                        <a href={userData.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                            <FacebookIcon />
                                            <span className="text-sm font-bold truncate">Facebook Profile</span>
                                        </a>
                                    ) : (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-default">
                                            <FacebookIcon />
                                            <span className="text-sm font-bold truncate">{userData.facebook}</span>
                                        </div>
                                    )
                                ) : null}

                                {userData?.lineId && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300">
                                        <LineIcon />
                                        <div className="text-left overflow-hidden">
                                            <p className="text-[10px] opacity-70">LINE ID</p>
                                            <p className="text-sm font-bold truncate">{userData.lineId}</p>
                                        </div>
                                        <button onClick={() => {navigator.clipboard.writeText(userData.lineId); alert("Copied LINE ID!");}} className="ml-auto text-xs bg-white dark:bg-green-800 px-2 py-1 rounded shadow-sm border border-green-200 dark:border-green-700">Copy</button>
                                    </div>
                                )}

                                {userData?.phone && (
                                    <a href={`tel:${userData.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                                        <PhoneIcon />
                                        <div className="text-left">
                                            <p className="text-[10px] opacity-70">เบอร์โทรศัพท์</p>
                                            <p className="text-sm font-bold">{userData.phone}</p>
                                        </div>
                                    </a>
                                )}

                                {!userData?.facebook && !userData?.lineId && !userData?.phone && (
                                    <p className="text-xs text-slate-400 italic">ไม่ได้ระบุข้อมูลติดต่อเพิ่มเติม</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}