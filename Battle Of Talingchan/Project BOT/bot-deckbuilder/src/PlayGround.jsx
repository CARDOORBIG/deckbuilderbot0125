import React, { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from './firebase'; 

// Components
import Header from './components/Header';
import SettingsDrawer from './components/SettingsDrawer';
import AdminDashboardModal from './AdminDashboardModal';
import DeckListModal from './components/DeckListModal';
import FeedbackModal from './components/FeedbackModal';
import ProfileSetupModal from './components/ProfileSetupModal';

// Game Room Component
import GameRoom from './components/GameRoom/GameRoom';

// Icons (ตรวจสอบว่ามี CloseIcon ในนี้)
import { 
    CloseIcon, LayersIcon, GamepadIcon, 
    PlusIcon, SearchIcon 
} from './components/Icons'; 

// --- Constants & Helpers ---

// 1. ฟังก์ชันแปลง Path สำหรับ URL
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';

// 2. รูป Placeholder สีเทา (ไม่ต้องใช้เน็ต)
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' fill='%23666' dy='.3em' text-anchor='middle' font-family='sans-serif'%3EIMG%3C/text%3E%3C/svg%3E";

// 3. รายชื่อไฟล์การ์ด (ต้องตรงกับโฟลเดอร์ public/cards ของคุณ)
const CARD_PATHS = [
  { path: "002.STARTER DECK (SD01 - SD07)/SD01 - ตัวตึงไกรลาส", file: "cardsSD01 - ตัวตึงไกรลาส.txt" },
  { path: "002.STARTER DECK (SD01 - SD07)/SD02 - วีรบุรุษปากซอย", file: "cardsSD02 - วีรบุรุษปากซอย.txt" },
  { path: "002.STARTER DECK (SD01 - SD07)/SD03 - นรกก็แค่น้ำพริก", file: "cardsSD03 - นรกก็แค่น้ำพริก.txt" },
  { path: "002.STARTER DECK (SD01 - SD07)/SD04 - ทหารไก่ชนเขา", file: "cardsSD04 - ทหารไก่ชนเขา.txt" },
  { path: "002.STARTER DECK (SD01 - SD07)/SD05 - กำเนิดจากน้ำ", file: "cardsSD05 - กำเนิดจากน้ำ.txt" },
  { path: "002.STARTER DECK (SD01 - SD07)/SD06 - ๖ ประจัญบาน", file: "cardsSD06 - ๖ ประจัญบาน.txt" },
  { path: "002.STARTER DECK (SD01 - SD07)/SD07 - VS 18 หัวเมือง", file: "cardsSD07 - VS 18 หัวเมือง.txt" },
  { path: "003.BOOSTER (BT01 - BT08)/BT01 - Welcome ตลิ่งชัน", file: "cardsBT01 - Welcome ตลิ่งชัน.txt" },
  { path: "003.BOOSTER (BT01 - BT08)/BT02 - Attack on เพื่อนบ้าน", file: "cardsBT02 - Attack on เพื่อนบ้าน.txt" },
  { path: "003.BOOSTER (BT01 - BT08)/BT03 - อมนุษย์ Invasion", file: "cardsBT03 - อมนุษย์ Invasion.txt" },
  { path: "003.BOOSTER (BT01 - BT08)/BT04 - ความจริง Today", file: "cardsBT04 - ความจริง Today.txt" },
  { path: "003.BOOSTER (BT01 - BT08)/BT05 - Culture ช๊อค", file: "cardsBT05 - Culture ช๊อค.txt" },
  { path: "003.BOOSTER (BT01 - BT08)/BT06 - โลกา Amagedon", file: "cardsBT06 - โลกา Amagedon.txt" },
  { path: "003.BOOSTER (BT01 - BT08)/BT07 - Life of หน่วง", file: "cardsBT07 - Life of หน่วง.txt" },
  { path: "003.BOOSTER (BT01 - BT08)/BT08 - เพราะ Warrior is นักรบ", file: "cardsBT08 - เพราะ Warrior is นักรบ.txt" },
  { path: "001.PROMO CARD (PRM0)/PRM0", file: "cardsPRM0.txt" },
  { path: "005.SELECTION (SL01)/SL01 - Selection", file: "cardsSL01 - Selection.txt" },
  { path: "004.COMMUNITY COLLECTION (CC01)/CC01 - Community Collection", file: "cardsCC01 - Community Collection.txt" },
  { path: "006.ODENYA (ODY1) - REPRINT/ODY1 - Odenya", file: "cardsODY1 - Odenya.txt" }
];

// 4. ฟังก์ชันโหลดการ์ดทั้งหมด (เพื่อเอา path รูปภาพ)
async function fetchAllTxt() { 
    let allCards = []; 
    console.log("📦 Loading Card Database for PlayGround..."); 
    
    for (const { path: pathString, file: filename } of CARD_PATHS) { 
        const encodedPath = encodePath(pathString); 
        const url = `/cards/${encodedPath}/${encodeURIComponent(filename)}`; 
        try { 
            const res = await fetch(url); 
            if (!res.ok) continue; 
            const txt = await res.text(); 
            const data = JSON.parse(txt); 
            if (Array.isArray(data)) { 
                const withPath = data.map(card => ({ 
                    ...card, 
                    imagePath: pathString, // ✅ สำคัญ: เก็บ Path รูปภาพไว้ในการ์ด
                    onlyRank: card.id.includes('- Only#1') ? 1 : card.onlyRank 
                })); 
                allCards = allCards.concat(withPath); 
            } 
        } catch (e) { 
            console.error(`Failed to load ${url}`, e); 
        } 
    } 
    console.log(`✅ Loaded ${allCards.length} cards.`); 
    return allCards; 
}

export default function PlayGround() {
  const navigate = useNavigate();
  
  // --- Global UI States ---
  const [userProfile, setUserProfile] = useState(null);
  const [customProfile, setCustomProfile] = useState(null);
  const [userReputation, setUserReputation] = useState({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDeckListModalOpen, setIsDeckListModalOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [theme, setThemeState] = useState(() => { try { return JSON.parse(localStorage.getItem("bot-theme")) || 'dark'; } catch { return 'dark'; } });

  // --- Game/Lobby States ---
  const [userDecks, setUserDecks] = useState({});
  const [cardDb, setCardDb] = useState([]); // 🟢 เก็บข้อมูลการ์ดทั้งหมดเพื่อใช้ซ่อมข้อมูล Deck
  const [roomID, setRoomID] = useState(''); 
  const [joinedRoom, setJoinedRoom] = useState(null); 
  const [roomConfig, setRoomConfig] = useState(null); 
  const [availableRooms, setAvailableRooms] = useState([]); 
  const [selectedDeckId, setSelectedDeckId] = useState(0); 
  
  // --- Create Room Modal States ---
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [createRoomForm, setCreateRoomForm] = useState({
      name: '',
      password: '',
      allowSpectators: true,
      maxSpectators: 10
  });

  const lobbyChannelRef = useRef(null); 
  const [onDeckSelectCallback, setOnDeckSelectCallback] = useState(null); 

  // --- 1. Initial Load & Auth ---
  useEffect(() => {
    const savedProfile = localStorage.getItem("bot-userProfile-v1");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      fetchReputation(profile.email);
    } else {
      alert("กรุณา Login ก่อนเข้าเล่น!");
      navigate('/');
      return;
    }

    const savedDecks = localStorage.getItem("bot-userDecks-v1");
    if (savedDecks) {
        try {
            const parsedDecks = JSON.parse(savedDecks);
            setUserDecks(parsedDecks);
        } catch (e) { console.error(e); }
    }

    // 🟢 Load Card Database ทันทีที่เข้าหน้า
    fetchAllTxt().then(setCardDb);

  }, [navigate]);

  useEffect(() => { 
      if (userProfile?.email) { 
          const fetchProfile = async () => { 
              try { 
                  const docSnap = await getDoc(doc(db, "users", userProfile.email)); 
                  if (docSnap.exists()) setCustomProfile(docSnap.data()); 
              } catch (e) { console.error("Profile fetch error", e); } 
          }; 
          fetchProfile(); 
      } 
  }, [userProfile]);

  useEffect(() => { const root = document.documentElement; if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark'); }, [theme]);
  const setTheme = (newTheme) => { setThemeState(newTheme); localStorage.setItem("bot-theme", JSON.stringify(newTheme)); };

  const fetchReputation = async (email) => {
      const { data } = await supabase.from('user_stats').select('*').eq('user_email', email).single();
      if (data) setUserReputation(data);
  };

  const displayUser = useMemo(() => { 
      if (!userProfile) return null; 
      if (!customProfile) return userProfile; 
      return { 
          ...userProfile, 
          ...customProfile, 
          name: customProfile.displayName || userProfile.name, 
          picture: customProfile.avatarUrl || userProfile.picture || PLACEHOLDER_IMG 
      }; 
  }, [userProfile, customProfile]);

  const handleLogout = () => { localStorage.removeItem("bot-userProfile-v1"); navigate('/'); };

  const getCurrentUserSlots = () => {
      if (!userProfile?.email || !userDecks) return [];
      return userDecks[userProfile.email]?.slots || [];
  };

  // 🟢 ฟังก์ชันซ่อมข้อมูล Deck (Hydrate) - หัวใจสำคัญที่ทำให้รูปขึ้น!
  // มันจะเอา ID การ์ดไปค้นใน cardDb แล้วดึงข้อมูลที่มี imagePath มาใส่แทน
  const getSelectedDeckObject = () => {
      const slots = getCurrentUserSlots();
      const rawDeck = slots[selectedDeckId] || null;

      // ถ้าไม่มีเด็ค หรือยังโหลด DB ไม่เสร็จ ให้คืนค่าเดิมไปก่อน
      if (!rawDeck || cardDb.length === 0) return rawDeck;

      const hydrateCards = (cards) => {
          if (!cards) return [];
          return cards.map(c => {
              // ค้นหาการ์ดใน DB ด้วย ID
              const found = cardDb.find(dbCard => dbCard.id === c.id);
              return found || c; // ถ้าเจอใช้ข้อมูลจาก DB (มีรูป), ถ้าไม่เจอใช้ของเดิม
          });
      };

      // ซ่อมทั้ง Main และ Life deck
      const hydratedMain = hydrateCards(rawDeck.main);
      const hydratedLife = hydrateCards(rawDeck.life);

      // สร้าง path รูปปกจาก Only#1
      const only1 = hydratedMain.find(c => c.onlyRank === 1);
      let coverImage = null;
      if (only1 && only1.imagePath) {
          coverImage = `/cards/${encodePath(only1.imagePath)}/${encodeURIComponent(only1.id.replace(' - Only#1', ''))}.png`;
      }

      return {
          ...rawDeck,
          main: hydratedMain,
          life: hydratedLife,
          coverImage: coverImage 
      };
  };

  // --- Realtime Lobby ---
  useEffect(() => {
      if (!displayUser) return;
      const channel = supabase.channel('public-lobby', {
          config: { presence: { key: displayUser.email } }
      });
      channel.on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            const activeRooms = [];
            Object.values(state).forEach(users => {
                users.forEach(u => {
                    if (u.isHost && u.roomData) {
                        if (!activeRooms.find(r => r.id === u.roomData.id)) {
                            activeRooms.push(u.roomData);
                        }
                    }
                });
            });
            activeRooms.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setAvailableRooms(activeRooms);
        }).subscribe();
      lobbyChannelRef.current = channel;
      return () => { if (lobbyChannelRef.current) supabase.removeChannel(lobbyChannelRef.current); };
  }, [displayUser]);

  // --- Actions ---
  const openCreateRoomModal = () => {
      if (cardDb.length === 0) return alert("⏳ กำลังโหลดฐานข้อมูลการ์ด... กรุณารอสักครู่");
      
      const currentDeck = getSelectedDeckObject();
      if (!currentDeck || !currentDeck.main || currentDeck.main.length === 0) {
          return alert("Deck ที่เลือกว่างเปล่า! กรุณาจัดเด็คก่อนสร้างห้อง");
      }

      setCreateRoomForm({ name: '', password: '', allowSpectators: true, maxSpectators: 10 });
      setIsCreateRoomOpen(true);
  };

  const handleCreateRoomSubmit = async () => {
      if (!createRoomForm.name.trim()) return alert("กรุณากรอกชื่อห้อง");
      
      const roomName = createRoomForm.name.trim();
      const newRoomData = { id: roomName, name: roomName, host: displayUser.name, players: 1, maxPlayers: 2, isLocked: !!createRoomForm.password, spectators: 0, created_at: new Date().toISOString() };
      
      if (lobbyChannelRef.current) {
          await lobbyChannelRef.current.track({ user: displayUser.name, isHost: true, roomData: newRoomData, online_at: new Date().toISOString() });
      }
      joinRoom(roomName, { password: createRoomForm.password, maxSpectators: createRoomForm.allowSpectators ? parseInt(createRoomForm.maxSpectators) : 0, isHost: true, roomData: newRoomData });
      setIsCreateRoomOpen(false);
  };

  const joinRoom = (roomName, config = null) => {
    if (!roomName.trim()) return alert("กรุณาระบุชื่อห้อง");
    
    // ตรวจสอบความพร้อมของเด็คก่อนเข้าห้อง
    const currentDeck = getSelectedDeckObject();
    if (!currentDeck || !currentDeck.main || currentDeck.main.length === 0) {
        return alert("Deck ที่เลือกว่างเปล่า! หรือฐานข้อมูลการ์ดยังโหลดไม่เสร็จ");
    }

    setRoomConfig(config);
    setJoinedRoom(roomName);
  };

  const handleLeaveRoom = async () => {
      if (roomConfig?.isHost && lobbyChannelRef.current) {
          await lobbyChannelRef.current.untrack();
      }
      setJoinedRoom(null);
      setRoomConfig(null);
  };

  const handleOpenDeckSelector = (callback) => { setOnDeckSelectCallback(() => callback); setIsDeckListModalOpen(true); };
  const handleDeckSelected = (deck) => {
      if (onDeckSelectCallback) {
          // ซ่อมเด็คที่เลือกใหม่ในเกมด้วย
          const hydratedDeck = {
              ...deck,
              main: deck.main.map(c => cardDb.find(dbC => dbC.id === c.id) || c),
              life: deck.life.map(c => cardDb.find(dbC => dbC.id === c.id) || c)
          };
          onDeckSelectCallback(hydratedDeck);
          setOnDeckSelectCallback(null);
      } else {
          setSelectedDeckId(deck.id);
      }
      setIsDeckListModalOpen(false);
  };

  const mySlots = getCurrentUserSlots();

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden !m-0 !p-0"
        style={{
            backgroundColor: theme === 'dark' ? '#0f172a' : '#f1f5f9',
            backgroundImage: theme === 'dark' ? `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)` : `linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)`,
            backgroundSize: '20px 20px', zIndex: 0
        }}
    >
      {!joinedRoom && (
          <div className="flex-none w-full !max-w-full z-50 bg-slate-100 dark:bg-black border-b border-slate-200 dark:border-slate-800 shadow-sm !m-0 !p-0">
              <Header userProfile={userProfile} displayUser={displayUser} userReputation={userReputation} setIsSettingsOpen={setIsSettingsOpen} setIsAdminOpen={setIsAdminOpen} setIsMyDecksOpen={setIsDeckListModalOpen} />
          </div>
      )}

      <main className="flex-grow w-full h-full overflow-hidden relative flex flex-col">
        {!joinedRoom ? (
            <div className="flex flex-col w-full h-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-sm animate-fade-in">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 md:p-6 flex items-center justify-between shrink-0 shadow-md z-10 w-full">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"><GamepadIcon /></div>
                        <div><h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">Game Lobby</h2><p className="text-purple-100 text-xs">โซนเล่นการ์ดออนไลน์ (Beta)</p></div>
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/10">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${availableRooms ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                        <span className="text-xs text-white">Lobby Connected</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row flex-grow w-full overflow-hidden">
                    <div className="w-full md:w-1/3 min-w-[300px] bg-slate-50 dark:bg-slate-800/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 flex flex-col h-full">
                         <div className="p-4 md:p-6 overflow-y-auto h-full w-full">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2"><LayersIcon /> 1. เลือกเด็ค (My Deck)</h3>
                            <div className="space-y-4">
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm w-full">
                                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Deck ที่ใช้งาน:</label>
                                    {mySlots.length > 0 ? (
                                        <div className="relative w-full">
                                            <select className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg p-3 outline-none focus:border-purple-500 cursor-pointer" value={selectedDeckId} onChange={(e) => setSelectedDeckId(Number(e.target.value))}>
                                                {mySlots.map((slot, index) => (<option key={index} value={index}>{slot.name || `Slot ${index + 1}`} ({ (slot.main?.length || 0) } ใบ)</option>))}
                                            </select>
                                            <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                <div className="flex justify-between mb-1"><span>Main Deck:</span><span className="font-bold text-slate-900 dark:text-white">{mySlots[selectedDeckId]?.main?.length || 0}</span></div>
                                                <div className="flex justify-between"><span>Life Deck:</span><span className="font-bold text-slate-900 dark:text-white">{mySlots[selectedDeckId]?.life?.length || 0}</span></div>
                                                <div className="flex justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-700"><span>Card Database:</span><span className={`font-bold ${cardDb.length > 0 ? 'text-emerald-500' : 'text-amber-500'}`}>{cardDb.length > 0 ? '✅ Ready' : '⏳ Loading...'}</span></div>
                                            </div>
                                        </div>
                                    ) : (<div className="text-red-500 text-xs text-center py-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">❌ ไม่พบข้อมูล Deck<br/>(กรุณาไปที่เมนู My Decks เพื่อสร้าง)</div>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 bg-white dark:bg-slate-900 flex flex-col h-full">
                        <div className="p-4 md:p-6 h-full flex flex-col w-full">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2"><SearchIcon /> 2. เลือกห้อง (Battle Zone)</h3>
                            <div className="flex flex-col gap-4 mb-4 shrink-0 w-full">
                                <button onClick={openCreateRoomModal} disabled={cardDb.length === 0} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 text-lg border border-purple-400/30 disabled:opacity-50 disabled:cursor-wait">
                                    {cardDb.length === 0 ? "⏳ กำลังโหลดการ์ด..." : <><PlusIcon className="w-6 h-6" /> สร้างห้องใหม่ (Create Room)</>}
                                </button>
                                <div className="flex items-center gap-2"><div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow"></div><span className="text-xs text-slate-400">หรือเข้าร่วมด้วย ID</span><div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow"></div></div>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="กรอกชื่อห้อง..." className="flex-grow p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 min-w-0" value={roomID} onChange={e => setRoomID(e.target.value)} />
                                    <button onClick={() => joinRoom(roomID)} disabled={!roomID.trim() || cardDb.length === 0} className="px-6 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold rounded-xl shadow-sm transition-all active:scale-95 whitespace-nowrap flex-shrink-0 disabled:opacity-50">เข้าร่วม</button>
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto pr-1 space-y-3 w-full">
                                {availableRooms.length === 0 ? (
                                    <div className="text-center py-10 flex flex-col items-center justify-center opacity-50"><div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3"><GamepadIcon className="w-8 h-8 text-slate-400" /></div><p className="text-slate-500 dark:text-slate-400">ยังไม่มีห้องที่เปิดอยู่</p><p className="text-xs text-slate-400">สร้างห้องเลย! เพื่อเป็นคนแรก</p></div>
                                ) : (
                                    availableRooms.map((room) => (
                                        <div key={room.id} onClick={() => joinRoom(room.id)} className="group flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-purple-500 hover:shadow-md transition-all w-full relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center shrink-0"><GamepadIcon className="w-6 h-6" /></div><div><h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">{room.name} {room.isLocked && <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200">🔒 Pass</span>}</h4><p className="text-xs text-slate-500">Host: {room.host}</p></div></div>
                                            <div className="flex items-center gap-3"><div className="text-right hidden sm:block"><span className="text-[10px] text-slate-400 block">Players</span><span className="text-xs font-bold text-emerald-500">{room.players}/{room.maxPlayers}</span></div><button className="px-4 py-2 bg-purple-600/10 text-purple-600 dark:text-purple-400 font-bold rounded-lg text-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">JOIN</button></div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            // === GAME ROOM ===
            // 🟢 ส่งเด็คที่ Hydrate แล้ว (มีรูปครบ) เข้าไป
            <GameRoom 
                roomID={joinedRoom}
                userProfile={displayUser}
                roomConfig={roomConfig}
                onLeaveRoom={handleLeaveRoom}
                userDecks={userDecks}
                openDeckModal={handleOpenDeckSelector}
                initialDeck={getSelectedDeckObject()} 
            />
        )}
      </main>

      {/* Modals */}
      {isCreateRoomOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"><div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-700"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><PlusIcon /> สร้างห้องใหม่</h3><button onClick={() => setIsCreateRoomOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><CloseIcon /></button></div><div className="space-y-4"><div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">ชื่อห้อง</label><input type="text" className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" value={createRoomForm.name} onChange={(e) => setCreateRoomForm({...createRoomForm, name: e.target.value})} placeholder="ตั้งชื่อห้อง..." /></div><div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">รหัสผ่าน (ไม่บังคับ)</label><input type="password" className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" value={createRoomForm.password} onChange={(e) => setCreateRoomForm({...createRoomForm, password: e.target.value})} placeholder="ตั้งรหัสผ่าน..." /></div><div><div className="flex items-center justify-between mb-2"><label className="block text-xs font-bold text-slate-500 uppercase">ผู้ชม</label><label className="inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={createRoomForm.allowSpectators} onChange={(e) => setCreateRoomForm({...createRoomForm, allowSpectators: e.target.checked})} /><div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div></label></div>{createRoomForm.allowSpectators && (<div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700"><span className="text-sm dark:text-slate-300">จำนวนผู้ชมสูงสุด:</span><input type="number" min="1" max="100" className="w-20 p-1 text-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" value={createRoomForm.maxSpectators} onChange={(e) => setCreateRoomForm({...createRoomForm, maxSpectators: e.target.value})} /><span className="text-sm text-slate-400">คน</span></div>)}</div></div><div className="mt-8 flex gap-3"><button onClick={() => setIsCreateRoomOpen(false)} className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">ยกเลิก</button><button onClick={handleCreateRoomSubmit} className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">ยืนยัน</button></div></div></div>
      )}

      {/* Other Drawers */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userProfile={displayUser} onEditProfile={() => setIsProfileModalOpen(true)} onLogout={handleLogout} theme={theme} setTheme={setTheme} onOpenAdmin={() => setIsAdminOpen(true)} userStats={userReputation} onOpenMyDecks={() => setIsDeckListModalOpen(true)} onOpenFeedback={() => setIsFeedbackOpen(true)} />
      <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} adminEmail={userProfile?.email} />
      <DeckListModal isOpen={isDeckListModalOpen} onClose={() => { setIsDeckListModalOpen(false); setOnDeckSelectCallback(null); }} userProfile={displayUser} userDecks={userDecks} setUserDecks={setUserDecks} mainDeck={[]} lifeDeck={[]} setMainDeck={()=>{}} setLifeDeck={()=>{}} cardDb={cardDb} onSelectDeck={handleDeckSelected} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} userProfile={displayUser} showAlert={alert} />
      <ProfileSetupModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userProfile={userProfile} onSave={() => {}} />
    </div>
  );
}