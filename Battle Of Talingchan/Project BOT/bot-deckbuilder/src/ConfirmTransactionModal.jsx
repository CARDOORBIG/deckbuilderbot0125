import React, { useState } from 'react'; 
import { supabase } from './supabaseClient';
import { createPortal } from 'react-dom';

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-yellow-400">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

const BigCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-emerald-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;

export default function ConfirmTransactionModal({ isOpen, onClose, auction, userProfile, fetchReputations }) {
    const [action, setAction] = useState('good');
    const [reason, setReason] = useState('transaction_success');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFinalConfirm, setShowFinalConfirm] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); 

    if (!isOpen || !auction || !userProfile) return null;
    const isSeller = userProfile.email === auction.seller_email;
    const targetEmail = isSeller ? auction.winner_email : auction.seller_email;
    const targetName = isSeller ? auction.winner_name : auction.seller_name;
    
    // 🟢 เช็คว่าต้องโชว์ Modal ยืนยันการโอนเงินไหม (เฉพาะ Escrow เท่านั้น)
    const handlePreSubmit = () => {
        const score = action === 'good' ? 1 : -1;
        if (score === -1) {
            if (!confirm(`⚠️ ยืนยันหักเครดิตคุณ ${targetName} ใช่หรือไม่?`)) return;
            submitReputation();
        } else {
            // ถ้าเป็น Escrow ให้ขึ้นเตือนเรื่องเงิน
            if (auction.is_escrow) { 
                setShowFinalConfirm(true); 
            } else { 
                // ถ้าเป็น Non-Escrow บันทึกได้เลย
                submitReputation(); 
            }
        }
    };

    const submitReputation = async () => {
        const score = action === 'good' ? 1 : -1;
        setIsSubmitting(true);
        setShowFinalConfirm(false); 
        
        // เรียก RPC เดิม (มันจะเปลี่ยนสถานะเป็น Completed ให้อัตโนมัติใน DB ถ้าเราเขียนไว้ หรือแค่บันทึก Log)
        // **แนะนำ** ให้ RPC submit_reputation ใน DB มีบรรทัด update status = 'completed' ด้วย
        const { data, error } = await supabase.rpc('submit_reputation', {
            p_auction_id: auction.id, p_reporter_email: userProfile.email, p_target_email: targetEmail,
            p_score_change: score, p_reason_code: reason
        });

        if (error) { alert("Error: " + error.message); setIsSubmitting(false); }
        else { 
            if (targetEmail) {
                 await supabase.from('notifications').insert({
                    user_email: targetEmail, 
                    type: 'transaction_complete',
                    title: '✅ ปิดการขายสำเร็จ!',
                    message: `ผู้ซื้อยืนยันรับสินค้า "${auction.card_name}" แล้ว\nคุณได้รับเครดิต: ${score > 0 ? '+1' : '-1'}`,
                    auction_id: auction.id,
                    is_read: false
                });
            }

            setIsSuccess(true);
            fetchReputations(); 
            setTimeout(() => { setIsSuccess(false); onClose(); }, 2500);
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[850] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative" onClick={e => e.stopPropagation()}>
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center h-72 p-6 text-center animate-fade-in-up">
                        <div className="mb-6 animate-bounce"><BigCheckIcon /></div>
                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-2">ขอบคุณครับ!</h3>
                        <p className="text-slate-500 dark:text-slate-400">ธุรกรรมเสร็จสมบูรณ์</p>
                    </div>
                ) : (
                    <>
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">ยืนยันธุรกรรม: {auction.card_name}</h3>
                        <button onClick={onClose}>✕</button>
                    </div>
                    <div className="p-5 space-y-5">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                            <p className="text-sm text-slate-700 dark:text-slate-200 font-bold mb-1">📢 ยืนยันการรับสินค้า</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {auction.is_escrow 
                                    ? "การยืนยันนี้จะทำการโอนเงินให้กับผู้ขายทันที โปรดตรวจสอบสินค้าให้เรียบร้อย"
                                    : "การยืนยันนี้เพื่อจบรายการขายและให้เครดิตผู้ขาย (กรุณาโอนเงินกันให้เรียบร้อย)"}
                            </p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 text-center">ให้เครดิตกับคุณ <span className="font-bold text-slate-900 dark:text-white">{targetName}</span></p>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${action === 'good' ? 'bg-emerald-100 border-emerald-500' : 'bg-slate-100 border-slate-300'}`}><input type="radio" name="score" value="good" checked={action === 'good'} onChange={() => { setAction('good'); setReason('transaction_success'); }} className="mr-2" /><span className="font-bold text-emerald-600">👍 ให้เครดิต (+1)</span></label>
                            <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${action === 'bad' ? 'bg-red-100 border-red-500' : 'bg-slate-100 border-slate-300'}`}><input type="radio" name="score" value="bad" checked={action === 'bad'} onChange={() => { setAction('bad'); setReason('non_payment'); }} className="mr-2" /><span className="font-bold text-red-600">👎 หักเครดิต (-1)</span></label>
                        </div>
                        {action === 'bad' && (<div><label className="text-xs font-bold text-red-500 uppercase mb-1 block">ระบุสาเหตุ</label><select value={reason} onChange={e=>setReason(e.target.value)} className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 outline-none"><option value="non_payment">ไม่ชำระเงิน / เงียบหาย</option><option value="non_delivery">ผู้ขายไม่จัดส่งสินค้า</option><option value="fake_item">สินค้าไม่ตรงปก / ปลอม</option><option value="cancellation_abuse">ยกเลิกหลังการบิดจบ</option></select></div>)}
                        <button onClick={handlePreSubmit} disabled={isSubmitting} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50">{isSubmitting ? 'กำลังประมวลผล...' : 'ยืนยันรับสินค้า'}</button>
                    </div>
                    </>
                )}
            </div>
            {showFinalConfirm && !isSuccess && (
                <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white dark:bg-slate-900 border-[3px] border-red-500 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(239,68,68,0.4)] transform scale-100 animate-bounce-in relative overflow-hidden flex flex-col items-center text-center">
                        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                        <div className="mb-4 animate-pulse"><WarningIcon /></div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">ยืนยันรับสินค้า?</h3>
                        <div className="text-slate-600 dark:text-slate-300 mb-6 space-y-2 text-sm">
                            <p>ท่านได้รับของจริงๆ แล้วใช่ไหม?</p>
                            <p className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800">⚠️ การกดยืนยันนี้จะเป็นการ<br/>อนุมัติเงินประกันให้ผู้ขายทันที</p>
                        </div>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setShowFinalConfirm(false)} className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">ยกเลิก</button>
                            <button onClick={submitReputation} disabled={isSubmitting} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 transition-transform active:scale-95">{isSubmitting ? 'กำลังโอน...' : 'ยืนยันอนุมัติ'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>, document.body
    );
};
