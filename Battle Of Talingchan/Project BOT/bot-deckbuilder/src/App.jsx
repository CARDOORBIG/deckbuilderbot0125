import { useEffect, useMemo, useRef, useState, forwardRef, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { DndProvider, useDrag, useDrop, useDragLayer } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { db } from './firebase';
import { auth } from './firebase';
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { 
  collection, doc, writeBatch, serverTimestamp, getDoc, setDoc,
  query, where, getDocs, addDoc, onSnapshot, updateDoc, deleteField // 🟢 เพิ่ม onSnapshot, updateDoc, deleteField
} from 'firebase/firestore';
import { supabase } from './supabaseClient';
import ChatWidget from './ChatWidget'; 
import Header from './components/Header'; 

// Import Components
import CreateAuctionModal from './CreateAuctionModal';
import NotificationCenter from './NotificationCenter';
import AdminDashboardModal from './AdminDashboardModal';
import SettingsDrawer from './components/SettingsDrawer';
import ProfileSetupModal from './components/ProfileSetupModal';
import RatingBadge from './components/RatingBadge';
import { FacebookIcon } from './components/Icons';
import { 
    MenuIcon, GavelIcon, ShoppingBagIcon, UserCogIcon, 
    CloseIcon, SunIcon, MoonIcon, HistoryIcon, 
    PackageIcon, BanIcon, CrownIcon, FlagIcon, 
    ShieldCheckIcon, ChatBubbleIcon, SendIcon, 
    TrashIcon, UsersIcon, DeckIcon, StoreIcon, 
    HomeIcon, MessageIcon, NeonLightningIcon, 
    ImageIcon, ArchiveIcon 
} from './components/Icons';
import UserBadge from './components/UserBadge';
import WarningPopup from './components/WarningPopup'; // 🟢 Import WarningPopup

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ... (ส่วน Local Icons, Helper functions, Components เดิม ยังคงเหมือนเดิม ไม่เปลี่ยนแปลง) ...
// === Local Icons (Only used in App.jsx) ===
const Svg = ({ p, ...r }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...r}>{p}</svg>;
const ImportIcon = () => <Svg p={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>} />;
const ExportIcon = () => <Svg p={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>} />;
const DBLoadIcon = () => <Svg p={<><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></>} />;
const EyeIcon = () => <Svg p={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>} />;
const CopyIcon = () => <Svg p={<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></>} />;
const PlusIcon = () => <Svg width="20" height="20" strokeWidth="2.5" p={<><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></>} />;
const ChevronLeftIcon = () => <Svg width="24" height="24" p={<polyline points="15 18 9 12 15 6"></polyline>} />;
const ChevronRightIcon = () => <Svg width="24" height="24" p={<polyline points="9 18 15 12 9 6"></polyline>} />;
const ChevronUpIcon = () => <Svg width="24" height="24" p={<polyline points="18 15 12 9 6 15"></polyline>} />;
const UploadIcon = () => <Svg p={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></>} />;
const ShareIconNew = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);
const FilterIcon = () => <Svg p={<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>} />;

// === UI helpers ===
const Button = ({ className = "", children, ...props }) => (
  <button
    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-300/20 dark:border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 dark:hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-200/20 dark:disabled:hover:bg-amber-900/30 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Pill = ({ children, className = "" }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>
    {children}
  </span>
);

const CardShell = forwardRef(function CardShell({ children, className = "", ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-slate-900/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-lg transition-all hover:border-amber-400/50 hover:shadow-amber-500/10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const ColorPip = ({ color }) => {
  const c = { Red: "bg-red-500", Green: "bg-green-500", Purple: "bg-purple-500", Blue: "bg-blue-500", Yellow: "bg-yellow-500", Black: "bg-gray-800", White: "bg-slate-200" };
  return <span className={`w-3 h-3 rounded-full ${c[color] || "bg-slate-400"}`} title={color}></span>;
};

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", confirmIcon = <TrashIcon />, maxWidth = "max-w-md" }) =>
  !isOpen ? null : createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[400] p-4">
      <div className={`bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full m-4 ${maxWidth}`}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
        <div className="text-slate-700 dark:text-gray-300 mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} className="bg-slate-200 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-slate-600">{onConfirm ? "Cancel" : "Close"}</Button>
          {onConfirm && <Button onClick={onConfirm} className="bg-emerald-200 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-300 dark:hover:bg-emerald-800/50 dark:hover:text-white">{confirmIcon} {confirmText}</Button>}
        </div>
      </div>
    </div>, document.body
  );

const ImportDeckModal = ({ isOpen, onClose, onImport }) => {
  const [code, setCode] = useState("");
  const handleImportClick = () => { onImport(code); setCode(""); };
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[210] p-4">
      <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Import Deck Code</h2>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="วางรหัสเด็คที่นี่..." rows="4" className="w-full px-3 py-2 border border-slate-300 dark:border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-white dark:bg-slate-700/50 placeholder-gray-400 text-slate-900 dark:text-white mb-6 resize-none" />
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} className="bg-slate-200 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</Button>
          <Button onClick={handleImportClick} className="bg-emerald-200 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-300 dark:hover:bg-emerald-800/50 dark:hover:text-white"><ImportIcon /> Import</Button>
        </div>
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
    if (!text.trim()) return showAlert("ข้อความว่างเปล่า", "กรุณากรอกข้อความก่อนส่งค่ะ");
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        text: text.trim(), type: type,
        user: userProfile ? { name: userProfile.name, email: userProfile?.email
, uid: userProfile?.email
 } : "Anonymous",
        createdAt: serverTimestamp(), status: "new", version: "1.0"
      });
      showAlert("ขอบคุณค่ะ! ", "เราได้รับข้อมูลของท่านแล้ว ทีมงานจะนำไปปรับปรุงให้ดียิ่งขึ้น");
      setText(""); onClose();
    } catch (e) { console.error("Feedback error: ", e); showAlert("เกิดข้อผิดพลาด", "ไม่สามารถส่งข้อมูลได้ โปรดลองใหม่ภายหลัง"); } finally { setIsSubmitting(false); }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[650] p-4">
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><MessageIcon /> ติดต่อผู้พัฒนา / แจ้งปัญหา</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">หัวข้อเรื่อง</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="suggestion">💡 เสนอแนะ / ฟีดแบค</option>
              <option value="bug">🐛 แจ้งบั๊ก / ปัญหาการใช้งาน</option>
              <option value="other">💬 อื่นๆ</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">รายละเอียด</label>
            <textarea rows="4" value={text} onChange={(e) => setText(e.target.value)} placeholder="เล่าให้เราฟังหน่อยค่ะ..." className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} className="bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-slate-700">ยกเลิก</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 text-white hover:bg-emerald-500 border-none shadow-lg">{isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}</Button>
        </div>
      </div>
    </div>, document.body
  );
};

function CardDetailModal({ card, onClose, onSell }) {
  if (!card) return null;
  const encodedImagePath = encodePath(card.imagePath);
  const fileId = card.id.replace(' - Only#1', '');
  const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
  const imgJpg = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.jpg`;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[300] p-4" onClick={onClose}>
      <img src={imgPng} alt={card.name} className="max-w-full max-h-full h-auto w-auto object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = imgJpg; }} />
      <button onClick={onClose} className="absolute top-4 right-4 text-white bg-slate-800/50 rounded-full p-2 hover:bg-slate-700"><CloseIcon /></button>
      <button onClick={(e) => { e.stopPropagation(); if(onSell) onSell(card); }} className="absolute bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-transform z-[310]"><span className="text-xl">🔨</span><span>เปิดประมูล</span></button>
    </div>, document.body
  );
}

function DeckViewModal({ isOpen, onClose, deck, rules, onAddCard, onRemoveCard, title }) {
  const groupedDeck = useMemo(() => {
    if (!deck) return [];
    return Object.values(deck.reduce((m, card) => { const key = nameKey(card.name); if (!m[key]) m[key] = { card, count: 0 }; m[key].count++; return m; }, {})).sort((a, b) => a.card.name.localeCompare(b.card.name, 'th'));
  }, [deck]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[400] p-4">
      <div className="bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full h-full flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-emerald-500/20 shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title} ({deck.length} / {rules.size})</h2>
          <Button onClick={onClose}>Close</Button>
        </header>
        <div className="flex-grow overflow-y-auto p-4">
          {groupedDeck.length === 0 ? <div className="flex items-center justify-center h-full"><p className="text-slate-500 dark:text-slate-400">เด็คนี้ว่างเปล่า</p></div> : (
            <div className="flex flex-wrap justify-center gap-4">
              {groupedDeck.map(({ card, count }, index) => {
                const encodedImagePath = encodePath(card.imagePath);
                const fileId = card.id.replace(' - Only#1', '');
                const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
                const isAtMaxCopies = rules.maxCopiesPerName && count >= rules.maxCopiesPerName;
                return (
                  <div key={`${card.id}-${index}`} className="w-40 flex flex-col items-center">
                    <img src={thumbPng} alt={card.name} className="w-full rounded-lg shadow-md mb-2" />
                    <div className="w-full flex items-center justify-around gap-2 bg-slate-200 dark:bg-slate-800/50 p-1 rounded-md">
                      <button onClick={() => onRemoveCard(card)} className="flex items-center justify-center w-7 h-7 bg-red-700/70 dark:bg-red-800/70 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition active:scale-95 text-white font-bold text-xl">-</button>
                      <span className="font-bold text-lg text-slate-900 dark:text-white w-6 text-center">{count}</span>
                      <button onClick={() => onAddCard(card)} disabled={isAtMaxCopies} className="flex items-center justify-center w-7 h-7 bg-emerald-700/70 dark:bg-emerald-800/70 rounded-full hover:bg-emerald-600 dark:hover:bg-emerald-700 transition active:scale-95 text-white font-bold text-xl disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>, document.body
  );
}

function DeckAnalysisModal({ isOpen, onClose, mainDeck, lifeDeck, showAlert, theme, showChart, onSave, onShare }) { 
    const analysis = useMemo(() => {
        if (!mainDeck || mainDeck.length === 0) return null;
        const typeOrder = { 'Avatar': 1, 'Magic': 2, 'Construction': 3 };
        const only1Card = mainDeck.find(c => c.onlyRank === 1);
        const avatars = mainDeck.filter(c => c.type === 'Avatar' && c.onlyRank !== 1).sort((a, b) => a.name.localeCompare(b.name, 'th'));
        const magics = mainDeck.filter(c => c.type === 'Magic').sort((a, b) => a.name.localeCompare(b.name, 'th'));
        const constructs = mainDeck.filter(c => c.type === 'Construction').sort((a, b) => a.name.localeCompare(b.name, 'th'));
        const otherCards = mainDeck.filter(c => c.onlyRank !== 1 && !['Avatar', 'Magic', 'Construction'].includes(c.type)).sort((a, b) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99) || a.name.localeCompare(b.name, 'th'));
        const avgCost = avg(mainDeck.map(c => c.cost)); 
        const avgPower = avg(mainDeck.map(c => c.power)); 
        const avgGem = avg(mainDeck.map(c => c.gem));
        const typeCounts = countBy(mainDeck, c => c.type); 
        const cardTypes = Object.entries(typeCounts).sort(([a], [b]) => (typeOrder[a] || 99) - (typeOrder[b] || 99));
        const maxStatValue = 100;
        const earlyGameScore = (mainDeck.filter(c => (c.cost ?? 0) <= 2).length / (mainDeck.length * 0.5)) * maxStatValue; 
        const midGameScore = (mainDeck.filter(c => (c.cost ?? 0) >= 3 && (c.cost ?? 0) <= 5).length / (mainDeck.length * 0.4)) * maxStatValue; 
        const lateGameScore = (mainDeck.filter(c => (c.cost ?? 0) >= 6).length / (mainDeck.length * 0.2)) * maxStatValue; 
        const offenseScore = (parseFloat(avgPower) / 6) * maxStatValue; 
        const defenseScore = (mainDeck.filter(c => c.type !== 'Magic').length / 40) * maxStatValue; 
        const utilityScore = ((typeCounts['Magic'] || 0) / 15) * maxStatValue; 
        const radarData = { 
            labels: ['ความไวต้นเกม', 'กลางเกม', 'ท้ายเกม', 'พลังโจมตี', 'การป้องกัน', 'การสนับสนุน'], 
            datasets: [{ label: 'ศักยภาพเด็ค', data: [earlyGameScore, midGameScore, lateGameScore, offenseScore, defenseScore, utilityScore].map(v => Math.round(Math.min(100, Math.max(0, v || 0)))), backgroundColor: 'rgba(52, 211, 153, 0.2)', borderColor: 'rgb(52, 211, 153)', pointBackgroundColor: 'rgb(52, 211, 153)', pointBorderColor: '#000000ff', pointHoverBackgroundColor: '#000000ff', pointHoverBorderColor: 'rgb(52, 211, 153)' }]
        };
        const deckCode = encodeDeckCode(mainDeck, lifeDeck);
        return { avgCost, avgPower, avgGem, cardTypes, radarData, deckCode, only1Card, avatars, magics, constructs, otherCards };
    }, [mainDeck, lifeDeck, theme]);

    const isDark = theme === 'dark';
    const radarOptions = { scales: { r: { angleLines: { color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }, grid: { color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)' }, pointLabels: { color: isDark ? 'rgb(209, 213, 219)' : 'rgb(30, 41, 59)', font: { size: 12 } }, ticks: { color: isDark ? 'rgb(156, 163, 175)' : 'rgb(100, 116, 139)', backdropColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.75)', stepSize: 20, maxTicksLimit: 6 }, min: 0, max: 100 } }, plugins: { legend: { display: false }, tooltip: { enabled: true } }, maintainAspectRatio: false };
    
    const handleCopyCode = () => { if (analysis?.deckCode) navigator.clipboard.writeText(analysis.deckCode).then(() => showAlert("Success!", `✅ คัดลอกรหัสเด็คลง Clipboard แล้ว!`)).catch(err => { console.error('Failed to copy code: ', err); showAlert("Error", "ไม่สามารถคัดลอกรหัสเด็คได้"); }); };
    
    const renderCardSection = (title, cards) => {
        if (!cards || cards.length === 0) return null;
        const groupedCards = Object.values(cards.reduce((m, card) => { const key = card.id; if (!m[key]) m[key] = { card, count: 0 }; m[key].count++; return m; }, {})).sort((a, b) => a.card.name.localeCompare(b.card.name, 'th'));
        return (
            <div className="mt-6">
                <h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-300 border-b border-emerald-500/20 pb-1 mb-3">{title} ({cards.length} ใบ)</h4>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] md:grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] gap-2 justify-center">
                    {groupedCards.map(({ card, count }, index) => {
                        const encodedImagePath = encodePath(card.imagePath);
                        const fileId = card.id.replace(' - Only#1', '');
                        const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
                        return (
                            <div key={`${card.id}-${index}`} className="relative w-18 md:w-20 group">
                                <img src={thumbPng} alt={card.name} className="w-full rounded-md shadow transition-transform hover:scale-110 hover:z-10" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                                {count > 1 && <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full border-2 border-white dark:border-slate-800">{count}</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (!isOpen || !analysis) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[250] p-0 md:p-4">
            <div className="bg-slate-100 dark:bg-slate-900/80 border-0 md:border border-slate-300 dark:border-emerald-500/30 rounded-none md:rounded-xl shadow-2xl w-full h-full flex flex-col max-w-7xl md:max-h-[90vh]">
                <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-emerald-500/20 shrink-0">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate pr-2">ผลลัพธ์การสร้างเด็ค</h2>
                    <Button onClick={onClose}>Close</Button>
                </header>
                <div className="flex-grow overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6">
                    
                    {/* Sidebar (ซ้าย) */}
                    <div className="md:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
                        <div>
                            <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-300 border-b border-amber-500/20 pb-1 mb-3">สถิติเด็ค</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div><span className="text-sm text-gray-500 dark:text-gray-400">Avg Cost</span><p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{analysis.avgCost}</p></div>
                                <div><span className="text-sm text-gray-500 dark:text-gray-400">Avg Power</span><p className="text-2xl font-bold text-red-600 dark:text-red-400">{analysis.avgPower}</p></div>
                                <div><span className="text-sm text-gray-500 dark:text-gray-400">Avg Gem</span><p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{analysis.avgGem}</p></div>
                            </div>
                        </div>
                        {showChart && <div className="aspect-square w-full max-w-[350px] mx-auto"><Radar data={analysis.radarData} options={radarOptions} /></div>}
                        <div>
                            <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-300 border-b border-amber-500/20 pb-1 mb-3">ประเภทการ์ด</h3>
                            <ul className="space-y-1 text-sm text-slate-700 dark:text-gray-300">
                                {analysis.cardTypes.map(([type, count]) => <li key={type} className="flex justify-between"><span>{type}</span><span className="text-slate-900 dark:text-white font-semibold">{count} ใบ</span></li>)}
                            </ul>
                        </div>
                        
                        {/* 🟢 ส่วนจัดการเด็ค (เพิ่มปุ่ม Save / Share) */}
                        <div>
                            <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-300 border-b border-amber-500/20 pb-1 mb-3">จัดการเด็ค</h3>
                            <div className="flex flex-col gap-3">
                                <Button onClick={handleCopyCode} className="w-full">
                                    <CopyIcon /> คัดลอกรหัสเด็ค
                                </Button>
                                <div className="grid grid-cols-2 gap-2">
                                    {/* ✅✅✅ ปุ่ม Save ต้องเรียก onSave ✅✅✅ */}
                                    <Button onClick={onSave} className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-200">
                                        <DeckIcon /> บันทึก
                                    </Button>

                                    <Button onClick={onShare} className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 hover:bg-purple-200">
                                        <UploadIcon /> แชร์
                                    </Button>
                        </div>
                            </div>
                        </div>
                    </div>

                    {/* Cards List (ขวา) */}
                    <div className="md:col-span-2 overflow-y-auto pr-2 md:border-l border-slate-300 dark:border-emerald-500/20 md:pl-6">
                        <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-300 border-b border-amber-500/20 pb-1 mb-4">การ์ดในเด็ค ({mainDeck.length} ใบ)</h3>
                        {analysis.only1Card && <div className="mb-6 flex flex-col items-center"><h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-300 mb-3">Only #1</h4><div className="relative w-36 mx-auto"><img src={`/cards/${encodePath(analysis.only1Card.imagePath)}/${encodeURIComponent(analysis.only1Card.id.replace(' - Only#1', ''))}.png`} alt={analysis.only1Card.name} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} /></div></div>}
                        {renderCardSection("Avatar Cards", analysis.avatars)}{renderCardSection("Magic Cards", analysis.magics)}{renderCardSection("Construct Cards", analysis.constructs)}{analysis.otherCards.length > 0 && renderCardSection("Other Cards", analysis.otherCards)}{lifeDeck.length > 0 && renderCardSection("Life Deck", lifeDeck)}
                        <div className="h-20 md:h-0"></div>
                    </div>
                </div>
            </div>
        </div>, document.body
    );
}

function DeckListModal({ isOpen, onClose, userProfile, userDecks, setUserDecks, mainDeck, lifeDeck, setMainDeck, setLifeDeck, showAlert, setModal, closeModal, encodeDeckCode, decodeDeckCode, allCards, onShowCards }) {
  const [importingSlot, setImportingSlot] = useState(null);
  const [importCode, setImportCode] = useState('');

  if (!isOpen || !userProfile) return null;
  const email = userProfile?.email
;
  const getUserSlots = () => {
    const defaultSlots = [{ name: "Slot 1", main: [], life: [] }, { name: "Slot 2", main: [], life: [] }];
    const userData = userDecks[email] || { slots: defaultSlots };
    if (!userDecks[email]) setUserDecks(prev => ({ ...prev, [email]: userData }));
    return userData.slots;
  };
  const slots = getUserSlots();
  const updateSlots = (newSlots) => setUserDecks(prev => ({ ...prev, [email]: { ...prev[email], slots: newSlots } }));
  const handleNameChange = (index, newName) => { const newSlots = [...slots]; newSlots[index].name = newName; updateSlots(newSlots); };
  const handleSave = (index) => { const newSlots = [...slots]; newSlots[index] = { ...newSlots[index], main: mainDeck, life: lifeDeck }; updateSlots(newSlots); showAlert("Deck Saved!", `บันทึกเด็คปัจจุบันลงใน "${newSlots[index].name}" แล้ว`); };
  const handleLoad = (index) => { const slot = slots[index]; if (slot.main.length === 0 && slot.life.length === 0) { showAlert("Empty Slot", "Slot นี้ว่างเปล่า ไม่มีอะไรให้โหลด"); return; } setMainDeck(slot.main); setLifeDeck(slot.life); showAlert("Deck Loaded!", `โหลดเด็ค "${slot.name}" เรียบร้อย`); onClose(); };
  const handleExport = (index) => { const slot = slots[index]; if (slot.main.length === 0 && slot.life.length === 0) { showAlert("Empty Slot", "ไม่สามารถ Export Slot ที่ว่างเปล่าได้"); return; } const code = encodeDeckCode(slot.main, slot.life); navigator.clipboard.writeText(code).then(() => showAlert("Success!", `✅ คัดลอกรหัส Export ของ "${slot.name}" แล้ว!`)).catch(err => showAlert("Error", "ไม่สามารถคัดลอกรหัสได้")); };
  const handleImport = (index) => { setImportingSlot(index); setImportCode(''); };
  const confirmInternalImport = () => { const decoded = decodeDeckCode(importCode, allCards); if (decoded) { const newSlots = [...slots]; newSlots[importingSlot].main = decoded.main; newSlots[importingSlot].life = decoded.life; updateSlots(newSlots); showAlert("Import Success", `นำเข้าเด็คลงใน "${slots[importingSlot].name}" สำเร็จ!`); } else { showAlert("Import Error", "รหัสเด็คไม่ถูกต้อง หรือไม่พบการ์ด"); } setImportingSlot(null); };
  const handleClearSlot = (index) => { setModal({ title: "Clear Slot", message: `คุณต้องการล้างข้อมูลใน "${slots[index].name}" ใช่หรือไม่?`, onConfirm: () => { const newSlots = [...slots]; newSlots[index] = { ...newSlots[index], main: [], life: [] }; updateSlots(newSlots); closeModal(); showAlert("Slot Cleared", "ล้างข้อมูลเรียบร้อยแล้ว"); }, confirmText: "Clear", confirmIcon: <TrashIcon /> }); };
  const handleShareDeck = async (index) => {
    const slot = slots[index]; const only1Card = slot.main.find(c => c.onlyRank === 1);
    if (!only1Card) { showAlert("ไม่สามารถแชร์ได้", "เด็คของคุณต้องมี 'Only #1' Card (การ์ดหลัก) ก่อนจึงจะแชร์ได้ค่ะ"); return; }
    try {
      const q = query(collection(db, "publicDecks"), where("user.email", "==", userProfile?.email
));
      const querySnapshot = await getDocs(q);
      const existingDecks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const performShare = async (targetDeckId = null) => {
        closeModal();
        try {
          const batch = writeBatch(db);
          const newDeckRef = targetDeckId ? doc(db, "publicDecks", targetDeckId) : doc(collection(db, "publicDecks"));
          const deckId = newDeckRef.id;
          const allCardsInDeck = [...slot.main, ...slot.life];
          const factions = [...new Set(allCardsInDeck.map(c => c.faction).filter(Boolean))];
          const listData = { deckName: slot.name, only1CardData: { id: only1Card.id, name: only1Card.name, imagePath: only1Card.imagePath }, user: { name: userProfile.name, picture: userProfile.picture, email: userProfile?.email
 }, sharedAt: serverTimestamp(), likeCount: 0, likedBy: [], factions: factions, viewCount: 0 };
          const detailData = { mainDeck: slot.main.map(c => c.id), lifeDeck: slot.life.map(c => c.id) };
          batch.set(newDeckRef, listData); batch.set(doc(db, "publicDeckDetails", deckId), detailData); await batch.commit();
          showAlert(targetDeckId ? "เขียนทับเรียบร้อย!" : "แชร์เด็คสำเร็จ!", `เด็ค "${slot.name}" ถูกแชร์แล้ว!`);
        } catch (e) { console.error(e); showAlert("Error", "แชร์ไม่สำเร็จ"); }
      };
      if (existingDecks.length >= 2) {
        setModal({ isOpen: true, title: "โควตาเต็ม (Max 2 Decks)", message: (<div className="flex flex-col gap-3"><p>คุณแชร์ครบ 2 เด็คแล้ว เลือกเด็คที่ต้องการเขียนทับ:</p><div className="flex flex-col gap-2 mt-2">{existingDecks.map(d => (<button key={d.id} onClick={() => performShare(d.id)} className="p-3 rounded border hover:bg-red-50 text-left font-bold">{d.deckName}</button>))}</div><button onClick={closeModal} className="mt-2 text-sm underline self-center">ยกเลิก</button></div>), confirmText: null });
      } else { setModal({ isOpen: true, title: "Confirm Share", message: `แชร์เด็ค "${slot.name}" สู่สาธารณะ?`, onConfirm: () => performShare(null), confirmText: "Share", confirmIcon: <UploadIcon /> }); }
    } catch (e) { console.error(e); showAlert("Error", "ตรวจสอบข้อมูลไม่สำเร็จ"); }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[900] p-4">
      <div className="bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-emerald-500/20 shrink-0"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Decks</h2><Button onClick={onClose} className="px-3 py-1 text-sm">Close</Button></header>
        <div className="flex-grow overflow-y-auto p-4"><p className="text-sm text-slate-600 dark:text-gray-400 mb-4">Account: <span className="font-bold text-amber-600 dark:text-amber-300">{userProfile.name}</span></p><div className="flex flex-col md:grid md:grid-cols-2 gap-4">{slots.map((slot, index) => { const deckSize = slot.main.length + slot.life.length; const only1Card = slot.main.find(c => c.onlyRank === 1); let coverImage = null; if (only1Card) { const encodedImagePath = encodePath(only1Card.imagePath); const fileId = only1Card.id.replace(' - Only#1', ''); coverImage = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; } return (<div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"><div className="flex flex-row md:flex-col gap-3 h-full"><div className="shrink-0 w-20 h-28 md:w-full md:h-40 bg-slate-200 dark:bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center">{coverImage ? (<img src={coverImage} alt="Cover" className="w-full h-full object-cover md:object-contain" />) : (<span className="text-2xl">🃏</span>)}<div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">{deckSize} Cards</div></div><div className="flex-grow flex flex-col justify-between min-w-0"><div className="mb-2"><input type="text" value={slot.name} onChange={(e) => handleNameChange(index, e.target.value)} className="w-full bg-transparent border-b border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold text-lg focus:border-emerald-500 outline-none py-1" /></div><div className="flex flex-col gap-2"><div className="flex gap-2"><Button onClick={() => handleLoad(index)} disabled={deckSize === 0} className="flex-1 py-1.5 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200">Load</Button><Button onClick={() => handleSave(index)} className="flex-1 py-1.5 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200">Save</Button></div><div className="flex items-center justify-between gap-1 mt-1"><button onClick={() => onShowCards({ main: slot.main, life: slot.life })} disabled={deckSize === 0} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 disabled:opacity-30" title="Show Cards"><EyeIcon /></button><button onClick={() => handleImport(index)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700" title="Import"><ImportIcon /></button><button onClick={() => handleExport(index)} disabled={deckSize === 0} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 disabled:opacity-30" title="Export"><ExportIcon /></button><button onClick={() => handleShareDeck(index)} disabled={deckSize === 0} className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 disabled:opacity-30" title="Share"><ShareIconNew /></button><div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div><button onClick={() => handleClearSlot(index)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20" title="Clear"><TrashIcon /></button></div></div></div></div></div>); })}</div></div></div>
      {importingSlot !== null && createPortal(<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[230] p-4"><div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md"><h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Import to "{slots[importingSlot].name}"</h2><textarea value={importCode} onChange={(e) => setImportCode(e.target.value)} placeholder="วางรหัสเด็คที่นี่..." rows="4" className="w-full px-3 py-2 border border-slate-300 dark:border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white mb-4 resize-none" /><div className="flex justify-end gap-3"><Button onClick={() => setImportingSlot(null)} className="bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-gray-300">Cancel</Button><Button onClick={confirmInternalImport} className="bg-emerald-600 text-white hover:bg-emerald-500 border-none"><ImportIcon /> Import</Button></div></div></div>, document.body)}
    </div>, document.body
  );
}

// === Sidebar ===
function LeftSidebar({ isSidebarOpen, searchTerm, setSearchTerm, allCardTypes, filterTypes, setFilterTypes, filterMagicType, setFilterMagicType, allColorTypes, filterColors, setFilterColors, allRarities, filterRarities, setFilterRarities, allSets, selectedSets, onSetSelectionChange, statFilters, onStatFilterChange, mainDeck, lifeDeck, RULES, addToMain, addToLife, removeFromMain, removeFromLife, handleImport, handleExport, handleClear, handleReloadFromTxt, mainDeckRef, onViewDeck, onAnalyzeDeck, isLoadingAnalysis }) {
  const allMagicTypes = ["Modification", "Land", "React", "Normal"];
  const handleToggle = (setter, value) => setter((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]);
  return (
    <aside className={`w-full h-full flex flex-col p-4 bg-transparent overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-600 md:w-full md:shrink-0 md:border-r border-slate-300 dark:border-emerald-700/30 z-30 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
      <div className="space-y-4 pb-4">
        <div><h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Filters</h2><input type="search" placeholder="ค้นหาชื่อการ์ด..." className="w-full px-4 py-2 border border-slate-300 dark:border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-white/50 dark:bg-slate-700/50 placeholder-gray-500 dark:placeholder-gray-400 text-slate-900 dark:text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        {allCardTypes.length > 0 && (<div className="flex flex-wrap gap-2"><button onClick={() => setFilterTypes([])} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterTypes.length === 0 ? "bg-amber-500 text-white font-semibold shadow" : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"}`}>All</button>{allCardTypes.map((type) => (<button key={type} onClick={() => handleToggle(setFilterTypes, type)} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterTypes.includes(type) ? "bg-amber-500 text-white font-semibold shadow" : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"}`}>{type}</button>))}</div>)}
        {filterTypes.includes("Magic") && (<div className="pl-4 mt-2 border-l-2 border-slate-300 dark:border-slate-600"><h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 mt-2 mb-2 uppercase tracking-wider">Magic Type</h3><div className="flex flex-wrap gap-2">{["All", ...allMagicTypes].map((magicType) => (<button key={magicType} onClick={() => setFilterMagicType(magicType)} className={`px-3 py-1 text-xs rounded-full transition-colors ${filterMagicType === magicType ? "bg-amber-600 text-white font-semibold shadow" : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-700 dark:text-gray-300"}`}>{magicType}</button>))}</div></div>)}
        {allColorTypes.length > 0 && (<div><h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 mt-4 mb-2 uppercase tracking-wider">Color</h3><div className="flex flex-wrap gap-2"><button onClick={() => setFilterColors([])} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterColors.length === 0 ? "bg-amber-500 text-white font-semibold shadow" : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"}`}>All</button>{allColorTypes.map((color) => (<button key={color} onClick={() => handleToggle(setFilterColors, color)} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterColors.includes(color) ? "bg-amber-500 text-white font-semibold shadow" : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"}`}>{color}</button>))}</div></div>)}
        {allRarities.length > 0 && (<div><h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 mt-4 mb-2 uppercase tracking-wider">Rarity</h3><div className="flex flex-wrap gap-2"><button onClick={() => setFilterRarities([])} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterRarities.length === 0 ? "bg-amber-500 text-white font-semibold shadow" : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"}`}>All</button>{allRarities.map((rarity) => (<button key={rarity} onClick={() => handleToggle(setFilterRarities, rarity)} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterRarities.includes(rarity) ? "bg-amber-500 text-white font-semibold shadow" : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"}`}>{rarity}</button>))}</div></div>)}
        {allSets.length > 0 && (<div><h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 mt-4">Sets</h3><div className="space-y-2 max-h-40 overflow-y-auto pr-2 border border-slate-200 dark:border-slate-700 rounded p-2">{allSets.map((set) => (<label key={set} className="flex items-center gap-2 text-slate-700 dark:text-gray-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded"><input type="checkbox" checked={selectedSets.includes(set)} onChange={() => onSetSelectionChange(set)} className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-600 border-slate-400 dark:border-slate-500 text-amber-500 focus:ring-amber-500" />{typeof set === "string" ? set.split("/")[1] || set : set}</label>))}</div></div>)}
        <div><h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 mt-4">Stats</h3><div className="grid grid-cols-3 gap-2 text-sm">{["cost", "power", "gem"].map((stat) => (<div key={stat}><label className="capitalize text-slate-500 dark:text-gray-400">{stat}</label><select value={statFilters[stat].min} onChange={(e) => onStatFilterChange(stat, "min", e.target.value)} className="w-full mt-1 px-2 py-1 border border-slate-300 dark:border-emerald-500/30 rounded-md bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-center appearance-none cursor-pointer"><option value="">Min</option>{[...Array(11).keys()].map(n => (<option key={n} value={n}>{n}</option>))}</select><select value={statFilters[stat].max} onChange={(e) => onStatFilterChange(stat, "max", e.target.value)} className="w-full mt-1 px-2 py-1 border border-slate-300 dark:border-emerald-500/30 rounded-md bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-center appearance-none cursor-pointer"><option value="">Max</option>{[...Array(11).keys()].map(n => (<option key={n} value={n}>{n}</option>))}</select></div>))}</div></div>
      </div>
      <div className="pt-4 pb-20 border-t border-slate-300 dark:border-emerald-700/30 bg-transparent"><div className="flex flex-col gap-4 mb-4"><DeckTray ref={mainDeckRef} title={`Main Deck`} deck={mainDeck} capacity={RULES.main.size} onDropCard={addToMain} onRemoveCard={removeFromMain} highlight onViewDeck={() => onViewDeck("main")} /><DeckTray title={`Life Deck`} deck={lifeDeck} capacity={RULES.life.size} onDropCard={addToLife} onRemoveCard={removeFromLife} onViewDeck={() => onViewDeck("life")} /></div><Button onClick={onAnalyzeDeck} disabled={isLoadingAnalysis} className="w-full bg-emerald-200 dark:bg-emerald-600/30 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-300 dark:hover:bg-emerald-500/50 dark:hover:text-white">{isLoadingAnalysis ? "กำลังประมวลผล..." : "สร้างเด็ค"}</Button><div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-300 dark:border-emerald-700/30"><Button onClick={handleImport}><ImportIcon /> Import</Button><Button onClick={handleExport}><ExportIcon /> Export</Button><Button onClick={handleClear} className="col-span-2 bg-red-200 dark:bg-red-900/50 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-300 dark:hover:bg-red-800/50 dark:hover:text-white"><TrashIcon /> Clear Deck</Button><Button onClick={handleReloadFromTxt} className="col-span-2"><DBLoadIcon /> Reload from TXT</Button></div></div>
    </aside>
  );
}

// === Card grid (right) ===
function CardGrid({ cards, onDoubleClick, onViewDetails, onAddCard, onAuction }) {
  const [activeZoomKey, setActiveZoomKey] = useState(null);
  const handleMobileZoom = (key) => setActiveZoomKey(prev => prev === key ? null : key);
  if (cards.length === 0) return (<CardShell><div className="text-center py-16 text-slate-600 dark:text-slate-300">ไม่พบการ์ดตามเงื่อนไข</div></CardShell>);
  return (<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-2 gap-y-4 pb-32">{cards.map((card, index) => { const uniqueKey = `${card.id}-${index}`; return (<CardItem key={uniqueKey} card={card} onDoubleClick={onDoubleClick} onViewDetails={onViewDetails} onAddCard={onAddCard} isMobileZoomed={activeZoomKey === uniqueKey} onMobileClick={() => handleMobileZoom(uniqueKey)} onAuction={onAuction} />); })}</div>);
}

// === Constants and Functions ===
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

async function fetchAllTxt() { let allCards = []; console.log("📦 Reloading cards from TXT..."); for (const { path: pathString, file: filename } of CARD_PATHS) { const encodedPath = encodePath(pathString); const url = `/cards/${encodedPath}/${encodeURIComponent(filename)}`; try { const res = await fetch(url); if (!res.ok) { console.warn(`Could not fetch ${url}. Status: ${res.status}`); continue; } const txt = await res.text(); const data = JSON.parse(txt); if (Array.isArray(data)) { const withPath = data.map(card => ({ ...card, imagePath: pathString, onlyRank: card.id.includes('- Only#1') ? 1 : card.onlyRank })); allCards = allCards.concat(withPath); console.log(`  ✔ ${data.length} from ${pathString} (File: ${filename})`); } } catch (e) { console.error(`load fail ${url}`, e); } } console.log(`✅ โหลดการ์ดทั้งหมด ${allCards.length} ใบ`); return allCards; }
const getMagicSubType = (card) => card.type !== 'Magic' ? null : (card.magicType || 'Normal');
const nameKey = (n) => (n || "").trim().toLowerCase();
function countBy(arr, keyFn) { return arr.reduce((m, x) => { const k = keyFn(x); m[k] = (m[k] || 0) + 1; return m; }, {}); }
function useLocalStorage(key, initial) { const [v, s] = useState(() => { try { const raw = localStorage.getItem(key); if (!raw || raw === "[]" || raw === "null") return initial; return JSON.parse(raw); } catch { return initial; } }); useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]); return [v, s]; }
function validate(mainDeck, lifeDeck) { const problems = []; const ok = { main: true, life: true }; if (mainDeck.length !== RULES.main.size) { problems.push(`Main Deck ต้องมี ${RULES.main.size} ใบ (ปัจจุบัน ${mainDeck.length})`); ok.main = false; } const byNameMain = countBy(mainDeck, (c) => nameKey(c.name)); const overCopies = Object.entries(byNameMain).filter(([, n]) => n > RULES.main.maxCopiesPerName); if (overCopies.length) { overCopies.forEach(([k, n]) => problems.push(`การ์ด “${k}” ใน Main Deck ซ้ำเกิน ${RULES.main.maxCopiesPerName} ใบ (มี ${n} ใบ)`)); ok.main = false; } const onlyRank1Count = mainDeck.filter((c) => c.onlyRank === 1).length; if (mainDeck.length > 0 && onlyRank1Count > 0 && onlyRank1Count !== RULES.main.requireOnlyRank1Exactly) { problems.push(`Main Deck สามารถมี “Only #1” ได้แค่ ${RULES.main.requireOnlyRank1Exactly} ใบ (ปัจจุบัน ${onlyRank1Count})`); ok.main = false; } if (lifeDeck.length !== RULES.life.size) { problems.push(`Life Deck ต้องมี ${RULES.life.size} ใบ (ปัจจุบัน ${lifeDeck.length})`); ok.life = false; } if (RULES.life.uniqueNames) { const byNameLife = countBy(lifeDeck, (c) => nameKey(c.name)); const duplicateLife = Object.entries(byNameLife).filter(([, n]) => n > 1); if (duplicateLife.length) { duplicateLife.forEach(([k]) => problems.push(`การ์ดใน Life Deck ต้องชื่อไม่ซ้ำกัน: “${k}”`)); ok.life = false; } } return { problems, ok }; }
const avg = (arr) => { const valid = arr.filter(n => typeof n === 'number' && !isNaN(n)); if (valid.length === 0) return '0.00'; return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2); };
const encodeDeckCode = (mainDeck, lifeDeck) => { const mainIds = mainDeck.map(c => c.id); const lifeIds = lifeDeck.map(c => c.id); const dataString = JSON.stringify({ m: mainIds, l: lifeIds }); try { return btoa(dataString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); } catch (e) { console.error("Encoding failed:", e); return ""; } };
const decodeDeckCode = (code, allCards) => { const trimmedCode = (code || "").trim(); if (!trimmedCode) return null; try { let base64 = trimmedCode.replace(/-/g, '+').replace(/_/g, '/'); while (base64.length % 4 !== 0) { base64 += '='; } const dataString = atob(base64); const data = JSON.parse(dataString); if (!data || !Array.isArray(data.m) || !Array.isArray(data.l)) { throw new Error("Invalid deck code format"); } const findCard = (id) => allCards.find(c => c.id === id); const main = data.m.map(findCard).filter(card => card !== undefined); const life = data.l.map(findCard).filter(card => card !== undefined); return { main, life }; } catch (e) { console.error("Decoding failed:", e); return null; } };
const RULES = { main: { size: 50, maxCopiesPerName: 4, requireOnlyRank1Exactly: 1 }, life: { size: 5, uniqueNames: true, maxCopiesPerName: 1 }, };
const DND_TYPES = { CARD: "CARD" };
const encodePath = (p) => p.split('/').map(encodeURIComponent).join('/');
const DndStateContext = createContext({ isDragging: false });
const DndStateProvider = ({ children }) => { const { isDragging } = useDragLayer((monitor) => ({ isDragging: monitor.isDragging() })); return <DndStateContext.Provider value={{ isDragging }}>{children}</DndStateContext.Provider>; };
const useIsDragging = () => useContext(DndStateContext);
function CustomDragLayer() { const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({ item: monitor.getItem(), isDragging: monitor.isDragging(), currentOffset: monitor.getSourceClientOffset(), })); if (!isDragging || !currentOffset) return null; const { card } = item; const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(/\s*(\(.*\)|- Only#1)$/, ''); const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; return ( <div style={{ position: 'fixed', pointerEvents: 'none', zIndex: 1000, left: 0, top: 0, transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)` }}> <img src={imgPng} alt={card.name} className="w-40 h-auto rounded-lg shadow-2xl" /> </div> ); }
function FlyingCard({ card, startRect, endRect, onComplete }) { const [isAnimating, setIsAnimating] = useState(false); const hasCompleted = useRef(false); useEffect(() => { const timeoutId = setTimeout(() => setIsAnimating(true), 10); return () => clearTimeout(timeoutId); }, []); if (!card || !startRect || !endRect) return null; const handleTransitionEnd = () => { if (!hasCompleted.current) { hasCompleted.current = true; onComplete(); } }; const style = { position: 'fixed', zIndex: 1000, top: `${startRect.top}px`, left: `${startRect.left}px`, width: `${startRect.width}px`, height: `${startRect.height}px`, transition: 'all 0.5s ease-in-out' }; if (isAnimating) { style.top = `${endRect.top + endRect.height / 2 - 35}px`; style.left = `${endRect.left + endRect.width / 2 - 25}px`; style.width = '50px'; style.height = '70px'; style.opacity = 0; style.transform = 'rotate(15deg)'; } const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(/\s*(\(.*\)|- Only#1)$/, ''); const imgSrc = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; return ( <div style={style} onTransitionEnd={handleTransitionEnd}> <img src={imgSrc} alt={card.name} className="w-full h-full rounded-lg shadow-2xl" /> </div> ); }
const FlyingLight = ({ startRect, endRect, onComplete }) => { const [style, setStyle] = useState({ position: 'fixed', top: startRect.top + startRect.height / 2, left: startRect.left + startRect.width / 2, opacity: 1, transform: 'translate(-50%, -50%) scale(1)', }); useEffect(() => { requestAnimationFrame(() => { setStyle({ position: 'fixed', top: endRect.top + endRect.height / 2, left: endRect.left + endRect.width / 2, opacity: 0, transform: 'translate(-50%, -50%) scale(0.2)', transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }); }); const timer = setTimeout(onComplete, 1000); return () => clearTimeout(timer); }, []); return ( <div className="z-[9999] w-6 h-6 rounded-full bg-amber-400 shadow-[0_0_15px_4px_rgba(251,191,36,0.8)] pointer-events-none" style={style} /> ); };
const CardItem = forwardRef(function CardItem({ card, onDoubleClick, onViewDetails, onAddCard, isMobileZoomed, onMobileClick, onAuction }, ref) { const cardItemRef = useRef(null); const { isDragging: isAnythingDragging } = useIsDragging(); const [{ isDragging }, dragRef] = useDrag({ type: DND_TYPES.CARD, item: { card }, collect: (m) => ({ isDragging: m.isDragging() }) }); const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(' - Only#1', ''); const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; const imgJpg = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.jpg`; const hoverClasses = !isAnythingDragging ? 'lg:hover:scale-[1.25] lg:hover:z-[80]' : ''; const mobileZoomClasses = isMobileZoomed ? 'scale-[1.15] z-[10] shadow-2xl border-amber-500/50' : ''; const handleClick = () => { if (window.innerWidth < 1024) { onMobileClick(); } }; return ( <CardShell ref={cardItemRef} onClick={handleClick} className={` flex flex-col card group relative ${isDragging ? 'opacity-0' : ''} transition-transform duration-200 ease-in-out ${hoverClasses} ${mobileZoomClasses} p-0.5 lg:p-4 `} > <div className="absolute top-1 right-1 z-10 flex flex-col gap-1 lg:gap-2 lg:top-2 lg:right-2"> <button onClick={(e) => { e.stopPropagation(); onViewDetails(card); }} className="p-1 lg:p-1.5 bg-slate-100/80 dark:bg-slate-900/80 rounded-full text-amber-600 dark:text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-black dark:hover:text-white" title="ดูรายละเอียด" > <EyeIcon /> </button> <button onClick={(e) => { e.stopPropagation(); onAddCard(card, e.currentTarget); }} className="p-1 lg:p-1.5 bg-emerald-600/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 active:scale-95" title="เพิ่มลงเด็ค" > <PlusIcon /> </button> <button onClick={(e) => { e.stopPropagation(); onAuction(card); }} className="p-1 lg:p-1.5 bg-amber-500/90 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-600 active:scale-95 shadow-md" title="เปิดประมูล" > <GavelIcon /> </button> </div> <img ref={dragRef} src={imgPng} alt={card.name} onDoubleClick={() => onDoubleClick(card, cardItemRef.current)} onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = imgJpg; else { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/300x420/1e293b/94a3b8?text=${encodeURIComponent(card.name)}`; } }} className="w-full h-auto rounded-[4px] lg:rounded-md mb-0 lg:mb-3 object-cover aspect-[5/7] bg-slate-200 dark:bg-slate-700 shadow hover:shadow-xl transition-shadow cursor-grab active:cursor-grabbing" loading="lazy" /> <div className="hidden lg:flex flex-grow flex-col justify-between"> <div> <div className="flex justify-between items-start gap-2"> <p className="font-bold text-xl text-slate-900 dark:text-white pr-2 line-clamp-2">{card.name}</p> <div className="flex items-center gap-2 shrink-0"> {card.colorType && <ColorPip color={card.colorType} />} <Pill className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-gray-200">{card.type}</Pill> </div> </div> {card.rarity && <Pill className="mt-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{card.rarity}</Pill>} {card.onlyRank === 1 && <Pill className="mt-2 ml-1 bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">Only #1</Pill>} </div> </div> <div className="hidden lg:block absolute top-full mt-1 left-0 right-0 z-[60] p-4 bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-amber-500/50 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto max-h-96 overflow-y-auto"> <div className="grid grid-cols-3 gap-2 text-center"> <div><span className="text-base text-emerald-600 dark:text-emerald-400">Cost</span><p className="font-bold text-2xl text-slate-900 dark:text-white">{card.cost ?? '-'}</p></div> <div><span className="text-base text-red-600 dark:text-red-400">Power</span><p className="font-bold text-2xl text-slate-900 dark:text-white">{card.power ?? '-'}</p></div> <div><span className="text-base text-amber-600 dark:text-amber-400">Gem</span><p className="font-bold text-2xl text-slate-900 dark:text-white">{card.gem ?? '-'}</p></div> </div> <div className="pt-2"> <p className="text-base text-slate-500 dark:text-gray-400">ฝ่าย: <span className="font-semibold text-slate-700 dark:text-gray-200">{card.faction ?? 'ไม่มี'}</span></p> <p className="text-base text-slate-700 dark:text-gray-300 font-light mt-1 break-words">{card.text || 'ไม่มีเอฟเฟ็ค'}</p> {card.flavor && ( <p className="text-sm text-amber-700/70 dark:text-amber-200/70 italic mt-2 font-light break-words">"{card.flavor}"</p> )} </div> </div> </CardShell> ); });
const DeckTray = forwardRef(function DeckTray({ title, deck, onDropCard, onRemoveCard, capacity, highlight, onViewDeck }, ref) { const [{ isOver }, dropRef] = useDrop({ accept: DND_TYPES.CARD, drop: (item) => onDropCard(item.card), collect: (monitor) => ({ isOver: monitor.isOver() }), }); const groupedDeck = useMemo(() => { return Object.values(deck.reduce((m, card) => { const key = nameKey(card.name); if (!m[key]) m[key] = { card, count: 0 }; m[key].count++; return m; }, {})).sort((a, b) => a.card.name.localeCompare(b.card.name, "th")); }, [deck]); const cardsPerRow = 12; const numRows = groupedDeck.length > 0 ? Math.floor((groupedDeck.length - 1) / cardsPerRow) + 1 : 1; const containerHeight = numRows * 40 + 40; return ( <div ref={ref} className={`p-2 rounded-md border-2 ${isOver || highlight ? "border-amber-400" : "border-slate-300 dark:border-slate-600"} transition-colors bg-slate-100 dark:bg-slate-900/50`} > <div ref={dropRef}> <div className="flex items-center justify-between mb-2 gap-2"> <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider shrink-0"> {title} </h3> {onViewDeck && deck.length > 0 && ( <button onClick={onViewDeck} className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-200 hover:underline transition" > ดูเด็ค </button> )} <div className="flex-grow text-right"> {typeof capacity === "number" && ( <span className="text-xs text-slate-600 dark:text-slate-300"> {deck.length} {capacity ? ` / ${capacity}` : ""} </span> )} </div> </div> <div className="relative w-full transition-all" style={{ height: `${containerHeight}px` }}> {groupedDeck.length === 0 ? ( <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs"> ลากการ์ดมาวางที่นี่ </div> ) : ( <div className="absolute inset-0"> {groupedDeck.map(({ card, count }, index) => { const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(" - Only#1", ""); const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; const rowIndex = Math.floor(index / cardsPerRow); const colIndex = index % cardsPerRow; return ( <div key={`${card.id}-${index}`} className="absolute transition-all duration-200 ease-in-out group hover:-translate-y-2 hover:z-50" style={{ left: `${colIndex * 22}px`, top: `${rowIndex * 40}px`, zIndex: colIndex, width: "56px", }} title={`คลิกเพื่อลบ ${card.name}`} onClick={() => onRemoveCard(card)} > <img src={thumbPng} alt={card.name} className="w-full h-auto rounded-md shadow-lg border-2 border-slate-300 dark:border-slate-600 group-hover:border-red-500 cursor-pointer" onError={(e) => { if (!e.currentTarget.src.endsWith(".jpg")) { e.currentTarget.src = e.currentTarget.src.replace(".png", ".jpg"); } }} /> {count > 1 && ( <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full border-2 border-white dark:border-slate-800"> {count} </div> )} </div> ); })} </div> )} </div> </div> </div> ); });

// === Main App ===
export default function App() {
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [auctionTargetCard, setAuctionTargetCard] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 🟢 State สำหรับ Warning Popup
  const [warningMessage, setWarningMessage] = useState(null);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = /(Line|FBAN|FBAV|Instagram|Messenger)/i.test(ua);
    if (isInApp && location.pathname !== '/open-browser') {
      navigate('/open-browser', { replace: true });
    }
  }, [location, navigate]);

  const [theme, setTheme] = useLocalStorage('bot-theme', 'dark');
  const [flyingLights, setFlyingLights] = useState([]);
  const toggleBtnRef = useRef(null);

  const triggerLightEffect = (startElem) => {
    if (!startElem || !toggleBtnRef.current) return;
    const startRect = startElem.getBoundingClientRect();
    const endRect = toggleBtnRef.current.getBoundingClientRect();
    const newLight = { id: Date.now(), startRect, endRect };
    setFlyingLights(prev => [...prev, newLight]);
  };

  const removeLight = (id) => {
    setFlyingLights(prev => prev.filter(l => l.id !== id));
  };

  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollTop > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [mainDeck, setMainDeck] = useLocalStorage("bot-mainDeck-v32-final", []);
  const [lifeDeck, setLifeDeck] = useLocalStorage("bot-lifeDeck-v32-final", []);
  const [cardDb, setCardDb] = useLocalStorage("bot-cardDb-v32-final", []);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [userDecks, setUserDecks] = useLocalStorage("bot-userDecks-v1", {});
  const [isDeckListModalOpen, setIsDeckListModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [flyingCard, setFlyingCard] = useState(null);
  const mainDeckRef = useRef(null);
  const [zoomedCard, setZoomedCard] = useState(null);
  const [analysisDeck, setAnalysisDeck] = useState({ deck: null, showChart: true });
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [activeView, setActiveView] = useState('cards');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTypes, setFilterTypes] = useState([]);
  const [filterMagicType, setFilterMagicType] = useState("All");
  const [filterColors, setFilterColors] = useState([]);
  const [filterRarities, setFilterRarities] = useState([]);
  const [selectedSets, setSelectedSets] = useState([]);
  const [statFilters, setStatFilters] = useState({ cost: { min: '', max: '' }, power: { min: '', max: '' }, gem: { min: '', max: '' } });
  const allCardTypes = useMemo(() => Array.from(new Set(cardDb.map(c => c.type).filter(Boolean))).sort(), [cardDb]);
  const allColorTypes = useMemo(() => Array.from(new Set(cardDb.map(c => c.colorType).filter(Boolean))).sort(), [cardDb]);
  const allRarities = useMemo(() => Array.from(new Set(cardDb.map(c => c.rarity).filter(Boolean))).sort(), [cardDb]);
  const allSets = useMemo(() => Array.from(new Set(cardDb.map(c => c.imagePath).filter(Boolean))).sort(), [cardDb]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 30;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const closeModal = () => setModal({ isOpen: false, title: '', message: '', onConfirm: null });
  const showAlert = (title, message) => setModal({ isOpen: true, title, message, onConfirm: null });
  const closeImportModal = () => setIsImportModalOpen(false);
  const [userProfile, setUserProfile] = useLocalStorage("bot-userProfile-v1", null);
  const [userReputation, setUserReputation] = useState({});
  const [customProfile, setCustomProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 🟢 [UPDATED] State สำหรับ Tutorial
  const [showAuctionTutorial, setShowAuctionTutorial] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false); // 🆕 เก็บสถานะ Checkbox

  // 🟢 Realtime Listener สำหรับ Warning Message
  useEffect(() => {
    if (!userProfile?.email) return;
    const unsub = onSnapshot(doc(db, "users", userProfile?.email
), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            // เช็คว่ามี Warning message ไหม
            if (data.warningMessage) {
                setWarningMessage(data.warningMessage);
            } else {
                setWarningMessage(null);
            }
        }
    });
    return () => unsub();
  }, [userProfile]);

  // 🟢 ฟังก์ชันเคลียร์ Warning Message เมื่อกดตกลง
  const handleClearWarning = async () => {
      if (!userProfile?.email) return;
      try {
          await updateDoc(doc(db, "users", userProfile?.email
), {
              warningMessage: deleteField()
          });
          setWarningMessage(null);
      } catch (error) {
          console.error("Error clearing warning:", error);
      }
  };

  // 🟢 [UPDATED] เช็คว่าต้องแสดง Tutorial หรือไม่ (เช็ค localStorage ด้วย)
  useEffect(() => {
    const isHidden = localStorage.getItem("bot-hide-auction-tutorial"); // ดูว่าเคยปิดถาวรไหม

    if (location.state?.showAuctionTutorial && !isHidden) {
        setShowAuctionTutorial(true);
        // เคลียร์ state ของ location ทิ้ง เพื่อไม่ให้แสดงซ้ำตอน refresh
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  // 🟢 [NEW] ฟังก์ชันปิด Tutorial (พร้อมบันทึกค่าถ้าติ๊กถูก)
  const handleCloseTutorial = () => {
      if (dontShowAgain) {
          localStorage.setItem("bot-hide-auction-tutorial", "true");
      }
      setShowAuctionTutorial(false);
  };
  
  const displayUser = useMemo(() => {
    if (!userProfile) return null;
    if (!customProfile) return userProfile;
    return {
      ...userProfile,
      ...customProfile,
      name: customProfile.displayName || userProfile.name,
      picture: customProfile.avatarUrl || userProfile.picture
    };
  }, [userProfile, customProfile]);

  const fetchUserProfile = async (email) => {
    if (!email) return;
    try {
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCustomProfile(data);
        if (!data.isSetup) setIsProfileModalOpen(true);
      } else {
        setIsProfileModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const profileData = { 
        name: user.displayName, 
        email: user.email, 
        picture: user.photoURL + "?height=500" 
      };

      setUserProfile(profileData);
      
      if (!userDecks[profileData.email]) {
        setUserDecks(prev => ({
          ...prev,
          [profileData.email]: {
            slots: [{ name: "ใส่ชื่อเด็คของคุณ", main: [], life: [] }, { name: "ใส่ชื่อเด็คของคุณ", main: [], life: [] }]
          }
        }));
      }
      
      fetchUserProfile(profileData.email);
      
      if (location.state?.from) {
          navigate(location.state.from);
      } else {
          // ถ้าเข้าหน้าแรกปกติ ก็ไม่ต้อง Redirect (อยู่หน้า Dashboard)
          // หรือถ้าต้องการให้ default ไป Auction ก็ใส่ navigate('/auction') ตรงนี้
      }

    } catch (error) {
      console.error("Facebook Login Error:", error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        showAlert("Login Failed", "อีเมลนี้ลงทะเบียนด้วยวิธีอื่นไปแล้ว (เช่น Google)");
      } else {
        showAlert("Login Failed", "ไม่สามารถเข้าสู่ระบบด้วย Facebook ได้");
      }
    }
  };

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUserProfile({ name: decoded.name, email: decoded.email, picture: decoded.picture });
      if (!userDecks[decoded.email]) {
        setUserDecks(prev => ({
          ...prev,
          [decoded.email]: {
            slots: [{ name: "Slot 1", main: [], life: [] }, { name: "Slot 2", main: [], life: [] }]
          }
        }));
      }
      
      // ✅ ตรวจสอบว่ามีหน้าเดิมที่ต้องกลับไปไหม
      if (location.state?.from) {
          navigate(location.state.from);
      } else {
          // เข้ามาแบบปกติ ไม่ต้องทำอะไร (แสดงหน้า App)
      }
      
    } catch (error) { console.error("Failed to decode JWT:", error); }
  };

  const handleLoginError = () => { showAlert("Login Failed", "ไม่สามารถเข้าสู่ระบบได้"); };

  const handleLogout = () => {
    googleLogout();
    setUserProfile(null);
    setCustomProfile(null);
    setIsDeckListModalOpen(false);
    setIsSettingsOpen(false);
  };

  const handleSaveProfile = async (data) => {
    if (!userProfile) return;
    try {
      const batch = writeBatch(db);
      
      // 🟢 แก้ไข: เพิ่ม facebook, lineId, phone ลงใน Database
      batch.set(doc(db, "users", userProfile.email), {
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        facebook: data.facebook || "", // บันทึกค่าว่างถ้าไม่มี
        lineId: data.lineId || "",
        phone: data.phone || "",
        isSetup: true,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // อัปเดตชื่อ/รูปใน Public Decks (เหมือนเดิม)
      const decksSnap = await getDocs(query(collection(db, "publicDecks"), where("user.email", "==", userProfile.email)));
      decksSnap.forEach(doc => batch.update(doc.ref, { "user.name": data.displayName, "user.picture": data.avatarUrl }));
      
      // อัปเดตใน Comment (เหมือนเดิม)
      const allDecksSnap = await getDocs(collection(db, "publicDecks"));
      const currentName = customProfile?.displayName || userProfile.name;
      const oldNameTarget = "Siwakorn Reangchinda"; // หรือชื่อเก่าที่ต้องการแก้
      for (const deckDoc of allDecksSnap.docs) {
        const commentsSnap = await getDocs(collection(db, "publicDecks", deckDoc.id, "comments"));
        commentsSnap.forEach(cDoc => {
          const cData = cDoc.data();
          if (cData.userId === userProfile.email || cData.userName === currentName || cData.userName === oldNameTarget) {
            batch.update(cDoc.ref, {
              userId: userProfile.email,
              userName: data.displayName,
              userPicture: data.avatarUrl
            });
          }
        });
      }

      await batch.commit();
      
      // 🟢 อัปเดตตัวแปรในเครื่องทันทีเพื่อให้เห็นผลเลย
      setCustomProfile(p => ({ ...p, ...data, isSetup: true }));
      
      setIsProfileModalOpen(false);
      showAlert("Success", "บันทึกข้อมูลเรียบร้อย!");
    } catch (e) {
      console.error(e);
      showAlert("Error", "บันทึกไม่สำเร็จ");
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => { if (cardDb.length === 0) { handleReloadFromTxt(); } }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterTypes, filterMagicType, filterColors, filterRarities, selectedSets, statFilters]);
  useEffect(() => {
    if (userProfile?.email) fetchUserProfile(userProfile?.email
);
  }, []);

 // 🟢 [UPDATED] ดึงข้อมูล User + ยอดเงิน (Wallet)
  useEffect(() => {
    if (userProfile?.email) {
      const fetchStats = async () => {
        const { data, error } = await supabase
          .from('user_stats')
          .select('user_email, total_score, wallet_balance') 
          .eq('user_email', userProfile?.email
)
          .single();
        
        if (data) {
          console.log("💰 Wallet Balance:", data.wallet_balance);
          setUserReputation({ [data.user_email]: data });
        }
      };

      fetchStats();

      // Realtime: ฟังการเปลี่ยนแปลงที่ตาราง user_stats
      const channel = supabase
        .channel('realtime_balance')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_stats' }, 
          (payload) => {
            if (payload.new && payload.new.user_email === userProfile?.email
) {
                console.log("🔔 ยอดเงินเปลี่ยน!", payload.new.wallet_balance);
                fetchStats(); 
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userProfile]);

  const handleShareCurrentDeck = async () => {
    if (!userProfile) return showAlert("Login", "กรุณาเข้าสู่ระบบก่อนแชร์เด็คครับ");
    
    const only1 = mainDeck.find(c => c.onlyRank === 1);
    if (!only1) return showAlert("Error", "เด็คต้องมี 'Only #1' Card (การ์ดหลัก) ก่อนจึงจะแชร์ได้ครับ");

    try {
      const q = query(collection(db, "publicDecks"), where("user.email", "==", userProfile?.email
));
      const snap = await getDocs(q);
      const existing = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      const performShare = async (targetId = null) => {
        closeModal(); 
        try {
            const batch = writeBatch(db);
            const ref = targetId ? doc(db, "publicDecks", targetId) : doc(collection(db, "publicDecks"));
            const allCards = [...mainDeck, ...lifeDeck];
            const factions = [...new Set(allCards.map(c => c.faction).filter(Boolean))];
            
            const deckName = `Deck: ${only1.name}`;

            batch.set(ref, {
                deckName: deckName,
                only1CardData: { id: only1.id, name: only1.name, imagePath: only1.imagePath },
                user: { name: userProfile.name, picture: userProfile.picture, email: userProfile?.email
 },
                sharedAt: serverTimestamp(),
                likeCount: 0, likedBy: [], factions, viewCount: 0
            });
            batch.set(doc(db, "publicDeckDetails", ref.id), { 
                mainDeck: mainDeck.map(c=>c.id), 
                lifeDeck: lifeDeck.map(c=>c.id) 
            });
            
            await batch.commit();
            showAlert("Shared!", "แชร์เด็คสู่สาธารณะเรียบร้อยแล้ว!");
        } catch (e) { 
            console.error(e); 
            showAlert("Error", "แชร์ไม่สำเร็จ โปรดลองใหม่"); 
        }
      };

      if (existing.length >= 2) {
        setModal({
            isOpen: true, title: "โควตาเต็ม (Max 2)", 
            message: <div className="flex flex-col gap-2"><p>คุณแชร์ครบ 2 เด็คแล้ว เลือกเด็คที่ต้องการเขียนทับ:</p>{existing.map(d => <button key={d.id} onClick={() => performShare(d.id)} className="p-2 border rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-left text-slate-900 dark:text-white font-bold">ทับเด็ค: {d.deckName}</button>)}</div>,
            confirmText: null
        });
      } else {
        setModal({ 
            isOpen: true, title: "Share Deck", 
            message: `ยืนยันการแชร์เด็ค "${only1.name}" สู่สาธารณะ?`, 
            onConfirm: () => performShare(null), 
            confirmText: "Share Public", 
            confirmIcon: <UploadIcon /> 
        });
      }
    } catch (e) { console.error(e); showAlert("Error", "ตรวจสอบข้อมูลไม่สำเร็จ"); }
  };

  const handleAnalyzeDeck = () => {
    if (mainDeck.length === 0) { showAlert("ไม่มีการ์ดในเด็ค", "โปรดใส่การ์ดใน Main Deck ก่อนทำการสร้างเด็ค"); return; }
    setIsLoadingAnalysis(true);
    setTimeout(() => {
      setIsLoadingAnalysis(false);
      setAnalysisDeck({ deck: { main: mainDeck, life: lifeDeck }, showChart: true });
    }, 500);
  };

  const handleReloadFromTxt = async () => { const all = await fetchAllTxt(); if (all.length > 0) setCardDb(all); };
  const handleSetSelectionChange = (set) => { setSelectedSets(prev => prev.includes(set) ? prev.filter(s => s !== set) : [...prev, set]); };
  const handleStatFilterChange = (stat, field, value) => { const numValue = value === '' ? '' : Math.max(0, parseInt(value, 10)); setStatFilters(prev => ({ ...prev, [stat]: { ...prev[stat], [field]: numValue } })); };

  const filteredCardDb = useMemo(() => {
    if (cardDb.length === 0) return [];
    return cardDb.filter((c) => {
      const term = searchTerm.toLowerCase();
      if (!((c.name?.toLowerCase().includes(term) || (c.text || "").toLowerCase().includes(term)))) return false;
      if (selectedSets.length > 0 && !selectedSets.includes(c.imagePath)) return false;
      if (statFilters.cost.min !== '' && (c.cost ?? 0) < statFilters.cost.min) return false;
      if (statFilters.cost.max !== '' && (c.cost ?? 0) > statFilters.cost.max) return false;
      if (statFilters.power.min !== '' && (c.power ?? 0) < statFilters.power.min) return false;
      if (statFilters.power.max !== '' && (c.power ?? 0) > statFilters.power.max) return false;
      if (statFilters.gem.min !== '' && (c.gem ?? 0) < statFilters.gem.min) return false;
      if (statFilters.gem.max !== '' && (c.gem ?? 0) > statFilters.gem.max) return false;
      if (filterColors.length > 0 && !filterColors.includes(c.colorType)) return false;
      if (filterRarities.length > 0 && !filterRarities.includes(c.rarity)) return false;
      if (filterTypes.length > 0 && !filterTypes.includes(c.type)) return false;
      if (c.type === 'Magic' && filterTypes.includes('Magic') && filterMagicType !== 'All') { if (getMagicSubType(c) !== filterMagicType) { return false; } } return true;
    });
  }, [cardDb, searchTerm, filterTypes, filterMagicType, filterColors, filterRarities, selectedSets, statFilters]);

  const totalPages = Math.ceil(filteredCardDb.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedCards = filteredCardDb.slice(startIndex, endIndex);
  const [viewingDeck, setViewingDeck] = useState(null);

  const addToMain = (card, sourceElem) => {
    if (card.lifeEligible) { showAlert("ไม่สามารถเพิ่มได้", `การ์ด "${card.name}" เป็นการ์ดสำหรับ Life Deck เท่านั้น`); return; }
    if (card.onlyRank === 1 && mainDeck.some(c => c.onlyRank === 1)) { showAlert("Rule Violation", "You can only have one 'Only #1' card in your Main Deck."); return; }
    if (mainDeck.filter(c => nameKey(c.name) === nameKey(card.name)).length >= RULES.main.maxCopiesPerName) { showAlert("Rule Violation", `You cannot have more than ${RULES.main.maxCopiesPerName} copies of "${card.name}".`); return; }
    if (mainDeck.length >= RULES.main.size) { showAlert("Deck Full", "Your Main Deck has reached the 50-card limit."); return; }
    setMainDeck(prev => [...prev, card]);
    if (sourceElem) triggerLightEffect(sourceElem);
  };

  const removeFromMain = (card) => { const idx = mainDeck.findLastIndex(c => nameKey(c.name) === nameKey(card.name)); if (idx > -1) setMainDeck(prev => prev.filter((_, i) => i !== idx)); };
  const addToLife = (card) => { if (!card.lifeEligible) { showAlert("Invalid Card", `การ์ด "${card.name}" ไม่สามารถใส่ใน Life Deck ได้`); return; }; if (lifeDeck.length >= RULES.life.size) { showAlert("Deck Full", `Life Deck เต็มแล้ว (ใส่ได้ ${RULES.life.size} ใบ)`); return; }; if (!lifeDeck.some(c => nameKey(c.name) === nameKey(card.name))) { setLifeDeck(prev => [...prev, card]); } else { showAlert("Duplicate Card", `การ์ดชื่อ "${card.name}" มีใน Life Deck แล้ว (ชื่อห้ามซ้ำ)`); } };
  const removeFromLife = (card) => { const idx = lifeDeck.findIndex(c => c.id === card.id); if (idx > -1) setLifeDeck(prev => prev.filter((_, i) => i !== idx)); };
  const handleCardDoubleClick = (card, cardElement) => { if (isAnimating || !cardElement || !mainDeckRef.current) return; if (card.lifeEligible) { showAlert("ไม่สามารถเพิ่มได้", `การ์ด "${card.name}" เป็นการ์ดสำหรับ Life Deck เท่านั้น โปรดลากไปวางใน Life Deck`); return; } setIsAnimating(true); const startRect = cardElement.getBoundingClientRect(); const endRect = mainDeckRef.current.getBoundingClientRect(); setFlyingCard({ card, startRect, endRect }); };
  const handleAnimationComplete = () => { if (flyingCard) { addToMain(flyingCard.card); setFlyingCard(null); setIsAnimating(false); } };
  const handleExportCode = () => { if (mainDeck.length === 0 && lifeDeck.length === 0) { showAlert("Empty Deck", "เด็คของคุณว่างเปล่า ไม่มีอะไรให้ Export"); return; } const code = encodeDeckCode(mainDeck, lifeDeck); navigator.clipboard.writeText(code).then(() => showAlert("Success!", `✅ คัดลอกรหัสเด็คลง Clipboard แล้ว!`)).catch(err => { console.error('Failed to copy code: ', err); showAlert("Error", "ไม่สามารถคัดลอกรหัสเด็คได้"); }); };
  const handleImport = () => { setIsImportModalOpen(true); };
  const confirmImport = (code) => { closeImportModal(); if (!code) { return; } const decoded = decodeDeckCode(code, cardDb); if (decoded) { setMainDeck(decoded.main); setLifeDeck(decoded.life); showAlert("Import Success", "นำเข้าเด็คสำเร็จ!"); } else { showAlert("Import Error", "รหัสเด็คไม่ถูกต้อง หรือไม่พบการ์ดบางใบในฐานข้อมูลปัจจุบัน"); } };
  const handleExport = handleExportCode;
  const handleClear = () => { setModal({ isOpen: true, title: "Confirm Clear Deck", message: "คุณต้องการล้างเด็คทั้งหมด (Main และ Life) ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้", onConfirm: () => { setMainDeck([]); setLifeDeck([]); closeModal(); }, confirmText: "Confirm Clear", confirmIcon: <TrashIcon /> }); };

  return (
    <DndProvider backend={HTML5Backend}>
      <DndStateProvider>
        <style>{`::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#334155}`}</style>
        <CustomDragLayer />
        {flyingCard && <FlyingCard {...flyingCard} onComplete={handleAnimationComplete} />}
        <div className="h-screen flex flex-col text-slate-900 dark:text-gray-200 bg-slate-100 dark:bg-black">
          {!userProfile ? (
            <div className="flex-1 flex flex-row items-stretch overflow-hidden">
              <div className="w-full max-w-md md:w-96 shrink-0 flex flex-col items-center justify-start p-8 gap-6 bg-white/80 dark:bg-black/80 backdrop-blur-lg overflow-y-auto h-full border-r border-slate-300 dark:border-emerald-700/30">
                <img src="/cards/LOGOBOT.png" alt="Logo" className="w-32 h-32 object-contain shrink-0" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 bg-clip-text text-transparent text-center">Deck Builder</h1>
                <div className="mt-4 scale-110 shrink-0">
                  <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} theme={theme === 'dark' ? "filled_black" : "outline"} size="large" shape="pill" text="signin_with" logo_alignment="left" />
                </div>
                <div className="mt-12 pt-8 border-t border-slate-300 dark:border-emerald-700/30 w-full max-w-sm flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-300 mb-4 text-center">สนับสนุนค่ากาแฟและค่าเซิร์ฟเวอร์ ❤️</h3>
                  <img src="/assets/QRCODE.png" alt="QR Code" className="w-48 h-48 mx-auto rounded-lg border-4 border-emerald-500/30" onError={(e) => (e.currentTarget.style.display = "none")} />
                  <video src="/assets/VDO.mov" autoPlay loop muted playsInline className="w-full h-auto max-w-[400px] mt-6 rounded-lg border-4 border-emerald-500/30" width="540" height="540" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              </div>
              <div className="flex-1 hidden md:block bg-slate-200 dark:bg-black/50" style={{ backgroundImage: "url('/assets/wallblueL.jpg')", backgroundRepeat: "repeat", backgroundSize: "auto", backgroundPosition: "top left", }} />
            </div>
          ) : (
            <>
      <Header 
        userProfile={userProfile}
        displayUser={displayUser}
        userReputation={userReputation[userProfile?.email]}
        setIsSettingsOpen={setIsSettingsOpen}
        setIsMyDecksOpen={setIsDeckListModalOpen} 
        setIsAdminOpen={setIsAdminOpen}
      />
      
              <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] transition-opacity duration-300 ease-in-out ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"} md:hidden`} onClick={() => isSidebarOpen && toggleSidebar()} />
                <div className={`fixed top-0 left-0 h-full z-[150] w-[300px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-300 dark:border-emerald-500/30 shadow-2xl transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:z-0 md:shadow-none md:bg-transparent md:backdrop-blur-none transition-[width,opacity] ${isSidebarOpen ? "md:w-[360px] opacity-100" : "md:w-0 opacity-0 md:overflow-hidden"}`}>
                  <button ref={toggleBtnRef} onClick={toggleSidebar} className="md:hidden absolute top-3 right-3 p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors z-50" title="ปิดฟิลเตอร์"><CloseIcon /></button>
                  <LeftSidebar isSidebarOpen={isSidebarOpen} searchTerm={searchTerm} setSearchTerm={setSearchTerm} allCardTypes={allCardTypes} filterTypes={filterTypes} setFilterTypes={setFilterTypes} filterMagicType={filterMagicType} setFilterMagicType={setFilterMagicType} allColorTypes={allColorTypes} filterColors={filterColors} setFilterColors={setFilterColors} allRarities={allRarities} filterRarities={filterRarities} setFilterRarities={setFilterRarities} allSets={allSets} selectedSets={selectedSets} onSetSelectionChange={handleSetSelectionChange} statFilters={statFilters} onStatFilterChange={handleStatFilterChange} mainDeck={mainDeck} lifeDeck={lifeDeck} RULES={RULES} addToMain={addToMain} addToLife={addToLife} removeFromMain={removeFromMain} removeFromLife={removeFromLife} handleImport={handleImport} handleExport={handleExport} handleClear={handleClear} handleReloadFromTxt={handleReloadFromTxt} mainDeckRef={mainDeckRef} onViewDeck={setViewingDeck} onAnalyzeDeck={handleAnalyzeDeck} isLoadingAnalysis={isLoadingAnalysis} />
                </div>
                <button onClick={toggleSidebar} className={`md:hidden flex fixed bottom-6 z-[160] items-center justify-center w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-300 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-xl transition-all duration-300 ease-in-out ${isSidebarOpen ? "left-[310px]" : "left-4"}`}>
                  {isSidebarOpen ? <ChevronLeftIcon /> : <FilterIcon />}
                </button>
                <button onClick={toggleSidebar} className={`hidden md:flex fixed z-[160] top-1/2 -translate-y-1/2 items-center justify-center w-8 h-24 rounded-r-2xl border-y border-r border-l-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-300 dark:border-emerald-700/50 text-emerald-600 dark:text-emerald-400 shadow-[4px_0_10px_-2px_rgba(0,0,0,0.1)] hover:w-10 transition-all duration-300 ease-in-out ${isSidebarOpen ? "left-[360px]" : "left-0"}`} title={isSidebarOpen ? "ซ่อน Filter" : "แสดง Filter"}>
                  <div className={`${!isSidebarOpen ? "rotate-180" : ""} transition-transform duration-300`}><ChevronLeftIcon /></div>
                </button>
                <div className={`${activeView === "cards" ? "flex" : "hidden"} md:flex flex-1 flex-col h-full min-h-0 relative`}>
                  <section ref={scrollRef} onScroll={handleScroll} className={`flex-1 h-full w-full overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch transition-all duration-300 ease-in-out p-2 lg:py-8 md:pr-12 lg:pr-16 pb-40 ${isSidebarOpen ? "md:pl-12 lg:pl-16" : "md:pl-16 lg:pl-24 xl:pl-32"}`}>
                    <div className="relative bg-white dark:bg-slate-900 text-center py-8 px-4 border-b border-slate-300 dark:border-emerald-700/30 overflow-hidden rounded-lg mb-10">
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-slate-900 opacity-50"></div>
                      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://www.tcgthailand.com/assets/img/banner.1b838965.webp')" }}></div>
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <img src="/cards/LOGOBOT.png" alt="Battle Of Talingchan Logo" className="w-24 h-24 md:w-28 md:h-28 mb-2 object-contain drop-shadow-lg" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-md">จัดเด็คของคุณ</h1>
                      </div>
                    </div>
                    {cardDb.length === 0 ? (
                      <CardShell>
                        <div className="text-center py-20">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">กำลังโหลดฐานข้อมูลการ์ด...</h3>
                          <p className="text-slate-700 dark:text-gray-300">หากไม่สำเร็จ ลองกด "Reload from TXT" ที่แถบซ้าย</p>
                        </div>
                      </CardShell>
                    ) : (
                      <>
                        <CardGrid cards={paginatedCards} onDoubleClick={handleCardDoubleClick} onViewDetails={setZoomedCard} onAddCard={addToMain} onAuction={(card) => { setAuctionTargetCard(card); setIsAuctionModalOpen(true); }} />
                        {totalPages > 1 && (
                          <div className="relative z-[70] flex items-center justify-center gap-4 mt-12 py-4 pb-10">
                            <Button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>ย้อนกลับ</Button>
                            <span className="text-slate-900 dark:text-white font-semibold tabular-nums">หน้า {currentPage} / {totalPages}</span>
                            <Button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>ถัดไป</Button>
                          </div>
                        )}
                        <footer className="relative z-[70] mt-4 py-10 text-center border-t border-slate-300 dark:border-emerald-700/30">
                          <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-300 mb-4">สามารถสนับสนุนค่ากาแฟและค่าเซิร์ฟเวอร์ได้ที่นี่นะคะ ❤️❤️❤️</h3>
                          <img src="/assets/QRCODE.png" alt="Donate QR Code" className="w-48 h-48 mx-auto rounded-lg border-4 border-emerald-500/30" onError={(e) => (e.currentTarget.style.display = "none")} />
                        </footer>
                        <button onClick={scrollToTop} className={`fixed bottom-5 right-20 z-[90] p-3 rounded-full shadow-xl bg-amber-500 text-white border border-amber-400 hover:bg-amber-400 hover:-translate-y-1 transition-all duration-300 ease-in-out ${showScrollTop && !isSidebarOpen ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"}`} title="เลื่อนขึ้นบนสุด"><ChevronUpIcon /></button>
                      </>
                    )}
                  </section>
                </div>
              </main>
              <Modal isOpen={modal.isOpen} title={modal.title} onClose={closeModal} onConfirm={modal.onConfirm} confirmText={modal.onConfirm ? modal.confirmText || "Confirm" : undefined} confirmIcon={modal.onConfirm ? modal.confirmIcon || <TrashIcon /> : undefined}>{modal.message}</Modal>
              <ImportDeckModal isOpen={isImportModalOpen} onClose={closeImportModal} onImport={confirmImport} />
              <DeckAnalysisModal 
          isOpen={analysisDeck.deck !== null} 
          onClose={() => setAnalysisDeck({ deck: null, showChart: true })} 
          mainDeck={analysisDeck.deck ? analysisDeck.deck.main : []} 
          lifeDeck={analysisDeck.deck ? analysisDeck.deck.life : []} 
          showChart={analysisDeck.showChart} 
          showAlert={showAlert} 
          theme={theme} 
          onSave={() => setIsDeckListModalOpen(true)} 
          onShare={handleShareCurrentDeck}
      /><DeckViewModal isOpen={viewingDeck !== null} onClose={() => setViewingDeck(null)} deck={viewingDeck === "main" ? mainDeck : lifeDeck} rules={viewingDeck === "main" ? RULES.main : RULES.life} onAddCard={viewingDeck === "main" ? addToMain : addToLife} onRemoveCard={viewingDeck === "main" ? removeFromMain : removeFromLife} title={viewingDeck === "main" ? "Main Deck" : "Life Deck"} />
              <CardDetailModal card={zoomedCard} onClose={() => setZoomedCard(null)} onSell={(card) => { setAuctionTargetCard(card); setIsAuctionModalOpen(true); setZoomedCard(null); }} />
              <CreateAuctionModal isOpen={isAuctionModalOpen} onClose={() => setIsAuctionModalOpen(false)} card={auctionTargetCard} userProfile={displayUser} />
              <DeckListModal isOpen={isDeckListModalOpen} onClose={() => setIsDeckListModalOpen(false)} userProfile={displayUser} userDecks={userDecks} setUserDecks={setUserDecks} mainDeck={mainDeck} lifeDeck={lifeDeck} setMainDeck={setMainDeck} setLifeDeck={setLifeDeck} showAlert={showAlert} setModal={setModal} closeModal={closeModal} encodeDeckCode={encodeDeckCode} decodeDeckCode={decodeDeckCode} allCards={cardDb} onShowCards={(deck) => setAnalysisDeck({ deck: deck, showChart: false })} key={userProfile?.email || "guest"} />
              <ProfileSetupModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userProfile={userProfile} onSave={handleSaveProfile} />
              <SettingsDrawer
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                userProfile={displayUser}
                onEditProfile={() => setIsProfileModalOpen(true)}
                onLogout={handleLogout}
                theme={theme}
                setTheme={setTheme}
                onOpenFeedback={() => setIsFeedbackOpen(true)}
                onOpenMyDecks={() => setIsDeckListModalOpen(true)}
                userStats={userReputation[userProfile?.email]} 
                onOpenAdmin={() => setIsAdminOpen(true)}
            />
            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} userProfile={displayUser} showAlert={showAlert} />
            <AdminDashboardModal 
                    isOpen={isAdminOpen} 
                    onClose={() => setIsAdminOpen(false)} 
                    adminEmail={userProfile?.email} 
            />
            <ChatWidget 
                userProfile={displayUser} 
                isMobileMenuOpen={isSidebarOpen} 
            />
            {/* 🟢 Render WarningPopup ถ้ามีข้อความ */}
            <WarningPopup 
                message={warningMessage} 
                onConfirm={handleClearWarning} 
            />
      {/* 🟢 [UPDATED] Tutorial Overlay: แบบมีปุ่ม "ไม่ต้องแสดงอีก" */}
      {showAuctionTutorial && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={handleCloseTutorial}>
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl border-2 border-emerald-500 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                
                {/* Decor Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-tr-full -ml-10 -mb-10"></div>

                <h2 className="text-2xl md:text-3xl font-black text-center text-slate-900 dark:text-white mb-8">
                    วิธีเริ่มลงขายการ์ด 🔨
                </h2>
                
                <div className="space-y-6 relative">
                    {/* เส้นเชื่อมจุด */}
                    <div className="absolute left-[27px] top-10 bottom-10 w-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>

                    {/* Step 1: Filter */}
                    <div className="flex gap-4 items-start">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
                            <FilterIcon />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">1. ค้นหาการ์ด</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                ใช้ปุ่ม <span className="font-bold bg-slate-200 dark:bg-slate-700 px-1.5 rounded">Filter</span> (มุมซ้ายล่าง) หรือช่องค้นหา เพื่อหาการ์ดใบที่คุณต้องการจะขาย
                            </p>
                        </div>
                    </div>

                    {/* Step 2: Auction Button */}
                    <div className="flex gap-4 items-start">
                        <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-600 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm shrink-0">
                            <GavelIcon />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400">2. กดปุ่มเริ่มประมูล</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                เมื่อเจอการ์ดแล้ว ให้กดที่ปุ่ม <span className="font-bold">รูปค้อน</span> ที่มุมขวาบนของการ์ด เพื่อตั้งราคาและเวลา
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* 🟢 [ใหม่] Checkbox: ไม่ต้องแสดงหน้านี้อีก */}
                <div className="mt-8 flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                    <input 
                        type="checkbox" 
                        id="dontShow" 
                        checked={dontShowAgain} 
                        onChange={e => setDontShowAgain(e.target.checked)}
                        className="w-5 h-5 accent-emerald-500 rounded cursor-pointer border-slate-300 focus:ring-emerald-500"
                    />
                    <label htmlFor="dontShow" className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer select-none hover:text-emerald-500 transition-colors">
                        ไม่ต้องแสดงหน้านี้อีก
                    </label>
                </div>

                <button
                    onClick={handleCloseTutorial}
                    className="mt-4 w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    เข้าใจแล้ว! ลุยเลย 
                </button>
            </div>
        </div>
      )}             

            </>
          )}
        </div>
        {flyingLights.map(light => <FlyingLight key={light.id} startRect={light.startRect} endRect={light.endRect} onComplete={() => removeLight(light.id)} />)}
      </DndStateProvider>
    </DndProvider>
  );
}