// ✨✨ นี่คือบรรทัดที่สำคัญที่สุด ✨✨
"use client"; // บอก Next.js ว่าหน้านี้ "ต้องทำงานที่ฝั่ง Client"
              // เพราะเราใช้ useState, useEffect และการลาก-วาง (DnD)

import { useEffect, useMemo, useRef, useState, forwardRef, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { useDrag, useDrop, useDragLayer } from "react-dnd"; // (DndProvider อยู่ใน layout.jsx แล้ว)
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { GoogleLogin } from '@react-oauth/google'; // (GoogleOAuthProvider อยู่ใน layout.jsx แล้ว)
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link'; // <--- ✨ [แก้ไข] Import Link จาก Next.js
import { db } from '@/lib/firebase'; // <--- ✨ [แก้ไข] Import จากที่ใหม่
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ✨ [แก้ไข] Import จากไฟล์ UI ที่เราสร้าง
import { Button, Pill, CardShell, ColorPip } from "@/components/ui/Common";
import Modal from "@/components/ui/Modal";
import {
  ImportIcon, ExportIcon, ClearIcon, DBLoadIcon, EyeIcon, CopyIcon, PlusIcon,
  CardsIcon, DeckIcon, ChevronLeftIcon, ChevronRightIcon, UsersIcon, UploadIcon
} from "@/components/ui/Icons";

// ✨ [แก้ไข] Import จากไฟล์ lib และ hooks
import { RULES, nameKey, countBy, validate, avg, encodeDeckCode, decodeDeckCode, encodePath } from "@/lib/utils.js";
import { useLocalStorage } from "@/hooks/useLocalStorage.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// === Drag & Drop and Animation Components ===
// (โค้ดส่วนนี้เหมือนเดิม)
const DND_TYPES = { CARD: "CARD" };
const DndStateContext = createContext({ isDragging: false });
const DndStateProvider = ({ children }) => { const { isDragging } = useDragLayer((monitor) => ({ isDragging: monitor.isDragging() })); return <DndStateContext.Provider value={{ isDragging }}>{children}</DndStateContext.Provider>; };
const useIsDragging = () => useContext(DndStateContext);
function CustomDragLayer() { const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({ item: monitor.getItem(), isDragging: monitor.isDragging(), currentOffset: monitor.getSourceClientOffset(), })); if (!isDragging || !currentOffset) return null; const { card } = item; const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(' - Only#1', ''); const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; return ( <div style={{ position: 'fixed', pointerEvents: 'none', zIndex: 1000, left: 0, top: 0, transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)` }}> <img src={imgPng} alt={card.name} className="w-40 h-auto rounded-lg shadow-2xl" /> </div> ); }
function FlyingCard({ card, startRect, endRect, onComplete }) { const [isAnimating, setIsAnimating] = useState(false); const hasCompleted = useRef(false); useEffect(() => { const timeoutId = setTimeout(() => setIsAnimating(true), 10); return () => clearTimeout(timeoutId); }, []); if (!card || !startRect || !endRect) return null; const handleTransitionEnd = () => { if (!hasCompleted.current) { hasCompleted.current = true; onComplete(); } }; const style = { position: 'fixed', zIndex: 1000, top: `${startRect.top}px`, left: `${startRect.left}px`, width: `${startRect.width}px`, height: `${startRect.height}px`, transition: 'all 0.5s ease-in-out' }; if (isAnimating) { style.top = `${endRect.top + endRect.height / 2 - 35}px`; style.left = `${endRect.left + endRect.width / 2 - 25}px`; style.width = '50px'; style.height = '70px'; style.opacity = 0; style.transform = 'rotate(15deg)'; } const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(' - Only#1', ''); const imgSrc = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; return ( <div style={style} onTransitionEnd={handleTransitionEnd}> <img src={imgSrc} alt={card.name} className="w-full h-full rounded-lg shadow-2xl" /> </div> ); }


// === [ย้ายมา] UI Component ที่ "ไม่ได้" แยกไฟล์ (ทางลัด) ===
// (เราจะเก็บ Component ใหญ่ๆ ไว้ในไฟล์นี้ไปก่อน เพื่อความง่าย)

// === ImportDeckModal (ย้ายมา) ===
const ImportDeckModal = ({ isOpen, onClose, onImport }) => { const [code, setCode] = useState(''); const handleImportClick = () => { onImport(code); setCode(''); }; if (!isOpen) return null; return createPortal( <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[210] p-4"> <div className="bg-slate-800 border border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md"> <h2 className="text-xl font-bold text-white mb-4">Import Deck Code</h2> <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="วางรหัสเด็คที่นี่..." rows="4" className="w-full px-3 py-2 border border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-slate-700/50 placeholder-gray-400 text-white mb-6 resize-none" /> <div className="flex justify-end gap-3"> <Button onClick={onClose} className="bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600">Cancel</Button> <Button onClick={handleImportClick} className="bg-emerald-900/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-800/50 hover:text-white"> <ImportIcon /> Import </Button> </div> </div> </div>, document.body ); };

// === Card component (ย้ายมา) ===
const CardItem = forwardRef(function CardItem({ card, onDoubleClick, onViewDetails, onAddCard }, ref) { const cardItemRef = useRef(null); const { isDragging: isAnythingDragging } = useIsDragging(); const [{ isDragging }, dragRef] = useDrag({ type: DND_TYPES.CARD, item: { card }, collect: (m) => ({ isDragging: m.isDragging() }) }); const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(' - Only#1', ''); const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; const imgJpg = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.jpg`; const hoverClasses = !isAnythingDragging ? 'hover:scale-[1.25] hover:z-50' : ''; return ( <CardShell ref={cardItemRef} className={`flex flex-col card group relative ${isDragging ? 'opacity-0' : ''} transition-transform duration-200 ease-in-out ${hoverClasses}`}> <div className="absolute top-2 right-2 z-10 flex flex-col gap-2"> <button onClick={() => onViewDetails(card)} className="p-1.5 bg-slate-900/50 rounded-full text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700 hover:text-white" title="ดูรายละเอียด"> <EyeIcon /> </button> <button onClick={() => onAddCard(card)} className="p-1.5 bg-emerald-600/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 active:scale-95" title="เพิ่มลงเด็ค"> <PlusIcon /> </button> </div> <img ref={dragRef} src={imgPng} alt={card.name} onDoubleClick={() => onDoubleClick(card, cardItemRef.current)} onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = imgJpg; else { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/300x420/1e293b/94a3b8?text=${encodeURIComponent(card.name)}`; } }} className="w-full h-auto rounded-md mb-3 object-cover aspect-[5/7] bg-slate-700 shadow hover:shadow-xl transition-shadow cursor-grab active:cursor-grabbing" loading="lazy" /> <div className="flex-grow flex flex-col justify-between"> <div> <div className="flex justify-between items-start gap-2"> <p className="font-bold text-xl text-white pr-2 line-clamp-2">{card.name}</p> <div className="flex items-center gap-2 shrink-0"> {card.colorType && <ColorPip color={card.colorType} />} <Pill className="bg-slate-600 text-gray-200">{card.type}</Pill> </div> </div> {card.rarity && <Pill className="mt-2 bg-slate-700 text-slate-300">{card.rarity}</Pill>} {card.onlyRank === 1 && <Pill className="mt-2 ml-1 bg-amber-500/10 text-amber-300 border border-amber-500/20">Only #1</Pill>} </div> </div> <div className="absolute top-full mt-1 left-0 right-0 z-[60] p-4 bg-slate-900 rounded-lg shadow-2xl border border-amber-500/50 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto max-h-96 overflow-y-auto"> <div className="grid grid-cols-3 gap-2 text-center"> <div><span className="text-base text-emerald-400">Cost</span><p className="font-bold text-2xl text-white">{card.cost ?? '-'}</p></div> <div><span className="text-base text-red-400">Power</span><p className="font-bold text-2xl text-white">{card.power ?? '-'}</p></div> <div><span className="text-base text-amber-400">Gem</span><p className="font-bold text-2xl text-white">{card.gem ?? '-'}</p></div> </div> <div className="pt-2"> <p className="text-base text-gray-400">ฝ่าย: <span className="font-semibold text-gray-200">{card.faction ?? 'ไม่มี'}</span></p> <p className="text-base text-gray-300 font-light mt-1 break-words">{card.text || 'ไม่มีเอฟเฟ็ค'}</p> {card.flavor && ( <p className="text-sm text-amber-200/70 italic mt-2 font-light break-words">"{card.flavor}"</p> )} </div> </div> </CardShell> ); });

// === Deck Tray (ย้ายมา) ===
const DeckTray = forwardRef(function DeckTray({ title, deck, onDropCard, onRemoveCard, capacity, highlight, onViewDeck }, ref) { const [{ isOver }, dropRef] = useDrop({ accept: DND_TYPES.CARD, drop: (item) => onDropCard(item.card), collect: (monitor) => ({ isOver: monitor.isOver() }), }); const groupedDeck = useMemo(() => { return Object.values(deck.reduce((m, card) => { const key = nameKey(card.name); if (!m[key]) m[key] = { card, count: 0 }; m[key].count++; return m; }, {})).sort((a, b) => a.card.name.localeCompare(b.card.name, 'th')); }, [deck]); const cardsPerRow = 12; const numRows = groupedDeck.length > 0 ? Math.floor((groupedDeck.length - 1) / cardsPerRow) + 1 : 1; const containerHeight = numRows * 40 + 40; return ( <div ref={ref} className={`p-2 rounded-md border-2 ${isOver || highlight ? 'border-amber-400' : 'border-slate-600'} transition-colors bg-slate-900/50`}> <div ref={dropRef}> <div className="flex items-center justify-between mb-2 gap-2"> <h3 className="text-xs font-bold text-white uppercase tracking-wider shrink-0">{title}</h3> {onViewDeck && deck.length > 0 && ( <button onClick={onViewDeck} className="text-xs text-amber-400 hover:text-amber-200 hover:underline transition">ดูเด็ค</button> )} <div className="flex-grow text-right"> {typeof capacity === 'number' && (<span className="text-xs text-slate-300">{deck.length}{capacity ? ` / ${capacity}` : ''}</span>)} </div> </div> <div className="relative w-full transition-all" style={{ height: `${containerHeight}px` }}> {groupedDeck.length === 0 ? ( <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs">ลากการ์ดมาวางที่นี่</div> ) : ( <div className="absolute inset-0"> {groupedDeck.map(({ card, count }, index) => { const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(' - Only#1', ''); const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; const rowIndex = Math.floor(index / cardsPerRow); const colIndex = index % cardsPerRow; return ( <div key={`${card.id}-${index}`} className="absolute transition-all duration-200 ease-in-out group hover:-translate-y-2 hover:z-50" style={{ left: `${colIndex * 22}px`, top: `${rowIndex * 40}px`, zIndex: colIndex, width: '56px' }} title={`คลิกเพื่อลบ ${card.name}`} onClick={() => onRemoveCard(card)} > <img src={thumbPng} alt={card.name} className="w-full h-auto rounded-md shadow-lg border-2 border-slate-600 group-hover:border-red-500 cursor-pointer" onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); } }} /> {count > 1 && (<div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full border-2 border-slate-800">{count}</div>)} </div> ); })} </div> )} </div> </div> </div> ); });

// === CardDetailModal (ย้ายมา) ===
function CardDetailModal({ card, onClose }) { if (!card) return null; const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(' - Only#1', ''); const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; const imgJpg = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.jpg`; return createPortal( <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[300] p-4" onClick={onClose}> <img src={imgPng} alt={card.name} className="max-w-full max-h-full h-auto w-auto object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) { e.currentTarget.src = imgJpg; } }} /> <button onClick={onClose} className="absolute top-4 right-4 text-white bg-slate-800/50 rounded-full p-2 hover:bg-slate-700"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button> </div>, document.body ); }

// === DeckViewModal (ย้ายมา) ===
function DeckViewModal({ isOpen, onClose, deck, rules, onAddCard, onRemoveCard, title }) { const groupedDeck = useMemo(() => { if (!deck) return []; return Object.values(deck.reduce((m, card) => { const key = nameKey(card.name); if (!m[key]) m[key] = { card, count: 0 }; m[key].count++; return m; }, {})).sort((a, b) => a.card.name.localeCompare(b.card.name, 'th')); }, [deck]); if (!isOpen) return null; return createPortal( <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4"> <div className="bg-slate-900/70 border border-emerald-500/30 rounded-xl shadow-2xl w-full h-full flex flex-col"> <header className="flex items-center justify-between p-4 border-b border-emerald-500/20 shrink-0"> <h2 className="text-2xl font-bold text-white">{title} ({deck.length} / {rules.size})</h2> <Button onClick={onClose}>Close</Button> </header> <div className="flex-grow overflow-y-auto p-4"> {groupedDeck.length === 0 ? ( <div className="flex items-center justify-center h-full"><p className="text-slate-400">เด็คนี้ว่างเปล่า</p></div> ) : ( <div className="flex flex-wrap justify-center gap-4"> {groupedDeck.map(({ card, count }) => { const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(' - Only#1', ''); const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; const isAtMaxCopies = rules.maxCopiesPerName && count >= rules.maxCopiesPerName; return ( <div key={card.id} className="w-40 flex flex-col items-center"> <img src={thumbPng} alt={card.name} className="w-full rounded-lg shadow-md mb-2" /> <div className="w-full flex items-center justify-around gap-2 bg-slate-800/50 p-1 rounded-md"> <button onClick={() => onRemoveCard(card)} className="flex items-center justify-center w-7 h-7 bg-red-800/70 rounded-full hover:bg-red-700 transition active:scale-95 text-white font-bold text-xl">-</button> <span className="font-bold text-lg text-white w-6 text-center">{count}</span> <button onClick={() => onAddCard(card)} disabled={isAtMaxCopies} className="flex items-center justify-center w-7 h-7 bg-emerald-800/70 rounded-full hover:bg-emerald-700 transition active:scale-95 text-white font-bold text-xl disabled:bg-slate-600 disabled:cursor-not-allowed">+</button> </div> </div> ); })} </div> )} </div> </div> </div>, document.body ); }

// === Deck Analysis Modal (ย้ายมา) ===
function DeckAnalysisModal({ isOpen, onClose, mainDeck, lifeDeck, showAlert }) { 
    const analysis = useMemo(() => {
        if (!mainDeck || mainDeck.length === 0) return null;
        const typeOrder = { 'Avatar': 1, 'Magic': 2, 'Construction': 3 };
        const only1Card = mainDeck.find(c => c.onlyRank === 1);
        const avatars = mainDeck.filter(c => c.type === 'Avatar' && c.onlyRank !== 1).sort((a, b) => a.name.localeCompare(b.name, 'th'));
        const magics = mainDeck.filter(c => c.type === 'Magic').sort((a, b) => a.name.localeCompare(b.name, 'th'));
        const constructs = mainDeck.filter(c => c.type === 'Construction').sort((a, b) => a.name.localeCompare(b.name, 'th'));
        const otherCards = mainDeck.filter(c => c.onlyRank !== 1 && !['Avatar', 'Magic', 'Construction'].includes(c.type)).sort((a, b) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99) || a.name.localeCompare(b.name, 'th'));
        const avgCost = avg(mainDeck.map(c => c.cost)); const avgPower = avg(mainDeck.map(c => c.power)); const avgGem = avg(mainDeck.map(c => c.gem));
        const typeCounts = countBy(mainDeck, c => c.type); const cardTypes = Object.entries(typeCounts).sort(([a], [b]) => (typeOrder[a] || 99) - (typeOrder[b] || 99));
        const labels = ['ความไวต้นเกม', 'กลางเกม', 'ท้ายเกม', 'พลังโจมตี', 'การป้องกัน', 'การสนับสนุน']; const maxStatValue = 100;
        const earlyGameScore = (mainDeck.filter(c => (c.cost ?? 0) <= 2).length / (mainDeck.length * 0.5)) * maxStatValue; const midGameScore = (mainDeck.filter(c => (c.cost ?? 0) >= 3 && (c.cost ?? 0) <= 5).length / (mainDeck.length * 0.4)) * maxStatValue; const lateGameScore = (mainDeck.filter(c => (c.cost ?? 0) >= 6).length / (mainDeck.length * 0.2)) * maxStatValue; const offenseScore = (parseFloat(avgPower) / 6) * maxStatValue; const defenseScore = (mainDeck.filter(c => c.type !== 'Magic').length / 40) * maxStatValue; const utilityScore = ((typeCounts['Magic'] || 0) / 15) * maxStatValue; 
        const radarData = { labels, datasets: [{ label: 'ศักยภาพเด็ค', data: [earlyGameScore, midGameScore, lateGameScore, offenseScore, defenseScore, utilityScore].map(v => Math.round(Math.min(100, Math.max(0, v || 0)))), backgroundColor: 'rgba(52, 211, 153, 0.2)', borderColor: 'rgb(52, 211, 153)', pointBackgroundColor: 'rgb(52, 211, 153)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(52, 211, 153)' }]};
        const radarOptions = { scales: { r: { angleLines: { color: 'rgba(255, 255, 255, 0.2)' }, grid: { color: 'rgba(255, 255, 255, 0.2)' }, pointLabels: { color: 'rgb(209, 213, 219)', font: { size: 12 } }, ticks: { color: 'rgb(156, 163, 175)', backdropColor: 'rgba(0, 0, 0, 0.5)', stepSize: 20, maxTicksLimit: 6, }, min: 0, max: 100, }, }, plugins: { legend: { display: false }, tooltip: { enabled: true } }, maintainAspectRatio: false };
        const deckCode = encodeDeckCode(mainDeck, lifeDeck);
        return { avgCost, avgPower, avgGem, cardTypes, radarData, radarOptions, deckCode, only1Card, avatars, magics, constructs, otherCards };
    }, [mainDeck, lifeDeck]);
    const handleCopyCode = () => { if (analysis?.deckCode) { navigator.clipboard.writeText(analysis.deckCode) .then(() => showAlert("Success!", `✅ คัดลอกรหัสเด็คลง Clipboard แล้ว!`)) .catch(err => { console.error('Failed to copy code: ', err); showAlert("Error", "ไม่สามารถคัดลอกรหัสเด็คได้"); }); } };
    if (!isOpen || !analysis) return null;
    const renderCardSection = (title, cards) => { if (!cards || cards.length === 0) return null; const groupedCards = cards.reduce((acc, card) => { const existing = acc.find(item => item.card.id === card.id); if (existing) { existing.count++; } else { acc.push({ card, count: 1 }); } return acc; }, []); return ( <div className="mt-6"> <h4 className="text-lg font-semibold text-emerald-300 border-b border-emerald-400/20 pb-1 mb-3">{title} ({cards.length} ใบ)</h4> <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-2 justify-center"> {groupedCards.map(({ card, count }) => { const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(' - Only#1', ''); const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; return ( <div key={card.id} className="relative w-24"> <img src={thumbPng} alt={card.name} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} /> {count > 1 && ( <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full border-2 border-slate-800">{count}</div> )} </div> ); })} </div> </div> ); }
    return createPortal( <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[250] p-4"> <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl shadow-2xl w-full h-full flex flex-col max-w-7xl max-h-[90vh]"> <header className="flex items-center justify-between p-4 border-b border-emerald-500/20 shrink-0"> <h2 className="text-2xl font-bold text-white">ผลลัพธ์การสร้างเด็ค</h2> <Button onClick={onClose}>Close</Button> </header> <div className="flex-grow overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 p-6"> <div className="md:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2"> <div> <h3 className="text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3">สถิติเด็ค</h3> <div className="grid grid-cols-3 gap-4 text-center"> <div><span className="text-sm text-gray-400">Avg Cost</span><p className="text-2xl font-bold text-emerald-400">{analysis.avgCost}</p></div> <div><span className="text-sm text-gray-400">Avg Power</span><p className="text-2xl font-bold text-red-400">{analysis.avgPower}</p></div> <div><span className="text-sm text-gray-400">Avg Gem</span><p className="text-2xl font-bold text-amber-400">{analysis.avgGem}</p></div> </div> </div> <div className="aspect-square w-full max-w-[350px] mx-auto"> <Radar data={analysis.radarData} options={analysis.radarOptions} /> </div> <div> <h3 className="text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3">ประเภทการ์ด</h3> <ul className="space-y-1 text-sm"> {analysis.cardTypes.map(([type, count]) => ( <li key={type} className="flex justify-between"> <span>{type}</span> <span>{count} ใบ</span> </li> ))} </ul> </div> <div> <h3 className="text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3">รหัส Export</h3> <Button onClick={handleCopyCode} className="w-full"> <CopyIcon /> คัดลอกรหัสเด็ค </Button> </div> </div> <div className="md:col-span-2 overflow-y-auto pr-2 border-l border-emerald-500/20 pl-6"> <h3 className="text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-4">การ์ดในเด็ค ({mainDeck.length} ใบ)</h3> {analysis.only1Card && ( <div className="mb-6 flex flex-col items-center"> <h4 className="text-lg font-semibold text-emerald-300 mb-3">Only #1</h4> <div className="relative w-36 mx-auto"> <img src={`/cards/${encodePath(analysis.only1Card.imagePath)}/${encodeURIComponent(analysis.only1Card.id.replace(' - Only#1', ''))}.png`} alt={analysis.only1Card.name} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} /> </div> </div> )} {renderCardSection("Avatar Cards", analysis.avatars)} {renderCardSection("Magic Cards", analysis.magics)} {renderCardSection("Construct Cards", analysis.constructs)} {analysis.otherCards.length > 0 && renderCardSection("Other Cards", analysis.otherCards)} </div> </div> </div> </div>, document.body ); }

// === Deck List Modal (ย้ายมา) ===
function DeckListModal({
  isOpen, onClose, userProfile, userDecks, setUserDecks, mainDeck, lifeDeck, setMainDeck, setLifeDeck,
  showAlert, setModal, closeModal, encodeDeckCode, decodeDeckCode, allCards, onShowCards
}) {
  const [importingSlot, setImportingSlot] = useState(null);
  const [importCode, setImportCode] = useState('');
  if (!isOpen || !userProfile) return null;
  const email = userProfile.email;
  const getUserSlots = () => { const defaultSlots = [ { name: "Slot 1", main: [], life: [] }, { name: "Slot 2", main: [], life: [] } ]; const userData = userDecks[email] || { slots: defaultSlots }; if (!userDecks[email]) { setUserDecks(prev => ({ ...prev, [email]: userData })); } return userData.slots; };
  const slots = getUserSlots();
  const updateSlots = (newSlots) => { setUserDecks(prev => ({ ...prev, [email]: { ...prev[email], slots: newSlots } })); };
  const handleNameChange = (index, newName) => { const newSlots = [...slots]; newSlots[index].name = newName; updateSlots(newSlots); };
  const handleSave = (index) => { const newSlots = [...slots]; newSlots[index] = { ...newSlots[index], main: mainDeck, life: lifeDeck }; updateSlots(newSlots); showAlert("Deck Saved!", `บันทึกเด็คปัจจุบันลงใน "${newSlots[index].name}" แล้ว`); };
  const handleLoad = (index) => { const slot = slots[index]; if (slot.main.length === 0 && slot.life.length === 0) { showAlert("Empty Slot", "Slot นี้ว่างเปล่า ไม่มีอะไรให้โหลด"); return; } setMainDeck(slot.main); setLifeDeck(slot.life); showAlert("Deck Loaded!", `โหลดเด็ค "${slot.name}" เรียบร้อย`); onClose(); };
  const handleExport = (index) => { const slot = slots[index]; if (slot.main.length === 0 && slot.life.length === 0) { showAlert("Empty Slot", "ไม่สามารถ Export Slot ที่ว่างเปล่าได้"); return; } const code = encodeDeckCode(slot.main, slot.life); navigator.clipboard.writeText(code) .then(() => showAlert("Success!", `✅ คัดลอกรหัส Export ของ "${slot.name}" แล้ว!`)) .catch(err => showAlert("Error", "ไม่สามารถคัดลอกรหัสได้")); };
  const handleImport = (index) => { setImportingSlot(index); setImportCode(''); };
  const confirmInternalImport = () => { const decoded = decodeDeckCode(importCode, allCards); if (decoded) { const newSlots = [...slots]; newSlots[importingSlot].main = decoded.main; newSlots[importingSlot].life = decoded.life; updateSlots(newSlots); showAlert("Import Success", `นำเข้าเด็คลงใน "${slots[importingSlot].name}" สำเร็จ!`); } else { showAlert("Import Error", "รหัสเด็คไม่ถูกต้อง หรือไม่พบการ์ด"); } setImportingSlot(null); };
  const handleShareDeck = async (index) => {
    closeModal(); // ปิด Modal "Confirm Share" ทันที
    const slot = slots[index];
    const only1Card = slot.main.find(c => c.onlyRank === 1);
    if (!only1Card) { showAlert("ไม่สามารถแชร์ได้", "เด็คของคุณต้องมี 'Only #1' Card (การ์ดหลัก) ก่อนจึงจะแชร์ได้ค่ะ"); return; }
    setModal({
      isOpen: true, title: "Confirm Share Deck", message: `คุณต้องการแชร์เด็ค "${slot.name}" สู่สาธารณะใช่หรือไม่? (ชื่อและรูปโปรไฟล์ Google ของคุณจะถูกแสดง)`,
      onConfirm: async () => {
        closeModal(); // ปิด Modal ยืนยัน
        try {
          const deckData = {
            deckName: slot.name, mainDeck: slot.main.map(c => c.id), lifeDeck: slot.life.map(c => c.id),
            only1CardData: { id: only1Card.id, name: only1Card.name, imagePath: only1Card.imagePath, },
            user: { name: userProfile.name, picture: userProfile.picture, email: userProfile.email, },
            sharedAt: serverTimestamp()
          };
          const docRef = await addDoc(collection(db, "publicDecks"), deckData);
          console.log("Deck shared with ID: ", docRef.id);
          showAlert("แชร์สำเร็จ!", `เด็ค "${slot.name}" ของคุณถูกแชร์สู่สาธารณะแล้ว!`);
        } catch (e) { console.error("Error adding document: ", e); showAlert("เกิดข้อผิดพลาด", "ไม่สามารถแชร์เด็คได้ โปรดลองอีกครั้ง"); }
      },
      confirmText: "Confirm Share", confirmIcon: <UploadIcon />
    });
  };
  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[220] p-4">
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-emerald-500/20 shrink-0"> <h2 className="text-2xl font-bold text-white">Deck List Manager</h2> <Button onClick={onClose}>Close</Button> </header>
          <div className="flex-grow overflow-y-auto p-6">
            <p className="text-gray-300 mb-6"> บันทึกเด็คของคุณที่เชื่อมต่อกับบัญชี: <span className="font-bold text-amber-300">{userProfile.email}</span> </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slots.map((slot, index) => {
                const deckSize = slot.main.length + slot.life.length;
                return (
                  <CardShell key={index} className="flex flex-col gap-4">
                    <input type="text" value={slot.name} onChange={(e) => handleNameChange(index, e.target.value)} className="w-full px-3 py-2 border border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-slate-700/50 placeholder-gray-400 text-white text-lg font-bold" />
                    <p className="text-sm text-slate-400"> {deckSize > 0 ? `มี ${slot.main.length} (Main) / ${slot.life.length} (Life) ใบ` : "Slot ว่าง"} </p>
                    <div className="grid grid-cols-2 gap-2"> <Button onClick={() => handleLoad(index)} disabled={deckSize === 0} className="bg-emerald-600/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50 hover:text-white"> Load </Button> <Button onClick={() => handleSave(index)} className="bg-amber-600/30 border-amber-500/30 text-amber-300 hover:bg-amber-500/50 hover:text-white"> Save Current </Button> </div>
                    <Button onClick={() => onShowCards({ main: slot.main, life: slot.life })} disabled={deckSize === 0} className="w-full bg-blue-600/30 border-blue-500/30 text-blue-300 hover:bg-blue-500/50 hover:text-white"> <EyeIcon /> Show Cards </Button>
                    <div className="grid grid-cols-3 gap-2"> <Button onClick={() => handleImport(index)}> <ImportIcon /> Import </Button> <Button onClick={() => handleExport(index)} disabled={deckSize === 0}> <ExportIcon /> Export </Button> <Button onClick={() => handleShareDeck(index)} disabled={deckSize === 0} className="bg-blue-600/30 border-blue-500/30 text-blue-300 hover:bg-blue-500/50 hover:text-white"> <UploadIcon /> Share </Button> </div>
                  </CardShell>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {importingSlot !== null && createPortal( <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[230] p-4"> <div className="bg-slate-800 border border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md"> <h2 className="text-xl font-bold text-white mb-4">Import Deck Code (to {slots[importingSlot].name})</h2> <textarea value={importCode} onChange={(e) => setImportCode(e.target.value)} placeholder="วางรหัสเด็คที่นี่..." rows="4" className="w-full px-3 py-2 border border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-slate-700/50 placeholder-gray-400 text-white mb-6 resize-none" /> <div className="flex justify-end gap-3"> <Button onClick={() => setImportingSlot(null)} className="bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600">Cancel</Button> <Button onClick={confirmInternalImport} className="bg-emerald-900/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-800/50 hover:text-white"> <ImportIcon /> Import </Button> </div> </div> </div>, document.body )}
    </>,
    document.body
  );
}

// === Sidebar (ย้ายมา) ===
function LeftSidebar({ isSidebarOpen, searchTerm, setSearchTerm, allCardTypes, filterTypes, setFilterTypes, filterMagicType, setFilterMagicType, allColorTypes, filterColors, setFilterColors, allRarities, filterRarities, setFilterRarities, allSets, selectedSets, onSetSelectionChange, statFilters, onStatFilterChange, mainDeck, lifeDeck, RULES, addToMain, addToLife, removeFromMain, removeFromLife, handleImport, handleExport, handleClear, handleReloadFromTxt, mainDeckRef, onViewDeck, onAnalyzeDeck, isLoadingAnalysis, }) { const allMagicTypes = ['Modification', 'Land', 'React', 'Normal']; const handleToggle = (setter, value) => { setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]); }; return ( <aside className={`w-full flex flex-col p-4 bg-black/40 md:h-full md:w-full md:shrink-0 md:border-r border-emerald-700/30 backdrop-blur-lg z-30 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}> <div className="flex-1 md:overflow-y-auto pr-2 space-y-4"> <div> <h2 className="text-xl font-bold text-white mb-2">Filters</h2> <input type="search" placeholder="ค้นหาชื่อการ์ดหรือข้อความ..." className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-slate-700/50 placeholder-gray-400 text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /> </div> {allCardTypes.length > 0 && ( <div className="flex flex-wrap gap-2"> <button onClick={() => setFilterTypes([])} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterTypes.length === 0 ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`}>All</button> {allCardTypes.map((type) => (<button key={type} onClick={() => handleToggle(setFilterTypes, type)} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterTypes.includes(type) ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`}>{type}</button>))} </div> )} {filterTypes.includes('Magic') && ( <div className="pl-4 mt-2 border-l-2 border-slate-600"> <h3 className="text-sm font-semibold text-gray-400 mt-2 mb-2 uppercase tracking-wider">Magic Type</h3> <div className="flex flex-wrap gap-2"> {['All', ...allMagicTypes].map((magicType) => ( <button key={magicType} onClick={() => setFilterMagicType(magicType)} className={`px-3 py-1 text-xs rounded-full transition-colors ${filterMagicType === magicType ? 'bg-amber-600 text-white font-semibold shadow' : 'bg-slate-600 hover:bg-slate-500 text-gray-300'}`} > {magicType} </button> ))} </div> </div> )} {allColorTypes.length > 0 && ( <div> <h3 className="text-sm font-semibold text-gray-400 mt-4 mb-2 uppercase tracking-wider">Color Type</h3> <div className="flex flex-wrap gap-2"> <button onClick={() => setFilterColors([])} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterColors.length === 0 ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`}>All</button> {allColorTypes.map((color) => ( <button key={color} onClick={() => handleToggle(setFilterColors, color)} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterColors.includes(color) ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`}>{color}</button> ))} </div> </div> )} {allRarities.length > 0 && ( <div> <h3 className="text-sm font-semibold text-gray-400 mt-4 mb-2 uppercase tracking-wider">Rarity</h3> <div className="flex flex-wrap gap-2"> <button onClick={() => setFilterRarities([])} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterRarities.length === 0 ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`}>All</button> {allRarities.map((rarity) => ( <button key={rarity} onClick={() => handleToggle(setFilterRarities, rarity)} className={`px-3 py-1 text-sm rounded-full transition-colors ${filterRarities.includes(rarity) ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`}>{rarity}</button> ))} </div> </div> )} {allSets.length > 0 && ( <div> <h3 className="text-lg font-semibold text-white mb-2 mt-4">Card Sets</h3> <div className="space-y-2 max-h-40 overflow-y-auto pr-2"> {allSets.map(set => ( <label key={set} className="flex items-center gap-2 text-gray-300 cursor-pointer"> <input type="checkbox" checked={selectedSets.includes(set)} onChange={() => onSetSelectionChange(set)} className="w-4 h-4 rounded bg-slate-600 border-slate-500 text-amber-500 focus:ring-amber-500" /> {typeof set === 'string' ? (set.split('/')[1] || set) : set} </label> ))} </div> </div> )} <div> <h3 className="text-lg font-semibold text-white mb-2 mt-4">Stats</h3> <div className="grid grid-cols-3 gap-2 text-sm"> {['cost', 'power', 'gem'].map(stat => ( <div key={stat}> <label className="capitalize text-gray-400">{stat}</label> <input type="number" placeholder="Min" min="0" value={statFilters[stat].min} onChange={(e) => onStatFilterChange(stat, 'min', e.target.value)} className="w-full mt-1 px-2 py-1 border border-emerald-500/30 rounded-md bg-slate-700/50 text-white text-center" /> <input type="number" placeholder="Max" min="0" value={statFilters[stat].max} onChange={(e) => onStatFilterChange(stat, 'max', e.target.value)} className="w-full mt-1 px-2 py-1 border border-emerald-500/30 rounded-md bg-slate-700/50 text-white text-center" /> </div> ))} </div> </div> </div> <div className="shrink-0 pt-4"> <div className="flex flex-col gap-4 mb-4"> <DeckTray ref={mainDeckRef} title={`Main Deck`} deck={mainDeck} capacity={RULES.main.size} onDropCard={addToMain} onRemoveCard={removeFromMain} highlight onViewDeck={() => onViewDeck('main')} /> <DeckTray title={`Life Deck`} deck={lifeDeck} capacity={RULES.life.size} onDropCard={addToLife} onRemoveCard={removeFromLife} onViewDeck={() => onViewDeck('life')} /> </div> <Button onClick={onAnalyzeDeck} disabled={isLoadingAnalysis} className="w-full bg-emerald-600/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50 hover:text-white"> {isLoadingAnalysis ? 'กำลังประมวลผล...' : 'สร้างเด็ค'} </Button> <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-emerald-700/30"> <Button onClick={handleImport}><ImportIcon /> Import</Button> <Button onClick={handleExport}><ExportIcon /> Export</Button> <Button onClick={handleClear} className="col-span-2 bg-red-900/50 border-red-500/30 text-red-300 hover:bg-red-800/50 hover:text-white"><ClearIcon/> Clear Deck</Button> <Button onClick={handleReloadFromTxt} className="col-span-2"><DBLoadIcon /> Reload from TXT</Button> </div> </div> </aside> ); }

// === Card grid (ย้ายมา) ===
function CardGrid({ cards, onDoubleClick, onViewDetails, onAddCard }) { if (cards.length === 0) { return (<CardShell><div className="text-center py-16 text-slate-300">ไม่พบการ์ดตามเงื่อนไข</div></CardShell>); } return ( <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8"> {cards.map((card) => ( <CardItem key={card.id} card={card} onDoubleClick={onDoubleClick} onViewDetails={onViewDetails} onAddCard={onAddCard}/> ))} </div> ); }

// === Data loading from TXT (ย้ายมา) ===
// (หมายเหตุ: CARD_PATHS อาจจะต้องถูกย้ายไปไฟล์ config)
const CARD_PATHS = [
    'BOT-S01/Red', 'BOT-S01/Green', 'BOT-S01/Blue', 'BOT-S01/Purple', 'BOT-S01/Yellow', 'BOT-S01/Black', 'BOT-S01/White', 'BOT-S01/Item',
    // ... (เพิ่ม path อื่นๆ ถ้ามี)
];
async function fetchAllTxt() { let allCards = []; console.log("📦 Reloading cards from TXT..."); for (const pathString of CARD_PATHS) { const encodedPath = encodePath(pathString); const pathParts = typeof pathString === 'string' ? pathString.split('/') : []; const deckName = pathParts[1] || ''; const filename = `cards${deckName}.txt`; const url = `/cards/${encodedPath}/${encodeURIComponent(filename)}`; try { const res = await fetch(url); if (!res.ok) { console.warn(`Could not fetch ${url}. Status: ${res.status}`); continue; } const txt = await res.text(); const data = JSON.parse(txt); if (Array.isArray(data)) { const withPath = data.map(card => ({ ...card, imagePath: pathString, onlyRank: card.id.includes('- Only#1') ? 1 : card.onlyRank })); allCards = allCards.concat(withPath); console.log(`  ✔ ${data.length} from ${pathString}`); } } catch (e) { console.error(`load fail ${url}`, e); } } console.log(`✅ โหลดการ์ดทั้งหมด ${allCards.length} ใบ`); return allCards; }
const getMagicSubType = (card) => { if (card.type !== 'Magic') { return null; } return card.magicType || 'Normal'; };


// === Main App Component (เปลี่ยนชื่อเป็น Page) ===
export default function Page() {
  const [mainDeck, setMainDeck] = useLocalStorage("bot-mainDeck-v32-final", []); 
  const [lifeDeck, setLifeDeck] = useLocalStorage("bot-lifeDeck-v32-final", []); 
  const [cardDb, setCardDb] = useLocalStorage("bot-cardDb-v32-final", []);
  
  const [userDecks, setUserDecks] = useLocalStorage("bot-userDecks-v1", {});
  const [isDeckListModalOpen, setIsDeckListModalOpen] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false); 
  const [flyingCard, setFlyingCard] = useState(null); 
  const mainDeckRef = useRef(null); 
  const [zoomedCard, setZoomedCard] = useState(null); 
  
  const [analysisDeck, setAnalysisDeck] = useState(null);
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null }); 
  const [isImportModalOpen, setIsImportModalOpen] = useState(false); 
  const closeModal = () => setModal({ isOpen: false, title: '', message: '', onConfirm: null }); 
  const showAlert = (title, message) => setModal({ isOpen: true, title, message, onConfirm: null }); 
  const closeImportModal = () => setIsImportModalOpen(false);

  const [userProfile, setUserProfile] = useLocalStorage("bot-userProfile-v1", null);

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded User Info:", decoded);
      setUserProfile({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });
      
      if (!userDecks[decoded.email]) {
        console.log("Creating new deck slots for user:", decoded.email);
        setUserDecks(prev => ({
          ...prev,
          [decoded.email]: {
            slots: [
              { name: "Slot 1", main: [], life: [] },
              { name: "Slot 2", main: [], life: [] }
            ]
          }
        }));
      }

    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  };

  const handleLoginError = () => {
    console.log('Login Failed');
    showAlert("Login Failed", "ไม่สามารถเข้าสู่ระบบด้วย Google ได้ โปรดลองอีกครั้ง");
  };

  const handleLogout = () => {
    setUserProfile(null);
    setIsDeckListModalOpen(false);
    console.log("User logged out.");
  };

  useEffect(() => { if (cardDb.length === 0) { handleReloadFromTxt(); } }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterTypes, filterMagicType, filterColors, filterRarities, selectedSets, statFilters]);

  const handleAnalyzeDeck = () => { 
    if (mainDeck.length === 0) { 
      showAlert("ไม่มีการ์ดในเด็ค", "โปรดใส่การ์ดใน Main Deck ก่อนทำการสร้างเด็ค"); 
      return; 
    } 
    setIsLoadingAnalysis(true); 
    setTimeout(() => { 
      setIsLoadingAnalysis(false); 
      setAnalysisDeck({ main: mainDeck, life: lifeDeck });
    }, 500); 
  };
  
  const handleReloadFromTxt = async () => { const all = await fetchAllTxt(); if (all.length > 0) setCardDb(all); };
  const handleSetSelectionChange = (set) => { setSelectedSets(prev => prev.includes(set) ? prev.filter(s => s !== set) : [...prev, set]); };
  const handleStatFilterChange = (stat, field, value) => { const numValue = value === '' ? '' : Math.max(0, parseInt(value, 10)); setStatFilters(prev => ({ ...prev, [stat]: { ...prev[stat], [field]: numValue } })); };

  const filteredCardDb = useMemo(() => { if (cardDb.length === 0) return []; return cardDb.filter((c) => { const term = searchTerm.toLowerCase(); if (!((c.name?.toLowerCase().includes(term) || (c.text || "").toLowerCase().includes(term)))) return false; if (selectedSets.length > 0 && !selectedSets.includes(c.imagePath)) return false; if (statFilters.cost.min !== '' && (c.cost ?? 0) < statFilters.cost.min) return false; if (statFilters.cost.max !== '' && (c.cost ?? 0) > statFilters.cost.max) return false; if (statFilters.power.min !== '' && (c.power ?? 0) < statFilters.power.min) return false; if (statFilters.power.max !== '' && (c.power ?? 0) > statFilters.power.max) return false; if (statFilters.gem.min !== '' && (c.gem ?? 0) < statFilters.gem.min) return false; if (statFilters.gem.max !== '' && (c.gem ?? 0) > statFilters.gem.max) return false; if (filterColors.length > 0 && !filterColors.includes(c.colorType)) return false; if (filterRarities.length > 0 && !filterRarities.includes(c.rarity)) return false; if (filterTypes.length > 0 && !filterTypes.includes(c.type)) return false; if (c.type === 'Magic' && filterTypes.includes('Magic') && filterMagicType !== 'All') { if (getMagicSubType(c) !== filterMagicType) { return false; } } return true; }); }, [cardDb, searchTerm, filterTypes, filterMagicType, filterColors, filterRarities, selectedSets, statFilters]);
  const totalPages = Math.ceil(filteredCardDb.length / PAGE_SIZE); const startIndex = (currentPage - 1) * PAGE_SIZE; const endIndex = startIndex + PAGE_SIZE; const paginatedCards = filteredCardDb.slice(startIndex, endIndex);
  const [viewingDeck, setViewingDeck] = useState(null);

  const addToMain = (card) => { if (card.lifeEligible) { showAlert("ไม่สามารถเพิ่มได้", `การ์ด "${card.name}" เป็นการ์ดสำหรับ Life Deck เท่านั้น`); return; } if (card.onlyRank === 1 && mainDeck.some(c => c.onlyRank === 1)) { showAlert("Rule Violation", "You can only have one 'Only #1' card in your Main Deck."); return; } if (mainDeck.filter(c => nameKey(c.name) === nameKey(card.name)).length >= RULES.main.maxCopiesPerName) { showAlert("Rule Violation", `You cannot have more than ${RULES.main.maxCopiesPerName} copies of "${card.name}".`); return; } if (mainDeck.length >= RULES.main.size) { showAlert("Deck Full", "Your Main Deck has reached the 50-card limit."); return; } setMainDeck(prev => [...prev, card]); };
  const removeFromMain = (card) => { const idx = mainDeck.findLastIndex(c => nameKey(c.name) === nameKey(card.name)); if (idx > -1) setMainDeck(prev => prev.filter((_, i) => i !== idx)); };
  const addToLife = (card) => { if (!card.lifeEligible) { showAlert("Invalid Card", `การ์ด "${card.name}" ไม่สามารถใส่ใน Life Deck ได้`); return; }; if (lifeDeck.length >= RULES.life.size) { showAlert("Deck Full", `Life Deck เต็มแล้ว (ใส่ได้ ${RULES.life.size} ใบ)`); return; }; if (!lifeDeck.some(c => nameKey(c.name) === nameKey(card.name))) { setLifeDeck(prev => [...prev, card]); } else { showAlert("Duplicate Card", `การ์ดชื่อ "${card.name}" มีใน Life Deck แล้ว (ชื่อห้ามซ้ำ)`); } };
  const removeFromLife = (card) => { const idx = lifeDeck.findIndex(c => c.id === card.id); if (idx > -1) setLifeDeck(prev => prev.filter((_, i) => i !== idx)); };
  const handleCardDoubleClick = (card, cardElement) => { if (isAnimating || !cardElement || !mainDeckRef.current) return; if (card.lifeEligible) { showAlert("ไม่สามารถเพิ่มได้", `การ์ด "${card.name}" เป็นการ์ดสำหรับ Life Deck เท่านั้น โปรดลากไปวางใน Life Deck`); return; } setIsAnimating(true); const startRect = cardElement.getBoundingClientRect(); const endRect = mainDeckRef.current.getBoundingClientRect(); setFlyingCard({ card, startRect, endRect }); };
  const handleAnimationComplete = () => { if (flyingCard) { addToMain(flyingCard.card); setFlyingCard(null); setIsAnimating(false); } };
  const handleExportCode = () => { if (mainDeck.length === 0 && lifeDeck.length === 0) { showAlert("Empty Deck", "เด็คของคุณว่างเปล่า ไม่มีอะไรให้ Export"); return; } const code = encodeDeckCode(mainDeck, lifeDeck); navigator.clipboard.writeText(code) .then(() => showAlert("Success!", `✅ คัดลอกรหัสเด็คลง Clipboard แล้ว!`)) .catch(err => { console.error('Failed to copy code: ', err); showAlert("Error", "ไม่สามารถคัดลอกรหัสเด็คได้"); }); };
  const handleImport = () => { setIsImportModalOpen(true); };
  const confirmImport = (code) => { closeImportModal(); if (!code) { return; } const decoded = decodeDeckCode(code, cardDb); if (decoded) { setMainDeck(decoded.main); setLifeDeck(decoded.life); showAlert("Import Success", "นำเข้าเด็คสำเร็จ!"); } else { showAlert("Import Error", "รหัสเด็คไม่ถูกต้อง หรือไม่พบการ์ดบางใบในฐานข้อมูลปัจจุบัน"); } };
  const handleExport = handleExportCode; 
  const handleClear = () => { setModal({ isOpen: true, title: "Confirm Clear Deck", message: "คุณต้องการล้างเด็คทั้งหมด (Main และ Life) ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้", onConfirm: () => { setMainDeck([]); setLifeDeck([]); closeModal(); }, confirmText: "Confirm Clear", confirmIcon: <ClearIcon /> }); };

  return (
    // ✨ [แก้ไข] ลบ DndProvider ที่ห่อหุ้มออก (เพราะมันอยู่ใน layout.jsx แล้ว)
    <DndStateProvider>
      <style>{`::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#334155}`}</style>
      <CustomDragLayer />
      {flyingCard && <FlyingCard {...flyingCard} onComplete={handleAnimationComplete} />}
      
      <div className="h-screen flex flex-col text-gray-200 bg-black">

        {/* === ส่วนบังคับ Login === */}
        {!userProfile ? (
          // --- 1. หน้าจอเมื่อยังไม่ Login ---
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6 bg-gradient-to-br from-slate-900 to-black">
            <img 
              src="/cards/LOGOBOT.png" 
              alt="Battle Of Talingchan Logo" 
              className="w-32 h-32 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 to-emerald-400 bg-clip-text text-transparent text-center">
              Deck Builder
            </h1>
            <p className="text-xl text-gray-300">กรุณาเข้าสู่ระบบด้วย Google เพื่อใช้งาน</p>
            <div className="mt-4 scale-110">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                theme="filled_black"
                size="large"
                shape="pill"
                text="signin_with"
                logo_alignment="left"
              />
            </div>
            <div className="mt-12 pt-8 border-t border-emerald-700/30 w-full max-w-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-amber-300 mb-4 text-center">
                สามารถสนับสนุนค่ากาแฟและค่าเซิร์ฟเวอร์ได้ที่นี่นะคะ ❤️❤️❤️
              </h3>
              <img 
                src="/assets/QRCODE.png" 
                alt="Donate QR Code" 
                className="w-48 h-48 mx-auto rounded-lg border-4 border-emerald-500/30"
                onError={(e) => { console.warn("QR Code image not found"); e.currentTarget.style.display = 'none'; }}
              />
              <video
                src="/assets/VDO.mov"
                autoPlay loop muted playsInline
                className="w-full h-auto max-w-[400px] mt-6 rounded-lg border-4 border-emerald-500/30"
                width="540" height="540"
                onError={(e) => { console.warn("VDO file not found"); e.currentTarget.style.display = 'none'; }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          // --- 2. หน้าแอปหลัก (เมื่อ Login แล้ว) ---
          <>
            <header className="px-4 lg:px-6 py-2 border-b border-emerald-700/30 bg-black/60 backdrop-blur-sm shrink-0 z-40">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 to-emerald-400 bg-clip-text text-transparent">
                  Battle Of Talingchan
                </h1>
                <div className="flex items-center gap-3">
                  {userProfile && (
                    <>
                      {/* ✨ [แก้ไข] เปลี่ยน Link ของ react-router เป็น next/link */}
                      <Link href="/public-decks">
                        <Button
                          as="span" // (ใช้ as="span" เพื่อให้ Button ทำงานเหมือน span ภายใน Link)
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg hover:from-blue-400 hover:to-purple-500"
                        >
                          <UsersIcon />
                          <span className="hidden md:inline">Public Decks</span>
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => setIsDeckListModalOpen(true)}
                        className="bg-gradient-to-r from-amber-500 to-emerald-600 text-white border-none shadow-lg hover:from-amber-400 hover:to-emerald-500"
                      >
                        <DeckIcon />
                        <span className="hidden md:inline">My Deck List</span>
                      </Button>
                    </>
                  )}
                  {userProfile ? (
                    <>
                      <img 
                        src={userProfile.picture} 
                        alt={userProfile.name} 
                        className="w-8 h-8 rounded-full border-2 border-emerald-500"
                        title={`Logged in as ${userProfile.name} (${userProfile.email})`} 
                      />
                      <span className="text-white hidden md:block text-sm">
                        {userProfile.name}
                      </span>
                      <Button 
                        onClick={handleLogout} 
                        className="bg-red-900/50 border-red-500/30 text-red-300 hover:bg-red-800/50 hover:text-white px-3 py-1 text-sm"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <GoogleLogin
                      onSuccess={handleLoginSuccess}
                      onError={handleLoginError}
                      theme="filled_black"
                      size="medium"
                      shape="pill"
                      text="signin_with"
                      logo_alignment="left"
                    />
                  )}
                </div>
              </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* (โค้ด main, Sidebar, CardGrid เหมือนเดิมทั้งหมด) */}
              <div className={` ${activeView === 'deck' ? 'block' : 'hidden'} md:block ${isSidebarOpen ? 'md:w-[360px]' : 'md:w-0'} transition-all duration-300 ease-in-out overflow-hidden shrink-0 relative md:h-full w-full h-full overflow-y-auto md:overflow-y-hidden pb-16 md:pb-0 `}>
                  <LeftSidebar isSidebarOpen={isSidebarOpen} searchTerm={searchTerm} setSearchTerm={setSearchTerm} allCardTypes={allCardTypes} filterTypes={filterTypes} setFilterTypes={setFilterTypes} filterMagicType={filterMagicType} setFilterMagicType={setFilterMagicType} allColorTypes={allColorTypes} filterColors={filterColors} setFilterColors={setFilterColors} allRarities={allRarities} filterRarities={filterRarities} setFilterRarities={setFilterRarities} allSets={allSets} selectedSets={selectedSets} onSetSelectionChange={handleSetSelectionChange} statFilters={statFilters} onStatFilterChange={handleStatFilterChange} mainDeck={mainDeck} lifeDeck={lifeDeck} RULES={RULES} addToMain={addToMain} addToLife={addToLife} removeFromMain={removeFromMain} removeFromLife={removeFromLife} handleImport={handleImport} handleExport={handleExport} handleClear={handleClear} handleReloadFromTxt={handleReloadFromTxt} mainDeckRef={mainDeckRef} onViewDeck={setViewingDeck} onAnalyzeDeck={handleAnalyzeDeck} isLoadingAnalysis={isLoadingAnalysis} />
              </div>
              <div className="hidden md:flex items-center justify-center shrink-0 border-l border-emerald-700/30 bg-black/40"> <button onClick={toggleSidebar} className="p-1 text-emerald-400 hover:text-white hover:bg-emerald-700/50 rounded-full transition-colors" title={isSidebarOpen ? "ซ่อน Filter" : "แสดง Filter"}> {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />} </button> </div>
              <div className={`${activeView === 'cards' ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
                  <section className={` flex-1 overflow-y-auto transition-all duration-300 ease-in-out p-4 lg:py-8 md:pr-12 lg:pr-16 ${isSidebarOpen ? 'md:pl-12 lg:pl-16' : 'md:pl-16 lg:pl-24 xl:pl-32'} `}> 
                      <div className="relative bg-slate-900 text-center py-8 px-4 border-b border-emerald-700/30 overflow-hidden rounded-lg mb-10"> <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-slate-900 opacity-50"></div> <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://www.tcgthailand.com/assets/img/banner.1b838965.webp')"}}></div> <div className="relative z-10 flex flex-col items-center justify-center"> <img src="/cards/LOGOBOT.png" alt="Battle Of Talingchan Logo" className="w-24 h-24 md:w-28 md:h-28 mb-2 object-contain drop-shadow-lg" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">Battle Of Talingchan</h1> </div> </div>
                      {cardDb.length === 0 ? (<CardShell><div className="text-center py-20"><h3 className="text-2xl font-bold text-white mb-2">กำลังโหลดฐานข้อมูลการ์ด...</h3><p className="text-gray-300">หากไม่สำเร็จ ลองกด "Reload from TXT" ที่แถบซ้าย</p></div></CardShell>) : (
                        <>
                          <CardGrid cards={paginatedCards} onDoubleClick={handleCardDoubleClick} onViewDetails={setZoomedCard} onAddCard={addToMain} />
                          {totalPages > 1 && (
                            <div className="relative z-[70] flex items-center justify-center gap-4 mt-12 py-4">
                              <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}> ย้อนกลับ </Button>
                              <span className="text-white font-semibold tabular-nums"> หน้า {currentPage} / {totalPages} </span>
                              <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}> ถัดไป </Button>
                            </div>
                          )}
                          <footer className="relative z-[70] mt-16 py-10 text-center border-t border-emerald-700/30">
                            <h3 className="text-lg font-semibold text-amber-300 mb-4">
                              สามารถสนับสนุนค่ากาแฟและค่าเซิร์ฟเวอร์ได้ที่นี่นะคะ ❤️❤️❤️
                            </h3>
                            <img 
                              src="/assets/QRCODE.png" 
                              alt="Donate QR Code" 
                              className="w-48 h-48 mx-auto rounded-lg border-4 border-emerald-500/30"
                              onError={(e) => { console.warn("QR Code image not found"); e.currentTarget.style.display = 'none'; }}
                            />
                          </footer>
                        </>
                      )}
                  </section>
              </div>
            </main>
            
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-lg border-t border-emerald-700/30 z-50 flex items-stretch"> <button className={`flex-1 flex flex-col items-center justify-center p-2 text-xs transition-colors ${activeView === 'cards' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveView('cards')}> <CardsIcon /> <span>การ์ด</span> </button> <button className={`flex-1 flex flex-col items-center justify-center p-2 text-xs transition-colors ${activeView === 'deck' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveView('deck')}> <DeckIcon /> <span>เด็ค</span> </button> </nav>
            
            {/* (Modals ทั้งหมด) */}
            <Modal isOpen={modal.isOpen} title={modal.title} onClose={closeModal} onConfirm={modal.onConfirm} confirmText={modal.onConfirm ? modal.confirmText || "Confirm" : undefined} confirmIcon={modal.onConfirm ? modal.confirmIcon || <ClearIcon /> : undefined} > {modal.message} </Modal>
            <ImportDeckModal isOpen={isImportModalOpen} onClose={closeImportModal} onImport={confirmImport} />
            <DeckAnalysisModal 
              isOpen={analysisDeck !== null} 
              onClose={() => setAnalysisDeck(null)} 
              mainDeck={analysisDeck ? analysisDeck.main : []} 
              lifeDeck={analysisDeck ? analysisDeck.life : []} 
              showAlert={showAlert} 
            />
            <DeckViewModal isOpen={viewingDeck !== null} onClose={() => setViewingDeck(null)} deck={viewingDeck === 'main' ? mainDeck : lifeDeck} rules={viewingDeck === 'main' ? RULES.main : RULES.life} onAddCard={viewingDeck === 'main' ? addToMain : addToLife} onRemoveCard={viewingDeck === 'main' ? removeFromMain : removeFromLife} title={viewingDeck === 'main' ? "Main Deck" : "Life Deck"} />
            <CardDetailModal card={zoomedCard} onClose={() => setZoomedCard(null)} />
            <DeckListModal
              isOpen={isDeckListModalOpen}
              onClose={() => setIsDeckListModalOpen(false)}
              userProfile={userProfile}
              userDecks={userDecks}
              setUserDecks={setUserDecks}
              mainDeck={mainDeck}
              lifeDeck={lifeDeck}
              setMainDeck={setMainDeck}
              setLifeDeck={setLifeDeck}
              showAlert={showAlert}
              setModal={setModal}
              closeModal={closeModal}
              encodeDeckCode={encodeDeckCode}
              decodeDeckCode={decodeDeckCode}
              allCards={cardDb}
              onShowCards={(deck) => setAnalysisDeck(deck)}
              key={userProfile?.email || 'guest'}
            />
          </>
        )}
      </div>
    </DndStateProvider>
  );
}