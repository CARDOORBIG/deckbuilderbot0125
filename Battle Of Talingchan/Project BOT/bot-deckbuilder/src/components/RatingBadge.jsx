import React from 'react';

const RatingBadge = ({ score }) => {
    const s = parseInt(score || 0);
    
    const formatScore = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };

    const Icons = {
        Cross: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
        Warning: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>,
        New: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><circle cx="12" cy="12" r="10"/></svg>,
        Leaf: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>,
        Shield: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>,
        Diamond: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M19 3H5L2 9l10 12L22 9l-3-6z"/></svg>,
        Crown: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>,
        Sultan: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M12 2L1 21h22L12 2zm0 3.5L18.5 19H5.5L12 5.5zM12 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>
    };

    let theme = {};

    // 1. ❌ พวกป่วน (ติดลบ)
    if (s < 0) {
        theme = { icon: Icons.Cross, label: 'เครดิตเสีย', style: 'text-red-600 border-red-600 bg-red-950/40 shadow-[0_0_10px_rgba(220,38,38,0.8)]' };
    } 
    // 2. ⚪ หน้าใหม่ (0 - 999) --> 🟢 ปรับ Scale ให้เล็กลง (scale-90)
    else if (s < 1000) {
        theme = { 
            icon: Icons.New, 
            label: 'หน้าใหม่', 
            style: 'text-slate-300 border-slate-500 bg-slate-800/40 shadow-[0_0_5px_rgba(148,163,184,0.3)] scale-90 opacity-80' 
        };
    } 
    // 3. 🟢 นักประมูลฝึกหัด (1,000 - 9,999)
    else if (s < 10000) {
        theme = { icon: Icons.Leaf, label: 'ฝึกหัด', style: 'text-emerald-400 border-emerald-500 bg-emerald-900/20 shadow-[0_0_8px_rgba(52,211,153,0.6)]' };
    } 
    // 4. 🔵 นักประมูลขาประจำ (10,000 - 29,999)
    else if (s < 30000) {
        theme = { icon: Icons.Shield, label: 'ขาประจำ', style: 'text-cyan-400 border-cyan-500 bg-cyan-900/20 shadow-[0_0_10px_rgba(34,211,238,0.7)]' };
    } 
    // 5. 🟣 นักประมูลทุนหนา (30,000 - 49,999)
    else if (s < 50000) {
        theme = { icon: Icons.Diamond, label: 'ทุนหนา', style: 'text-fuchsia-300 border-fuchsia-400 bg-fuchsia-900/40 shadow-[0_0_15px_2px_rgba(217,70,239,0.7)] drop-shadow-[0_0_5px_rgba(217,70,239,1)] font-bold' };
    } 
    // 6. 🔴 สุลต่าน (50,000+)
    else {
        theme = { icon: Icons.Sultan, label: 'สุลต่าน', style: 'text-rose-100 border-rose-500 bg-rose-900/60 shadow-[0_0_20px_4px_rgba(244,63,94,0.9)] drop-shadow-[0_0_10px_rgba(244,63,94,1)] font-black animate-pulse border-2' };
    }
    
    return (
        <div className={`
            inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border 
            text-[10px] md:text-xs transition-all duration-300
            backdrop-blur-md cursor-help
            ${theme.style}
        `}
        title={`ระดับ: ${theme.label}`}
        >
            <span className="filter drop-shadow-md">{theme.icon}</span>
            <span className="uppercase tracking-wider font-bold">{theme.label}</span>
        </div>
    );
};

export default RatingBadge;