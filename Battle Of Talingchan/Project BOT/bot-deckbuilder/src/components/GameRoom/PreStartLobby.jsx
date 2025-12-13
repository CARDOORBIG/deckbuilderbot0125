import React from 'react';
import { LayersIcon } from '../Icons';

// รูปสีเทา สร้างจาก Code
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23222'/%3E%3Ctext x='50%25' y='50%25' fill='%23555' dy='.3em' text-anchor='middle' font-family='sans-serif'%3ENO IMG%3C/text%3E%3C/svg%3E";

const PreStartLobby = ({ 
    players, 
    myRole, 
    onSelectDeck, 
    onToggleReady, 
    isReady, 
    countdown 
}) => {
    
    const PlayerSeat = ({ side, data }) => {
        const isRed = side === 'red';
        const colorClass = isRed ? 'from-red-600 to-orange-600' : 'from-blue-600 to-cyan-600';
        const borderClass = isRed ? 'border-red-500' : 'border-blue-500';
        const bgClass = isRed ? 'bg-red-950/50' : 'bg-blue-950/50';

        return (
            <div className={`flex-1 flex flex-col items-center justify-center p-6 m-4 rounded-2xl border-2 ${borderClass} ${bgClass} backdrop-blur-md transition-all relative overflow-hidden group`}>
                
                {data?.isReady && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)] z-20">
                        READY
                    </div>
                )}

                <div className="z-10 flex flex-col items-center gap-4">
                    <div className={`w-28 h-28 rounded-full p-1 bg-gradient-to-tr ${colorClass} shadow-2xl`}>
                        <img 
                            src={data?.picture || PLACEHOLDER_IMG} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover border-4 border-black bg-slate-800"
                            onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                        />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-black text-white tracking-wider uppercase drop-shadow-md">
                            {data?.name || "Waiting..."}
                        </h3>
                        <p className={`text-sm font-bold opacity-90 ${isRed ? 'text-red-300' : 'text-blue-300'}`}>
                            {isRed ? 'HOST (RED)' : 'CHALLENGER (BLUE)'}
                        </p>
                    </div>
                </div>

                <div className="mt-6 w-48 h-64 bg-slate-900/80 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    {data?.deckCover ? (
                        <>
                            <div className="absolute inset-0 bg-cover bg-center blur-sm opacity-50" style={{ backgroundImage: `url(${data.deckCover})` }}></div>
                            <img src={data.deckCover} className="w-full h-full object-contain relative z-10 p-2" alt="Deck" onError={(e) => { e.target.style.display = 'none'; }} />
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-slate-500">
                            <LayersIcon className="w-10 h-10 opacity-30 mb-2" />
                            <span className="text-xs uppercase tracking-wide opacity-50">No Deck</span>
                        </div>
                    )}
                </div>

                {myRole === side && (
                    <div className="mt-8 flex gap-3 z-20">
                        <button onClick={onSelectDeck} className="px-5 py-2.5 bg-slate-700/80 hover:bg-slate-600 text-white text-sm font-bold rounded-xl border border-white/10 transition-colors flex items-center gap-2 backdrop-blur-sm">
                            <LayersIcon className="w-4 h-4" /> Change Deck
                        </button>
                        <button onClick={onToggleReady} className={`px-8 py-2.5 font-black text-sm rounded-xl shadow-lg transition-all active:scale-95 border ${isReady ? 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white hover:bg-slate-100 text-slate-900 border-white'}`}>
                            {isReady ? 'READY!' : 'READY?'}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
            {countdown !== null && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 animate-in fade-in duration-300">
                    <div className="flex flex-col items-center">
                        <div className="text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-red-600 animate-ping drop-shadow-[0_0_30px_rgba(255,200,0,0.5)]">{countdown > 0 ? countdown : 'FIGHT!'}</div>
                        <p className="text-white text-xl uppercase tracking-[0.5em] font-bold animate-pulse">Battle Starting...</p>
                    </div>
                </div>
            )}
            <div className="relative z-10 w-full max-w-6xl h-[85vh] flex items-center justify-between px-4 md:px-8">
                <PlayerSeat side="red" data={players.red} />
                <div className="flex flex-col items-center justify-center mx-2 shrink-0">
                    <div className="relative">
                        <span className="text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] relative z-10">VS</span>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/30 blur-[50px] rounded-full"></div>
                    </div>
                    <div className="mt-8 px-5 py-2 bg-black/60 rounded-full border border-white/10 backdrop-blur text-sm text-slate-300 font-mono shadow-lg">Spectators: <span className="text-white font-bold">{players.spectators || 0}</span></div>
                </div>
                <PlayerSeat side="blue" data={players.blue} />
            </div>
        </div>
    );
};

export default PreStartLobby;