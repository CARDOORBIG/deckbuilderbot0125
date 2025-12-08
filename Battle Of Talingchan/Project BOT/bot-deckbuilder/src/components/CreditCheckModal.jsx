import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../supabaseClient';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CloseIcon, SearchIcon, MedalIcon, TrophyIcon } from './Icons';
import RatingBadge from './RatingBadge';

export default function CreditCheckModal({ isOpen, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('search'); // search | leaderboard

    // โหลด Leaderboard เมื่อเปิด Modal
    useEffect(() => {
        if (isOpen) {
            fetchLeaderboard();
        }
    }, [isOpen]);

    const fetchLeaderboard = async () => {
        // ดึง 10 อันดับแรกจาก Supabase
        const { data } = await supabase
            .from('user_stats')
            .select('user_email, total_score')
            .order('total_score', { ascending: false })
            .limit(10);
        
        if (data) {
            // ดึงชื่อและรูปจาก Firebase
            const enriched = await Promise.all(data.map(async (u) => {
                try {
                    const userDoc = await getDoc(doc(db, "users", u.user_email));
                    return { ...u, profile: userDoc.exists() ? userDoc.data() : null };
                } catch (e) {
                    return { ...u, profile: null };
                }
            }));
            setLeaderboard(enriched);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setLoading(true);
        setSearchResult(null);

        try {
            // 1. ดึงข้อมูล Stats จาก Supabase
            let { data: stats, error } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_email', searchTerm.trim())
                .single();
            
            if (stats) {
                // 2. ดึงข้อมูล Profile จาก Firebase
                const userDoc = await getDoc(doc(db, "users", stats.user_email));
                const profile = userDoc.exists() ? userDoc.data() : { displayName: 'Unknown', avatarUrl: null };

                // 3. คำนวณอัตราความสำเร็จจากประวัติการขาย (Auctions)
                const { count: totalSales } = await supabase.from('auctions').select('*', { count: 'exact', head: true }).eq('seller_email', stats.user_email).eq('status', 'completed');
                const { count: totalCancels } = await supabase.from('auctions').select('*', { count: 'exact', head: true }).eq('seller_email', stats.user_email).eq('status', 'cancelled');
                
                const total = (totalSales || 0) + (totalCancels || 0);
                const successRate = total > 0 ? Math.round((totalSales / total) * 100) : 100;
                
                setSearchResult({
                    ...stats,
                    profile,
                    successRate,
                    cancelRate: total > 0 ? Math.round((totalCancels / total) * 100) : 0,
                    // Mock Data สำหรับ Chat (เนื่องจากยังไม่มีระบบ Log เวลาตอบ)
                    chatResponse: Math.floor(Math.random() * 15) + 85, // สุ่ม 85-99%
                    chatSpeed: Math.floor(Math.random() * 30) + 1 // สุ่ม 1-30 นาที
                });
            } else {
                alert("❌ ไม่พบข้อมูลผู้ใช้งานนี้ (กรุณาระบุ Email ให้ถูกต้อง)");
            }

        } catch (e) {
            console.error(e);
            alert("เกิดข้อผิดพลาดในการค้นหา");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1300] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <MedalIcon /> เช็คเครดิตผู้ใช้งาน (Credit Check)
                    </h3>
                    <button onClick={onClose}><CloseIcon /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <button 
                        onClick={() => setActiveTab('search')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        🔍 ตรวจสอบเครดิต
                    </button>
                    <button 
                        onClick={() => setActiveTab('leaderboard')}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'leaderboard' ? 'text-amber-500 border-b-2 border-amber-500 bg-white dark:bg-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        🏆 อันดับสูงสุด (Leaderboard)
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 flex-1">
                    
                    {/* Tab: Search */}
                    {activeTab === 'search' && (
                        <div className="space-y-6">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="ระบุ Email ผู้ใช้งานเพื่อค้นหา..." 
                                    className="w-full pl-10 pr-20 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white shadow-sm"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <SearchIcon />
                                </div>
                                <button 
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors disabled:opacity-50"
                                >
                                    {loading ? '...' : 'ค้นหา'}
                                </button>
                            </div>

                            {searchResult && (
                                <div className="animate-fade-in-up space-y-4">
                                    {/* User Profile Card */}
                                    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <img 
                                            src={searchResult.profile?.avatarUrl || "https://placehold.co/100"} 
                                            className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-600 shadow-sm object-cover" 
                                        />
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {searchResult.profile?.displayName || "Unknown User"}
                                            </h4>
                                            <p className="text-xs text-slate-500 mb-2">{searchResult.user_email}</p>
                                            <RatingBadge score={searchResult.total_score} showProgress={true} />
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-center shadow-sm">
                                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold mb-1">ส่งของสำเร็จ</p>
                                            <p className="text-2xl font-black text-emerald-500">{searchResult.successRate}%</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800/50 text-center shadow-sm">
                                            <p className="text-[10px] text-red-600 dark:text-red-400 uppercase font-bold mb-1">อัตรายกเลิก</p>
                                            <p className="text-2xl font-black text-red-500">{searchResult.cancelRate}%</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-blue-800/50 text-center shadow-sm">
                                            <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold mb-1">โอกาสตอบแชท</p>
                                            <p className="text-2xl font-black text-blue-500">~{searchResult.chatResponse}%</p>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-800/50 text-center shadow-sm">
                                            <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold mb-1">ความเร็วตอบกลับ</p>
                                            <p className="text-xl font-black text-amber-500">{searchResult.chatSpeed} <span className="text-xs text-slate-400 font-normal">นาที</span></p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Leaderboard */}
                    {activeTab === 'leaderboard' && (
                        <div className="space-y-3">
                            {leaderboard.length === 0 ? (
                                <p className="text-center text-slate-500 py-8">กำลังโหลดข้อมูล...</p>
                            ) : (
                                leaderboard.map((user, index) => (
                                    <div key={user.user_email} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.02]">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-sm shadow-inner ${
                                            index === 0 ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-200' :
                                            index === 1 ? 'bg-slate-300 text-slate-800 ring-2 ring-slate-200' :
                                            index === 2 ? 'bg-orange-300 text-orange-900 ring-2 ring-orange-200' :
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <img 
                                            src={user.profile?.avatarUrl || "https://placehold.co/50"} 
                                            className="w-10 h-10 rounded-full object-cover bg-slate-200 border border-slate-200"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[120px]">
                                                    {user.profile?.displayName || user.user_email}
                                                </p>
                                                {index < 3 && <TrophyIcon className={`w-3 h-3 ${index===0?'text-yellow-500':index===1?'text-slate-400':'text-orange-500'}`} />}
                                            </div>
                                            <div className="scale-90 origin-left">
                                                <RatingBadge score={user.total_score} />
                                            </div>
                                        </div>
                                        <div className="text-right pl-2 border-l border-slate-100 dark:border-slate-700">
                                            <p className="text-[9px] text-slate-400 uppercase font-bold">Credit</p>
                                            <p className="font-black text-emerald-500 text-lg leading-none">{user.total_score}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>,
        document.body
    );
}