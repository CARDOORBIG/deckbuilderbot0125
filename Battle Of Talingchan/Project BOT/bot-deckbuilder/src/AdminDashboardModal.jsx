import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { db } from './firebase'; 
// 🟢 เพิ่ม writeBatch ใน import
import { collection, getDocs, orderBy, query, limit, updateDoc, doc, writeBatch } from 'firebase/firestore';

// 🟢 Helper Components
const StatusBadge = ({ status, winner, endTime }) => {
    const isEnded = new Date(endTime) < new Date();
    
    if (status === 'cancelled') {
        return <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold border border-red-200">❌ ยกเลิก</span>;
    }
    if (isEnded) {
        if (winner) return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[10px] font-bold border border-emerald-200">✅ จบ/มีผู้ชนะ</span>;
        return <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded text-[10px] font-bold border border-slate-300">💨 จบ/ไร้คนบิด</span>;
    }
    return <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px] font-bold border border-blue-200">⏳ กำลังประมูล</span>;
};

// 🟢 ไอคอนต่างๆ
const DefaultUserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

export default function AdminDashboardModal({ isOpen, onClose, adminEmail }) {
  const [activeTab, setActiveTab] = useState('transactions');
  
  // State เดิม
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [banHours, setBanHours] = useState(3);
  const [auctionId, setAuctionId] = useState('');
  const [wipeEmail, setWipeEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 🟢 State สำหรับ Warning Popup
  const [warningMsg, setWarningMsg] = useState('');

  // 🟢 State สำหรับ System Config (Top Up Status)
  const [topupStatus, setTopupStatus] = useState('open'); 

  // Data States
  const [allUsers, setAllUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [transactions, setTransactions] = useState([]); 
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 🟢 Summary & Filter State
  const [startDate, setStartDate] = useState(() => {
      const d = new Date();
      d.setDate(d.getDate() - 30); // Default ย้อนหลัง 30 วัน
      return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // Search State
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const callAdminRpc = async (rpcName, params) => {
    setIsProcessing(true);
    const { data, error } = await supabase.rpc(rpcName, params);
    setIsProcessing(false);
    if(error) alert("Error: " + error.message);
    else alert(data.message);
  };

  // 🟢 ฟังก์ชันส่ง Warning Popup (รายบุคคล)
  const handleSendWarning = async () => {
      if (!targetEmail.trim() || !warningMsg.trim()) return alert("กรุณาระบุ Email และข้อความเตือน");
      if (!confirm(`ยืนยันส่งข้อความเตือนไปยัง "${targetEmail}" ?\nข้อความ: ${warningMsg}`)) return;

      setIsProcessing(true);
      try {
          const userRef = doc(db, "users", targetEmail);
          await updateDoc(userRef, {
              warningMessage: warningMsg
          });
          alert("✅ ส่งข้อความเตือนสำเร็จ! ผู้ใช้จะเห็นทันทีที่เข้าเว็บ");
          setWarningMsg("");
      } catch (error) {
          console.error("Error sending warning:", error);
          alert("❌ ไม่สามารถส่งข้อความได้ (User อาจไม่มีอยู่ในระบบ Firebase): " + error.message);
      } finally {
          setIsProcessing(false);
      }
  };

  // 🟢 [NEW] ฟังก์ชันส่ง Global Warning (ทุกคน)
  const handleSendGlobalWarning = async () => {
      if (!warningMsg.trim()) return alert("กรุณาระบุข้อความเตือนก่อนกดส่ง Global");
      if (!confirm(`⚠️⚠️⚠️ ยืนยันส่งข้อความเตือนหา "ทุกคนในระบบ" ??\n(ผู้ใช้ทุกคนจะเห็น Popup นี้ทันที)\n\nข้อความ: ${warningMsg}`)) return;

      setIsProcessing(true);
      try {
          // 1. ดึง User ทั้งหมดจาก Firebase
          const usersSnap = await getDocs(collection(db, "users"));
          
          // 2. แบ่ง Batch (Firestore จำกัด 500 per batch)
          const chunks = [];
          let currentBatch = writeBatch(db);
          let counter = 0;

          usersSnap.docs.forEach((docSnap) => {
              currentBatch.update(docSnap.ref, { warningMessage: warningMsg });
              counter++;
              if (counter >= 499) {
                  chunks.push(currentBatch.commit());
                  currentBatch = writeBatch(db);
                  counter = 0;
              }
          });
          if (counter > 0) chunks.push(currentBatch.commit());

          // 3. รันทุก Batch
          await Promise.all(chunks);

          alert(`✅ ส่ง Global Warning สำเร็จ! (${usersSnap.size} คน)`);
          setWarningMsg("");
      } catch (error) {
          console.error("Global warning error:", error);
          alert("❌ เกิดข้อผิดพลาด: " + error.message);
      } finally {
          setIsProcessing(false);
      }
  };

  // 🟢 ฟังก์ชันโหลด Config ระบบ (สถานะเติมเงิน)
  const fetchSystemConfig = async () => {
      try {
          const { data } = await supabase.from('system_config').select('value').eq('key', 'topup_status').single();
          if (data) setTopupStatus(data.value);
      } catch (e) {
          console.error("Fetch config error", e);
      }
  };

  // 🟢 ฟังก์ชันอัปเดตสถานะเติมเงิน
  const updateTopupStatus = async (status) => {
      if (!confirm(`ยืนยันเปลี่ยนสถานะระบบเติมเงินเป็น "${status.toUpperCase()}" ?`)) return;
      setIsProcessing(true);
      try {
          const { error } = await supabase.from('system_config').upsert({ key: 'topup_status', value: status });
          if (error) throw error;
          setTopupStatus(status);
          alert("✅ อัปเดตสถานะเรียบร้อย!");
      } catch (e) {
          alert("❌ Error: " + e.message);
      } finally {
          setIsProcessing(false);
      }
  };

  const fetchAllUsers = async () => {
    setIsLoadingData(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      setAllUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error(error); } finally { setIsLoadingData(false); }
  };

  const fetchFeedbacks = async () => {
    setIsLoadingData(true);
    try {
      const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
      setFeedbacks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error(error); } finally { setIsLoadingData(false); }
  };

  const fetchTransactions = async () => {
      setIsLoadingData(true);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
          .from('auctions')
          .select('*')
          .gte('end_time', start.toISOString())
          .lte('end_time', end.toISOString())
          .order('end_time', { ascending: false });

      if (error) console.error("Error fetching transactions:", error);
      else setTransactions(data);
      setIsLoadingData(false);
  };

  const stats = useMemo(() => {
      const now = new Date();
      let completedCount = 0;
      let cancelledCount = 0;
      let expiredCount = 0;
      let totalValue = 0;

      transactions.forEach(tx => {
          const isEnded = new Date(tx.end_time) < now;
          if (tx.status === 'cancelled') {
              cancelledCount++;
          } else if (isEnded) {
              if (tx.winner_email) {
                  completedCount++;
                  totalValue += tx.current_price;
              } else {
                  expiredCount++;
              }
          }
      });

      return { completedCount, cancelledCount, expiredCount, totalValue };
  }, [transactions]);

  const paginatedTransactions = useMemo(() => {
      const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
      return transactions.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [transactions, currentPage]);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);

  const handleDeleteTransaction = async (id, cardName) => {
      if (!confirm(`⚠️ ยืนยันลบรายการประมูล "${cardName}" ถาวร?\n(ข้อมูลจะไม่สามารถกู้คืนได้)`)) return;
      setIsProcessing(true);
      const { data, error } = await supabase.rpc('admin_force_delete', { 
          p_admin_email: adminEmail, 
          p_target_input: id, 
          p_action_type: 'delete_auction' 
      });
      setIsProcessing(false);
      if (error) alert("Error: " + error.message);
      else setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  useEffect(() => {
    if (isOpen) {
        if (activeTab === 'users' || activeTab === 'manage') fetchAllUsers();
        if (activeTab === 'feedback') fetchFeedbacks();
        if (activeTab === 'transactions') fetchTransactions();
        if (activeTab === 'config') fetchSystemConfig();
    }
  }, [activeTab, isOpen]);

  useEffect(() => { setCurrentPage(1); }, [startDate, endDate]);

  const filteredUsers = allUsers.filter(user => {
    const searchLower = userSearchTerm.toLowerCase();
    return (user.displayName || '').toLowerCase().includes(searchLower) || (user.id || '').toLowerCase().includes(searchLower);
  });

  if (!isOpen || adminEmail !== 'koritros619@gmail.com') return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[999] p-4" onClick={onClose}>
      <div className="bg-slate-900 border-2 border-red-600 rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-900/50 to-slate-900 border-b border-red-500/30 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">👑 ADMIN DASHBOARD</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 shrink-0 overflow-x-auto">
            {['transactions', 'config', 'announce', 'manage', 'cleanup', 'users', 'feedback'].map(tab => (
                <button key={tab} onClick={()=>setActiveTab(tab)} className={`flex-1 py-3 px-4 font-bold whitespace-nowrap transition-colors uppercase text-xs md:text-sm ${activeTab===tab ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                    {tab === 'transactions' && '💰 สรุปซื้อขาย'}
                    {tab === 'config' && '⚙️ ตั้งค่าระบบ'}
                    {tab === 'announce' && '📢 ประกาศ'}
                    {tab === 'manage' && '🔨 จัดการคน'}
                    {tab === 'cleanup' && '💀 ล้างข้อมูล'}
                    {tab === 'users' && '👥 Users'}
                    {tab === 'feedback' && '💬 Feedback'}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto bg-slate-900/50">
            
            {/* Tab: System Config */}
            {activeTab === 'config' && (
                <div className="space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <SettingsIcon /> สถานะระบบเติมเงิน (Top Up System)
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-3 bg-slate-900 p-4 rounded-lg text-center border border-slate-600 mb-2">
                                <p className="text-slate-400 text-sm mb-1">สถานะปัจจุบัน</p>
                                <p className={`text-3xl font-black uppercase ${
                                    topupStatus === 'open' ? 'text-emerald-500' :
                                    topupStatus === 'maintenance' ? 'text-amber-500' : 'text-red-500'
                                }`}>
                                    {topupStatus === 'open' ? '🟢 เปิดใช้งาน (OPEN)' :
                                     topupStatus === 'maintenance' ? '⚠️ ปรับปรุง (MAINTENANCE)' : '⛔ ปิดใช้งาน (CLOSED)'}
                                </p>
                            </div>
                            <button onClick={() => updateTopupStatus('open')} disabled={isProcessing || topupStatus === 'open'} className={`py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${topupStatus === 'open' ? 'bg-emerald-900/50 text-emerald-500 border border-emerald-800 cursor-default' : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg'}`}>✅ เปิดระบบ (Open)</button>
                            <button onClick={() => updateTopupStatus('maintenance')} disabled={isProcessing || topupStatus === 'maintenance'} className={`py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${topupStatus === 'maintenance' ? 'bg-amber-900/50 text-amber-500 border border-amber-800 cursor-default' : 'bg-amber-600 hover:bg-amber-500 shadow-lg'}`}>⚠️ ปรับปรุง (Maintenance)</button>
                            <button onClick={() => updateTopupStatus('closed')} disabled={isProcessing || topupStatus === 'closed'} className={`py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${topupStatus === 'closed' ? 'bg-red-900/50 text-red-500 border border-red-800 cursor-default' : 'bg-red-600 hover:bg-red-500 shadow-lg'}`}>⛔ ปิดระบบ (Close)</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: Transactions */}
            {activeTab === 'transactions' && (
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-4 items-end bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div><label className="block text-xs text-slate-400 mb-1">จากวันที่</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-900 border border-slate-600 text-white text-sm rounded px-3 py-2 outline-none focus:border-emerald-500" /></div>
                        <div><label className="block text-xs text-slate-400 mb-1">ถึงวันที่</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-900 border border-slate-600 text-white text-sm rounded px-3 py-2 outline-none focus:border-emerald-500" /></div>
                        <button onClick={fetchTransactions} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded flex items-center gap-2 transition-colors h-[38px]"><SearchIcon /> ค้นหา</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 p-4 rounded-xl border border-emerald-500/30"><p className="text-xs text-emerald-400 font-bold uppercase mb-1">✅ สำเร็จ (มีผู้ซื้อ)</p><p className="text-2xl font-black text-white">{stats.completedCount}</p></div>
                        <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 p-4 rounded-xl border border-amber-500/30"><p className="text-xs text-amber-400 font-bold uppercase mb-1">💰 มูลค่ารวม</p><p className="text-2xl font-black text-white">฿{stats.totalValue.toLocaleString()}</p></div>
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl border border-slate-600/30"><p className="text-xs text-slate-400 font-bold uppercase mb-1">💨 หมดเวลา (ไร้คนบิด)</p><p className="text-2xl font-black text-white">{stats.expiredCount}</p></div>
                        <div className="bg-gradient-to-br from-red-900/40 to-slate-900 p-4 rounded-xl border border-red-500/30"><p className="text-xs text-red-400 font-bold uppercase mb-1">❌ ยกเลิก</p><p className="text-2xl font-black text-white">{stats.cancelledCount}</p></div>
                    </div>
                    {isLoadingData ? (<p className="text-slate-500 text-center py-10">กำลังโหลดข้อมูล...</p>) : (
                        <div>
                            <div className="overflow-x-auto rounded-t-xl border border-slate-700">
                                <table className="w-full text-left border-collapse">
                                    <thead><tr className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wider"><th className="p-3 w-12 text-center">#</th><th className="p-3">สถานะ</th><th className="p-3">สินค้า</th><th className="p-3">ราคาจบ</th><th className="p-3">ผู้ชนะ</th><th className="p-3">ผู้ขาย</th><th className="p-3 text-right">เวลาจบ</th><th className="p-3 text-center">จัดการ</th></tr></thead>
                                    <tbody className="text-sm divide-y divide-slate-800">
                                        {paginatedTransactions.map((tx, index) => (
                                            <tr key={tx.id} className="hover:bg-slate-800/50 group transition-colors">
                                                <td className="p-3 text-slate-500 text-center">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                                <td className="p-3"><StatusBadge status={tx.status} winner={tx.winner_email} endTime={tx.end_time} /></td>
                                                <td className="p-3"><span className="font-bold text-white truncate max-w-[150px]">{tx.card_name}</span></td>
                                                <td className="p-3 font-mono text-emerald-400 font-bold">฿{tx.current_price.toLocaleString()}</td>
                                                <td className="p-3">{tx.winner_email ? <div className="flex flex-col"><span className="text-white font-bold text-xs">{tx.winner_name}</span><span className="text-slate-500 text-[10px]">{tx.winner_email}</span></div> : <span className="text-slate-600">-</span>}</td>
                                                <td className="p-3"><div className="flex flex-col"><span className="text-slate-300 text-xs">{tx.seller_name}</span><span className="text-slate-500 text-[10px]">{tx.seller_email}</span></div></td>
                                                <td className="p-3 text-right text-slate-400 text-xs">{new Date(tx.end_time).toLocaleString('th-TH')}</td>
                                                <td className="p-3 text-center"><button onClick={() => handleDeleteTransaction(tx.id, tx.card_name)} className="p-1.5 bg-red-900/20 text-red-500 rounded hover:bg-red-600 hover:text-white transition-colors opacity-50 group-hover:opacity-100"><TrashIcon /></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {transactions.length > 0 && (<div className="flex justify-between items-center bg-slate-800 p-3 rounded-b-xl border-x border-b border-slate-700"><p className="text-xs text-slate-400">แสดง {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, transactions.length)} จาก {transactions.length}</p><div className="flex gap-2"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs disabled:opacity-50">ก่อนหน้า</button><span className="text-xs text-white self-center px-2">หน้า {currentPage} / {totalPages}</span><button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs disabled:opacity-50">ถัดไป</button></div></div>)}
                        </div>
                    )}
                </div>
            )}

            {/* Tab: Broadcast */}
            {activeTab === 'announce' && (
                <div className="space-y-4">
                    <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">หัวข้อประกาศ</label><input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-red-500 outline-none" placeholder="แจ้งข่าว..." /></div>
                    <div><label className="text-xs font-bold text-slate-400 uppercase mb-1 block">เนื้อหา</label><textarea value={message} onChange={e=>setMessage(e.target.value)} rows="5" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-red-500 outline-none resize-none" /></div>
                    <button onClick={() => callAdminRpc('admin_broadcast', { p_admin_email: adminEmail, p_title: title, p_message: message })} disabled={isProcessing} className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:brightness-110 disabled:opacity-50">{isBroadcasting ? 'Sending...' : '🚀 ส่งประกาศ (Broadcast)'}</button>
                </div>
            )}

            {/* Tab: Manage Users */}
            {activeTab === 'manage' && (
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">อีเมลเป้าหมาย (เลือกหรือพิมพ์)</label>
                        <input list="userEmails" value={targetEmail} onChange={e=>setTargetEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-red-500 outline-none" placeholder="พิมพ์เพื่อค้นหาชื่อ หรือ อีเมล..." />
                        <datalist id="userEmails">{allUsers.map(u => (<option key={u.id} value={u.id}>{u.displayName ? `${u.displayName} (${u.id})` : u.id}</option>))}</datalist>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-red-950/30 rounded-xl border border-red-900/50"><h4 className="text-red-400 font-bold text-sm mb-2">⛔ แบน (Cooldown)</h4><div className="flex gap-2 mb-2"><input type="number" value={banHours} onChange={e=>setBanHours(e.target.value)} className="w-16 bg-slate-900 border border-red-900 rounded p-1 text-center text-white" /><span className="text-slate-400 self-center text-xs">ชม.</span></div><button onClick={() => callAdminRpc('admin_manage_user', { p_admin_email: adminEmail, p_target_email: targetEmail, p_action: 'ban', p_hours: parseInt(banHours) })} className="w-full py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500">แบน</button></div>
                        <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/50 flex flex-col justify-between"><h4 className="text-emerald-400 font-bold text-sm">😇 ปลดโทษ</h4><button onClick={() => callAdminRpc('admin_manage_user', { p_admin_email: adminEmail, p_target_email: targetEmail, p_action: 'reset' })} className="w-full py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-500">รีเซ็ต</button></div>
                    </div>

                    {/* 🟢 ส่วนส่งข้อความเตือน (Popup) */}
                    <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-800/50">
                        <h4 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">⚠️ ส่งข้อความเตือน (One-time Popup)</h4>
                        <textarea value={warningMsg} onChange={e => setWarningMsg(e.target.value)} placeholder="ระบุข้อความตักเตือน... (เมื่อ User เข้าเว็บจะเห็นทันที)" className="w-full p-2 bg-slate-900 border border-amber-900/50 rounded-lg text-white text-sm outline-none focus:border-amber-500 mb-2 resize-none h-20" />
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={handleSendWarning} 
                                disabled={isProcessing}
                                className="flex-1 py-2 bg-amber-600 text-white text-xs font-bold rounded hover:bg-amber-500 disabled:opacity-50"
                            >
                                ส่งหาคนนี้ ({targetEmail || 'ระบุอีเมล'})
                            </button>
                            <button 
                                onClick={handleSendGlobalWarning} 
                                disabled={isProcessing}
                                className="flex-1 py-2 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-500 disabled:opacity-50 border border-red-400"
                            >
                                📢 ส่งหาทุกคน (Global)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: Cleanup */}
            {activeTab === 'cleanup' && (
                <div className="space-y-6">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3"><h4 className="text-white font-bold flex items-center gap-2">🗑️ ลบการประมูล (รายตัว)</h4><input value={auctionId} onChange={e=>setAuctionId(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white" placeholder="Auction ID (UUID)" /><button onClick={() => { if(confirm("ยืนยันลบ?")) callAdminRpc('admin_force_delete', { p_admin_email: adminEmail, p_target_input: auctionId, p_action_type: 'delete_auction' }); }} className="w-full py-2 bg-slate-700 hover:bg-red-600 text-white text-sm rounded transition-colors">ลบการประมูลนี้</button></div>
                    <div className="p-4 bg-red-950/20 rounded-xl border border-red-900/50 space-y-3"><h4 className="text-red-400 font-bold flex items-center gap-2">☢️ ล้างบาง User</h4><input value={wipeEmail} onChange={e=>setWipeEmail(e.target.value)} className="w-full bg-slate-900 border border-red-900 rounded p-2 text-sm text-white" placeholder="user@badguy.com" /><button onClick={() => { if(confirm("ลบ User นี้ถาวร?")) callAdminRpc('admin_force_delete', { p_admin_email: adminEmail, p_target_input: wipeEmail, p_action_type: 'wipe_user' }); }} className="w-full py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded transition-colors font-bold">ลบทุกอย่างของคนนี้</button></div>
                    <div className="pt-4 border-t border-slate-700"><button onClick={() => { if(confirm("ลบประวัติที่จบแล้วทั้งหมด?")) callAdminRpc('admin_force_delete', { p_admin_email: adminEmail, p_target_input: '', p_action_type: 'clear_all_completed' }); }} className="w-full py-3 bg-red-900/50 hover:bg-red-800 text-red-200 font-bold rounded-lg border border-red-800 shadow-lg">🧨 ล้างประวัติที่จบแล้ว (ทั้งหมด)</button></div>
                </div>
            )}

            {/* Tab: Users */}
            {activeTab === 'users' && (
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2"><h3 className="text-white font-bold whitespace-nowrap">รายชื่อผู้ใช้ ({allUsers.length})</h3><div className="relative w-full md:w-64"><input type="text" value={userSearchTerm} onChange={(e) => setUserSearchTerm(e.target.value)} placeholder="ค้นหาชื่อ หรือ Email..." className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white outline-none" /><div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></div></div><button onClick={fetchAllUsers} className="text-xs text-blue-400 hover:underline shrink-0">Refresh</button></div>
                    {isLoadingData ? <p className="text-slate-500 text-center">กำลังโหลด...</p> : (
                        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1">
                            {filteredUsers.length === 0 ? <p className="text-slate-500 text-center">ไม่พบข้อมูล</p> : filteredUsers.map((u) => (
                                <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-500"><div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden shrink-0 border border-slate-600">{u.picture || u.avatarUrl ? <img src={u.picture || u.avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} /> : null}<div className={`w-full h-full items-center justify-center text-slate-400 ${u.picture || u.avatarUrl ? 'hidden' : 'flex'}`}><DefaultUserIcon /></div></div><div className="flex-grow min-w-0"><p className="text-white font-bold text-sm truncate">{u.displayName || 'No Name'}</p><p className="text-slate-400 text-xs truncate cursor-pointer hover:text-blue-400" onClick={() => { navigator.clipboard.writeText(u.id); alert("Copied: " + u.id); }}>{u.id}</p></div><button onClick={() => { setActiveTab('manage'); setTargetEmail(u.id); }} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded border border-slate-600 shrink-0">จัดการ</button></div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tab: Feedback */}
            {activeTab === 'feedback' && (
                <div className="space-y-4">
                     <div className="flex justify-between items-center"><h3 className="text-white font-bold">Feedback ({feedbacks.length})</h3><button onClick={fetchFeedbacks} className="text-xs text-blue-400 hover:underline">Refresh</button></div>
                    {isLoadingData ? <p className="text-slate-500 text-center">กำลังโหลด...</p> : feedbacks.length === 0 ? <p className="text-slate-500 text-center">ไม่มี Feedback</p> : (
                        <div className="space-y-3">
                            {feedbacks.map((fb) => (
                                <div key={fb.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700"><div className="flex justify-between items-start mb-2"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden shrink-0 border border-slate-600">{(fb.user && fb.user.picture) ? <img src={fb.user.picture} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} /> : null}<div className={`w-full h-full items-center justify-center text-slate-400 text-[10px] ${(fb.user && fb.user.picture) ? 'hidden' : 'flex'}`}>?</div></div><span className="text-sm font-bold text-emerald-400">{fb.user?.name || 'Anonymous'}</span><span className="text-[10px] text-slate-500">({fb.user?.email || 'No Email'})</span></div><span className={`text-[10px] px-2 py-0.5 rounded border ${fb.type === 'bug' ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-blue-900/30 text-blue-400 border-blue-800'}`}>{fb.type.toUpperCase()}</span></div><p className="text-slate-300 text-sm whitespace-pre-wrap">{fb.text}</p><p className="text-[10px] text-slate-600 mt-2 text-right">{fb.createdAt ? new Date(fb.createdAt.seconds * 1000).toLocaleString('th-TH') : 'Unknown'}</p></div>
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