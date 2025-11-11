import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from "react-dom";
import { db } from './firebase';
import { collection, getDocs, query, orderBy, Timestamp, doc, deleteDoc, limit, startAfter } from 'firebase/firestore';

// === [UI Components และ Hooks] ===
// (เราคัดลอก UI ที่จำเป็นจาก App.jsx มาไว้ที่นี่ก่อน)
const Button = ({ className = "", children, ...props }) => ( <button className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-400/20 bg-amber-900/30 text-amber-300 hover:bg-amber-700/50 hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-900/30 ${className}`} {...props} > {children} </button> );
const CardShell = ({ children, className = "", ...props }) => ( <div className={`bg-slate-900/70 backdrop-blur-sm p-4 rounded-xl border border-emerald-500/20 shadow-lg transition-all hover:border-amber-400/50 hover:shadow-amber-500/10 ${className}`} {...props}> {children} </div> );
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const EyeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /> <circle cx="12" cy="12" r="3" /> </svg> );
const CopyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect> <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path> </svg> );
const ClearIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg> );
const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", confirmIcon = <ClearIcon/>, maxWidth = 'max-w-md' }) => { if (!isOpen) return null; return createPortal( <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4"> <div className={`bg-slate-800 border border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full m-4 ${maxWidth}`}> <h2 className="text-xl font-bold text-white mb-4">{title}</h2> <div className="text-gray-300 mb-6">{children}</div> <div className="flex justify-end gap-3"> <Button onClick={onClose} className="bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600">{onConfirm ? "Cancel" : "Close"}</Button> {onConfirm && ( <Button onClick={onConfirm} className="bg-red-900/50 border-red-500/30 text-red-300 hover:bg-red-800/50 hover:text-white"> {confirmIcon} {confirmText} </Button> )} </div> </div> </div>, document.body ); };
function useLocalStorage(key, initial) { const [v, s] = useState(() => { try { const raw = localStorage.getItem(key); if (!raw || raw === "[]" || raw === "null") return initial; return JSON.parse(raw); } catch { return initial; } }); useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]); return [v, s]; }
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
// === [สิ้นสุด] UI Components ===

const DECKS_PER_PAGE = 12; // โหลดทีละ 12 เด็ค

// Component DeckCard (เพิ่ม loading="lazy" ที่รูป)
function DeckCard({ deck, onViewDeck, onCopyCode, userProfile, onDeleteDeck }) {
  const mainCardImg = useMemo(() => {
    if (!deck.only1CardData) return 'https://placehold.co/300x420/1e293b/94a3b8?text=Deck';
    const card = deck.only1CardData;
    const encodedImagePath = encodePath(card.imagePath);
    const fileId = card.id.replace(' - Only#1', '');
    return `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
  }, [deck.only1CardData]);
  const sharedDate = deck.sharedAt instanceof Timestamp ? deck.sharedAt.toDate() : new Date();
  const isOwner = userProfile && userProfile.email === deck.user.email;
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
      <div className="flex flex-col gap-2 mt-auto">
        <Button onClick={() => onViewDeck(deck)} className="w-full bg-blue-600/30 border-blue-500/30 text-blue-300 hover:bg-blue-500/50 hover:text-white">
          <EyeIcon /> ดูรายละเอียดเด็ค
        </Button>
        <Button onClick={() => onCopyCode(deck.deckCode, deck.deckName)} className="w-full" disabled={true} >
          <CopyIcon /> คัดลอกรหัสเด็ค (เร็วๆ นี้)
        </Button>
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
  };

  // [แก้ไข] ฟังก์ชันดึงข้อมูลใหม่
  const fetchDecks = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      // 1. สร้าง query
      let q = query(
        collection(db, "publicDecks"),
        orderBy("sharedAt", "desc"), // <--- Firebase จะใช้ Index ที่เราสร้าง
        limit(DECKS_PER_PAGE)
      );
      if (!isInitialLoad && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      // 2. [สำคัญ] ลองดึงจาก Cache ก่อน (เฉพาะการโหลดครั้งแรก)
      if (isInitialLoad) {
        try {
          // สั่งให้ดึงจาก 'cache'
          const cacheSnapshot = await getDocs(q, { source: 'cache' });
          if (!cacheSnapshot.empty) {
            console.log("Data loaded from cache (instant!)");
            processSnapshot(cacheSnapshot, true);
            setIsLoading(false); // ปิด Loading ทันที
            return; // จบการทำงาน! (เพราะข้อมูลอยู่บนหน้าจอแล้ว)
          }
        } catch (e) {
          // ไม่เป็นไร ถ้า Cache ไม่มี (เช่น เปิดครั้งแรก) ก็ไปขั้นตอนต่อไป
          console.log("Cache miss, fetching from server...");
        }
      }

      // 3. ดึงจาก Server (เมื่อเข้าครั้งแรก หรือ กด "โหลดเพิ่ม")
      const serverSnapshot = await getDocs(q, { source: 'server' });
      processSnapshot(serverSnapshot, isInitialLoad);

    } catch (error) {
      console.error("Error fetching decks: ", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setSharedDecks([]);
    setLastVisible(null);
    setHasMore(true);
    fetchDecks(true); // โหลดครั้งแรก
  }, []); // ให้ทำงานครั้งเดียวเมื่อเปิดหน้า


  const handleDeleteDeck = (deck) => {
    setModal({
      isOpen: true,
      title: "Confirm Delete Deck",
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบเด็ค "${deck.deckName}" ออกจาก Public?`,
      onConfirm: async () => {
        closeModal();
        try {
          const docRef = doc(db, "publicDecks", deck.id);
          await deleteDoc(docRef);
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

  const handleCopyCode = (code, deckName) => {
    showAlert("Coming Soon!", "ฟังก์ชันคัดลอกรหัสเด็คกำลังจะมาค่ะ");
  };

  const handleViewDeck = (deck) => {
    showAlert("Coming Soon!", `ฟังก์ชันดูรายละเอียดเด็ค "${deck.deckName}" กำลังจะมา!`);
  };

  // (ส่วน return JSX เหมือนเดิมทั้งหมด)
  return (
    <div className="h-screen flex flex-col text-gray-200 bg-black">
      <style>{`::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#334155}`}</style>
      
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
        
        {isLoading ? (
          <div className="text-center text-lg text-gray-400">กำลังโหลดเด็คสาธารณะ...</div>
        ) : sharedDecks.length === 0 ? (
          <div className="bg-slate-900/70 p-8 rounded-xl border border-emerald-500/20 text-center">
            <h3 className="text-2xl font-bold text-amber-300 mb-2">ยังไม่มีเด็คที่ถูกแชร์</h3>
            <p className="text-lg text-gray-300">
              กลับไปที่หน้า "My Deck List" ของคุณ แล้วกดปุ่ม "Share" เพื่อเป็นคนแรก!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sharedDecks.map(deck => (
                <DeckCard 
                  key={deck.id} 
                  deck={deck}
                  onViewDeck={handleViewDeck}
                  onCopyCode={handleCopyCode}
                  userProfile={userProfile}
                  onDeleteDeck={handleDeleteDeck}
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              {hasMore ? (
                <Button
                  onClick={() => fetchDecks(false)}
                  disabled={isLoadingMore}
                  className="bg-emerald-600/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50 hover:text-white"
                >
                  {isLoadingMore ? "กำลังโหลด..." : "โหลดเพิ่มเติม"}
                </Button>
              ) : (
                <p className="text-gray-500">ไม่มีเด็คเพิ่มเติมแล้ว</p>
              )}
            </div>
          </>
        )}
      </main>

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
    </div>
  );
}