import React, { useState } from 'react';
import { createPortal } from "react-dom";
import { db } from '../firebase'; // ถอยกลับไป 1 ชั้นเพื่อหา firebase
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { 
    TrashIcon, ImportIcon, ExportIcon, UploadIcon, CloseIcon, EyeIcon 
} from './Icons';

// --- Utils (Helper Functions) ---
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

// --- UI Components ---
const Button = ({ className = "", children, ...props }) => (
    <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-300/20 dark:border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 hover:border-amber-400/60 transition-all disabled:opacity-40 ${className}`} {...props}>{children}</button>
);

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", confirmIcon }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[900] p-4">
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
                <div className="text-slate-700 dark:text-gray-300 mb-6">{children}</div>
                <div className="flex justify-end gap-3">
                    <Button onClick={onClose} className="bg-slate-200 dark:bg-slate-700/50">{onConfirm ? "Cancel" : "Close"}</Button>
                    {onConfirm && <Button onClick={onConfirm} className="bg-emerald-600 text-white hover:bg-emerald-500 border-none">{confirmIcon} {confirmText}</Button>}
                </div>
            </div>
        </div>, document.body
    );
};

export default function DeckListModal({ 
    isOpen, onClose, userProfile, userDecks, setUserDecks, 
    mainDeck, lifeDeck, setMainDeck, setLifeDeck, 
    cardDb = [], onShowCards // cardDb คือ allCards
}) {
    const [importingSlot, setImportingSlot] = useState(null);
    const [importCode, setImportCode] = useState('');
    const [modal, setModal] = useState({ isOpen: false });

    if (!isOpen || !userProfile) return null;
    const email = userProfile.email;

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
        const s = [...slots];
        s[index] = { ...s[index], main: mainDeck, life: lifeDeck };
        updateSlots(s);
        showAlert("Saved!", `บันทึกเด็คลง Slot ${index + 1} เรียบร้อย`);
    };

    const handleLoad = (index) => {
        const s = slots[index];
        if (!s.main.length && !s.life.length) return showAlert("Empty", "Slot นี้ว่างเปล่า");
        setMainDeck(s.main);
        setLifeDeck(s.life);
        showAlert("Loaded!", `โหลดเด็ค "${s.name}" เรียบร้อย`);
        onClose();
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
                    message: <div className="flex flex-col gap-2">{existing.map(d => <button key={d.id} onClick={() => doShare(d.id)} className="p-2 border rounded hover:bg-red-100 text-left">ทับเด็ค: {d.deckName}</button>)}</div>
                });
            } else {
                setModal({ isOpen: true, title: "Share Deck", message: `ยืนยันการแชร์ "${slot.name}"?`, onConfirm: () => doShare(), confirmText: "Share", confirmIcon: <UploadIcon /> });
            }
        } catch (e) { console.error(e); }
    };

    return createPortal(
        <>
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[800] p-4">
            <div className="bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-emerald-500/20 shrink-0">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Decks</h2>
                    <Button onClick={onClose} className="px-3 py-1 text-sm">Close</Button>
                </header>
                <div className="flex-grow overflow-y-auto p-4">
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                        {slots.map((slot, index) => {
                            const deckSize = slot.main.length + slot.life.length;
                            const only1 = slot.main.find(c => c.onlyRank === 1);
                            const cover = only1 ? `/cards/${encodePath(only1.imagePath)}/${encodeURIComponent(only1.id.replace(' - Only#1', ''))}.png` : null;
                            return (
                                <div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm hover:shadow-md">
                                    <div className="flex gap-3 h-full">
                                        <div className="shrink-0 w-20 h-28 bg-slate-200 dark:bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                                            {cover ? <img src={cover} className="w-full h-full object-cover" /> : <span className="text-2xl">🃏</span>}
                                            <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">{deckSize} Cards</div>
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between min-w-0">
                                            <input type="text" value={slot.name} onChange={e => handleNameChange(index, e.target.value)} className="w-full bg-transparent border-b border-slate-300 dark:border-slate-600 font-bold text-lg outline-none py-1" />
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    <Button onClick={() => handleLoad(index)} className="flex-1 py-1 text-xs bg-emerald-100 text-emerald-700 border-emerald-200">Load</Button>
                                                    <Button onClick={() => handleSave(index)} className="flex-1 py-1 text-xs bg-amber-100 text-amber-700 border-amber-200">Save</Button>
                                                </div>
                                                <div className="flex items-center justify-between gap-1">
                                                    {onShowCards && <button onClick={() => onShowCards({main: slot.main, life: slot.life})} disabled={!deckSize} className="p-2 rounded text-blue-600 hover:bg-blue-50"><EyeIcon /></button>}
                                                    <button onClick={() => { setImportingSlot(index); setImportCode(''); }} className="p-2 rounded text-slate-600 hover:bg-slate-100"><ImportIcon /></button>
                                                    <button onClick={() => handleExport(index)} disabled={!deckSize} className="p-2 rounded text-slate-600 hover:bg-slate-100"><ExportIcon /></button>
                                                    <button onClick={() => handleShareDeck(index)} disabled={!deckSize} className="p-2 rounded text-purple-600 hover:bg-purple-50"><UploadIcon /></button>
                                                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                                    <button onClick={() => { 
                                                        setModal({ isOpen: true, title: "Clear Slot", message: "ล้างข้อมูล?", onConfirm: () => { const s = [...slots]; s[index] = { ...s[index], main:[], life:[] }; updateSlots(s); closeModal(); }, confirmIcon: <TrashIcon /> }); 
                                                    }} className="p-2 rounded text-red-600 hover:bg-red-50"><TrashIcon /></button>
                                                </div>
                                            </div>
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
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[900] p-4">
                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 rounded-xl shadow-2xl p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Import Deck</h2>
                    <textarea value={importCode} onChange={e => setImportCode(e.target.value)} rows="4" className="w-full p-2 rounded border dark:bg-slate-700 dark:text-white mb-4" placeholder="วางรหัสเด็ค..." />
                    <div className="flex justify-end gap-3">
                        <Button onClick={() => setImportingSlot(null)} className="bg-slate-200">Cancel</Button>
                        <Button onClick={confirmImport} className="bg-emerald-600 text-white border-none">Import</Button>
                    </div>
                </div>
            </div>
        )}
        <Modal {...modal} onClose={closeModal} />
        </>, document.body
    );
}