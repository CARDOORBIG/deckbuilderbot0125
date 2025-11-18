import { useEffect, useMemo, useRef, useState, forwardRef, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { DndProvider, useDrag, useDrop, useDragLayer } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { 
  collection, doc, writeBatch, serverTimestamp, getDoc, setDoc,
  query, where, getDocs 
} from 'firebase/firestore';
const CARD_BASE_URL = "/cards";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// === Icons ===
const Svg = ({ p, ...r }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...r}>{p}</svg>;
const ImportIcon = () => <Svg p={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>} />;
const ExportIcon = () => <Svg p={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>} />;
const TrashIcon = () => <Svg p={<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>} />;
const CloseIcon = () => <Svg width="24" height="24" p={<><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>} />;
const DBLoadIcon = () => <Svg p={<><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></>} />;
const EyeIcon = () => <Svg p={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>} />;
const CopyIcon = () => <Svg p={<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></>} />;
const PlusIcon = () => <Svg width="20" height="20" strokeWidth="2.5" p={<><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></>} />;
const CardsIcon = () => <Svg width="24" height="24" p={<><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 2H8a2 2 0 0 0-2 2v3h12V4a2 2 0 0 0-2-2z"></path></>} />;
const DeckIcon = () => <Svg width="24" height="24" p={<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></>} />;
const ChevronLeftIcon = () => <Svg width="24" height="24" p={<polyline points="15 18 9 12 15 6"></polyline>} />;
const ChevronRightIcon = () => <Svg width="24" height="24" p={<polyline points="9 18 15 12 9 6"></polyline>} />;
const UsersIcon = () => <Svg width="24" height="24" p={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></>} />;
const UploadIcon = () => <Svg p={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></>} />;
const MenuIcon = () => <Svg width="24" height="24" p={<><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>} />;
const UserCogIcon = () => <Svg width="24" height="24" p={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><circle cx="12" cy="12" r="3"></circle></>} />;
const ImageIcon = () => <Svg p={<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>} />;
const SunIcon = () => <Svg p={<><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></>} />;
const MoonIcon = () => <Svg p={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>} />;
const ClearIcon = TrashIcon;

// === UI helpers ===
const Button = ({ className = "", children, ...props }) => (
  <button
    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-300/20 dark:border-amber-400/20 bg-amber-200/20 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-700/50 dark:hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-200/20 dark:disabled:hover:bg-amber-900/30 ${className}`}
    {...props}
  >
    {children}
  </button>
);
const Pill = ({ children, className = "" }) => (
  <span
    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}
  >
    {children}
  </span>
);
const CardShell = forwardRef(function CardShell(
  { children, className = "", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-slate-900/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-lg transition-all hover:border-amber-400/50 hover:shadow-amber-500/10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});
const ColorPip = ({ color }) => {
  const c = {
    Red: "bg-red-500",
    Green: "bg-green-500",
    Purple: "bg-purple-500",
    Blue: "bg-blue-500",
    Yellow: "bg-yellow-500",
    Black: "bg-gray-800",
    White: "bg-slate-200",
  };
  return (
    <span
      className={`w-3 h-3 rounded-full ${c[color] || "bg-slate-400"}`}
      title={color}
    ></span>
  );
};
const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  confirmIcon = <TrashIcon />,
  maxWidth = "max-w-md",
}) =>
  !isOpen
    ? null
    : createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[400] p-4">
          <div
            className={`bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full m-4 ${maxWidth}`}
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {title}
            </h2>
            <div className="text-slate-700 dark:text-gray-300 mb-6">
              {children}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                onClick={onClose}
                className="bg-slate-200 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                {onConfirm ? "Cancel" : "Close"}
              </Button>
              {onConfirm && (
                <Button
                  onClick={onConfirm}
                  className="bg-emerald-200 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-300 dark:hover:bg-emerald-800/50 dark:hover:text-white"
                >
                  {confirmIcon} {confirmText}
                </Button>
              )}
            </div>
          </div>
        </div>,
        document.body
      );
const ImportDeckModal = ({ isOpen, onClose, onImport }) => {
  const [code, setCode] = useState("");
  const handleImportClick = () => {
    onImport(code);
    setCode("");
  };
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[210] p-4">
      <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Import Deck Code
        </h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="วางรหัสเด็คที่นี่..."
          rows="4"
          className="w-full px-3 py-2 border border-slate-300 dark:border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-white dark:bg-slate-700/50 placeholder-gray-400 text-slate-900 dark:text-white mb-6 resize-none"
        />
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="bg-slate-200 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImportClick}
            className="bg-emerald-200 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-300 dark:hover:bg-emerald-800/50 dark:hover:text-white"
          >
            <ImportIcon /> Import
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// === Helper: Image Resizer ===
const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;
        if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } } 
        else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// === Profile Setup Modal ===
const ProfileSetupModal = ({ isOpen, onClose, userProfile, onSave }) => {
  const [nickname, setNickname] = useState(userProfile?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.picture || "");
  const [useGoogleAvatar, setUseGoogleAvatar] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setNickname(userProfile?.name || "");
      setAvatarUrl(userProfile?.picture || "");
      setUseGoogleAvatar(true);
    }
  }, [isOpen, userProfile]);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0]);
      setAvatarUrl(resized);
      setUseGoogleAvatar(false);
    }
  };

  const handleSave = () => {
    onSave({
      displayName: nickname,
      avatarUrl: useGoogleAvatar ? userProfile.picture : avatarUrl,
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[500] p-4">
      <div className="bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-emerald-500/50 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 mb-2">
            ยินดีต้อนรับ!
          </h2>
          <p className="text-slate-600 dark:text-gray-400">
            ตั้งค่าโปรไฟล์ของคุณเพื่อให้ชุมชนรู้จัก
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg relative group">
              <img
                src={useGoogleAvatar ? userProfile.picture : avatarUrl}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/100x100/1e293b/ffffff?text=User")
                }
              />
              {!useGoogleAvatar && (
                <div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="text-white text-xs">เปลี่ยนรูป</div>
                </div>
              )}
            </div>
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setUseGoogleAvatar(true)}
                className={`px-3 py-1 rounded-full border ${
                  useGoogleAvatar
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "border-slate-400 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                รูป Google
              </button>
              <button
                onClick={() => fileInputRef.current.click()}
                className={`px-3 py-1 rounded-full border ${
                  !useGoogleAvatar
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "border-slate-400 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-1">
                  <ImageIcon /> อัปโหลดรูป
                </div>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">
                นามแฝง (Display Name)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-emerald-500 outline-none"
                placeholder="ชื่อเท่ๆ ของคุณ"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            onClick={onClose}
            className="flex-1 bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            ข้ามไปก่อน
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 border-none text-white hover:shadow-lg hover:scale-105"
          >
            บันทึกโปรไฟล์
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// === Settings Sidebar ===
const SettingsDrawer = ({
  isOpen,
  onClose,
  userProfile,
  onEditProfile,
  onLogout,
  theme,
  setTheme,
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-300 dark:border-emerald-700/30 shadow-2xl z-[610] transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-slate-200 dark:border-emerald-700/20 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCogIcon /> ตั้งค่าผู้ใช้
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-4">
          <img
            src={userProfile?.picture}
            alt={userProfile?.name}
            className="w-24 h-24 rounded-full border-4 border-emerald-500 shadow-lg object-cover"
          />
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {userProfile?.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {userProfile?.email}
            </p>
          </div>

          <Button
            onClick={() => {
              onEditProfile();
              onClose();
            }}
            className="w-full mt-4 bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-emerald-700 dark:text-emerald-400 hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            แก้ไขโปรไฟล์
          </Button>
          {/* === [เพิ่ม] ส่วนสลับ Theme === */}
          <div className="mt-4 w-full">
            <label className="text-sm font-semibold text-slate-500 dark:text-gray-400">
              เลือกธีม
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                onClick={() => setTheme("light")}
                className={`text-sm ${
                  theme === "light"
                    ? "bg-amber-500/50 border-amber-400"
                    : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400"
                }`}
              >
                <SunIcon /> สว่าง
              </Button>
              <Button
                onClick={() => setTheme("dark")}
                className={`text-sm ${
                  theme === "dark"
                    ? "bg-amber-500/50 border-amber-400"
                    : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-gray-400"
                }`}
              >
                <MoonIcon /> มืด
              </Button>
            </div>
          </div>
          {/* === [สิ้นสุด] === */}
        </div>

        <div className="mt-auto p-6 border-t border-slate-200 dark:border-emerald-700/20">
          <Button
            onClick={onLogout}
            className="w-full bg-red-200 dark:bg-red-900/30 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 hover:bg-red-300 dark:hover:bg-red-900/50 dark:hover:text-white"
          >
            ออกจากระบบ
          </Button>
        </div>
      </div>
    </>
  );
};

// === Rules & utils ===
const RULES = { main: { size: 50, maxCopiesPerName: 4, requireOnlyRank1Exactly: 1 }, life: { size: 5, uniqueNames: true, maxCopiesPerName: 1 }, };
const nameKey = (n) => (n || "").trim().toLowerCase();
function countBy(arr, keyFn) { return arr.reduce((m, x) => { const k = keyFn(x); m[k] = (m[k] || 0) + 1; return m; }, {}); }

function useLocalStorage(key, initial) { 
  const [v, s] = useState(() => { 
    try { 
      const raw = localStorage.getItem(key); 
      if (!raw || raw === "[]" || raw === "null") return initial;
      return JSON.parse(raw); 
    } catch { return initial; } 
  }); 
  useEffect(() => { 
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {} 
  }, [key, v]); 
  return [v, s]; 
}

function validate(mainDeck, lifeDeck) { const problems = []; const ok = { main: true, life: true }; if (mainDeck.length !== RULES.main.size) { problems.push(`Main Deck ต้องมี ${RULES.main.size} ใบ (ปัจจุบัน ${mainDeck.length})`); ok.main = false; } const byNameMain = countBy(mainDeck, (c) => nameKey(c.name)); const overCopies = Object.entries(byNameMain).filter(([, n]) => n > RULES.main.maxCopiesPerName); if (overCopies.length) { overCopies.forEach(([k, n]) => problems.push(`การ์ด “${k}” ใน Main Deck ซ้ำเกิน ${RULES.main.maxCopiesPerName} ใบ (มี ${n} ใบ)`)); ok.main = false; } const onlyRank1Count = mainDeck.filter((c) => c.onlyRank === 1).length; if (mainDeck.length > 0 && onlyRank1Count > 0 && onlyRank1Count !== RULES.main.requireOnlyRank1Exactly) { problems.push(`Main Deck สามารถมี “Only #1” ได้แค่ ${RULES.main.requireOnlyRank1Exactly} ใบ (ปัจจุบัน ${onlyRank1Count})`); ok.main = false; } if (lifeDeck.length !== RULES.life.size) { problems.push(`Life Deck ต้องมี ${RULES.life.size} ใบ (ปัจจุบัน ${lifeDeck.length})`); ok.life = false; } if (RULES.life.uniqueNames) { const byNameLife = countBy(lifeDeck, (c) => nameKey(c.name)); const duplicateLife = Object.entries(byNameLife).filter(([, n]) => n > 1); if (duplicateLife.length) { duplicateLife.forEach(([k]) => problems.push(`การ์ดใน Life Deck ต้องชื่อไม่ซ้ำกัน: “${k}”`)); ok.life = false; } } return { problems, ok }; }
const avg = (arr) => { const valid = arr.filter(n => typeof n === 'number' && !isNaN(n)); if (valid.length === 0) return '0.00'; return (valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2); };
const encodeDeckCode = (mainDeck, lifeDeck) => { const mainIds = mainDeck.map(c => c.id); const lifeIds = lifeDeck.map(c => c.id); const dataString = JSON.stringify({ m: mainIds, l: lifeIds }); try { return btoa(dataString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); } catch (e) { console.error("Encoding failed:", e); return ""; } };
const decodeDeckCode = (code, allCards) => { const trimmedCode = (code || "").trim(); if (!trimmedCode) return null; try { let base64 = trimmedCode.replace(/-/g, '+').replace(/_/g, '/'); while (base64.length % 4 !== 0) { base64 += '='; } const dataString = atob(base64); const data = JSON.parse(dataString); if (!data || !Array.isArray(data.m) || !Array.isArray(data.l)) { throw new Error("Invalid deck code format"); } const findCard = (id) => allCards.find(c => c.id === id); const main = data.m.map(findCard).filter(card => card !== undefined); const life = data.l.map(findCard).filter(card => card !== undefined); return { main, life }; } catch (e) { console.error("Decoding failed:", e); return null; } };

// === Drag & Drop and Animation Components ===
const DND_TYPES = { CARD: "CARD" };
const encodePath = (p) => p.split('/').map(encodeURIComponent).join('/');
const DndStateContext = createContext({ isDragging: false });
const DndStateProvider = ({ children }) => { const { isDragging } = useDragLayer((monitor) => ({ isDragging: monitor.isDragging() })); return <DndStateContext.Provider value={{ isDragging }}>{children}</DndStateContext.Provider>; };
const useIsDragging = () => useContext(DndStateContext);
function CustomDragLayer() { const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({ item: monitor.getItem(), isDragging: monitor.isDragging(), currentOffset: monitor.getSourceClientOffset(), })); if (!isDragging || !currentOffset) return null; const { card } = item;
  const encodedImagePath = encodePath(card.imagePath);
  const fileId = card.id.replace(/\s*(\(.*\)|- Only#1)$/, ''); // <-- 📍 แก้ไข
  const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
  return ( <div style={{ position: 'fixed', pointerEvents: 'none', zIndex: 1000, left: 0, top: 0, transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)` }}> <img src={imgPng} alt={card.name} className="w-40 h-auto rounded-lg shadow-2xl" /> </div> ); }
function FlyingCard({ card, startRect, endRect, onComplete }) { const [isAnimating, setIsAnimating] = useState(false); const hasCompleted = useRef(false); useEffect(() => { const timeoutId = setTimeout(() => setIsAnimating(true), 10); return () => clearTimeout(timeoutId); }, []); if (!card || !startRect || !endRect) return null; const handleTransitionEnd = () => { if (!hasCompleted.current) { hasCompleted.current = true; onComplete(); } }; const style = { position: 'fixed', zIndex: 1000, top: `${startRect.top}px`, left: `${startRect.left}px`, width: `${startRect.width}px`, height: `${startRect.height}px`, transition: 'all 0.5s ease-in-out' }; if (isAnimating) { style.top = `${endRect.top + endRect.height / 2 - 35}px`; style.left = `${endRect.left + endRect.width / 2 - 25}px`; style.width = '50px'; style.height = '70px'; style.opacity = 0; style.transform = 'rotate(15deg)'; } const encodedImagePath = encodePath(card.imagePath);
  const fileId = card.id.replace(/\s*(\(.*\)|- Only#1)$/, ''); // <-- 📍 แก้ไข
  const imgSrc = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
  return (
    <div style={style} onTransitionEnd={handleTransitionEnd}> <img src={imgSrc} alt={card.name} className="w-full h-full rounded-lg shadow-2xl" /> </div> ); }

// === Card component (draggable) ===
// === Card component (draggable) ===
const CardItem = forwardRef(function CardItem({ card, onDoubleClick, onViewDetails, onAddCard }, ref) { 
    const cardItemRef = useRef(null); 
    const { isDragging: isAnythingDragging } = useIsDragging(); 
    const [{ isDragging }, dragRef] = useDrag({ type: DND_TYPES.CARD, item: { card }, collect: (m) => ({ isDragging: m.isDragging() }) }); 
    const encodedImagePath = encodePath(card.imagePath); 
    const fileId = card.id.replace(' - Only#1', ''); 
    const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; 
    const imgJpg = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.jpg`; 
    
    // 📍
    // 📍 === [แก้ไข] เปลี่ยน z-50 เป็น z-[80] ตรงนี้ครับ ===
    // 📍
    const hoverClasses = !isAnythingDragging ? 'hover:scale-[1.25] hover:z-[80]' : ''; 
    
    return ( 
        <CardShell ref={cardItemRef} className={`flex flex-col card group relative ${isDragging ? 'opacity-0' : ''} transition-transform duration-200 ease-in-out ${hoverClasses}`}> 
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2"> 
                <button onClick={() => onViewDetails(card)} className="p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-full text-amber-600 dark:text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-black dark:hover:text-white" title="ดูรายละเอียด"> 
                    <EyeIcon /> 
                </button> 
                <button onClick={() => onAddCard(card)} className="p-1.5 bg-emerald-600/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 active:scale-95" title="เพิ่มลงเด็ค"> 
                    <PlusIcon /> 
                </button> 
            </div> 
            <img 
                ref={dragRef} 
                src={imgPng} 
                alt={card.name} 
                onDoubleClick={() => onDoubleClick(card, cardItemRef.current)} 
                onError={(e) => { 
                    if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = imgJpg; 
                    else { 
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = `https://placehold.co/300x420/1e293b/94a3b8?text=${encodeURIComponent(card.name)}`; 
                    } 
                }} 
                className="w-full h-auto rounded-md mb-3 object-cover aspect-[5/7] bg-slate-200 dark:bg-slate-700 shadow hover:shadow-xl transition-shadow cursor-grab active:cursor-grabbing" 
                loading="lazy" 
            /> 
            <div className="flex-grow flex flex-col justify-between"> 
                <div> 
                    <div className="flex justify-between items-start gap-2"> 
                        <p className="font-bold text-xl text-slate-900 dark:text-white pr-2 line-clamp-2">{card.name}</p> 
                        <div className="flex items-center gap-2 shrink-0"> 
                            {card.colorType && <ColorPip color={card.colorType} />} 
                            <Pill className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-gray-200">{card.type}</Pill> 
                        </div> 
                    </div> 
                    {card.rarity && <Pill className="mt-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{card.rarity}</Pill>} 
                    {card.onlyRank === 1 && <Pill className="mt-2 ml-1 bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">Only #1</Pill>} 
                </div> 
            </div> 
            <div className="absolute top-full mt-1 left-0 right-0 z-[60] p-4 bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-amber-500/50 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto max-h-96 overflow-y-auto"> 
                <div className="grid grid-cols-3 gap-2 text-center"> 
                    <div><span className="text-base text-emerald-600 dark:text-emerald-400">Cost</span><p className="font-bold text-2xl text-slate-900 dark:text-white">{card.cost ?? '-'}</p></div> 
                    <div><span className="text-base text-red-600 dark:text-red-400">Power</span><p className="font-bold text-2xl text-slate-900 dark:text-white">{card.power ?? '-'}</p></div> 
                    <div><span className="text-base text-amber-600 dark:text-amber-400">Gem</span><p className="font-bold text-2xl text-slate-900 dark:text-white">{card.gem ?? '-'}</p></div> 
                </div> 
                <div className="pt-2"> 
                    <p className="text-base text-slate-500 dark:text-gray-400">ฝ่าย: <span className="font-semibold text-slate-700 dark:text-gray-200">{card.faction ?? 'ไม่มี'}</span></p> 
                    <p className="text-base text-slate-700 dark:text-gray-300 font-light mt-1 break-words">{card.text || 'ไม่มีเอฟเฟ็ค'}</p> 
                    {card.flavor && ( 
                        <p className="text-sm text-amber-700/70 dark:text-amber-200/70 italic mt-2 font-light break-words">"{card.flavor}"</p> 
                    )} 
                </div> 
            </div> 
        </CardShell> 
    ); 
});
// === Deck Tray (droppable) ===
const DeckTray = forwardRef(function DeckTray(
  { title, deck, onDropCard, onRemoveCard, capacity, highlight, onViewDeck },
  ref
) {
  const [{ isOver }, dropRef] = useDrop({
    accept: DND_TYPES.CARD,
    drop: (item) => onDropCard(item.card),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });
  const groupedDeck = useMemo(() => {
    return Object.values(
      deck.reduce((m, card) => {
        const key = nameKey(card.name);
        if (!m[key]) m[key] = { card, count: 0 };
        m[key].count++;
        return m;
      }, {})
    ).sort((a, b) => a.card.name.localeCompare(b.card.name, "th"));
  }, [deck]);
  const cardsPerRow = 12;
  const numRows =
    groupedDeck.length > 0
      ? Math.floor((groupedDeck.length - 1) / cardsPerRow) + 1
      : 1;
  const containerHeight = numRows * 40 + 40;
  return (
    <div
      ref={ref}
      className={`p-2 rounded-md border-2 ${
        isOver || highlight
          ? "border-amber-400"
          : "border-slate-300 dark:border-slate-600"
      } transition-colors bg-slate-100 dark:bg-slate-900/50`}
    >
      <div ref={dropRef}>
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider shrink-0">
            {title}
          </h3>
          {onViewDeck && deck.length > 0 && (
            <button
              onClick={onViewDeck}
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-200 hover:underline transition"
            >
              ดูเด็ค
            </button>
          )}
          <div className="flex-grow text-right">
            {typeof capacity === "number" && (
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {deck.length}
                {capacity ? ` / ${capacity}` : ""}
              </span>
            )}
          </div>
        </div>
        <div className="relative w-full transition-all" style={{ height: `${containerHeight}px` }}>
          {groupedDeck.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
              ลากการ์ดมาวางที่นี่
            </div>
          ) : (
            <div className="absolute inset-0">
              {groupedDeck.map(({ card, count }, index) => {
                const encodedImagePath = encodePath(card.imagePath);
                const fileId = card.id.replace(" - Only#1", "");
                const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(
                  fileId
                )}.png`;
                const rowIndex = Math.floor(index / cardsPerRow);
                const colIndex = index % cardsPerRow;
                return (
                  <div
                    key={`${card.id}-${index}`}
                    className="absolute transition-all duration-200 ease-in-out group hover:-translate-y-2 hover:z-50"
                    style={{
                      left: `${colIndex * 22}px`,
                      top: `${rowIndex * 40}px`,
                      zIndex: colIndex,
                      width: "56px",
                    }}
                    title={`คลิกเพื่อลบ ${card.name}`}
                    onClick={() => onRemoveCard(card)}
                  >
                    <img
                      src={thumbPng}
                      alt={card.name}
                      className="w-full h-auto rounded-md shadow-lg border-2 border-slate-300 dark:border-slate-600 group-hover:border-red-500 cursor-pointer"
                      onError={(e) => {
                        if (!e.currentTarget.src.endsWith(".jpg")) {
                          e.currentTarget.src = e.currentTarget.src.replace(
                            ".png",
                            ".jpg"
                          );
                        }
                      }}
                    />
                    {count > 1 && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full border-2 border-white dark:border-slate-800">
                        {count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// === CardDetailModal ===
function CardDetailModal({ card, onClose }) { if (!card) return null; const encodedImagePath = encodePath(card.imagePath); const fileId = card.id.replace(' - Only#1', ''); const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`; const imgJpg = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.jpg`; return createPortal( <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[300] p-4" onClick={onClose}> <img src={imgPng} alt={card.name} className="max-w-full max-h-full h-auto w-auto object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} onError={(e) => { if (!e.currentTarget.src.endsWith('.jpg')) { e.currentTarget.src = imgJpg; } }} /> <button onClick={onClose} className="absolute top-4 right-4 text-white bg-slate-800/50 rounded-full p-2 hover:bg-slate-700"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button> </div>, document.body ); }

// === DeckViewModal ===
function DeckViewModal({ isOpen, onClose, deck, rules, onAddCard, onRemoveCard, title }) {
  const groupedDeck = useMemo(() => {
    if (!deck) return [];
    return Object.values(
      deck.reduce((m, card) => {
        const key = nameKey(card.name);
        if (!m[key]) m[key] = { card, count: 0 };
        m[key].count++;
        return m;
      }, {})
    ).sort((a, b) => a.card.name.localeCompare(b.card.name, 'th'));
  }, [deck]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[400] p-4">
      <div className="bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full h-full flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-emerald-500/20 shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title} ({deck.length} / {rules.size})
          </h2>
          <Button onClick={onClose}>Close</Button>
        </header>
        <div className="flex-grow overflow-y-auto p-4">
          {groupedDeck.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500 dark:text-slate-400">เด็คนี้ว่างเปล่า</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {groupedDeck.map(({ card, count }, index) => { // <-- [เพิ่ม] index
                const encodedImagePath = encodePath(card.imagePath);
                const fileId = card.id.replace(' - Only#1', '');
                const thumbPng = `${CARD_BASE_URL}/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
                const isAtMaxCopies = rules.maxCopiesPerName && count >= rules.maxCopiesPerName;
                return (
                  <div key={`${card.id}-${index}`} className="w-40 flex flex-col items-center"> {/* <-- [แก้ไข] key */}
                    <img src={thumbPng} alt={card.name} className="w-full rounded-lg shadow-md mb-2" />
                    <div className="w-full flex items-center justify-around gap-2 bg-slate-200 dark:bg-slate-800/50 p-1 rounded-md">
                      <button onClick={() => onRemoveCard(card)} className="flex items-center justify-center w-7 h-7 bg-red-700/70 dark:bg-red-800/70 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition active:scale-95 text-white font-bold text-xl">-</button>
                      <span className="font-bold text-lg text-slate-900 dark:text-white w-6 text-center">{count}</span>
                      <button onClick={() => onAddCard(card)} disabled={isAtMaxCopies} className="flex items-center justify-center w-7 h-7 bg-emerald-700/70 dark:bg-emerald-800/70 rounded-full hover:bg-emerald-600 dark:hover:bg-emerald-700 transition active:scale-95 text-white font-bold text-xl disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// =================================================================
// === 📍 [1] แก้ไข DeckAnalysisModal ให้รับ `showChart`
// =================================================================
function DeckAnalysisModal({ isOpen, onClose, mainDeck, lifeDeck, showAlert, theme, showChart }) { 
    const analysis = useMemo(() => {
        if (!mainDeck || mainDeck.length === 0) return null;
        const typeOrder = { 'Avatar': 1, 'Magic': 2, 'Construction': 3 };
        const only1Card = mainDeck.find(c => c.onlyRank === 1);
        const avatars = mainDeck.filter(c => c.type === 'Avatar' && c.onlyRank !== 1).sort((a, b) => a.name.localeCompare(b.name, 'th'));
        const magics = mainDeck.filter(c => c.type === 'Magic').sort((a, b) => a.name.localeCompare(b.name, 'th'));
        const constructs = mainDeck.filter(c => c.type === 'Construction').sort((a, b) => a.name.localeCompare(b.name, 'th'));
        const otherCards = mainDeck.filter(c => c.onlyRank !== 1 && !['Avatar', 'Magic', 'Construction'].includes(c.type)).sort((a, b) => (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99) || a.name.localeCompare(b.name, 'th'));
        const avgCost = avg(mainDeck.map(c => c.cost)); const avgPower = avg(mainDeck.map(c => c.power)); const avgGem = avg(mainDeck.map(c => c.gem));
        const typeCounts = countBy(mainDeck, c => c.type); const cardTypes = Object.entries(typeCounts).sort(([a], [b]) => (typeOrder[a] || 99) - (typeOrder[b] || 99));
        const labels = ['ความไวต้นเกม', 'กลางเกม', 'ท้ายเกม', 'พลังโจมตี', 'การป้องกัน', 'การสนับสนุน']; const maxStatValue = 100;
        const earlyGameScore = (mainDeck.filter(c => (c.cost ?? 0) <= 2).length / (mainDeck.length * 0.5)) * maxStatValue; const midGameScore = (mainDeck.filter(c => (c.cost ?? 0) >= 3 && (c.cost ?? 0) <= 5).length / (mainDeck.length * 0.4)) * maxStatValue; const lateGameScore = (mainDeck.filter(c => (c.cost ?? 0) >= 6).length / (mainDeck.length * 0.2)) * maxStatValue; const offenseScore = (parseFloat(avgPower) / 6) * maxStatValue; const defenseScore = (mainDeck.filter(c => c.type !== 'Magic').length / 40) * maxStatValue; const utilityScore = ((typeCounts['Magic'] || 0) / 15) * maxStatValue; 
        const radarData = { labels, datasets: [{ label: 'ศักยภาพเด็ค', data: [earlyGameScore, midGameScore, lateGameScore, offenseScore, defenseScore, utilityScore].map(v => Math.round(Math.min(100, Math.max(0, v || 0)))), backgroundColor: 'rgba(52, 211, 153, 0.2)', borderColor: 'rgb(52, 211, 153)', pointBackgroundColor: 'rgb(52, 211, 153)', pointBorderColor: '#000000ff', pointHoverBackgroundColor: '#000000ff', pointHoverBorderColor: 'rgb(52, 211, 153)' }]};
        
        // 🛑 [ลบ] radarOptions (Static) ที่เคยอยู่ตรงนี้
        
        const deckCode = encodeDeckCode(mainDeck, lifeDeck);
        
        // 🛑 [ลบ] radarOptions ออกจาก return นี้
        return { avgCost, avgPower, avgGem, cardTypes, radarData, deckCode, only1Card, avatars, magics, constructs, otherCards };
    
    }, [mainDeck, lifeDeck, theme]);

    // 📍 [สำคัญ] เราสร้าง "สวิตช์" ตรงนี้
    const isDark = theme === 'dark';

    // -----------------------------------------------------------------
    //  👇 ชุดสีสำหรับธีมมืด (ค่าแรก) และธีมสว่าง (ค่าสอง)
    // -----------------------------------------------------------------
    const gridColor = isDark 
        ? 'rgba(255, 255, 255, 0.2)' // ธีมมืด: เส้นตาราง (ขาว โปร่ง 20%)
        : 'rgba(0, 0, 0, 0.2)';       // 👈 (ธีมสว่าง: ดำ โปร่ง 20%)

    const angleLineColor = isDark 
        ? 'rgba(255, 255, 255, 0.2)' // ธีมมืด: เส้นแกน (ขาว โปร่ง 20%)
        : 'rgba(0, 0, 0, 0.2)';       // 👈 (ธีมสว่าง: ดำ โปร่ง 20%)

    const labelColor = isDark 
        ? 'rgb(209, 213, 219)'       // ธีมมืด: ตัวอักษร (เทาอ่อน)
        : 'rgb(30, 41, 59)';         // 👈 (ธีมสว่าง: เทาเข้ม)

    const tickColor = isDark 
        ? 'rgb(156, 163, 175)'       // ธีมมืด: ตัวเลข (เทา)
        : 'rgb(100, 116, 139)';      // 👈 (ธีมสว่าง: เทาเข้ม)

    const tickBackdrop = isDark 
        ? 'rgba(0, 0, 0, 0.5)'       // ธีมมืด: พื้นหลังตัวเลข (ดำ โปร่ง 50%)
        : 'rgba(255, 255, 255, 0.75)';// 👈 (ธีมสว่าง: ขาว โปร่ง 75%)

    // -----------------------------------------------------------------

    // 📍 [สำคัญ] สร้าง radarOptions โดยใช้ "ตัวแปรสี"
    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: angleLineColor }, // <-- ใช้ตัวแปร
                grid: { color: gridColor },       // <-- ใช้ตัวแปร
                pointLabels: { color: labelColor, font: { size: 12 } }, // <-- ใช้ตัวแปร
                ticks: {
                    color: tickColor,            // <-- ใช้ตัวแปร
                    backdropColor: tickBackdrop, // <-- ใช้ตัวแปร
                    stepSize: 20,
                    maxTicksLimit: 6,
                },
                min: 0,
                max: 100,
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        maintainAspectRatio: false
    };

    const handleCopyCode = () => { if (analysis?.deckCode) { navigator.clipboard.writeText(analysis.deckCode) .then(() => showAlert("Success!", `✅ คัดลอกรหัสเด็คลง Clipboard แล้ว!`)) .catch(err => { console.error('Failed to copy code: ', err); showAlert("Error", "ไม่สามารถคัดลอกรหัสเด็คได้"); }); } };
    
    if (!isOpen || !analysis) return null;

    <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-2 justify-center">
          {groupedCards.map(({ card, count }, index) => { // <-- [1] เพิ่ม index
            const encodedImagePath = encodePath(card.imagePath);
            const fileId = card.id.replace(' - Only#1', '');
            const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
            return (
              <div key={`${card.id}-${index}`} className="relative w-24"> {/* <-- [2] แก้ไข key */}
                <img src={thumbPng} alt={card.name} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} />
                {count > 1 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full border-2 border-white dark:border-slate-800">{count}</div>
                )}
              </div>
            );
          })}
        </div>

    return createPortal( <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[250] p-4"> <div className="bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full h-full flex flex-col max-w-7xl max-h-[90vh]"> <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-emerald-500/20 shrink-0"> <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ผลลัพธ์การสร้างเด็ค</h2> <Button onClick={onClose}>Close</Button> </header> <div className="flex-grow overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 p-6"> <div className="md:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2"> <div> <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-300 border-b border-amber-500/20 pb-1 mb-3">สถิติเด็ค</h3> <div className="grid grid-cols-3 gap-4 text-center"> <div><span className="text-sm text-gray-500 dark:text-gray-400">Avg Cost</span><p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{analysis.avgCost}</p></div> <div><span className="text-sm text-gray-500 dark:text-gray-400">Avg Power</span><p className="text-2xl font-bold text-red-600 dark:text-red-400">{analysis.avgPower}</p></div> <div><span className="text-sm text-gray-500 dark:text-gray-400">Avg Gem</span><p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{analysis.avgGem}</p></div> </div> </div>
        
        {/* ================================================================= */}
        {/* === 📍 [2] ซ่อน/แสดง กราฟหกเหลี่ยมตาม `showChart` === */}
        {/* ================================================================= */}
        {showChart && (
          <div className="aspect-square w-full max-w-[350px] mx-auto">
            <Radar data={analysis.radarData} options={radarOptions} />
          </div>
        )}

    <div> <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-300 border-b border-amber-500/20 pb-1 mb-3">ประเภทการ์ด</h3> <ul className="space-y-1 text-sm text-slate-700 dark:text-gray-300"> {analysis.cardTypes.map(([type, count]) => ( <li key={type} className="flex justify-between"> <span>{type}</span> <span className="text-slate-900 dark:text-white font-semibold">{count} ใบ</span> </li> ))} </ul> </div> <div> <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-300 border-b border-amber-500/20 pb-1 mb-3">รหัส Export</h3> <Button onClick={handleCopyCode} className="w-full"> <CopyIcon /> คัดลอกรหัสเด็ค </Button> </div> </div> <div className="md:col-span-2 overflow-y-auto pr-2 border-l border-slate-300 dark:border-emerald-500/20 pl-6"> <h3 className="text-xl font-semibold text-amber-600 dark:text-amber-300 border-b border-amber-500/20 pb-1 mb-4">การ์ดในเด็ค ({mainDeck.length} ใบ)</h3> {analysis.only1Card && ( <div className="mb-6 flex flex-col items-center"> <h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-300 mb-3">Only #1</h4> <div className="relative w-36 mx-auto"> <img src={`/cards/${encodePath(analysis.only1Card.imagePath)}/${encodeURIComponent(analysis.only1Card.id.replace(' - Only#1', ''))}.png`} alt={analysis.only1Card.name} className="w-full rounded-md shadow" onError={(e) => { e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg'); }} /> </div> </div> )} {renderCardSection("Avatar Cards", analysis.avatars)} {renderCardSection("Magic Cards", analysis.magics)} {renderCardSection("Construct Cards", analysis.constructs)} {analysis.otherCards.length > 0 && renderCardSection("Other Cards", analysis.otherCards)} </div> </div> </div> </div>, document.body ); }

// === Deck List Modal ===
function DeckListModal({
  isOpen,
  onClose,
  userProfile,
  userDecks,
  setUserDecks,
  mainDeck,
  lifeDeck,
  setMainDeck,
  setLifeDeck,
  showAlert,
  setModal,
  closeModal,
  encodeDeckCode,
  decodeDeckCode,
  allCards,
  onShowCards
}) {
  const [importingSlot, setImportingSlot] = useState(null);
  const [importCode, setImportCode] = useState('');

  if (!isOpen || !userProfile) return null;

  const email = userProfile.email;

  const getUserSlots = () => {
    const defaultSlots = [
      { name: "Slot 1", main: [], life: [] },
      { name: "Slot 2", main: [], life: [] }
    ];
    const userData = userDecks[email] || { slots: defaultSlots };
    if (!userDecks[email]) {
      setUserDecks(prev => ({ ...prev, [email]: userData }));
    }
    return userData.slots;
  };

  const slots = getUserSlots();

  const updateSlots = (newSlots) => {
    setUserDecks(prev => ({
      ...prev,
      [email]: { ...prev[email], slots: newSlots }
    }));
  };

  const handleNameChange = (index, newName) => {
    const newSlots = [...slots];
    newSlots[index].name = newName;
    updateSlots(newSlots);
  };

  const handleSave = (index) => {
    const newSlots = [...slots];
    newSlots[index] = {
      ...newSlots[index],
      main: mainDeck,
      life: lifeDeck
    };
    updateSlots(newSlots);
    showAlert("Deck Saved!", `บันทึกเด็คปัจจุบันลงใน "${newSlots[index].name}" แล้ว`);
  };

  const handleLoad = (index) => {
    const slot = slots[index];
    if (slot.main.length === 0 && slot.life.length === 0) {
      showAlert("Empty Slot", "Slot นี้ว่างเปล่า ไม่มีอะไรให้โหลด");
      return;
    }
    setMainDeck(slot.main);
    setLifeDeck(slot.life);
    showAlert("Deck Loaded!", `โหลดเด็ค "${slot.name}" เรียบร้อย`);
    onClose();
  };

  const handleExport = (index) => {
    const slot = slots[index];
    if (slot.main.length === 0 && slot.life.length === 0) {
      showAlert("Empty Slot", "ไม่สามารถ Export Slot ที่ว่างเปล่าได้");
      return;
    }
    const code = encodeDeckCode(slot.main, slot.life);
    navigator.clipboard.writeText(code)
      .then(() => showAlert("Success!", `✅ คัดลอกรหัส Export ของ "${slot.name}" แล้ว!`))
      .catch(err => showAlert("Error", "ไม่สามารถคัดลอกรหัสได้"));
  };

  const handleImport = (index) => {
    setImportingSlot(index);
    setImportCode('');
  };

  const confirmInternalImport = () => {
    const decoded = decodeDeckCode(importCode, allCards);
    if (decoded) {
      const newSlots = [...slots];
      newSlots[importingSlot].main = decoded.main;
      newSlots[importingSlot].life = decoded.life;
      updateSlots(newSlots);
      showAlert("Import Success", `นำเข้าเด็คลงใน "${slots[importingSlot].name}" สำเร็จ!`);
    } else {
      showAlert("Import Error", "รหัสเด็คไม่ถูกต้อง หรือไม่พบการ์ด");
    }
    setImportingSlot(null);
  };

  // [แก้ไข] เพิ่มฟังก์ชัน handleClearSlot เพื่อลบเด็คใน Slot
  const handleClearSlot = (index) => {
    setModal({
        title: "Clear Slot",
        message: `คุณต้องการล้างข้อมูลใน "${slots[index].name}" ใช่หรือไม่?`,
        onConfirm: () => {
            const newSlots = [...slots];
            newSlots[index] = { ...newSlots[index], main: [], life: [] };
            updateSlots(newSlots);
            closeModal();
            showAlert("Slot Cleared", "ล้างข้อมูลเรียบร้อยแล้ว");
        },
        confirmText: "Clear",
        confirmIcon: <TrashIcon />
    });
  };

const handleShareDeck = async (index) => {
  const slot = slots[index];
  const only1Card = slot.main.find(c => c.onlyRank === 1);
  if (!only1Card) {
    showAlert("ไม่สามารถแชร์ได้", "เด็คของคุณต้องมี 'Only #1' Card (การ์ดหลัก) ก่อนจึงจะแชร์ได้ค่ะ");
    return;
  }

  setModal({ 
    isOpen: true,
    title: "Confirm Share Deck",
    message: `คุณต้องการแชร์เด็ค "${slot.name}" สู่สาธารณะใช่หรือไม่? (ชื่อและรูปโปรไฟล์ Google ของคุณจะถูกแสดง)`,
    onConfirm: async () => {
      closeModal(); 
      try {
        const batch = writeBatch(db);
        const newDeckRef = doc(collection(db, "publicDecks")); 
        const deckId = newDeckRef.id;
        const allCardsInDeck = [...slot.main, ...slot.life];
        const factions = [...new Set(allCardsInDeck.map(c => c.faction).filter(Boolean))];

        const listData = {
          deckName: slot.name,
          only1CardData: {
            id: only1Card.id,
            name: only1Card.name,
            imagePath: only1Card.imagePath,
          },
          user: {
            name: userProfile.name,
            picture: userProfile.picture,
            email: userProfile.email,
          },
          sharedAt: serverTimestamp(),
          likeCount: 0,
          likedBy: [],
          factions: factions,
          viewCount: 0
        };

        const detailData = {
          mainDeck: slot.main.map(c => c.id),
          lifeDeck: slot.life.map(c => c.id),
        };

        batch.set(newDeckRef, listData); 
        const detailRef = doc(db, "publicDeckDetails", deckId);
        batch.set(detailRef, detailData);
        await batch.commit();

        console.log("Deck shared with ID: ", deckId);
        showAlert("แชร์สำเร็จ!", `เด็ค "${slot.name}" ของคุณถูกแชร์สู่สาธารณะแล้ว!`);

      } catch (e) {
        console.error("Error adding document: ", e);
        showAlert("เกิดข้อผิดพลาด", "ไม่สามารถแชร์เด็คได้ โปรดลองอีกครั้ง");
      }
      
    },
    confirmText: "Confirm Share",
    confirmIcon: <UploadIcon />
  });
};

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[220] p-4">
        <div className="bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-emerald-500/20 shrink-0">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Deck List Manager</h2>
            <Button onClick={onClose}>Close</Button>
          </header>
          
          <div className="flex-grow overflow-y-auto p-6">
            <p className="text-slate-700 dark:text-gray-300 mb-6">
              บันทึกเด็คของคุณที่เชื่อมต่อกับบัญชี: <span className="font-bold text-amber-600 dark:text-amber-300">{userProfile.name} ({userProfile.email})</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slots.map((slot, index) => {
                const deckSize = slot.main.length + slot.life.length;
                return (
                  <CardShell key={index} className="flex flex-col gap-4">
                    <input
                      type="text"
                      value={slot.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-white/50 dark:bg-slate-700/50 placeholder-gray-500 dark:placeholder-gray-400 text-slate-900 dark:text-white text-lg font-bold"
                    />
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {deckSize > 0 ? `มี ${slot.main.length} (Main) / ${slot.life.length} (Life) ใบ` : "Slot ว่าง"}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={() => handleLoad(index)} disabled={deckSize === 0} className="bg-emerald-200 dark:bg-emerald-600/30 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-300 dark:hover:bg-emerald-500/50 dark:hover:text-white">
                        Load
                      </Button>
                      <Button onClick={() => handleSave(index)} className="bg-amber-200 dark:bg-amber-600/30 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-300 dark:hover:bg-amber-500/50 dark:hover:text-white">
                        Save Current
                      </Button>
                    </div>

                    <Button
                      onClick={() => onShowCards({ main: slot.main, life: slot.life })}
                      disabled={deckSize === 0}
                      className="w-full bg-blue-200 dark:bg-blue-600/30 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-300 dark:hover:bg-blue-500/50 dark:hover:text-white"
                    >
                      <EyeIcon /> Show Cards
                    </Button>

                    <div className="grid grid-cols-3 gap-2">
                      <Button onClick={() => handleImport(index)}>
                        <ImportIcon /> Import
                      </Button>
                      <Button onClick={() => handleExport(index)} disabled={deckSize === 0}>
                        <ExportIcon /> Export
                      </Button>
                      <Button 
                        onClick={() => handleShareDeck(index)} 
                        disabled={deckSize === 0}
                        className="bg-blue-200 dark:bg-blue-600/30 border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-300 dark:hover:bg-blue-500/50 dark:hover:text-white"
                      >
                        <UploadIcon /> Share
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={() => handleClearSlot(index)} 
                      className="w-full mt-2 bg-red-200 dark:bg-red-900/30 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-300 dark:hover:bg-red-800/50 dark:hover:text-white"
                    >
                       <TrashIcon /> Clear Slot
                    </Button>

                  </CardShell>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {importingSlot !== null && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[230] p-4">
          <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Import Deck Code (to {slots[importingSlot].name})</h2>
            <textarea
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              placeholder="วางรหัสเด็คที่นี่..."
              rows="4"
              className="w-full px-3 py-2 border border-slate-300 dark:border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-white dark:bg-slate-700/50 placeholder-gray-400 text-slate-900 dark:text-white mb-6 resize-none"
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setImportingSlot(null)} className="bg-slate-200 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</Button>
              <Button onClick={confirmInternalImport} className="bg-emerald-200 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-300 dark:hover:bg-emerald-800/50 dark:hover:text-white">
                <ImportIcon /> Import
              </Button>
            </div>
          </div>
        </div>, document.body
      )}
    </>,
    document.body
  );
}

// === Sidebar ===
function LeftSidebar({
  isSidebarOpen,
  searchTerm,
  setSearchTerm,
  allCardTypes,
  filterTypes,
  setFilterTypes,
  filterMagicType,
  setFilterMagicType,
  allColorTypes,
  filterColors,
  setFilterColors,
  allRarities,
  filterRarities,
  setFilterRarities,
  allSets,
  selectedSets,
  onSetSelectionChange,
  statFilters,
  onStatFilterChange,
  mainDeck,
  lifeDeck,
  RULES,
  addToMain,
  addToLife,
  removeFromMain,
  removeFromLife,
  handleImport,
  handleExport,
  handleClear,
  handleReloadFromTxt,
  mainDeckRef,
  onViewDeck,
  onAnalyzeDeck,
  isLoadingAnalysis,
}) {
  const allMagicTypes = ["Modification", "Land", "React", "Normal"];
  const handleToggle = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };
  return (
    <aside
      className={`w-full flex flex-col p-4 bg-white/40 dark:bg-black/40 md:h-full md:w-full md:shrink-0 md:border-r border-slate-300 dark:border-emerald-700/30 backdrop-blur-lg z-30 transition-opacity duration-300 ${
        isSidebarOpen ? "opacity-100" : "opacity-0 md:opacity-100"
      }`}
    >
      <div className="flex-1 md:overflow-y-auto pr-2 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Filters
          </h2>
          <input
            type="search"
            placeholder="ค้นหาชื่อการ์ด..."
            className="w-full px-4 py-2 border border-slate-300 dark:border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-white/50 dark:bg-slate-700/50 placeholder-gray-500 dark:placeholder-gray-400 text-slate-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {allCardTypes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterTypes([])}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filterTypes.length === 0
                  ? "bg-amber-500 text-white font-semibold shadow"
                  : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"
              }`}
            >
              All
            </button>
            {allCardTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleToggle(setFilterTypes, type)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filterTypes.includes(type)
                    ? "bg-amber-500 text-white font-semibold shadow"
                    : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
        {filterTypes.includes("Magic") && (
          <div className="pl-4 mt-2 border-l-2 border-slate-300 dark:border-slate-600">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 mt-2 mb-2 uppercase tracking-wider">
              Magic Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {["All", ...allMagicTypes].map((magicType) => (
                <button
                  key={magicType}
                  onClick={() => setFilterMagicType(magicType)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filterMagicType === magicType
                      ? "bg-amber-600 text-white font-semibold shadow"
                      : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-700 dark:text-gray-300"
                  }`}
                >
                  {magicType}
                </button>
              ))}
            </div>
          </div>
        )}
        {allColorTypes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 mt-4 mb-2 uppercase tracking-wider">
              Color
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterColors([])}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filterColors.length === 0
                    ? "bg-amber-500 text-white font-semibold shadow"
                    : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"
                }`}
              >
                All
              </button>
              {allColorTypes.map((color) => (
                <button
                  key={color}
                  onClick={() => handleToggle(setFilterColors, color)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filterColors.includes(color)
                      ? "bg-amber-500 text-white font-semibold shadow"
                      : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
        {allRarities.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 mt-4 mb-2 uppercase tracking-wider">
              Rarity
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterRarities([])}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filterRarities.length === 0
                    ? "bg-amber-500 text-white font-semibold shadow"
                    : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"
                }`}
              >
                All
              </button>
              {allRarities.map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => handleToggle(setFilterRarities, rarity)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filterRarities.includes(rarity)
                      ? "bg-amber-500 text-white font-semibold shadow"
                      : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-gray-300"
                  }`}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>
        )}
        {allSets.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 mt-4">
              Sets
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {allSets.map((set) => (
                <label
                  key={set}
                  className="flex items-center gap-2 text-slate-700 dark:text-gray-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSets.includes(set)}
                    onChange={() => onSetSelectionChange(set)}
                    className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-600 border-slate-400 dark:border-slate-500 text-amber-500 focus:ring-amber-500"
                  />
                  {typeof set === "string" ? set.split("/")[1] || set : set}
                </label>
              ))}
            </div>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 mt-4">
            Stats
          </h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {["cost", "power", "gem"].map((stat) => (
              <div key={stat}>
                <label className="capitalize text-slate-500 dark:text-gray-400">
                  {stat}
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={statFilters[stat].min}
                  onChange={(e) =>
                    onStatFilterChange(stat, "min", e.target.value)
                  }
                  className="w-full mt-1 px-2 py-1 border border-slate-300 dark:border-emerald-500/30 rounded-md bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-center"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={statFilters[stat].max}
                  onChange={(e) =>
                    onStatFilterChange(stat, "max", e.target.value)
                  }
                  className="w-full mt-1 px-2 py-1 border border-slate-300 dark:border-emerald-500/30 rounded-md bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="shrink-0 pt-4">
        <div className="flex flex-col gap-4 mb-4">
          <DeckTray
            ref={mainDeckRef}
            title={`Main Deck`}
            deck={mainDeck}
            capacity={RULES.main.size}
            onDropCard={addToMain}
            onRemoveCard={removeFromMain}
            highlight
            onViewDeck={() => onViewDeck("main")}
          />
          <DeckTray
            title={`Life Deck`}
            deck={lifeDeck}
            capacity={RULES.life.size}
            onDropCard={addToLife}
            onRemoveCard={removeFromLife}
            onViewDeck={() => onViewDeck("life")}
          />
        </div>
        <Button
          onClick={onAnalyzeDeck}
          disabled={isLoadingAnalysis}
          className="w-full bg-emerald-200 dark:bg-emerald-600/30 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-300 dark:hover:bg-emerald-500/50 dark:hover:text-white"
        >
          {isLoadingAnalysis ? "กำลังประมวลผล..." : "สร้างเด็ค"}
        </Button>
        <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-300 dark:border-emerald-700/30">
          <Button onClick={handleImport}>
            <ImportIcon /> Import
          </Button>
          <Button onClick={handleExport}>
            <ExportIcon /> Export
          </Button>
          <Button
            onClick={handleClear}
            className="col-span-2 bg-red-200 dark:bg-red-900/50 border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-300 dark:hover:bg-red-800/50 dark:hover:text-white"
          >
            <TrashIcon /> Clear Deck
          </Button>
          <Button onClick={handleReloadFromTxt} className="col-span-2">
            <DBLoadIcon /> Reload from TXT
          </Button>
        </div>
      </div>
    </aside>
  );
}

// === Card grid (right) ===
function CardGrid({ cards, onDoubleClick, onViewDetails, onAddCard }) {
  if (cards.length === 0) {
    return (
      <CardShell>
        <div className="text-center py-16 text-slate-600 dark:text-slate-300">
          ไม่พบการ์ดตามเงื่อนไข
        </div>
      </CardShell>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
      {cards.map((card, index) => ( // <-- [1] เพิ่ม index
        <CardItem
          key={`${card.id}-${index}`} // <-- [2] แก้ไข key
          card={card}
          onDoubleClick={onDoubleClick}
          onViewDetails={onViewDetails}
          onAddCard={onAddCard}
        />
      ))}
    </div>
  );
}

<<<<<<< HEAD
// === 📍 [1] ตัวแปร Config หลัก ===
// นี่คือ Config ที่ถูกต้องตามโครงสร้างโฟลเดอร์ของคุณ
// 'imagePath' คือที่อยู่ของ "โฟลเดอร์รูปภาพ"
// 'dataFile' คือ "ชื่อไฟล์ .txt"
const CARD_PATHS_CONFIG = [
  { imagePath: "002.STARTER DECK (SD01 - SD07)/SD01 - ตัวตึงไกรลาส", dataFile: "cardsSD01 - ตัวตึงไกรลาส.txt" },
  { imagePath: "002.STARTER DECK (SD01 - SD07)/SD02 - วีรบุรุษปากซอย", dataFile: "cardsSD02 - วีรบุรุษปากซอย.txt" },
  { imagePath: "002.STARTER DECK (SD01 - SD07)/SD03 - นรกก็แค่น้ำพริก", dataFile: "cardsSD03 - นรกก็แค่น้ำพริก.txt" },
  { imagePath: "002.STARTER DECK (SD01 - SD07)/SD04 - ทหารไก่ชนเขา", dataFile: "cardsSD04 - ทหารไก่ชนเขา.txt" },
  { imagePath: "002.STARTER DECK (SD01 - SD07)/SD05 - กำเนิดจากน้ำ", dataFile: "cardsSD05 - กำเนิดจากน้ำ.txt" },
  { imagePath: "002.STARTER DECK (SD01 - SD07)/SD06 - ๖ ประจัญบาน", dataFile: "cardsSD06 - ๖ ประจัญบาน.txt" },
  { imagePath: "002.STARTER DECK (SD01 - SD07)/SD07 - VS 18 หัวเมือง", dataFile: "cardsSD07 - VS 18 หัวเมือง.txt" },

  { imagePath: "003.BOOSTER (BT01 - BT07)/BT01 - Welcome ตลิ่งชัน", dataFile: "cardsBT01 - Welcome ตลิ่งชัน.txt" },
  { imagePath: "003.BOOSTER (BT01 - BT07)/BT02 - Attack on เพื่อนบ้าน", dataFile: "cardsBT02 - Attack on เพื่อนบ้าน.txt" },
  { imagePath: "003.BOOSTER (BT01 - BT07)/BT03 - อมนุษย์ Invasion", dataFile: "cardsBT03 - อมนุษย์ Invasion.txt" },
  { imagePath: "003.BOOSTER (BT01 - BT07)/BT04 - ความจริง Today", dataFile: "cardsBT04 - ความจริง Today.txt" },
  { imagePath: "003.BOOSTER (BT01 - BT07)/BT05 - Culture ช๊อต", dataFile: "cardsBT05 - Culture ช๊อต.txt" },
  { imagePath: "003.BOOSTER (BT01 - BT07)/BT06 - โลกา Amagedon", dataFile: "cardsBT06 - โลกา Amagedon.txt" },
  { imagePath: "003.BOOSTER (BT01 - BT07)/BT07 - Life of หน่วง", dataFile: "cardsBT07 - Life of หน่วง.txt" },

  { imagePath: "004.COMMUNITY COLLECTION (CC01)/CC01 - Community Collection", dataFile: "cardsCC01 - Community Collection.txt" },
  { imagePath: "005.SELECTION (SL01)/SL01 - Selection", dataFile: "cardsSL01 - Selection.txt" },
  { imagePath: "006.ODENYA (ODY1) - REPRINT/ODY1 - Odenya", dataFile: "cardsODY1 - Odenya.txt" }
];

// === 📍 [2] ฟังก์ชันโหลดข้อมูลที่แก้ไขแล้ว ===
// ฟังก์ชันนี้จะไปดึงไฟล์ .txt ทั้งหมดจากโฟลเดอร์ "003.BOOSTER..."
// (ตามที่คุณแจ้งผมในคำสั่งล่าสุด)
async function fetchAllTxt() { 
  let allCards = []; 
  console.log("📦 Reloading cards from TXT..."); 

  // โฟลเดอร์หลักที่เก็บ .txt *ทั้งหมด*
  const dataFolder = "003.BOOSTER (BT01 - BT07)";

  for (const { imagePath, dataFile } of CARD_PATHS_CONFIG) { 

    // สร้าง Path ไปยังไฟล์ .txt ที่ถูกต้อง (e.g., /cards/003.BOOSTER.../cardsSD01....txt)
    const url = `${CARD_BASE_URL}/${encodePath(dataFolder)}/${encodeURIComponent(dataFile)}`; 

=======
// 📍 [แก้ไข] วางทับตัวแปร CARD_PATHS เดิม

const CARD_PATHS = [
  // --- Starter Decks (จากครั้งก่อน) ---
  { 
    path: "002.STARTER DECK (SD01 - SD07)/SD01 - ตัวตึงไกรลาส", 
    file: "cardsSD01 - ตัวตึงไกรลาส.txt" 
  },
  { 
    path: "002.STARTER DECK (SD01 - SD07)/SD02 - วีรบุรุษปากซอย", 
    file: "cardsSD02 - วีรบุรุษปากซอย.txt" 
  },
  { 
    path: "002.STARTER DECK (SD01 - SD07)/SD03 - นรกก็แค่น้ำพริก", 
    file: "cardsSD03 - นรกก็แค่น้ำพริก.txt" 
  },
  { 
    path: "002.STARTER DECK (SD01 - SD07)/SD04 - ทหารไก่ชนเขา", 
    file: "cardsSD04 - ทหารไก่ชนเขา.txt" 
  },
  { 
    path: "002.STARTER DECK (SD01 - SD07)/SD05 - กำเนิดจากน้ำ", 
    file: "cardsSD05 - กำเนิดจากน้ำ.txt" 
  },
  { 
    path: "002.STARTER DECK (SD01 - SD07)/SD06 - ๖ ประจัญบาน", 
    file: "cardsSD06 - ๖ ประจัญบาน.txt" 
  },
  { 
    path: "002.STARTER DECK (SD01 - SD07)/SD07 - VS 18 หัวเมือง", 
    file: "cardsSD07 - VS 18 หัวเมือง.txt" 
  },

  // --- [ใหม่] Booster Set (BT01 - BT07) ---
  // (ผมอิงจากรูปและ Path ที่คุณส่งมานะครับ)
  { 
    path: "003.BOOSTER (BT01 - BT07)/BT01 - Welcome ตลิ่งชัน", 
    file: "cardsBT01 - Welcome ตลิ่งชัน.txt" // (❗️ ต้องแน่ใจว่าชื่อไฟล์ .txt ตรงกัน)
  },
  { 
    path: "003.BOOSTER (BT01 - BT07)/BT02 - Attack on เพื่อนบ้าน", 
    file: "cardsBT02 - Attack on เพื่อนบ้าน.txt" // (❗️ ต้องแน่ใจว่าชื่อไฟล์ .txt ตรงกัน)
  },
  { 
    path: "003.BOOSTER (BT01 - BT07)/BT03 - อมนุษย์ Invasion", 
    file: "cardsBT03 - อมนุษย์ Invasion.txt" // (❗️ ต้องแน่ใจว่าชื่อไฟล์ .txt ตรงกัน)
  },
  { 
    path: "003.BOOSTER (BT01 - BT07)/BT04 - ความจริง Today", 
    file: "cardsBT04 - ความจริง Today.txt" // (❗️ ต้องแน่ใจว่าชื่อไฟล์ .txt ตรงกัน)
  },
  { 
    path: "003.BOOSTER (BT01 - BT07)/BT05 - Culture ช๊อค",
    file: "cardsBT05 - Culture ช๊อค.txt"  // (❗️ ต้องแน่ใจว่าชื่อไฟล์ .txt ตรงกัน)
  },
  { 
    path: "003.BOOSTER (BT01 - BT07)/BT06 - โลกา Amagedon", 
    file: "cardsBT06 - โลกา Amagedon.txt" // (❗️ ต้องแน่ใจว่าชื่อไฟล์ .txt ตรงกัน)
  },
  { 
    path: "003.BOOSTER (BT01 - BT07)/BT07 - Life of หน่วง", 
    file: "cardsBT07 - Life of หน่วง.txt" // (❗️ ต้องแน่ใจว่าชื่อไฟล์ .txt ตรงกัน)
  },
  {
    path: "005.SELECTION (SL01)/SL01 - Selection",
    file: "cardsSL01 - Selection.txt"
  },
  {
    path: "004.COMMUNITY COLLECTION (CC01)/CC01 - Community Collection",
    file: "cardsCC01 - Community Collection.txt"
  },
  {
    path: "006.ODENYA (ODY1) - REPRINT/ODY1 - Odenya",
    file: "cardsODY1 - Odenya.txt"
  }
];
async function fetchAllTxt() { 
  let allCards = []; 
  console.log("📦 Reloading cards from TXT..."); 
  
  // [สำคัญ] มันต้องวนลูป for...of... แบบนี้
  for (const { path: pathString, file: filename } of CARD_PATHS) { 
    
    const encodedPath = encodePath(pathString); //
    const url = `/cards/${encodedPath}/${encodeURIComponent(filename)}`; //
    
>>>>>>> 704457fda15d4a9fc176ee24375cb7345e75e65d
    try { 
      const res = await fetch(url); 
      if (!res.ok) { 
        console.warn(`Could not fetch ${url}. Status: ${res.status}`); 
        continue; 
      } 
      const txt = await res.text(); 
<<<<<<< HEAD
      const data = JSON.parse(txt);
      if (Array.isArray(data)) { 
        // 'imagePath' คือที่อยู่ของรูปภาพ (ถูกต้องแล้ว)
        const withPath = data.map(card => ({ ...card, imagePath: imagePath, onlyRank: card.id.includes('- Only#1') ? 1 : card.onlyRank }));
        allCards = allCards.concat(withPath); 
        console.log(`  ✔ ${data.length} from ${dataFile} (Image Path: ${imagePath})`); 
=======
      const data = JSON.parse(txt); //
      if (Array.isArray(data)) { 
        // นี่คือส่วนที่กำหนด Path ของ "รูปภาพ"
        const withPath = data.map(card => ({ ...card, imagePath: pathString, onlyRank: card.id.includes('- Only#1') ? 1 : card.onlyRank })); //
        allCards = allCards.concat(withPath); 
        console.log(`  ✔ ${data.length} from ${pathString} (File: ${filename})`); 
>>>>>>> 704457fda15d4a9fc176ee24375cb7345e75e65d
      } 
    } catch (e) { 
      console.error(`load fail ${url}`, e); 
    } 
  } 
  console.log(`✅ โหลดการ์ดทั้งหมด ${allCards.length} ใบ`); 
  return allCards; 
}

const getMagicSubType = (card) => { 
  if (card.type !== 'Magic') { 
    return null; 
  } 
  return card.magicType || 'Normal'; 
};

// === Main App ===
export default function App() {
  const [theme, setTheme] = useLocalStorage('bot-theme', 'dark'); // <--- [เพิ่ม] State สำหรับธีม
  const [mainDeck, setMainDeck] = useLocalStorage("bot-mainDeck-v32-final", []); 
  const [lifeDeck, setLifeDeck] = useLocalStorage("bot-lifeDeck-v32-final", []); 
  const [cardDb, setCardDb] = useLocalStorage("bot-cardDb-v32-final", []);
  
  const [userDecks, setUserDecks] = useLocalStorage("bot-userDecks-v1", {});
  const [isDeckListModalOpen, setIsDeckListModalOpen] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false); 
  const [flyingCard, setFlyingCard] = useState(null); 
  const mainDeckRef = useRef(null); 
  const [zoomedCard, setZoomedCard] = useState(null); 
  
  // =================================================================
  // === 📍 [3] แก้ไข State `analysisDeck`
  // =================================================================
  const [analysisDeck, setAnalysisDeck] = useState({ deck: null, showChart: true }); // null | { main, life }
  
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false); 
  
  const [activeView, setActiveView] = useState('cards');
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filterTypes, setFilterTypes] = useState([]); 
  const [filterMagicType, setFilterMagicType] = useState("All"); 
  const [filterColors, setFilterColors] = useState([]); 
  const [filterRarities, setFilterRarities] = useState([]); 
  const [selectedSets, setSelectedSets] = useState([]); 
  const [statFilters, setStatFilters] = useState({ cost: { min: '', max: '' }, power: { min: '', max: '' }, gem: { min: '', max: '' } });
  const allCardTypes = useMemo(() => Array.from(new Set(cardDb.map(c => c.type).filter(Boolean))).sort(), [cardDb]); 
  const allColorTypes = useMemo(() => Array.from(new Set(cardDb.map(c => c.colorType).filter(Boolean))).sort(), [cardDb]); 
  const allRarities = useMemo(() => Array.from(new Set(cardDb.map(c => c.rarity).filter(Boolean))).sort(), [cardDb]); 
  const allSets = useMemo(() => Array.from(new Set(CARD_PATHS_CONFIG.map(c => c.imagePath).filter(Boolean))).sort(), []);const [currentPage, setCurrentPage] = useState(1); 
  const PAGE_SIZE = 30;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null }); 
  const [isImportModalOpen, setIsImportModalOpen] = useState(false); 
  const closeModal = () => setModal({ isOpen: false, title: '', message: '', onConfirm: null }); 
  const showAlert = (title, message) => setModal({ isOpen: true, title, message, onConfirm: null }); 
  const closeImportModal = () => setIsImportModalOpen(false);

  const [userProfile, setUserProfile] = useLocalStorage("bot-userProfile-v1", null);

  const [customProfile, setCustomProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const displayUser = useMemo(() => {
    if (!userProfile) return null;
    if (!customProfile) return userProfile;
    return {
      ...userProfile,
      name: customProfile.displayName || userProfile.name,
      picture: customProfile.avatarUrl || userProfile.picture
    };
  }, [userProfile, customProfile]);

  const fetchUserProfile = async (email) => {
    if (!email) return;
    try {
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCustomProfile(data);
        if (!data.isSetup) setIsProfileModalOpen(true);
      } else {
        setIsProfileModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUserProfile({ name: decoded.name, email: decoded.email, picture: decoded.picture });
      
      if (!userDecks[decoded.email]) {
        setUserDecks(prev => ({
          ...prev,
          [decoded.email]: {
            slots: [ { name: "Slot 1", main: [], life: [] }, { name: "Slot 2", main: [], life: [] } ]
          }
        }));
      }
      fetchUserProfile(decoded.email);

    } catch (error) { console.error("Failed to decode JWT:", error); }
  };

  const handleLoginError = () => { showAlert("Login Failed", "ไม่สามารถเข้าสู่ระบบได้"); };

  const handleLogout = () => {
    googleLogout(); 
    setUserProfile(null);
    setCustomProfile(null);
    setIsDeckListModalOpen(false);
    setIsSettingsOpen(false);
  };

  const handleSaveProfile = async (data) => {
    if (!userProfile) return;
    try {
      const batch = writeBatch(db);
      
      // 1. อัปเดตข้อมูล User หลัก
      batch.set(doc(db, "users", userProfile.email), { 
        displayName: data.displayName, 
        avatarUrl: data.avatarUrl, 
        isSetup: true, 
        updatedAt: serverTimestamp() 
      }, { merge: true });
      
      // 2. อัปเดตหน้าปกเด็ค (Public Decks) ของเรา
      const decksSnap = await getDocs(query(collection(db, "publicDecks"), where("user.email", "==", userProfile.email)));
      decksSnap.forEach(doc => batch.update(doc.ref, { "user.name": data.displayName, "user.picture": data.avatarUrl }));

      // 3. อัปเดตคอมเม้นท์ทั้งหมด (ใช้วิธีเดินหาทีละเด็ค เพื่อความชัวร์และไม่ง้อ Index)
      const allDecksSnap = await getDocs(collection(db, "publicDecks"));
      const currentName = customProfile?.displayName || userProfile.name;
      const oldNameTarget = "Siwakorn Reangchinda"; // ชื่อเก่าที่ต้องการแก้ (Fallback)

      for (const deckDoc of allDecksSnap.docs) {
         const commentsSnap = await getDocs(collection(db, "publicDecks", deckDoc.id, "comments"));
         commentsSnap.forEach(cDoc => {
           const cData = cDoc.data();
           // เช็คว่าเป็นคอมเม้นท์ของเราหรือไม่ (เช็คอีเมล, ชื่อปัจจุบัน, หรือชื่อเก่า)
           if (cData.userId === userProfile.email || cData.userName === currentName || cData.userName === oldNameTarget) {
             batch.update(cDoc.ref, { 
               userId: userProfile.email, // ยึดเป็นของเรา
               userName: data.displayName, 
               userPicture: data.avatarUrl 
             });
           }
         });
      }

      await batch.commit();
      setCustomProfile(p => ({ ...p, ...data, isSetup: true })); 
      setIsProfileModalOpen(false); 
      showAlert("Success", "บันทึกข้อมูลเรียบร้อย!");
    } catch (e) { 
      console.error(e); 
      showAlert("Error", "บันทึกไม่สำเร็จ"); 
    }
  };
  useEffect(() => {
    const root = document.documentElement; // (แท็ก <html>)
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  useEffect(() => { if (cardDb.length === 0) { handleReloadFromTxt(); } }, []);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterTypes, filterMagicType, filterColors, filterRarities, selectedSets, statFilters]);
  useEffect(() => {
    if (userProfile?.email) fetchUserProfile(userProfile.email);
  }, []);

  // =================================================================
  // === 📍 [4] แก้ไข handleAnalyzeDeck ให้ตั้ง `showChart: true`
  // =================================================================
  const handleAnalyzeDeck = () => { 
    if (mainDeck.length === 0) { showAlert("ไม่มีการ์ดในเด็ค", "โปรดใส่การ์ดใน Main Deck ก่อนทำการสร้างเด็ค"); return; } 
    setIsLoadingAnalysis(true); 
    setTimeout(() => { 
      setIsLoadingAnalysis(false); 
      setAnalysisDeck({ deck: { main: mainDeck, life: lifeDeck }, showChart: true }); 
    }, 500); 
  };
  
  const handleReloadFromTxt = async () => { const all = await fetchAllTxt(); if (all.length > 0) setCardDb(all); };
  const handleSetSelectionChange = (set) => { setSelectedSets(prev => prev.includes(set) ? prev.filter(s => s !== set) : [...prev, set]); };
  const handleStatFilterChange = (stat, field, value) => { const numValue = value === '' ? '' : Math.max(0, parseInt(value, 10)); setStatFilters(prev => ({ ...prev, [stat]: { ...prev[stat], [field]: numValue } })); };

  const filteredCardDb = useMemo(() => { if (cardDb.length === 0) return []; return cardDb.filter((c) => { const term = searchTerm.toLowerCase(); if (!((c.name?.toLowerCase().includes(term) || (c.text || "").toLowerCase().includes(term)))) return false; if (selectedSets.length > 0 && !selectedSets.includes(c.imagePath)) return false; if (statFilters.cost.min !== '' && (c.cost ?? 0) < statFilters.cost.min) return false; if (statFilters.cost.max !== '' && (c.cost ?? 0) > statFilters.cost.max) return false; if (statFilters.power.min !== '' && (c.power ?? 0) < statFilters.power.min) return false; if (statFilters.power.max !== '' && (c.power ?? 0) > statFilters.power.max) return false; if (statFilters.gem.min !== '' && (c.gem ?? 0) < statFilters.gem.min) return false; if (statFilters.gem.max !== '' && (c.gem ?? 0) > statFilters.gem.max) return false; if (filterColors.length > 0 && !filterColors.includes(c.colorType)) return false; if (filterRarities.length > 0 && !filterRarities.includes(c.rarity)) return false; if (filterTypes.length > 0 && !filterTypes.includes(c.type)) return false; if (c.type === 'Magic' && filterTypes.includes('Magic') && filterMagicType !== 'All') { if (getMagicSubType(c) !== filterMagicType) { return false; } } return true; }); }, [cardDb, searchTerm, filterTypes, filterMagicType, filterColors, filterRarities, selectedSets, statFilters]);
  const totalPages = Math.ceil(filteredCardDb.length / PAGE_SIZE); const startIndex = (currentPage - 1) * PAGE_SIZE; const endIndex = startIndex + PAGE_SIZE; const paginatedCards = filteredCardDb.slice(startIndex, endIndex);
  const [viewingDeck, setViewingDeck] = useState(null);

  const addToMain = (card) => { if (card.lifeEligible) { showAlert("ไม่สามารถเพิ่มได้", `การ์ด "${card.name}" เป็นการ์ดสำหรับ Life Deck เท่านั้น`); return; } if (card.onlyRank === 1 && mainDeck.some(c => c.onlyRank === 1)) { showAlert("Rule Violation", "You can only have one 'Only #1' card in your Main Deck."); return; } if (mainDeck.filter(c => nameKey(c.name) === nameKey(card.name)).length >= RULES.main.maxCopiesPerName) { showAlert("Rule Violation", `You cannot have more than ${RULES.main.maxCopiesPerName} copies of "${card.name}".`); return; } if (mainDeck.length >= RULES.main.size) { showAlert("Deck Full", "Your Main Deck has reached the 50-card limit."); return; } setMainDeck(prev => [...prev, card]); };
  const removeFromMain = (card) => { const idx = mainDeck.findLastIndex(c => nameKey(c.name) === nameKey(card.name)); if (idx > -1) setMainDeck(prev => prev.filter((_, i) => i !== idx)); };
  const addToLife = (card) => { if (!card.lifeEligible) { showAlert("Invalid Card", `การ์ด "${card.name}" ไม่สามารถใส่ใน Life Deck ได้`); return; }; if (lifeDeck.length >= RULES.life.size) { showAlert("Deck Full", `Life Deck เต็มแล้ว (ใส่ได้ ${RULES.life.size} ใบ)`); return; }; if (!lifeDeck.some(c => nameKey(c.name) === nameKey(card.name))) { setLifeDeck(prev => [...prev, card]); } else { showAlert("Duplicate Card", `การ์ดชื่อ "${card.name}" มีใน Life Deck แล้ว (ชื่อห้ามซ้ำ)`); } };
  const removeFromLife = (card) => { const idx = lifeDeck.findIndex(c => c.id === card.id); if (idx > -1) setLifeDeck(prev => prev.filter((_, i) => i !== idx)); };
  const handleCardDoubleClick = (card, cardElement) => { if (isAnimating || !cardElement || !mainDeckRef.current) return; if (card.lifeEligible) { showAlert("ไม่สามารถเพิ่มได้", `การ์ด "${card.name}" เป็นการ์ดสำหรับ Life Deck เท่านั้น โปรดลากไปวางใน Life Deck`); return; } setIsAnimating(true); const startRect = cardElement.getBoundingClientRect(); const endRect = mainDeckRef.current.getBoundingClientRect(); setFlyingCard({ card, startRect, endRect }); };
  const handleAnimationComplete = () => { if (flyingCard) { addToMain(flyingCard.card); setFlyingCard(null); setIsAnimating(false); } };
  const handleExportCode = () => { if (mainDeck.length === 0 && lifeDeck.length === 0) { showAlert("Empty Deck", "เด็คของคุณว่างเปล่า ไม่มีอะไรให้ Export"); return; } const code = encodeDeckCode(mainDeck, lifeDeck); navigator.clipboard.writeText(code) .then(() => showAlert("Success!", `✅ คัดลอกรหัสเด็คลง Clipboard แล้ว!`)) .catch(err => { console.error('Failed to copy code: ', err); showAlert("Error", "ไม่สามารถคัดลอกรหัสเด็คได้"); }); };
  const handleImport = () => { setIsImportModalOpen(true); };
  const confirmImport = (code) => { closeImportModal(); if (!code) { return; } const decoded = decodeDeckCode(code, cardDb); if (decoded) { setMainDeck(decoded.main); setLifeDeck(decoded.life); showAlert("Import Success", "นำเข้าเด็คสำเร็จ!"); } else { showAlert("Import Error", "รหัสเด็คไม่ถูกต้อง หรือไม่พบการ์ดบางใบในฐานข้อมูลปัจจุบัน"); } };
  const handleExport = handleExportCode; 
  const handleClear = () => { setModal({ isOpen: true, title: "Confirm Clear Deck", message: "คุณต้องการล้างเด็คทั้งหมด (Main และ Life) ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้", onConfirm: () => { setMainDeck([]); setLifeDeck([]); closeModal(); }, confirmText: "Confirm Clear", confirmIcon: <TrashIcon /> }); };

  return (
    <DndProvider backend={HTML5Backend}>
      <DndStateProvider>
        <style>{`::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#334155}`}</style>
        <CustomDragLayer />
        {flyingCard && (
          <FlyingCard {...flyingCard} onComplete={handleAnimationComplete} />
        )}

        <div className="h-screen flex flex-col text-slate-900 dark:text-gray-200 bg-slate-100 dark:bg-black">
          {!userProfile ? (
            <div className="flex-1 flex flex-row items-stretch overflow-hidden">
              <div className="w-full max-w-md md:w-96 shrink-0 flex flex-col items-center justify-start p-8 gap-6 bg-white/80 dark:bg-black/80 backdrop-blur-lg overflow-y-auto h-full border-r border-slate-300 dark:border-emerald-700/30">
                <img
                  src="/cards/LOGOBOT.png"
                  alt="Logo"
                  className="w-32 h-32 object-contain shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 bg-clip-text text-transparent text-center">
                  Deck Builder
                </h1>
                <div className="mt-4 scale-110 shrink-0">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                    theme={theme === 'dark' ? "filled_black" : "outline"}
                    size="large"
                    shape="pill"
                    text="signin_with"
                    logo_alignment="left"
                  />
                </div>
                <div className="mt-12 pt-8 border-t border-slate-300 dark:border-emerald-700/30 w-full max-w-sm flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-300 mb-4 text-center">
                    สนับสนุนค่ากาแฟและค่าเซิร์ฟเวอร์ ❤️
                  </h3>
                  <img
                    src="/assets/QRCODE.png"
                    alt="QR Code"
                    className="w-48 h-48 mx-auto rounded-lg border-4 border-emerald-500/30"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <video
                    src="/assets/VDO.mov"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto max-w-[400px] mt-6 rounded-lg border-4 border-emerald-500/30"
                    width="540"
                    height="540"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              </div>
              <div
                className="flex-1 hidden md:block bg-slate-200 dark:bg-black/50"
                style={{
                  backgroundImage: "url('/assets/wallblueL.jpg')",
                  backgroundRepeat: "repeat",
                  backgroundSize: "auto",
                  backgroundPosition: "top left",
                }}
              />
            </div>
          ) : (
            <>
              <header className="px-4 lg:px-6 py-2 border-b border-slate-300 dark:border-emerald-700/30 bg-white/60 dark:bg-black/60 backdrop-blur-sm shrink-0 z-40">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-800 dark:text-white transition-colors"
                    >
                      <MenuIcon />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 bg-clip-text text-transparent">
                      Battle Of Talingchan
                    </h1>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to="/public-decks">
                      <Button
                        as="span"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg hover:from-blue-400 hover:to-purple-500"
                      >
                        <UsersIcon />{" "}
                        <span className="hidden md:inline">Public Decks</span>
                      </Button>
                    </Link>
                    <Button
                      onClick={() => setIsDeckListModalOpen(true)}
                      className="bg-gradient-to-r from-amber-500 to-emerald-600 text-white border-none shadow-lg hover:from-amber-400 hover:to-emerald-500"
                    >
                      <DeckIcon />{" "}
                      <span className="hidden md:inline">My Deck List</span>
                    </Button>

                    <img
                      src={displayUser.picture}
                      alt={displayUser.name}
                      className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover"
                      title={`Logged in as ${displayUser.name}`}
                    />
                    <span className="text-slate-900 dark:text-white hidden md:block text-sm font-semibold">
                      {displayUser.name}
                    </span>
                  </div>
                </div>
              </header>

              <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <div
                  className={` ${
                    activeView === "deck" ? "block" : "hidden"
                  } md:block ${
                    isSidebarOpen ? "md:w-[360px]" : "md:w-0"
                  } transition-all duration-300 ease-in-out overflow-hidden shrink-0 relative md:h-full w-full h-full overflow-y-auto md:overflow-y-hidden pb-16 md:pb-0 `}
                >
                  <LeftSidebar
                    isSidebarOpen={isSidebarOpen}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    allCardTypes={allCardTypes}
                    filterTypes={filterTypes}
                    setFilterTypes={setFilterTypes}
                    filterMagicType={filterMagicType}
                    setFilterMagicType={setFilterMagicType}
                    allColorTypes={allColorTypes}
                    filterColors={filterColors}
                    setFilterColors={setFilterColors}
                    allRarities={allRarities}
                    filterRarities={filterRarities}
                    setFilterRarities={setFilterRarities}
                    allSets={allSets}
                    selectedSets={selectedSets}
                    onSetSelectionChange={handleSetSelectionChange}
                    statFilters={statFilters}
                    onStatFilterChange={handleStatFilterChange}
                    mainDeck={mainDeck}
                    lifeDeck={lifeDeck}
                    RULES={RULES}
                    addToMain={addToMain}
                    addToLife={addToLife}
                    removeFromMain={removeFromMain}
                    removeFromLife={removeFromLife}
                    handleImport={handleImport}
                    handleExport={handleExport}
                    handleClear={handleClear}
                    handleReloadFromTxt={handleReloadFromTxt}
                    mainDeckRef={mainDeckRef}
                    onViewDeck={setViewingDeck}
                    onAnalyzeDeck={handleAnalyzeDeck}
                    isLoadingAnalysis={isLoadingAnalysis}
                  />
                </div>
                <div className="hidden md:flex items-center justify-center shrink-0 border-l border-slate-300 dark:border-emerald-700/30 bg-white/40 dark:bg-black/40">
                  {" "}
                  <button
                    onClick={toggleSidebar}
                    className="p-1 text-emerald-600 dark:text-emerald-400 hover:text-black dark:hover:text-white hover:bg-emerald-200/50 dark:hover:bg-emerald-700/50 rounded-full transition-colors"
                    title={isSidebarOpen ? "ซ่อน Filter" : "แสดง Filter"}
                  >
                    {" "}
                    {isSidebarOpen ? (
                      <ChevronLeftIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </button>{" "}
                </div>

                <div
                  className={`${
                    activeView === "cards" ? "flex" : "hidden"
                  } md:flex flex-1 flex-col`}
                >
                  <section
                    className={` flex-1 overflow-y-auto transition-all duration-300 ease-in-out p-4 lg:py-8 md:pr-12 lg:pr-16 ${
                      isSidebarOpen
                        ? "md:pl-12 lg:pl-16"
                        : "md:pl-16 lg:pl-24 xl:pl-32"
                    } `}
                  >
                    <div className="relative bg-white dark:bg-slate-900 text-center py-8 px-4 border-b border-slate-300 dark:border-emerald-700/30 overflow-hidden rounded-lg mb-10">
                      {" "}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-slate-900 opacity-50"></div>{" "}
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-10"
                        style={{
                          backgroundImage:
                            "url('https://www.tcgthailand.com/assets/img/banner.1b838965.webp')",
                        }}
                      ></div>{" "}
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        {" "}
                        <img
                          src="/cards/LOGOBOT.png"
                          alt="Battle Of Talingchan Logo"
                          className="w-24 h-24 md:w-28 md:h-28 mb-2 object-contain drop-shadow-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />{" "}
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-md">
                          Battle Of Talingchan
                        </h1>{" "}
                      </div>{" "}
                    </div>
                    {cardDb.length === 0 ? (
                      <CardShell>
                        <div className="text-center py-20">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            กำลังโหลดฐานข้อมูลการ์ด...
                          </h3>
                          <p className="text-slate-700 dark:text-gray-300">
                            หากไม่สำเร็จ ลองกด "Reload from TXT" ที่แถบซ้าย
                          </p>
                        </div>
                      </CardShell>
                    ) : (
                      <>
                        <CardGrid
                          cards={paginatedCards}
                          onDoubleClick={handleCardDoubleClick}
                          onViewDetails={setZoomedCard}
                          onAddCard={addToMain}
                        />
                        {totalPages > 1 && (
                          <div className="relative z-[70] flex items-center justify-center gap-4 mt-12 py-4">
                            <Button
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                            >
                              {" "}
                              ย้อนกลับ{" "}
                            </Button>
                            <span className="text-slate-900 dark:text-white font-semibold tabular-nums">
                              {" "}
                              หน้า {currentPage} / {totalPages}{" "}
                            </span>
                            <Button
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1)
                                )
                              }
                              disabled={currentPage === totalPages}
                            >
                              {" "}
                              ถัดไป{" "}
                            </Button>
                          </div>
                        )}
                        <footer className="relative z-[70] mt-16 py-10 text-center border-t border-slate-300 dark:border-emerald-700/30">
                          <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-300 mb-4">
                            สามารถสนับสนุนค่ากาแฟและค่าเซิร์ฟเวอร์ได้ที่นี่นะคะ
                            ❤️❤️❤️
                          </h3>
                          <img
                            src="/assets/QRCODE.png"
                            alt="Donate QR Code"
                            className="w-48 h-48 mx-auto rounded-lg border-4 border-emerald-500/30"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        </footer>
                      </>
                    )}
                  </section>
                </div>
              </main>

              {/* Modals */}
              <Modal
                isOpen={modal.isOpen}
                title={modal.title}
                onClose={closeModal}
                onConfirm={modal.onConfirm}
                confirmText={
                  modal.onConfirm ? modal.confirmText || "Confirm" : undefined
                }
                confirmIcon={
                  modal.onConfirm ? modal.confirmIcon || <TrashIcon /> : undefined
                }
              >
                {" "}
                {modal.message}{" "}
              </Modal>
              <ImportDeckModal
                isOpen={isImportModalOpen}
                onClose={closeImportModal}
                onImport={confirmImport}
              />
              
              {/* ================================================================= */}
              {/* === 📍 [5] แก้ไขการส่ง Props ไปยัง DeckAnalysisModal === */}
              {/* ================================================================= */}
              <DeckAnalysisModal
                isOpen={analysisDeck.deck !== null}
                onClose={() => setAnalysisDeck({ deck: null, showChart: true })}
                mainDeck={analysisDeck.deck ? analysisDeck.deck.main : []}
                lifeDeck={analysisDeck.deck ? analysisDeck.deck.life : []}
                showChart={analysisDeck.showChart}
                showAlert={showAlert}
                theme={theme}
              />

              <DeckViewModal
                isOpen={viewingDeck !== null}
                onClose={() => setViewingDeck(null)}
                deck={viewingDeck === "main" ? mainDeck : lifeDeck}
                rules={viewingDeck === "main" ? RULES.main : RULES.life}
                onAddCard={viewingDeck === "main" ? addToMain : addToLife}
                onRemoveCard={
                  viewingDeck === "main" ? removeFromMain : removeFromLife
                }
                title={viewingDeck === "main" ? "Main Deck" : "Life Deck"}
              />
              <CardDetailModal
                card={zoomedCard}
                onClose={() => setZoomedCard(null)}
              />

              {/* ================================================================= */}
              {/* === 📍 [6] แก้ไข `onShowCards` ให้ตั้ง `showChart: false` === */}
              {/* ================================================================= */}
              <DeckListModal
                isOpen={isDeckListModalOpen}
                onClose={() => setIsDeckListModalOpen(false)}
                userProfile={displayUser}
                userDecks={userDecks}
                setUserDecks={setUserDecks}
                mainDeck={mainDeck}
                lifeDeck={lifeDeck}
                setMainDeck={setMainDeck}
                setLifeDeck={setLifeDeck}
                showAlert={showAlert}
                setModal={setModal}
                closeModal={closeModal}
                encodeDeckCode={encodeDeckCode}
                decodeDeckCode={decodeDeckCode}
                allCards={cardDb}
                onShowCards={(deck) => setAnalysisDeck({ deck: deck, showChart: false })}
                key={userProfile?.email || "guest"}
              />

              {/* [ใหม่] Modalsสำหรับ Profile */}
              <ProfileSetupModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                userProfile={userProfile}
                onSave={handleSaveProfile}
              />
              <SettingsDrawer
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                userProfile={displayUser}
                onEditProfile={() => setIsProfileModalOpen(true)}
                onLogout={handleLogout}
                theme={theme}
                setTheme={setTheme}
              />
            </>
          )}
        </div>
      </DndStateProvider>
    </DndProvider>
  );
}