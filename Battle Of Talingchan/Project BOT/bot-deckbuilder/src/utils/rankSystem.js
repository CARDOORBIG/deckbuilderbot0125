// utils/rankSystem.js

// กำหนดเกณฑ์คะแนน (ปรับลดลงมาให้สมจริงกับการขายของทีละชิ้น)
export const RANKS = [
  { min: -999, max: -1, id: 'BAD', name: "เครดิตเสีย", color: "red" },
  { min: 0, max: 4, id: 'NEW', name: "หน้าใหม่", color: "slate" },
  { min: 5, max: 19, id: 'ROOKIE', name: "ฝึกหัด", color: "emerald" },
  { min: 20, max: 49, id: 'REGULAR', name: "ขาประจำ", color: "cyan" },
  { min: 50, max: 99, id: 'PRO', name: "ทุนหนา", color: "fuchsia" },
  { min: 100, max: 499, id: 'TYCOON', name: "เจ้าสัว", color: "purple" }, // เพิ่ม Crown
  { min: 500, max: 999999, id: 'LEGEND', name: "สุลต่าน", color: "rose" }
];

// ฟังก์ชันคำนวณยศจากคะแนน
export const getRankFromScore = (score) => {
  const safeScore = parseInt(score || 0);
  return RANKS.find(r => safeScore >= r.min && safeScore <= r.max) || RANKS[1]; // Default เป็นหน้าใหม่
};

// ฟังก์ชันคำนวณ % หลอด EXP
export const getNextRankProgress = (score) => {
  const safeScore = parseInt(score || 0);
  const currentIndex = RANKS.findIndex(r => safeScore >= r.min && safeScore <= r.max);
  
  if (currentIndex === -1 || currentIndex === RANKS.length - 1 || safeScore < 0) {
    return { percent: 100, nextScore: null, nextName: "Max Level" }; 
  }

  const currentRank = RANKS[currentIndex];
  const nextRank = RANKS[currentIndex + 1];
  
  const totalRange = nextRank.min - currentRank.min;
  const progress = safeScore - currentRank.min;
  const percent = Math.min(100, Math.max(0, (progress / totalRange) * 100));

  return { percent, nextScore: nextRank.min, nextName: nextRank.name };
};