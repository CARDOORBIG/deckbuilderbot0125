(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/bot-nextjs/src/lib/firebase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
;
// 🛑 [สำคัญมาก]
// วางโค้ด config ที่คัดลอกมาจาก Firebase Console ของคุณ
const firebaseConfig = {
    apiKey: "AIz...YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};
// Initialize Firebase
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/bot-nextjs/src/hooks/useLocalStorage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/hooks/useLocalStorage.js
__turbopack_context__.s([
    "useLocalStorage",
    ()=>useLocalStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useLocalStorage(key, initial) {
    _s();
    const [v, s] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useLocalStorage.useState": ()=>{
            try {
                const raw = localStorage.getItem(key);
                if (!raw || raw === "[]" || raw === "null") return initial;
                return JSON.parse(raw);
            } catch  {
                return initial;
            }
        }
    }["useLocalStorage.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLocalStorage.useEffect": ()=>{
            try {
                localStorage.setItem(key, JSON.stringify(v));
            } catch  {}
        }
    }["useLocalStorage.useEffect"], [
        key,
        v
    ]);
    return [
        v,
        s
    ];
}
_s(useLocalStorage, "AU03e/9KO4NbB4n4EJBTT03/e94=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/bot-nextjs/src/lib/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/utils.js
// (อย่าลืม import สิ่งที่จำเป็น ถ้าฟังก์ชันของคุณมีการเรียกใช้กันเอง)
__turbopack_context__.s([
    "RULES",
    ()=>RULES,
    "avg",
    ()=>avg,
    "countBy",
    ()=>countBy,
    "decodeDeckCode",
    ()=>decodeDeckCode,
    "encodeDeckCode",
    ()=>encodeDeckCode,
    "encodePath",
    ()=>encodePath,
    "nameKey",
    ()=>nameKey,
    "validate",
    ()=>validate
]);
const RULES = {
    main: {
        size: 50
    },
    life: {}
};
const nameKey = (n)=>(n || "").trim().toLowerCase();
function countBy(arr, keyFn) {}
function validate(mainDeck, lifeDeck) {}
const avg = (arr)=>{};
const encodeDeckCode = (mainDeck, lifeDeck)=>{};
const decodeDeckCode = (code, allCards)=>{};
const encodePath = (p)=>p.split('/').map(encodeURIComponent).join('/');
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/bot-nextjs/src/components/ui/Common.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "CardShell",
    ()=>CardShell,
    "ColorPip",
    ()=>ColorPip,
    "Pill",
    ()=>Pill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"); // <--- ต้องมี forwardRef
;
;
const Button = ({ className = "", children, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-400/20 bg-amber-900/30 text-amber-300 hover:bg-amber-700/50 hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-900/30 ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/components/ui/Common.jsx",
        lineNumber: 4,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = Button;
const Pill = ({ children, className = "" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `text-xs font-semibold px-2.5 py-1 rounded-full ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/components/ui/Common.jsx",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = Pill;
const CardShell = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = function CardShell({ children, className = "", ...props }, ref) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `bg-slate-900/70 backdrop-blur-sm p-4 rounded-xl border border-emerald-500/20 shadow-lg transition-all hover:border-amber-400/50 hover:shadow-amber-500/10 ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/components/ui/Common.jsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
});
_c3 = CardShell;
const ColorPip = ({ color })=>{
    const colorClasses = {
        Red: 'bg-red-500',
        Green: 'bg-green-500',
        Purple: 'bg-purple-500',
        Blue: 'bg-blue-500',
        Yellow: 'bg-yellow-500',
        Black: 'bg-gray-800',
        White: 'bg-slate-200'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `w-3 h-3 rounded-full ${colorClasses[color] || 'bg-slate-400'}`,
        title: color
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/components/ui/Common.jsx",
        lineNumber: 26,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_c4 = ColorPip;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Button");
__turbopack_context__.k.register(_c1, "Pill");
__turbopack_context__.k.register(_c2, "CardShell$forwardRef");
__turbopack_context__.k.register(_c3, "CardShell");
__turbopack_context__.k.register(_c4, "ColorPip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/bot-nextjs/src/components/ui/Icons.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CardsIcon",
    ()=>CardsIcon,
    "ChevronLeftIcon",
    ()=>ChevronLeftIcon,
    "ChevronRightIcon",
    ()=>ChevronRightIcon,
    "ClearIcon",
    ()=>ClearIcon,
    "CopyIcon",
    ()=>CopyIcon,
    "DBLoadIcon",
    ()=>DBLoadIcon,
    "DeckIcon",
    ()=>DeckIcon,
    "ExportIcon",
    ()=>ExportIcon,
    "EyeIcon",
    ()=>EyeIcon,
    "ImportIcon",
    ()=>ImportIcon,
    "PlusIcon",
    ()=>PlusIcon,
    "UploadIcon",
    ()=>UploadIcon,
    "UsersIcon",
    ()=>UsersIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
const ImportIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 3,
                columnNumber: 213
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "17 8 12 3 7 8"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 3,
                columnNumber: 267
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "3",
                x2: "12",
                y2: "15"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 3,
                columnNumber: 302
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 3,
        columnNumber: 35
    }, ("TURBOPACK compile-time value", void 0));
_c = ImportIcon;
const ExportIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 4,
                columnNumber: 213
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "7 10 12 15 17 10"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 4,
                columnNumber: 267
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "15",
                x2: "12",
                y2: "3"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 4,
                columnNumber: 305
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 4,
        columnNumber: 35
    }, ("TURBOPACK compile-time value", void 0));
_c1 = ExportIcon;
const ClearIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "3 6 5 6 21 6"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 5,
                columnNumber: 212
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 5,
                columnNumber: 246
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "10",
                y1: "11",
                x2: "10",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 5,
                columnNumber: 337
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "14",
                y1: "11",
                x2: "14",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 5,
                columnNumber: 377
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 5,
        columnNumber: 34
    }, ("TURBOPACK compile-time value", void 0));
_c2 = ClearIcon;
const DBLoadIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 2v6h-6"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 6,
                columnNumber: 213
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 12a9 9 0 0 1 15-6.7L21 8"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 6,
                columnNumber: 236
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 22v-6h6"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 6,
                columnNumber: 276
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 12a9 9 0 0 1-15 6.7L3 16"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 6,
                columnNumber: 299
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 6,
        columnNumber: 35
    }, ("TURBOPACK compile-time value", void 0));
_c3 = DBLoadIcon;
const EyeIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 7,
                columnNumber: 211
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 7,
                columnNumber: 269
            }, ("TURBOPACK compile-time value", void 0)),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 7,
        columnNumber: 32
    }, ("TURBOPACK compile-time value", void 0));
_c4 = EyeIcon;
const CopyIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "9",
                y: "9",
                width: "13",
                height: "13",
                rx: "2",
                ry: "2"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 8,
                columnNumber: 212
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 8,
                columnNumber: 275
            }, ("TURBOPACK compile-time value", void 0)),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 8,
        columnNumber: 33
    }, ("TURBOPACK compile-time value", void 0));
_c5 = CopyIcon;
const PlusIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "5",
                x2: "12",
                y2: "19"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 9,
                columnNumber: 213
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "5",
                y1: "12",
                x2: "19",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 9,
                columnNumber: 257
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 9,
        columnNumber: 33
    }, ("TURBOPACK compile-time value", void 0));
_c6 = PlusIcon;
const CardsIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "2",
                y: "7",
                width: "20",
                height: "14",
                rx: "2",
                ry: "2"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 10,
                columnNumber: 210
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 2H8a2 2 0 0 0-2 2v3h12V4a2 2 0 0 0-2-2z"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 10,
                columnNumber: 272
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 10,
        columnNumber: 32
    }, ("TURBOPACK compile-time value", void 0));
_c7 = CardsIcon;
const DeckIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 11,
                columnNumber: 209
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "14 2 14 8 20 8"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 11,
                columnNumber: 296
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "16",
                y1: "13",
                x2: "8",
                y2: "13"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 11,
                columnNumber: 341
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "16",
                y1: "17",
                x2: "8",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 11,
                columnNumber: 385
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "10",
                y1: "9",
                x2: "8",
                y2: "9"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 11,
                columnNumber: 429
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 11,
        columnNumber: 31
    }, ("TURBOPACK compile-time value", void 0));
_c8 = DeckIcon;
const ChevronLeftIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
            points: "15 18 9 12 15 6"
        }, void 0, false, {
            fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
            lineNumber: 12,
            columnNumber: 216
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 12,
        columnNumber: 38
    }, ("TURBOPACK compile-time value", void 0));
_c9 = ChevronLeftIcon;
const ChevronRightIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
            points: "9 18 15 12 9 6"
        }, void 0, false, {
            fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
            lineNumber: 13,
            columnNumber: 217
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 13,
        columnNumber: 39
    }, ("TURBOPACK compile-time value", void 0));
_c10 = ChevronRightIcon;
const UsersIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 14,
                columnNumber: 210
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 14,
                columnNumber: 269
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23 21v-2a4 4 0 0 0-3-3.87"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 14,
                columnNumber: 306
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 3.13a4 4 0 0 1 0 7.75"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 14,
                columnNumber: 350
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 14,
        columnNumber: 32
    }, ("TURBOPACK compile-time value", void 0));
_c11 = UsersIcon;
const UploadIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 15,
                columnNumber: 211
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "17 8 12 3 7 8"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 15,
                columnNumber: 270
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "3",
                x2: "12",
                y2: "15"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 15,
                columnNumber: 314
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
        lineNumber: 15,
        columnNumber: 33
    }, ("TURBOPACK compile-time value", void 0));
_c12 = UploadIcon;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "ImportIcon");
__turbopack_context__.k.register(_c1, "ExportIcon");
__turbopack_context__.k.register(_c2, "ClearIcon");
__turbopack_context__.k.register(_c3, "DBLoadIcon");
__turbopack_context__.k.register(_c4, "EyeIcon");
__turbopack_context__.k.register(_c5, "CopyIcon");
__turbopack_context__.k.register(_c6, "PlusIcon");
__turbopack_context__.k.register(_c7, "CardsIcon");
__turbopack_context__.k.register(_c8, "DeckIcon");
__turbopack_context__.k.register(_c9, "ChevronLeftIcon");
__turbopack_context__.k.register(_c10, "ChevronRightIcon");
__turbopack_context__.k.register(_c11, "UsersIcon");
__turbopack_context__.k.register(_c12, "UploadIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/bot-nextjs/src/components/ui/Modal.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/components/ui/Common.jsx [app-client] (ecmascript)"); // <--- Import จากไฟล์ที่เราเพิ่งสร้าง
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/components/ui/Icons.jsx [app-client] (ecmascript)"); // <--- Import จากไฟล์ที่เราเพิ่งสร้าง
;
;
;
;
;
const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", confirmIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClearIcon"], {}, void 0, false, {
    fileName: "[project]/bot-nextjs/src/components/ui/Modal.jsx",
    lineNumber: 6,
    columnNumber: 102
}, ("TURBOPACK compile-time value", void 0)), maxWidth = 'max-w-md' })=>{
    if (!isOpen) return null;
    // [สำคัญ] เพิ่ม check นี้สำหรับ Next.js
    // เพื่อป้องกัน Error "document is not defined" ตอนรันบน Server
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `bg-slate-800 border border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full m-4 ${maxWidth}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-bold text-white mb-4",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/bot-nextjs/src/components/ui/Modal.jsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-gray-300 mb-6",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/bot-nextjs/src/components/ui/Modal.jsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: onClose,
                            className: "bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600",
                            children: onConfirm ? "Cancel" : "Close"
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/components/ui/Modal.jsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        onConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: onConfirm,
                            className: "bg-emerald-900/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-800/50 hover:text-white",
                            children: [
                                confirmIcon,
                                " ",
                                confirmText
                            ]
                        }, void 0, true, {
                            fileName: "[project]/bot-nextjs/src/components/ui/Modal.jsx",
                            lineNumber: 23,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/bot-nextjs/src/components/ui/Modal.jsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/bot-nextjs/src/components/ui/Modal.jsx",
            lineNumber: 15,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/components/ui/Modal.jsx",
        lineNumber: 14,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)), document.body // สั่งให้ Modal นี้ไป render ที่ <body>
    );
};
_c = Modal;
const __TURBOPACK__default__export__ = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DeckCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/lib/firebase.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$hooks$2f$useLocalStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/hooks/useLocalStorage.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/lib/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Modal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/components/ui/Modal.jsx [app-client] (ecmascript)"); // <--- Import UI
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/components/ui/Common.jsx [app-client] (ecmascript)"); // <--- Import UI
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/components/ui/Icons.jsx [app-client] (ecmascript)"); // <--- Import UI
;
var _s = __turbopack_context__.k.signature();
"use client"; // <--- บอกว่าไฟล์นี้คือ Client Component (เพื่อใช้ onClick, useState)
;
;
;
;
;
;
;
;
function DeckCard({ deck }) {
    _s();
    // (State สำหรับ Modal และ userProfile จะทำงานที่ Client)
    const [userProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$hooks$2f$useLocalStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocalStorage"])("bot-userProfile-v1", null);
    const [modal, setModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });
    const closeModal = ()=>setModal({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: null
        });
    const showAlert = (title, message)=>setModal({
            isOpen: true,
            title,
            message,
            onConfirm: null
        });
    const mainCardImg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DeckCard.useMemo[mainCardImg]": ()=>{
            if (!deck.only1CardData) return 'https://placehold.co/300x420/1e293b/94a3b8?text=Deck';
            const card = deck.only1CardData;
            const encodedImagePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodePath"])(card.imagePath);
            const fileId = card.id.replace(' - Only#1', '');
            return `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
        }
    }["DeckCard.useMemo[mainCardImg]"], [
        deck.only1CardData
    ]);
    // แปลง string (จาก Server) กลับเป็น Date Object
    const sharedDate = new Date(deck.sharedAt);
    // ตรวจสอบว่าเป็นเจ้าของเด็คนี้หรือไม่
    const isOwner = userProfile && userProfile.email === deck.user.email;
    // (ฟังก์ชัน Logic ทั้งหมดจะย้ายมาอยู่ที่นี่)
    const handleDeleteDeck = ()=>{
        setModal({
            isOpen: true,
            title: "Confirm Delete Deck",
            message: `คุณแน่ใจหรือไม่ว่าต้องการลบเด็ค "${deck.deckName}" ออกจาก Public?`,
            onConfirm: async ()=>{
                closeModal();
                try {
                    const docRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "publicDecks", deck.id);
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])(docRef);
                // (หมายเหตุ: ตอนนี้การลบจะยังไม่ Refresh หน้าจอทันที ต้อง F5 ก่อน
                // เราต้องใช้ router.refresh() หรือ state management เพื่อแก้)
                } catch (error) {
                    console.error("Error deleting document: ", error);
                    showAlert("เกิดข้อผิดพลาด", "ไม่สามารถลบเด็คได้ โปรดลองอีกครั้ง");
                }
            },
            confirmText: "Confirm Delete",
            confirmIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClearIcon"], {}, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                lineNumber: 53,
                columnNumber: 20
            }, this)
        });
    };
    const handleCopyCode = ()=>{
        showAlert("Coming Soon!", "ฟังก์ชันคัดลอกรหัสเด็คกำลังจะมาค่ะ");
    };
    const handleViewDeck = ()=>{
        showAlert("Coming Soon!", `ฟังก์ชันดูรายละเอียดเด็ค "${deck.deckName}" กำลังจะมา!`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardShell"], {
                className: "flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-start mb-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: deck.user.picture,
                                    alt: deck.user.name,
                                    className: "w-10 h-10 rounded-full bg-slate-700",
                                    loading: "lazy"
                                }, void 0, false, {
                                    fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-white",
                                            children: deck.user.name
                                        }, void 0, false, {
                                            fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                                            lineNumber: 72,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-400",
                                            children: sharedDate.toLocaleString('th-TH')
                                        }, void 0, false, {
                                            fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                                            lineNumber: 73,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-bold text-amber-300 mb-3 line-clamp-2",
                        children: deck.deckName
                    }, void 0, false, {
                        fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "aspect-[5/7] w-full rounded-lg mb-4 overflow-hidden bg-slate-800",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: mainCardImg,
                            alt: deck.only1CardData?.name || 'Deck Cover',
                            className: "w-full h-full object-cover",
                            loading: "lazy"
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2 mt-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleViewDeck,
                                className: "w-full bg-blue-600/30 border-blue-500/30 text-blue-300 hover:bg-blue-500/50 hover:text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EyeIcon"], {}, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                                        lineNumber: 83,
                                        columnNumber: 13
                                    }, this),
                                    " ดูรายละเอียดเด็ค"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleCopyCode,
                                className: "w-full",
                                disabled: true,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CopyIcon"], {}, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, this),
                                    " คัดลอกรหัสเด็ค (เร็วๆ นี้)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            isOwner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleDeleteDeck,
                                className: "w-full bg-red-900/50 border-red-500/30 text-red-300 hover:bg-red-800/50 hover:text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClearIcon"], {}, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this),
                                    " ลบเด็คนี้ (Un-share)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Modal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: modal.isOpen,
                title: modal.title,
                onClose: closeModal,
                onConfirm: modal.onConfirm,
                confirmText: modal.onConfirm ? modal.confirmText || "Confirm" : undefined,
                confirmIcon: modal.onConfirm ? modal.confirmIcon || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClearIcon"], {}, void 0, false, {
                    fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                    lineNumber: 103,
                    columnNumber: 61
                }, void 0) : undefined,
                children: modal.message
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/public-decks/DeckCard.jsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(DeckCard, "F2Wm3CHYruO3zv01dgabMwLWYIQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$hooks$2f$useLocalStorage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocalStorage"]
    ];
});
_c = DeckCard;
var _c;
__turbopack_context__.k.register(_c, "DeckCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=bot-nextjs_src_5a964d6f._.js.map