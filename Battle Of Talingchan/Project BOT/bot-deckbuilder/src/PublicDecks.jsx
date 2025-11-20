import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from "react-dom";
import { db } from './firebase';
import { 
  collection, getDocs, query, orderBy, Timestamp, doc, deleteDoc, limit, startAfter, getDoc,
  updateDoc, increment, arrayUnion, arrayRemove, addDoc, onSnapshot, serverTimestamp,
  endBefore, limitToLast, writeBatch, where
} from 'firebase/firestore';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { googleLogout } from '@react-oauth/google'; // ต้อง import เพื่อให้ logout ได้

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// === Icons ===
const Svg = ({ p, ...r }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...r}>{p}</svg>;
const ImportIcon = () => <Svg p={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>} />;
const ChevronLeftIcon = () => <Svg width="24" height="24" p={<polyline points="15 18 9 12 15 6"></polyline>} />;
const EyeIcon = () => <Svg p={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>} />;
const CopyIcon = () => <Svg p={<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></>} />;
const ClearIcon = () => <Svg p={<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>} />;
const HeartIcon = ({ filled }) => <Svg fill={filled ? 'currentColor' : 'none'} p={<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>} />;
const CameraIcon = () => <Svg p={<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></>} />;
const PencilIcon = () => <Svg width="12" height="12" p={<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>} />;
const ReplyIcon = () => <Svg width="12" height="12" p={<><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></>} />;
const TrashIcon = () => <Svg width="12" height="12" p={<><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></>} />;
const MenuIcon = () => <Svg width="24" height="24" p={<><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>} />;
const UserCogIcon = () => <Svg width="24" height="24" p={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><circle cx="12" cy="12" r="3"></circle></>} />;
const CloseIcon = () => <Svg width="24" height="24" p={<><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>} />;
const SunIcon = () => <Svg p={<><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></>} />;
const MoonIcon = () => <Svg p={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>} />;
const MessageIcon = () => <Svg p={<><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></>} />;
const ImageIcon = () => <Svg p={<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>} />;

// === UI Components ===
const Button = ({ className = "", children, ...props }) => ( <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 dark:hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${className}`} {...props} > {children} </button> );
const CardShell = ({ children, className = "", ...props }) => ( <div className={`bg-white dark:bg-slate-900/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-lg transition-all hover:border-amber-400/50 hover:shadow-amber-500/10 ${className}`} {...props}> {children} </div> );
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

// === Helper Components for Profile/Settings (Duplicated from App.jsx for standalone PublicDecks) ===
const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_SIZE = 256;
          let width = img.width;
          let height = img.height;
          if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } 
          else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
};

const ProfileSetupModal = ({ isOpen, onClose, userProfile, onSave }) => {
    const [nickname, setNickname] = useState(userProfile?.name || "");
    const [avatarUrl, setAvatarUrl] = useState(userProfile?.picture || "");
    const [useGoogleAvatar, setUseGoogleAvatar] = useState(true);
    const fileInputRef = useRef(null);
  
    useEffect(() => { if (isOpen) { setNickname(userProfile?.name || ""); setAvatarUrl(userProfile?.picture || ""); setUseGoogleAvatar(true); } }, [isOpen, userProfile]);
    const handleFileChange = async (e) => { if (e.target.files && e.target.files[0]) { const resized = await resizeImage(e.target.files[0]); setAvatarUrl(resized); setUseGoogleAvatar(false); } };
    const handleSave = () => { onSave({ displayName: nickname, avatarUrl: useGoogleAvatar ? userProfile.picture : avatarUrl, }); };
    if (!isOpen) return null;
  
    return createPortal(
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[500] p-4">
        <div className="bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-emerald-500/50 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
          <div className="text-center"><h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 mb-2">ยินดีต้อนรับ!</h2><p className="text-slate-600 dark:text-gray-400">ตั้งค่าโปรไฟล์ของคุณเพื่อให้ชุมชนรู้จัก</p></div>
          <div className="space-y-4"><div className="flex flex-col items-center gap-3"><div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg relative group"><img src={useGoogleAvatar ? userProfile.picture : avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" onError={(e) => (e.target.src = "https://placehold.co/100x100/1e293b/ffffff?text=User")} />{!useGoogleAvatar && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current.click()}><div className="text-white text-xs">เปลี่ยนรูป</div></div>)}</div><div className="flex gap-2 text-sm"><button onClick={() => setUseGoogleAvatar(true)} className={`px-3 py-1 rounded-full border ${useGoogleAvatar ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-400 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800"}`}>รูป Google</button><button onClick={() => fileInputRef.current.click()} className={`px-3 py-1 rounded-full border ${!useGoogleAvatar ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-400 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800"}`}><div className="flex items-center gap-1"><ImageIcon /> อัปโหลดรูป</div></button><input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} /></div></div><div className="space-y-3"><div><label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">นามแฝง (Display Name)</label><input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-emerald-500 outline-none" placeholder="ชื่อเท่ๆ ของคุณ" /></div></div></div>
          <div className="flex gap-3 mt-2"><Button onClick={onClose} className="flex-1 bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-slate-700">ข้ามไปก่อน</Button><Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 border-none text-white hover:shadow-lg hover:scale-105">บันทึกโปรไฟล์</Button></div>
        </div>
      </div>, document.body
    );
};

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
          text: text.trim(), type: type,
          user: userProfile ? { name: userProfile.name, email: userProfile.email, uid: userProfile.email } : "Anonymous",
          createdAt: serverTimestamp(), status: "new", version: "1.0"
        });
        showAlert("ขอบคุณครับ! 🙏", "เราได้รับข้อมูลของท่านแล้ว ทีมงานจะนำไปปรับปรุงให้ดียิ่งขึ้น");
        setText(""); onClose();
      } catch (e) { console.error("Feedback error: ", e); showAlert("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้ โปรดลองใหม่ภายหลัง"); } finally { setIsSubmitting(false); }
    };
    return createPortal(
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[650] p-4">
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><MessageIcon /> ติดต่อผู้พัฒนา / แจ้งปัญหา</h2>
          <div className="space-y-4">
            <div><label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">หัวข้อเรื่อง</label><select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"><option value="suggestion">💡 เสนอแนะ / ฟีดแบค</option><option value="bug">🐛 แจ้งบั๊ก / ปัญหาการใช้งาน</option><option value="other">💬 อื่นๆ</option></select></div>
            <div><label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">รายละเอียด</label><textarea rows="4" value={text} onChange={(e) => setText(e.target.value)} placeholder="เล่าให้เราฟังหน่อยครับ..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-6"><Button onClick={onClose} className="bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-slate-700">ยกเลิก</Button><Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 text-white hover:bg-emerald-500 border-none shadow-lg">{isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}</Button></div>
        </div>
      </div>, document.body
    );
};
  
const SettingsDrawer = ({ isOpen, onClose, userProfile, onEditProfile, onLogout, theme, setTheme, onOpenFeedback }) => {
    return (
      <>
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
        <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-300 dark:border-emerald-700/30 shadow-2xl z-[610] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="p-6 border-b border-slate-200 dark:border-emerald-700/20 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><UserCogIcon /> ตั้งค่าผู้ใช้</h2><button onClick={onClose} className="text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white"><CloseIcon /></button></div>
          <div className="p-6 flex flex-col items-center gap-4">
            <img src={userProfile?.picture} alt={userProfile?.name} className="w-24 h-24 rounded-full border-4 border-emerald-500 shadow-lg object-cover" />
            <div className="text-center"><h3 className="text-xl font-bold text-slate-900 dark:text-white">{userProfile?.name}</h3><p className="text-sm text-slate-500 dark:text-gray-400">{userProfile?.email}</p></div>
            <Button onClick={() => { onEditProfile(); onClose(); }} className="w-full mt-4 bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-emerald-700 dark:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700">แก้ไขโปรไฟล์</Button>
            <div className="mt-4 w-full"><label className="text-sm font-semibold text-slate-500 dark:text-gray-400">เลือกธีม</label><div className="mt-2 grid grid-cols-2 gap-2"><Button onClick={() => setTheme("light")} className={`text-sm ${theme === "light" ? "bg-amber-500/50 border-amber-400" : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400"}`}><SunIcon /> สว่าง</Button><Button onClick={() => setTheme("dark")} className={`text-sm ${theme === "dark" ? "bg-amber-500/50 border-amber-400" : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400"}`}><MoonIcon /> มืด</Button></div></div>
            {/* ปุ่มติดต่อผู้พัฒนา */}
            <div className="w-full pt-4 mt-4 border-t border-slate-200 dark:border-emerald-700/20">
                <Button onClick={() => { onOpenFeedback(); onClose(); }} className="w-full bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/30">
                    <MessageIcon /> ติดต่อ / แจ้งปัญหา
                </Button>
            </div>
          </div>
          <div className="mt-auto p-6 border-t border-slate-200 dark:border-emerald-700/20"><Button onClick={onLogout} className="w-full bg-red-200 dark:bg-red-900/30 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 hover:bg-red-300 dark:hover:bg-red-900/50 dark:hover:text-white">ออกจากระบบ</Button></div>
        </div>
      </>
    );
};


// === Utils ===
function useLocalStorage(key, initial) { const [v, s] = useState(() => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; } }); useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]); return [v, s]; }
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
const nameKey = (n) => (n || "").trim().toLowerCase();
const encodeDeckCode = (mainDeck, lifeDeck) => { try { return btoa(JSON.stringify({ m: mainDeck.map(c=>c.id), l: lifeDeck.map(c=>c.id) })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); } catch { return ""; } };
function countBy(arr, keyFn) { return arr.reduce((m, x) => { const k = keyFn(x); m[k] = (m[k] || 0) + 1; return m; }, {}); }
const avg = (arr) => { const valid = arr.filter(n => typeof n === 'number' && !isNaN(n)); return valid.length ? (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2) : '0.00'; };

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

function DeckViewModal({ isOpen, onClose, deck, showAlert, isLoading, onTakePhoto, isCapturing, userProfile, onClone }) {
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
  const handleCopyCode = () => { if (analysis?.deckCode) { navigator.clipboard.writeText(analysis.deckCode).then(()=>showAlert("Success!", `✅ คัดลอกรหัสเด็คแล้ว!`)).catch(()=>showAlert("Error", "ไม่สามารถคัดลอกรหัสเด็คได้")); } };
  const renderCardSection = (title, cards) => {
    if (!cards || cards.length === 0) return null;
    const groupedCards = cards.reduce((acc, card) => { const existing = acc.find(item => item.card.id === card.id); if (existing) { existing.count++; } else { acc.push({ card, count: 1 }); } return acc; }, []);
    return (
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-300 border-b border-emerald-500/20 pb-1 mb-3">{title} ({cards.length} ใบ)</h4>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-2 justify-center">
          {groupedCards.map(({ card, count }) => (
            <div key={card.id} className="relative w-24">
              <img src={`/cards/${encodePath(card.imagePath)}/${encodeURIComponent(card.id.replace(' - Only#1', ''))}.png`} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
              {count > 1 && ( <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 text-white text-lg font-bold rounded-full border-2 border-white dark:border-slate-800 text-center leading-none pt-0.5">{count}</div> )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
      <div className="bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full h-full flex flex-col max-w-[95vw] max-h-[90vh]">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-emerald-500/20 shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate pr-4">{isLoading ? "กำลังโหลด..." : deck?.deckName}</h2>
          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={()=>onTakePhoto(deck, analysis)} disabled={isLoading||!analysis||isCapturing} className="bg-blue-200 dark:bg-blue-600/30 border-blue-300 dark:border-blue-500/30 text-blue-800 dark:text-blue-300"><CameraIcon /> {isCapturing?"ถ่ายรูป...":"ถ่ายรูป"}</Button>
            {onClone && <Button onClick={() => onClone(deck)} disabled={isLoading||!analysis} className="bg-emerald-200 dark:bg-emerald-600/30 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300"><ImportIcon /> Clone</Button>}
            <Button onClick={handleCopyCode} disabled={isLoading||!analysis}><CopyIcon /> คัดลอกรหัสเด็ค</Button>
            <Button onClick={onClose} disabled={isCapturing}>Close</Button>
          </div>
        </header>
        {isLoading || !analysis ? (<div className="flex-grow flex items-center justify-center"><p className="text-xl text-slate-500 dark:text-slate-300">กำลังโหลดรายละเอียดเด็ค...</p></div>) : (
          <div className="flex-grow overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900/80">
            <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto p-6 pr-2 border-r border-slate-200 dark:border-emerald-500/20">
              <div><h3 className="text-xl font-semibold text-amber-600 dark:text-amber-300 border-b border-amber-500/20 pb-1 mb-3">สถิติเด็ค</h3><div className="grid grid-cols-3 gap-2 text-center"><div><span className="text-xs text-gray-500 dark:text-gray-400">Cost</span><p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{analysis.avgCost}</p></div><div><span className="text-xs text-gray-500 dark:text-gray-400">Power</span><p className="text-xl font-bold text-red-600 dark:text-red-400">{analysis.avgPower}</p></div><div><span className="text-xs text-gray-500 dark:text-gray-400">Gem</span><p className="text-xl font-bold text-amber-600 dark:text-amber-400">{analysis.avgGem}</p></div></div></div>
              <div><h3 className="text-xl font-semibold text-amber-600 dark:text-amber-300 border-b border-amber-500/20 pb-1 mb-3">ประเภทการ์ด</h3><ul className="space-y-1 text-sm">{analysis.cardTypes.map(([t, c]) => <li key={t} className="flex justify-between text-slate-700 dark:text-gray-300"><span>{t}</span><span className="text-slate-900 dark:text-white font-bold">{c}</span></li>)}</ul></div>
            </div>
            <div className="lg:col-span-6 overflow-y-auto p-6 border-r border-slate-200 dark:border-emerald-500/20 bg-slate-50 dark:bg-black/20">
              {analysis.only1 && <div className="mb-6 flex flex-col items-center"><h4 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-3">Only #1</h4><div className="relative w-40"><img src={`/cards/${encodePath(analysis.only1.imagePath)}/${encodeURIComponent(analysis.only1.id.replace(' - Only#1', ''))}.png`} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} /></div></div>}
              {renderCardSection("Avatar Cards", analysis.avatars)}{renderCardSection("Magic Cards", analysis.magics)}{renderCardSection("Construct Cards", analysis.constructs)}{renderCardSection("Other Cards", analysis.others)}{renderCardSection("Life Deck", analysis.life)}
            </div>
            <div className="lg:col-span-3 h-full overflow-hidden"><CommentSection deckId={deck.id} userProfile={userProfile} showAlert={showAlert} deckOwnerEmail={deck.user.email} /></div>
          </div>
        )}
      </div>
    </div>, document.body
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
  const mainCardImg = useMemo(() => {
    if (!deck.only1CardData) return 'https://placehold.co/300x420/1e293b/94a3b8?text=Deck';
    return `/cards/${encodePath(deck.only1CardData.imagePath)}/${encodeURIComponent(deck.only1CardData.id.replace(' - Only#1', ''))}.png`;
  }, [deck.only1CardData]);
  const isOwner = userProfile && userProfile.email === deck.user.email;
  const isLiked = userProfile && (deck.likedBy || []).includes(userProfile.email);
  return (
    <CardShell className="flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img src={deck.user.picture} alt={deck.user.name} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 object-cover" loading="lazy" />
          <div><p className="font-semibold text-slate-900 dark:text-white">{deck.user.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{deck.sharedAt?.toDate().toLocaleString('th-TH')}</p></div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-amber-600 dark:text-amber-300 mb-3 line-clamp-2">{deck.deckName}</h3>
      <div className="aspect-[5/7] w-full rounded-lg mb-4 overflow-hidden bg-slate-200 dark:bg-slate-800"><img src={mainCardImg} className="w-full h-full object-cover" loading="lazy"/></div>
      <div className="flex items-center gap-3 mb-3">
        <Button onClick={() => onLikeDeck(deck)} disabled={!userProfile || isLiking} className={`px-3 ${isLiked ? 'bg-red-200 dark:bg-red-600/30 border-red-300 dark:border-red-500/50 text-red-700 dark:text-red-300' : ''}`}><HeartIcon filled={isLiked} /></Button>
        <span className="text-gray-600 dark:text-gray-400 text-sm">{deck.likeCount || 0} Likes</span>
        <span className="ml-auto text-gray-500 dark:text-gray-500 text-sm flex items-center gap-1.5"><EyeIcon /> {deck.viewCount || 0}</span>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <Button onClick={() => onViewDeck(deck)} className="w-full bg-blue-200 dark:bg-blue-600/30 border-blue-300 dark:border-blue-500/30 text-blue-800 dark:text-blue-300" disabled={isDetailLoading}><EyeIcon /> {isDetailLoading ? "Loading..." : "View Detail"}</Button>
        {isOwner && <Button onClick={() => onDeleteDeck(deck)} className="w-full bg-red-200 dark:bg-red-900/50 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300"><ClearIcon /> Un-share</Button>}
      </div>
    </CardShell>
  );
}

function DeckCardSkeleton() { return (<CardShell className="flex flex-col animate-pulse"><div className="flex justify-between mb-3"><div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700"></div><div className="h-4 w-24 bg-slate-300 dark:bg-slate-700 rounded"></div></div><div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-700 rounded mb-3"></div><div className="aspect-[5/7] w-full rounded-lg mb-4 bg-slate-300 dark:bg-slate-700"></div><div className="h-10 w-full bg-slate-300 dark:bg-slate-700 rounded-lg"></div></CardShell>); }

// === Main PublicDecks Component ===
export default function PublicDecks() {
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

  useEffect(() => {
    if (userProfile?.email) {
      getDoc(doc(db, "users", userProfile.email)).then(s => s.exists() && setCustomProfile(s.data()));
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
      <header className="px-4 lg:px-6 py-2 border-b border-slate-200 dark:border-emerald-700/30 bg-white/80 dark:bg-black/60 backdrop-blur-sm shrink-0 z-40">
         <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             {/* Menu Button for Mobile/Settings */}
             {userProfile && (
                 <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-800 dark:text-white transition-colors">
                    <MenuIcon />
                 </button>
             )}
             <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 bg-clip-text text-transparent">Battle Of Talingchan</h1>
          </div>
          <Link to="/"><Button className="bg-emerald-200 dark:bg-emerald-600/30 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300"><ChevronLeftIcon /> Back to Deck Builder</Button></Link>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Public Shared Decks</h2>
        <div className="mb-8 p-4 bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-emerald-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="search" placeholder="Search decks..." className="w-full px-4 py-2 border border-slate-300 dark:border-emerald-500/30 rounded-lg bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <div className="flex flex-wrap items-center gap-2 mt-4"><span className="text-gray-500 dark:text-gray-400 text-sm mr-2">Sort by:</span>
            <Button onClick={() => setSortOrder({ field: "sharedAt", direction: "desc" })} className={`text-sm ${sortOrder.field==='sharedAt'&&sortOrder.direction==='desc'?'bg-amber-400/50 border-amber-500':'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>Latest</Button>
            <Button onClick={() => setSortOrder({ field: "likeCount", direction: "desc" })} className={`text-sm ${sortOrder.field==='likeCount'?'bg-amber-400/50 border-amber-500':'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>Popular</Button>
            <Button onClick={() => setSortOrder({ field: "viewCount", direction: "desc" })} className={`text-sm ${sortOrder.field==='viewCount'?'bg-amber-400/50 border-amber-500':'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>Most Views</Button>
            <Button onClick={() => setSortOrder({ field: "sharedAt", direction: "asc" })} className={`text-sm ${sortOrder.field==='sharedAt'&&sortOrder.direction==='asc'?'bg-amber-400/50 border-amber-500':'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600'}`}>Oldest</Button>
          </div>
        </div>
        
        {/* --- [1] Grid Layout (Responsive 3/5 Cols) --- */}
        {isLoading && <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-6">{Array.from({ length: CHUNK_SIZE }).map((_, i) => <DeckCardSkeleton key={i} />)}</div>}
        {!isLoading && sharedDecks.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-6">
            {sharedDecks.filter(d => d.deckName.toLowerCase().includes(searchTerm.toLowerCase())).map(d => (
              <DeckCard key={d.id} deck={d} onViewDeck={handleView} userProfile={displayUser} onDeleteDeck={handleDelete} isDetailLoading={isDetailLoading && viewingDeck?.id === d.id} onLikeDeck={handleLike} isLiking={isLiking} />
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
    </div>
  );
}