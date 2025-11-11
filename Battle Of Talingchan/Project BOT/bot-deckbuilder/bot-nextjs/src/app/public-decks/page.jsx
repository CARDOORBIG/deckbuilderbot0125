// (ไม่ต้องมี "use client" - นี่คือ Server Component)

import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/Common'; // <--- Import UI
import { ChevronLeftIcon } from '@/components/ui/Icons'; // <--- Import UI
import DeckCard from './DeckCard'; // <--- Import Component ใหม่ที่เรากำลังจะสร้าง (6C)

// 1. ดึงข้อมูล "บนเซิร์ฟเวอร์"
async function getPublicDecks() {
  const q = query(
    collection(db, "publicDecks"),
    orderBy("sharedAt", "desc"), // (Firebase Index ที่เราคุยกันจะทำงานที่นี่)
    limit(12) // โหลด 12 เด็คล่าสุด (คุณสามารถทำ Pagination ต่อจากตรงนี้ได้)
  );
  
  const snapshot = await getDocs(q);
  
  // 2. แปลงข้อมูล
  const decks = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // [สำคัญ] แปลง Timestamp (Object) ให้เป็น string
      // เพราะ Server Component ส่ง Object วันที่ ที่ซับซ้อนไปให้ Client Component ไม่ได้
      sharedAt: data.sharedAt ? data.sharedAt.toDate().toISOString() : new Date().toISOString(),
    };
  });
  
  return decks;
}

// 3. นี่คือหน้าเว็บ
export default async function PublicDecksPage() {
  
  // 4. "รอ" (await) ให้ข้อมูลโหลดเสร็จ...
  const decks = await getPublicDecks();
  // (เมื่อโค้ดมาถึงบรรทัดนี้ ข้อมูลโหลดเสร็จแล้ว)

  // 5. ...แล้วค่อย Render HTML ที่ "เต็มแล้ว"
  return (
    <div className="h-screen flex flex-col text-gray-200 bg-black">
      <style>{`::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#334155}`}</style>
      
      <header className="px-4 lg:px-6 py-2 border-b border-emerald-700/30 bg-black/60 backdrop-blur-sm shrink-0 z-40">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 to-emerald-400 bg-clip-text text-transparent">
            Battle Of Talingchan
          </h1>
          <Link href="/"> {/* <--- Link ใน Next.js */}
            <Button className="bg-emerald-600/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50 hover:text-white">
              <ChevronLeftIcon />
              กลับไปหน้าจัดเด็ค
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-white mb-6">Public Shared Decks</h2>
        
        {/* ไม่มี isLoading อีกต่อไป! */}
        {decks.length === 0 ? (
          <div className="bg-slate-900/70 p-8 rounded-xl border border-emerald-500/20 text-center">
            <h3 className="text-2xl font-bold text-amber-300 mb-2">ยังไม่มีเด็คที่ถูกแชร์</h3>
            <p className="text-lg text-gray-300">
              กลับไปที่หน้า "My Deck List" ของคุณ แล้วกดปุ่ม "Share" เพื่อเป็นคนแรก!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {decks.map(deck => (
                <DeckCard key={deck.id} deck={deck} />
              ))}
            </div>
            {/* (ในอนาคต เราจะวางปุ่ม "Load More" (Client Component) ไว้ที่นี่) */}
          </>
        )}
      </main>
    </div>
  );
}