// src/lib/utils.js

// (อย่าลืม import สิ่งที่จำเป็น ถ้าฟังก์ชันของคุณมีการเรียกใช้กันเอง)

export const RULES = { main: { size: 50, /*...*/ }, life: { /*...*/ }, };
export const nameKey = (n) => (n || "").trim().toLowerCase();
export function countBy(arr, keyFn) { /*...*/ }
export function validate(mainDeck, lifeDeck) { /*...*/ }
export const avg = (arr) => { /*...*/ };
export const encodeDeckCode = (mainDeck, lifeDeck) => { /*...*/ };
export const decodeDeckCode = (code, allCards) => { /*...*/ };
export const encodePath = (p) => p.split('/').map(encodeURIComponent).join('/');