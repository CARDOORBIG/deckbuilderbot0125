import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { createPortal } from "react-dom";
import { googleLogout } from '@react-oauth/google';
import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import FleaMarket from './FleaMarket';
import ManagementDashboard from './components/ManagementDashboard';
import AdminDashboardModal from './AdminDashboardModal';
import ReportModal from './ReportModal';
import ChatWidget from './ChatWidget';
import FeedbackModal from './components/FeedbackModal';
import CreateBulkAuctionModal from './CreateBulkAuctionModal'; 
import CreateMarketListingModal from './CreateMarketListingModal'; 
import TopUpModal from './components/TopUpModal'; 
import ShipmentModal from './components/ShipmentModal';
import ConfirmForceEndModal from './components/ConfirmForceEndModal'
import SingleAuctionCard from './components/SingleAuctionCard';
import TrackingModal from './components/TrackingModal';
import AuctionRoomModal from './components/AuctionRoomModal';
import ConfirmTransactionModal from './components/ConfirmTransactionModal';
import ActionConfirmModal from './components/ActionConfirmModal';
import Header from './components/Header';
import SettingsDrawer from './components/SettingsDrawer';
import ProfileSetupModal from './components/ProfileSetupModal';
import DeckListModal from './components/DeckListModal';
import { 
    GavelIcon, ShoppingBagIcon, PackageIcon, HistoryIcon, CheckIcon
} from './components/Icons';

const LayoutGridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const LayoutFeedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>;

// 🟢 แก้ไข Component ป้ายไฟ (ฝัง CSS ในตัว)
const LEDBanner = () => {
  const message = "🚨 หากผู้ซืื้อได้ทำการประมูลชนะหรือกดซื้อไปแล้ว ให้ทำการติดต่อส่วนตัวกับผู้ขาย หากตรวจสอบพบเห็นว่าเงียบหายจะถือว่าก่อกวน จะทำการเตือนก่อนที่จะลงโทษตามกฏของเว็ปนะครับ 🚨";
  const gapClass = "mr-32 md:mr-48"; 

  return (
    <>
      {/* ฝัง CSS Animation ไว้ตรงนี้เลย เพื่อความชัวร์ */}
      <style>{`
        @keyframes marquee-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-custom {
          display: flex;
          width: max-content; /* สำคัญ: ให้กว้างเท่าเนื้อหาข้างใน */
          animation: marquee-infinite 25s linear infinite;
        }
        .animate-marquee-custom:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full bg-black border-y-2 border-red-600/50 overflow-hidden relative py-2 shadow-[0_0_15px_rgba(220,38,38,0.3)] mb-4 mx-0 md:mx-4 md:w-auto md:rounded-xl mt-4 flex">
        {/* ใช้ Class ใหม่ animate-marquee-custom */}
        <div className="animate-marquee-custom flex items-center whitespace-nowrap">
          <span className={`text-white-500 font-led font-bold text-base md:text-lg tracking-wider whitespace-nowrap ${gapClass}`}>{message}</span>
          <span className={`text-white-500 font-led font-bold text-base md:text-lg tracking-wider whitespace-nowrap ${gapClass}`}>{message}</span>
        </div>
      </div>
    </>
  );
};

// Placeholder Modals
const ManageBiddersModal = ({ isOpen, onClose }) => (!isOpen ? null : <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white"><div className="bg-slate-900 p-4 rounded">Manage Bidders (Placeholder)<button onClick={onClose} className="ml-4 bg-red-500 px-2 rounded">Close</button></div></div>);
const BidHistoryModal = ({ isOpen, onClose }) => (!isOpen ? null : <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white"><div className="bg-slate-900 p-4 rounded">Bid History (Placeholder)<button onClick={onClose} className="ml-4 bg-red-500 px-2 rounded">Close</button></div></div>);
const CompletedAuctionsModal = ({ isOpen, onClose }) => (!isOpen ? null : <div className="fixed inset-0 bg-black/80 flex items-center justify-center text-white"><div className="bg-slate-900 p-4 rounded">Completed Auctions (Placeholder)<button onClick={onClose} className="ml-4 bg-red-500 px-2 rounded">Close</button></div></div>);

function useLocalStorage(key, initial) { const [v, s] = useState(() => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; } }); useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]); return [v, s]; }

export default function AuctionMarket() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useLocalStorage('bot-market-active-tab', 'auction');
  const [viewMode, setViewMode] = useLocalStorage('bot-view-mode', 'grid');

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
  
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false); 
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);

  const [actionModalData, setActionModalData] = useState(null); 
  const [isTopUpOpen, setIsTopUpOpen] = useState(false); 
  const [shipmentData, setShipmentData] = useState(null); 
  const [isCreateAuctionModalOpen, setIsCreateAuctionModalOpen] = useState(false); 
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
  
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'info' });
  const closeModal = () => setModal({ ...modal, isOpen: false });
  const showAlert = (title, message, type = 'info') => setModal({ isOpen: true, title, message, onConfirm: null, type });
  const showConfirm = (title, message, onConfirm) => setModal({ isOpen: true, title, message, onConfirm, type: 'confirm' });

  useEffect(() => {
    if (!userProfile) {
        navigate('/', { replace: true, state: { from: location } });
    }
  }, [userProfile, navigate, location]);

  useEffect(() => {
      const params = new URLSearchParams(location.search);
      const shareId = params.get('id');
      const shareType = params.get('type');
      if (shareId) {
          const fetchSharedItem = async () => {
              const table = shareType === 'market' ? 'market_listings' : 'auctions';
              const { data } = await supabase.from(table).select('*').eq('id', shareId).single();
              if (data) {
                  let item = data;
                  if (shareType === 'market') {
                       item = { ...data, card_name: data.title, current_price: data.price, start_price: data.price, buy_now_price: data.price, min_bid_increment: 0, proof_image: data.images, seller_email: data.seller_email, seller_name: data.seller_name, status: data.status, type: 'market' };
                  } else {
                      item = { ...data, type: 'auction' };
                  }
                  setChatAuction(item);
              }
          };
          fetchSharedItem();
      }
  }, [location.search]);

  useEffect(() => { const ua = navigator.userAgent || navigator.vendor || window.opera; const isInApp = /(Line|FBAN|FBAV|Instagram|Messenger)/i.test(ua); if (isInApp) { navigate(`/open-browser?redirect=${encodeURIComponent(location.pathname + location.search)}`, { replace: true }); } }, [location, navigate]);
  useEffect(() => { const root = document.documentElement; if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark'); }, [theme]);
  const setTheme = (newTheme) => { setThemeState(newTheme); localStorage.setItem("bot-theme", JSON.stringify(newTheme)); };
  
  const displayUser = useMemo(() => { 
      if (!userProfile) return null; 
      if (!customProfile) return userProfile; 
      return { ...userProfile, ...customProfile, name: customProfile.displayName || userProfile.name, picture: customProfile.avatarUrl || userProfile.picture }; 
  }, [userProfile, customProfile]);

  useEffect(() => { if (userProfile?.email) { const fetchProfile = async () => { try { const docSnap = await getDoc(doc(db, "users", userProfile.email)); if (docSnap.exists()) setCustomProfile(docSnap.data()); } catch (e) { console.error("Profile fetch error", e); } }; fetchProfile(); } }, [userProfile]);
  
  const fetchReputations = async () => { 
      const { data } = await supabase.from('user_stats').select('user_email, total_score, penalty_level, wallet_balance, cooldown_until'); 
      const map = {}; 
      data?.forEach(u => map[u.user_email] = u); 
      setUserReputation(map); 
  };
  
  useEffect(() => { const channel = supabase.channel('market_balance_update').on('postgres_changes', { event: '*', schema: 'public', table: 'user_stats' }, () => { fetchReputations(); }).subscribe(); return () => { supabase.removeChannel(channel); }; }, []);
  useEffect(() => { fetchReputations(); }, []);
  useEffect(() => { const openFromNoti = async () => { if (location.state?.openAuctionId) { const auctionId = location.state.openAuctionId; let targetAuction = auctions.find(a => a.id === auctionId) || myAuctions.find(a => a.id === auctionId); if (!targetAuction) { const { data } = await supabase.from('auctions').select('*').eq('id', auctionId).single(); if (data) targetAuction = data; } if (targetAuction) { setChatAuction(targetAuction); window.history.replaceState({}, document.title); } } }; openFromNoti(); }, [location, auctions, myAuctions]);
  
  useEffect(() => { 
    const refreshData = () => {
        fetchAuctions(); 
        if (userProfile?.email) {
            fetchMyAuctions(); 
        }
    };
    
    refreshData();

    const channel = supabase.channel('public:market_updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, refreshData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'market_listings' }, refreshData) 
        .subscribe(); 
    
    return () => supabase.removeChannel(channel); 
  }, [userProfile]); 
  
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
      const toAction = myAuctions.filter(i => {
          if (i.seller_email === userProfile.email) {
              return ['waiting_seller_confirmation', 'verifying_payment', 'pending_ship', 'sold'].includes(i.status) && !i.is_shipped;
          }
          if (i.winner_email === userProfile.email) {
              return ['pending_payment', 'payment_rejected'].includes(i.status) || (i.is_shipped && i.status !== 'completed');
          }
          return false;
      }).length;
      return toAction;
  }, [myAuctions, userProfile]);

  const filteredAuctions = useMemo(() => { 
      return auctions.filter(item => { 
          const matchName = item.card_name.toLowerCase().includes(searchTerm.toLowerCase()); 
          let matchStatus = true; 
          if (filterStatus === 'escrow') matchStatus = item.is_escrow === true;
          else if (filterStatus === 'direct') matchStatus = item.is_escrow === false;
          return matchName && matchStatus; 
      }).sort((a, b) => { 
          if (sortOption === 'price_asc') return a.current_price - b.current_price; 
          if (sortOption === 'price_desc') return b.current_price - a.current_price; 
          return new Date(a.end_time) - new Date(b.end_time); 
      }); 
  }, [auctions, searchTerm, sortOption, filterStatus]);
  
  const checkIsBanned = async () => {
      if (!userProfile?.email) return false;
      const { data } = await supabase.from('user_stats').select('cooldown_until').eq('user_email', userProfile.email).single();
      if (data?.cooldown_until) {
          const banUntil = new Date(data.cooldown_until);
          if (banUntil > new Date()) {
              showAlert("⛔ บัญชีถูกระงับ", `ปลดแบนวันที่: ${banUntil.toLocaleString('th-TH')}`, 'error');
              return true;
          }
      }
      return false;
  };

  async function handleBid(auction) { 
      if (!userProfile) return showAlert("แจ้งเตือน", "กรุณา Login ก่อนครับ"); 
      if (await checkIsBanned()) return;
      if (userProfile.email === auction.seller_email) return showAlert("แจ้งเตือน", "ห้ามบิดของตัวเองครับ!", 'error'); 
      setActionModalData({ type: 'bid', auction }); 
  }

  async function handleBuyNow(auction) { 
      if (!userProfile) return showAlert("แจ้งเตือน", "กรุณา Login ก่อนครับ"); 
      if (await checkIsBanned()) return;
      if (userProfile.email === auction.seller_email) return showAlert("แจ้งเตือน", "ซื้อของตัวเองไม่ได้ครับ", 'error'); 
      setActionModalData({ type: 'buy', auction }); 
  }

  async function handleBuyMarketItem(item) { 
      if (!userProfile) return showAlert("แจ้งเตือน", "กรุณา Login ก่อนครับ"); 
      if (await checkIsBanned()) return;
      if (userProfile.email === item.seller_email) return showAlert("แจ้งเตือน", "ซื้อของตัวเองไม่ได้ครับ", 'error'); 
      setActionModalData({ type: 'buy_market', auction: { ...item, id: item.id, card_name: item.title, buy_now_price: item.price, is_escrow: item.is_escrow } }); 
  }
  
  async function handleFinalSubmit(amount) { 
    if (await checkIsBanned()) { setActionModalData(null); return; }
    if (!actionModalData) return; 
    const { type, auction } = actionModalData; 

    if (type === 'bid') { 
        const { data, error } = await supabase.rpc('place_bid', { p_auction_id: auction.id, p_bidder_email: userProfile.email, p_bidder_name: displayUser.name, p_amount: amount }); 
        if (error) showAlert("Error", error.message, 'error'); else if (!data.success) showAlert("แจ้งเตือน", data.message, 'error'); else return { success: true }; 
    } 
    else if (type === 'buy') { 
        const { error } = await supabase.from('auctions').update({
            status: 'waiting_seller_confirmation', 
            winner_email: userProfile.email,
            winner_name: displayUser.name,
            current_price: auction.buy_now_price
        }).eq('id', auction.id);

        if (error) showAlert("Error", error.message, 'error'); 
        else { setChatAuction(null); fetchAuctions(); return { success: true }; } 
    } 
    else if (type === 'buy_market') { 
        const { error } = await supabase.from('market_listings').update({
            status: 'waiting_seller_confirmation', 
            buyer_email: userProfile.email,
            buyer_name: displayUser.name
        }).eq('id', auction.id);

        if (error) showAlert("Error", error.message, 'error'); 
        else { fetchMyAuctions(); return { success: true }; } 
    } 
  }

  async function handleCancel(item) { 
    const ADMIN_EMAILS = ['koritros619@gmail.com', 'sarun.psx@gmail.com', 'srirujinanon.k@gmail.com'];
    const isAdmin = ADMIN_EMAILS.includes(userProfile?.email);

    if (item.type === 'market') { 
        showConfirm("ยืนยัน", "⚠️ ยืนยันการยกเลิกการขาย?", async () => { 
            const { error } = await supabase.from('market_listings').delete().eq('id', item.id); 
            if (error) showAlert("Error", "ลบไม่สำเร็จ: " + error.message, 'error'); 
            else { 
                setMyAuctions(prev => prev.filter(i => i.id !== item.id)); 
                showAlert("สำเร็จ", "ยกเลิกการขายเรียบร้อย", 'success'); 
                closeModal(); 
            } 
        }); 
    } else { 
        const confirmMsg = isAdmin ? "👑 Admin Force Cancel:\nยืนยัน?" : "⚠️ ยืนยันการยกเลิกการประมูล?"; 
        showConfirm("ยืนยัน", confirmMsg, async () => { 
            const { data, error } = await supabase.rpc('cancel_auction', { p_auction_id: item.id, p_user_email: userProfile.email }); 
            if (error) showAlert("Error", "Error: " + error.message, 'error'); 
            else if (!data.success) showAlert("แจ้งเตือน", data.message, 'error'); 
            else { 
                showAlert("สำเร็จ", data.message, 'success'); 
                fetchAuctions(); 
                fetchMyAuctions(); 
                closeModal(); 
            } 
        }); 
    } 
  }

  async function handlePenaltyCancel(item) { 
    showConfirm("ยืนยันยกเลิก", `⚠️ คำเตือน: สินค้านี้มีผู้สั่งซื้อแล้ว!\nหากยกเลิก คุณจะถูก "หักเครดิต 2 คะแนน"\nยืนยันยกเลิก?`, async () => { 
        const { data, error } = await supabase.rpc('cancel_order_with_penalty', { p_item_id: item.id, p_seller_email: userProfile.email }); 
        if (error) showAlert("Error", error.message, 'error'); 
        else { 
            showAlert("เรียบร้อย", data.message, 'info'); 
            fetchMyAuctions(); 
            closeModal(); 
        } 
    }); 
  }

  async function handleDeleteMyAuction(item, e) { if (e && e.stopPropagation) e.stopPropagation(); showConfirm("ลบประวัติ", "⚠️ ยืนยันการลบประวัติรายการนี้ออกจากรายการของคุณ?\n(รายการจะหายไปจากหน้าจอของคุณเท่านั้น)", async () => { const isSeller = item.seller_email === userProfile.email; const table = item.type === 'market' ? 'market_listings' : 'auctions'; const field = isSeller ? 'seller_hidden' : (item.type === 'market' ? 'buyer_hidden' : 'winner_hidden'); const { error } = await supabase.from(table).update({ [field]: true }).eq('id', item.id); if (error) { showAlert("Error", error.message, 'error'); } else { setMyAuctions(prev => prev.filter(i => i.id !== item.id)); closeModal(); } }); }
  
  const handleLogout = () => { googleLogout(); localStorage.removeItem("bot-userProfile-v1"); setUserProfile(null); navigate('/'); };
  const handleSaveProfile = async (data) => { if (!userProfile) return; try { await setDoc(doc(db, "users", userProfile.email), { displayName: data.displayName, avatarUrl: data.avatarUrl, facebook: data.facebook || "", lineId: data.lineId || "", phone: data.phone || "", isSetup: true, updatedAt: serverTimestamp() }, { merge: true }); setCustomProfile(p => ({ ...p, ...data, isSetup: true })); setIsProfileModalOpen(false); showAlert("Success", "บันทึกข้อมูลเรียบร้อย!", 'success'); } catch (e) { console.error(e); showAlert("Error", "บันทึกไม่สำเร็จ", 'error'); } };
  const handleStartAuctionClick = async () => { if (await checkIsBanned()) return; setIsBulkModalOpen(true); };
  const handleStartMarketListingClick = async () => { if (await checkIsBanned()) return; setIsMarketModalOpen(true); };
  const handleSelectType = (type) => { setIsTypeSelectionOpen(false); if (type === 'single') { navigate('/', { state: { showAuctionTutorial: true } }); } else { setIsBulkModalOpen(true); } };
  const handleConfirmReceipt = (item) => { 
      if (!item.is_shipped) { return showAlert("แจ้งเตือน", "ผู้ขายยังไม่ได้กดส่งสินค้าครับ กรุณารอผู้ขายจัดส่งก่อน"); } 
      setConfirmTransaction({ auction: item }); 
  };
  const handleTopUpClick = async () => { try { const { data, error } = await supabase.from('system_config').select('value').eq('key', 'topup_status').single(); if (error) { setIsTopUpOpen(true); return; } const status = data?.value || 'open'; if (status === 'maintenance') showAlert("แจ้งเตือน", "⚠️ ระบบอยู่ในระหว่างการปรับปรุงค่ะ"); else if (status === 'closed') showAlert("แจ้งเตือน", "⛔ ปิดระบบเติมเงินชั่วคราว"); else setIsTopUpOpen(true); } catch (e) { setIsTopUpOpen(true); } };
  const handleOpenForceEndModal = (item) => { if (!item.winner_email) { return showAlert("แจ้งเตือน", "⚠️ ยังไม่มีผู้ร่วมประมูล ไม่สามารถกดจบการขายได้"); } setForceEndItem(item); };
  const handleConfirmForceEnd = async (item) => { setForceEndItem(null); const { data, error } = await supabase.rpc('force_end_auction', { p_auction_id: item.id, p_seller_email: userProfile.email }); if (error) { showAlert("Error", error.message, 'error'); } else if (!data.success) { showAlert("แจ้งเตือน", data.message, 'error'); } else { fetchMyAuctions(); } };

  // Helper Modal Component
  const ModalComponent = ({ isOpen, title, message, onClose, onConfirm, confirmText = "ตกลง", confirmIcon, type }) => {
    if (!isOpen) return null;
    let icon = <div className="text-4xl text-blue-500">ℹ️</div>;
    let colorClass = "border-slate-300";
    let btnClass = "bg-slate-800 text-white hover:bg-slate-700";
    if (type === 'success') { icon = <div className="text-4xl animate-bounce">✅</div>; colorClass = "border-emerald-500"; btnClass = "bg-emerald-600 hover:bg-emerald-500"; }
    else if (type === 'error') { icon = <div className="text-4xl animate-pulse">❌</div>; colorClass = "border-red-500"; btnClass = "bg-red-600 hover:bg-red-500"; }
    else if (type === 'confirm') { icon = <div className="text-4xl animate-pulse">⚠️</div>; colorClass = "border-amber-500"; btnClass = "bg-amber-500 hover:bg-amber-600"; }
    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1200] p-4 animate-fade-in" onClick={type !== 'confirm' ? onClose : undefined}>
            <div className={`bg-white dark:bg-slate-900 border-[3px] ${colorClass} rounded-xl shadow-2xl p-6 w-full max-w-sm flex flex-col items-center text-center`} onClick={e => e.stopPropagation()}>
                <div className="mb-4">{icon}</div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">{title}</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
                <div className="flex gap-3 w-full">
                    {onConfirm && <button onClick={onClose} className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-600">ยกเลิก</button>}
                    <button onClick={() => { if(onConfirm) onConfirm(); else onClose(); }} className={`flex-1 py-2.5 rounded-lg font-bold shadow-lg transition-transform active:scale-95 ${btnClass} ${!onConfirm ? 'w-full' : ''}`}>{confirmText}</button>
                </div>
            </div>
        </div>, document.body
    );
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-black text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden">
      
      <div className="flex-none z-50 bg-slate-100 dark:bg-black border-b border-slate-200 dark:border-slate-800 shadow-sm relative">
          <Header userProfile={userProfile} displayUser={displayUser} userReputation={userReputation[userProfile?.email]} setIsSettingsOpen={setIsSettingsOpen} setIsAdminOpen={setIsAdminOpen} setIsMyDecksOpen={setIsDeckListModalOpen} />
          <div className="flex justify-center pb-2 pt-9 px-2 md:px-4">
            <div className="flex w-full md:w-auto bg-slate-200 dark:bg-slate-800 rounded-full p-1 shadow-inner relative overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('auction')} className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'auction' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><GavelIcon /> ลานประมูล</button>
                <button onClick={() => setActiveTab('market')} className={`flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'market' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><ShoppingBagIcon /> ตลาดซื้อขาย</button>
                <button onClick={() => setActiveTab('management')} className={`relative flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'management' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    <PackageIcon /> การจัดการ
                    {managementNotiCount > 0 && <span className="absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white dark:ring-slate-900 shadow-md z-50 animate-bounce">{managementNotiCount}</span>}
                </button>
            </div>
          </div>
      </div>

      <main className="flex-grow overflow-y-auto p-0 md:p-8 w-full pb-40 relative">
        {(activeTab === 'auction' || activeTab === 'market') && <LEDBanner />}
        
        {activeTab === 'auction' && (
            <div className="animate-fade-in w-full md:px-8">
                {/* ... (Search & Filter Logic) ... */}
                <div className="mb-6 mx-4 md:mx-0 mt-0">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm flex flex-col gap-3">
                        <div className="flex gap-2 items-center w-full">
                            <input type="text" placeholder="ค้นหาการ์ด..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all" />
                            <button onClick={handleStartAuctionClick} className="hidden md:flex items-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap shrink-0"><span className="text-base leading-none">+</span> ลงขาย</button>
                        </div>
                    </div>
                    <button onClick={handleStartAuctionClick} className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg mt-2 shadow-emerald-500/30"><span className="text-lg leading-none">+</span> ลงประมูลสินค้า</button>
                </div>
                <div className="mt-4">
                    <div className={viewMode === 'feed' ? "flex flex-col gap-6 max-w-xl mx-auto" : "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6"}>{filteredAuctions.map(item => (<SingleAuctionCard key={item.id} item={item} onChat={setChatAuction} onBid={handleBid} onBuyNow={handleBuyNow} />))}</div>
                </div>
            </div>
        )}

        {activeTab === 'market' && (
            <div className="relative"><FleaMarket userProfile={displayUser} onChat={(item) => setChatAuction(item)} onBuy={handleBuyMarketItem} viewMode={viewMode} setViewMode={setViewMode} onCreate={handleStartMarketListingClick} /></div>
        )}

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
                onRefresh={fetchMyAuctions} 
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
      
      <ConfirmTransactionModal 
        isOpen={!!confirmTransaction} 
        onClose={() => setConfirmTransaction(null)} 
        auction={confirmTransaction?.auction} 
        userProfile={userProfile} 
        fetchReputations={fetchReputations}
        onSuccess={() => {
            fetchMyAuctions();
            fetchAuctions();
        }}
      />
      
      <DeckListModal isOpen={isDeckListModalOpen} onClose={() => setIsDeckListModalOpen(false)} userProfile={displayUser} userDecks={userDecks} setUserDecks={setUserDecks} mainDeck={mainDeck} lifeDeck={lifeDeck} setMainDeck={setMainDeck} setLifeDeck={setLifeDeck} cardDb={cardDb} />
      
      <CreateBulkAuctionModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} userProfile={displayUser} />
      <CreateMarketListingModal isOpen={isMarketModalOpen} onClose={() => setIsMarketModalOpen(false)} userProfile={displayUser} />

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} userProfile={displayUser} showAlert={showAlert} />
      {!chatAuction && (<ChatWidget userProfile={displayUser} isMobileMenuOpen={isSettingsOpen} />)}
      <ActionConfirmModal isOpen={!!actionModalData} onClose={() => setActionModalData(null)} actionData={actionModalData} userBalance={userReputation[userProfile?.email]?.wallet_balance || 0} onConfirm={handleFinalSubmit} onTopUp={() => { setActionModalData(null); handleTopUpClick(); }} />
      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} userProfile={displayUser} onSuccess={() => fetchReputations()} />
      <ShipmentModal isOpen={!!shipmentData} onClose={() => setShipmentData(null)} auction={shipmentData} onSuccess={() => { fetchMyAuctions(); fetchAuctions(); }} />
      <ConfirmForceEndModal isOpen={!!forceEndItem} onClose={() => setForceEndItem(null)} onConfirm={handleConfirmForceEnd} item={forceEndItem} />
      
      <ModalComponent {...modal} onClose={closeModal} />
    </div>
  );
}