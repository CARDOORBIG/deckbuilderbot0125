import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GavelIcon, ShoppingBagIcon, ShieldCheckIcon } from './Icons';

// Warning Icon
const WarningIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-yellow-400"> <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /> </svg> );

export default function ActionConfirmModal({ isOpen, onClose, actionData, userBalance, onConfirm, onTopUp }) {
    const [bidAmount, setBidAmount] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    
    useEffect(() => { 
        if (isOpen && actionData?.type === 'bid') {
            setBidAmount(actionData.auction.current_price + actionData.auction.min_bid_increment);
        }
        setIsSuccess(false);
    }, [isOpen, actionData]);

    if (!isOpen || !actionData) return null;

    const { type, auction } = actionData;
    const isEscrow = auction.is_escrow;
    const requiredAmount = (type === 'buy' || type === 'buy_market') ? auction.buy_now_price : bidAmount;
    const isInsufficient = isEscrow && (userBalance < requiredAmount);
    const canProceed = !isEscrow || !isInsufficient;

    const handleSubmit = async () => { 
        if (!canProceed) return; 
        const result = await onConfirm(type === 'bid' ? bidAmount : null);
        if (result && result.success) {
            setIsSuccess(true);
            setTimeout(() => { onClose(); }, 2500); 
        } else if (type === 'bid') {
             onClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={isSuccess ? undefined : onClose}>
            <div className="bg-[#0f172a] border-[3px] border-amber-500/50 rounded-3xl p-6 w-full max-w-sm shadow-[0_0_30px_rgba(245,158,11,0.2)] relative overflow-hidden flex flex-col items-center text-center transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-10 animate-fade-in-up">
                        <div className="mb-6 animate-bounce text-emerald-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                        </div>
                        <h3 className="text-2xl font-black text-emerald-400 mb-2">ทำรายการสำเร็จ!</h3>
                        <p className="text-slate-400">{type === 'bid' ? 'คุณเป็นผู้นำสูงสุดในขณะนี้' : 'คุณได้เป็นเจ้าของสินค้านี้แล้ว'}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-4">
                            <div className="bg-amber-500/10 p-4 rounded-full">
                                {type === 'bid' ? <GavelIcon className="w-8 h-8 text-amber-500"/> : <ShoppingBagIcon className="w-8 h-8 text-pink-500"/>}
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{type === 'bid' ? 'ยืนยันการประมูล' : 'ยืนยันการสั่งซื้อ'}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-1 max-w-[90%]">{auction.card_name}</p>
                        
                        <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 mb-6 w-full">
                            {type === 'bid' ? (
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1 text-left">ระบุยอดเงิน (บาท)</label>
                                    <input type="number" value={bidAmount} onChange={e => setBidAmount(parseInt(e.target.value) || 0)} className="w-full p-3 bg-black/50 border border-amber-500/50 rounded-xl text-center text-2xl font-bold text-white outline-none focus:border-amber-500 font-mono" />
                                    <p className="text-[10px] text-slate-500 mt-2 text-right">ขั้นต่ำ: {(auction.current_price + auction.min_bid_increment).toLocaleString()} ฿</p>
                                </div>
                            ) : (
                                <div className="text-center py-2">
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">ราคาสินค้า</p>
                                    <p className="text-4xl font-black text-pink-400 font-mono tracking-tight">฿{requiredAmount.toLocaleString()}</p>
                                </div>
                            )}

                            {/* --- ส่วนแสดงสถานะ Escrow และคำเตือน --- */}
                            <div className="mt-4 pt-3 border-t border-slate-700">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-slate-400">ระบบคุ้มครอง:</span>
                                    {isEscrow ? 
                                        <span className="text-blue-400 font-bold flex items-center gap-1"><ShieldCheckIcon width="14"/> เปิดใช้งาน (Escrow)</span> 
                                        : 
                                        <span className="text-red-500 font-bold flex items-center gap-1"><WarningIcon width="14"/> ไม่มีการคุ้มครอง</span>
                                    }
                                </div>

                                {isEscrow ? (
                                    <div className="flex justify-between items-center text-sm mt-1">
                                        <span className="text-slate-400">เงินในกระเป๋า:</span>
                                        <span className={`font-mono font-bold ${isInsufficient ? 'text-red-500' : 'text-emerald-400'}`}>฿{userBalance.toLocaleString()}</span>
                                    </div>
                                ) : (
                                    // ⚠️ คำเตือนกรณีไม่มี Escrow
                                    <div className="bg-red-900/20 border border-red-800 p-3 rounded-lg text-left mt-2">
                                        <p className="text-red-400 text-xs font-bold mb-1">⚠️ คำเตือนความเสี่ยงสูง:</p>
                                        <ul className="text-[10px] text-slate-300 list-disc list-inside space-y-1">
                                            <li>รายการนี้เป็นการ <b>โอนเงินตรงให้ผู้ขาย</b></li>
                                            <li>เว็บไซต์ <b>ไม่สามารถดึงเงินคืนได้</b> หากถูกโกง</li>
                                            <li>โปรดตรวจสอบเครดิตผู้ขายให้มั่นใจก่อนโอน</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- ข้อความเตือนเรื่องการบิดเล่น --- */}
                        <div className="mb-4 text-[10px] text-slate-500 bg-slate-900/50 p-2 rounded border border-slate-800">
                            <span className="text-amber-500 font-bold">🚫 บทลงโทษ: </span> 
                            หากชนะประมูลแล้วไม่ชำระเงิน หรือบิดเล่น <span className="text-slate-300">จะถูกระงับบัญชีถาวร (Ban) และขึ้นบัญชีดำทันที</span>
                        </div>

                        <div className="flex gap-3 w-full">
                            {isEscrow && isInsufficient ? (
                                <button onClick={onTopUp} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 animate-pulse">💰 เติมเงิน (Top Up)</button>
                            ) : (
                                <>
                                    <button onClick={onClose} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-colors border border-slate-700">ยกเลิก</button>
                                    <button onClick={handleSubmit} className={`flex-1 py-3 font-bold rounded-xl text-white shadow-lg transition-transform active:scale-95 ${type === 'bid' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-pink-600 hover:bg-pink-500 shadow-pink-500/20'}`}>{type === 'bid' ? 'ยืนยันประมูล' : 'ยืนยันสั่งซื้อ'}</button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>, document.body
    );
};