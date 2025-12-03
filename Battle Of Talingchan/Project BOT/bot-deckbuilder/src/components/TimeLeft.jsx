// src/components/TimeLeft.jsx
import React, { useState, useEffect } from 'react';

const TimeLeft = ({ endTime }) => {
    const [diff, setDiff] = useState(new Date(endTime) - new Date());

    useEffect(() => {
        const timer = setInterval(() => setDiff(new Date(endTime) - new Date()), 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    if (diff <= 0) return (
        <div className="px-3 py-1 bg-red-600/90 backdrop-blur text-white text-xs font-bold rounded-lg shadow-lg border border-red-400 animate-pulse">
            ENDED
        </div>
    );

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const textColor = "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]";

    return (
        <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md border border-slate-700 rounded-lg px-2 py-1 shadow-xl">
            <div className={`font-mono text-lg font-black tracking-widest tabular-nums ${textColor} leading-none`} style={{ fontFamily: "'Courier New', monospace" }}>
                {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
            </div>
        </div>
    );
};

export default TimeLeft;