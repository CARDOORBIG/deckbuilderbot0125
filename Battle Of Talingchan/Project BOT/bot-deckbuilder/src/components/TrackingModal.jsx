import React from 'react';
import { createPortal } from 'react-dom';
import { TruckIcon, CloseIcon, PackageIcon } from './Icons'; // ตรวจสอบ path ให้ถูก

export default function TrackingModal({ isOpen, onClose, item }) {
    if (!isOpen || !item) return null;
    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[950] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2"><TruckIcon/> ข้อมูลการจัดส่ง</h3>
                    <button onClick={onClose}><CloseIcon/></button>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                         <div className="p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm"><PackageIcon className="text-blue-500"/></div>
                         <div><p className="text-[10px] text-slate-400 uppercase font-bold">บริษัทขนส่ง</p><p className="text-base font-bold text-slate-900 dark:text-white">{item.courier_name || 'ไม่ระบุ'}</p></div>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">หมายเลขพัสดุ (Tracking)</p>
                        <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-slate-700">
                            <span className="font-mono font-black text-xl text-slate-700 dark:text-slate-200 tracking-widest">{item.tracking_number || '-'}</span>
                            <button onClick={() => { navigator.clipboard.writeText(item.tracking_number); alert('คัดลอกเรียบร้อย!'); }} className="text-blue-500 hover:text-blue-400 bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600"><div className="scale-75">Copy</div></button>
                        </div>
                    </div>
                    {item.shipping_proof && (
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-2">หลักฐานการส่ง</p>
                            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer group relative" onClick={() => window.open(item.shipping_proof, '_blank')}>
                                <img src={item.shipping_proof} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center"><span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/30">คลิกเพื่อดูรูปใหญ่</span></div>
                            </div>
                        </div>
                    )}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                        <p className="text-[10px] text-center text-slate-400">ส่งเมื่อ: {item.shipping_date ? new Date(item.shipping_date).toLocaleString('th-TH') : '-'}</p>
                    </div>
                    <button onClick={onClose} className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">ปิด</button>
                </div>
            </div>
        </div>, document.body
    );
}