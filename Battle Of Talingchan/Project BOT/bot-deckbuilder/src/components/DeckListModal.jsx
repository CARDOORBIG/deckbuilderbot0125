import React, { useState } from 'react';
import { createPortal } from "react-dom";
import { db } from '../firebase'; 
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { 
    TrashIcon, ImportIcon, ExportIcon, UploadIcon, CloseIcon, EyeIcon 
} from './Icons';

// --- Utils ---
const encodeDeckCode = (mainDeck, lifeDeck) => { try { return btoa(JSON.stringify({ m: mainDeck.map(c=>c.id), l: lifeDeck.map(c=>c.id) })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); } catch { return ""; } };
const decodeDeckCode = (code, allCards) => { 
    const trimmedCode = (code || "").trim(); 
    if (!trimmedCode) return null; 
    try { 
        let base64 = trimmedCode.replace(/-/g, '+').replace(/_/g, '/'); 
        while (base64.length % 4 !== 0) { base64 += '='; } 
        const dataString = atob(base64); 
        const data = JSON.parse(dataString); 
        if (!data || !Array.isArray(data.m) || !Array.isArray(data.l)) throw new Error("Invalid format"); 
        const findCard = (id) => allCards.find(c => c.id === id); 
        return { main: data.m.map(findCard).filter(Boolean), life: data.l.map(findCard).filter(Boolean) }; 
    } catch (e) { return null; } 
};
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';

// --- Components ---
const Button = ({ className = "", children, ...props }) => (
    <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-300/20 dark:border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 hover:border-amber-400/60 transition-all disabled:opacity-40 ${className}`} {...props}>{children}</button>
);

// Modal Component
const Modal = ({ isOpen, title, message, children, onClose, onConfirm, confirmText = "Confirm", confirmIcon }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1200] p-4">
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in relative">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
                <div className="text-slate-700 dark:text-gray-300 mb-6">
                    {children || message}
                </div>
                <div className="flex justify-end gap-3">
                    <Button onClick={onClose} className="bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">{onConfirm ? "ยกเลิก" : "ปิด"}</Button>
                    {onConfirm && <Button onClick={onConfirm} className="bg-emerald-600 text-white hover:bg-emerald-500 border-none">{confirmIcon} {confirmText}</Button>}
                </div>
            </div>
        </div>, document.body
    );
};

export default function DeckListModal({ 
    isOpen, onClose, userProfile, userDecks, setUserDecks, 
    mainDeck, lifeDeck, setMainDeck, setLifeDeck, 
    cardDb = [], onShowCards, onSelectDeck 
}) {
    const [importingSlot, setImportingSlot] = useState(null);
    const [importCode, setImportCode] = useState('');
    const [modal, setModal] = useState({ isOpen: false });

    if (!isOpen || !userProfile) return null;
    const email = userProfile?.email;

    const getUserSlots = () => {
        const defaultSlots = [{ name: "Slot 1", main: [], life: [] }, { name: "Slot 2", main: [], life: [] }];
        const userData = userDecks[email] || { slots: defaultSlots };
        if (!userDecks[email]) setUserDecks(prev => ({ ...prev, [email]: userData }));
        return userData.slots;
    };
    const slots = getUserSlots();

    const updateSlots = (newSlots) => setUserDecks(prev => ({ ...prev, [email]: { ...prev[email], slots: newSlots } }));
    const handleNameChange = (index, val) => { const s = [...slots]; s[index].name = val; updateSlots(s); };
    
    const showAlert = (title, msg) => setModal({ isOpen: true, title, message: msg });
    const closeModal = () => setModal({ isOpen: false });

    const handleSave = (index) => {
        setModal({
            isOpen: true,
            title: "ยืนยันการบันทึก (Save Deck)",
            message: (
                <div>
                    <p>คุณต้องการบันทึกเด็คปัจจุบันลงใน <b>"{slots[index].name}"</b> ใช่หรือไม่?</p>
                    <p className="text-xs text-red-500 mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                        ⚠️ ข้อมูลเดิมใน Slot นี้จะถูกเขียนทับและกู้คืนไม่ได้
                    </p>
                </div>
            ),
            onConfirm: () => {
                const s = [...slots];
                s[index] = { ...s[index], main: mainDeck, life: lifeDeck };
                updateSlots(s);
                closeModal();
                setTimeout(() => showAlert("Saved!", `บันทึกเด็คลง "${s[index].name}" เรียบร้อย`), 100);
            },
            confirmText: "บันทึกทับ",
            confirmIcon: <UploadIcon />
        });
    };

    const handleLoad = (index) => {
        const s = slots[index];
        if (!s.main.length && !s.life.length) return showAlert("Empty", "Slot นี้ว่างเปล่า");
        
        if (mainDeck.length > 0 || lifeDeck.length > 0) {
             setModal({
                isOpen: true,
                title: "ยืนยันการโหลด (Load Deck)",
                message: `ต้องการโหลดเด็ค "${s.name}" มาแทนที่เด็คปัจจุบันหรือไม่? (การ์ดปัจจุบันจะหายไป)`,
                onConfirm: () => {
                    setMainDeck(s.main);
                    setLifeDeck(s.life);
                    closeModal();
                    onClose();
                },
                confirmText: "โหลดเด็ค",
                confirmIcon: <ImportIcon />
            });
        } else {
            setMainDeck(s.main);
            setLifeDeck(s.life);
            showAlert("Loaded!", `โหลดเด็ค "${s.name}" เรียบร้อย`);
            onClose();
        }
    };

    const handleExport = (index) => {
        const s = slots[index];
        if (!s.main.length && !s.life.length) return showAlert("Empty", "ไม่สามารถ Export เด็คว่างได้");
        const code = encodeDeckCode(s.main, s.life);
        navigator.clipboard.writeText(code).then(() => showAlert("Copied!", "คัดลอกรหัสเด็คแล้ว"));
    };

    const confirmImport = () => {
        const decoded = decodeDeckCode(importCode, cardDb);
        if (decoded) {
            const s = [...slots];
            s[importingSlot] = { ...s[importingSlot], main: decoded.main, life: decoded.life };
            updateSlots(s);
            showAlert("Success", "นำเข้าเด็คสำเร็จ!");
            setImportingSlot(null);
        } else {
            showAlert("Error", "รหัสเด็คไม่ถูกต้อง หรือหาการ์ดไม่เจอ");
        }
    };

    const handleClearSlot = (index) => { 
        setModal({ 
            isOpen: true, 
            title: "Clear Slot", 
            message: `คุณต้องการล้างข้อมูลใน "${slots[index].name}" ใช่หรือไม่?`, 
            onConfirm: () => { 
                const s = [...slots]; 
                s[index] = { ...s[index], main:[], life:[] };
                updateSlots(s);
                closeModal();
                setTimeout(() => showAlert("Slot Cleared", "ล้างข้อมูลเรียบร้อยแล้ว"), 100);
            }, 
            confirmText: "ล้างข้อมูล", 
            confirmIcon: <TrashIcon /> 
        }); 
    };

    const handleShareDeck = async (index) => {
        const slot = slots[index];
        const only1 = slot.main.find(c => c.onlyRank === 1);
        if (!only1) return showAlert("Error", "เด็คต้องมี Only #1 Card ถึงจะแชร์ได้");

        try {
            const q = query(collection(db, "publicDecks"), where("user.email", "==", email));
            const snap = await getDocs(q);
            const existing = snap.docs.map(d => ({ id: d.id, ...d.data() }));

            const doShare = async (targetId = null) => {
                closeModal();
                try {
                    const batch = writeBatch(db);
                    const ref = targetId ? doc(db, "publicDecks", targetId) : doc(collection(db, "publicDecks"));
                    const allCards = [...slot.main, ...slot.life];
                    const factions = [...new Set(allCards.map(c => c.faction).filter(Boolean))];
                    
                    batch.set(ref, {
                        deckName: slot.name,
                        only1CardData: { id: only1.id, name: only1.name, imagePath: only1.imagePath },
                        user: { name: userProfile.name, picture: userProfile.picture, email },
                        sharedAt: serverTimestamp(),
                        likeCount: 0, likedBy: [], factions, viewCount: 0
                    });
                    batch.set(doc(db, "publicDeckDetails", ref.id), { mainDeck: slot.main.map(c=>c.id), lifeDeck: slot.life.map(c=>c.id) });
                    await batch.commit();
                    showAlert("Shared!", "แชร์เด็คเรียบร้อย");
                } catch (e) { console.error(e); showAlert("Error", "แชร์ไม่สำเร็จ"); }
            };

            if (existing.length >= 2) {
                setModal({
                    isOpen: true, title: "โควตาเต็ม (Max 2)", 
                    message: <div className="flex flex-col gap-2"><p>คุณแชร์ครบ 2 เด็คแล้ว เลือกเด็คที่ต้องการเขียนทับ:</p>{existing.map(d => <button key={d.id} onClick={() => doShare(d.id)} className="p-2 border rounded hover:bg-red-100 text-left text-sm text-black dark:text-white">ทับเด็ค: {d.deckName}</button>)}</div>
                });
            } else {
                setModal({ isOpen: true, title: "Share Deck", message: `ยืนยันการแชร์ "${slot.name}" สู่สาธารณะ?`, onConfirm: () => doShare(), confirmText: "Share", confirmIcon: <UploadIcon /> });
            }
        } catch (e) { console.error(e); }
    };

    return createPortal(
        <>
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[900] p-4">
            <div className="bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-fade-in">
                <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-emerald-500/20 shrink-0">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{onSelectDeck ? "Select a Deck to Play" : "My Decks (เลือก Slot เพื่อบันทึก/โหลด)"}</h2>
                    <Button onClick={onClose} className="px-3 py-1 text-sm">Close</Button>
                </header>
                <div className="flex-grow overflow-y-auto p-4">
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                        {slots.map((slot, index) => {
                            const deckSize = slot.main.length + slot.life.length;
                            const only1 = slot.main.find(c => c.onlyRank === 1);
                            // คำนวณ path รูปปก
                            const cover = only1 ? `/cards/${encodePath(only1.imagePath)}/${encodeURIComponent(only1.id.replace(' - Only#1', ''))}.png` : null;
                            
                            return (
                                <div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex gap-3 h-full">
                                        <div className="shrink-0 w-20 h-28 bg-slate-200 dark:bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                                            {cover ? <img src={cover} className="w-full h-full object-cover" onError={(e)=>{e.target.style.display='none'}}/> : <span className="text-2xl">🃏</span>}
                                            <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">{deckSize} Cards</div>
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between min-w-0">
                                            <input type="text" value={slot.name} onChange={e => handleNameChange(index, e.target.value)} className="w-full bg-transparent border-b border-slate-300 dark:border-slate-600 font-bold text-lg outline-none py-1 text-slate-900 dark:text-white" placeholder="ตั้งชื่อเด็ค..." />
                                            
                                            {onSelectDeck ? (
                                                <div className="flex flex-col gap-2 mt-2">
                                                    {/* ✅ แก้ไข: ส่ง coverImage กลับไปด้วย */}
                                                    <Button 
                                                        onClick={() => onSelectDeck({ ...slot, id: index, coverImage: cover })} 
                                                        disabled={deckSize === 0}
                                                        className="w-full py-2 bg-emerald-600 text-white hover:bg-emerald-500 border-none shadow-md"
                                                    >
                                                        Select
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleLoad(index)} 
                                                        className="w-full py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 border-none"
                                                    >
                                                        Edit
                                                    </Button>
                                                </div>
                                            ) : (
                                                // (ส่วนแสดงผลปุ่มโหมดปกติ ... เหมือนเดิม)
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex gap-2">
                                                        <Button onClick={() => handleLoad(index)} className="flex-1 py-1 text-xs bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">Load</Button>
                                                        <Button onClick={() => handleSave(index)} className="flex-1 py-1 text-xs bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 font-bold">Save</Button>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-1">
                                                        {onShowCards && <button onClick={() => onShowCards({main: slot.main, life: slot.life})} disabled={!deckSize} className="p-2 rounded text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700" title="ดูการ์ดในเด็ค"><EyeIcon /></button>}
                                                        <button onClick={() => { setImportingSlot(index); setImportCode(''); }} className="p-2 rounded text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700" title="Import"><ImportIcon /></button>
                                                        <button onClick={() => handleExport(index)} disabled={!deckSize} className="p-2 rounded text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 disabled:opacity-30" title="Export Code"><ExportIcon /></button>
                                                        <button onClick={() => handleShareDeck(index)} disabled={!deckSize} className="p-2 rounded text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-slate-700 disabled:opacity-30" title="Share Public"><UploadIcon /></button>
                                                        <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                                        <button onClick={() => handleClearSlot(index)} className="p-2 rounded text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700" title="Clear"><TrashIcon /></button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
        {importingSlot !== null && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[910] p-4">
                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Import Deck</h2>
                    <textarea value={importCode} onChange={e => setImportCode(e.target.value)} rows="4" className="w-full p-2 rounded border dark:bg-slate-700 dark:text-white mb-4 outline-none focus:border-emerald-500" placeholder="วางรหัสเด็คที่นี่..." />
                    <div className="flex justify-end gap-3">
                        <Button onClick={() => setImportingSlot(null)} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Cancel</Button>
                        <Button onClick={confirmImport} className="bg-emerald-600 text-white border-none hover:bg-emerald-500">Import</Button>
                    </div>
                </div>
            </div>
        )}
        <Modal {...modal} onClose={closeModal} />
        </>, document.body
    );
}