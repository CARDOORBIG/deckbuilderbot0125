import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../supabaseClient';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { CloseIcon, SearchIcon, ShieldBanIcon } from './Icons';
import RatingBadge from './RatingBadge';
import UserProfilePopup from './UserProfilePopup';

// Icons สำหรับปุ่ม Vote
const ThumbsUp = ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>;
const ThumbsDown = ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>;

export default function BlackListModal({ isOpen, onClose, userProfile }) {
    const [allUsersData, setAllUsersData] = useState([]);
    const [displayUsers, setDisplayUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterType, setFilterType] = useState('all');

    const [myVotes, setMyVotes] = useState({});
    const ITEMS_PER_PAGE = 50;

    useEffect(() => {
        if (isOpen) {
            fetchAllData();
            if (userProfile) fetchMyVotes();
        }
    }, [isOpen, userProfile]);

    const fetchMyVotes = async () => {
        if (!userProfile) return;
        const { data } = await supabase.from('user_votes').select('target_email, vote_value').eq('voter_email', userProfile.email);
        if (data) {
            const voteMap = {};
            data.forEach(v => voteMap[v.target_email] = v.vote_value);
            setMyVotes(voteMap);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const channel = supabase
            .channel('realtime_scores')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_stats' }, (payload) => {
                setAllUsersData(prev => prev.map(u => 
                    u.user_email === payload.new.user_email 
                    ? { ...u, total_score: payload.new.total_score } 
                    : u
                ));
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [isOpen]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const usersSnap = await getDocs(collection(db, "users"));
            const firebaseUsers = usersSnap.docs.map(doc => ({ email: doc.id, profile: doc.data() }));

            const { data: statsData } = await supabase.from('user_behavior_view').select('*');
            const statsMap = new Map((statsData || []).map(s => [s.user_email, s]));

            const mergedList = firebaseUsers.map(user => {
                const stats = statsMap.get(user.email) || {
                    total_score: 0, penalty_level: 0, cooldown_until: null,
                    total_listings: 0, completed_sales: 0, cancelled_sales: 0, report_count: 0
                };
                return { user_email: user.email, profile: user.profile, ...stats };
            });

            mergedList.sort((a, b) => b.penalty_level - a.penalty_level);
            setAllUsersData(mergedList);
        } catch (e) {
            console.error("Error fetching all users:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = allUsersData;

        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(u => 
                (u.user_email && u.user_email.toLowerCase().includes(lower)) ||
                (u.profile?.displayName && u.profile.displayName.toLowerCase().includes(lower))
            );
        }

        if (filterType === 'banned') {
            filtered = filtered.filter(u => u.cooldown_until && new Date(u.cooldown_until) > new Date());
        } else if (filterType === 'watchlist') {
            filtered = filtered.filter(u => u.penalty_level > 0 && !(u.cooldown_until && new Date(u.cooldown_until) > new Date()));
        } else if (filterType === 'no_history') {
            filtered = filtered.filter(u => u.total_listings === 0 && u.completed_sales === 0);
        }

        const start = page * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        setDisplayUsers(filtered.slice(start, end));

    }, [allUsersData, searchTerm, page, filterType]);

    // 🟢 แก้ไขตรงนี้: ส่งพารามิเตอร์ให้ตรงกับ SQL ใหม่ (p_...)
    const handleVote = async (e, targetEmail, type) => {
        e.stopPropagation();
        if (!userProfile) return alert('กรุณา Login ก่อนให้คะแนนครับ');
        if (userProfile.email === targetEmail) return alert('ไม่สามารถโหวตตัวเองได้ครับ');

        const scoreChange = type === 'like' ? 1 : -1;
        const currentVote = myVotes[targetEmail] || 0;
        
        let newVoteStatus = scoreChange;
        let scoreDiff = 0;

        if (currentVote === scoreChange) {
            newVoteStatus = 0;
            scoreDiff = -scoreChange;
        } else if (currentVote === 0) {
            newVoteStatus = scoreChange;
            scoreDiff = scoreChange;
        } else {
            newVoteStatus = scoreChange;
            scoreDiff = scoreChange * 2; 
        }

        setMyVotes(prev => ({ ...prev, [targetEmail]: newVoteStatus }));
        setAllUsersData(prev => prev.map(u => 
            u.user_email === targetEmail ? { ...u, total_score: (u.total_score || 0) + scoreDiff } : u
        ));

        // 🟢 ส่งค่าแบบใหม่ (มี p_ นำหน้า)
        const { error } = await supabase.rpc('vote_user', { 
            p_target_email: targetEmail, 
            p_score_change: scoreChange,
            p_voter_email: userProfile.email 
        });
        
        if (error) {
            console.error("Vote error:", error);
            // Revert changes if needed
            alert("บันทึกไม่สำเร็จ: " + error.message);
        }
    };

    const calculateReliability = (completed, cancelled) => {
        const total = completed + cancelled;
        if (total === 0) return 100;
        return Math.round((completed / total) * 100);
    };

    const isBanned = (cooldown) => cooldown && new Date(cooldown) > new Date();

    const renderStatus = (u) => {
        const banned = isBanned(u.cooldown_until);
        if (banned) return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white shadow-sm border border-red-400 animate-pulse">🚫 BANNED</span>;
        if (u.penalty_level > 0) return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow-sm border border-amber-400">⚠️ เฝ้าระวัง</span>;
        if (u.total_listings === 0 && u.completed_sales === 0) return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500 text-white border border-slate-400">⚪ มือใหม่</span>;
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white shadow-sm border border-emerald-400">✅ ปกติ</span>;
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[50000] p-0 md:p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 border-0 md:border border-slate-700 w-full md:max-w-7xl h-full md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shrink-0 shadow-md z-20">
                    <div>
                        <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
                            <ShieldBanIcon className="text-red-500" /> 
                            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">User Behavior Log</span>
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">ฐานข้อมูลพฤติกรรมผู้ใช้งาน (ทั้งหมด {allUsersData.length} รายชื่อ)</p>
                    </div>
                    <button onClick={onClose} className="bg-slate-700 hover:bg-red-600 text-white p-2 rounded-full transition-colors shadow-lg"><CloseIcon /></button>
                </div>

                <div className="bg-slate-800/80 border-b border-slate-700 backdrop-blur-sm z-10 flex flex-col md:flex-row gap-3 p-3">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder="ค้นหาชื่อ หรือ Email..." 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-600 rounded-lg text-white text-sm focus:border-emerald-500 outline-none placeholder:text-slate-600"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><SearchIcon /></div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                        <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${filterType==='all' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}>ทั้งหมด</button>
                        <button onClick={() => setFilterType('banned')} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${filterType==='banned' ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}>🚫 ถูกแบน</button>
                        <button onClick={() => setFilterType('watchlist')} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${filterType==='watchlist' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}>⚠️ เฝ้าระวัง</button>
                        <button onClick={() => setFilterType('no_history')} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${filterType==='no_history' ? 'bg-slate-500 border-slate-400 text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}>⚪ ไม่มีประวัติ</button>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto bg-[#0b1120] scrollbar-thin scrollbar-thumb-slate-700">
                    <table className="w-full text-left border-collapse hidden md:table">
                        <thead className="bg-slate-800/90 backdrop-blur sticky top-0 z-10 shadow-sm">
                            <tr className="text-slate-400 text-xs uppercase tracking-wider font-bold">
                                <th className="p-4 border-b border-slate-700 text-center w-12">#</th>
                                <th className="p-4 border-b border-slate-700">ผู้ใช้งาน</th>
                                <th className="p-4 border-b border-slate-700 text-center">สถานะ</th>
                                <th className="p-4 border-b border-slate-700 text-center">Give Credit</th>
                                <th className="p-4 border-b border-slate-700 text-center">Score</th>
                                <th className="p-4 border-b border-slate-700 text-center text-slate-300">ลงขาย</th>
                                <th className="p-4 border-b border-slate-700 text-center text-emerald-400"> สำเร็จ</th>
                                <th className="p-4 border-b border-slate-700 text-center text-red-400"> ยกเลิก</th>
                                <th className="p-4 border-b border-slate-700 text-center">Reliability</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                            {loading ? <tr><td colSpan="9" className="p-10 text-center text-slate-500 animate-pulse">กำลังโหลดข้อมูล...</td></tr> : 
                             displayUsers.length === 0 ? <tr><td colSpan="9" className="p-10 text-center text-slate-500">ไม่พบข้อมูล</td></tr> :
                             displayUsers.map((u, i) => {
                                const reliability = calculateReliability(u.completed_sales, u.cancelled_sales);
                                const myVote = myVotes[u.user_email] || 0;
                                return (
                                    <tr key={u.user_email} onClick={() => setSelectedUser(u.user_email)} className="hover:bg-slate-800/40 cursor-pointer transition-colors group">
                                        <td className="p-4 text-center text-slate-600 font-mono">{(page * ITEMS_PER_PAGE) + i + 1}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={u.profile?.avatarUrl || "https://placehold.co/50"} className="w-10 h-10 rounded-full object-cover border-2 border-slate-600" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-slate-200 truncate max-w-[150px]">{u.profile?.displayName || "Unknown"}</p>
                                                    <p className="text-xs text-slate-500 truncate max-w-[150px]">{u.user_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">{renderStatus(u)}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={(e) => handleVote(e, u.user_email, 'like')} className={`p-1.5 rounded-lg transition-all active:scale-95 border ${myVote === 1 ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-slate-700 text-slate-400 border-slate-600 hover:text-emerald-500'}`}><ThumbsUp filled={myVote === 1} /></button>
                                                <button onClick={(e) => handleVote(e, u.user_email, 'dislike')} className={`p-1.5 rounded-lg transition-all active:scale-95 border ${myVote === -1 ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-500/30' : 'bg-slate-700 text-slate-400 border-slate-600 hover:text-red-500'}`}><ThumbsDown filled={myVote === -1} /></button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center"><div className="flex justify-center scale-90"><RatingBadge score={u.total_score} /></div></td>
                                        <td className="p-4 text-center font-mono font-bold text-slate-400">{u.total_listings}</td>
                                        <td className="p-4 text-center font-mono font-bold text-emerald-500">{u.completed_sales}</td>
                                        <td className="p-4 text-center font-mono font-bold text-red-500">{u.cancelled_sales}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center gap-2 justify-center">
                                                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full ${reliability >= 80 ? 'bg-emerald-500' : reliability >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${reliability}%` }}></div></div>
                                                <span className={`text-xs font-bold ${reliability >= 80 ? 'text-emerald-500' : reliability >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{reliability}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="md:hidden p-3 space-y-3 pb-20">
                        {displayUsers.map((u, i) => {
                            const reliability = calculateReliability(u.completed_sales, u.cancelled_sales);
                            const myVote = myVotes[u.user_email] || 0;
                            return (
                                <div key={u.user_email} onClick={() => setSelectedUser(u.user_email)} className="bg-[#1e293b] rounded-xl p-4 border border-slate-700/50 shadow-lg active:scale-[0.98] transition-all cursor-pointer relative">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img src={u.profile?.avatarUrl || "https://placehold.co/50"} className="w-12 h-12 rounded-full object-cover border-2 border-slate-600" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                                            <div>
                                                <h4 className="font-bold text-sm text-white">{u.profile?.displayName || "Unknown"}</h4>
                                                <div className="flex gap-2 mt-1">
                                                    {renderStatus(u)}
                                                    <RatingBadge score={u.total_score} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={(e) => handleVote(e, u.user_email, 'like')} className={`p-2 rounded-lg border transition-all ${myVote === 1 ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-500 border-slate-700'}`}><ThumbsUp filled={myVote === 1} /></button>
                                            <button onClick={(e) => handleVote(e, u.user_email, 'dislike')} className={`p-2 rounded-lg border transition-all ${myVote === -1 ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800 text-slate-500 border-slate-700'}`}><ThumbsDown filled={myVote === -1} /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1 text-center bg-slate-900/50 rounded-lg p-2 text-xs border border-slate-700/50">
                                        <div><span className="text-slate-500 block">สำเร็จ</span><span className="text-emerald-400 font-bold">{u.completed_sales}</span></div>
                                        <div><span className="text-slate-500 block">ยกเลิก</span><span className="text-red-400 font-bold">{u.cancelled_sales}</span></div>
                                        <div><span className="text-slate-500 block">Rate</span><span className="text-white font-bold">{reliability}%</span></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-between items-center z-30 relative">
                    <p className="text-slate-400 text-xs">หน้า {page + 1}</p>
                    <div className="flex gap-3">
                        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 text-sm font-bold">ก่อนหน้า</button>
                        <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * ITEMS_PER_PAGE >= allUsersData.length} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 text-sm font-bold">ถัดไป</button>
                    </div>
                </div>

            </div>
            <UserProfilePopup isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} userId={selectedUser} />
        </div>,
        document.body
    );
}