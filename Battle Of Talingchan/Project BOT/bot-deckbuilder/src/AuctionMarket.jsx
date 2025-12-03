import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { createPortal } from "react-dom";
import { googleLogout } from '@react-oauth/google';
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import FleaMarket from './FleaMarket';
import ManagementDashboard from './components/ManagementDashboard';

// --- Components & Modals ---
import AdminDashboardModal from './AdminDashboardModal';
import ReportModal from './ReportModal';
import ChatWidget from './ChatWidget';
import FeedbackModal from './components/FeedbackModal';
import CreateBulkAuctionModal from './CreateBulkAuctionModal'; 
import TopUpModal from './components/TopUpModal'; 
import ShipmentModal from './components/ShipmentModal';
import ConfirmForceEndModal from './components/ConfirmForceEndModal'
import SingleAuctionCard from './components/SingleAuctionCard';

// ✅ New Imported Components (แยกออกมาแล้ว)
import TrackingModal from './components/TrackingModal';
import AuctionRoomModal from './components/AuctionRoomModal';
import ConfirmTransactionModal from './components/ConfirmTransactionModal';
import ActionConfirmModal from './components/ActionConfirmModal';

// --- Shared Utils & Components ---
import Header from './components/Header';
import SettingsDrawer from './components/SettingsDrawer';
import ProfileSetupModal from './components/ProfileSetupModal';
import DeckListModal from './components/DeckListModal';
import { 
    GavelIcon, ShoppingBagIcon, PackageIcon, HistoryIcon, 
} from './components/Icons';

// Placeholder Modals (ถ้ายังไม่ได้แยกไฟล์ ให้คงไว้แบบนี้ หรือแยกไปไฟล์ PlaceholderModals.jsx ก็ได้)
const ManageBiddersModal = ({ isOpen, onClose }) => (!isOpen ? null : <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white"><div className="bg-slate-900 p-4 rounded">Manage Bidders (Placeholder)<button onClick={onClose} className="ml-4 bg-red-500 px-2 rounded">Close</button></div></div>);
const BidHistoryModal = ({ isOpen, onClose }) => (!isOpen ? null : <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white"><div className="bg-slate-900 p-4 rounded">Bid History (Placeholder)<button onClick={onClose} className="ml-4 bg-red-500 px-2 rounded">Close</button></div></div>);
const CompletedAuctionsModal = ({ isOpen, onClose }) => (!isOpen ? null : <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white"><div className="bg-slate-900 p-4 rounded">Completed Auctions (Placeholder)<button onClick={onClose} className="ml-4 bg-red-500 px-2 rounded">Close</button></div></div>);

// Helper Hook
function useLocalStorage(key, initial) { const [v, s] = useState(() => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; } }); useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]); return [v, s]; }

export default function AuctionMarket() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useLocalStorage('bot-market-active-tab', 'auction');
  
  const [auctions, setAuctions] = useState([]);
  const [myAuctions, setMyAuctions] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [historyAuction, setHistoryAuction] = useState(null); 
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null); 
  const [manageAuction, setManageAuction] = useState(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("ending_soon");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDeckListModalOpen, setIsDeckListModalOpen] = useState(false);
  const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false); 
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false); 
  const [actionModalData, setActionModalData] = useState(null); 
  const [isTopUpOpen, setIsTopUpOpen] = useState(false); 
  const [shipmentData, setShipmentData] = useState(null); 
  // eslint-disable-next-line no-unused-vars
  const [isCreateAuctionModalOpen, setIsCreateAuctionModalOpen] = useState(false); 
  // eslint-disable-next-line no-unused-vars
  const [auctionTargetCard, setAuctionTargetCard] = useState(null);
  const [forceEndItem, setForceEndItem] = useState(null);

  const [userDecks, setUserDecks] = useLocalStorage("bot-userDecks-v1", {});
  const [mainDeck, setMainDeck] = useLocalStorage("bot-mainDeck-v32-final", []);
  const [lifeDeck, setLifeDeck] = useLocalStorage("bot-lifeDeck-v32-final", []);
  const [cardDb] = useLocalStorage("bot-cardDb-v32-final", []);
  const [userReputation, setUserReputation] = useState({});
  const [confirmTransaction, setConfirmTransaction] = useState(null);
  const [chatAuction, setChatAuction] = useState(null);
  const [customProfile, setCustomProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(() => { try { return JSON.parse(localStorage.getItem("bot-userProfile-v1")); } catch { return null; } });
  const [theme, setThemeState] = useState(() => { try { return JSON.parse(localStorage.getItem("bot-theme")) || 'dark'; } catch { return 'dark'; } });

  // Effects
  useEffect(() => { const ua = navigator.userAgent || navigator.vendor || window.opera; const isInApp = /(Line|FBAN|FBAV|Instagram|Messenger)/i.test(ua); if (isInApp) { navigate(`/open-browser?redirect=${encodeURIComponent(location.pathname + location.search)}`, { replace: true }); } }, [location, navigate]);
  useEffect(() => { const root = document.documentElement; if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark'); }, [theme]);
  const setTheme = (newTheme) => { setThemeState(newTheme); localStorage.setItem("bot-theme", JSON.stringify(newTheme)); };
  const displayUser = useMemo(() => { if (!userProfile) return null; if (!customProfile) return userProfile; return { ...userProfile, name: customProfile.displayName || userProfile.name, picture: customProfile.avatarUrl || userProfile.picture }; }, [userProfile, customProfile]);
  useEffect(() => { if (userProfile?.email) { const fetchProfile = async () => { try { const docSnap = await getDoc(doc(db, "users", userProfile.email)); if (docSnap.exists()) setCustomProfile(docSnap.data()); } catch (e) { console.error("Profile fetch error", e); } }; fetchProfile(); } }, [userProfile]);
  const fetchReputations = async () => { const { data } = await supabase.from('user_stats').select('user_email, total_score, penalty_level, wallet_balance'); const map = {}; data?.forEach(u => map[u.user_email] = u); setUserReputation(map); };
  useEffect(() => { const channel = supabase.channel('market_balance_update').on('postgres_changes', { event: '*', schema: 'public', table: 'user_stats' }, () => { fetchReputations(); }).subscribe(); return () => { supabase.removeChannel(channel); }; }, []);
  useEffect(() => { fetchReputations(); }, []);
  useEffect(() => { const openFromNoti = async () => { if (location.state?.openAuctionId) { const auctionId = location.state.openAuctionId; let targetAuction = auctions.find(a => a.id === auctionId) || myAuctions.find(a => a.id === auctionId); if (!targetAuction) { const { data } = await supabase.from('auctions').select('*').eq('id', auctionId).single(); if (data) targetAuction = data; } if (targetAuction) { setChatAuction(targetAuction); window.history.replaceState({}, document.title); } } }; openFromNoti(); }, [location, auctions, myAuctions]);
  useEffect(() => { if (activeTab === 'management' && userProfile?.email) { fetchMyAuctions(); } else { fetchAuctions(); } const channel = supabase.channel('public:auctions').on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, () => { if (activeTab === 'management') fetchMyAuctions(); else fetchAuctions(); }).subscribe(); return () => supabase.removeChannel(channel); }, [activeTab, userProfile]);
  
  async function fetchAuctions() { 
      const now = new Date().toISOString(); 
      const { data } = await supabase.from('auctions').select('*').eq('status', 'active').gt('end_time', now).order('end_time', { ascending: true });
      if (data) setAuctions(data); 
  }
  
  async function fetchMyAuctions() {
    if (!userProfile?.email) return;
    const { data: auctionData } = await supabase.from('auctions').select('*').or(`seller_email.eq.${userProfile.email},winner_email.eq.${userProfile.email}`);
    const { data: marketData } = await supabase.from('market_listings').select('*').or(`seller_email.eq.${userProfile.email},buyer_email.eq.${userProfile.email}`);
    const mappedMarket = (marketData || []).map(m => ({ 
        ...m, id: m.id, card_name: m.title, card_image_path: 'CUSTOM_ITEM', proof_image: m.images, current_price: m.price, start_price: m.price, buy_now_price: m.price, min_bid_increment: 0, end_time: m.created_at, seller_email: m.seller_email, seller_name: m.seller_name, winner_email: m.buyer_email, winner_name: m.buyer_name, status: m.status, is_escrow: m.is_escrow, is_shipped: m.is_shipped, tracking_number: m.tracking_number, courier_name: m.courier_name, shipping_date: m.shipping_date, shipping_proof: m.shipping_proof, seller_hidden: m.seller_hidden, winner_hidden: m.buyer_hidden, type: 'market' 
    }));
    let combined = [...(auctionData || []), ...mappedMarket].sort((a, b) => new Date(b.created_at || b.end_time) - new Date(a.created_at || a.end_time));
    combined = combined.filter(item => {
        const isMySale = item.seller_email === userProfile.email;
        const isMyBuy = item.winner_email === userProfile.email;
        if (isMySale && item.seller_hidden) return false;
        if (isMyBuy && item.winner_hidden) return false;
        return true;
    });
    setMyAuctions(combined);
  }

  const managementNotiCount = useMemo(() => {
      if (!userProfile || !myAuctions) return 0;
      const toShip = myAuctions.filter(i => i.seller_email === userProfile.email && (i.status === 'pending_ship' || (i.status === 'sold' && !i.is_shipped) || (i.status === 'ended' && i.winner_email && !i.is_shipped))).length;
      const toReceive = myAuctions.filter(i => i.winner_email === userProfile.email && i.is_shipped && i.status !== 'completed').length;
      return toShip + toReceive;
  }, [myAuctions, userProfile]);

  const filteredAuctions = useMemo(() => { return auctions.filter(item => { const matchName = item.card_name.toLowerCase().includes(searchTerm.toLowerCase()); let matchStatus = true; if (filterStatus === 'active_bid') matchStatus = item.current_price > item.start_price; else if (filterStatus === 'no_bid') matchStatus = item.current_price === item.start_price; return matchName && matchStatus; }).sort((a, b) => { if (sortOption === 'price_asc') return a.current_price - b.current_price; if (sortOption === 'price_desc') return b.current_price - a.current_price; return new Date(a.end_time) - new Date(b.end_time); }); }, [auctions, searchTerm, sortOption, filterStatus]);
  
  async function handleBid(auction) { if (!userProfile) return alert("กรุณา Login ก่อนครับ"); if (userProfile.email === auction.seller_email) return alert("ห้ามบิดของตัวเองครับ!"); setActionModalData({ type: 'bid', auction }); }
  async function handleBuyNow(auction) { if (!userProfile) return alert("กรุณา Login ก่อนครับ"); if (userProfile.email === auction.seller_email) return alert("ซื้อของตัวเองไม่ได้ครับ"); setActionModalData({ type: 'buy', auction }); }
  async function handleBuyMarketItem(item) { if (!userProfile) return alert("กรุณา Login ก่อนครับ"); if (userProfile.email === item.seller_email) return alert("ซื้อของตัวเองไม่ได้ครับ"); setActionModalData({ type: 'buy_market', auction: { ...item, id: item.id, card_name: item.title, buy_now_price: item.price, is_escrow: item.is_escrow } }); }
  
  async function handleFinalSubmit(amount) { 
    if (!actionModalData) return; 
    const { type, auction } = actionModalData; 
    if (type === 'bid') { 
        const { data, error } = await supabase.rpc('place_bid', { p_auction_id: auction.id, p_bidder_email: userProfile.email, p_bidder_name: displayUser.name, p_amount: amount }); 
        if (error) alert("Error: " + error.message); 
        else if (!data.success) alert(data.message); 
        else return { success: true }; 
    } else if (type === 'buy') { 
        const { data, error } = await supabase.rpc('buy_now_auction', { p_auction_id: auction.id, p_buyer_email: userProfile.email, p_buyer_name: displayUser.name, p_amount: auction.buy_now_price }); 
        if (error) alert("Error: " + error.message); 
        else if (!data.success) alert(data.message); 
        else { setChatAuction(null); fetchAuctions(); return { success: true }; } 
    } else if (type === 'buy_market') { 
        let rpcName = 'buy_market_item'; 
        if (!auction.is_escrow) rpcName = 'buy_non_escrow_item'; 
        const { data, error } = await supabase.rpc(rpcName, { p_item_id: auction.id, p_buyer_email: userProfile.email, p_buyer_name: displayUser.name, p_amount: auction.buy_now_price }); 
        if (error) alert("Error: " + error.message); 
        else if (!data.success) alert(data.message); 
        else { fetchMyAuctions(); return { success: true }; } 
    } 
  }

  async function handleCancel(item) { if (item.type === 'market') { if (!confirm("⚠️ ยืนยันการยกเลิกการขาย?")) return; const { error } = await supabase.from('market_listings').delete().eq('id', item.id); if (error) alert("ลบไม่สำเร็จ: " + error.message); else { setMyAuctions(prev => prev.filter(i => i.id !== item.id)); alert("ยกเลิกการขายเรียบร้อย"); } } else { const isAdmin = userProfile?.email === 'koritros619@gmail.com'; const confirmMsg = isAdmin ? "👑 Admin Force Cancel:\nยืนยัน?" : "⚠️ ยืนยันการยกเลิกการประมูล?"; if (!confirm(confirmMsg)) return; const { data, error } = await supabase.rpc('cancel_auction', { p_auction_id: item.id, p_user_email: userProfile.email }); if (error) alert("Error: " + error.message); else if (!data.success) alert(data.message); else { alert(data.message); fetchAuctions(); fetchMyAuctions(); } } }
  async function handlePenaltyCancel(item) { if (!confirm(`⚠️ คำเตือน: สินค้านี้มีผู้สั่งซื้อแล้ว!\nหากยกเลิก คุณจะถูก "หักเครดิต 2 คะแนน"\nยืนยันยกเลิก?`)) return; const { data, error } = await supabase.rpc('cancel_order_with_penalty', { p_item_id: item.id, p_seller_email: userProfile.email }); if (error) alert("Error: " + error.message); else { alert(data.message); fetchMyAuctions(); } }
  async function handleDeleteMyAuction(item, e) { if (e && e.stopPropagation) e.stopPropagation(); if (!confirm("⚠️ ยืนยันการลบประวัติรายการนี้ออกจากรายการของคุณ?\n(รายการจะหายไปจากหน้าจอของคุณเท่านั้น)")) return; const isSeller = item.seller_email === userProfile.email; const table = item.type === 'market' ? 'market_listings' : 'auctions'; const field = isSeller ? 'seller_hidden' : (item.type === 'market' ? 'buyer_hidden' : 'winner_hidden'); const { error } = await supabase.from(table).update({ [field]: true }).eq('id', item.id); if (error) { alert("Error: " + error.message); } else { setMyAuctions(prev => prev.filter(i => i.id !== item.id)); } }
  
  const handleLogout = () => { googleLogout(); localStorage.removeItem("bot-userProfile-v1"); setUserProfile(null); navigate('/'); };
  const handleSaveProfile = async (data) => { if (!userProfile) return; try { await setDoc(doc(db, "users", userProfile.email), { displayName: data.displayName, avatarUrl: data.avatarUrl, isSetup: true, updatedAt: serverTimestamp() }, { merge: true }); setCustomProfile(p => ({ ...p, ...data })); setIsProfileModalOpen(false); alert("บันทึกข้อมูลเรียบร้อย!"); } catch (e) { console.error(e); alert("บันทึกไม่สำเร็จ"); } };
  const handleStartAuctionClick = () => { setIsTypeSelectionOpen(true); };
  const handleSelectType = (type) => { setIsTypeSelectionOpen(false); if (type === 'single') { navigate('/', { state: { showAuctionTutorial: true } }); } else { setIsBulkModalOpen(true); } };
  const handleConfirmReceipt = (item) => { if (!item.is_shipped) { return alert("ผู้ขายยังไม่ได้กดส่งสินค้าครับ กรุณารอผู้ขายจัดส่งก่อน"); } setConfirmTransaction({ auction: item }); };
  const handleTopUpClick = async () => { try { const { data, error } = await supabase.from('system_config').select('value').eq('key', 'topup_status').single(); if (error) { setIsTopUpOpen(true); return; } const status = data?.value || 'open'; if (status === 'maintenance') alert("⚠️ ระบบอยู่ในระหว่างการปรับปรุงค่ะ"); else if (status === 'closed') alert("⛔ ปิดระบบเติมเงินชั่วคราว"); else setIsTopUpOpen(true); } catch (e) { setIsTopUpOpen(true); } };
  
  const handleOpenForceEndModal = (item) => {
      if (!item.winner_email) {
          return alert("⚠️ ยังไม่มีผู้ร่วมประมูล ไม่สามารถกดจบการขายได้");
      }
      setForceEndItem(item); 
  };

  const handleConfirmForceEnd = async (item) => {
      setForceEndItem(null); 
      const { data, error } = await supabase.rpc('force_end_auction', { 
          p_auction_id: item.id, 
          p_seller_email: userProfile.email 
      });
      if (error) {
          alert("Error: " + error.message);
      } else if (!data.success) {
          alert("แจ้งเตือน: " + data.message);
      } else {
          fetchMyAuctions(); 
      }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-100 dark:bg-black text-slate-900 dark:text-white flex flex-col transition-colors duration-300">
      <Header userProfile={userProfile} displayUser={displayUser} userReputation={userReputation[userProfile?.email]} setIsSettingsOpen={setIsSettingsOpen} setIsAdminOpen={setIsAdminOpen} />
      <div className="flex justify-center mt-4 px-2 md:px-4 shrink-0">
        <div className="flex w-full md:w-auto bg-slate-200 dark:bg-slate-800 rounded-full p-1 shadow-inner overflow-visible relative z-10">
            <button onClick={() => setActiveTab('auction')} className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'auction' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><GavelIcon /> ลานประมูล</button>
            <button onClick={() => setActiveTab('market')} className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'market' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><ShoppingBagIcon /> ตลาดซื้อขาย</button>
            <button onClick={() => setActiveTab('management')} className={`relative flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'management' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <PackageIcon /> การจัดการ
                {managementNotiCount > 0 && (
                    <span className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white dark:ring-slate-900 shadow-md z-50 animate-bounce">
                        {managementNotiCount}
                    </span>
                )}
            </button>
        </div>
      </div>

      <main className="flex-grow p-0 md:p-8 w-full pb-40 min-h-[120vh]">
        
        {activeTab === 'auction' && (
            <div className="animate-fade-in w-full md:px-8">
                <div className="mt-4 mb-6 flex flex-col gap-2 bg-white dark:bg-slate-900/50 p-2 md:p-3 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-sm mx-4 md:mx-0">
                    <div className="relative flex-grow w-full"><div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><input type="text" placeholder="ค้นหาชื่อการ์ด..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all" /></div>
                    <div className="flex flex-col md:flex-row gap-2 md:items-center shrink-0">
                        <div className="flex gap-2 items-center overflow-x-auto pb-1 md:pb-0 no-scrollbar shrink-0"><select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="px-2 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shrink-0"><option value="ending_soon">เวลา</option><option value="price_asc">ถูก➜แพง</option><option value="price_desc">แพง➜ถูก</option></select><div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1 shrink-0"><button onClick={() => setFilterStatus('all')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all shrink-0 ${filterStatus === 'all' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>รวม</button><button onClick={() => setFilterStatus('active_bid')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all shrink-0 ${filterStatus === 'active_bid' ? 'bg-white dark:bg-slate-600 shadow text-red-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>เดือด</button><button onClick={() => setFilterStatus('no_bid')} className={`px-2 py-1 rounded text-[10px] md:text-xs font-bold transition-all shrink-0 ${filterStatus === 'no_bid' ? 'bg-white dark:bg-slate-600 shadow text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>ใหม่</button></div><div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 shrink-0"></div><button onClick={() => setIsCompletedModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-all whitespace-nowrap shrink-0" title="ดูประวัติการประมูลที่จบแล้ว"><HistoryIcon /> <span className="hidden sm:inline">ประวัติ</span></button></div>
                        <button onClick={handleStartAuctionClick} className="w-full md:w-auto flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-emerald-500/30 transition-all active:scale-95 whitespace-nowrap justify-center shrink-0"><span className="text-lg leading-none mb-0.5">+</span> ลงประมูล</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
                    {filteredAuctions.map(item => (
                        <SingleAuctionCard 
                            key={item.id}
                            item={item}
                            onChat={setChatAuction} 
                            onBid={handleBid}       
                            onBuyNow={handleBuyNow} 
                        />
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'market' && <FleaMarket userProfile={displayUser} onChat={(item) => setChatAuction(item)} onBuy={handleBuyMarketItem} />}

        {activeTab === 'management' && (
            <ManagementDashboard 
                myAuctions={myAuctions}
                userProfile={userProfile}
                setChatAuction={setChatAuction}
                handleCancel={handleCancel}
                handlePenaltyCancel={handlePenaltyCancel}
                setManageAuction={setManageAuction}
                handleDeleteMyAuction={handleDeleteMyAuction}
                handleConfirmReceipt={handleConfirmReceipt}
                setConfirmTransaction={setConfirmTransaction}
                setShipmentData={setShipmentData}
                handleForceEnd={handleOpenForceEndModal} 
            />
        )}

      </main>

      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} userProfile={displayUser} onEditProfile={() => setIsProfileModalOpen(true)} onLogout={handleLogout} theme={theme} setTheme={setTheme} onOpenAdmin={() => setIsAdminOpen(true)} userStats={userReputation[userProfile?.email]} onOpenMyDecks={() => setIsDeckListModalOpen(true)} onOpenFeedback={() => setIsFeedbackOpen(true)} />
      <ProfileSetupModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} userProfile={userProfile} onSave={handleSaveProfile} />
      <BidHistoryModal isOpen={!!historyAuction} onClose={() => setHistoryAuction(null)} auction={historyAuction} />
      <CompletedAuctionsModal isOpen={isCompletedModalOpen} onClose={() => setIsCompletedModalOpen(false)} userProfile={userProfile} />
      <AdminDashboardModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} adminEmail={userProfile?.email} />
      <ReportModal isOpen={!!reportTarget} onClose={() => setReportTarget(null)} reporterEmail={userProfile?.email} targetUser={reportTarget?.targetUser} context={reportTarget?.context} />
      <ManageBiddersModal isOpen={!!manageAuction} onClose={() => setManageAuction(null)} auction={manageAuction} userProfile={userProfile} />
      <AuctionRoomModal isOpen={!!chatAuction} onClose={() => setChatAuction(null)} auction={chatAuction} userProfile={displayUser} onBid={handleBid} onBuyNow={handleBuyNow} />
      <ConfirmTransactionModal isOpen={!!confirmTransaction} onClose={() => setConfirmTransaction(null)} auction={confirmTransaction?.auction} userProfile={userProfile} fetchReputations={fetchReputations} onBuyNow={handleBuyNow} />
      <DeckListModal isOpen={isDeckListModalOpen} onClose={() => setIsDeckListModalOpen(false)} userProfile={displayUser} userDecks={userDecks} setUserDecks={setUserDecks} mainDeck={mainDeck} lifeDeck={lifeDeck} setMainDeck={setMainDeck} setLifeDeck={setLifeDeck} cardDb={cardDb} />
      <CreateBulkAuctionModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} userProfile={displayUser} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} userProfile={displayUser} showAlert={(title, msg) => alert(`${title}\n${msg}`)} />
      {!chatAuction && (<ChatWidget userProfile={displayUser} isMobileMenuOpen={isSettingsOpen} />)}
      
      <ActionConfirmModal isOpen={!!actionModalData} onClose={() => setActionModalData(null)} actionData={actionModalData} userBalance={userReputation[userProfile?.email]?.wallet_balance || 0} onConfirm={handleFinalSubmit} onTopUp={() => { setActionModalData(null); handleTopUpClick(); }} />
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} userProfile={displayUser} onSuccess={() => fetchReputations()} />
      <ShipmentModal isOpen={!!shipmentData} onClose={() => setShipmentData(null)} auction={shipmentData} onSuccess={() => { fetchMyAuctions(); fetchAuctions(); }} />
      
      {isTypeSelectionOpen && (createPortal(<div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[900] p-4 animate-fade-in" onClick={() => setIsTypeSelectionOpen(false)}><div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 transform scale-100 transition-transform" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold text-center mb-6 text-slate-900 dark:text-white">ต้องการลงขายแบบไหน?</h3><div className="flex flex-col gap-3"><button onClick={() => handleSelectType('single')} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 transition-all group"><div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🃏</div><div className="text-left"><h4 className="font-bold text-slate-900 dark:text-white">การ์ดเดี่ยว (Single)</h4><p className="text-xs text-slate-500 dark:text-slate-400">เลือกการ์ดจากฐานข้อมูล</p></div></button><button onClick={() => handleSelectType('bulk')} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-500 transition-all group"><div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📦</div><div className="text-left"><h4 className="font-bold text-slate-900 dark:text-white">ยกกล่อง / อื่นๆ</h4><p className="text-xs text-slate-500 dark:text-slate-400">ระบุชื่อเอง + ต้องถ่ายรูป</p></div></button></div><button onClick={() => setIsTypeSelectionOpen(false)} className="mt-6 w-full py-2 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">ยกเลิก</button></div></div>, document.body))}
      <ConfirmForceEndModal 
        isOpen={!!forceEndItem}
        onClose={() => setForceEndItem(null)}
        onConfirm={handleConfirmForceEnd}
        item={forceEndItem}
      />

    </div>
  );
}