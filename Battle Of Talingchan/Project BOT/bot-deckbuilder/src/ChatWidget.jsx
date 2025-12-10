import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; 
import { supabase } from './supabaseClient';
import { db } from './firebase'; 
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import UserProfilePopup from './components/UserProfilePopup'; 

// --- Icons ---
const HeadsetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

export default function ChatWidget({ userProfile, isMobileMenuOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('list'); 
  const [activeFriend, setActiveFriend] = useState(null);
  
  // Ticket State
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  
  // Chat State
  const [friends, setFriends] = useState([]); 
  const [requests, setRequests] = useState([]); 
  const [sentRequests, setSentRequests] = useState([]); 
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  const [allUsers, setAllUsers] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  
  const [totalUnreadCount, setTotalUnreadCount] = useState(0); 
  const [unreadPerUser, setUnreadPerUser] = useState({}); 
  const [strangerChats, setStrangerChats] = useState([]);

  const [isAnimating, setIsAnimating] = useState(false);
  const messagesEndRef = useRef(null);
  
  const [selectedProfileId, setSelectedProfileId] = useState(null);

  useEffect(() => {
    const handleOpenChat = (event) => {
        const targetUser = event.detail;
        if (targetUser && userProfile && targetUser.email !== userProfile.email) {
            setActiveFriend(targetUser);
            setView('chat');
            setIsOpen(true);
        }
    };
    window.addEventListener('OPEN_CHAT_WITH_USER', handleOpenChat);
    return () => window.removeEventListener('OPEN_CHAT_WITH_USER', handleOpenChat);
  }, [userProfile]);

  const fetchFriendsAndRequests = async () => {
    if (!userProfile) return;
    const { data: fData } = await supabase.from('friendships').select('*').or(`requester_id.eq.${userProfile.email},receiver_id.eq.${userProfile.email}`);
    
    let currentFriendEmails = [];

    if (fData) {
        const acceptedRaw = fData.filter(f => f.status === 'accepted');
        const friendsWithProfile = await Promise.all(acceptedRaw.map(async (f) => {
            const friendEmail = f.requester_id === userProfile.email ? f.receiver_id : f.requester_id;
            currentFriendEmails.push(friendEmail);
            let profile = null;
            try {
                const docSnap = await getDoc(doc(db, "users", friendEmail));
                if (docSnap.exists()) profile = docSnap.data();
            } catch (e) { console.error("Error fetching friend profile", e); }
            return { email: friendEmail, id: f.id, profile: profile || { displayName: friendEmail, avatarUrl: null } };
        }));
        setFriends(friendsWithProfile);
        setRequests(fData.filter(f => f.status === 'pending' && f.receiver_id === userProfile.email));
        const sent = fData.filter(f => f.status === 'pending' && f.requester_id === userProfile.email);
        setSentRequests(sent.map(s => s.receiver_id));
    }

    const { data: unreadMsgs } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', userProfile.email)
        .eq('is_read', false);

    if (unreadMsgs) {
        const uniqueSenders = [...new Set(unreadMsgs.map(m => m.sender_id))];
        const strangerEmails = uniqueSenders.filter(email => !currentFriendEmails.includes(email));

        if (strangerEmails.length > 0) {
            const strangersWithProfile = await Promise.all(strangerEmails.map(async (email) => {
                let profile = null;
                try {
                    const docSnap = await getDoc(doc(db, "users", email));
                    if (docSnap.exists()) profile = docSnap.data();
                } catch (e) {}
                return { 
                    email: email, 
                    isStranger: true,
                    profile: profile || { displayName: email, avatarUrl: null } 
                };
            }));
            setStrangerChats(strangersWithProfile);
        } else {
            setStrangerChats([]);
        }
    }
  };

  const fetchAllSystemUsers = async () => {
    setIsFetchingUsers(true);
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllUsers(users);
    } catch (error) { console.error("Error", error); } finally { setIsFetchingUsers(false); }
  };

  const fetchUnreadStats = async () => {
      if (!userProfile) return;
      const { data } = await supabase.from('messages').select('sender_id').eq('receiver_id', userProfile.email).eq('is_read', false);
      if (data) {
          setTotalUnreadCount(data.length);
          const counts = {};
          data.forEach(msg => { counts[msg.sender_id] = (counts[msg.sender_id] || 0) + 1; });
          setUnreadPerUser(counts);
      }
  };

  useEffect(() => {
    if (isOpen) {
        fetchFriendsAndRequests();
        if (view === 'add') fetchAllSystemUsers();
        if (view === 'tickets') fetchTickets();
    }
    fetchUnreadStats(); 
    fetchFriendsAndRequests(); 

    const friendChannel = supabase.channel('friends_update_v3')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'friendships' }, () => { fetchFriendsAndRequests(); })
        .subscribe();
    
    const msgChannel = supabase.channel('global_messages_v3')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userProfile.email}` }, (payload) => {
            const sender = payload.new.sender_id;
            setTotalUnreadCount(prev => prev + 1);
            setUnreadPerUser(prev => ({ ...prev, [sender]: (prev[sender] || 0) + 1 }));
            fetchFriendsAndRequests();
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000); 
        })
        .subscribe();

    return () => { supabase.removeChannel(friendChannel); supabase.removeChannel(msgChannel); };
  }, [isOpen, userProfile, view]);

  // Ticket Logic
  const fetchTickets = async () => {
    if (!userProfile) return;
    const { data } = await supabase.from('support_tickets').select('*').eq('user_email', userProfile.email).order('last_updated', { ascending: false });
    if (data) setTickets(data);
  };

  const fetchTicketMessages = async (ticketId) => {
    const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true });
    setMessages(data || []);
    scrollToBottom();
  };

  useEffect(() => {
    if (view === 'ticket_chat' && activeTicket) {
        fetchTicketMessages(activeTicket.id);
        const channel = supabase.channel(`ticket:${activeTicket.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${activeTicket.id}` }, (payload) => {
                setMessages(prev => {
                    if (prev.some(m => m.id === payload.new.id)) return prev;
                    return [...prev, payload.new];
                });
                scrollToBottom();
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'support_tickets', filter: `id=eq.${activeTicket.id}` }, (payload) => {
                setActiveTicket(payload.new);
            })
            .subscribe();
        return () => supabase.removeChannel(channel);
    }
  }, [view, activeTicket]);

  const handleSendTicketMessage = async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');

    const tempId = Date.now();
    const optimisticMsg = {
        id: tempId,
        ticket_id: activeTicket.id,
        sender_email: userProfile.email,
        message: text,
        is_admin: false,
        created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    scrollToBottom();

    try {
        const { error } = await supabase.from('support_messages').insert({
            ticket_id: activeTicket.id,
            sender_email: userProfile.email,
            message: text,
            is_admin: false
        });

        if (error) throw error;

        await supabase.from('support_tickets').update({ 
            last_updated: new Date(),
            last_message: `(User): ${text}`
        }).eq('id', activeTicket.id);

    } catch (err) {
        console.error("Failed to send message:", err);
    }
  };
  
  useEffect(() => { if (!activeFriend || !userProfile || view !== 'chat') return; const loadMessages = async () => { const { data } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${userProfile.email},receiver_id.eq.${activeFriend.email}),and(sender_id.eq.${activeFriend.email},receiver_id.eq.${userProfile.email})`).order('created_at', { ascending: true }); setMessages(data || []); scrollToBottom(); await supabase.from('messages').update({ is_read: true }).eq('sender_id', activeFriend.email).eq('receiver_id', userProfile.email).eq('is_read', false); setUnreadPerUser(prev => { const newCounts = { ...prev }; delete newCounts[activeFriend.email]; setTotalUnreadCount(prevTotal => Math.max(0, prevTotal - (prev[activeFriend.email] || 0))); return newCounts; }); setStrangerChats(prev => prev.filter(u => u.email !== activeFriend.email)); }; loadMessages(); const chatChannel = supabase.channel(`chat:${activeFriend.email}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userProfile.email}` }, (payload) => { if (payload.new.sender_id === activeFriend.email) { setMessages(prev => [...prev, payload.new]); scrollToBottom(); supabase.from('messages').update({ is_read: true }).eq('id', payload.new.id); } }).subscribe(); return () => supabase.removeChannel(chatChannel); }, [activeFriend, userProfile, view]);
  const handleSendMessage = async () => { if (!inputText.trim()) return; const text = inputText.trim(); setInputText(''); setMessages(prev => [...prev, { id: Date.now(), sender_id: userProfile.email, receiver_id: activeFriend.email, content: text, created_at: new Date().toISOString() }]); scrollToBottom(); await supabase.from('messages').insert({ sender_id: userProfile.email, receiver_id: activeFriend.email, content: text }); };
  const handleAddFriend = async (targetEmail) => { if (targetEmail === userProfile.email) return; const { data: existing } = await supabase.from('friendships').select('*').or(`and(requester_id.eq.${userProfile.email},receiver_id.eq.${targetEmail}),and(requester_id.eq.${targetEmail},receiver_id.eq.${userProfile.email})`); if (existing && existing.length > 0) { alert("มีคำขอค้างอยู่หรือเป็นเพื่อนกันแล้ว"); return; } const { error } = await supabase.from('friendships').insert({ requester_id: userProfile.email, receiver_id: targetEmail }); if (error) alert("Error: " + error.message); else setSentRequests(prev => [...prev, targetEmail]); };
  const handleAccept = async (id) => { await supabase.from('friendships').update({ status: 'accepted' }).eq('id', id); };
  const handleRemoveFriend = async (friendshipId, friendName) => { if (!confirm(`ลบ "${friendName}" ออกจากเพื่อน?`)) return; const { error } = await supabase.from('friendships').delete().eq('id', friendshipId); if (error) alert("ลบไม่สำเร็จ: " + error.message); else { if (view === 'chat') { setView('list'); setActiveFriend(null); } fetchFriendsAndRequests(); } };
  
  const filteredUsers = allUsers.filter(u => { const isMe = u.id === userProfile.email; const isFriend = friends.some(f => f.email === u.id); const matchesSearch = (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) || u.id.toLowerCase().includes(searchQuery.toLowerCase()); return !isMe && !isFriend && matchesSearch; });
  const scrollToBottom = () => { setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); };

  if (!userProfile) return null;
  const totalNotifications = requests.length + totalUnreadCount;

  return createPortal(
    <div className={`z-[9999] font-sans pointer-events-auto ${isMobileMenuOpen ? 'hidden md:flex' : 'flex'} ${isOpen ? 'fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:flex-col md:items-end' : 'fixed bottom-4 right-4 flex-col items-end'}`}>
      
      {isOpen && (
        <div className={`bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 shadow-2xl flex flex-col overflow-hidden animate-fade-in w-full h-full rounded-none md:w-80 md:h-[500px] md:rounded-2xl md:mb-3 md:animate-fade-in-up`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 text-white flex justify-between items-center shadow-md shrink-0 h-14">
                <div className="flex items-center gap-2 overflow-hidden">
                    {view !== 'list' && <button onClick={() => { setView(view === 'ticket_chat' ? 'tickets' : 'list'); setActiveFriend(null); }}><BackIcon/></button>}
                    {view === 'list' && <span className="font-bold text-lg">💬 Chat & Friends</span>}
                    {view === 'add' && <span className="font-bold text-lg">เพิ่มเพื่อน</span>}
                    {view === 'tickets' && <span className="font-bold text-lg">🎫 ติดต่อทีมงาน</span>}
                    {view === 'ticket_chat' && <span className="font-bold text-sm truncate">Ticket: {activeTicket?.subject}</span>}
                    {view === 'chat' && (
                        <div 
                            className="flex items-center gap-2 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedProfileId(activeFriend.email)}
                        >
                            <img src={activeFriend.profile.avatarUrl || `https://ui-avatars.com/api/?name=${activeFriend.profile.displayName}&background=random`} className="w-8 h-8 rounded-full border-2 border-white/20" alt="avatar" />
                            <span className="font-bold text-sm truncate max-w-[120px]">{activeFriend.profile.displayName || activeFriend.email}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {view === 'chat' && activeFriend.id && <button onClick={() => handleRemoveFriend(activeFriend.id, activeFriend.profile.displayName || activeFriend.email)} className="p-1.5 hover:bg-white/20 rounded text-red-100 hover:text-red-300 transition-colors"><TrashIcon /></button>}
                    {view === 'list' && requests.length > 0 && (<div className="relative animate-pulse" title="คำขอเป็นเพื่อน"><BellIcon /><span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900">{requests.length}</span></div>)}
                    {view === 'list' && <button onClick={() => setView('add')} className="hover:bg-white/20 p-1 rounded"><UserPlusIcon /></button>}
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded"><CloseIcon /></button>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto bg-slate-50 dark:bg-slate-900/50 scrollbar-thin">
                
                {/* 🟢 หน้า List (รวมปุ่ม Ticket) */}
                {view === 'list' && (
                    <div className="p-2 space-y-2">
                        {/* 🟢 ปุ่มติดต่อทีมงาน (Ticket) */}
                        <div onClick={() => { fetchTickets(); setView('tickets'); }} className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:shadow-md cursor-pointer transition-all">
                             <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-300"><HeadsetIcon /></div>
                             <div><p className="font-bold text-sm text-indigo-700 dark:text-indigo-300">ติดต่อทีมงาน / แจ้งปัญหา</p><p className="text-xs text-slate-500">Support Ticket System</p></div>
                        </div>

                        {requests.map(r => ( <div key={r.id} className="flex justify-between items-center text-sm mb-1 bg-white dark:bg-slate-800 p-2 rounded border border-amber-100 dark:border-amber-800/50"> <span className="truncate w-32 font-medium">{r.requester_id}</span> <button onClick={() => handleAccept(r.id)} className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs hover:bg-emerald-600 shadow-sm">ยืนยัน</button> </div> ))}
                        {strangerChats.map(u => ( <div key={u.email} className="group flex items-center gap-3 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 hover:shadow-md cursor-pointer transition-all active:scale-95 mb-1" onClick={() => { setActiveFriend(u); setView('chat'); }}> <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center shrink-0"> {u.profile.avatarUrl ? <img src={u.profile.avatarUrl} className="w-full h-full object-cover" /> : <div className="text-slate-400"><UserIcon /></div>} </div> <div className="flex-grow min-w-0"><p className="font-bold text-xs text-slate-800 dark:text-white truncate">{u.profile.displayName || u.email}</p><p className="text-[10px] text-red-500 font-bold">ข้อความใหม่!</p></div> </div> ))}
                        {friends.map(f => ( <div key={f.email} className="group flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-md cursor-pointer transition-all active:scale-95 relative" onClick={() => { setActiveFriend(f); setView('chat'); }}> <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center shrink-0"> {f.profile.avatarUrl ? ( <img src={f.profile.avatarUrl} className="w-full h-full object-cover" /> ) : ( <div className="text-slate-400"><UserIcon /></div> )} </div> <div className="flex-grow min-w-0"><p className="font-bold text-sm text-slate-800 dark:text-white truncate">{f.profile.displayName || f.email}</p><p className="text-xs text-slate-400 truncate">แตะเพื่อแชท</p></div> {unreadPerUser[f.email] > 0 && ( <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse"> {unreadPerUser[f.email] > 9 ? '9+' : unreadPerUser[f.email]} </div> )} <button onClick={(e) => { e.stopPropagation(); handleRemoveFriend(f.id, f.profile.displayName || f.email); }} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-all"><TrashIcon /></button> </div> ))}
                    </div>
                )}
                
                {/* 🟢 หน้า Add Friend */}
                {view === 'add' && (
                    <div className="p-2 h-full flex flex-col">
                        <div className="relative mb-3 shrink-0"><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="ค้นหาเพื่อน..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:border-emerald-500 dark:text-white" /><div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></div></div>
                        {isFetchingUsers ? <div className="text-center py-10 text-slate-500">กำลังโหลดรายชื่อ...</div> : (
                            <div className="space-y-2 overflow-y-auto pr-1 pb-4">
                                {filteredUsers.map(u => {
                                    const displayName = u.displayName || u.id;
                                    const isSent = sentRequests.includes(u.id);
                                    return (
                                        <div key={u.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                                    {u.avatarUrl ? (
                                                        <img src={u.avatarUrl} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-slate-400"><UserIcon /></div>
                                                    )}
                                                </div>
                                                <div className="min-w-0"><p className="font-bold text-sm text-slate-800 dark:text-white truncate">{displayName}</p>{!u.displayName && <p className="text-[10px] text-slate-400 truncate">{u.id}</p>}</div>
                                            </div>
                                            <button onClick={() => !isSent && handleAddFriend(u.id)} disabled={isSent} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${isSent ? 'bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800'}`}>{isSent ? "ส่งคำขอแล้ว" : "เพิ่มเพื่อน"}</button>
                                        </div>
                                    );
                                })}
                                {filteredUsers.length === 0 && <p className="text-center text-slate-400 py-4 text-xs">ไม่พบผู้ใช้</p>}
                            </div>
                        )}
                    </div>
                )}
                
                {/* 🟢 หน้า Ticket List */}
                {view === 'tickets' && (
                    <div className="p-2 space-y-2">
                        {tickets.length === 0 ? <div className="text-center py-10 text-slate-400"><p>ไม่มีรายการแจ้งปัญหา</p></div> : tickets.map(t => (
                            <div key={t.id} onClick={() => { setActiveTicket(t); setView('ticket_chat'); }} className={`cursor-pointer p-3 rounded-xl border flex justify-between items-center ${t.status === 'open' ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70'}`}>
                                <div><p className="font-bold text-sm text-slate-900 dark:text-white">{t.subject}</p><p className="text-xs text-slate-500 truncate w-40">{t.last_message}</p></div>
                                <span className={`px-2 py-1 text-[10px] rounded-full font-bold ${t.status === 'open' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-300 text-slate-600'}`}>{t.status === 'open' ? 'กำลังดำเนินการ' : 'ปิดเคสแล้ว'}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* 🟢 หน้า Ticket Chat */}
                {view === 'ticket_chat' && activeTicket && (
                    <div className="p-3 space-y-3 min-h-full flex flex-col justify-end">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex gap-2 ${!m.is_admin ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.is_admin ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{m.is_admin ? 'A' : 'U'}</div>
                                <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm shadow-sm break-words ${!m.is_admin ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-600'}`}>{m.message}</div>
                            </div>
                        ))}
                        {activeTicket.status === 'closed' && <div className="text-center py-4 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800/50 rounded-lg">⛔ เคสนี้ถูกปิดแล้ว</div>}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* หน้า Normal Chat */}
                {view === 'chat' && (
                    <div className="p-3 space-y-3 min-h-full flex flex-col justify-end">
                        {messages.length === 0 && <p className="text-center text-xs text-slate-400 py-4">เริ่มการสนทนาได้เลย</p>}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex gap-2 ${m.sender_id === userProfile.email ? 'flex-row-reverse' : ''}`}>
                                <div className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity self-end pb-1" onClick={(e) => { e.stopPropagation(); setSelectedProfileId(m.sender_id); }} title="ดูโปรไฟล์">
                                    <img src={m.user_picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm" onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                                </div>
                                <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm shadow-sm break-words ${m.sender_id === userProfile.email ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-600'}`}>{m.content}</div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Footer Input */}
            {(view === 'chat' || (view === 'ticket_chat' && activeTicket?.status === 'open')) && (
                <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shrink-0">
                    <form onSubmit={(e) => { e.preventDefault(); view === 'chat' ? handleSendMessage() : handleSendTicketMessage(); }} className="flex gap-2 items-center">
                        <input className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white" placeholder="พิมพ์ข้อความ..." value={inputText} onChange={e => setInputText(e.target.value)} />
                        <button type="submit" disabled={!inputText.trim()} className="p-2 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 disabled:opacity-50 transition-colors"><SendIcon /></button>
                    </form>
                </div>
            )}
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className={`w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-[0_4px_14px_rgba(16,185,129,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative ${isAnimating ? 'animate-bounce' : ''} ${isOpen ? 'hidden md:flex' : 'flex'}`}> {isOpen ? <CloseIcon /> : <ChatIcon />} {totalNotifications > 0 && !isOpen && ( <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-black animate-pulse shadow-md"> {totalNotifications > 9 ? '9+' : totalNotifications} </span> )} </button>
      <UserProfilePopup isOpen={!!selectedProfileId} onClose={() => setSelectedProfileId(null)} userId={selectedProfileId} />
    </div>, document.body
  );
}