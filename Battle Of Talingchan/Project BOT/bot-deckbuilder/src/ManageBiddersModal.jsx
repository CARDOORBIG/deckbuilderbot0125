import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

export default function ManageBiddersModal({ isOpen, onClose, auction, userProfile }) {
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && auction) fetchBidders();
  }, [isOpen, auction]);

  const fetchBidders = async () => {
    setLoading(true);
    // 1. ดึงประวัติการบิดทั้งหมด
    const { data: bids } = await supabase
      .from('bids')
      .select('bidder_email, bidder_name')
      .eq('auction_id', auction.id);

    // 2. ดึงรายชื่อคนโดนแบน
    const { data: bans } = await supabase
      .from('auction_bans')
      .select('user_email')
      .eq('auction_id', auction.id);

    const bannedEmails = new Set(bans?.map(b => b.user_email));

    // 3. รวมกลุ่ม (Distinct)
    const uniqueBidders = [];
    const seen = new Set();
    bids?.forEach(b => {
      if (!seen.has(b.bidder_email)) {
        seen.add(b.bidder_email);
        uniqueBidders.push({
          ...b,
          isBanned: bannedEmails.has(b.bidder_email)
        });
      }
    });

    setBidders(uniqueBidders);
    setLoading(false);
  };

  const handleBan = async (targetEmail, targetName) => {
    if (!confirm(`ต้องการระงับสิทธิ์คุณ "${targetName}" จากประมูลนี้?\n(หากเขานำอยู่ ราคาจะถูกดีดกลับไปหาคนก่อนหน้า)`)) return;

    const { data, error } = await supabase.rpc('ban_bidder_from_auction', {
        p_auction_id: auction.id,
        p_owner_email: userProfile.email,
        p_target_email: targetEmail
    });

    if (error) alert("Error: " + error.message);
    else {
        alert(data.message);
        fetchBidders(); // รีโหลดหน้าจอ
    }
  };

  if (!isOpen || !auction) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[800] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-red-500/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldIcon /> จัดการผู้บิด (Ban Hammer)
            </h3>
            <button onClick={onClose}>✕</button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
            <p className="text-xs text-slate-500 mb-4">รายชื่อคนที่เคยบิดรายการนี้ (กดแบนเพื่อตัดสิทธิ์จนจบประมูล)</p>
            
            {loading ? <p className="text-center">กำลังโหลด...</p> : bidders.length === 0 ? (
                <p className="text-center text-slate-400">ยังไม่มีใครบิดรายการนี้</p>
            ) : (
                <div className="space-y-2">
                    {bidders.map((user) => (
                        <div key={user.bidder_email} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div>
                                <p className="font-bold text-sm text-slate-900 dark:text-white">{user.bidder_name}</p>
                                <p className="text-[10px] text-slate-500">{user.bidder_email}</p>
                            </div>
                            {user.isBanned ? (
                                <span className="text-xs text-red-500 font-bold border border-red-500 px-2 py-1 rounded bg-red-500/10">โดนแบนแล้ว</span>
                            ) : (
                                <button 
                                    onClick={() => handleBan(user.bidder_email, user.bidder_name)}
                                    className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded text-xs font-bold transition-colors"
                                >
                                    ระงับสิทธิ์ 🔨
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}