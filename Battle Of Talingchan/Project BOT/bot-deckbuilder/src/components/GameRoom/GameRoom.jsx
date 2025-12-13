import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import PreStartLobby from './PreStartLobby';
import Battlefield from './Battlefield';
import { SendIcon, CloseIcon } from '../Icons';

// ... (Imports and Helpers: encodePath, shuffleDeck, PLACEHOLDER_IMG, ConfirmationModal, ChatBubbleIcon เหมือนเดิม) ...
// เพื่อประหยัดพื้นที่ ขอแสดงเฉพาะส่วนที่เพิ่ม Logic Life Deck ครับ

const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
const shuffleDeck = (deck) => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
};
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' fill='%23666' dy='.3em' text-anchor='middle'%3EUSER%3C/text%3E%3C/svg%3E";

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "ยืนยัน", confirmColor = "bg-red-600" }) => {
    // ... (Code เดิม) ...
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-6 whitespace-pre-line">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors">ยกเลิก</button>
                    <button onClick={onConfirm} className={`flex-1 py-3 rounded-xl font-bold transition-all ${confirmColor} text-white`}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
};
const ChatBubbleIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>);

const GameRoom = ({ roomID, userProfile, roomConfig, onLeaveRoom, userDecks, openDeckModal, initialDeck }) => {
    // States
    const [status, setStatus] = useState('waiting');
    const [countdown, setCountdown] = useState(null);
    const [myDeck, setMyDeck] = useState([]);
    const [myHand, setMyHand] = useState([]);
    const [myField, setMyField] = useState([]);
    const [myGraveyard, setMyGraveyard] = useState([]);
    
    // 🟢 เพิ่ม State สำหรับ Life Deck
    const [myLifeDeck, setMyLifeDeck] = useState([]);
    const [opponentLifeCount, setOpponentLifeCount] = useState(5); // Default 5

    const [opponentHandCount, setOpponentHandCount] = useState(0);
    const [opponentDeckCount, setOpponentDeckCount] = useState(0);
    const [opponentGraveyardCount, setOpponentGraveyardCount] = useState(0);
    
    const [players, setPlayers] = useState({ red: null, blue: null, spectators: 0 });
    const [mySlot, setMySlot] = useState('spectator');
    const [isReady, setIsReady] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState(initialDeck || null);

    // ... (Chat & UI States เหมือนเดิม) ...
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '' });
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const channelRef = useRef(null);
    const messagesEndRef = useRef(null);
    
    const safeUserProfile = { ...userProfile, picture: userProfile?.picture || PLACEHOLDER_IMG };

    useEffect(() => { if(initialDeck) setSelectedDeck(initialDeck); }, [initialDeck]);

    // ... (useEffect for Init & Presence เหมือนเดิม) ...
    useEffect(() => {
        const handleBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', handleBeforeUnload);
        const channel = supabase.channel(`room:${roomID}`, { config: { presence: { key: safeUserProfile.email } } });
        channel.on('presence', { event: 'sync' }, () => { const state = channel.presenceState(); updateRoomState(state); })
            .on('broadcast', { event: 'game_control' }, ({ payload }) => { if (payload.type === 'stop_game') { resetGame(); addSystemMessage(`🏁 ${payload.user} ได้ยุติเกม`); } })
            .on('broadcast', { event: 'game_move' }, ({ payload }) => {
                if (payload.player !== safeUserProfile.email) {
                    if (payload.type === 'draw') { setOpponentHandCount(p => p + 1); setOpponentDeckCount(p => Math.max(0, p - 1)); }
                    if (payload.type === 'play') setOpponentHandCount(p => Math.max(0, p - 1));
                    if (payload.type === 'setup_deck') {
                        setOpponentDeckCount(payload.deckCount);
                        setOpponentLifeCount(payload.lifeCount); // รับค่า Life คู่แข่ง
                    }
                }
            })
            .on('broadcast', { event: 'chat' }, ({ payload }) => { setMessages(p => [...p, payload]); if (!isChatOpen && !payload.isMe) setUnreadCount(p => p + 1); })
            .subscribe(async (status) => { if (status === 'SUBSCRIBED') { const role = roomConfig?.isHost ? 'red' : 'spectator'; setMySlot(role); const deckData = initialDeck ? { id: initialDeck.id, cover: initialDeck.coverImage || initialDeck.cover } : null; await trackMyPresence(channel, role, false, deckData); } });
        channelRef.current = channel;
        return () => { window.removeEventListener('beforeunload', handleBeforeUnload); if (channelRef.current) channelRef.current.unsubscribe(); };
    }, [roomID]);

    const initializeGameDeck = () => {
        if (!selectedDeck || !selectedDeck.main || selectedDeck.main.length === 0) {
            alert("เด็คไม่พร้อมใช้งาน");
            setStatus('waiting');
            return;
        }

        // Helper เตรียมการ์ด
        const prepareCard = (c, i) => ({
            ...c,
            uniqueId: `${c.id}-${i}-${Date.now()}`,
            image: c.imagePath ? `/cards/${encodePath(c.imagePath)}/${encodeURIComponent(c.id.replace(' - Only#1', ''))}.png` : null
        });

        // 1. Prepare Main Deck
        const playableMain = shuffleDeck(selectedDeck.main.map(prepareCard));
        const startingHand = playableMain.slice(0, 5);
        const remainingDeck = playableMain.slice(5);

        // 2. Prepare Life Deck (Shuffle ด้วย)
        const playableLife = shuffleDeck(selectedDeck.life.map(prepareCard));

        setMyHand(startingHand);
        setMyDeck(remainingDeck);
        setMyLifeDeck(playableLife); // 🟢 Set Life Deck
        setMyField([]);
        setMyGraveyard([]);

        // แจ้ง Setup
        channelRef.current.send({ 
            type: 'broadcast', event: 'game_move', 
            payload: { 
                type: 'setup_deck', 
                player: safeUserProfile.email, 
                deckCount: remainingDeck.length,
                lifeCount: playableLife.length // ส่งจำนวน Life ให้คู่แข่งรู้
            } 
        });

        // แจ้ง Draw
        for(let i=0; i<5; i++) {
             channelRef.current.send({ type: 'broadcast', event: 'game_move', payload: { type: 'draw', player: safeUserProfile.email } });
        }
    };

    const handleDrawCard = () => {
        if (myDeck.length === 0) return;
        const card = myDeck[0];
        setMyHand(prev => [...prev, card]);
        setMyDeck(prev => prev.slice(1));
        channelRef.current.send({ type: 'broadcast', event: 'game_move', payload: { type: 'draw', player: safeUserProfile.email } });
    };

    const handlePlayCard = (card) => {
        setMyHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
        setMyField(prev => [...prev, card]); 
        channelRef.current.send({ type: 'broadcast', event: 'game_move', payload: { type: 'play', player: safeUserProfile.email } });
    };

    const resetGame = () => {
        setStatus('waiting');
        setIsReady(false);
        setCountdown(null);
        setMyHand([]);
        setMyDeck([]);
        setMyField([]);
        setMyGraveyard([]);
        setMyLifeDeck([]); // Reset Life
        setOpponentHandCount(0);
        setOpponentDeckCount(0);
        setOpponentLifeCount(5); // Reset Opp Life
        const deckData = selectedDeck ? { id: selectedDeck.id, cover: selectedDeck.coverImage || selectedDeck.cover } : null;
        trackMyPresence(channelRef.current, mySlot, false, deckData);
    };

    // ... (Functions อื่นๆ เหมือนเดิม: trackMyPresence, updateRoomState, handleToggleReady, etc.) ...
    // เพื่อความกระชับ ขอละไว้ ให้ใช้ของเดิมจากไฟล์ก่อนหน้าได้เลยครับ เพราะ Logic ไม่เปลี่ยน
    const trackMyPresence = async (channel, slot, ready, deck) => { if (!channel) return; await channel.track({ user: safeUserProfile, slot: slot, isReady: ready, deck: deck, onlineAt: new Date().toISOString(), ...(slot === 'red' ? { isHost: true, roomConfig: roomConfig || { name: roomID } } : {}) }); };
    const updateRoomState = (presenceState) => { let redPlayer = null, bluePlayer = null, allUsers = []; Object.values(presenceState).forEach(users => { users.forEach(u => { allUsers.push(u); if (u.slot === 'red') redPlayer = u; else if (u.slot === 'blue') bluePlayer = u; }); }); if (!redPlayer) { let nextHost = null; if(bluePlayer) nextHost = bluePlayer; else { const specs = allUsers.filter(u => u.slot === 'spectator').sort((a,b)=> new Date(a.onlineAt) - new Date(b.onlineAt)); if(specs.length > 0) nextHost = specs[0]; } if(nextHost && nextHost.user.email === safeUserProfile.email) { setMySlot('red'); trackMyPresence(channelRef.current, 'red', isReady, selectedDeck ? { id: selectedDeck.id, cover: selectedDeck.coverImage || selectedDeck.cover } : null); return; } } if(!bluePlayer && mySlot === 'spectator' && redPlayer && redPlayer.user.email !== safeUserProfile.email) { setMySlot('blue'); trackMyPresence(channelRef.current, 'blue', false, selectedDeck ? { id: selectedDeck.id, cover: selectedDeck.coverImage || selectedDeck.cover } : null); return; } setPlayers({ red: redPlayer ? { ...redPlayer.user, isReady: redPlayer.isReady, deckCover: redPlayer.deck?.cover } : null, blue: bluePlayer ? { ...bluePlayer.user, isReady: bluePlayer.isReady, deckCover: bluePlayer.deck?.cover } : null, spectators: allUsers.filter(u => u.slot === 'spectator').length }); if (redPlayer?.isReady && bluePlayer?.isReady && status === 'waiting') startCountdown(); };
    const handleToggleReady = () => { if (!selectedDeck) return alert("กรุณาเลือก Deck ก่อน!"); const newReady = !isReady; setIsReady(newReady); trackMyPresence(channelRef.current, mySlot, newReady, { id: selectedDeck.id, cover: selectedDeck.coverImage || selectedDeck.cover }); };
    const handleSelectDeck = () => { openDeckModal((deck) => { setSelectedDeck(deck); trackMyPresence(channelRef.current, mySlot, isReady, { id: deck.id, cover: deck.coverImage || null }); }); };
    const startCountdown = () => { setStatus('countdown'); let count = 5; setCountdown(count); const timer = setInterval(() => { count--; setCountdown(count); if (count <= 0) { clearInterval(timer); setStatus('playing'); setCountdown(null); initializeGameDeck(); } }, 1000); };
    const handleStopGame = async () => { await channelRef.current.send({ type: 'broadcast', event: 'game_control', payload: { type: 'stop_game', user: safeUserProfile.name } }); setModalConfig({ isOpen: false }); };
    const handleExitRoom = () => { setModalConfig({ isOpen: false }); onLeaveRoom(); };
    const toggleChat = () => { setIsChatOpen(prev => { if(!prev) setUnreadCount(0); return !prev; }); };
    const addSystemMessage = (text) => setMessages((prev) => [...prev, { system: true, text }]);
    const sendMessage = async () => { if (!newMessage.trim()) return; const msg = { user: safeUserProfile.name, avatar: safeUserProfile.picture, text: newMessage, isMe: false }; await channelRef.current.send({ type: 'broadcast', event: 'chat', payload: msg }); setMessages(prev => [...prev, { ...msg, isMe: true }]); setNewMessage(''); };
    useEffect(() => { if (isChatOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isChatOpen]);

    return (
        <div className="flex w-full h-full overflow-hidden bg-slate-950 relative">
            {/* ... Modal ... */}
            <ConfirmationModal isOpen={modalConfig.isOpen} title={modalConfig.type === 'stop' ? "🏳️ ยุติการแข่ง?" : "🚪 ยืนยันการออกห้อง?"} message={modalConfig.type === 'stop' ? "กลับสู่หน้าเตรียมพร้อม?" : "ออกจากห้อง?"} confirmText={modalConfig.type === 'stop' ? "ยุติเกม" : "ออกห้อง"} confirmColor={modalConfig.type === 'stop' ? "bg-amber-600" : "bg-red-600"} onCancel={() => setModalConfig({ isOpen: false })} onConfirm={modalConfig.type === 'stop' ? handleStopGame : handleExitRoom} />

            <div className={`flex-grow relative p-0 overflow-hidden flex flex-col w-full transition-all duration-300 ${isChatOpen ? 'pr-80' : ''}`}>
                <div className="absolute top-4 left-4 z-40 flex gap-2">
                     <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-xs flex items-center gap-3 text-white shadow-lg">
                        <span className="text-slate-300">Room: <span className="font-bold text-white">{roomID}</span></span>
                        {players.red && <span className="text-[10px] bg-red-900/50 px-2 rounded text-red-300 border border-red-800">Host: {players.red.name}</span>}
                    </div>
                    {status === 'playing' ? ( <button onClick={() => setModalConfig({ isOpen: true, type: 'stop' })} className="bg-amber-600/90 hover:bg-amber-500 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur shadow-lg border border-amber-400/30 flex items-center gap-2">🏳️ STOP</button> ) : ( <button onClick={() => setModalConfig({ isOpen: true, type: 'exit' })} className="bg-red-600/90 hover:bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur shadow-lg border border-red-400/30 flex items-center gap-2"><CloseIcon className="w-3 h-3"/> EXIT</button> )}
                </div>

                <div className="absolute top-4 right-4 z-50">
                    <button onClick={toggleChat} className={`relative p-3 rounded-full shadow-lg border backdrop-blur transition-all active:scale-95 ${isChatOpen ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800/80 text-slate-300 border-slate-600 hover:bg-slate-700'}`}> {isChatOpen ? <CloseIcon className="w-6 h-6" /> : <ChatBubbleIcon className="w-6 h-6" />} {!isChatOpen && unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900 animate-bounce min-w-[20px] text-center">{unreadCount > 99 ? '99+' : unreadCount}</span>} </button>
                </div>

                <div className="relative w-full h-full">
                    {status === 'waiting' || status === 'countdown' ? (
                        <PreStartLobby players={players} myRole={mySlot} onSelectDeck={handleSelectDeck} onToggleReady={handleToggleReady} isReady={isReady} countdown={countdown} />
                    ) : (
                        // 🟢 ส่งข้อมูล Life Deck เข้าไป
                        <Battlefield 
                            myHand={myHand}
                            myField={myField}
                            myDeckCount={myDeck.length}
                            myGraveyard={myGraveyard}
                            myLifeCount={myLifeDeck.length} // ส่งจำนวน Life
                            
                            opponentHandCount={opponentHandCount}
                            opponentDeckCount={opponentDeckCount}
                            opponentGraveyardCount={opponentGraveyardCount}
                            opponentLifeCount={opponentLifeCount} // ส่งจำนวน Life คู่แข่ง
                            
                            onDrawCard={handleDrawCard}
                            onPlayCard={handlePlayCard}
                        />
                    )}
                </div>
            </div>

            {/* Chat Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl z-[60] transition-transform duration-300 ease-in-out transform ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                 <div className="flex flex-col h-full">
                    <div className="p-4 bg-slate-800/80 border-b border-slate-700 text-white font-bold text-sm uppercase tracking-wider flex justify-between items-center shrink-0"> <span className="flex items-center gap-2"><ChatBubbleIcon className="w-4 h-4 text-purple-400"/> Live Chat</span> <span className="bg-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300">{players.spectators + (players.red ? 1 : 0) + (players.blue ? 1 : 0)} Online</span> </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700"> {messages.length === 0 && <div className="text-center text-slate-500 text-xs mt-10 opacity-50">เริ่มการสนทนา...</div>} {messages.map((msg, idx) => ( msg.system ? <div key={idx} className="text-center text-[10px] text-slate-500 my-2 bg-white/5 py-1 rounded mx-4">{msg.text}</div> : <div key={idx} className={`flex gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}> <img src={msg.avatar} className="w-8 h-8 rounded-full bg-slate-700 object-cover border border-slate-600" /> <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs break-words ${msg.isMe ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'}`}> <span className="block text-[9px] font-bold mb-0.5 opacity-70">{msg.user}</span> {msg.text} </div> </div> ))} <div ref={messagesEndRef} /> </div>
                    <div className="p-3 bg-slate-800/80 border-t border-slate-700 shrink-0 flex gap-2"> <input className="flex-grow bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-purple-500" placeholder="Message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} /> <button onClick={sendMessage} disabled={!newMessage.trim()} className="p-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 text-white rounded-xl transition-all shadow-lg active:scale-95"><SendIcon className="w-4 h-4" /></button> </div>
                 </div>
            </div>
        </div>
    );
};

export default GameRoom;