import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import RatingBadge from './RatingBadge';
import UserProfilePopup from './UserProfilePopup'; // 🟢 Import Modal

export default function UserBadge({ email, name, picture, size = "md" }) {
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // 🟢 State สำหรับเปิด Modal

  useEffect(() => {
    if (!email) return;
    const unsub = onSnapshot(doc(db, "user_stats", email), (doc) => {
      if (doc.exists()) {
        setScore(doc.data().total_score || 0);
      }
    });
    return () => unsub();
  }, [email]);

  const imgSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <>
        {/* 🟢 เพิ่ม onClick และ cursor-pointer */}
        <div 
            onClick={(e) => { e.stopPropagation(); setShowPopup(true); }}
            className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 w-fit max-w-full cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors group"
        >
          <img 
            src={picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            alt={name} 
            className={`${imgSize} rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm group-hover:scale-105 transition-transform`}
            onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          />
          
          <div className="flex flex-col min-w-0">
            <span className={`font-bold text-slate-900 dark:text-white truncate ${textSize}`}>
              {name || "Unknown User"}
            </span>
            <div className="scale-90 origin-left -ml-1 mt-0.5">
                <RatingBadge score={score} />
            </div>
          </div>
        </div>

        {/* 🟢 Render Modal */}
        <UserProfilePopup 
            isOpen={showPopup} 
            onClose={() => setShowPopup(false)} 
            userId={email} 
        />
    </>
  );
}