import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '../firebase'; 
import { collection, query, where, getDocs, updateDoc, doc, increment, serverTimestamp } from 'firebase/firestore';
import { CloseIcon, PackageIcon, CheckIcon, StarIcon } from './Icons';
import UserBadge from './UserBadge'; // ✅ Import UserBadge เข้ามา

// UI Helper: ปุ่ม Tab ด้านบน
const TabButton = ({ active, children, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
      active 
        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' 
        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
    }`}
  >
    {children}
  </button>
);

export default function MyOrdersModal({ isOpen, onClose, userProfile, showAlert }) {
  const [activeTab, setActiveTab] = useState('buying'); // buying | selling
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackingInput, setTrackingInput] = useState({});

  // ดึงข้อมูลออเดอร์
  useEffect(() => {
    if (!isOpen || !userProfile) return;
    
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "orders"), 
          where(activeTab === 'buying' ? 'buyerEmail' : 'sellerEmail', '==', userProfile?.email
)
        );
        
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // เรียงลำดับเอาอันใหม่ขึ้นก่อน
        setOrders(data.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isOpen, activeTab, userProfile]);

  // ฟังก์ชัน: ผู้ขายอัปเดตเลขพัสดุ
  const handleUpdateTracking = async (orderId) => {
    const trackingNo = trackingInput[orderId];
    if (!trackingNo) return showAlert("แจ้งเตือน", "กรุณากรอกเลขพัสดุก่อนครับ");

    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: 'shipped',
        trackingNumber: trackingNo,
        shippedAt: serverTimestamp()
      });
      showAlert("สำเร็จ", "อัปเดตสถานะเป็น 'จัดส่งแล้ว' เรียบร้อย");
      
      setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: 'shipped', trackingNumber: trackingNo} : o));
    } catch (e) {
      console.error(e);
      showAlert("ผิดพลาด", "ไม่สามารถอัปเดตข้อมูลได้");
    }
  };

  // ฟังก์ชัน: ผู้ซื้อยืนยันรับของ + ให้เครดิต
  const handleConfirmReceived = async (order) => {
    if (!confirm("คุณได้รับสินค้าและตรวจสอบเรียบร้อยแล้วใช่หรือไม่?")) return;

    try {
      // 1. อัปเดตสถานะออเดอร์
      await updateDoc(doc(db, "orders", order.id), {
        status: 'completed',
        completedAt: serverTimestamp()
      });

      // 2. บวกเครดิตให้ผู้ขาย +1 (User Stats)
      // *หมายเหตุ: ต้องแน่ใจว่าใน Database มี document ของ sellerEmail อยู่ใน user_stats หรือ users
      try {
          const sellerRef = doc(db, "user_stats", order.sellerEmail); 
          await updateDoc(sellerRef, { 
              total_score: increment(1) 
          });
      } catch (err) {
          console.warn("Could not update seller score (might not exist yet):", err);
      }
      
      // 3. แจ้งเตือนแบบจัดเต็ม
      showAlert(
        <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-emerald-600">ยืนยันสำเร็จ!</h3>
        </div>, 
        <div className="text-center text-slate-600 dark:text-slate-300">
            <p>คุณได้รับสินค้าแล้ว</p>
            <p className="mt-2 text-lg font-bold text-amber-500 bg-amber-100 dark:bg-amber-900/30 py-1 px-2 rounded-lg inline-block border border-amber-200 dark:border-amber-800">
                ผู้ขายได้รับเครดิต +1 แต้ม! 📈
            </p>
        </div>
      );

      setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: 'completed'} : o));

    } catch (e) {
      console.error(e);
      showAlert("ผิดพลาด", "เกิดข้อผิดพลาดในการยืนยัน");
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📦 รายการซื้อขาย (My Orders)
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-200 dark:bg-slate-950">
          <TabButton active={activeTab === 'buying'} onClick={() => setActiveTab('buying')}>
            รายการที่ฉันซื้อ
          </TabButton>
          <TabButton active={activeTab === 'selling'} onClick={() => setActiveTab('selling')}>
            รายการที่ฉันขาย
          </TabButton>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
          {loading ? (
            <div className="text-center py-10 text-slate-500">กำลังโหลดข้อมูล...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-slate-500 flex flex-col items-center">
              <PackageIcon className="w-12 h-12 mb-2 opacity-50"/>
              ไม่มีรายการ{activeTab === 'buying' ? 'ซื้อ' : 'ขาย'}ในขณะนี้
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Order Info & Partner Badge */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2 truncate">
                      {order.itemName}
                    </h4>
                    
                    {/* ✅ ส่วนแสดงคู่ค้า (UserBadge) */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            {activeTab === 'buying' ? 'Seller (ผู้ขาย):' : 'Buyer (ผู้ซื้อ):'}
                        </span>
                        <UserBadge 
                            email={activeTab === 'buying' ? order.sellerEmail : order.buyerEmail}
                            name={activeTab === 'buying' ? order.sellerName : order.buyerName}
                            // picture={order.sellerPic} // ถ้ามีการเก็บรูปใน Order ก็ใส่ได้
                            size="sm"
                        />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 shadow-sm ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                    'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {order.status === 'completed' ? 'สำเร็จแล้ว ✅' : 
                     order.status === 'shipped' ? 'จัดส่งแล้ว 🚚' : 
                     'รอจัดส่ง ⏳'}
                  </span>
                </div>

                {/* Actions / Tracking Info */}
                <div className="flex flex-col gap-3">
                  
                  {/* --- กรณีเป็น "คนขาย" --- */}
                  {activeTab === 'selling' && (
                    <>
                      {order.status === 'pending' && (
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="ระบุเลขพัสดุ (Flash/Kerry/etc.)"
                            className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            onChange={(e) => setTrackingInput({...trackingInput, [order.id]: e.target.value})}
                          />
                          <button 
                            onClick={() => handleUpdateTracking(order.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-bold shadow active:scale-95 transition-transform"
                          >
                            ยืนยันการส่ง
                          </button>
                        </div>
                      )}
                      {order.status === 'shipped' && (
                        <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                          <span className="font-bold">🚚 Tracking No:</span> {order.trackingNumber} <br/>
                          <span className="text-xs text-slate-500 opacity-80 mt-1 block">รอผู้ซื้อกดยืนยันรับของ เพื่อรับคะแนนเครดิต</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* --- กรณีเป็น "คนซื้อ" --- */}
                  {activeTab === 'buying' && (
                    <>
                      {order.status === 'pending' && (
                        <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/10 p-2 rounded border border-amber-100 dark:border-amber-800 animate-pulse">
                          ⏳ รอผู้ขายจัดส่งสินค้า...
                        </p>
                      )}
                      {order.status === 'shipped' && (
                        <div className="space-y-3">
                          <div className="text-sm bg-slate-100 dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                            📦 เลขพัสดุ: <span className="font-mono font-bold select-all text-slate-900 dark:text-white ml-2">{order.trackingNumber}</span>
                          </div>
                          <button 
                            onClick={() => handleConfirmReceived(order)}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2.5 rounded-lg font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                          >
                            <CheckIcon /> ได้รับของแล้ว (+1 เครดิตให้คนขาย)
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* --- สถานะสำเร็จ --- */}
                  {order.status === 'completed' && (
                    <div className="text-center text-sm text-green-600 dark:text-green-400 font-bold flex items-center justify-center gap-1 bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-100 dark:border-green-800/50">
                      <StarIcon className="text-yellow-400 fill-yellow-400"/> การซื้อขายเสร็จสิ้นสมบูรณ์
                    </div>
                  )}

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  , document.body);
}