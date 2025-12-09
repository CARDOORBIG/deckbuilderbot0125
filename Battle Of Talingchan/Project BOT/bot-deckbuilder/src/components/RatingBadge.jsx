import React from 'react';
import { getRankFromScore, getNextRankProgress } from '../utils/rankSystem';

const RatingBadge = ({ score, showProgress = false }) => {
    const rank = getRankFromScore(score);
    const progress = getNextRankProgress(score);

    const Icons = {
        Cross: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
        Warning: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>,
        New: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><circle cx="12" cy="12" r="10"/></svg>,
        Leaf: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>,
        Shield: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>,
        Diamond: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M19 3H5L2 9l10 12L22 9l-3-6z"/></svg>,
        Crown: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>,
        Sultan: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M12 2L1 21h22L12 2zm0 3.5L18.5 19H5.5L12 5.5zM12 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>,
        // 🟢 เพิ่มไอคอน Admin (ใช้ดาว)
        Admin: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    };

    let theme = {};

    switch (rank.id) {
        case 'BAD':
            theme = { icon: Icons.Cross, style: 'text-red-600 border-red-600 bg-red-950/40 shadow-[0_0_10px_rgba(220,38,38,0.8)]' };
            break;
        case 'NEW':
            theme = { icon: Icons.New, style: 'text-slate-500 border-slate-400 bg-slate-100 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-500 shadow-sm' };
            break;
        case 'ROOKIE':
            theme = { icon: Icons.Leaf, style: 'text-emerald-600 border-emerald-500 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 shadow-[0_0_8px_rgba(52,211,153,0.4)]' };
            break;
        case 'REGULAR':
            theme = { icon: Icons.Shield, style: 'text-cyan-600 border-cyan-500 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-900/20 shadow-[0_0_10px_rgba(34,211,238,0.5)]' };
            break;
        case 'PRO':
            theme = { icon: Icons.Diamond, style: 'text-fuchsia-600 border-fuchsia-500 bg-fuchsia-50 dark:text-fuchsia-300 dark:border-fuchsia-400 dark:bg-fuchsia-900/40 shadow-[0_0_15px_2px_rgba(217,70,239,0.5)] font-bold' };
            break;
        case 'TYCOON':
            theme = { icon: Icons.Crown, style: 'text-purple-600 border-purple-500 bg-purple-50 dark:text-purple-300 dark:border-purple-400 dark:bg-purple-900/40 shadow-[0_0_15px_2px_rgba(168,85,247,0.5)] font-bold' };
            break;
        case 'LEGEND':
            theme = { icon: Icons.Sultan, style: 'text-rose-600 border-rose-500 bg-rose-50 dark:text-rose-100 dark:border-rose-500 dark:bg-rose-900/60 shadow-[0_0_20px_4px_rgba(244,63,94,0.9)] font-black animate-pulse border-2' };
            break;
        
        // 🟢 เพิ่มธีม ADMIN (สีรุ้ง + ไฟวิ่ง)
        case 'ADMIN':
            theme = { 
                icon: Icons.Admin, 
                style: 'text-white border-2 border-white/50 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 to-purple-600 animate-rainbow bg-[length:400%_400%] shadow-[0_0_20px_rgba(255,255,255,0.8)] font-black tracking-widest' 
            };
            break;

        default:
            theme = { icon: Icons.New, style: 'text-slate-400 border-slate-400' };
    }

    return (
        <div className="flex flex-col items-start gap-1">
            <div className={`
                inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border 
                text-[10px] md:text-xs transition-all duration-300
                backdrop-blur-md cursor-help select-none
                ${theme.style}
            `}
            title={`Credit Score: ${score}`}
            >
                <span className="filter drop-shadow-md">{theme.icon}</span>
                <span className="uppercase font-bold">{rank.name}</span>
            </div>

            {showProgress && progress.nextScore && score >= 0 && (
                <div className="w-full pl-1 pr-1 mt-1 group relative">
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 rounded-full`} 
                            style={{ 
                                width: `${progress.percent}%`,
                                backgroundColor: 'currentColor', 
                                color: 'inherit' 
                            }}
                        />
                    </div>
                    <div className="absolute top-3 left-0 text-[9px] text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-800 px-1 rounded shadow border border-slate-200 dark:border-slate-700 z-10">
                        อีก {progress.nextScore - score} แต้ม จะเป็น "{progress.nextName}"
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatingBadge;