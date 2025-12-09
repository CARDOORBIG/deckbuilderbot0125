import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
    CloseIcon, ChevronRightIcon, ChevronLeftIcon,
    // 🟢 Import ไอคอนใหม่
    HandWaveIcon, ToolsLuxuryIcon, CartLuxuryIcon, CardsLuxuryIcon,
    ScaleLuxuryIcon, HammerLuxuryIcon, ShopLuxuryIcon, BanLuxuryIcon,
    ShieldLuxuryIcon, FutureLuxuryIcon, SearchEyeLuxuryIcon, ChatLuxuryIcon,
    EggIcon, SproutIcon, ShieldRankIcon, DiamondRankIcon, TycoonGoldIcon, LegendMaskIcon
} from './Icons';

// 🟢 Helper Component สำหรับแสดงไอคอนหลัก
const RuleIconWrapper = ({ children, bgClass }) => (
    <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl mb-6 relative overflow-hidden ${bgClass}`}>
        <div className="absolute inset-0 bg-white/20 rounded-full scale-110 animate-pulse"></div>
        <div className="relative z-10 transform scale-150">
            {children}
        </div>
    </div>
);

// 🟢 ข้อมูลหน้าต่างๆ (เนื้อหาละเอียด + ดีไซน์ใหม่)
const PAGES = [
    {
        title: "ยินดีต้อนรับสู่ BOT Deck Builder",
        icon: <HandWaveIcon className="w-10 h-10 text-white" />,
        bgClass: "bg-gradient-to-br from-blue-500 to-indigo-600",
        content: (
            <div className="space-y-5 text-center">
                <img 
                    src="/assets/LOGO.png" 
                    className="h-20 mx-auto object-contain drop-shadow-md hover:scale-105 transition-transform" 
                    alt="Logo" 
                    onError={(e) => e.target.style.display='none'} 
                />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    ศูนย์รวมคอมมูนิตี้การ์ดเกมครบวงจร
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed px-4">
                    แพลตฟอร์มที่ถูกสร้างขึ้นมาเพื่อให้ผู้เล่นสามารถ 
                    <span className="font-bold text-indigo-500"> จัดเด็ค</span>, 
                    <span className="font-bold text-emerald-500"> ซื้อ-ขาย</span>, และ 
                    <span className="font-bold text-amber-500"> ประมูล</span> 
                    ได้อย่างสะดวกและปลอดภัย
                </p>
                <div className="flex justify-center gap-4 mt-2">
                    <div className="flex flex-col items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg w-24">
                        <ToolsLuxuryIcon className="w-6 h-6"/>
                        <span className="text-[10px] font-bold">จัดเด็ค</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg w-24">
                        <CartLuxuryIcon className="w-6 h-6"/>
                        <span className="text-[10px] font-bold">ซื้อขาย</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "ระบบจัดเด็ค (Deck Builder)",
        icon: <CardsLuxuryIcon className="w-10 h-10 text-white" />,
        bgClass: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
        content: (
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 px-2">
                <p className="font-bold mb-2">ฟีเจอร์เด่น:</p>
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600"><ToolsLuxuryIcon className="w-5 h-5"/></div>
                        <div>
                            <p className="font-bold text-xs">Drag & Drop</p>
                            <p className="text-[10px] opacity-70">ลากการ์ดวางลง Main/Life Deck ได้ทันที</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600"><SearchEyeLuxuryIcon className="w-5 h-5"/></div>
                        <div>
                            <p className="font-bold text-xs">Save & Share</p>
                            <p className="text-[10px] opacity-70">บันทึกเด็คส่วนตัว หรือแชร์ให้โลกรู้</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "ตลาด & การประมูล",
        icon: <ScaleLuxuryIcon className="w-10 h-10 text-white" />,
        bgClass: "bg-gradient-to-br from-amber-500 to-orange-600",
        content: (
            <div className="space-y-4 text-sm px-2">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-200 dark:border-amber-800 flex flex-col items-center text-center">
                        <HammerLuxuryIcon className="w-8 h-8 mb-1"/>
                        <p className="font-bold text-amber-700 dark:text-amber-400 text-xs">ประมูล (Auction)</p>
                        <p className="text-[9px] text-slate-500 mt-1">แข่งราคา ใครให้สูงสุดชนะ</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 flex flex-col items-center text-center">
                        <ShopLuxuryIcon className="w-8 h-8 mb-1"/>
                        <p className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">ตลาดนัด (Market)</p>
                        <p className="text-[9px] text-slate-500 mt-1">ราคาตายตัว กดซื้อได้เลย</p>
                    </div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 flex gap-3 items-start">
                    <div className="shrink-0 pt-0.5"><BanLuxuryIcon className="w-5 h-5"/></div>
                    <div>
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">กฏเหล็กการซื้อขาย:</p>
                        <ul className="text-[10px] text-slate-600 dark:text-slate-300 list-disc list-inside space-y-0.5">
                            <li>ห้ามบิดเล่น / เทขาย</li>
                            <li>ต้องมีสินค้าอยู่จริง</li>
                            <li>หากตรวจพบ = <b>แบนถาวร</b></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "ความปลอดภัย (Safety)",
        icon: <ShieldLuxuryIcon className="w-10 h-10 text-white" />,
        bgClass: "bg-gradient-to-br from-teal-500 to-emerald-600",
        content: (
            <div className="space-y-4 px-2">
                {/* Future Feature */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl text-white shadow-lg">
                    <div className="absolute top-0 right-0 p-2 opacity-20"><FutureLuxuryIcon className="w-16 h-16 text-white"/></div>
                    <h4 className="font-bold text-sm mb-1 flex items-center gap-2">🔜 อนาคต: ระบบมัดจำ</h4>
                    <p className="text-[10px] opacity-90 leading-relaxed">
                        เรากำลังพัฒนาระบบ <b>"วางเงินประกัน (Deposit)"</b> เพื่อคัดกรองผู้ใช้งานจริง 
                        และป้องกันมิจฉาชีพ/พวกป่วนอย่างเด็ดขาด
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">คำแนะนำเบื้องต้น</p>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                        <SearchEyeLuxuryIcon className="w-5 h-5 text-indigo-500"/>
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">เช็คเครดิตก่อนโอน</p>
                            <p className="text-[10px] text-slate-500">กดที่ชื่อผู้ขายเพื่อดูประวัติการขาย</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                        <ChatLuxuryIcon className="w-5 h-5 text-pink-500"/>
                        <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">คุยผ่านแชทเสมอ</p>
                            <p className="text-[10px] text-slate-500">ขอรูปเพิ่มเติม/หลักฐานในแชทก่อนเสมอ</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "ลำดับชั้น (Ranking System)",
        icon: <TycoonGoldIcon className="w-10 h-10 text-white" />,
        bgClass: "bg-gradient-to-br from-yellow-400 to-amber-600",
        content: (
            <div className="space-y-4 px-1">
                <p className="text-center text-xs text-slate-600 dark:text-slate-300">สะสมคะแนนจากการขายสำเร็จ เพื่อเลื่อนยศและสร้างความน่าเชื่อถือ</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        <EggIcon className="w-5 h-5"/>
                        <div><p className="font-bold text-slate-600 dark:text-slate-400">หน้าใหม่</p><p className="text-[8px] opacity-60">0-4 แต้ม</p></div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded border border-emerald-100 dark:border-emerald-800">
                        <SproutIcon className="w-5 h-5"/>
                        <div><p className="font-bold text-emerald-600 dark:text-emerald-400">ฝึกหัด</p><p className="text-[8px] opacity-60">5-19 แต้ม</p></div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded border border-cyan-100 dark:border-cyan-800">
                        <ShieldRankIcon className="w-5 h-5 text-cyan-500"/>
                        <div><p className="font-bold text-cyan-600 dark:text-cyan-400">ขาประจำ</p><p className="text-[8px] opacity-60">20-49 แต้ม</p></div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded border border-fuchsia-100 dark:border-fuchsia-800">
                        <DiamondRankIcon className="w-5 h-5"/>
                        <div><p className="font-bold text-fuchsia-600 dark:text-fuchsia-400">ทุนหนา</p><p className="text-[8px] opacity-60">50-99 แต้ม</p></div>
                    </div>
                    {/* 🟢 แก้ไข: เจ้าสัวเป็นสีทอง */}
                    <div className="col-span-2 flex items-center gap-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700 shadow-sm">
                        <TycoonGoldIcon className="w-8 h-8"/>
                        <div>
                            <p className="font-bold text-yellow-600 dark:text-yellow-400 text-sm">เจ้าสัว (Tycoon)</p>
                            <p className="text-[10px] opacity-70">100-499 แต้ม (เครดิตดีมาก)</p>
                        </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-3 p-2 bg-rose-50 dark:bg-rose-900/20 rounded border border-rose-200 dark:border-rose-700 shadow-sm">
                        <LegendMaskIcon className="w-8 h-8"/>
                        <div>
                            <p className="font-bold text-rose-600 dark:text-rose-400 text-sm">สุลต่าน (Legend)</p>
                            <p className="text-[10px] opacity-70">500+ แต้ม (สุดยอดนักขาย)</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

export default function RulesModal({ isOpen, onClose }) {
    const [page, setPage] = useState(0);

    if (!isOpen) return null;

    const handleNext = () => {
        if (page < PAGES.length - 1) setPage(p => p + 1);
        else onClose(); 
    };

    const handlePrev = () => {
        if (page > 0) setPage(p => p - 1);
    };

    const currentPage = PAGES[page];

    return createPortal(
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[20000] p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm md:max-w-md rounded-[2rem] shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden relative flex flex-col h-auto max-h-[85vh] transition-all duration-300" onClick={e => e.stopPropagation()}>
                
                {/* Header Graphic Area */}
                <div className={`h-40 ${currentPage.bgClass} flex flex-col items-center justify-center relative overflow-hidden shrink-0 transition-colors duration-500`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                    {/* Icon */}
                    <div className="relative z-10 transform transition-all duration-500 scale-110 drop-shadow-xl animate-float">
                        <RuleIconWrapper bgClass={currentPage.bgClass}>
                            {currentPage.icon}
                        </RuleIconWrapper>
                    </div>

                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md z-20"><CloseIcon /></button>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
                    <h3 className="text-xl md:text-2xl font-black text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 transition-all duration-300">
                        {currentPage.title}
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto px-1 pb-4 scrollbar-hide">
                        {currentPage.content}
                    </div>

                    {/* Footer Navigation */}
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
                        
                        <button 
                            onClick={handlePrev} 
                            disabled={page === 0}
                            className={`p-3 rounded-full transition-all ${page === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                        >
                            <ChevronLeftIcon />
                        </button>

                        <div className="flex gap-2">
                            {PAGES.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === page ? `w-8 ${currentPage.bgClass}` : 'w-2 bg-slate-200 dark:bg-slate-800'}`}></div>
                            ))}
                        </div>

                        <button 
                            onClick={handleNext}
                            className={`px-6 py-2.5 text-white font-bold text-sm rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/10 ${currentPage.bgClass}`}
                        >
                            {page === PAGES.length - 1 ? 'เริ่มใช้งาน' : 'ถัดไป'} 
                            {page < PAGES.length - 1 && <ChevronRightIcon className="w-4 h-4"/>}
                        </button>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
}