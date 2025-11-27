import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from "react-dom";
import { db } from './firebase';
import { 
  collection, getDocs, query, orderBy, doc, deleteDoc, limit, startAfter, getDoc,
  updateDoc, increment, arrayUnion, arrayRemove, addDoc, onSnapshot, serverTimestamp,
  writeBatch, where
} from 'firebase/firestore';
import { supabase } from './supabaseClient'; 
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { googleLogout } from '@react-oauth/google'; 
import NotificationCenter from './NotificationCenter'; 
import ChatWidget from './ChatWidget';

// --- Imported Components ---
import SettingsDrawer from './components/SettingsDrawer';
import ProfileSetupModal from './components/ProfileSetupModal';
import RatingBadge from './components/RatingBadge';
import DeckListModal from './components/DeckListModal';
import { 
    MenuIcon, ShoppingBagIcon, CloseIcon, 
    SunIcon, MoonIcon, MessageIcon, StoreIcon, HomeIcon, 
    UsersIcon, ClearIcon, HeartIcon, CameraIcon, 
    PencilIcon, ReplyIcon, TrashIcon, MoreVertIcon, EyeIcon,
    CopyIcon, ImportIcon, UploadIcon
} from './components/Icons';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// === Helper Functions ===
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
// 🟢 Helper สำหรับดึงรูป (แก้ปัญหา CARD_BASE_URL)
const getCardImageUrl = (cardImagePath, cardId) => {
    if (!cardImagePath || !cardId) return '';
    const fileId = cardId.replace(' - Only#1', '');
    return `/cards/${encodePath(cardImagePath)}/${encodeURIComponent(fileId)}.png`;
};

// === Local UI Components ===
const Button = ({ className = "", children, ...props }) => ( 
  <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 dark:hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`} {...props}> 
    {children} 
  </button> 
);

const CardShell = ({ children, className = "", ...props }) => ( 
  <div className={`bg-white dark:bg-slate-900/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-lg transition-all hover:border-amber-400/50 hover:shadow-amber-500/10 ${className}`} {...props}> 
    {children} 
  </div> 
);

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", confirmIcon = <ClearIcon/>, maxWidth = 'max-w-md' }) => { 
  if (!isOpen) return null; 
  return createPortal( 
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[400] p-4"> 
      <div className={`bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full m-4 ${maxWidth}`}> 
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2> 
        <div className="text-slate-700 dark:text-gray-300 mb-6">{children}</div> 
        <div className="flex justify-end gap-3"> 
          <Button onClick={onClose} className="bg-slate-200 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-slate-600">{onConfirm ? "Cancel" : "Close"}</Button> 
          {onConfirm && ( <Button onClick={onConfirm} className="bg-red-200 dark:bg-red-900/50 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-300 dark:hover:bg-red-800/50 dark:hover:text-white"> {confirmIcon} {confirmText} </Button> )} 
        </div> 
      </div> 
    </div>, document.body 
  ); 
};

// === Local Logic / Utils ===
function useLocalStorage(key, initial) { 
    const [v, s] = useState(() => { 
        try { 
            const raw = localStorage.getItem(key); 
            return raw ? JSON.parse(raw) : initial; 
        } catch { return initial; } 
    }); 
    useEffect(() => { 
        try { localStorage.setItem(key, JSON.stringify(v)); } catch {} 
    }, [key, v]); 
    return [v, s]; 
}

const nameKey = (n) => (n || "").trim().toLowerCase();
const encodeDeckCode = (mainDeck, lifeDeck) => { try { return btoa(JSON.stringify({ m: mainDeck.map(c=>c.id), l: lifeDeck.map(c=>c.id) })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); } catch { return ""; } };
function countBy(arr, keyFn) { return arr.reduce((m, x) => { const k = keyFn(x); m[k] = (m[k] || 0) + 1; return m; }, {}); }
const avg = (arr) => { const valid = arr.filter(n => typeof n === 'number' && !isNaN(n)); return valid.length ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2) : '0.00'; };

// === Feedback Modal ===
const FeedbackModal = ({ isOpen, onClose, userProfile, showAlert }) => {
    const [text, setText] = useState("");
    const [type, setType] = useState("suggestion");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    if (!isOpen) return null;
  
    const handleSubmit = async () => {
      if (!text.trim()) return showAlert("ข้อความว่างเปล่า", "กรุณากรอกข้อความก่อนส่งครับ");
      
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, "feedbacks"), {
          text: text.trim(),
          type: type,
          user: userProfile ? { 
            name: userProfile.name, 
            email: userProfile.email, 
            uid: userProfile.email 
          } : "Anonymous",
          createdAt: serverTimestamp(),
          status: "new",
          version: "1.0"
        });
        
        showAlert("ขอบคุณครับ! 🙏", "เราได้รับข้อมูลของท่านแล้ว ทีมงานจะนำไปปรับปรุงให้ดียิ่งขึ้น");
        setText("");
        onClose();
      } catch (e) {
        console.error("Feedback error: ", e);
        showAlert("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้ โปรดลองใหม่ภายหลัง");
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return createPortal(
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[650] p-4">
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageIcon /> ติดต่อผู้พัฒนา / แจ้งปัญหา
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">หัวข้อเรื่อง</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="suggestion">💡 เสนอแนะ / ฟีดแบค</option>
                <option value="bug">🐛 แจ้งบั๊ก / ปัญหาการใช้งาน</option>
                <option value="other">💬 อื่นๆ</option>
              </select>
            </div>
  
            <div>
              <label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">รายละเอียด</label>
              <textarea
                rows="4"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="เล่าให้เราฟังหน่อยครับ..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>
          </div>
  
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              onClick={onClose} 
              className="bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-emerald-600 text-white hover:bg-emerald-500 border-none shadow-lg"
            >
              {isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}
            </Button>
          </div>
        </div>
      </div>,
      document.body
    );
};

// === Comment System ===
function CommentItem({ comment, replies, userProfile, deckOwnerEmail, onReply, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(comment.text);
  const [isReplying, setIsReplying] = useState(false);
  const [replyVal, setReplyVal] = useState('');
  const canDelete = userProfile && (userProfile.email === comment.userId || userProfile.email === deckOwnerEmail);
  const canEdit = userProfile && userProfile.email === comment.userId;
  const formatTime = (t) => t ? t.toDate().toLocaleString('th-TH', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : 'Just now';
  const handleSendReply = (e) => { e.preventDefault(); if(replyVal.trim()){ onReply(comment.id, replyVal); setIsReplying(false); setReplyVal(''); } };
  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      <div className="flex gap-3">
        <img src={comment.userPicture} alt={comment.userName} className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 mt-1 shrink-0 object-cover" />
        <div className="flex flex-col flex-grow min-w-0">
          <div className="bg-slate-200 dark:bg-slate-800/80 rounded-2xl rounded-tl-none px-4 py-2 border border-slate-300 dark:border-slate-700/50 relative">
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="font-bold text-sm text-emerald-700 dark:text-emerald-100">{comment.userName}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-500">{formatTime(comment.createdAt)}</span>
            </div>
            {isEditing ? (
              <div className="mt-1">
                <input autoFocus className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm rounded px-2 py-1 border border-emerald-500 outline-none" value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && (onEdit(comment.id, editVal), setIsEditing(false))} />
                <div className="flex gap-2 mt-2 text-xs"><span onClick={() => {onEdit(comment.id, editVal); setIsEditing(false)}} className="text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline">บันทึก</span><span onClick={() => setIsEditing(false)} className="text-slate-500 dark:text-slate-400 cursor-pointer hover:underline">ยกเลิก</span></div>
              </div>
            ) : <p className="text-sm text-slate-800 dark:text-gray-200 break-words leading-relaxed whitespace-pre-wrap">{comment.text}</p>}
          </div>
          <div className="flex gap-3 mt-1 ml-2 text-[11px] text-slate-500 dark:text-slate-400 select-none">
            {userProfile && <span onClick={() => setIsReplying(!isReplying)} className="cursor-pointer hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"><ReplyIcon/> ตอบกลับ</span>}
            {canEdit && !isEditing && <span onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-amber-600 dark:hover:text-amber-300 flex items-center gap-1 transition-colors"><PencilIcon/> แก้ไข</span>}
            {canDelete && <span onClick={() => onDelete(comment.id)} className="cursor-pointer hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"><TrashIcon/> ลบ</span>}
          </div>
          {isReplying && (
            <form onSubmit={handleSendReply} className="mt-2 flex gap-2 animate-fade-in">
              <img src={userProfile.picture} className="w-6 h-6 rounded-full opacity-50" />
              <div className="flex-grow relative">
                <input autoFocus placeholder={`ตอบกลับ ${comment.userName}...`} className="w-full bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm rounded-full px-3 py-1.5 border border-slate-300 dark:border-slate-600 focus:border-emerald-500 outline-none transition-all" value={replyVal} onChange={e => setReplyVal(e.target.value)} />
                <button type="submit" disabled={!replyVal.trim()} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-emerald-600 dark:text-emerald-400 hover:text-black dark:hover:text-white disabled:opacity-0 transition-opacity"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
              </div>
            </form>
          )}
        </div>
      </div>
      {replies && replies.length > 0 && (
        <div className="ml-8 border-l-2 border-slate-300 dark:border-slate-700/50 pl-3 flex flex-col gap-2">
          {replies.map(r => <CommentItem key={r.id} comment={r} replies={[]} userProfile={userProfile} deckOwnerEmail={deckOwnerEmail} onReply={onReply} onEdit={onEdit} onDelete={onDelete} />)}
        </div>
      )}
    </div>
  );
}

function CommentSection({ deckId, userProfile, showAlert, deckOwnerEmail }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const endRef = useRef(null);
  useEffect(() => {
    const q = query(collection(db, "publicDecks", deckId, "comments"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => { setComments(snap.docs.map(d => ({ id: d.id, ...d.data() }))); });
    return () => unsub();
  }, [deckId]);
  useEffect(() => { if(comments.length > 0) endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [comments.length]);
  const handleAdd = async (text, parentId = null) => {
    if (!userProfile) return showAlert("กรุณาเข้าสู่ระบบ", "Login ก่อนนะครับ");
    try { await addDoc(collection(db, "publicDecks", deckId, "comments"), { text: text.trim(), userId: userProfile.email, userName: userProfile.name, userPicture: userProfile.picture, createdAt: serverTimestamp(), parentId }); if (!parentId) setNewComment(''); } catch (e) { console.error(e); showAlert("Error", "ส่งคอมเม้นท์ไม่สำเร็จ"); }
  };
  const handleEdit = async (id, txt) => { try { await updateDoc(doc(db, "publicDecks", deckId, "comments", id), { text: txt }); } catch (e) { console.error(e); } };
  const handleDelete = async (id) => { if(window.confirm("ยืนยันการลบ?")) try { await deleteDoc(doc(db, "publicDecks", deckId, "comments", id)); } catch (e) { showAlert("Error", "ลบไม่สำเร็จ"); } };
  const rootComments = comments.filter(c => !c.parentId);
  const getReplies = (pid) => comments.filter(c => c.parentId === pid);
  return (
    <div className="flex flex-col h-full border-l border-slate-200 dark:border-emerald-500/20 bg-slate-100/50 dark:bg-black/40">
      <div className="p-4 border-b border-slate-200 dark:border-emerald-500/20 bg-white/50 dark:bg-slate-900/80 backdrop-blur"><h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><span className="text-emerald-600 dark:text-emerald-400">💬</span> ความคิดเห็น ({comments.length})</h3></div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-700">
        {rootComments.length === 0 ? (<div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2"><span className="text-4xl opacity-30">💭</span><p className="text-sm">ยังไม่มีใครคุยกันเลย...</p></div>) : rootComments.map(c => (<CommentItem key={c.id} comment={c} replies={getReplies(c.id)} userProfile={userProfile} deckOwnerEmail={deckOwnerEmail} onReply={(pid, txt) => handleAdd(txt, pid)} onEdit={handleEdit} onDelete={handleDelete} />))}
        <div ref={endRef} />
      </div>
      <form onSubmit={(e)=>{e.preventDefault(); handleAdd(newComment)}} className="p-3 border-t border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-slate-900">
        <div className="relative flex items-center gap-2">
          {userProfile ? <img src={userProfile.picture} className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700" />}
          <input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder={userProfile?"แสดงความคิดเห็น...":"กรุณาเข้าสู่ระบบ"} disabled={!userProfile} className="flex-grow bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm rounded-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 focus:border-emerald-500 outline-none transition-all" />
          <button type="submit" disabled={!newComment.trim()} className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-lg active:scale-95"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
        </div>
      </form>
    </div>
  );
}

// =================================================================
// 📱 DeckViewModal - Redesigned (Tab System)
// =================================================================
function DeckViewModal({ isOpen, onClose, deck, showAlert, isLoading, onTakePhoto, isCapturing, userProfile, onClone }) {
  const [activeTab, setActiveTab] = useState("deck"); // 'deck' | 'comments'

  // Reset tab เมื่อเปิดใหม่
  useEffect(() => {
    if (isOpen) setActiveTab("deck");
  }, [isOpen]);

  const analysis = useMemo(() => {
    if (isLoading || !deck || !deck.main || deck.main.length === 0) return null;
    const main = (deck.main || []).filter(Boolean);
    const life = (deck.life || []).filter(Boolean);
    const only1 = main.find(c => c.onlyRank === 1);
    const typeOrder = { 'Avatar': 1, 'Magic': 2, 'Construction': 3 };
    const sortFn = (a, b) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99) || a.name.localeCompare(b.name, 'th');
    return { 
      avgCost: avg(main.map(c => c.cost)), avgPower: avg(main.map(c => c.power)), avgGem: avg(main.map(c => c.gem)),
      cardTypes: Object.entries(countBy(main, c => c.type)), deckCode: encodeDeckCode(main, life),
      only1, avatars: main.filter(c => c.type === 'Avatar' && c.onlyRank !== 1).sort(sortFn),
      magics: main.filter(c => c.type === 'Magic').sort(sortFn),
      constructs: main.filter(c => c.type === 'Construction').sort(sortFn),
      others: main.filter(c => c.onlyRank !== 1 && !['Avatar', 'Magic', 'Construction'].includes(c.type)).sort(sortFn), life 
    };
  }, [deck, isLoading]);

  if (!isOpen) return null;

  const handleCopyCode = () => { 
    if (analysis?.deckCode) { 
        navigator.clipboard.writeText(analysis.deckCode)
        .then(()=>showAlert("Success!", `✅ คัดลอกรหัสเด็คแล้ว!`))
        .catch(()=>showAlert("Error", "ไม่สามารถคัดลอกรหัสเด็คได้")); 
    } 
  };

  const renderCardSection = (title, cards) => {
    if (!cards || cards.length === 0) return null;
    const groupedCards = cards.reduce((acc, card) => { const existing = acc.find(item => item.card.id === card.id); if (existing) { existing.count++; } else { acc.push({ card, count: 1 }); } return acc; }, []);
    return (
      <div className="mt-4">
        <h4 className="text-base md:text-lg font-bold text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/20 pb-1 mb-2">{title} ({cards.length})</h4>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] gap-2 justify-center">
          {groupedCards.map(({ card, count }) => (
            <div key={card.id} className="relative w-20 md:w-24 group">
              {/* 🟢 [FIXED] Use getCardImageUrl instead of CARD_BASE_URL */}
              <img src={`/cards/${encodePath(card.imagePath)}/${encodeURIComponent(card.id.replace(' - Only#1', ''))}.png`} className="w-full rounded-md shadow-md" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
              {count > 1 && ( <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-sm">{count}</div> )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[200] p-0 md:p-4">
      <div className="bg-white dark:bg-slate-900 border-0 md:border border-slate-300 dark:border-emerald-500/30 rounded-none md:rounded-xl shadow-2xl w-full h-full flex flex-col max-w-[95vw] max-h-[100vh] md:max-h-[90vh] overflow-hidden">
        
        {/* === 1. Header: Title & Close Button === */}
        <header className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
          <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white truncate pr-2 flex-1">
            {isLoading ? "กำลังโหลด..." : deck?.deckName}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors">
            <CloseIcon />
          </button>
        </header>

        {/* === 2. Tabs Navigation === */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 shrink-0">
          <button 
            onClick={() => setActiveTab("deck")}
            className={`flex-1 py-3 text-sm md:text-base font-bold transition-colors relative ${activeTab === "deck" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            🔍 ดูการ์ด & สถิติ
            {activeTab === "deck" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500"></div>}
          </button>
          <button 
            onClick={() => setActiveTab("comments")}
            className={`flex-1 py-3 text-sm md:text-base font-bold transition-colors relative ${activeTab === "comments" ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            💬 ความคิดเห็น
            {activeTab === "comments" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>}
          </button>
        </div>

        {/* === 3. Content Area === */}
        <div className="flex-grow overflow-hidden relative bg-slate-50 dark:bg-black/20">
          
          {/* --- Tab 1: Deck View --- */}
          {activeTab === "deck" && (
            <div className="h-full flex flex-col">
              {isLoading || !analysis ? (
                <div className="flex-grow flex items-center justify-center"><p className="text-slate-500">กำลังโหลด...</p></div>
              ) : (
                <>
                  <div className="flex-grow overflow-y-auto p-4 pb-24 scrollbar-hide">
                    
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 mb-6 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                         <div className="text-center"><span className="text-[10px] text-gray-500 uppercase">Avg Cost</span><p className="text-lg font-bold text-emerald-500">{analysis.avgCost}</p></div>
                         <div className="text-center border-l border-slate-200 dark:border-slate-600"><span className="text-[10px] text-gray-500 uppercase">Avg Power</span><p className="text-lg font-bold text-red-500">{analysis.avgPower}</p></div>
                         <div className="text-center border-l border-slate-200 dark:border-slate-600"><span className="text-[10px] text-gray-500 uppercase">Avg Gem</span><p className="text-lg font-bold text-amber-500">{analysis.avgGem}</p></div>
                    </div>

                    {/* Only #1 */}
                    {analysis.only1 && (
                        <div className="mb-6 flex justify-center">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-lg blur opacity-30"></div>
                                {/* 🟢 [FIXED] Use getCardImageUrl */}
                                <img src={`/cards/${encodePath(analysis.only1.imagePath)}/${encodeURIComponent(analysis.only1.id.replace(' - Only#1', ''))}.png`} className="relative w-32 rounded-lg shadow-xl border-2 border-amber-400/50" />
                                <div className="absolute top-2 right-2 bg-black/70 text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-400/50 backdrop-blur-sm font-bold">Only #1</div>
                            </div>
                        </div>
                    )}

                    {/* Cards Grid */}
                    <div className="space-y-2">
                        {renderCardSection("Avatar", analysis.avatars)}
                        {renderCardSection("Magic", analysis.magics)}
                        {renderCardSection("Construct", analysis.constructs)}
                        {renderCardSection("Other", analysis.others)}
                        {renderCardSection("Life Deck", analysis.life)}
                    </div>
                  </div>

                  {/* 🟢 Action Bar (Sticky Bottom) */}
                  <div className="absolute bottom-0 left-0 w-full p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-emerald-500/20 flex gap-2 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                    <Button onClick={()=>onTakePhoto(deck, analysis)} disabled={isCapturing} className="flex-1 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 py-3 rounded-lg text-xs flex-col gap-1 h-auto">
                        <CameraIcon /> <span>รูปภาพ</span>
                    </Button>
                    <Button onClick={handleCopyCode} className="flex-1 bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 py-3 rounded-lg text-xs flex-col gap-1 h-auto">
                        <CopyIcon /> <span>คัดลอก</span>
                    </Button>
                    {onClone && (
                        <Button onClick={() => onClone(deck)} className="flex-1 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800 py-3 rounded-lg text-xs flex-col gap-1 h-auto">
                            <ImportIcon /> <span>โคลน</span>
                        </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* --- Tab 2: Comments View --- */}
          {activeTab === "comments" && (
            <div className="h-full">
              <CommentSection deckId={deck.id} userProfile={userProfile} showAlert={showAlert} deckOwnerEmail={deck.user.email} />
            </div>
          )}

        </div>
      </div>
    </div>, 
    document.body
  );
}

const DeckImageTemplate = React.forwardRef(({ deck, analysis }, ref) => {
  const renderGrid = (title, cards) => {
    if (!cards?.length) return null;
    const grouped = cards.reduce((acc, c) => { const x = acc.find(i => i.c.id === c.id); x ? x.count++ : acc.push({ c, count: 1 }); return acc; }, []);
    return (<div className="mt-4"><h4 className="text-xl font-semibold text-emerald-300 border-b border-emerald-400/20 pb-1 mb-2">{title} ({cards.length})</h4><div className="flex flex-wrap gap-3">{grouped.map(({c, count}) => (<div key={c.id} className="w-32 relative"><img src={`/cards/${encodePath(c.imagePath)}/${encodeURIComponent(c.id.replace(' - Only#1',''))}.png`} className="w-full rounded-md shadow" onError={e=>e.target.src=e.target.src.replace('.png','.jpg')} />{count > 1 && <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500 text-white text-base font-bold rounded-bl-lg border-b-2 border-l-2 border-slate-800">{count}</div>}</div>))}</div></div>);
  };
  return (
    <div ref={ref} className="image-render-target">
      <div className="flex flex-col w-[360px] shrink-0">
        <h2 className="text-3xl font-bold text-white mb-6 border-b border-emerald-500/30 pb-2">{deck.deckName}</h2>
        <div className="flex-grow flex flex-col gap-6">
          <div><h3 className="text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3">สถิติเด็ค</h3><div className="grid grid-cols-3 gap-4 text-center"><div><span className="text-sm text-gray-400">Avg Cost</span><p className="text-2xl font-bold text-emerald-400">{analysis.avgCost}</p></div><div><span className="text-sm text-gray-400">Avg Power</span><p className="text-2xl font-bold text-red-400">{analysis.avgPower}</p></div><div><span className="text-sm text-gray-400">Avg Gem</span><p className="text-2xl font-bold text-amber-400">{analysis.avgGem}</p></div></div></div>
          <div><h3 className="text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3">ประเภทการ์ด</h3><ul className="space-y-1 text-sm">{analysis.cardTypes.map(([t, c]) => <li key={t} className="flex justify-between"><span>{t}</span><span>{c}</span></li>)}</ul></div>
        </div>
        <p className="text-gray-400 text-sm mt-auto pt-4 border-t border-emerald-500/30">Generated by Battle Of Talingchan Deck Builder</p>
      </div>
      <div className="flex-grow pr-2">
        {analysis.only1 && <div className="mb-4 flex flex-col items-center"><h4 className="text-xl font-semibold text-emerald-300 mb-2">Only #1</h4><div className="relative w-40"><img src={`/cards/${encodePath(analysis.only1.imagePath)}/${encodeURIComponent(analysis.only1.id.replace(' - Only#1',''))}.png`} className="w-full rounded-md shadow" onError={e=>e.target.src=e.target.src.replace('.png','.jpg')} /></div></div>}
        {renderGrid("Avatar Cards", analysis.avatars)}{renderGrid("Magic Cards", analysis.magics)}{renderGrid("Construct Cards", analysis.constructs)}{renderGrid("Other Cards", analysis.others)}{renderGrid("Life Deck", analysis.life)}
      </div>
    </div>
  );
});

function DeckCard({ deck, onViewDeck, userProfile, onDeleteDeck, isDetailLoading, onLikeDeck, isLiking }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // 🟢 [1] เพิ่ม Ref สำหรับจับเวลา Double Tap เอง
  const lastTapRef = useRef(0);

  const mainCardImg = useMemo(() => {
    if (!deck.only1CardData) return 'https://placehold.co/300x420/1e293b/94a3b8?text=Deck';
    return `/cards/${encodePath(deck.only1CardData.imagePath)}/${encodeURIComponent(deck.only1CardData.id.replace(' - Only#1', ''))}.png`;
  }, [deck.only1CardData]);

  const isOwner = userProfile && userProfile.email === deck.user.email;
  const isLiked = userProfile && (deck.likedBy || []).includes(userProfile.email);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🟢 [2] ฟังก์ชันจัดการ Double Tap แบบ Manual (ใช้ได้ทั้งมือถือและคอม)
  const handleCardClick = (e) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // ระยะเวลา (ms) ที่ถือว่าเป็น double tap (0.3 วินาที)
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      e.preventDefault();
      onViewDeck(deck); // เรียกฟังก์ชันเปิดเด็ค
    }
    
    lastTapRef.current = now;
  };

  return (
    <div 
      className="relative group select-none cursor-pointer" // select-none กันการไฮไลท์ข้อความเวลากดรัวๆ
      onClick={handleCardClick} // 🟢 [3] ใช้ onClick แทน onDoubleClick
    >
      <CardShell className="flex flex-col p-2 md:p-3 h-full relative hover:border-amber-400/50 transition-all">
        
        {/* Header: User & 3-Dot Menu */}
        <div className="flex justify-between items-start mb-2 relative z-20">
          <div className="flex items-center gap-2 overflow-hidden pr-6">
            
            {/* 🟢 [FIXED] Display User Info Safely */}
            {deck.user && deck.user.picture ? (
                <img 
                  src={deck.user.picture} 
                  alt={deck.user.name} 
                  className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 object-cover shrink-0" 
                  loading="lazy" 
                />
            ) : (
                <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-[10px]">?</div>
            )}
            
            <p className="font-semibold text-[10px] md:text-xs text-slate-700 dark:text-slate-300 truncate">
              {deck.user ? deck.user.name : 'Unknown User'}
            </p>
          </div>
          {isOwner && (
            <div ref={menuRef} className="absolute top-[-4px] right-[-4px]">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <MoreVertIcon />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-fade-in">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteDeck(deck); }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <TrashIcon /> ลบเด็ค
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Image (กด 2 ทีได้) */}
        <div className="aspect-[5/7] w-full rounded mb-2 overflow-hidden bg-slate-200 dark:bg-slate-800 relative shadow-inner">
          <img 
            src={mainCardImg} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            loading="lazy"
          />
          {/* Overlay บอกว่า Double Tap ได้ */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
            <span className="text-white text-[10px] bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">Double Tap</span>
          </div>
        </div>

        {/* Deck Name */}
        <h3 className="text-xs md:text-sm font-bold text-amber-600 dark:text-amber-400 mb-2 line-clamp-1 leading-tight">
          {deck.deckName}
        </h3>

        {/* Stats Row */}
        <div className="flex items-center justify-between gap-1 mb-2 text-[10px] text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
             <button 
               onClick={(e) => { e.stopPropagation(); onLikeDeck(deck); }} 
               disabled={!userProfile || isLiking} 
               className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${isLiked ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
             >
               <div className="scale-75"><HeartIcon filled={isLiked} /></div>
               <span>{deck.likeCount || 0}</span>
             </button>
          </div>
          <span className="flex items-center gap-1">
            <div className="scale-75"><EyeIcon /></div> {deck.viewCount || 0}
          </span>
        </div>

        {/* View Button Only */}
        <Button 
          onClick={(e) => { e.stopPropagation(); onViewDeck(deck); }} 
          className="w-full py-1 text-[10px] md:text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 mt-auto h-7 md:h-8" 
          disabled={isDetailLoading}
        >
          {isDetailLoading ? "..." : "View Detail"}
        </Button>

      </CardShell>
    </div>
  );
}

function DeckCardSkeleton() { return (<CardShell className="flex flex-col animate-pulse"><div className="flex justify-between mb-3"><div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700"></div><div className="h-4 w-24 bg-slate-300 dark:bg-slate-700 rounded"></div></div><div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-700 rounded mb-3"></div><div className="aspect-[5/7] w-full rounded-lg mb-4 bg-slate-300 dark:bg-slate-700"></div><div className="h-10 w-full bg-slate-300 dark:bg-slate-700 rounded-lg"></div></CardShell>); }

// === Main PublicDecks Component ===
export default function PublicDecks() {
  const navigate = useNavigate();
  const location = useLocation(); // 🟢 1. เพิ่ม location

  // 🟢 2. Logic ตรวจ In-App Browser (วางไว้บนสุด)
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = /(Line|FBAN|FBAV|Instagram|Messenger)/i.test(ua);
    
    if (isInApp) {
      // ส่งไป open-browser พร้อมบอกว่าให้ redirect กลับมาที่หน้านี้
      navigate(`/open-browser?redirect=${encodeURIComponent(location.pathname + location.search)}`, { replace: true });
    }
  }, [location, navigate]);

  const [sharedDecks, setSharedDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null); // Track for prev page
  const [hasMore, setHasMore] = useState(true);
  
  // --- Pagination State ---
  const [pageSnapshots, setPageSnapshots] = useState([null]); // Stores startAt snapshots
  const [currentPage, setCurrentPage] = useState(0); 
  const [totalLoadedCount, setTotalLoadedCount] = useState(0); 

  const [userProfile, setUserProfile] = useLocalStorage("bot-userProfile-v1", null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [cardDb] = useLocalStorage("bot-cardDb-v32-final", []);
  const [viewingDeck, setViewingDeck] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState({ field: "sharedAt", direction: "desc" });
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageDeck, setImageDeck] = useState(null);
  const imageTemplateRef = useRef(null);
  const loaderRef = useRef(null);
  
  // --- Constants ---
  const CHUNK_SIZE = 20; 
  const PAGE_SIZE_LIMIT = 100; 

  const [userDecks, setUserDecks] = useLocalStorage("bot-userDecks-v1", {});
  const [customProfile, setCustomProfile] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage('bot-theme', 'dark');
  
  // 🟢 [ใหม่] State สำหรับจัดการ Deck
  const [isDeckListModalOpen, setIsDeckListModalOpen] = useState(false);
  const [mainDeck, setMainDeck] = useLocalStorage("bot-mainDeck-v32-final", []);
  const [lifeDeck, setLifeDeck] = useLocalStorage("bot-lifeDeck-v32-final", []);

  // 🟢 [ใหม่] State สำหรับดึง User Stats
  const [userReputation, setUserReputation] = useState({});

  useEffect(() => {
      const root = document.documentElement;
      if (theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
  }, [theme]);

  const displayUser = useMemo(() => {
    if (!userProfile) return null;
    if (!customProfile) return userProfile;
    return { ...userProfile, name: customProfile.displayName || userProfile.name, picture: customProfile.avatarUrl || userProfile.picture };
  }, [userProfile, customProfile]);

  // 🟢 [ใหม่] ดึงข้อมูล User Profile และ Reputation
  useEffect(() => {
    if (userProfile?.email) {
        // 1. ดึง Profile (Firebase)
        getDoc(doc(db, "users", userProfile.email)).then(s => s.exists() && setCustomProfile(s.data()));

        // 2. ดึง Stats (Supabase) เพื่อโชว์ยศ
        const fetchStats = async () => {
             const { data } = await supabase.from('user_stats').select('user_email, total_score').eq('user_email', userProfile.email).single();
             if(data) setUserReputation({ [data.user_email]: data });
        };
        fetchStats();
    }
  }, [userProfile]);

  const closeModal = () => setModal({ isOpen: false });
  const showAlert = (title, message) => setModal({ isOpen: true, title, message });

  // === Fetch Logic (Revised) ===
  const fetchDecks = async (options = {}) => {
    const { 
      isInitialLoad = false, 
      loadNextChunk = false, 
      isNextPage = false, 
      isPrevPage = false 
    } = options;

    if (isInitialLoad || isNextPage || isPrevPage) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      let baseQuery = query(
        collection(db, "publicDecks"), 
        orderBy(sortOrder.field, sortOrder.direction), 
        limit(CHUNK_SIZE)
      );

      let finalQuery = baseQuery;

      if (isInitialLoad) {
         // Reset cursors handled in useEffect [sortOrder]
      } else if (isNextPage) {
         // Start from the snapshot saved for this page index
         const startSnap = pageSnapshots[currentPage];
         if (startSnap) finalQuery = query(baseQuery, startAfter(startSnap));
      } else if (isPrevPage) {
         // Start from the snapshot saved for the previous page index
         const startSnap = pageSnapshots[currentPage];
         if (startSnap) finalQuery = query(baseQuery, startAfter(startSnap));
         else finalQuery = baseQuery; // Page 0 has null snapshot
      } else if (loadNextChunk) {
         if (lastVisible) finalQuery = query(baseQuery, startAfter(lastVisible));
      }

      const snap = await getDocs(finalQuery);
      const newDecks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      if (snap.docs.length > 0) {
        setLastVisible(snap.docs[snap.docs.length - 1]);
        setFirstVisible(snap.docs[0]);
      }

      if (isInitialLoad || isNextPage || isPrevPage) {
        setSharedDecks(newDecks);
        setTotalLoadedCount(newDecks.length);
        // Scroll top on page change
        if(isNextPage || isPrevPage) window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSharedDecks(prev => [...prev, ...newDecks]);
        setTotalLoadedCount(prev => prev + newDecks.length);
      }

      setHasMore(newDecks.length === CHUNK_SIZE);

    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsLoading(false); 
      setIsLoadingMore(false); 
    }
  };

  // === Reset on Sort Change ===
  useEffect(() => { 
      setPageSnapshots([null]); 
      setCurrentPage(0);
      setLastVisible(null);
      setTotalLoadedCount(0);
      setHasMore(true);
      fetchDecks({ isInitialLoad: true }); 
  }, [sortOrder]);

  // === Infinite Scroll Observer ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading && !isLoadingMore && totalLoadedCount < PAGE_SIZE_LIMIT) {
          fetchDecks({ loadNextChunk: true });
        }
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => { if (loaderRef.current) observer.unobserve(loaderRef.current); };
  }, [hasMore, isLoading, isLoadingMore, lastVisible, totalLoadedCount]);

  // === Pagination Handlers ===
  const handleNextPage = () => {
      const nextIndex = currentPage + 1;
      const newSnapshots = [...pageSnapshots];
      if (!newSnapshots[nextIndex]) {
          newSnapshots[nextIndex] = lastVisible;
      }
      setPageSnapshots(newSnapshots);
      setCurrentPage(nextIndex);
  };

  const handlePrevPage = () => {
      if (currentPage > 0) {
          setCurrentPage(prev => prev - 1);
      }
  };

  // Effect to trigger fetch when currentPage changes
  useEffect(() => {
      if (currentPage > 0 || (currentPage === 0 && pageSnapshots.length > 1)) {
           fetchDecks({ isNextPage: true }); 
      }
  }, [currentPage]);


  const handleDelete = (deck) => {
    setModal({ isOpen: true, title: "Delete", message: `ลบเด็ค "${deck.deckName}"?`, onConfirm: async () => {
      closeModal();
      try { await deleteDoc(doc(db, "publicDecks", deck.id)); await deleteDoc(doc(db, "publicDeckDetails", deck.id)); setSharedDecks(p => p.filter(d => d.id !== deck.id)); }
      catch { showAlert("Error", "ลบไม่สำเร็จ"); }
    }, confirmText: "Delete", confirmIcon: <ClearIcon /> });
  };

  const handleLike = async (deck) => {
    if (!userProfile) return showAlert("Login", "เข้าสู่ระบบก่อนนะครับ");
    if (isLiking) return; setIsLiking(true);
    const isLiked = (deck.likedBy || []).includes(userProfile.email);
    try {
      await updateDoc(doc(db, "publicDecks", deck.id), { likeCount: increment(isLiked ? -1 : 1), likedBy: isLiked ? arrayRemove(userProfile.email) : arrayUnion(userProfile.email) });
      setSharedDecks(prev => prev.map(d => d.id === deck.id ? { ...d, likeCount: (d.likeCount||0) + (isLiked ? -1 : 1), likedBy: isLiked ? d.likedBy.filter(e=>e!==userProfile.email) : [...(d.likedBy||[]), userProfile.email] } : d));
    } catch { showAlert("Error", "Like failed"); } finally { setIsLiking(false); }
  };

  const handleView = async (deck) => {
    if (isDetailLoading || !cardDb.length) return cardDb.length===0 && showAlert("Error", "No Card DB");
    setIsDetailLoading(true); setViewingDeck({ ...deck, main: [], life: [] });
    try {
      const snap = await getDoc(doc(db, "publicDeckDetails", deck.id));
      if (snap.exists()) {
        const data = snap.data();
        const find = (id) => cardDb.find(c => c.id === id);
        setViewingDeck({ ...deck, main: (data.mainDeck||[]).map(find).filter(Boolean), life: (data.lifeDeck||[]).map(find).filter(Boolean) });
        setSharedDecks(prev => prev.map(d => d.id === deck.id ? { ...d, viewCount: (d.viewCount || 0) + 1 } : d));
        updateDoc(doc(db, "publicDecks", deck.id), { viewCount: increment(1) }).catch(()=>{});
      } else throw new Error("Not found");
    } catch { showAlert("Error", "Failed to load details"); setViewingDeck(null); } finally { setIsDetailLoading(false); }
  };

  const handlePhoto = (d, a) => { if(!isCapturing) { setIsCapturing(true); setImageDeck({ ...d, analysis: a }); } };
  useEffect(() => {
    if (imageDeck && imageTemplateRef.current) {
      html2canvas(imageTemplateRef.current, { useCORS: true, scale: 1.5, backgroundColor: '#1e293b' }).then(c => {
        const l = document.createElement('a'); l.download = `${imageDeck.deckName}.png`; l.href = c.toDataURL('image/png'); l.click();
      }).finally(() => { setIsCapturing(false); setImageDeck(null); });
    }
  }, [imageDeck]);
  
  const handleCloneDeck = (targetDeck) => {
    if (!userProfile) return showAlert("Login", "กรุณาเข้าสู่ระบบก่อน Clone เด็คครับ");
    const email = userProfile.email;
    const userData = userDecks[email] || { slots: [{ name: "Slot 1", main: [], life: [] }, { name: "Slot 2", main: [], life: [] }] };
    const slots = userData.slots;
    setModal({
      isOpen: true, title: "Clone Deck", message: (
        <div className="flex flex-col gap-4">
          <p>เลือก Slot ที่ต้องการบันทึกเด็ค "{targetDeck.deckName}" ลงไป:</p>
          {slots.map((slot, index) => (
            <button key={index} onClick={() => {
              if (!viewingDeck || viewingDeck.id !== targetDeck.id) return showAlert("Error", "กรุณากด View Details ก่อน Clone");
              const newSlots = [...slots];
              newSlots[index] = { name: targetDeck.deckName, main: viewingDeck.main, life: viewingDeck.life };
              setUserDecks(prev => ({ ...prev, [email]: { ...prev[email], slots: newSlots } }));
              closeModal();
              showAlert("Success", `บันทึกเด็คลงใน ${slot.name} เรียบร้อย!`);
            }} className="p-3 bg-slate-200 dark:bg-slate-800 border border-emerald-500/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-left flex justify-between items-center group">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{slot.name}</span>
              <span className="text-xs text-gray-500 group-hover:text-emerald-500">{slot.main.length > 0 ? "(จะถูกเขียนทับ)" : "(ว่าง)"}</span>
            </button>
          ))}
        </div>), confirmText: null
    });
  };

  const handleLogout = () => {
      googleLogout();
      setUserProfile(null);
      setCustomProfile(null);
      setIsSettingsOpen(false);
  };

  const handleSaveProfile = async (data) => {
    if (!userProfile) return;
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, "users", userProfile.email), { displayName: data.displayName, avatarUrl: data.avatarUrl, isSetup: true, updatedAt: serverTimestamp() }, { merge: true });
      const decksSnap = await getDocs(query(collection(db, "publicDecks"), where("user.email", "==", userProfile.email)));
      decksSnap.forEach(doc => batch.update(doc.ref, { "user.name": data.displayName, "user.picture": data.avatarUrl }));
      await batch.commit();
      setCustomProfile(p => ({ ...p, ...data, isSetup: true })); setIsProfileModalOpen(false); showAlert("Success", "บันทึกข้อมูลเรียบร้อย!");
    } catch (e) { console.error(e); showAlert("Error", "บันทึกไม่สำเร็จ"); }
  };

  return (
    <div className="h-screen flex flex-col text-slate-900 dark:text-gray-200 bg-slate-100 dark:bg-black">
      <style>{`::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#334155}.image-render-target{position:fixed;top:-9999px;left:0;width:1280px;height:auto;background:#1e293b;padding:24px;box-shadow:0 0 30px rgba(0,0,0,0.5);display:flex;gap:24px;flex-shrink:0;flex-grow:0;}`}</style>
      
      {/* Header: Redesigned (Consistent with App.jsx) */}
      <header className="px-3 md:px-6 py-2 border-b border-slate-200 dark:border-emerald-700/30 bg-white/80 dark:bg-black/60 backdrop-blur-sm shrink-0 z-40 h-14 flex flex-col justify-center">
         <div className="flex items-center justify-between gap-2">
          
          {/* 🟢 ฝั่งซ้าย: Menu + Title */}
          <div className="flex items-center gap-1.5 overflow-hidden">
             {userProfile && (
                 <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-800 dark:text-white transition-colors shrink-0">
                    <div className="scale-90"><MenuIcon /></div>
                 </button>
             )}
             <h1 className="text-lg md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 bg-clip-text text-transparent truncate pt-0.5">
                Public Decks
             </h1>
          </div>
          
          {/* 🟢 ฝั่งขวา: ปุ่มต่างๆ เรียงตามลำดับ (Market -> Public -> My Decks -> Bell -> Profile) */}
          <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
            
            {/* 1. Market */}
            <Link to="/auction">
                <Button className="!px-2 md:!px-4 bg-gradient-to-r from-rose-500 to-orange-600 text-white border-none shadow-md hover:shadow-lg hover:from-rose-400 hover:to-orange-500">
                    <StoreIcon /> 
                    <span className="hidden md:inline ml-1">Market</span>
                </Button>
            </Link>

            {/* 2. Public (หน้าหลัก) */}
            <Link to="/">
                <Button
                    as="span"
                    className="!px-2 md:!px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg hover:from-blue-400 hover:to-purple-500 ring-2 ring-offset-2 ring-blue-500/50 dark:ring-offset-slate-900"
                >
                    <HomeIcon />{" "}
                    <span className="hidden md:inline">Home</span>
                </Button>
            </Link>

            {/* 4. Bell (Notification) */}
            <NotificationCenter userEmail={userProfile?.email} />

            {/* 5. Profile Picture */}
            {/* 5. Profile Picture (แก้ไขแล้ว: ตรวจสอบก่อนแสดงผล) */}
            {displayUser ? (
              <>
                <img
                    src={displayUser.picture}
                    alt={displayUser.name}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-emerald-500 object-cover ml-1 cursor-pointer hover:scale-105 transition-transform"
                    title={`Logged in as ${displayUser.name}`}
                    onClick={() => setIsSettingsOpen(true)} 
                />
                <span className="text-slate-900 dark:text-white hidden lg:block text-sm font-semibold max-w-[100px] truncate">
                    {displayUser.name}
                </span>
              </>
            ) : (
              // กรณีไม่ได้ Login: แสดงปุ่มให้กดไป Login แทน
              <button 
                onClick={() => navigate('/')} 
                className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-full shadow transition-all"
              >
                Login
              </button>
            )}
          </div>

        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Public Shared Decks</h2>
        <div className="mb-8 p-4 bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-emerald-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="search" placeholder="Search decks..." className="w-full px-4 py-2 border border-slate-300 dark:border-emerald-500/30 rounded-lg bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          {/* 🔽 Sort Dropdown */}
          <div className="flex items-center gap-3 mt-4">
            <label className="text-sm text-slate-600 dark:text-gray-400 font-medium">
              Sort by:
            </label>
            <div className="relative group">
              <select
                value={`${sortOrder.field}-${sortOrder.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortOrder({ field, direction });
                }}
                className="
                  appearance-none cursor-pointer
                  pl-4 pr-10 py-2 
                  rounded-lg 
                  bg-white dark:bg-slate-800 
                  border border-slate-300 dark:border-emerald-500/30 
                  text-slate-900 dark:text-white text-sm font-medium 
                  shadow-sm 
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none 
                  transition-all duration-200
                  hover:border-emerald-400 dark:hover:border-emerald-400
                "
              >
                <option value="sharedAt-desc">ล่าสุด (Latest)</option>
                <option value="likeCount-desc">ยอดนิยม (Popular)</option>
                <option value="viewCount-desc">คนดูเยอะสุด (Most Views)</option>
                <option value="sharedAt-asc">เก่าสุด (Oldest)</option>
              </select>
              
              {/* Custom Chevron Icon */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500 dark:text-emerald-500 group-hover:text-emerald-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* --- [1] Grid Layout (Mobile=2 Cols / Desktop=5 Cols) --- */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6"> 
            {Array.from({ length: CHUNK_SIZE }).map((_, i) => <DeckCardSkeleton key={i} />)}
          </div>
        )}
        {!isLoading && sharedDecks.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6"> 
            {sharedDecks.filter(d => d.deckName.toLowerCase().includes(searchTerm.toLowerCase())).map(d => (
              <DeckCard 
                key={d.id} 
                deck={d} 
                onViewDeck={handleView} 
                userProfile={displayUser} 
                onDeleteDeck={handleDelete} 
                isDetailLoading={isDetailLoading && viewingDeck?.id === d.id} 
                onLikeDeck={handleLike} 
                isLiking={isLiking} 
              />
            ))}
          </div>
        )}

        {/* --- [2] Load More / Pagination Trigger --- */}
        <div ref={loaderRef} className="mt-8 py-4 text-center min-h-[50px]">
          {/* 2.1 Loader (Infinite Scroll) */}
          {(isLoadingMore || (hasMore && !isLoading && totalLoadedCount < PAGE_SIZE_LIMIT)) && (
            <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 animate-pulse">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Loading more decks...</span>
            </div>
          )}
          
          {/* 2.2 Pagination Buttons (Visible when limit reached or page > 0) */}
          {!isLoading && (
             <div className="flex justify-center gap-4 mt-4">
                {/* Prev Button */}
                {currentPage > 0 && (
                  <Button onClick={handlePrevPage} className="bg-slate-600 text-white hover:bg-slate-500">
                     &larr; Previous Page
                  </Button>
                )}
                
                {/* Next Button (Only if limit reached AND has more in DB) */}
                {(totalLoadedCount >= PAGE_SIZE_LIMIT && hasMore) && (
                   <Button onClick={handleNextPage} className="bg-emerald-600 text-white hover:bg-emerald-500">
                     Next Page (Page {currentPage + 2}) &rarr;
                   </Button>
                )}
             </div>
          )}

          {/* 2.3 End of List Message */}
          {!hasMore && sharedDecks.length > 0 && totalLoadedCount < PAGE_SIZE_LIMIT && (
            <p className="text-slate-400 dark:text-slate-600 text-sm mt-4">-- End of list --</p>
          )}
        </div>
      </main>
      
      <Modal isOpen={modal.isOpen} title={modal.title} onClose={closeModal} onConfirm={modal.onConfirm} confirmText={modal.onConfirm ? modal.confirmText || "Confirm" : undefined} confirmIcon={modal.onConfirm ? modal.confirmIcon || <ClearIcon /> : undefined}>{modal.message}</Modal>
      
      <DeckViewModal isOpen={viewingDeck !== null} onClose={() => setViewingDeck(null)} deck={viewingDeck} showAlert={showAlert} isLoading={isDetailLoading} isCapturing={isCapturing} onTakePhoto={handlePhoto} userProfile={displayUser} onClone={handleCloneDeck} />
      
      {imageDeck && <DeckImageTemplate ref={imageTemplateRef} deck={imageDeck} analysis={imageDeck.analysis} />}

      {/* === Modals for Profile & Settings & Feedback === */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userProfile={displayUser}
        onEditProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenMyDecks={() => setIsDeckListModalOpen(true)} // 🟢 เปิด Modal My Decks
        userStats={userReputation[userProfile?.email]} // 🟢 ส่งคะแนนไปแสดงยศ
      />
      <ProfileSetupModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onSave={handleSaveProfile}
      />
      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        userProfile={displayUser}
        showAlert={showAlert}
      />

      {/* 🟢 [ใหม่] Modal จัดการเด็ค */}
      <DeckListModal
        isOpen={isDeckListModalOpen}
        onClose={() => setIsDeckListModalOpen(false)}
        userProfile={displayUser}
        userDecks={userDecks}
        setUserDecks={setUserDecks}
        mainDeck={mainDeck}
        lifeDeck={lifeDeck}
        setMainDeck={setMainDeck}
        setLifeDeck={setLifeDeck}
        cardDb={cardDb}
      />
      <ChatWidget 
        userProfile={displayUser} 
        isMobileMenuOpen={isSettingsOpen} // ซ่อนปุ่มแชทถ้าเปิดเมนูตั้งค่า (บนมือถือ)
      />
    </div>
  );
}