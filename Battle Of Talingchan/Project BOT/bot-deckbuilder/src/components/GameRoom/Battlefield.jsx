import React from 'react';
import './Battlefield.css';

const Battlefield = ({ 
    myHand = [], 
    myField = [], 
    myDeckCount = 0, 
    myGraveyard = [],
    myLifeCount = 5,
    opponentHandCount = 0, 
    opponentDeckCount = 0,
    opponentGraveyardCount = 0,
    opponentLifeCount = 5,
    onDrawCard,
    onPlayCard 
}) => {
    
    const HandCard = ({ card, index }) => (
        <div 
            className="card-in-hand"
            style={{ zIndex: index }}
            onClick={() => onPlayCard(card)}
            title={card.name}
        >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center z-0">
                <span className="text-[10px] text-gray-400 font-bold">{card.name}</span>
            </div>
            {card.image && (
                <img 
                    src={card.image}
                    className="card-face-img absolute inset-0 z-10"
                    alt={card.name}
                    onError={(e) => {
                        if (e.target.src.endsWith('.png')) e.target.src = e.target.src.replace('.png', '.jpg');
                        else e.target.style.display = 'none';
                    }}
                />
            )}
        </div>
    );

    const OpponentCard = ({ index }) => (
        <div className="card-in-hand card-back-img" style={{ zIndex: index }}></div>
    );

    const Slot = ({ type, label, count, onClick, image }) => (
        <div className={`zone-slot ${type}`} data-label={label} onClick={onClick}>
            {type === 'deck' && count > 0 && <div className="deck-stack-visual"></div>}
            
            {image && (
                <img src={image} className="zone-img" onError={(e) => {
                    if (e.target.src.endsWith('.png')) e.target.src = e.target.src.replace('.png', '.jpg');
                    else e.target.style.display = 'none';
                }} />
            )}
            
            {type === 'graveyard' && count > 0 && !image && <div className="zone-img card-back-img opacity-50"></div>}

            {count !== undefined && (
                <div className="zone-count-badge absolute -top-2 -right-2 bg-black border border-white text-white text-[10px] px-1.5 rounded-full font-bold shadow-md z-20">
                    {count}
                </div>
            )}
        </div>
    );

    // 🟢 Life Stack (ใช้ Absolute Left เพื่อเรียงเยื้อง)
    const LifeStack = ({ count }) => (
        <div className="life-zone-wrapper">
            <div className="life-label">LIFE ({count})</div>
            <div className="life-stack">
                {Array.from({ length: count }).map((_, i) => (
                    <div 
                        key={i} 
                        className="card-life" 
                        style={{ 
                            zIndex: i,
                            left: `${i * 20}%` /* 🟢 ขยับทีละ 20% ของความกว้างการ์ด */
                        }} 
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="game-board-wrapper">
            
            {/* 🔴 Opponent Hand */}
            <div className="hand-container opponent">
                {Array.from({ length: opponentHandCount }).map((_, i) => (
                    <OpponentCard key={i} index={i} />
                ))}
            </div>

            <div className="game-board-area">
                
                {/* 🔴 Opponent Field */}
                <div className="player-side opponent">
                    <div className="zones-col left">
                        <Slot type="construct" label="CONSTRUCT" />
                        <LifeStack count={opponentLifeCount} />
                    </div>
                    
                    <div className="zones-col center">
                        <div className="avatar-row">
                            {[1, 2, 3, 4].map(i => <Slot key={i} type="avatar" label={`AVATAR`} />)}
                        </div>
                        <Slot type="magic" label="MAGIC ZONE" />
                    </div>

                    <div className="zones-col right">
                        <Slot type="field" label="FIELD" />
                        <div className="deck-grave-group">
                            <Slot type="graveyard" label="HELL" count={opponentGraveyardCount} />
                            <Slot type="deck" label="DECK" count={opponentDeckCount} />
                        </div>
                    </div>
                </div>

                {/* 🔵 Player Field */}
                <div className="player-side me">
                    <div className="zones-col left">
                        <Slot type="construct" label="CONSTRUCT" />
                        <LifeStack count={myLifeCount} />
                    </div>

                    <div className="zones-col center">
                        <div className="avatar-row">
                            {[1, 2, 3, 4].map(i => <Slot key={i} type="avatar" label={`AVATAR`} />)}
                        </div>
                        <Slot type="magic" label="MAGIC ZONE" />
                    </div>

                    <div className="zones-col right">
                        <Slot type="field" label="FIELD" />
                        <div className="deck-grave-group">
                            <Slot 
                                type="deck" 
                                label="DECK" 
                                count={myDeckCount} 
                                onClick={onDrawCard} 
                            />
                            <Slot 
                                type="graveyard" 
                                label="HELL" 
                                count={myGraveyard.length}
                                image={myGraveyard.length > 0 ? myGraveyard[myGraveyard.length-1].image : null}
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* 🔵 Player Hand */}
            <div className="hand-container player">
                {myHand.map((card, index) => (
                    <HandCard key={card.uniqueId} card={card} index={index} />
                ))}
            </div>

        </div>
    );
};

export default Battlefield;