"use client"; // <--- บอกว่าไฟล์นี้คือ Client Component (เพื่อใช้ onClick, useState)

import React, { useState, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { encodePath } from '@/lib/utils';
import Modal from '@/components/ui/Modal'; // <--- Import UI
import { Button, CardShell } from '@/components/ui/Common'; // <--- Import UI
import { EyeIcon, CopyIcon, ClearIcon } from '@/components/ui/Icons'; // <--- Import UI

// Component สำหรับแสดง Deck Card
export default function DeckCard({ deck }) {
  // (State สำหรับ Modal และ userProfile จะทำงานที่ Client)
  const [userProfile] = useLocalStorage("bot-userProfile-v1", null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const closeModal = () => setModal({ isOpen: false, title: '', message: '', onConfirm: null });
  const showAlert = (title, message) => setModal({ isOpen: true, title, message, onConfirm: null });

  const mainCardImg = useMemo(() => {
    if (!deck.only1CardData) return 'https://placehold.co/300x420/1e293b/94a3b8?text=Deck';
    const card = deck.only1CardData;
    const encodedImagePath = encodePath(card.imagePath);
    const fileId = card.id.replace(' - Only#1', '');
    return `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
  }, [deck.only1CardData]);

  // แปลง string (จาก Server) กลับเป็น Date Object
  const sharedDate = new Date(deck.sharedAt);

  // ตรวจสอบว่าเป็นเจ้าของเด็คนี้หรือไม่
  const isOwner = userProfile && userProfile.email === deck.user.email;

  // (ฟังก์ชัน Logic ทั้งหมดจะย้ายมาอยู่ที่นี่)
  const handleDeleteDeck = () => {
    setModal({
      isOpen: true,
      title: "Confirm Delete Deck",
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบเด็ค "${deck.deckName}" ออกจาก Public?`,
      onConfirm: async () => {
        closeModal();
        try {
          const docRef = doc(db, "publicDecks", deck.id);
          await deleteDoc(docRef);
          // (หมายเหตุ: ตอนนี้การลบจะยังไม่ Refresh หน้าจอทันที ต้อง F5 ก่อน
          // เราต้องใช้ router.refresh() หรือ state management เพื่อแก้)
        } catch (error) {
          console.error("Error deleting document: ", error);
          showAlert("เกิดข้อผิดพลาด", "ไม่สามารถลบเด็คได้ โปรดลองอีกครั้ง");
        }
      },
      confirmText: "Confirm Delete",
      confirmIcon: <ClearIcon />
    });
  };

  const handleCopyCode = () => {
    showAlert("Coming Soon!", "ฟังก์ชันคัดลอกรหัสเด็คกำลังจะมาค่ะ");
  };

  const handleViewDeck = () => {
    showAlert("Coming Soon!", `ฟังก์ชันดูรายละเอียดเด็ค "${deck.deckName}" กำลังจะมา!`);
  };

  return (
    <>
      <CardShell className="flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <img src={deck.user.picture} alt={deck.user.name} className="w-10 h-10 rounded-full bg-slate-700" loading="lazy" />
            <div>
              <p className="font-semibold text-white">{deck.user.name}</p>
              <p className="text-xs text-gray-400">{sharedDate.toLocaleString('th-TH')}</p>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-amber-300 mb-3 line-clamp-2">{deck.deckName}</h3>
        <div className="aspect-[5/7] w-full rounded-lg mb-4 overflow-hidden bg-slate-800">
          <img src={mainCardImg} alt={deck.only1CardData?.name || 'Deck Cover'} className="w-full h-full object-cover" loading="lazy"/>
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <Button onClick={handleViewDeck} className="w-full bg-blue-600/30 border-blue-500/30 text-blue-300 hover:bg-blue-500/50 hover:text-white">
            <EyeIcon /> ดูรายละเอียดเด็ค
          </Button>
          <Button onClick={handleCopyCode} className="w-full" disabled={true} >
            <CopyIcon /> คัดลอกรหัสเด็ค (เร็วๆ นี้)
          </Button>
          {isOwner && (
            <Button onClick={handleDeleteDeck} className="w-full bg-red-900/50 border-red-500/30 text-red-300 hover:bg-red-800/50 hover:text-white">
              <ClearIcon /> ลบเด็คนี้ (Un-share)
            </Button>
          )}
        </div>
      </CardShell>

      {/* Modal ที่ใช้โดย Component นี้ */}
      <Modal 
        isOpen={modal.isOpen} 
        title={modal.title} 
        onClose={closeModal} 
        onConfirm={modal.onConfirm} 
        confirmText={modal.onConfirm ? modal.confirmText || "Confirm" : undefined} 
        confirmIcon={modal.onConfirm ? modal.confirmIcon || <ClearIcon /> : undefined}
      >
        {modal.message}
      </Modal>
    </>
  );
}