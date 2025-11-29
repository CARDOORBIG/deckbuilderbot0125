import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { 
    ChatBubbleIcon, TrashIcon, StoreIcon, PackageIcon, 
    FilterIcon, SearchIcon, PlusIcon
} from './components/Icons';
import CreateMarketListingModal from './CreateMarketListingModal';

export default function FleaMarket({ userProfile, onChat }) {
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

  const handleDelete = async (item) => {
      if (!confirm("ต้องการลบสินค้านี้ใช่หรือไม่?")) return;
      if (item.images) {
          try {
              const urls = JSON.parse(item.images);
              const paths = urls.map(u => { const p = u.split('/auction-images/'); return p[1] ? decodeURIComponent(p[1]) : null; }).filter(Boolean);
              if (paths.length > 0) await supabase.storage.from('auction-images').remove(paths);
          } catch(e) { console.error(e); }
      }
      const { error } = await supabase.from('market_listings').delete().eq('id', item.id);
      if (error) alert("ลบไม่สำเร็จ: " + error.message);
      else fetchMarketItems();
  };

  // Logic การกรองและเรียงลำดับ
  const filteredItems = useMemo(() => {
      return marketItems.filter(item => {
          const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = filterCategory === "All" || item.category === filterCategory;
          return matchesSearch && matchesCategory;
      }).sort((a, b) => {
          if (sortOption === "price_asc") return a.price - b.price;
          if (sortOption === "price_desc") return b.price - a.price;
          return new Date(b.created_at) - new Date(a.created_at); // newest
      });
  }, [marketItems, searchTerm, sortOption, filterCategory]);

  // 🟢 Helper สำหรับเตรียมข้อมูลส่งให้ Chat Modal (ใช้ซ้ำได้ทั้งกดรูปและกดปุ่ม)
  const prepareChatData = (item) => {
    return {
        ...item,
        card_name: item.title,          // แปลง title -> card_name
        card_id: `MARKET-${item.id}`,   // สร้าง ID ปลอมเพื่อไม่ให้ซ้ำกับ Auction
        seller_email: item.seller_email,
        seller_name: item.seller_name,
        card_image_path: 'CUSTOM_ITEM', // Flag บอกว่าเป็นสินค้า Custom
        proof_image: item.images,       // ส่งรูปไปโชว์
        // ⚠️ สำคัญ: ต้องส่ง 2 ค่านี้ไปด้วย ไม่งั้น Modal จะพัง (เพราะ Modal ประมูลต้องใช้คำนวณ)
        end_time: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), // Fake เวลาให้ยังไม่จบง่ายๆ
        current_price: item.price,
        min_bid_increment: 0 // ตลาดนัดไม่มีบิดขั้นต่ำ
    };
  };

  return (
    <div className="animate-fade-in w-full md:px-8 pb-20">
        
        {/* Header & Filter Bar */}
        <div className="mt-4 mb-6 flex flex-col gap-2 bg-white dark:bg-slate-900/50 p-2 md:p-3 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-sm mx-4 md:mx-0">
            
            <div className="relative flex-grow w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <SearchIcon />
                </div>
                <input 
                    type="text" 
                    placeholder="ค้นหาสินค้าในตลาด..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-9 pr-4 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all" 
                />
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:items-center shrink-0">
                <div className="flex gap-2 items-center overflow-x-auto pb-1 md:pb-0 no-scrollbar shrink-0">
                    <select 
                        value={sortOption} 
                        onChange={(e) => setSortOption(e.target.value)} 
                        className="px-2 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shrink-0"
                    >
                        <option value="newest" className="text-white">ล่าสุด</option>
                        <option value="price_asc" className="text-white">ราคาต่ำ ➜ สูง</option>
                        <option value="price_desc" className="text-white">ราคาสูง ➜ ต่ำ</option>
                    </select>

                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)} 
                        className="px-2 py-1.5 md:py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shrink-0"
                    >
                        <option value="All" className="text-white">หมวดหมู่: ทั้งหมด</option>
                        <option value="Single" className="text-white">การ์ดเดี่ยว</option>
                        <option value="Bulk" className="text-white">ยกกอง / Box</option>
                        <option value="Deck" className="text-white">เด็ค</option>
                        <option value="Accessories" className="text-white">อุปกรณ์เสริม</option>
                        <option value="General" className="text-white">ทั่วไป</option>
                    </select>
                </div>

                <button 
                    onClick={() => setIsCreateModalOpen(true)} 
                    className="w-full md:w-auto flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-emerald-500/30 transition-all active:scale-95 whitespace-nowrap justify-center shrink-0 md:ml-auto"
                >
                    <span className="text-lg leading-none mb-0.5">+</span> ลงขายสินค้า
                </button>
            </div>
        </div>

        {loading && <div className="text-center py-20 text-slate-500 animate-pulse">กำลังโหลดตลาด...</div>}

        {!loading && filteredItems.length === 0 && (
            <div className="text-center py-20 text-slate-500 flex flex-col items-center gap-3">
                <div className="text-slate-300 dark:text-slate-700 p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <PackageIcon /> 
                </div>
                <p>ไม่พบสินค้าตามเงื่อนไข</p>
            </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map(item => {
                let coverImage = 'https://placehold.co/400x400?text=No+Image';
                try {
                    const imgs = JSON.parse(item.images);
                    if (imgs && imgs.length > 0) coverImage = imgs[0];
                } catch {}

                const isOwner = userProfile?.email === item.seller_email;

                return (
                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all group cursor-pointer relative flex flex-col h-full">
                        
                        {/* Image - 🟢 แก้ไข onClick ให้ส่งข้อมูลครบถ้วน */}
                        <div className="aspect-[4/5] bg-slate-200 dark:bg-slate-800/50 relative overflow-hidden flex items-center justify-center" 
                             onClick={() => onChat(prepareChatData(item))}
                        >
                             <img src={coverImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             
                             <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md font-bold border border-white/10 z-10">
                                {item.condition}
                             </div>
                             
                             {isOwner && (
                                 <button onClick={(e) => { e.stopPropagation(); handleDelete(item); }} className="absolute top-2 left-2 p-1.5 bg-red-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-10"><TrashIcon width="14" height="14"/></button>
                             )}
                        </div>

                        {/* Details */}
                        <div className="p-3 flex flex-col flex-grow gap-1">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate line-clamp-1 mb-auto">{item.title}</h3>
                            
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600">
                                    {item.category}
                                </span>
                            </div>

                            <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <div>
                                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wide">Price</p>
                                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">฿{item.price.toLocaleString()}</p>
                                </div>
                                {/* Button - 🟢 แก้ไข onClick ให้ส่งข้อมูลครบถ้วน */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!userProfile) return alert("กรุณา Login ก่อนทักแชท");
                                        onChat(prepareChatData(item)); 
                                    }}
                                    className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-100 dark:border-blue-800"
                                >
                                    <ChatBubbleIcon />
                                </button>
                            </div>
                        </div>
                        
                        {/* Seller */}
                        <div className="px-3 pb-2 flex items-center gap-2 pt-0 opacity-70">
                             {item.seller_avatar ? <img src={item.seller_avatar} className="w-4 h-4 rounded-full object-cover border border-slate-200 dark:border-slate-600" /> : <div className="w-4 h-4 rounded-full bg-slate-300"></div>}
                             <span className="text-[10px] text-slate-500 truncate">{item.seller_name}</span>
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