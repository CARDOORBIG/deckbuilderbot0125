import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import RatingBadge from './RatingBadge';
import UserProfilePopup from './UserProfilePopup';

export default function UserBadge({ email, name, picture, size = "md" }) {
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!email) return;

    const fetchScore = async () => {
      const { data } = await supabase
        .from('user_stats')
        .select('total_score')
        .eq('user_email', email)
        .single();
      
      if (data) {
        setScore(data.total_score);
      }
    };

    fetchScore();

    const channel = supabase
      .channel(`score_update:${email}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_stats', filter: `user_email=eq.${email}` },
        (payload) => { if (payload.new) setScore(payload.new.total_score); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [email]);

  // ปรับขนาดรูปและ Text ตาม prop size
  const imgSize = size === "sm" ? "w-8 h-8 min-w-[2rem]" : size === "lg" ? "w-12 h-12 min-w-[3rem]" : "w-10 h-10 min-w-[2.5rem]";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const badgeScale = size === "sm" ? "scale-75" : "scale-90"; // ลดขนาด Badge ลงอีกนิดถ้าเป็นจอเล็ก

  return (
    <>
        <div 
            onClick={(e) => { e.stopPropagation(); setShowPopup(true); }}
            className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 max-w-full cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors group select-none"
        >
          {/* รูปโปรไฟล์ */}
          <img 
            src={picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            alt={name} 
            className={`${imgSize} rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm shrink-0`}
            onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          />
          
          {/* ส่วนชื่อและยศ (ใส่ min-w-0 เพื่อให้ Text Truncate ทำงาน) */}
          <div className="flex flex-col min-w-0 overflow-hidden">
            <span className={`font-bold text-slate-900 dark:text-white truncate ${textSize} leading-tight`}>
              {name || "Unknown User"}
            </span>
            
            {/* ยศ: ปรับ Origin ให้ชิดซ้ายและไม่ดัน Layout */}
            <div className={`${badgeScale} origin-top-left -ml-0.5 mt-0.5 w-fit max-w-full overflow-hidden`}>
                <RatingBadge score={score} />
            </div>
          </div>
        </div>

        <UserProfilePopup 
            isOpen={showPopup} 
            onClose={() => setShowPopup(false)} 
            userId={email} 
        />
    </>
  );
}