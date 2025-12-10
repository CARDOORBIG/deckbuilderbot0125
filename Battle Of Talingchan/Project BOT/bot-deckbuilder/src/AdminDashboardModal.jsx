import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from './supabaseClient';
import { db } from './firebase'; 
import { collection, getDocs, orderBy, query, limit, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { MenuIcon, SearchIcon, TrashIcon, SettingsIcon, SendIcon, MessageIcon } from './components/Icons'; 

// 🟢 Icon เฉพาะกิจ
const DefaultUserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

// ==========================================
// 🟢 Helper Components
// ==========================================

const StatusBadge = ({ status, winner, endTime }) => {
    const isEnded = new Date(endTime) < new Date();
    
    if (status === 'cancelled') {
        return <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold border border-red-200">❌ ยกเลิก</span>;
    }
    if (status === 'completed') {
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[10px] font-bold border border-emerald-200">🎉 สำเร็จ</span>;
    }
    if (isEnded) {
        if (winner) return <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-[10px] font-bold border border-blue-200">⚖️ จบประมูล/รอเคลียร์</span>;
        return <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded text-[10px] font-bold border border-slate-300">💨 จบ/ไร้คนบิด</span>;
    }
    return <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded text-[10px] font-bold border border-amber-200">⏳ กำลังประมูล</span>;
};

// 🟢 Chat Bubble สำหรับ Admin ตอบ Ticket
const AdminChatBubble = ({ msg, adminEmail }) => {
    const isAdminMsg = msg.is_admin; 
    return (
        <div className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'} mb-2`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm shadow-sm break-words ${
                isAdminMsg 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
            }`}>
                {msg.message}
            </div>
            <span className="text-[9px] text-slate-500 mt-1">
                {new Date(msg.created_at).toLocaleString('th-TH', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}
            </span>
        </div>
    );
};

// 🟢 Modal ย่อย: สำหรับดูรายละเอียดเจาะลึก (Transaction Inspector)
const TransactionInspectorModal = ({ isOpen, onClose, auction }) => {
    const [chatLogs, setChatLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && auction) {
            fetchChatLogs();
        }
    }, [isOpen, auction]);

    const fetchChatLogs = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('auction_comments')
            .select('*')
            .eq('auction_id', auction.id)
            .order('created_at', { ascending: true });
        setChatLogs(data || []);
        setLoading(false);
    };

    if (!isOpen || !auction) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1100] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 border-2 border-blue-500 rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shrink-0">
                    <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">🕵️‍♂️ ตรวจสอบธุรกรรม: {auction.card_name}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-700 w-8 h-8 rounded-full">✕</button>
                </div>
                <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                    <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-700 space-y-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <h4 className="text-slate-300 font-bold mb-3 border-b border-slate-600 pb-2">📌 ข้อมูล</h4>
                            <p className="text-slate-400 text-sm">Status: <span className="text-white">{auction.status}</span></p>
                            <p className="text-slate-400 text-sm">Seller: <span className="text-white">{auction.seller_email}</span></p>
                            <p className="text-slate-400 text-sm">Winner: <span className="text-white">{auction.winner_email || '-'}</span></p>
                            <p className="text-slate-400 text-sm">Price: <span className="text-emerald-400 font-mono">฿{auction.current_price?.toLocaleString()}</span></p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col bg-slate-950">
                        <div className="p-3 bg-slate-800 border-b border-slate-700"><h4 className="text-slate-300 font-bold">💬 ประวัติแชท</h4></div>
                        <div className="flex-grow overflow-y-auto p-4 space-y-3">
                            {loading ? <p className="text-slate-500 text-center">Loading...</p> : chatLogs.length === 0 ? <p className="text-slate-600 text-center">ไม่มีข้อความ</p> : chatLogs.map(msg => (
                                <div key={msg.id} className={`flex flex-col ${msg.user_email === auction.seller_email ? 'items-start' : 'items-end'}`}>
                                    <div className={`p-2 rounded-lg text-xs ${msg.user_email === 'SYSTEM' ? 'bg-slate-800 text-slate-400' : 'bg-blue-900/40 text-blue-100 border border-blue-800'}`}>{msg.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AdminDashboardModal({ isOpen, onClose, adminEmail }) {
  const [activeTab, setActiveTab] = useState('transactions');
  
  // General States
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [banHours, setBanHours] = useState(3);
  const [auctionId, setAuctionId] = useState('');
  const [wipeEmail, setWipeEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [inspectAuction, setInspectAuction] = useState(null);
  const [warningMsg, setWarningMsg] = useState('');
  const [topupStatus, setTopupStatus] = useState('open'); 
  const [allUsers, setAllUsers] = useState([]);
  const [transactions, setTransactions] = useState([]); 
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 🟢 Ticket States
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [adminReply, setAdminReply] = useState("");
  const chatEndRef = useRef(null);

  // 🟢 Feedback States
  const [feedbacks, setFeedbacks] = useState([]); 
  const [feedbackView, setFeedbackView] = useState('inbox'); 

  // Filter States
  const [startDate, setStartDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split('T')[0]; });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // --- Functions ---
  const callAdminRpc = async (rpcName, params) => { setIsProcessing(true); const { data, error } = await supabase.rpc(rpcName, params); setIsProcessing(false); if(error) alert("Error: " + error.message); else alert(data.message); };
  
  const handleSendWarning = async () => { if (!targetEmail.trim() || !warningMsg.trim()) return alert("ระบุข้อมูลให้ครบ"); if (!confirm(`ยืนยันส่ง?`)) return; setIsProcessing(true); try { const userRef = doc(db, "users", targetEmail); await updateDoc(userRef, { warningMessage: warningMsg }); alert("✅ ส่งสำเร็จ!"); setWarningMsg(""); } catch (error) { alert("Error: " + error.message); } finally { setIsProcessing(false); } };
  
  const handleSendGlobalWarning = async () => { if (!warningMsg.trim()) return; if (!confirm(`⚠️ ส่งหาทุกคน?`)) return; setIsProcessing(true); try { const usersSnap = await getDocs(collection(db, "users")); const chunks = []; let batch = writeBatch(db); let i = 0; usersSnap.docs.forEach((docSnap) => { batch.update(docSnap.ref, { warningMessage: warningMsg }); i++; if (i >= 499) { chunks.push(batch.commit()); batch = writeBatch(db); i = 0; } }); if (i > 0) chunks.push(batch.commit()); await Promise.all(chunks); alert("✅ ส่ง Global สำเร็จ!"); setWarningMsg(""); } catch (e) { alert("Error: " + e.message); } finally { setIsProcessing(false); } };

  const fetchSystemConfig = async () => { try { const { data } = await supabase.from('system_config').select('value').eq('key', 'topup_status').single(); if (data) setTopupStatus(data.value); } catch (e) {} };
  const updateTopupStatus = async (status) => { if (!confirm(`เปลี่ยนสถานะเป็น ${status}?`)) return; setIsProcessing(true); try { await supabase.from('system_config').upsert({ key: 'topup_status', value: status }); setTopupStatus(status); alert("✅ เรียบร้อย"); } catch (e) { alert("Error"); } finally { setIsProcessing(false); } };

  const fetchAllUsers = async () => { setIsLoadingData(true); try { const s = await getDocs(collection(db, "users")); setAllUsers(s.docs.map(d => ({ id: d.id, ...d.data() }))); } catch (e) {} finally { setIsLoadingData(false); } };

  const fetchTransactions = async () => { setIsLoadingData(true); const start = new Date(startDate); const end = new Date(endDate); end.setHours(23, 59, 59, 999); const { data } = await supabase.from('auctions').select('*').gte('end_time', start.toISOString()).lte('end_time', end.toISOString()).order('end_time', { ascending: false }); if (data) setTransactions(data); setIsLoadingData(false); };

  // 🟢 Feedback Functions (Firestore)
  const fetchFeedbacks = async () => {
    setIsLoadingData(true);
    try {
      const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
      setFeedbacks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error(error); } finally { setIsLoadingData(false); }
  };

  // 🟢 Ticket Functions (Supabase)
  const fetchTickets = async () => {
    const { data } = await supabase.from('support_tickets').select('*').order('last_updated', { ascending: false });
    if (data) setTickets(data);
  };

  const handleOpenTicketFromFeedback = async (fb) => {
      if (!fb.user || !fb.user.email) return alert("ไม่สามารถตอบกลับ Anonymous ได้");
      
      if(!confirm(`เปิด Ticket ใหม่เพื่อคุยกับคุณ ${fb.user.name}?`)) return;

      setIsProcessing(true);
      try {
          const { data: ticket, error: tErr } = await supabase.from('support_tickets').insert({
              user_email: fb.user.email,
              user_name: fb.user.name,
              user_avatar: fb.user.picture || null,
              subject: `[${fb.type.toUpperCase()}] ${fb.text.substring(0, 30)}...`,
              status: 'open',
              last_message: 'Admin Opened Ticket'
          }).select().single();

          if (tErr) throw tErr;

          await supabase.from('support_messages').insert([
              { ticket_id: ticket.id, sender_email: fb.user.email, message: `(จาก Feedback): ${fb.text}`, is_admin: false },
              { ticket_id: ticket.id, sender_email: adminEmail, message: "สวัสดีครับ แอดมินรับเรื่องแล้วครับ มีอะไรให้ช่วยเหลือเพิ่มเติมไหมครับ?", is_admin: true }
          ]);

          setFeedbackView('chat');
          fetchTickets();
          loadTicketChat(ticket);

      } catch (err) {
          alert("Error: " + err.message);
      } finally {
          setIsProcessing(false);
      }
  };

  const loadTicketChat = async (ticket) => {
    setSelectedTicket(ticket);
    const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true });
    setTicketMessages(data || []);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleAdminReply = async () => {
      if (!adminReply.trim()) return;
      const text = adminReply;
      setAdminReply(""); 
      
      await supabase.from('support_messages').insert({
          ticket_id: selectedTicket.id,
          sender_email: adminEmail,
          message: text,
          is_admin: true
      });
      await supabase.from('support_tickets').update({ status: 'open', last_updated: new Date() }).eq('id', selectedTicket.id);
  };

  const handleCloseTicket = async () => {
      if(!confirm("ปิดงานเคสนี้?")) return;
      await supabase.from('support_tickets').update({ status: 'closed' }).eq('id', selectedTicket.id);
      setSelectedTicket(prev => ({ ...prev, status: 'closed' }));
      fetchTickets();
  };

  useEffect(() => {
    if (selectedTicket) {
        const channel = supabase.channel(`admin_ticket:${selectedTicket.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${selectedTicket.id}` }, (payload) => {
                setTicketMessages(prev => [...prev, payload.new]);
                setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            })
            .subscribe();
        return () => supabase.removeChannel(channel);
    }
  }, [selectedTicket]);

  useEffect(() => {
    if (isOpen) {
        if (activeTab === 'users' || activeTab === 'manage') fetchAllUsers();
        if (activeTab === 'feedback') { fetchFeedbacks(); fetchTickets(); } 
        if (activeTab === 'transactions') fetchTransactions();
        if (activeTab === 'config') fetchSystemConfig();
    }
  }, [activeTab, isOpen]);

  const stats = useMemo(() => {
      let c=0, x=0, e=0, v=0;
      transactions.forEach(t => { if(t.status==='cancelled') x++; else if(new Date(t.end_time)<new Date()) { if(t.winner_email) { c++; v+=t.current_price; } else e++; } });
      return { completedCount: c, cancelledCount: x, expiredCount: e, totalValue: v };
  }, [transactions]);
  
  const paginatedTransactions = useMemo(() => transactions.slice((currentPage-1)*ITEMS_PER_PAGE, currentPage*ITEMS_PER_PAGE), [transactions, currentPage]);
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE); // 🟢 เพิ่มบรรทัดนี้กลับมาครับ

  const filteredUsers = allUsers.filter(u => (u.displayName||'').toLowerCase().includes(userSearchTerm.toLowerCase()) || (u.id||'').toLowerCase().includes(userSearchTerm.toLowerCase()));

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
                    {tab === 'feedback' ? '💬 Feedback & Tickets' : tab.toUpperCase()}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto bg-slate-900/50 flex-grow">
            
            {/* 🟢 Tab: Feedback & Support Ticket System */}
            {activeTab === 'feedback' && (
                <div className="flex flex-col h-full min-h-[500px]">
                    <div className="flex gap-4 mb-4 border-b border-slate-700 pb-2">
                        <button onClick={() => setFeedbackView('inbox')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${feedbackView === 'inbox' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>📥 Feedback Inbox ({feedbacks.length})</button>
                        <button onClick={() => { setFeedbackView('chat'); fetchTickets(); }} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${feedbackView === 'chat' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>💬 Active Tickets ({tickets.filter(t => t.status === 'open').length})</button>
                    </div>

                    {feedbackView === 'inbox' && (
                        <div className="space-y-3 overflow-y-auto max-h-[60vh]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400 text-xs">รายการแจ้งปัญหาจากผู้ใช้ (Firestore)</span>
                                <button onClick={fetchFeedbacks} className="text-blue-400 text-xs hover:underline">Refresh</button>
                            </div>
                            
                            {isLoadingData ? <p className="text-slate-500 text-center">Loading...</p> : 
                             feedbacks.length === 0 ? <p className="text-center text-slate-500 py-10">ไม่มีรายการแจ้งเข้ามา</p> : 
                             feedbacks.map(fb => (
                                <div key={fb.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700 flex flex-col md:flex-row justify-between items-start gap-4 hover:border-slate-600 transition-colors">
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${fb.type === 'bug' ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-blue-900/30 text-blue-400 border-blue-800'}`}>{fb.type}</span>
                                            <span className="text-emerald-400 font-bold text-sm">{fb.user?.name || 'Anonymous'}</span>
                                            <span className="text-slate-500 text-xs">({fb.user?.email})</span>
                                        </div>
                                        <p className="text-slate-300 text-sm whitespace-pre-wrap bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">{fb.text}</p>
                                        <p className="text-[10px] text-slate-500 mt-2 text-right">{fb.createdAt ? new Date(fb.createdAt.seconds * 1000).toLocaleString('th-TH') : '-'}</p>
                                    </div>
                                    {fb.user?.email && (
                                        <button onClick={() => handleOpenTicketFromFeedback(fb)} className="w-full md:w-auto px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shrink-0 flex flex-row md:flex-col items-center justify-center gap-2 transition-transform active:scale-95">
                                            <MessageIcon className="w-5 h-5"/> <span>เปิด Ticket<br/>ตอบกลับ</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {feedbackView === 'chat' && (
                        <div className="flex h-full gap-4 border-t border-slate-700 pt-4 overflow-hidden">
                            <div className="w-1/3 border-r border-slate-700 pr-2 overflow-y-auto max-h-[60vh]">
                                <div className="space-y-2">
                                    {tickets.length === 0 ? <p className="text-slate-500 text-center py-4">ยังไม่มีเคสที่เปิดอยู่</p> : 
                                     tickets.map(ticket => (
                                        <div key={ticket.id} onClick={() => loadTicketChat(ticket)} className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedTicket?.id === ticket.id ? 'bg-blue-900/40 border-blue-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ticket.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/20 text-slate-400'}`}>{ticket.status.toUpperCase()}</span>
                                                <span className="text-[10px] text-slate-500">{new Date(ticket.last_updated).toLocaleDateString('th-TH')}</span>
                                            </div>
                                            <p className="text-white font-bold text-sm truncate">{ticket.subject}</p>
                                            <p className="text-xs text-slate-400 truncate">{ticket.user_name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-2/3 flex flex-col bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden h-[60vh]">
                                {selectedTicket ? (
                                    <>
                                        <div className="p-3 border-b border-slate-700 bg-slate-800 flex justify-between items-center shrink-0">
                                            <div><h4 className="text-white font-bold text-sm">{selectedTicket.subject}</h4><p className="text-xs text-slate-400">User: {selectedTicket.user_name} ({selectedTicket.user_email})</p></div>
                                            {selectedTicket.status === 'open' && (<button onClick={handleCloseTicket} className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500 font-bold shadow-sm">✅ จบเคส (Close)</button>)}
                                        </div>
                                        <div className="flex-grow p-4 overflow-y-auto space-y-2 bg-slate-900/50">
                                            {ticketMessages.map(msg => (<AdminChatBubble key={msg.id} msg={msg} isAdmin={msg.is_admin} adminEmail={adminEmail} />))}
                                            {selectedTicket.status === 'closed' && (<div className="text-center py-4 text-xs text-slate-500 bg-slate-800/50 rounded mt-4">⛔ เคสนี้ถูกปิดแล้ว</div>)}
                                            <div ref={chatEndRef} />
                                        </div>
                                        {selectedTicket.status === 'open' && (
                                            <div className="p-3 border-t border-slate-700 bg-slate-800 flex gap-2 shrink-0">
                                                <input className="flex-grow bg-slate-900 border border-slate-600 rounded-full px-4 py-2 text-white text-sm outline-none focus:border-blue-500" placeholder="พิมพ์ตอบกลับผู้ใช้..." value={adminReply} onChange={e => setAdminReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdminReply()} />
                                                <button onClick={handleAdminReply} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 shadow-lg"><SendIcon /></button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2"><span className="text-4xl opacity-50">💬</span><p>เลือกรายการทางซ้ายเพื่อเริ่มแชท</p></div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tab: System Config */}
            {activeTab === 'config' && (
                <div className="space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><SettingsIcon /> ระบบเติมเงิน</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-3 bg-slate-900 p-4 rounded-lg text-center border border-slate-600 mb-2">
                                <p className="text-slate-400 text-sm mb-1">สถานะปัจจุบัน</p>
                                <p className={`text-3xl font-black uppercase ${topupStatus === 'open' ? 'text-emerald-500' : topupStatus === 'maintenance' ? 'text-amber-500' : 'text-red-500'}`}>{topupStatus.toUpperCase()}</p>
                            </div>
                            <button onClick={() => updateTopupStatus('open')} className="py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500">✅ OPEN</button>
                            <button onClick={() => updateTopupStatus('maintenance')} className="py-4 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-500">⚠️ MAINTENANCE</button>
                            <button onClick={() => updateTopupStatus('closed')} className="py-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500">⛔ CLOSED</button>
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
                        <button onClick={fetchTransactions} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded flex items-center gap-2 h-[38px]"><SearchIcon /> ค้นหา</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-emerald-900/40 p-4 rounded-xl border border-emerald-500/30"><p className="text-xs text-emerald-400 font-bold uppercase mb-1">สำเร็จ</p><p className="text-2xl font-black text-white">{stats.completedCount}</p></div>
                        <div className="bg-amber-900/40 p-4 rounded-xl border border-amber-500/30"><p className="text-xs text-amber-400 font-bold uppercase mb-1">ยอดเงินรวม</p><p className="text-2xl font-black text-white">฿{stats.totalValue.toLocaleString()}</p></div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-600/30"><p className="text-xs text-slate-400 font-bold uppercase mb-1">หมดเวลา</p><p className="text-2xl font-black text-white">{stats.expiredCount}</p></div>
                        <div className="bg-red-900/40 p-4 rounded-xl border border-red-500/30"><p className="text-xs text-red-400 font-bold uppercase mb-1">ยกเลิก</p><p className="text-2xl font-black text-white">{stats.cancelledCount}</p></div>
                    </div>
                    {isLoadingData ? (<p className="text-slate-500 text-center py-10">กำลังโหลดข้อมูล...</p>) : (
                        <div>
                            <div className="overflow-x-auto rounded-t-xl border border-slate-700">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wider">
                                            <th className="p-3 w-12 text-center">#</th>
                                            <th className="p-3">สถานะ</th>
                                            <th className="p-3">สินค้า</th>
                                            <th className="p-3">ราคาจบ</th>
                                            <th className="p-3">ผู้ชนะ</th>
                                            <th className="p-3">ผู้ขาย</th>
                                            <th className="p-3 text-right">เวลาจบ</th>
                                            <th className="p-3 text-center">จัดการ</th>
                                        </tr>
                                    </thead>
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
                                                <td className="p-3 text-center flex items-center justify-center gap-2">
                                                    <button onClick={() => setInspectAuction(tx)} className="p-1.5 bg-blue-900/20 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition-colors" title="ดูรายละเอียด"><MenuIcon /></button>
                                                    <button onClick={() => handleDeleteTransaction(tx.id, tx.card_name)} className="p-1.5 bg-red-900/20 text-red-500 rounded hover:bg-red-600 hover:text-white transition-colors opacity-50 group-hover:opacity-100" title="ลบรายการ"><TrashIcon /></button>
                                                </td>
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
                    <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-800/50">
                        <h4 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">⚠️ ส่งข้อความเตือน (One-time Popup)</h4>
                        <textarea value={warningMsg} onChange={e => setWarningMsg(e.target.value)} placeholder="ระบุข้อความตักเตือน..." className="w-full p-2 bg-slate-900 border border-amber-900/50 rounded-lg text-white text-sm outline-none focus:border-amber-500 mb-2 resize-none h-20" />
                        <div className="flex gap-2">
                            <button onClick={handleSendWarning} disabled={isProcessing} className="flex-1 py-2 bg-amber-600 text-white text-xs font-bold rounded hover:bg-amber-500 disabled:opacity-50">ส่งหาคนนี้</button>
                            <button onClick={handleSendGlobalWarning} disabled={isProcessing} className="flex-1 py-2 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-500 disabled:opacity-50 border border-red-400">📢 ส่งหาทุกคน (Global)</button>
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

        </div>
      </div>
      
      {/* Inspector Modal */}
      <TransactionInspectorModal isOpen={!!inspectAuction} onClose={() => setInspectAuction(null)} auction={inspectAuction} />
    </div>
  );
}