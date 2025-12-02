import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { 
    ChatBubbleIcon, TrashIcon, StoreIcon, PackageIcon, 
    FilterIcon, SearchIcon, PlusIcon, 
    ShoppingBagIcon, ShieldCheckIcon 
} from './components/Icons';
import CreateMarketListingModal from './CreateMarketListingModal';

// Helper
const encodePath = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';

// ฟังก์ชันเตรียมข้อมูลสำหรับ Chat
const prepareChatData = (item) => ({
    id: item.id,
    card_name: item.title,
    seller_email: item.seller_email,
    seller_name: item.seller_name,
    current_price: item.price,
    end_time: new Date().toISOString(),
    status: item.status,
    card_image_path: 'CUSTOM_ITEM',
    proof_image: item.images
});

export default function FleaMarket({ userProfile, onChat, onBuy }) {
  const [marketItems, setMarketItems] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("All");

  // Fetch Data
  const fetchMarketItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
        .from('market_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) console.error("Error fetching market:", error);
    else setMarketItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMarketItems();
    const channel = supabase.channel('public:market_listings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'market_listings' }, () => fetchMarketItems())
        .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // 🟢 ฟังก์ชันลบสินค้า (สำหรับเจ้าของ)
  const handleDelete = async (item) => {
      if (!confirm(`ยืนยันการลบประกาศ "${item.title}" ใช่หรือไม่?`)) return;
      
      if (item.images) {
          try {
              const urls = JSON.parse(item.images);
              const paths = urls.map(u => { 
                  const parts = u.split('/auction-images/'); 
                  return parts[1] ? decodeURIComponent(parts[1]) : null; 
              }).filter(Boolean);
              
              if (paths.length > 0) {
                  await supabase.storage.from('auction-images').remove(paths);
              }
          } catch(e) { console.error("Error deleting images:", e); }
      }
      
      const { error } = await supabase.from('market_listings').delete().eq('id', item.id);
      if (error) alert("ลบไม่สำเร็จ: " + error.message);
      else setMarketItems(prev => prev.filter(i => i.id !== item.id));
  };

  const filteredItems = useMemo(() => {
    return marketItems.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "All" || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (sortOption === 'price_asc') return a.price - b.price;
        if (sortOption === 'price_desc') return b.price - a.price;
        return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [marketItems, searchTerm, sortOption, filterCategory]);

  const getThumbnail = (item) => {
      try {
          const images = JSON.parse(item.images);
          return images[0] || 'https://placehold.co/300x420/1e293b/ffffff?text=No+Image';
      } catch { return 'https://placehold.co/300x420/1e293b/ffffff?text=Error'; }
  };

  return (
    <div className="w-full md:px-8 pb-20 animate-fade-in">
        
        {/* Filter Bar */}
        <div className="mt-4 mb-6 flex flex-col gap-2 bg-white dark:bg-slate-900/50 p-2 md:p-3 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-sm mx-4 md:mx-0">
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400"><SearchIcon /></div>
                <input type="text" placeholder="ค้นหาสินค้า..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all" />
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                <div className="flex gap-2 items-center overflow-x-auto pb-1 md:pb-0 no-scrollbar shrink-0">
                    <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="px-2 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shrink-0"><option value="newest">ล่าสุด</option><option value="price_asc">ราคา: ต่ำ-สูง</option><option value="price_desc">ราคา: สูง-ต่ำ</option></select>
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-2 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shrink-0"><option value="All">หมวดหมู่: ทั้งหมด</option><option value="General">ทั่วไป</option><option value="Single">การ์ดเดี่ยว</option><option value="Bulk">ยกกอง / Box</option><option value="Deck">เด็ค</option><option value="Accessories">อุปกรณ์เสริม</option></select>
                </div>
                <button onClick={() => { if(!userProfile) return alert("กรุณา Login ก่อนลงขาย"); setIsCreateModalOpen(true); }} className="w-full md:w-auto flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-emerald-500/30 transition-all active:scale-95 whitespace-nowrap justify-center shrink-0"><PlusIcon /> ลงขายสินค้า</button>
            </div>
        </div>

        {loading && <div className="text-center py-20 text-slate-500 animate-pulse">กำลังโหลดตลาด...</div>}
        {!loading && filteredItems.length === 0 && <div className="text-center py-20 text-slate-500">ไม่พบสินค้าตามเงื่อนไข</div>}

        {/* 🟢 Grid Items (ปรับสไตล์ให้เหมือน AuctionMarket หน้าจัดการ) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
            {filteredItems.map(item => {
                const isOwner = userProfile?.email === item.seller_email;
                return (
                    <div 
                        key={item.id} 
                        className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-emerald-500/20 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col" 
                        onClick={() => onChat(prepareChatData(item))}
                    >
                        {/* Image Section (Aspect 4:5 like Auctions) */}
                        <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800/50 relative p-1 md:p-6 flex items-center justify-center overflow-hidden">
                            <img 
                                src={getThumbnail(item)} 
                                className="w-full h-full object-cover drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" 
                                loading="lazy" 
                            />
                            
                            {/* Condition Tag */}
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md font-bold border border-white/10 z-10">
                                {item.condition}
                            </div>

                            {/* Escrow Tag */}
                            {item.is_escrow && (
                                <div className="absolute top-2 left-2 bg-blue-600 text-white p-1 rounded-full shadow-md z-20" title="ระบบ Escrow คุ้มครอง">
                                    <ShieldCheckIcon width="16" height="16" />
                                </div>
                            )}

                            {/* ปุ่มลบ (แสดงเฉพาะเจ้าของ) */}
                            {isOwner && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item); }} 
                                    className="absolute bottom-2 left-2 p-1.5 bg-red-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-20 scale-90"
                                    title="ลบสินค้า"
                                >
                                    <TrashIcon width="14" height="14"/>
                                </button>
                            )}
                        </div>
                        
                        {/* Details Section */}
                        <div className="p-2 md:p-3 flex flex-col flex-grow gap-1">
                            <h3 className="font-bold text-xs md:text-sm text-slate-900 dark:text-white truncate line-clamp-1 mb-auto">
                                {item.title}
                            </h3>
                            
                            {/* Categories Tags */}
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                                <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600 whitespace-nowrap">
                                    {item.category}
                                </span>
                                {item.is_escrow && (
                                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded flex items-center gap-0.5 font-bold whitespace-nowrap">
                                        <ShieldCheckIcon width="10" height="10" /> Escrow
                                    </span>
                                )}
                            </div>

                            {/* Price & Actions Box */}
                            <div className="mt-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                                <div>
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wide leading-none">ราคา</p>
                                    <p className="text-base md:text-lg font-black text-emerald-600 dark:text-emerald-400 truncate leading-tight">
                                        ฿{item.price.toLocaleString()}
                                    </p>
                                </div>
                                
                                <div className="flex gap-1.5 h-8">
                                    {/* ✅ ปุ่มซื้อ (แสดงทั้ง Escrow และ Non-Escrow) */}
                                    {item.status === 'active' && (
                                        <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                if(!userProfile) return alert("กรุณา Login ก่อนซื้อ");
                                                if(userProfile.email === item.seller_email) return alert("ซื้อของตัวเองไม่ได้");
                                                onBuy(item); 
                                            }}
                                            className={`flex-1 px-2 rounded-md shadow-sm font-bold text-[10px] md:text-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
                                                item.is_escrow 
                                                ? 'bg-emerald-600 text-white hover:bg-emerald-500' // สีเขียว (Escrow)
                                                : 'bg-amber-500 text-white hover:bg-amber-400'     // สีส้ม (Non-Escrow)
                                            }`}
                                            title={item.is_escrow ? "ซื้อผ่านระบบ Escrow" : "สนใจซื้อ (ตกลงกับผู้ขาย)"}
                                        >
                                            <ShoppingBagIcon width="14" height="14"/> 
                                            <span className="truncate">{item.is_escrow ? "ซื้อเลย" : "สนใจซื้อ"}</span>
                                        </button>
                                    )}

                                    {/* ปุ่มแชท */}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!userProfile) return alert("กรุณา Login ก่อนทักแชท");
                                            onChat(prepareChatData(item)); 
                                        }}
                                        className={`px-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-100 dark:border-blue-800 flex items-center justify-center ${item.status !== 'active' ? 'w-full' : ''}`}
                                        title="ทักแชท"
                                    >
                                        <ChatBubbleIcon width="16" height="16" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Seller Name (Footer) */}
                        <div className="px-3 pb-2 flex items-center gap-1.5 justify-center opacity-60 border-t border-slate-100 dark:border-slate-800/50 pt-1">
                             {item.seller_avatar ? <img src={item.seller_avatar} className="w-4 h-4 rounded-full object-cover border border-slate-200 dark:border-slate-600" /> : <div className="w-4 h-4 rounded-full bg-slate-300"></div>}
                             <span className="text-[9px] text-slate-500 truncate">{item.seller_name}</span>
                        </div>
                    </div>
                );
            })}
        </div>

        <CreateMarketListingModal 
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            userProfile={userProfile}
        />
    </div>
  );
}