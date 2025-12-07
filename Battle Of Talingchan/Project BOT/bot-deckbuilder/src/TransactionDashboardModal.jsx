import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from "react-dom";
import { supabase } from './supabaseClient';
import { 
    CloseIcon, ChatBubbleIcon, SendIcon 
    // ❌ ลบ BoxIcon, TruckIcon, CreditCardIcon, CameraIcon ออกจาก import
    // เพราะเราจะสร้างไว้ข้างล่างนี้แทนครับ
} from './components/Icons';

// ==========================================
// 🟢 สร้างไอคอนที่ขาดหายไป (Local Icons)
// ==========================================
const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const CheckCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const Clock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

// ==========================================
// 🟢 Main Component
// ==========================================
export default function TransactionDashboardModal({ isOpen, onClose, auction, userProfile, fetchReputations }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [status, setStatus] = useState(auction?.transaction_status || 'pending_payment');
    const [trackingNo, setTrackingNo] = useState(auction?.tracking_number || "");
    const [carrier, setCarrier] = useState(auction?.carrier_name || "");
    const chatEndRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // Rating State
    const [hasRated, setHasRated] = useState(false);
    const [isRating, setIsRating] = useState(false);

    const isBuyer = userProfile?.email === auction?.winner_email;
    const isSeller = userProfile?.email === auction?.seller_email;
    const targetName = isBuyer ? auction?.seller_name : auction?.winner_name;

    useEffect(() => {
        if (isOpen && auction) {
            // Load Chat History
            const fetchMessages = async () => {
                const { data } = await supabase.from('auction_comments').select('*').eq('auction_id', auction.id).order('created_at', { ascending: true });
                setMessages(data || []); 
                scrollToBottom();
            };
            fetchMessages();

            // Realtime Updates
            const channel = supabase.channel(`tx_chat:${auction.id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'auction_comments', filter: `auction_id=eq.${auction.id}` }, (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                    scrollToBottom();
                })
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'auctions', filter: `id=eq.${auction.id}` }, (payload) => {
                    if (payload.new.transaction_status) setStatus(payload.new.transaction_status);
                    if (payload.new.tracking_number) setTrackingNo(payload.new.tracking_number);
                    if (payload.new.carrier_name) setCarrier(payload.new.carrier_name);
                })
                .subscribe();

            return () => supabase.removeChannel(channel);
        }
    }, [isOpen, auction]);

    const scrollToBottom = () => { setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100); };

    const handleSendMessage = async (e) => { 
        e.preventDefault(); 
        if (!newMessage.trim()) return; 
        
        await supabase.from('auction_comments').insert({ 
            auction_id: auction.id, 
            user_email: userProfile.email, 
            user_name: userProfile.name, 
            user_picture: userProfile.picture, 
            message: newMessage.trim() 
        }); 
        setNewMessage(""); 
    };

    const sendSystemMessage = async (text) => {
        await supabase.from('auction_comments').insert({ 
            auction_id: auction.id, 
            user_email: 'SYSTEM', 
            user_name: 'System', 
            user_picture: 'https://cdn-icons-png.flaticon.com/512/10337/10337093.png', 
            message: text 
        });
    };

    // 1. Buyer: Notify Payment
    const handlePaymentNotify = async () => {
        if(!confirm("ยืนยันการแจ้งโอนเงิน? (ระบบจะจำลองการอัปโหลดสลิป)")) return;
        
        setIsUploading(true);
        // Simulate upload delay
        setTimeout(async () => {
            // In a real app, upload image to Supabase Storage here and get URL
            const fakeSlipUrl = 'https://via.placeholder.com/150'; 
            
            const { error } = await supabase.from('auctions').update({ 
                transaction_status: 'to_ship', 
                payment_slip_url: fakeSlipUrl 
            }).eq('id', auction.id);

            if (error) {
                alert("Error updating status: " + error.message);
            } else {
                await sendSystemMessage(`💸 ผู้ซื้อแจ้งโอนเงินแล้ว (รอตรวจสอบ)`);
            }
            setIsUploading(false);
        }, 1500);
    };

    // 2. Seller: Ship Item
    const handleShipItem = async () => {
        if(!trackingNo.trim()) return alert("กรุณากรอกเลขพัสดุ");
        if(!carrier.trim()) return alert("กรุณากรอกชื่อขนส่ง");

        const { data, error } = await supabase.rpc('submit_shipping', {
            p_auction_id: auction.id,
            p_tracking: trackingNo,
            p_courier: carrier,
            p_date: new Date().toISOString(),
            p_proof: 'manual_entry'
        });

        if (error) {
            alert("Error: " + error.message);
        } else {
            await sendSystemMessage(`📦 ผู้ขายจัดส่งแล้ว: ${carrier} [${trackingNo}]`);
        }
    };

    // 3. Buyer: Receive Item & Complete
    const handleComplete = async () => {
        if(!confirm("คุณได้รับสินค้าเรียบร้อยแล้วใช่หรือไม่?")) return;
        
        const { error } = await supabase.from('auctions').update({ transaction_status: 'completed' }).eq('id', auction.id);
        
        if (error) {
             alert("Error: " + error.message);
        } else {
             await sendSystemMessage(`✅ ผู้ซื้อได้รับสินค้าแล้ว! การซื้อขายเสร็จสมบูรณ์ 🎉`);
             setStatus('completed'); // Force local update
        }
    };

    // 4. Rate User
    const handleRateUser = async (score) => {
        if (!confirm(`ยืนยันให้คะแนน ${score > 0 ? '+1 (เครดิตดี)' : '-1 (เครดิตเสีย)'} แก่คุณ ${targetName}?`)) return;
        
        setIsRating(true);
        const targetEmail = isBuyer ? auction.seller_email : auction.winner_email;
        
        const { data, error } = await supabase.rpc('submit_reputation', {
            p_auction_id: auction.id,
            p_reporter_email: userProfile.email,
            p_target_email: targetEmail,
            p_score_change: score,
            p_reason_code: score > 0 ? 'transaction_success' : 'bad_service'
        });

        setIsRating(false);

        if (error) {
            alert("Error: " + error.message);
        } else {
            setHasRated(true);
            await sendSystemMessage(`⭐ ${userProfile.name} ได้ให้คะแนนคู่ค้า ${score > 0 ? '+1' : '-1'} แต้ม`);
            if (fetchReputations) fetchReputations(); 
        }
    };

    if (!isOpen || !auction) return null;

    const steps = [
        { id: 'pending_payment', label: 'รอชำระเงิน', icon: <CreditCardIcon/> },
        { id: 'to_ship', label: 'ที่ต้องจัดส่ง', icon: <BoxIcon/> },
        { id: 'to_receive', label: 'รอรับของ', icon: <TruckIcon/> },
        { id: 'completed', label: 'สำเร็จ', icon: <CheckCircle/> }
    ];
    const currentStepIdx = steps.findIndex(s => s.id === status);

    return createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[900] p-0 md:p-6" onClick={onClose}>
            <div className="bg-slate-100 dark:bg-slate-900 w-full h-full md:max-w-5xl md:h-[85vh] md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-700" onClick={e => e.stopPropagation()}>
                
                {/* Left Panel: Status & Actions */}
                <div className="w-full md:w-2/5 bg-white dark:bg-slate-800 flex flex-col border-r border-slate-200 dark:border-slate-700">
                    <div className="md:hidden p-4 bg-slate-900 text-white flex justify-between items-center">
                        <h3 className="font-bold">ห้องปิดดีล</h3><button onClick={onClose}><CloseIcon/></button>
                    </div>

                    {/* Timeline */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between relative z-10">
                            {steps.map((step, idx) => (
                                <div key={step.id} className="flex flex-col items-center gap-2 relative group">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 z-20 ${idx <= currentStepIdx ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'}`}>{step.icon}</div>
                                    <span className={`text-[10px] font-bold ${idx <= currentStepIdx ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>{step.label}</span>
                                    {idx < steps.length - 1 && <div className={`absolute top-5 left-1/2 w-full h-1 -z-10 ${idx < currentStepIdx ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="p-6 flex-grow overflow-y-auto space-y-6">
                         {/* Card Info Summary */}
                         <div className="flex gap-4 mb-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                             {/* 🟢 แก้ไข: ใช้ img จริงถ้ามี */}
                             <div className="w-16 h-20 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden shrink-0 flex items-center justify-center">
                                 <span className="text-[10px] text-slate-400">Card</span>
                             </div>
                             <div>
                                 <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{auction.card_name}</h4>
                                 <p className="text-xs text-slate-500 mt-1">ราคาจบ: <span className="text-emerald-500 font-bold">฿{auction.current_price.toLocaleString()}</span></p>
                             </div>
                         </div>

                        <div className="bg-slate-100 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2"><span className="text-xl">⚡</span> สถานะปัจจุบัน</h4>

                            {status === 'pending_payment' && (
                                isBuyer ? (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded border border-dashed border-slate-400 text-center">
                                            <p className="font-mono text-lg font-bold select-all">PromptPay / Bank Info</p>
                                            <p className="text-xs text-slate-400">กรุณาขอเลขบัญชีในแชท</p>
                                        </div>
                                        <button onClick={handlePaymentNotify} disabled={isUploading} className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500">{isUploading ? 'กำลังอัปโหลด...' : '📸 แจ้งโอนเงิน / แนบสลิป'}</button>
                                    </div>
                                ) : <div className="text-center text-slate-500 py-4"><Clock className="w-8 h-8 mx-auto mb-2 opacity-50"/><p>รอผู้ซื้อชำระเงิน...</p></div>
                            )}

                            {status === 'to_ship' && (
                                isSeller ? (
                                    <div className="space-y-3">
                                        <p className="text-sm text-emerald-600 font-bold">💰 ผู้ซื้อแจ้งโอนเงินแล้ว</p>
                                        <input type="text" placeholder="ชื่อขนส่ง (เช่น Flash, Kerry)" className="w-full p-2 rounded border bg-white dark:bg-slate-900 dark:text-white dark:border-slate-600" value={carrier} onChange={e=>setCarrier(e.target.value)} />
                                        <input type="text" placeholder="เลขพัสดุ (Tracking No.)" className="w-full p-2 rounded border bg-white dark:bg-slate-900 dark:text-white dark:border-slate-600 font-mono" value={trackingNo} onChange={e=>setTrackingNo(e.target.value)} />
                                        <button onClick={handleShipItem} className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500">🚚 แจ้งส่งของ</button>
                                    </div>
                                ) : <div className="text-center text-slate-500 py-4"><p className="font-bold text-emerald-500">แจ้งโอนเงินแล้ว!</p><p className="text-sm mt-1">รอผู้ขายตรวจสอบและจัดส่ง...</p></div>
                            )}

                            {status === 'to_receive' && (
                                <div className="space-y-3">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                        <p className="text-xs text-blue-500 uppercase font-bold">Tracking Number</p>
                                        <p className="font-mono text-lg font-bold text-slate-800 dark:text-white select-all">{trackingNo || '-'}</p>
                                        <p className="text-xs text-slate-500">{carrier}</p>
                                    </div>
                                    {isBuyer ? (
                                        <button onClick={handleComplete} className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 shadow-lg animate-pulse">🎁 ได้รับสินค้าแล้ว</button>
                                    ) : (
                                        <p className="text-center text-sm text-slate-500">รอผู้ซื้อยืนยันรับสินค้า...</p>
                                    )}
                                </div>
                            )}

                            {status === 'completed' && (
                                <div className="text-center py-4">
                                    <div className="inline-block p-2 bg-emerald-100 rounded-full mb-2"><CheckCircle className="w-8 h-8 text-emerald-600"/></div>
                                    <h3 className="font-bold text-lg text-emerald-500">ซื้อขายสำเร็จ!</h3>
                                    
                                    {/* Rating Section */}
                                    {!hasRated ? (
                                        <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">ให้คะแนนคุณ <span className="font-bold">{targetName}</span></p>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleRateUser(1)} disabled={isRating} className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow transition-transform active:scale-95 flex flex-col items-center gap-1">
                                                    <span className="text-lg">👍</span> เครดิตดี (+1)
                                                </button>
                                                <button onClick={() => handleRateUser(-1)} disabled={isRating} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold shadow transition-transform active:scale-95 flex flex-col items-center gap-1">
                                                    <span className="text-lg">👎</span> แย่มาก (-1)
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4 p-2 bg-slate-200 dark:bg-slate-800 rounded text-xs text-slate-500">
                                            ✅ คุณให้คะแนนเรียบร้อยแล้ว
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Chat */}
                <div className="w-full md:w-3/5 flex flex-col bg-slate-50 dark:bg-slate-900 h-[50vh] md:h-auto border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-3"><h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><ChatBubbleIcon/> Live Chat</h3></div>
                        <button onClick={onClose} className="hidden md:block hover:bg-slate-200 p-2 rounded-full"><CloseIcon/></button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                        {messages.length === 0 && <div className="text-center text-slate-400 mt-10">เริ่มพูดคุยเพื่อตกลงการซื้อขาย...</div>}
                        {messages.map((msg, i) => {
                            const isSystem = msg.user_email === 'SYSTEM';
                            const isMe = msg.user_email === userProfile?.email;
                            if (isSystem) return <div key={i} className="flex justify-center my-2"><div className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm"><span>🔔</span> {msg.message}</div></div>;
                            return <div key={i} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}><img src={msg.user_picture} className="w-8 h-8 rounded-full object-cover border border-slate-300 shadow-sm" /><div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm shadow-sm ${isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'}`}><p className="font-bold text-[10px] opacity-70 mb-0.5">{msg.user_name}</p><p>{msg.message}</p></div></div>;
                        })}
                        <div ref={chatEndRef}></div>
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                        <button type="button" className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><CameraIcon/></button>
                        <input type="text" value={newMessage} onChange={e=>setNewMessage(e.target.value)} placeholder="พิมพ์ข้อความ..." className="flex-grow bg-slate-100 dark:bg-slate-700 border-none rounded-full px-4 text-sm focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white" />
                        <button type="submit" className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 shadow-lg"><SendIcon/></button>
                    </form>
                </div>
            </div>
        </div>, document.body
    );
}