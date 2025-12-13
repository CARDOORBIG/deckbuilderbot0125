import React from 'react';
import { LayersIcon } from '../Icons';

// --- Assets & Styles ---
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' fill='%23444' dy='.3em' text-anchor='middle' font-family='sans-serif' font-weight='bold'%3ENO IMG%3C/text%3E%3C/svg%3E";

const PreStartLobby = ({ 
    players, 
    myRole, 
    onSelectDeck, 
    onToggleReady, 
    isReady, 
    countdown 
}) => {
    
    // --- Sub-Component: Player Card ---
    const PlayerSection = ({ side, data }) => {
        const isRed = side === 'red';
        const isMe = myRole === side;
        
        // Theme Configurations
        const theme = {
            red: {
                gradient: "from-orange-600 via-red-600 to-rose-900",
                glow: "shadow-[0_0_50px_rgba(220,38,38,0.4)]",
                border: "border-red-500",
                text: "text-red-400",
                readyBg: "bg-gradient-to-r from-red-600 to-orange-500",
                bgEffect: "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-900/40 via-red-950/20 to-transparent"
            },
            blue: {
                gradient: "from-cyan-500 via-blue-600 to-indigo-900",
                glow: "shadow-[0_0_50px_rgba(37,99,235,0.4)]",
                border: "border-blue-500",
                text: "text-cyan-400",
                readyBg: "bg-gradient-to-r from-blue-600 to-cyan-500",
                bgEffect: "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/40 via-blue-950/20 to-transparent"
            }
        }[side];

        const cardStateClass = data?.isReady 
            ? "scale-105 grayscale-0 brightness-110" 
            : "scale-100 grayscale-[0.3] brightness-90";

        return (
            <div className={`relative flex flex-col items-center justify-center w-full h-full z-10 transition-all duration-700 ${cardStateClass}`}>
                
                {/* Background Ambient Effect */}
                <div className={`absolute inset-0 w-full h-full ${theme.bgEffect} opacity-60 pointer-events-none`}></div>

                {/* Main Card Container */}
                <div className="relative w-full max-w-sm">
                    
                    {/* Character Avatar (Hexagon Style Mask or Circle) */}
                    <div className="relative flex justify-center mb-8 group">
                        {/* Rotating Ring */}
                        {data?.isReady && (
                            <div className={`absolute inset-0 rounded-full border-2 border-dashed ${theme.border} animate-[spin_10s_linear_infinite] opacity-50 scale-125`}></div>
                        )}
                        {/* Glow Behind */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr ${theme.gradient} blur-[60px] opacity-60`}></div>
                        
                        {/* Avatar Image */}
                        <div className={`w-40 h-40 rounded-full p-1.5 bg-gradient-to-b ${theme.gradient} shadow-2xl relative z-10 overflow-hidden`}>
                            <img 
                                src={data?.picture || PLACEHOLDER_IMG} 
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover border-4 border-black/80 bg-slate-900"
                                onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                            />
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-full"></div>
                        </div>

                        {/* Ready Badge Floating */}
                        {data?.isReady && (
                            <div className="absolute -bottom-4 z-20 px-6 py-1 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] animate-bounce">
                                Ready
                            </div>
                        )}
                    </div>

                    {/* Player Info Panel */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden group/panel">
                        {/* Role Label */}
                        <div className={`text-xs font-bold uppercase tracking-[0.3em] mb-2 ${theme.text} opacity-80`}>
                            {isRed ? 'The Host' : 'The Challenger'}
                        </div>
                        
                        {/* Player Name */}
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight truncate drop-shadow-lg mb-6">
                            {data?.name || "Waiting..."}
                        </h2>

                        {/* Deck Showcase */}
                        <div className="relative w-full aspect-[16/9] bg-slate-900/50 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center mb-6 group-hover/panel:border-white/20 transition-colors">
                            {data?.deckCover ? (
                                <>
                                    <div className="absolute inset-0 bg-cover bg-center blur opacity-40" style={{ backgroundImage: `url(${data.deckCover})` }}></div>
                                    <img src={data.deckCover} className="h-[90%] w-auto object-contain relative z-10 shadow-lg transition-transform duration-500 group-hover/panel:scale-110" alt="Deck" />
                                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white/70 font-mono border border-white/10">DECK SELECTED</div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-600">
                                    <LayersIcon className="w-8 h-8 opacity-40" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">No Deck</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons (Only for Me) */}
                        {isMe && (
                            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <button 
                                    onClick={onSelectDeck}
                                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider border border-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    <LayersIcon className="w-4 h-4 group-hover/btn:text-white" /> Change Loadout
                                </button>
                                <button 
                                    onClick={onToggleReady}
                                    className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 relative overflow-hidden group/ready
                                        ${isReady 
                                            ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                                            : `bg-white text-slate-900 hover:bg-slate-200 shadow-white/10`
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/ready:translate-x-full transition-transform duration-700"></div>
                                    <span className="relative z-10">{isReady ? 'System Ready' : 'Engage'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="absolute inset-0 overflow-hidden bg-[#050505] font-sans">
            
            {/* --- Dynamic Backgrounds --- */}
            <div className="absolute inset-0 w-[150%] h-full bg-gradient-to-br from-red-950 via-black to-black -translate-x-[20%] skew-x-[-15deg] z-0 border-r border-red-900/30"></div>
            <div className="absolute inset-0 w-[150%] h-full bg-gradient-to-bl from-blue-950 via-black to-black translate-x-[45%] skew-x-[-15deg] z-0 border-l border-blue-900/30"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 pointer-events-none"></div>

            {/* --- Center "VS" Element (FIXED Clipping) --- */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
                {/* Lightning/Energy Vertical Line */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-[120vh] bg-white/20 blur-[1px] -skew-x-[15deg]">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-pulse"></div>
                </div>

                {/* VS Badge */}
                <div className="relative group perspective-1000">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    
                    {/* FIX: ขยายขนาด Container และเพิ่ม overflow-visible */}
                    <div className="relative w-64 h-64 md:w-[300px] md:h-[300px] flex items-center justify-center overflow-visible">
                        <span className="text-[10px] md:text-[160px] font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] z-10 scale-x-110 select-none"
                              // FIX: เพิ่ม paddingRight เล็กน้อยเพื่อป้องกันหางตัว S แหว่ง
                              style={{ fontFamily: 'Impact, sans-serif', paddingRight: '0.15em' }}>
                            VS
                        </span>
                        {/* Metallic Ring */}
                        <div className="absolute inset-0 border-4 border-white/10 rounded-full blur-[1px] skew-x-[-10deg] scale-90 pointer-events-none"></div>
                    </div>
                </div>

                {/* Spectator Count */}
                <div className="mt-8 bg-black/80 backdrop-blur border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-2xl z-30">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-[ping_2s_linear_infinite]"></div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Spectators</span>
                    <span className="text-white font-mono font-bold text-sm">{players.spectators || 0}</span>
                </div>
            </div>

            {/* --- Countdown Overlay --- */}
            {countdown !== null && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in duration-200">
                    <div className="flex flex-col items-center justify-center relative">
                        <div className="text-[300px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 animate-[pulse_1s_ease-in-out_infinite] drop-shadow-[0_0_100px_rgba(255,165,0,0.5)]">
                            {countdown > 0 ? countdown : 'GO'}
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[2px] border-yellow-500/30 rounded-full animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <p className="text-white text-2xl uppercase tracking-[1em] font-bold mt-10 animate-pulse text-center w-full">Initiating Battle</p>
                    </div>
                </div>
            )}

            {/* --- Main Content Grid --- */}
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between px-4 md:px-12 lg:px-24 py-8">
                <div className="flex-1 w-full h-full flex items-center justify-center md:justify-start md:pr-20">
                    <PlayerSection side="red" data={players.red} />
                </div>
                <div className="shrink-0 w-0 md:w-32 lg:w-48"></div>
                <div className="flex-1 w-full h-full flex items-center justify-center md:justify-end md:pl-20">
                    <PlayerSection side="blue" data={players.blue} />
                </div>
            </div>
        </div>
    );
};

export default PreStartLobby;