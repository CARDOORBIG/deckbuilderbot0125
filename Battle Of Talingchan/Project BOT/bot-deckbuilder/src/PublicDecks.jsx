import React, { useState, useEffect, useMemo, useRef } from 'react'; // [เพิ่ม] useRef
import { Link } from 'react-router-dom';
import { createPortal } from "react-dom";
import { db } from './firebase';
import { 
  collection, getDocs, query, orderBy, Timestamp, doc, deleteDoc, limit, startAfter, getDoc,
  updateDoc, increment, arrayUnion, arrayRemove 
  // [ลบ] where (เพราะเราไม่ใช้ Faction Filter)
} from 'firebase/firestore';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

// === [เพิ่ม] Import html2canvas ===
import html2canvas from 'html2canvas';

// === [UI Components และ Hooks] ===
const Button = ({ className = "", children, ...props }) => ( <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-400/20 bg-amber-900/30 text-amber-300 hover:bg-amber-700/50 hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-900/30 ${className}`} {...props} > {children} </button> );
const CardShell = ({ children, className = "", ...props }) => ( <div className={`bg-slate-900/70 backdrop-blur-sm p-4 rounded-xl border border-emerald-500/20 shadow-lg transition-all hover:border-amber-400/50 hover:shadow-amber-500/10 ${className}`} {...props}> {children} </div> );
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const EyeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <circle cx="12" cy="12" r="3" /> </svg> );
const CopyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect> <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path> </svg> );
const ClearIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg> );
const HeartIcon = ({ filled = false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
// === [เพิ่ม] ไอคอนกล้อง ===
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);
// === [สิ้นสุด] ไอคอนกล้อง ===

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", confirmIcon = <ClearIcon/>, maxWidth = 'max-w-md' }) => { if (!isOpen) return null; return createPortal( <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[400] p-4"> {/* [แก้ไข] z-index เป็น 400 */} <div className={`bg-slate-800 border border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full m-4 ${maxWidth}`}> <h2 className="text-xl font-bold text-white mb-4">{title}</h2> <div className="text-gray-300 mb-6">{children}</div> <div className="flex justify-end gap-3"> <Button onClick={onClose} className="bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600">{onConfirm ? "Cancel" : "Close"}</Button> {onConfirm && ( <Button onClick={onConfirm} className="bg-red-900/50 border-red-500/30 text-red-300 hover:bg-red-800/50 hover:text-white"> {confirmIcon} {confirmText} </Button> )} </div> </div> </div>, document.body ); };
function useLocalStorage(key, initial) { const [v, s] = useState(() => { try { const raw = localStorage.getItem(key); if (!raw || raw === "[]" || raw === "null") return initial; return JSON.parse(raw); } catch { return initial; } }); useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]); return [v, s]; }
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
// === [สิ้นสุด] UI Components ===
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
// === [สิ้นสุดการเพิ่ม] ===
// === [เพิ่ม] Utilities และ Modal สำหรับดูรายละเอียดเด็ค ===

const nameKey = (n) => (n || "").trim().toLowerCase();
const encodeDeckCode = (mainDeck, lifeDeck) => {
  const mainIds = mainDeck.map(c => c.id);
  const lifeIds = lifeDeck.map(c => c.id);
  const dataString = JSON.stringify({ m: mainIds, l: lifeIds });
  try {
    return btoa(dataString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (e) { console.error("Encoding failed:", e); return ""; }
};

function countBy(arr, keyFn) { return arr.reduce((m, x) => { const k = keyFn(x); m[k] = (m[k] || 0) + 1; return m; }, {}); }
const avg = (arr) => { const valid = arr.filter(n => typeof n === 'number' && !isNaN(n)); if (valid.length === 0) return '0.00'; return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2); };

// === [แก้ไข] อัปเกรด DeckViewModal ทั้งหมด (รวมระบบ Analysis) ===
function DeckViewModal({ 
  isOpen, onClose, deck, showAlert, isLoading,
  onTakePhoto, // <--- [เพิ่ม]
  isCapturing  // <--- [เพิ่ม]
}) {

  // 1. [ใหม่] Logic การวิเคราะห์ (คัดลอกจาก App.jsx)
  const analysis = useMemo(() => {
      if (isLoading || !deck || !deck.main || deck.main.length === 0) return null;

      const mainDeck = (deck.main || []).filter(Boolean);
      const lifeDeck = (deck.life || []).filter(Boolean);

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
      
      const labels = ['ความไวต้นเกม', 'กลางเกม', 'ท้ายเกม', 'พลังโจมตี', 'การป้องกัน', 'การสนับสนุน']; 
      const maxStatValue = 100;
      const earlyGameScore = (mainDeck.filter(c => (c.cost ?? 0) <= 2).length / (mainDeck.length * 0.5)) * maxStatValue; 
      const midGameScore = (mainDeck.filter(c => (c.cost ?? 0) >= 3 && (c.cost ?? 0) <= 5).length / (mainDeck.length * 0.4)) * maxStatValue; 
      const lateGameScore = (mainDeck.filter(c => (c.cost ?? 0) >= 6).length / (mainDeck.length * 0.2)) * maxStatValue; 
      const offenseScore = (parseFloat(avgPower) / 6) * maxStatValue; 
      const defenseScore = (mainDeck.filter(c => c.type !== 'Magic').length / 40) * maxStatValue; 
      const utilityScore = ((typeCounts['Magic'] || 0) / 15) * maxStatValue; 
      
      const radarData = { labels, datasets: [{ label: 'ศักยภาพเด็ค', data: [earlyGameScore, midGameScore, lateGameScore, offenseScore, defenseScore, utilityScore].map(v => Math.round(Math.min(100, Math.max(0, v || 0)))), backgroundColor: 'rgba(52, 211, 153, 0.2)', borderColor: 'rgb(52, 211, 153)', pointBackgroundColor: 'rgb(52, 211, 153)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(52, 211, 153)' }]};
      const radarOptions = { scales: { r: { angleLines: { color: 'rgba(255, 255, 255, 0.2)' }, grid: { color: 'rgba(255, 255, 255, 0.2)' }, pointLabels: { color: 'rgb(209, 213, 219)', font: { size: 12 } }, ticks: { color: 'rgb(156, 163, 175)', backdropColor: 'rgba(0, 0, 0, 0.5)', stepSize: 20, maxTicksLimit: 6, }, min: 0, max: 100, }, }, plugins: { legend: { display: false }, tooltip: { enabled: true } }, maintainAspectRatio: false };
      
      const deckCode = encodeDeckCode(mainDeck, lifeDeck);
      
      return { avgCost, avgPower, avgGem, cardTypes, radarData, radarOptions, deckCode, only1Card, avatars, magics, constructs, otherCards };
  }, [deck, isLoading]);

  if (!isOpen) return null;

  // 2. ฟังก์ชันสำหรับคัดลอกรหัสเด็ค (ใช้จาก analysis)
  const handleCopyCode = () => {
    if (analysis?.deckCode) {
      navigator.clipboard.writeText(analysis.deckCode)
        .then(() => showAlert("Success!", `✅ คัดลอกรหัสเด็คของ "${deck.deckName}" แล้ว!`))
        .catch(err => showAlert("Error", "ไม่สามารถคัดลอกรหัสได้"));
    }
  };

  // 3. [ใหม่] Helper Render ตารางการ์ด (ใช้ w-32 ที่เราทำไว้)
  const renderCardSection = (title, cards) => {
    const totalCards = cards.length;
    if (totalCards === 0) return null; // ไม่ต้องแสดงส่วนนี้ถ้าไม่มีการ์ด

    // Grouping
    const groupedCards = cards.reduce((acc, card) => {
      const existing = acc.find(item => item.card.id === card.id);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ card, count: 1 });
      }
      return acc;
    }, []);

    return (
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-emerald-300 border-b border-emerald-400/20 pb-1 mb-3">{title} ({totalCards} ใบ)</h4>
        <div className="flex flex-wrap justify-center gap-4"> {/* [ใช้ Gap-4] */}
          {groupedCards.map(({ card, count }) => {
            const encodedImagePath = encodePath(card.imagePath);
            const fileId = card.id.replace(' - Only#1', '');
            const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
            return (
              <div key={card.id} className="w-32 relative" title={card.name}> {/* [ใช้ W-32] */}
                <img src={thumbPng} alt={card.name} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                {count > 1 && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 text-white text-lg font-bold rounded-full border-2 border-slate-800 text-center leading-none">{count}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 4. [ใหม่] JSX Return (Layout 2 คอลัมน์)
  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
      <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl shadow-2xl w-full h-full flex flex-col max-w-7xl max-h-[90vh]"> {/* [ขยาย] max-w-7xl */}
        
        {/* Header ของ Modal */}
        <header className="flex items-center justify-between p-4 border-b border-emerald-500/20 shrink-0">
          <h2 className="text-2xl font-bold text-white truncate pr-4">{isLoading ? "กำลังโหลด..." : (deck?.deckName || "Deck Details")}</h2>
          <div className="flex items-center gap-3 shrink-0">
            
            {/* === [เพิ่ม] ปุ่มถ่ายรูป === */}
            <Button
              onClick={() => onTakePhoto(deck, analysis)} // <--- [แก้ไข] ส่ง (deck, analysis) กลับไป
              disabled={isLoading || !analysis || isCapturing}
              className="bg-blue-600/30 border-blue-500/30 text-blue-300 hover:bg-blue-500/50 hover:text-white"
            >
              <CameraIcon />
              {isCapturing ? "กำลังถ่าย..." : "ถ่ายรูป"}
            </Button>
            {/* === [สิ้นสุด] ปุ่มถ่ายรูป === */}

            <Button 
              onClick={handleCopyCode} 
              disabled={isLoading || !analysis || isCapturing}
            >
              <CopyIcon /> คัดลอกรหัสเด็ค
            </Button>
            <Button onClick={onClose} disabled={isCapturing}>Close</Button>
          </div>
        </header>

        {/* Body ของ Modal (แก้ไขใหม่) */}
        {isLoading || !analysis ? (
          // สถานะกำลังโหลด
          <div className="flex-grow flex items-center justify-center">
            <p className="text-xl text-slate-300">กำลังโหลดรายละเอียดเด็ค...</p>
          </div>
        ) : (
          // สถานะโหลดเสร็จ (Layout 2 คอลัมน์)
          <div className="flex-grow overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-900/80"> {/* [เพิ่ม] bg-slate-900/80 */}
            
            {/* === คอลัมน์ซ้าย (Stats) === */}
            <div className="md:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2">
              <div>
                <h3 className="text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3">สถิติเด็ค</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><span className="text-sm text-gray-400">Avg Cost</span><p className="text-2xl font-bold text-emerald-400">{analysis.avgCost}</p></div>
                  <div><span className="text-sm text-gray-400">Avg Power</span><p className="text-2xl font-bold text-red-400">{analysis.avgPower}</p></div>
                  <div><span className="text-sm text-gray-400">Avg Gem</span><p className="text-2xl font-bold text-amber-400">{analysis.avgGem}</p></div>
                </div>
              </div>
              <div className="aspect-square w-full max-w-[350px] mx-auto">
                <Radar data={analysis.radarData} options={analysis.radarOptions} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3">ประเภทการ์ด</h3>
                <ul className="space-y-1 text-sm">
                  {analysis.cardTypes.map(([type, count]) => (
                    <li key={type} className="flex justify-between">
                      <span>{type}</span>
                      <span>{count} ใบ</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* === คอลัมน์ขวา (Card List) === */}
            <div className="md:col-span-2 overflow-y-auto pr-2 border-l border-emerald-500/20 pl-6">
              
              {/* Only #1 */}
              {analysis.only1Card && (
                <div className="mb-6 flex flex-col items-center">
                  <h4 className="text-lg font-semibold text-emerald-300 mb-3">Only #1</h4>
                  <div className="relative w-40" title={analysis.only1Card.name}> {/* [w-40] */}
                    <img src={`/cards/${encodePath(analysis.only1Card.imagePath)}/${encodeURIComponent(analysis.only1Card.id.replace(' - Only#1', ''))}.png`} alt={analysis.only1Card.name} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                  </div>
                </div>
              )}

              {/* Main Deck (Avatars, Magics, etc.) */}
              {renderCardSection("Avatar Cards", analysis.avatars)}
              {renderCardSection("Magic Cards", analysis.magics)}
              {renderCardSection("Construct Cards", analysis.constructs)}
              {analysis.otherCards.length > 0 && renderCardSection("Other Cards", analysis.otherCards)}

              {/* Life Deck */}
              {renderCardSection("Life Deck", (deck.life || []).filter(Boolean))}

            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
// === [สิ้นสุดการแก้ไข] === (ของ DeckViewModal)


// === [เพิ่ม] Component ใหม่สำหรับ "สร้างรูป" (ซ่อนนอกจอ) ===
const DeckImageTemplate = React.forwardRef(function DeckImageTemplate({ deck, analysis }, ref) {
  
  // (เราใช้ Logic renderCardSection คล้ายๆ เดิม แต่ปรับขนาด)
  const renderCardGrid = (title, cards, cardWidthClass = "w-32") => { // <--- [แก้ไข] w-32 (128px)
    const totalCards = cards.length;
    if (totalCards === 0) return null;

    // Grouping
    const groupedCards = cards.reduce((acc, card) => {
      const existing = acc.find(item => item.card.id === card.id);
      if (existing) { existing.count++; } else { acc.push({ card, count: 1 }); }
      return acc;
    }, []);

    return (
      <div className="mt-4"> {/* <--- [แก้ไข] ลด mt-6 เป็น mt-4 */}
        <h4 className="text-xl font-semibold text-emerald-300 border-b border-emerald-400/20 pb-1 mb-2">{title} ({totalCards} ใบ)</h4> {/* <--- [แก้ไข] ลด mb-3 เป็น mb-2 */}
        <div className="flex flex-wrap gap-3"> {/* <--- [แก้ไข] ลด gap-4 เป็น gap-3 */}
          {groupedCards.map(({ card, count }) => {
            const encodedImagePath = encodePath(card.imagePath);
            const fileId = card.id.replace(' - Only#1', '');
            const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
            return (
              <div key={card.id} className={`${cardWidthClass} relative`} title={card.name}>
                <img src={thumbPng} alt={card.name} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                {count > 1 && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 text-white text-lg font-bold rounded-full border-2 border-slate-800 text-center leading-none">{count}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="image-render-target">
      
      {/* === คอลัมน์ซ้าย (Stats) === */}
      <div className="flex flex-col w-[360px] shrink-0"> {/* <--- [แก้ไข] w-360px (แคบลง) */}
        <h2 className="text-3xl font-bold text-white mb-6 border-b border-emerald-500/30 pb-2">{deck.deckName}</h2> 

        <div className="flex-grow flex flex-col gap-6"> {/* <--- [แก้ไข] ลบ overflow-hidden */}
          <div>
            <h3 className="text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3">สถิติเด็ค</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><span className="text-sm text-gray-400">Avg Cost</span><p className="text-2xl font-bold text-emerald-400">{analysis.avgCost}</p></div>
              <div><span className="text-sm text-gray-400">Avg Power</span><p className="text-2xl font-bold text-red-400">{analysis.avgPower}</p></div>
              <div><span className="text-sm text-gray-400">Avg Gem</span><p className="text-2xl font-bold text-amber-400">{analysis.avgGem}</p></div>
            </div>
          </div>
          <div className="aspect-square w-full max-w-[300px] mx-auto"> {/* <--- [แก้ไข] max-w-300px (เล็กลง) */}
            <Radar data={analysis.radarData} options={analysis.radarOptions} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3">ประเภทการ์ด</h3>
            <ul className="space-y-1 text-sm">
              {analysis.cardTypes.map(([type, count]) => (
                <li key={type} className="flex justify-between">
                  <span>{type}</span>
                  <span>{count} ใบ</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-auto pt-4 border-t border-emerald-500/30">Generated by Battle Of Talingchan Deck Builder</p> 
      </div>

      {/* === คอลัมน์ขวา (Card List) === */}
      <div className="flex-grow pr-2"> {/* <--- [แก้ไข] ลบ overflow-y-auto */}
              
        {/* Only #1 */}
        {analysis.only1Card && (
          <div className="mb-4 flex flex-col items-center">
            <h4 className="text-xl font-semibold text-emerald-300 mb-2">Only #1</h4>
            <div className="relative w-40" title={analysis.only1Card.name}> {/* <--- [แก้ไข] w-40 (160px) */}
              <img src={`/cards/${encodePath(analysis.only1Card.imagePath)}/${encodeURIComponent(analysis.only1Card.id.replace(' - Only#1', ''))}.png`} alt={analysis.only1Card.name} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
            </div>
          </div>
        )}
        
        {/* (ที่เหลือเหมือนเดิม) */}
        {renderCardGrid("Avatar Cards", analysis.avatars)}
        {renderCardGrid("Magic Cards", analysis.magics)}
        {renderCardGrid("Construct Cards", analysis.constructs)}
        {analysis.otherCards.length > 0 && renderCardGrid("Other Cards", analysis.otherCards)}
        {renderCardGrid("Life Deck", (deck.life || []).filter(Boolean))}
      </div>
    </div>
  );
});
// === [สิ้นสุด] Component สร้างรูป ===

// === [เพิ่ม] Skeleton Component ===
function DeckCardSkeleton() {
  return (
    <CardShell className="flex flex-col animate-pulse">
      {/* User Info Skeleton */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700"></div>
          <div>
            <div className="h-4 w-24 bg-slate-700 rounded mb-1.5"></div>
            <div className="h-3 w-16 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
      {/* Deck Name Skeleton */}
      <div className="h-6 w-3/4 bg-slate-700 rounded mb-3"></div>
      
      {/* Card Image Skeleton */}
      <div className="aspect-[5/7] w-full rounded-lg mb-4 bg-slate-700"></div>
      
      {/* Button Skeletons */}
      <div className="flex flex-col gap-2 mt-auto">
        <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
        {/* <div className="h-10 w-full bg-slate-700 rounded-lg"></div> */}
      </div>
    </CardShell>
  );
}
// === [สิ้นสุด] Skeleton Component ===


const DECKS_PER_PAGE = 12; // โหลดทีละ 12 เด็ค

// [แก้ไข] Component DeckCard (ลบ onCopyCode, เพิ่ม isDetailLoading)
function DeckCard({ deck, onViewDeck, userProfile, onDeleteDeck, isDetailLoading, onLikeDeck, isLiking }) {
  const mainCardImg = useMemo(() => {
    if (!deck.only1CardData) return 'https://placehold.co/300x420/1e293b/94a3b8?text=Deck';
    const card = deck.only1CardData;
    const encodedImagePath = encodePath(card.imagePath);
    const fileId = card.id.replace(' - Only#1', '');
    return `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
  }, [deck.only1CardData]);
  const sharedDate = deck.sharedAt instanceof Timestamp ? deck.sharedAt.toDate() : new Date();
  const isOwner = userProfile && userProfile.email === deck.user.email;
  // === [เพิ่ม] Logic ตรวจสอบว่า User คนนี้ Like หรือยัง ===
  const isLiked = userProfile && (deck.likedBy || []).includes(userProfile.email);
  const likeCount = deck.likeCount || 0;
  return (
    <CardShell className="flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img src={deck.user.picture} alt={deck.user.name} className="w-10 h-10 rounded-full bg-slate-700" loading="lazy" />
          <div>
            <p className="font-semibold text-white">{deck.user.name}</p>
            <p className="text-xs text-gray-400">{sharedDate.toLocaleString('th-TH')}</p>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-amber-300 mb-3 line-clamp-2">{deck.deckName}</h3>
      <div className="aspect-[5/7] w-full rounded-lg mb-4 overflow-hidden bg-slate-800">
        <img src={mainCardImg} alt={deck.only1CardData?.name || 'Deck Cover'} className="w-full h-full object-cover" loading="lazy"/>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <Button 
          onClick={() => onLikeDeck(deck)}
          disabled={!userProfile || isLiking} // ปิดปุ่มถ้าไม่ Login หรือกำลัง Like
          className={`px-3 ${isLiked ? 'bg-red-600/30 border-red-500/30 text-red-300 hover:bg-red-500/50 hover:text-white' : ''}`}
        >
          <HeartIcon filled={isLiked} />
        </Button>
        <span className="text-gray-400 text-sm">
          {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </span>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <Button 
          onClick={() => onViewDeck(deck)} 
          className="w-full bg-blue-600/30 border-blue-500/30 text-blue-300 hover:bg-blue-500/50 hover:text-white"
          disabled={isDetailLoading} // <--- [แก้ไข] เพิ่ม disabled
        >
          <EyeIcon /> {isDetailLoading ? "กำลังโหลด..." : "ดูรายละเอียดเด็ค"}
        </Button>
        {/* [แก้ไข] ลบปุ่ม "คัดลอกรหัสเด็ค" (ย้ายไปใน Modal) */}
        {isOwner && (
          <Button onClick={() => onDeleteDeck(deck)} className="w-full bg-red-900/50 border-red-500/30 text-red-300 hover:bg-red-800/50 hover:text-white">
            <ClearIcon /> ลบเด็คนี้ (Un-share)
          </Button>
        )}
      </div>
    </CardShell>
  );
}


export default function PublicDecks() {
  
  const [sharedDecks, setSharedDecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [userProfile] = useLocalStorage("bot-userProfile-v1", null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const closeModal = () => setModal({ isOpen: false, title: '', message: '', onConfirm: null });
  const showAlert = (title, message) => setModal({ isOpen: true, title, message, onConfirm: null });

  // [เพิ่ม] State สำหรับฐานข้อมูลการ์ด และ Modal ดูเด็ค
  const [cardDb] = useLocalStorage("bot-cardDb-v32-final", []);
  const [viewingDeck, setViewingDeck] = useState(null); // (null หรือ { ...deck, main: [], life: [] })
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  // === [เพิ่ม] State สำหรับ Like และ Filter ===
  const [isLiking, setIsLiking] = useState(false); // กันการกด Like รัว
  const [searchTerm, setSearchTerm] = useState(""); // สำหรับช่องค้นหา (Client-side)
  const [sortOrder, setSortOrder] = useState({ 
    field: "sharedAt", 
    direction: "desc" 
  }); // (Default: ใหม่ไปเก่า)
  
  // [ลบ] filterFaction State (เราไม่ได้ใช้)
  // const [filterFaction, setFilterFaction] = useState(null); 

  // === [เพิ่ม] State และ Ref สำหรับการถ่ายรูป ===
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageDeck, setImageDeck] = useState(null); // (ถ้ามีค่า = ให้สร้างรูป)
  const imageTemplateRef = useRef(null);
  // === [สิ้นสุดการเพิ่ม] ===


  // ฟังก์ชัน helper สำหรับประมวลผลข้อมูล
  const processSnapshot = (snapshot, isInitialLoad) => {
    if (snapshot.empty) {
      setHasMore(false);
      return;
    }
    
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    setLastVisible(lastDoc);

    const decks = [];
    snapshot.forEach((doc) => {
      decks.push({ id: doc.id, ...doc.data() });
    });

    if (isInitialLoad) {
      setSharedDecks(decks);
    } else {
      setSharedDecks(prevDecks => [...prevDecks, ...decks]);
    }

    // [แก้ไข] ตรวจสอบว่ามีข้อมูลน้อยกว่าที่ขอหรือไม่
    if (decks.length < DECKS_PER_PAGE) {
      setHasMore(false);
    }
  };

  // [แก้ไข] ฟังก์ชันดึงข้อมูล (ลบ Faction Filter ออก)
  const fetchDecks = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      // 1. สร้าง query
      let q = query(
        collection(db, "publicDecks"),
        // [แก้ไข] ใช้ orderBy จาก State
        orderBy(sortOrder.field, sortOrder.direction),
        limit(DECKS_PER_PAGE)
      );
      // ⚠️ [สำคัญ] การ Query แบบนี้อาจจะต้องใช้ Composite Index
      // (Firebase จะแจ้งให้สร้างใน Console Log)

      // 2. จัดการ Pagination (โหลดเพิ่ม)
      if (!isInitialLoad && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      // 3. [สำคัญ] ลองดึงจาก Cache ก่อน (เฉพาะการโหลดครั้งแรก)
      if (isInitialLoad) {
        try {
          const cacheSnapshot = await getDocs(q, { source: 'cache' });
          if (!cacheSnapshot.empty) {
            console.log("Data loaded from cache (instant!)");
            processSnapshot(cacheSnapshot, true);
            setIsLoading(false); // ปิด Loading ทันที
            
            // [เพิ่ม] ดึงข้อมูล Server เบื้องหลังเพื่ออัปเดต
            getDocs(q, { source: 'server' }).then(serverSnapshot => {
              console.log("Background server sync complete.");
              processSnapshot(serverSnapshot, true); // อัปเดตข้อมูลเป็นของใหม่
            });
            
            return; 
          }
        } catch (e) {
          console.log("Cache miss, fetching from server...");
        }
      }

      // 4. ดึงจาก Server
      const serverSnapshot = await getDocs(q, { source: 'server' });
      processSnapshot(serverSnapshot, isInitialLoad);

    } catch (error) {
      console.error("Error fetching decks: ", error);
      // [เพิ่ม] แจ้งเตือนถ้า Index พัง
      if (error.code === 'failed-precondition') {
        showAlert("Index Error", "Query นี้ต้องการ Index ใหม่ โปรดตรวจสอบ Console Log (F12) เพื่อสร้าง Index ใน Firebase");
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => { 
    setSharedDecks([]); // ล้างเด็คเก่า
    setLastVisible(null); // รีเซ็ตตัวโหลดเพิ่ม
    setHasMore(true);     // ตั้งค่าให้โหลดได้
    fetchDecks(true);     // โหลดครั้งแรก
  }, [sortOrder]); // [แก้ไข] ให้ทำงานใหม่ทุกครั้งที่ sortOrder เปลี่ยน


  const handleDeleteDeck = (deck) => {
    setModal({
      isOpen: true,
      title: "Confirm Delete Deck",
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบเด็ค "${deck.deckName}" ออกจาก Public?`,
      onConfirm: async () => {
        closeModal();
        try {
          // [แก้ไข] ลบ 2 ที่ (List และ Detail)
          const listRef = doc(db, "publicDecks", deck.id);
          await deleteDoc(listRef);
          const detailRef = doc(db, "publicDeckDetails", deck.id);
          await deleteDoc(detailRef); 
          
          setSharedDecks(prevDecks => prevDecks.filter(d => d.id !== deck.id));

        } catch (error) {
          console.error("Error deleting document: ", error);
          showAlert("เกิดข้อผิดพลาด", "ไม่สามารถลบเด็คได้ โปรดลองอีกครั้ง");
        }
      },
      confirmText: "Confirm Delete",
      confirmIcon: <ClearIcon />
    });
  };

// === [เพิ่ม] ฟังก์ชันสำหรับกด Like ===
  const handleLikeDeck = async (deck) => {
    if (!userProfile) {
      showAlert("โปรดเข้าสู่ระบบ", "คุณต้องเข้าสู่ระบบก่อนจึงจะกด Like เด็คได้ค่ะ");
      return;
    }
    if (isLiking) return; // กันการกดรัว

    setIsLiking(true);
    const docRef = doc(db, "publicDecks", deck.id);
    const email = userProfile.email;
    const isLiked = (deck.likedBy || []).includes(email);

    try {
      if (isLiked) {
        // --- กรณี Unlike (กดซ้ำ) ---
        await updateDoc(docRef, {
          likeCount: increment(-1),
          likedBy: arrayRemove(email)
        });
        // อัปเดต State ทันที
        setSharedDecks(prevDecks =>
          prevDecks.map(d =>
            d.id === deck.id
              ? { ...d, likeCount: (d.likeCount || 0) - 1, likedBy: (d.likedBy || []).filter(e => e !== email) }
              : d
          )
        );
      } else {
        // --- กรณี Like (กดครั้งแรก) ---
        await updateDoc(docRef, {
          likeCount: increment(1),
          likedBy: arrayUnion(email)
        });
        // อัปเดต State ทันที
        setSharedDecks(prevDecks =>
          prevDecks.map(d =>
            d.id === deck.id
              ? { ...d, likeCount: (d.likeCount || 0) + 1, likedBy: [...(d.likedBy || []), email] }
              : d
          )
        );
      }
    } catch (error) {
      console.error("Error updating like: ", error);
      showAlert("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดต Like ได้ โปรดลองอีกครั้ง");
    } finally {
      setIsLiking(false);
    }
  };
  // === [สิ้นสุด] ฟังก์ชัน Like ===

  // [เพิ่ม] ฟังก์ชันสำหรับเปิด Modal ดูรายละเอียดเด็ค
  const handleViewDeck = async (deck) => {
    if (isDetailLoading) return;
    if (cardDb.length === 0) {
        showAlert("ฐานข้อมูลการ์ดว่างเปล่า", "ไม่สามารถแสดงรายละเอียดเด็คได้ กรุณากลับไปหน้าหลักเพื่อโหลดฐานข้อมูลการ์ดก่อน");
        return;
    }

    setIsDetailLoading(true);
    // เปิด Modal ทันทีด้วยข้อมูลหน้าปก (main/life ยังว่าง)
    setViewingDeck({ ...deck, main: [], life: [] }); 

    try {
      // ดึงข้อมูล "รายละเอียด" (ID การ์ด) จาก Collection "publicDeckDetails"
      const detailRef = doc(db, "publicDeckDetails", deck.id);
      const docSnap = await getDoc(detailRef);

      if (docSnap.exists()) {
        const detailData = docSnap.data();
        
        // แปลง Array ID การ์ด กลับเป็น Object การ์ด (Rehydration)
        const findCard = (id) => cardDb.find(c => c.id === id);
        const main = (detailData.mainDeck || []).map(findCard).filter(Boolean);
        const life = (detailData.lifeDeck || []).map(findCard).filter(Boolean);
        
        // อัปเดต Modal ด้วยข้อมูลการ์ดที่ครบถ้วน
        setViewingDeck({ ...deck, main, life });

      } else {
        throw new Error("Deck details not found");
      }
    } catch (error) {
      console.error("Error fetching deck details: ", error);
      showAlert("เกิดข้อผิดพลาด", "ไม่สามารถดึงรายละเอียดเด็คได้");
      setViewingDeck(null); // ปิด Modal ถ้า Error
    } finally {
      setIsDetailLoading(false);
    }
  };

  // === [เพิ่ม] ฟังก์ชันสำหรับ "เริ่ม" ถ่ายรูป ===
  const handleTakePhoto = (deckData, analysisData) => {
    if (isCapturing) return;
    setIsCapturing(true);
    // (เรารวมข้อมูล deck และ analysis ที่คำนวณแล้วใน Modal มาด้วย)
    setImageDeck({ ...deckData, analysis: analysisData }); 
  };

  // === [เพิ่ม] useEffect สำหรับ "จัดการ" การถ่ายรูป ===
  useEffect(() => {
    if (imageDeck && imageTemplateRef.current) {
      
      html2canvas(imageTemplateRef.current, {
        useCORS: true,
        scale: 1.5,
        backgroundColor: '#1e293b' // (ใส่สีพื้นหลัง)
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${imageDeck.deckName || 'deck'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(err => {
        console.error("Error capturing image: ", err);
        showAlert("เกิดข้อผิดพลาด", "ไม่สามารถถ่ายรูปได้ โปรดลองอีกครั้ง");
      }).finally(() => {
        setIsCapturing(false);
        setImageDeck(null); // (ลบ Template ทิ้ง)
      });
    }
  }, [imageDeck, showAlert]); // ทำงานเมื่อ imageDeck เปลี่ยน


  // (ส่วน return JSX ที่อัปเดตแล้ว)
  return (
    <div className="h-screen flex flex-col text-gray-200 bg-black">
      <style>{`
        ::-webkit-scrollbar{width:8px}
        ::-webkit-scrollbar-track{background:#0f172a}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#334155}
        
        /* === [เพิ่ม] CSS สำหรับซ่อน Template ถ่ายรูป === */
        .image-render-target {
          position: fixed;
          top: -9999px; /* (ส่งไปนอกจอ) */
          left: 0;
          width: 1280px; /* (ความกว้างคงที่) */
          height: auto; /* <--- [แก้ไข] สูงอัตโนมัติตามเนื้อหา */
          background: #1e293b;
          padding: 24px; 
          box-shadow: 0 0 30px rgba(0,0,0,0.5);
          display: flex;
          gap: 24px; 
          flex-shrink: 0; 
          flex-grow: 0;
          /* (ลบ overflow: hidden) */
        }
      `}</style>    
      <header className="px-4 lg:px-6 py-2 border-b border-emerald-700/30 bg-black/60 backdrop-blur-sm shrink-0 z-40">
         <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 to-emerald-400 bg-clip-text text-transparent">
            Battle Of Talingchan
          </h1>
          <Link to="/">
            <Button className="bg-emerald-600/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50 hover:text-white">
              <ChevronLeftIcon />
              กลับไปหน้าจัดเด็ค
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-white mb-6">Public Shared Decks</h2>
        
        {/* === [แก้ไข] ส่วน Filter และ Search (ลบ Faction) === */}
        <div className="mb-8 p-4 bg-slate-900/70 rounded-xl border border-emerald-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. ช่องค้นหา */}
            <input
              type="search"
              placeholder="ค้นหาชื่อเด็ค..."
              className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-slate-700/50 placeholder-gray-400 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* 2. [ลบ] ปุ่มกรอง Faction */}
          </div>
          
          {/* === [แก้ไข] ปุ่มสำหรับจัดเรียง (ย้ายมาอยู่นี่) === */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-gray-400 text-sm mr-2">จัดเรียงตาม:</span>
            <Button 
              onClick={() => setSortOrder({ field: "sharedAt", direction: "desc" })}
              className={`text-sm ${sortOrder.field === 'sharedAt' && sortOrder.direction === 'desc' ? 'bg-amber-500/50 border-amber-400' : ''}`}
            >
              ล่าสุด (ใหม่ไปเก่า)
            </Button>
            <Button 
              onClick={() => setSortOrder({ field: "likeCount", direction: "desc" })}
              className={`text-sm ${sortOrder.field === 'likeCount' ? 'bg-amber-500/50 border-amber-400' : ''}`}
            >
              ความนิยม (Popular)
            </Button>
            <Button 
              onClick={() => setSortOrder({ field: "sharedAt", direction: "asc" })}
              className={`text-sm ${sortOrder.field === 'sharedAt' && sortOrder.direction === 'asc' ? 'bg-amber-500/50 border-amber-400' : ''}`}
            >
              เก่าไปใหม่
            </Button>
          </div>
          {/* === [สิ้นสุด] ปุ่มสำหรับจัดเรียง === */}
        </div>
        
        {/* === [สิ้นสุด] ส่วน Filter และ Search === */}
        
        {/* === [เริ่ม] ส่วนตรรกะการโหลดที่แก้ไขใหม่ === */}

        {/* 1. ขณะกำลังโหลดครั้งแรก (isLoading) -> ให้แสดง Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <DeckCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* 2. โหลดเสร็จแล้ว แต่ไม่มีเด็ค (sharedDecks.length === 0) */}
        {!isLoading && sharedDecks.length === 0 && (
          <div className="bg-slate-900/70 p-8 rounded-xl border border-emerald-500/20 text-center">
            <h3 className="text-2xl font-bold text-amber-300 mb-2">ยังไม่มีเด็คที่ถูกแชร์</h3>
            <p className="text-lg text-gray-300">
              กลับไปที่หน้า "My Deck List" ของคุณ แล้วกดปุ่ม "Share" เพื่อเป็นคนแรก!
            </p>
          </div>
        )}

        {/* 3. โหลดเสร็จแล้ว และมีเด็ค (sharedDecks.length > 0) */}
        {!isLoading && sharedDecks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* === [แก้ไข] เพิ่ม .filter() สำหรับ Search Box === */}
            {sharedDecks
              .filter(deck => 
                deck.deckName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(deck => (
                <DeckCard 
                  key={deck.id} 
                  deck={deck}
                  onViewDeck={handleViewDeck}
                  userProfile={userProfile}
                  onDeleteDeck={handleDeleteDeck}
                  isDetailLoading={isDetailLoading && viewingDeck?.id === deck.id}
                  
                  // === [เพิ่ม] props สำหรับ Like ===
                  onLikeDeck={handleLikeDeck}
                  isLiking={isLiking}
                  // === [สิ้นสุดการเพิ่ม] ===
                />
            ))}
          </div>
        )}

        {/* 4. ส่วนของปุ่ม "โหลดเพิ่มเติม" */}
        <div className="mt-12 text-center">
          {isLoadingMore ? (
            // ขณะกำลังโหลดเพิ่ม...
            <div className="text-center text-lg text-gray-400">กำลังโหลดเพิ่มเติม...</div>
          ) : hasMore && !isLoading && sharedDecks.length > 0 ? (
            // (ซ่อนปุ่มตอน isLoading ครั้งแรก)
            // แสดงปุ่ม "โหลดเพิ่มเติม"
            <Button
              onClick={() => fetchDecks(false)}
              disabled={isLoadingMore}
              className="bg-emerald-600/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50 hover:text-white"
            >
              {isLoadingMore ? "กำลังโหลด..." : "โหลดเพิ่มเติม"}
            </Button>
          ) : !isLoading && sharedDecks.length > 0 ? (
            // โหลดหมดแล้ว
            <p className="text-gray-500">ไม่มีเด็คเพิ่มเติมแล้ว</p>
          ) : null}
        </div>
        {/* === [สิ้นสุด] ส่วนตรรกะการโหลดที่แก้ไขใหม่ === */}

      </main>
        
      {/* (Modal เดิมของคุณ สำหรับ Alert และ Confirm) */}
      <Modal 
        isOpen={modal.isOpen} 
        title={modal.title} 
        onClose={closeModal} 
        onConfirm={modal.onConfirm} 
        confirmText={modal.onConfirm ? modal.confirmText || "Confirm" : undefined} 
        confirmIcon={modal.onConfirm ? modal.confirmIcon || <ClearIcon /> : undefined}
      >
        {modal.message}
      </Modal>

      {/* [เพิ่ม] Modal สำหรับดูรายละเอียดเด็ค */}
      <DeckViewModal
        isOpen={viewingDeck !== null}
        onClose={() => setViewingDeck(null)}
        deck={viewingDeck}
        showAlert={showAlert}
        isLoading={isDetailLoading}
        
        // === [เพิ่ม] ส่ง Props การถ่ายรูป ===
        isCapturing={isCapturing}
        onTakePhoto={handleTakePhoto}
      />

      {/* === [เพิ่ม] ส่วนสำหรับ Render รูปนอกจอ === */}
      {imageDeck && (
        <DeckImageTemplate 
          ref={imageTemplateRef} 
          deck={imageDeck} 
          analysis={imageDeck.analysis}
        />
      )}
      {/* === [สิ้นสุด] === */}
    </div>
  );
}