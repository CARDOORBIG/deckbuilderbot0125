import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // ตรวจสอบ path ให้ถูก
import RatingBadge from './RatingBadge';

// Component นี้ใช้แสดง "รูปโปรไฟล์ + ชื่อ + ยศ" ของใครก็ได้
export default function UserBadge({ email, name, picture, size = "md" }) {
  const [score, setScore] = useState(0);

  // ดึงคะแนน Real-time จาก Database (user_stats หรือ users)
  useEffect(() => {
    if (!email) return;

    // 🔴 แก้ไข path ตรงนี้ให้ตรงกับ Database ของคุณ
    // เช่น doc(db, "users", email) หรือ doc(db, "user_stats", email)
    const unsub = onSnapshot(doc(db, "user_stats", email), (doc) => {
      if (doc.exists()) {
        // ดึงค่า total_score ออกมา (แก้ field ให้ตรง DB จริง)
        setScore(doc.data().total_score || 0);
      }
    });

    return () => unsub();
  }, [email]);

  // กำหนดขนาด Avatar ตาม size props
  const imgSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 w-fit max-w-full">
      {/* Avatar */}
      <img 
        src={picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
        alt={name} 
        className={`${imgSize} rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm`}
        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
      />
      
      <div className="flex flex-col min-w-0">
        {/* ชื่อผู้ขาย */}
        <span className={`font-bold text-slate-900 dark:text-white truncate ${textSize}`}>
          {name || "Unknown User"}
        </span>
        
        {/* ยศและคะแนน */}
        <div className="scale-90 origin-left -ml-1 mt-0.5">
            <RatingBadge score={score} />
        </div>
      </div>
    </div>
  );
}