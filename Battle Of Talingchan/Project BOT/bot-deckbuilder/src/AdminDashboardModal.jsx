import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { db } from './firebase'; 
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

// 🟢 ไอคอนรูปคน (สำหรับคนไม่มีรูปโปรไฟล์)
const DefaultUserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// 🟢 ไอคอนแว่นขยาย (Search)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function AdminDashboardModal({ isOpen, onClose, adminEmail }) {
  // Hooks
  const [activeTab, setActiveTab] = useState('announce'); 
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  
  const [targetEmail, setTargetEmail] = useState('');
  const [banHours, setBanHours] = useState(3);
  
  const [auctionId, setAuctionId] = useState('');
  const [wipeEmail, setWipeEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 🟢 State สำหรับค้นหา User
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // RPC Calls
  const callAdminRpc = async (rpcName, params) => {
    setIsProcessing(true);
    const { data, error } = await supabase.rpc(rpcName, params);
    setIsProcessing(false);
    
    if(error) alert("Error: " + error.message);
    else alert(data.message);
  };

  const fetchAllUsers = async () => {
    setIsLoadingData(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("โหลดข้อมูล Users ไม่สำเร็จ");
    } finally {
      setIsLoadingData(false);
    }
  };

  const fetchFeedbacks = async () => {
    setIsLoadingData(true);
    try {
      const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
      const feedbackList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeedbacks(feedbackList);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      alert("โหลดข้อมูล Feedback ไม่สำเร็จ");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
        if (activeTab === 'users') fetchAllUsers();
        if (activeTab === 'feedback') fetchFeedbacks();
    }
  }, [activeTab, isOpen]);

  // 🟢 Logic กรองรายชื่อ User
  const filteredUsers = allUsers.filter(user => {
    const searchLower = userSearchTerm.toLowerCase();
    const nameMatch = (user.displayName || '').toLowerCase().includes(searchLower);
    const emailMatch = (user.id || '').toLowerCase().includes(searchLower); // id ในที่นี้คือ email
    return nameMatch || emailMatch;
  });

  if (!isOpen || adminEmail !== 'koritros619@gmail.com') return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[999] p-4" onClick={onClose}>
      <div 
        className="bg-slate-900 border-2 border-red-600 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]" 
        onClick={e => e.stopPropagation()} 
      >
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-900/50 to-slate-900 border-b border-red-500/30 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                👑 ADMIN DASHBOARD
            </h2>
            <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
                ✕
            </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-700 shrink-0 overflow-x-auto">
            {['announce', 'manage', 'cleanup', 'users', 'feedback'].map(tab => (
                <button 
                    key={tab}
                    onClick={()=>setActiveTab(tab)} 
                    className={`flex-1 py-3 px-4 font-bold whitespace-nowrap transition-colors uppercase text-sm ${
                        activeTab===tab ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                >
                    {tab === 'announce' && '📢 ประกาศ'}
                    {tab === 'manage' && '🔨 จัดการคน'}
                    {tab === 'cleanup' && '💀 ล้างข้อมูล'}
                    {tab === 'users' && '👥 Users'}
                    {tab === 'feedback' && '💬 Feedback'}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto bg-slate-900/50">
            
            {/* Tab 1: Broadcast */}
            {activeTab === 'announce' && (
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">หัวข้อประกาศ</label>
                        <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-red-500 outline-none" placeholder="เช่น แจ้งปิดปรับปรุง..." />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">เนื้อหา</label>
                        <textarea value={message} onChange={e=>setMessage(e.target.value)} rows="5" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-red-500 outline-none resize-none" />
                    </div>
                    <button 
                        onClick={() => callAdminRpc('admin_broadcast', { p_admin_email: adminEmail, p_title: title, p_message: message })}
                        disabled={isProcessing}
                        className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:brightness-110 disabled:opacity-50"
                    >
                        {isBroadcasting ? 'Sending...' : '🚀 ส่งประกาศ (Broadcast)'}
                    </button>
                </div>
            )}

            {/* Tab 2: Manage Users */}
            {activeTab === 'manage' && (
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">อีเมลเป้าหมาย</label>
                        <input value={targetEmail} onChange={e=>setTargetEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-red-500 outline-none" placeholder="user@example.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-red-950/30 rounded-xl border border-red-900/50">
                            <h4 className="text-red-400 font-bold text-sm mb-2">⛔ แบน (Cooldown)</h4>
                            <div className="flex gap-2 mb-2">
                                <input type="number" value={banHours} onChange={e=>setBanHours(e.target.value)} className="w-16 bg-slate-900 border border-red-900 rounded p-1 text-center text-white" />
                                <span className="text-slate-400 self-center text-xs">ชม.</span>
                            </div>
                            <button onClick={() => callAdminRpc('admin_manage_user', { p_admin_email: adminEmail, p_target_email: targetEmail, p_action: 'ban', p_hours: parseInt(banHours) })} className="w-full py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500">แบน</button>
                        </div>
                        <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/50 flex flex-col justify-between">
                            <h4 className="text-emerald-400 font-bold text-sm">😇 ปลดโทษ</h4>
                            <button onClick={() => callAdminRpc('admin_manage_user', { p_admin_email: adminEmail, p_target_email: targetEmail, p_action: 'reset' })} className="w-full py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-500">รีเซ็ต</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 3: Cleanup */}
            {activeTab === 'cleanup' && (
                <div className="space-y-6">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
                        <h4 className="text-white font-bold flex items-center gap-2">🗑️ ลบการประมูล (รายตัว)</h4>
                        <input value={auctionId} onChange={e=>setAuctionId(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white" placeholder="Auction ID (UUID)" />
                        <button 
                            onClick={() => {
                                if(confirm("⚠️ ยืนยันลบการประมูลนี้ถาวร?")) 
                                callAdminRpc('admin_force_delete', { p_admin_email: adminEmail, p_target_input: auctionId, p_action_type: 'delete_auction' });
                            }}
                            className="w-full py-2 bg-slate-700 hover:bg-red-600 text-white text-sm rounded transition-colors"
                        >
                            ลบการประมูลนี้
                        </button>
                    </div>

                    <div className="p-4 bg-red-950/20 rounded-xl border border-red-900/50 space-y-3">
                        <h4 className="text-red-400 font-bold flex items-center gap-2">☢️ ล้างบาง User (Nuclear)</h4>
                        <input value={wipeEmail} onChange={e=>setWipeEmail(e.target.value)} className="w-full bg-slate-900 border border-red-900 rounded p-2 text-sm text-white" placeholder="user@badguy.com" />
                        <button 
                            onClick={() => {
                                if(confirm("🔥 คำเตือน: ข้อมูลทุกอย่างของ User นี้จะหายเกลี้ยง!\nยืนยันทำลายล้าง?")) 
                                callAdminRpc('admin_force_delete', { p_admin_email: adminEmail, p_target_input: wipeEmail, p_action_type: 'wipe_user' });
                            }}
                            className="w-full py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded transition-colors font-bold"
                        >
                            ลบทุกอย่างของคนนี้
                        </button>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                        <button 
                            onClick={() => {
                                if(confirm("🧨 คำเตือนขั้นสูงสุด!\n\nคุณกำลังจะลบ 'ประวัติการประมูลที่จบแล้ว' ทั้งหมดออกจากระบบ\nข้อมูลจะไม่สามารถกู้คืนได้\n\nยืนยันหรือไม่?")) 
                                callAdminRpc('admin_force_delete', { p_admin_email: adminEmail, p_target_input: '', p_action_type: 'clear_all_completed' });
                            }}
                            className="w-full py-3 bg-red-900/50 hover:bg-red-800 text-red-200 font-bold rounded-lg border border-red-800 shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            🧨 ล้างประวัติที่จบแล้ว (ทั้งหมด)
                        </button>
                    </div>
                </div>
            )}

            {/* Tab 4: User Management (แก้ไขใหม่) */}
            {activeTab === 'users' && (
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                        <h3 className="text-white font-bold whitespace-nowrap">รายชื่อผู้ใช้ ({allUsers.length})</h3>
                        
                        {/* 🟢 Search Box */}
                        <div className="relative w-full md:w-64">
                            <input 
                                type="text"
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                placeholder="ค้นหาชื่อ หรือ Email..."
                                className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <SearchIcon />
                            </div>
                        </div>

                        <button onClick={fetchAllUsers} className="text-xs text-blue-400 hover:underline shrink-0">Refresh</button>
                    </div>

                    {isLoadingData ? (
                        <p className="text-slate-500 text-center py-10">กำลังโหลดข้อมูล...</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1">
                            {filteredUsers.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">ไม่พบรายชื่อที่ค้นหา</p>
                            ) : filteredUsers.map((u) => {
                                const avatarSrc = u.picture || u.avatarUrl;
                                return (
                                    <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
                                        
                                        {/* 🟢 รูปโปรไฟล์ (พร้อม Fallback) */}
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden shrink-0 border border-slate-600">
                                            {avatarSrc ? (
                                                <img 
                                                    src={avatarSrc} 
                                                    alt="Avatar" 
                                                    className="w-full h-full object-cover" 
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none'; // ซ่อนรูปที่เสีย
                                                        e.currentTarget.nextSibling.style.display = 'flex'; // โชว์ไอคอนแทน
                                                    }}
                                                />
                                            ) : null}
                                            {/* Default Icon (โชว์ถ้าไม่มีรูป หรือรูปเสีย) */}
                                            <div className={`w-full h-full items-center justify-center text-slate-400 ${avatarSrc ? 'hidden' : 'flex'}`}>
                                                <DefaultUserIcon />
                                            </div>
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <p className="text-white font-bold text-sm truncate">{u.displayName || 'No Name'}</p>
                                            <p className="text-slate-400 text-xs truncate cursor-pointer hover:text-blue-400" onClick={() => {
                                                navigator.clipboard.writeText(u.id);
                                                alert("Copied Email: " + u.id);
                                            }}>
                                                {u.id}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => { setActiveTab('manage'); setTargetEmail(u.id); }}
                                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded border border-slate-600 shrink-0"
                                        >
                                            จัดการ
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Tab 5: Feedback Board */}
            {activeTab === 'feedback' && (
                <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <h3 className="text-white font-bold">ความคิดเห็น & แจ้งปัญหา ({feedbacks.length})</h3>
                        <button onClick={fetchFeedbacks} className="text-xs text-blue-400 hover:underline">Refresh</button>
                    </div>
                    {isLoadingData ? (
                        <p className="text-slate-500 text-center py-10">กำลังโหลดข้อมูล...</p>
                    ) : feedbacks.length === 0 ? (
                        <p className="text-slate-500 text-center py-10">ไม่มี Feedback</p>
                    ) : (
                        <div className="space-y-3">
                            {feedbacks.map((fb) => (
                                <div key={fb.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {/* รูป User หรือ Placeholder */}
                                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden shrink-0 border border-slate-600">
                                                {(fb.user && fb.user.picture) ? (
                                                    <img 
                                                        src={fb.user.picture} 
                                                        className="w-full h-full object-cover" 
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                 <div className={`w-full h-full items-center justify-center text-slate-400 text-[10px] ${(fb.user && fb.user.picture) ? 'hidden' : 'flex'}`}>
                                                    ?
                                                </div>
                                            </div>
                                            
                                            <span className="text-sm font-bold text-emerald-400">
                                                {fb.user?.name || 'Anonymous'}
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                ({fb.user?.email || 'No Email'})
                                            </span>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                            fb.type === 'bug' ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-blue-900/30 text-blue-400 border-blue-800'
                                        }`}>
                                            {fb.type.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{fb.text}</p>
                                    <p className="text-[10px] text-slate-600 mt-2 text-right">
                                        {fb.createdAt ? new Date(fb.createdAt.seconds * 1000).toLocaleString('th-TH') : 'Unknown Date'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
      </div>
    </div>
  );
}