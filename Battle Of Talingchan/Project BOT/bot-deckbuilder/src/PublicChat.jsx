import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import SettingsDrawer from './components/SettingsDrawer';
import AdminDashboardModal from './AdminDashboardModal';
import { 
  SendIcon, MessageCircleIcon, UsersIcon, StoreIcon, 
  LayersIcon, TrashIcon, CrownIcon, ImageIcon, 
  CloseIcon, PlusIcon, MegaphoneIcon, PinIcon, MoreVertIcon
} from './components/Icons';

// --- Configuration ---
const CHANNELS = [
  { id: 'general', name: 'General Hall', icon: <MessageCircleIcon />, desc: 'พูดคุยทั่วไป ทักทายเพื่อนฝูง' },
  { id: 'trade', name: 'Trading Zone', icon: <StoreIcon />, desc: 'ประกาศซื้อ-ขาย แลกเปลี่ยนการ์ด' },
  { id: 'strategy', name: 'Deck Strategy', icon: <LayersIcon />, desc: 'ปรึกษาจัดเด็ค คอมโบเทพ' },
  { id: 'off-topic', name: 'Void Lounge', icon: <UsersIcon />, desc: 'เรื่องสัพเพเหระ นอกเรื่องเกม' },
];

const ADMIN_EMAILS = [
  'koritros619@gmail.com',
  'sarun.psx@gmail.com',
  'srirujinanon.k@gmail.com'
];

const formatDate = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString([], options);
};

// Component: AnnouncementBoardSidebar (ขวาสุด)
const AnnouncementBoardSidebar = ({ isAdmin, onManage }) => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        const { data } = await supabase
            .from('public_announcements')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        if (data) setBanners(data);
    };

    if (banners.length === 0 && !isAdmin) return null;

    return (
        <div className="hidden lg:flex flex-col w-80 min-w-[300px] bg-[#111]/90 backdrop-blur-md border-l border-white/10 z-20 h-full overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0 h-16 bg-[#111]">
                <h3 className="font-bold text-white flex items-center gap-2 uppercase tracking-wider text-sm">
                    <MegaphoneIcon className="w-4 h-4 text-indigo-400"/> Highlights
                </h3>
                 {isAdmin && (
                    <button onClick={onManage} className="p-1.5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 rounded-full transition-all" title="จัดการประกาศ">
                        <MoreVertIcon /> 
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-indigo-900/50 scrollbar-track-transparent">
                {banners.length > 0 ? (
                    banners.map((b) => (
                        <div key={b.id} className="relative group rounded-xl overflow-hidden border border-white/10 shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300">
                            <img src={b.image_url} alt="Announcement" className="w-full h-auto object-cover"/>
                        </div>
                    ))
                ) : (
                     <div onClick={onManage} className="aspect-[3/4] flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl p-4 bg-black/20 cursor-pointer hover:border-indigo-500 hover:text-indigo-400 transition-all group">
                        <PlusIcon className="w-10 h-10 mb-3 text-slate-600 group-hover:text-indigo-500 transition-colors"/>
                        <span className="text-xs font-bold uppercase tracking-widest">Add Poster</span>
                    </div>
                )}
            </div>
             <div className="p-3 text-[9px] text-center text-slate-600 border-t border-white/5 bg-black/20">Promotional Space</div>
        </div>
    );
};

// Component: Modal จัดการประกาศ
const ManageAnnouncementsModal = ({ isOpen, onClose, onUpdate }) => {
    const [banners, setBanners] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        if (isOpen) fetchBanners();
    }, [isOpen]);

    const fetchBanners = async () => {
        const { data } = await supabase.from('public_announcements').select('*').order('created_at', { ascending: false });
        if (data) setBanners(data);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            // ใช้ชื่อไฟล์ภาษาอังกฤษ และตัดช่องว่างออก
            const fileExt = file.name.split('.').pop();
            const fileName = `poster-${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage.from('announcement-images').upload(fileName, file);
            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage.from('announcement-images').getPublicUrl(fileName);
            
            const { error: insertError } = await supabase.from('public_announcements').insert([{ image_url: publicUrl, is_active: true }]);
            if (insertError) throw insertError;

            fetchBanners();
            onUpdate(); 
        } catch (error) {
            console.error("Upload Error:", error);
            alert(`อัปโหลดล้มเหลว: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if(!confirm("ลบประกาศนี้?")) return;
        await supabase.from('public_announcements').delete().eq('id', id);
        fetchBanners();
        onUpdate();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <MegaphoneIcon className="w-5 h-5 text-indigo-400"/> จัดการป้ายประกาศ
                    </h3>
                    <button onClick={onClose}><CloseIcon className="text-slate-400 hover:text-white transition-colors"/></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div onClick={() => fileRef.current?.click()} className="aspect-[3/4] bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-800 transition-all group">
                        {uploading ? <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-indigo-500 rounded-full"/> : (
                            <>
                                <PlusIcon className="w-10 h-10 text-slate-600 group-hover:text-indigo-400 mb-2 transition-colors"/>
                                <span className="text-xs text-slate-400 group-hover:text-slate-300">อัปโหลดโปสเตอร์ (แนวตั้ง)</span>
                            </>
                        )}
                        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleUpload}/>
                    </div>
                    {banners.map((b) => (
                        <div key={b.id} className="relative aspect-[3/4] group rounded-xl overflow-hidden border border-slate-700 shadow-sm hover:shadow-md transition-all">
                            <img src={b.image_url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => handleDelete(b.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transform scale-90 hover:scale-100 transition-all" title="ลบ"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function PublicChat({ userProfile }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!userProfile) navigate('/login');
  }, [userProfile, navigate]);

  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // 🟢 เพิ่ม State Theme ตรงนี้!
  const [theme, setTheme] = useState(localStorage.getItem('bot-theme') || 'dark'); 
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false); 

  const scrollRef = useRef(null);
  const isAdmin = userProfile && ADMIN_EMAILS.includes(userProfile?.email);
  const [refreshBanners, setRefreshBanners] = useState(0); 

  // --- Theme Handler ---
  // 🟢 ฟังก์ชันสำหรับเปลี่ยนธีมและบันทึกลง LocalStorage
  const handleSetTheme = (newTheme) => {
      setTheme(newTheme);
      localStorage.setItem('bot-theme', newTheme);
      const root = document.documentElement;
      if (newTheme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
  };

  // Init Theme
  useEffect(() => {
      const root = document.documentElement;
      if (theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
  }, [theme]);

  if (!userProfile) return null;

  // --- Realtime & Fetch ---
  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel('public-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'public_chat_messages' }, (payload) => {
        if (payload.new.channel === activeChannel) {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'public_chat_messages' }, (payload) => {
        setMessages((prev) => prev.filter(msg => msg.id !== payload.old.id));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeChannel]);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('public_chat_messages').select('*').eq('channel', activeChannel).order('created_at', { ascending: true }).limit(100);
    if (!error) { setMessages(data); scrollToBottom(); }
    setIsLoading(false);
  };

  const scrollToBottom = () => { setTimeout(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100); };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim()) || !userProfile) return;
    await submitMessage(newMessage.trim(), null);
    setNewMessage('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("ไฟล์ใหญ่เกินไป (Max 5MB)"); return; }
    setIsUploading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userProfile.id}/${Date.now()}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('chat-images').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('chat-images').getPublicUrl(fileName);
        await submitMessage(null, publicUrl);
    } catch (error) {
        console.error("Upload failed:", error);
        alert("อัปโหลดรูปภาพไม่สำเร็จ: " + error.message);
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const submitMessage = async (text, imageUrl) => {
    const msgData = {
      user_id: userProfile.id,
      user_email: userProfile.email,
      user_name: userProfile.name || 'Unknown Duelist',
      user_avatar: userProfile.picture,
      content: text || (imageUrl ? 'ส่งรูปภาพ' : ''),
      image_url: imageUrl,
      channel: activeChannel,
      is_pinned: false
    };
    await supabase.from('public_chat_messages').insert([msgData]);
  };

  const handleDeleteMessage = async (msgId) => {
    if (!confirm("ต้องการลบข้อความนี้ใช่ไหม?")) return;
    await supabase.from('public_chat_messages').delete().eq('id', msgId);
  };

  const ChannelButton = ({ channel }) => (
    <button onClick={() => setActiveChannel(channel.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeChannel === channel.id ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'}`}>
      <div className={`p-2 rounded-lg shrink-0 ${activeChannel === channel.id ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>{channel.icon}</div>
      <div className="text-left overflow-hidden"><div className="font-bold text-sm truncate">{channel.name}</div><div className="text-[10px] opacity-70 truncate">{channel.desc}</div></div>
      {activeChannel === channel.id && (<div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"></div>)}
    </button>
  );

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden !m-0 !p-0 bg-[#0f172a]" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`, backgroundSize: '20px 20px' }}>
      <div className="flex-none w-full !max-w-full z-50 bg-slate-100 dark:bg-black border-b border-slate-200 dark:border-slate-800 shadow-sm !m-0 !p-0">
        <Header userProfile={userProfile} displayUser={userProfile} setIsSettingsOpen={setIsSettingsOpen} setIsAdminOpen={setIsAdminOpen} />
      </div>
      <div className="flex-grow w-full h-full overflow-hidden relative flex flex-col md:flex-row">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 min-w-[280px] max-w-sm bg-[#111]/90 backdrop-blur-md border-b md:border-b-0 md:border-r border-white/10 flex flex-col z-20">
             <div className="p-4 md:p-6 border-b border-white/5 h-16 flex items-center">
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] uppercase tracking-tighter truncate">Community Hub</h2>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">Frequency Channels</div>
                {CHANNELS.map(ch => <ChannelButton key={ch.id} channel={ch} />)}
             </div>
             <div className="p-4 bg-black/40 border-t border-white/5"><div className="text-[10px] text-slate-500 text-center leading-relaxed">Data Retention: 1,000,000 Msg<br/>Cycle: Rolling Buffer (FIFO)</div></div>
          </div>

          {/* Middle Main Area */}
          <div className="flex-grow flex flex-col h-full bg-[#0a0a0a] relative overflow-hidden">
            <div className="h-16 bg-slate-900/80 backdrop-blur border-b border-white/10 flex items-center px-6 justify-between shrink-0 z-10 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">{CHANNELS.find(c => c.id === activeChannel)?.icon}</div>
                <div><h2 className="font-bold text-white text-lg leading-none">#{CHANNELS.find(c => c.id === activeChannel)?.name}</h2><p className="text-[10px] text-slate-400 mt-0.5">Live Feed • Real-time Updates</p></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-indigo-900/50 scrollbar-track-transparent">
              {isLoading ? (
                 <div className="flex h-full items-center justify-center gap-3 text-indigo-400 animate-pulse"><LayersIcon className="w-6 h-6 animate-spin" /> Loading Data Stream...</div>
              ) : messages.length === 0 ? (
                 <div className="flex h-full flex-col items-center justify-center text-slate-600 opacity-40 select-none">
                   <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4"><MessageCircleIcon className="w-10 h-10" /></div>
                   <p className="text-sm font-bold">NO DATA FOUND</p>
                 </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = userProfile.id === msg.user_id;
                  const isMsgAdmin = ADMIN_EMAILS.includes(msg.user_email);
                  const isSequence = index > 0 && messages[index-1].user_id === msg.user_id;
                  return (
                    <div key={msg.id} className={`flex gap-3 md:gap-4 ${isMe ? 'flex-row-reverse' : ''} ${isSequence ? 'mt-1' : 'mt-4'} group max-w-4xl ${isMe ? 'ml-auto' : 'mr-auto'} w-full`}>
                      {!isSequence ? (<div className="shrink-0 flex flex-col items-center pt-1"><img src={msg.user_avatar} className={`w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 ${isMsgAdmin ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-slate-700'}`} alt="avatar" /></div>) : (<div className="w-8 md:w-10 shrink-0"></div>)}
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%] min-w-[100px] relative`}>
                        {!isSequence && (<div className={`text-[10px] font-bold mb-1 opacity-70 flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''}`}><span className={isMsgAdmin ? 'text-red-400 flex items-center gap-1' : 'text-slate-300'}>{msg.user_name}{isMsgAdmin && <CrownIcon className="w-3 h-3" />}</span><span className="text-slate-600 font-mono text-[9px]">{formatDate(msg.created_at)}</span></div>)}
                        <div className={`px-4 py-2.5 text-sm leading-relaxed break-words shadow-lg relative group/bubble transition-all ${isMe ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-tl-none'}`}>
                           {msg.image_url && (<div className="mb-2 rounded-lg overflow-hidden border border-black/20"><img src={msg.image_url} alt="Shared" className="max-w-full h-auto max-h-[300px] object-cover hover:scale-105 transition-transform cursor-pointer" onClick={() => window.open(msg.image_url, '_blank')} /></div>)}
                           {msg.content && <span>{msg.content}</span>}
                        </div>
                        {(isAdmin || isMe) && (<button onClick={() => handleDeleteMessage(msg.id)} className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-full ${isMe ? '-left-8' : '-right-8'}`}><TrashIcon className="w-3 h-3" /></button>)}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef} />
            </div>
            <div className="p-4 md:p-6 bg-slate-900/90 border-t border-white/10 shrink-0 backdrop-blur-md">
               <form onSubmit={handleSendMessage} className="flex gap-3 items-end relative max-w-5xl mx-auto w-full">
                 <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition-all active:scale-95 disabled:opacity-50">
                    {isUploading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ImageIcon className="w-6 h-6" />}
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                 <div className="flex-1 bg-black/40 border border-slate-700 rounded-2xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all flex items-center overflow-hidden">
                   <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.name}...`} className="w-full bg-transparent border-none text-white px-5 py-4 focus:outline-none placeholder-slate-600 text-sm md:text-base" />
                 </div>
                 <button type="submit" disabled={!newMessage.trim()} className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center"><SendIcon className="w-5 h-5 md:w-6 md:h-6" /></button>
               </form>
            </div>
          </div>

        {/* Right Sidebar (Announcement Board) */}
        <AnnouncementBoardSidebar isAdmin={isAdmin} onManage={() => setIsAnnouncementModalOpen(true)} key={refreshBanners} />
      </div>

      {/* 🟢 2. ส่ง Props theme และ setTheme ให้ SettingsDrawer */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userProfile={userProfile} onOpenAdmin={() => setIsAdminOpen(true)} theme={theme} setTheme={handleSetTheme} />
      
      {isAdmin && <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />}
      <ManageAnnouncementsModal isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} onUpdate={() => setRefreshBanners(p => p+1)} />
    </div>
  );
}