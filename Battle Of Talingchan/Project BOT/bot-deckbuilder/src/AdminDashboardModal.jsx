import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function AdminDashboardModal({ isOpen, onClose, adminEmail }) {
  const [activeTab, setActiveTab] = useState('announce'); // announce | manage | cleanup
  
  // State ประกาศ
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  
  // State จัดการคน
  const [targetEmail, setTargetEmail] = useState('');
  const [banHours, setBanHours] = useState(3);
  
  // State ล้างข้อมูล
  const [auctionId, setAuctionId] = useState('');
  const [wipeEmail, setWipeEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || adminEmail !== 'koritros619@gmail.com') return null;

  // ฟังก์ชันกลางสำหรับเรียก RPC
  const callAdminRpc = async (rpcName, params) => {
    setIsProcessing(true);
    const { data, error } = await supabase.rpc(rpcName, params);
    setIsProcessing(false);
    
    if(error) alert("Error: " + error.message);
    else alert(data.message);
    return !error;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[999] p-4">
      <div className="bg-slate-900 border-2 border-red-600 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-900/50 to-slate-900 border-b border-red-500/30 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                👑 ADMIN DASHBOARD
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 shrink-0 overflow-x-auto">
            <button onClick={()=>setActiveTab('announce')} className={`flex-1 py-3 px-4 font-bold whitespace-nowrap transition-colors ${activeTab==='announce' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>📢 ประกาศ</button>
            <button onClick={()=>setActiveTab('manage')} className={`flex-1 py-3 px-4 font-bold whitespace-nowrap transition-colors ${activeTab==='manage' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>🔨 จัดการคน</button>
            <button onClick={()=>setActiveTab('cleanup')} className={`flex-1 py-3 px-4 font-bold whitespace-nowrap transition-colors ${activeTab==='cleanup' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>💀 ล้างข้อมูล</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
            
            {/* Tab 1: Broadcast */}
            {activeTab === 'announce' && (
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">หัวข้อประกาศ</label>
                        <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-red-500 outline-none" placeholder="เช่น แจ้งปิดปรับปรุง..." />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">เนื้อหา</label>
                        <textarea value={message} onChange={e=>setMessage(e.target.value)} rows="5" className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-red-500 outline-none resize-none" />
                    </div>
                    <button 
                        onClick={() => callAdminRpc('admin_broadcast', { p_admin_email: adminEmail, p_title: title, p_message: message })}
                        disabled={isProcessing}
                        className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:brightness-110 disabled:opacity-50"
                    >
                        {isProcessing ? 'Sending...' : '🚀 ส่งประกาศ (Broadcast)'}
                    </button>
                </div>
            )}

            {/* Tab 2: Manage Users */}
            {activeTab === 'manage' && (
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">อีเมลเป้าหมาย</label>
                        <input value={targetEmail} onChange={e=>setTargetEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-red-500 outline-none" placeholder="user@example.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-red-950/30 rounded-xl border border-red-900/50">
                            <h4 className="text-red-400 font-bold text-sm mb-2">⛔ แบน (Cooldown)</h4>
                            <div className="flex gap-2 mb-2">
                                <input type="number" value={banHours} onChange={e=>setBanHours(e.target.value)} className="w-16 bg-slate-900 border border-red-900 rounded p-1 text-center text-white" />
                                <span className="text-slate-400 self-center text-xs">ชม.</span>
                            </div>
                            <button onClick={() => callAdminRpc('admin_manage_user', { p_admin_email: adminEmail, p_target_email: targetEmail, p_action: 'ban', p_hours: parseInt(banHours) })} className="w-full py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500">แบน</button>
                        </div>
                        <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/50 flex flex-col justify-between">
                            <h4 className="text-emerald-400 font-bold text-sm">😇 ปลดโทษ</h4>
                            <button onClick={() => callAdminRpc('admin_manage_user', { p_admin_email: adminEmail, p_target_email: targetEmail, p_action: 'reset' })} className="w-full py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-500">รีเซ็ต</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 3: Cleanup (ใหม่!) */}
            {activeTab === 'cleanup' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
                        <h4 className="text-white font-bold flex items-center gap-2">🗑️ ลบการประมูล (รายตัว)</h4>
                        <input value={auctionId} onChange={e=>setAuctionId(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white" placeholder="Auction ID (UUID)" />
                        <button 
                            onClick={() => {
                                if(confirm("⚠️ ยืนยันลบการประมูลนี้ถาวร?")) 
                                callAdminRpc('admin_force_delete', { p_admin_email: adminEmail, p_target_input: auctionId, p_action_type: 'delete_auction' });
                            }}
                            className="w-full py-2 bg-slate-700 hover:bg-red-600 text-white text-sm rounded transition-colors"
                        >
                            ลบการประมูลนี้
                        </button>
                    </div>

                    <div className="p-4 bg-red-950/20 rounded-xl border border-red-900/50 space-y-3">
                        <h4 className="text-red-400 font-bold flex items-center gap-2">☢️ ล้างบาง User (Nuclear)</h4>
                        <input value={wipeEmail} onChange={e=>setWipeEmail(e.target.value)} className="w-full bg-slate-900 border border-red-900 rounded p-2 text-sm text-white" placeholder="user@badguy.com" />
                        <button 
                            onClick={() => {
                                if(confirm("🔥 คำเตือน: ข้อมูลทุกอย่างของ User นี้จะหายเกลี้ยง!\nยืนยันทำลายล้าง?")) 
                                callAdminRpc('admin_force_delete', { p_admin_email: adminEmail, p_target_input: wipeEmail, p_action_type: 'wipe_user' });
                            }}
                            className="w-full py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded transition-colors font-bold"
                        >
                            ลบทุกอย่างของคนนี้
                        </button>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                        <button 
                            onClick={() => {
                                if(confirm("ยืนยันลบประวัติเก่าที่จบไปแล้วเกิน 30 วัน?")) 
                                callAdminRpc('admin_force_delete', { p_admin_email: adminEmail, p_target_input: '', p_action_type: 'clear_old' });
                            }}
                            className="w-full py-3 border border-slate-600 text-slate-400 hover:bg-slate-800 hover:text-white rounded text-sm"
                        >
                            🧹 ล้างประวัติเก่า (30 วัน+)
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}