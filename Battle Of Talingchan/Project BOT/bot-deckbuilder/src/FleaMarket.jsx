import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { ShoppingBagIcon, ChatBubbleIcon, ShieldCheckIcon, HistoryIcon } from './components/Icons';
import UserBadge from './components/UserBadge'; // 🟢 Import

const LayoutGridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const LayoutFeedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>;

export default function FleaMarket({ userProfile, onChat, onBuy, viewMode = 'grid', setViewMode, onCreate }) {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("newest");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        const fetchItems = async () => {
            const { data, error } = await supabase.from('market_listings').select('*').eq('status', 'active').order('created_at', { ascending: false });
            if (!error && data) setItems(data);
        };
        fetchItems();
        const channel = supabase.channel('market_realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'market_listings' }, () => { fetchItems(); }).subscribe();
        return () => supabase.removeChannel(channel);
    }, []);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchName = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
            let matchStatus = true;
            if (filterStatus === 'escrow') matchStatus = item.is_escrow === true;
            if (filterStatus === 'direct') matchStatus = item.is_escrow === false;
            return matchName && matchStatus;
        }).sort((a, b) => {
            if (sortOption === 'price_asc') return a.price - b.price;
            if (sortOption === 'price_desc') return b.price - a.price;
            return new Date(b.created_at) - new Date(a.created_at);
        });
    }, [items, searchTerm, sortOption, filterStatus]);

    const getThumbnail = (item) => {
        try { const images = JSON.parse(item.images); return images[0] || 'https://placehold.co/300x420/1e293b/ffffff?text=No+Image'; } catch { return 'https://placehold.co/300x420/1e293b/ffffff?text=Error'; }
    };

    const handleChatClick = (item) => {
        const mappedItem = {
            ...item,
            id: item.id,
            card_name: item.title,
            current_price: item.price,
            buy_now_price: item.price,
            min_bid_increment: 0,
            type: 'market',
            card_image_path: 'CUSTOM_ITEM',
            proof_image: item.images,
            seller_email: item.seller_email,
            seller_name: item.seller_name,
            status: item.status
        };
        onChat(mappedItem);
    };

    return (
        <div className="animate-fade-in w-full md:px-8">
            <div className="mb-6 mx-4 md:mx-0 mt-4">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm flex flex-col gap-3">
                    <div className="flex gap-2 items-center w-full">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                            <input type="text" placeholder="ค้นหาสินค้า..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all" />
                        </div>
                        <button className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-500 rounded-xl transition-colors shrink-0" title="ประวัติการซื้อขาย"><HistoryIcon width="20" height="20" /></button>
                        {onCreate && (<button onClick={onCreate} className="hidden md:flex items-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap shrink-0"><span className="text-base leading-none">+</span> ลงขาย</button>)}
                    </div>
                    <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="relative shrink-0">
                                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="appearance-none pl-3 pr-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                                    <option value="newest">ล่าสุด</option>
                                    <option value="price_asc">ถูก➜แพง</option>
                                    <option value="price_desc">แพง➜ถูก</option>
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[8px]">▼</div>
                            </div>
                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 shrink-0">
                                <button onClick={() => setFilterStatus('all')} className={`px-2 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${filterStatus === 'all' ? 'bg-white dark:bg-slate-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>รวม</button>
                                <button onClick={() => setFilterStatus('escrow')} className={`px-2 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${filterStatus === 'escrow' ? 'bg-white dark:bg-slate-600 shadow text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>ผ่านกลาง</button>
                                <button onClick={() => setFilterStatus('direct')} className={`px-2 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${filterStatus === 'direct' ? 'bg-white dark:bg-slate-600 shadow text-amber-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>โอนตรง</button>
                            </div>
                        </div>
                        {setViewMode && (<div className="flex items-center gap-2 shrink-0"><div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1"><button onClick={() => setViewMode('feed')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'feed' ? 'bg-white dark:bg-slate-600 shadow text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`} title="Feed View"><LayoutFeedIcon /></button><button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`} title="Grid View"><LayoutGridIcon /></button></div></div>)}
                    </div>
                </div>
                {onCreate && (<button onClick={onCreate} className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg mt-2"><span className="text-lg leading-none">+</span> ลงขายสินค้า</button>)}
            </div>

            <div className={viewMode === 'feed' ? "flex flex-col gap-6 max-w-xl mx-auto" : "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6"}>
                {filteredItems.map(item => (
                    <div 
                        key={item.id} 
                        className="relative group cursor-pointer bg-white dark:bg-slate-900/70 backdrop-blur-sm p-2 md:p-3 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-lg transition-all hover:border-amber-400/50 hover:shadow-amber-500/10 flex flex-col h-full"
                        onClick={() => handleChatClick(item)}
                    >
                        <div className="aspect-[5/7] w-full rounded mb-2 overflow-hidden bg-slate-200 dark:bg-slate-800 relative shadow-inner">
                            <img src={getThumbnail(item)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" alt={item.title} />
                            {item.is_escrow && (<div className="absolute top-2 right-2 bg-gradient-to-br from-blue-500 to-blue-700 text-white p-2 rounded-full shadow-lg shadow-blue-500/40 border-[1.5px] border-white/50 z-10 transform scale-125" title="Escrow Protected"><ShieldCheckIcon width="20" height="20" className="drop-shadow-md" /></div>)}
                        </div>
                        <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 leading-tight">{item.title}</h3>
                        
                        {/* 🟢 แก้ไขส่วนแสดงผู้ขาย */}
                        <div className="flex justify-between items-end mb-4">
                            <div className="flex-1 overflow-hidden">
                                {item.seller_name && (
                                    <div className="scale-90 origin-bottom-left">
                                        <UserBadge 
                                            email={item.seller_email}
                                            name={item.seller_name}
                                            size="sm"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="text-right flex-shrink-0 pl-1"><p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-0.5">Price</p><p className="text-3xl md:text-4xl font-black text-emerald-500 dark:text-emerald-400 leading-none drop-shadow-sm tracking-tighter">฿{item.price.toLocaleString()}</p></div>
                        </div>

                        <div className="mt-auto flex gap-2">
                            {userProfile?.email !== item.seller_email && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onBuy(item); }} 
                                    className="btn-glossy flex-1 px-3 py-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white text-xs font-black shadow-lg shadow-pink-500/30 border-t border-white/20 flex items-center justify-center gap-1.5"
                                >
                                    <ShoppingBagIcon className="w-4 h-4 md:w-5 md:h-5 drop-shadow-sm" /><span>BUY NOW</span>
                                </button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); handleChatClick(item); }} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><ChatBubbleIcon /></button>
                        </div>
                    </div>
                ))}
            </div>
            {filteredItems.length === 0 && (<div className="text-center py-20 text-slate-400"><p>ยังไม่มีสินค้าวางขาย</p></div>)}
        </div>
    );
}