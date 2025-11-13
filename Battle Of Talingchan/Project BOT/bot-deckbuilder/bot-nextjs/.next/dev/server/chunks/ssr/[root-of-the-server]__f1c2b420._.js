module.exports = [
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/bot-nextjs/src/lib/firebase.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/@firebase/app/dist/esm/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
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
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(app);
}),
"[project]/bot-nextjs/src/components/ui/Common.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"); // <--- ต้องมี forwardRef
;
;
const Button = ({ className = "", children, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-400/20 bg-amber-900/30 text-amber-300 hover:bg-amber-700/50 hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-900/30 ${className}`,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/components/ui/Common.jsx",
        lineNumber: 4,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const Pill = ({ children, className = "" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `text-xs font-semibold px-2.5 py-1 rounded-full ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/components/ui/Common.jsx",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const CardShell = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(function CardShell({ children, className = "", ...props }, ref) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `w-3 h-3 rounded-full ${colorClasses[color] || 'bg-slate-400'}`,
        title: color
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/components/ui/Common.jsx",
        lineNumber: 26,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/bot-nextjs/src/components/ui/Icons.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const ImportIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 3,
                columnNumber: 213
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "17 8 12 3 7 8"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 3,
                columnNumber: 267
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
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
const ExportIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 4,
                columnNumber: 213
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "7 10 12 15 17 10"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 4,
                columnNumber: 267
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
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
const ClearIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "3 6 5 6 21 6"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 5,
                columnNumber: 212
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 5,
                columnNumber: 246
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "10",
                y1: "11",
                x2: "10",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 5,
                columnNumber: 337
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
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
const DBLoadIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 2v6h-6"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 6,
                columnNumber: 213
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 12a9 9 0 0 1 15-6.7L21 8"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 6,
                columnNumber: 236
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 22v-6h6"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 6,
                columnNumber: 276
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
const EyeIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 7,
                columnNumber: 211
            }, ("TURBOPACK compile-time value", void 0)),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
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
const CopyIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
const PlusIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "5",
                x2: "12",
                y2: "19"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 9,
                columnNumber: 213
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
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
const CardsIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
const DeckIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 11,
                columnNumber: 209
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "14 2 14 8 20 8"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 11,
                columnNumber: 296
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "16",
                y1: "13",
                x2: "8",
                y2: "13"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 11,
                columnNumber: 341
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "16",
                y1: "17",
                x2: "8",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 11,
                columnNumber: 385
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
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
const ChevronLeftIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
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
const ChevronRightIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
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
const UsersIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 14,
                columnNumber: 210
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 14,
                columnNumber: 269
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23 21v-2a4 4 0 0 0-3-3.87"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 14,
                columnNumber: 306
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
const UploadIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 15,
                columnNumber: 211
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "17 8 12 3 7 8"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/components/ui/Icons.jsx",
                lineNumber: 15,
                columnNumber: 270
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
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
}),
"[project]/bot-nextjs/src/components/ui/Modal.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/components/ui/Common.jsx [app-ssr] (ecmascript)"); // <--- Import จากไฟล์ที่เราเพิ่งสร้าง
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/components/ui/Icons.jsx [app-ssr] (ecmascript)"); // <--- Import จากไฟล์ที่เราเพิ่งสร้าง
;
;
;
;
;
const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", confirmIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClearIcon"], {}, void 0, false, {
    fileName: "[project]/bot-nextjs/src/components/ui/Modal.jsx",
    lineNumber: 6,
    columnNumber: 102
}, ("TURBOPACK compile-time value", void 0)), maxWidth = 'max-w-md' })=>{
    if (!isOpen) return null;
    // [สำคัญ] เพิ่ม check นี้สำหรับ Next.js
    // เพื่อป้องกัน Error "document is not defined" ตอนรันบน Server
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
};
const __TURBOPACK__default__export__ = Modal;
}),
"[project]/bot-nextjs/src/lib/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/bot-nextjs/src/hooks/useLocalStorage.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/hooks/useLocalStorage.js
__turbopack_context__.s([
    "useLocalStorage",
    ()=>useLocalStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useLocalStorage(key, initial) {
    const [v, s] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        try {
            const raw = localStorage.getItem(key);
            if (!raw || raw === "[]" || raw === "null") return initial;
            return JSON.parse(raw);
        } catch  {
            return initial;
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            localStorage.setItem(key, JSON.stringify(v));
        } catch  {}
    }, [
        key,
        v
    ]);
    return [
        v,
        s
    ];
}
}),
"[project]/bot-nextjs/src/app/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ✨✨ นี่คือบรรทัดที่สำคัญที่สุด ✨✨
__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// เพราะเราใช้ useState, useEffect และการลาก-วาง (DnD)
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$react$2d$dnd$2f$dist$2f$hooks$2f$useDrag$2f$useDrag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/react-dnd/dist/hooks/useDrag/useDrag.js [app-ssr] (ecmascript)"); // (DndProvider อยู่ใน layout.jsx แล้ว)
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$react$2d$dnd$2f$dist$2f$hooks$2f$useDrop$2f$useDrop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/react-dnd/dist/hooks/useDrop/useDrop.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$react$2d$dnd$2f$dist$2f$hooks$2f$useDragLayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/react-dnd/dist/hooks/useDragLayer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/chart.js/dist/chart.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/react-chartjs-2/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/@react-oauth/google/dist/index.esm.js [app-ssr] (ecmascript)"); // (GoogleOAuthProvider อยู่ใน layout.jsx แล้ว)
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/jwt-decode/build/esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)"); // <--- ✨ [แก้ไข] Import Link จาก Next.js
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/lib/firebase.js [app-ssr] (ecmascript)"); // <--- ✨ [แก้ไข] Import จากที่ใหม่
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
// ✨ [แก้ไข] Import จากไฟล์ UI ที่เราสร้าง
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/components/ui/Common.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Modal$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/components/ui/Modal.jsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/components/ui/Icons.jsx [app-ssr] (ecmascript)");
// ✨ [แก้ไข] Import จากไฟล์ lib และ hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$hooks$2f$useLocalStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/bot-nextjs/src/hooks/useLocalStorage.js [app-ssr] (ecmascript)");
"use client"; // บอก Next.js ว่าหน้านี้ "ต้องทำงานที่ฝั่ง Client"
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Chart"].register(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["RadialLinearScale"], __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["PointElement"], __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["LineElement"], __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Filler"], __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Tooltip"], __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$chart$2e$js$2f$dist$2f$chart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Legend"]);
// === Drag & Drop and Animation Components ===
// (โค้ดส่วนนี้เหมือนเดิม)
const DND_TYPES = {
    CARD: "CARD"
};
const DndStateContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
    isDragging: false
});
const DndStateProvider = ({ children })=>{
    const { isDragging } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$react$2d$dnd$2f$dist$2f$hooks$2f$useDragLayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDragLayer"])((monitor)=>({
            isDragging: monitor.isDragging()
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DndStateContext.Provider, {
        value: {
            isDragging
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 34,
        columnNumber: 143
    }, ("TURBOPACK compile-time value", void 0));
};
const useIsDragging = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(DndStateContext);
function CustomDragLayer() {
    const { isDragging, item, currentOffset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$react$2d$dnd$2f$dist$2f$hooks$2f$useDragLayer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDragLayer"])((monitor)=>({
            item: monitor.getItem(),
            isDragging: monitor.isDragging(),
            currentOffset: monitor.getSourceClientOffset()
        }));
    if (!isDragging || !currentOffset) return null;
    const { card } = item;
    const encodedImagePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodePath"])(card.imagePath);
    const fileId = card.id.replace(' - Only#1', '');
    const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 1000,
            left: 0,
            top: 0,
            transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`
        },
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: imgPng,
                alt: card.name,
                className: "w-40 h-auto rounded-lg shadow-2xl"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 36,
                columnNumber: 634
            }, this),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 36,
        columnNumber: 476
    }, this);
}
function FlyingCard({ card, startRect, endRect, onComplete }) {
    const [isAnimating, setIsAnimating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const hasCompleted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timeoutId = setTimeout(()=>setIsAnimating(true), 10);
        return ()=>clearTimeout(timeoutId);
    }, []);
    if (!card || !startRect || !endRect) return null;
    const handleTransitionEnd = ()=>{
        if (!hasCompleted.current) {
            hasCompleted.current = true;
            onComplete();
        }
    };
    const style = {
        position: 'fixed',
        zIndex: 1000,
        top: `${startRect.top}px`,
        left: `${startRect.left}px`,
        width: `${startRect.width}px`,
        height: `${startRect.height}px`,
        transition: 'all 0.5s ease-in-out'
    };
    if (isAnimating) {
        style.top = `${endRect.top + endRect.height / 2 - 35}px`;
        style.left = `${endRect.left + endRect.width / 2 - 25}px`;
        style.width = '50px';
        style.height = '70px';
        style.opacity = 0;
        style.transform = 'rotate(15deg)';
    }
    const encodedImagePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodePath"])(card.imagePath);
    const fileId = card.id.replace(' - Only#1', '');
    const imgSrc = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: style,
        onTransitionEnd: handleTransitionEnd,
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: imgSrc,
                alt: card.name,
                className: "w-full h-full rounded-lg shadow-2xl"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 37,
                columnNumber: 1137
            }, this),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 37,
        columnNumber: 1079
    }, this);
}
// === [ย้ายมา] UI Component ที่ "ไม่ได้" แยกไฟล์ (ทางลัด) ===
// (เราจะเก็บ Component ใหญ่ๆ ไว้ในไฟล์นี้ไปก่อน เพื่อความง่าย)
// === ImportDeckModal (ย้ายมา) ===
const ImportDeckModal = ({ isOpen, onClose, onImport })=>{
    const [code, setCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const handleImportClick = ()=>{
        onImport(code);
        setCode('');
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[210] p-4",
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-800 border border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-white mb-4",
                        children: "Import Deck Code"
                    }, void 0, false, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 44,
                        columnNumber: 421
                    }, ("TURBOPACK compile-time value", void 0)),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: code,
                        onChange: (e)=>setCode(e.target.value),
                        placeholder: "วางรหัสเด็คที่นี่...",
                        rows: "4",
                        className: "w-full px-3 py-2 border border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-slate-700/50 placeholder-gray-400 text-white mb-6 resize-none"
                    }, void 0, false, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 44,
                        columnNumber: 493
                    }, ("TURBOPACK compile-time value", void 0)),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end gap-3",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: onClose,
                                className: "bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600",
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 44,
                                columnNumber: 844
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleImportClick,
                                className: "bg-emerald-900/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-800/50 hover:text-white",
                                children: [
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ImportIcon"], {}, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 44,
                                        columnNumber: 1111
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Import "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 44,
                                columnNumber: 964
                            }, ("TURBOPACK compile-time value", void 0)),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 44,
                        columnNumber: 803
                    }, ("TURBOPACK compile-time value", void 0)),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 44,
                columnNumber: 319
            }, ("TURBOPACK compile-time value", void 0)),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 44,
        columnNumber: 213
    }, ("TURBOPACK compile-time value", void 0)), document.body);
};
// === Card component (ย้ายมา) ===
const CardItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(function CardItem({ card, onDoubleClick, onViewDetails, onAddCard }, ref) {
    const cardItemRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { isDragging: isAnythingDragging } = useIsDragging();
    const [{ isDragging }, dragRef] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$react$2d$dnd$2f$dist$2f$hooks$2f$useDrag$2f$useDrag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDrag"])({
        type: DND_TYPES.CARD,
        item: {
            card
        },
        collect: (m)=>({
                isDragging: m.isDragging()
            })
    });
    const encodedImagePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodePath"])(card.imagePath);
    const fileId = card.id.replace(' - Only#1', '');
    const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
    const imgJpg = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.jpg`;
    const hoverClasses = !isAnythingDragging ? 'hover:scale-[1.25] hover:z-50' : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardShell"], {
        ref: cardItemRef,
        className: `flex flex-col card group relative ${isDragging ? 'opacity-0' : ''} transition-transform duration-200 ease-in-out ${hoverClasses}`,
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-2 right-2 z-10 flex flex-col gap-2",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onViewDetails(card),
                        className: "p-1.5 bg-slate-900/50 rounded-full text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700 hover:text-white",
                        title: "ดูรายละเอียด",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EyeIcon"], {}, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 1140
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 47,
                        columnNumber: 923
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onAddCard(card),
                        className: "p-1.5 bg-emerald-600/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500 active:scale-95",
                        title: "เพิ่มลงเด็ค",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlusIcon"], {}, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 1373
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 47,
                        columnNumber: 1162
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 47,
                columnNumber: 857
            }, this),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                ref: dragRef,
                src: imgPng,
                alt: card.name,
                onDoubleClick: ()=>onDoubleClick(card, cardItemRef.current),
                onError: (e)=>{
                    if (!e.currentTarget.src.endsWith('.jpg')) e.currentTarget.src = imgJpg;
                    else {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://placehold.co/300x420/1e293b/94a3b8?text=${encodeURIComponent(card.name)}`;
                    }
                },
                className: "w-full h-auto rounded-md mb-3 object-cover aspect-[5/7] bg-slate-700 shadow hover:shadow-xl transition-shadow cursor-grab active:cursor-grabbing",
                loading: "lazy"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 47,
                columnNumber: 1403
            }, this),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-grow flex flex-col justify-between",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start gap-2",
                                children: [
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-xl text-white pr-2 line-clamp-2",
                                        children: card.name
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 47,
                                        columnNumber: 2051
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 shrink-0",
                                        children: [
                                            " ",
                                            card.colorType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ColorPip"], {
                                                color: card.colorType
                                            }, void 0, false, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 47,
                                                columnNumber: 2199
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Pill"], {
                                                className: "bg-slate-600 text-gray-200",
                                                children: card.type
                                            }, void 0, false, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 47,
                                                columnNumber: 2236
                                            }, this),
                                            " "
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 47,
                                        columnNumber: 2129
                                    }, this),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 1994
                            }, this),
                            " ",
                            card.rarity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Pill"], {
                                className: "mt-2 bg-slate-700 text-slate-300",
                                children: card.rarity
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 2330
                            }, this),
                            " ",
                            card.onlyRank === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Pill"], {
                                className: "mt-2 ml-1 bg-amber-500/10 text-amber-300 border border-amber-500/20",
                                children: "Only #1"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 2427
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 47,
                        columnNumber: 1988
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 47,
                columnNumber: 1930
            }, this),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-full mt-1 left-0 right-0 z-[60] p-4 bg-slate-900 rounded-lg shadow-2xl border border-amber-500/50 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto max-h-96 overflow-y-auto",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-2 text-center",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-base text-emerald-400",
                                        children: "Cost"
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 47,
                                        columnNumber: 2891
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-2xl text-white",
                                        children: card.cost ?? '-'
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 47,
                                        columnNumber: 2947
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 2886
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-base text-red-400",
                                        children: "Power"
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 47,
                                        columnNumber: 3026
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-2xl text-white",
                                        children: card.power ?? '-'
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 47,
                                        columnNumber: 3079
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 3021
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-base text-amber-400",
                                        children: "Gem"
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 47,
                                        columnNumber: 3159
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-2xl text-white",
                                        children: card.gem ?? '-'
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 47,
                                        columnNumber: 3212
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 3154
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 47,
                        columnNumber: 2833
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-2",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-base text-gray-400",
                                children: [
                                    "ฝ่าย: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold text-gray-200",
                                        children: card.faction ?? 'ไม่มี'
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 47,
                                        columnNumber: 3360
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 3315
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-base text-gray-300 font-light mt-1 break-words",
                                children: card.text || 'ไม่มีเอฟเฟ็ค'
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 3443
                            }, this),
                            " ",
                            card.flavor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-amber-200/70 italic mt-2 font-light break-words",
                                children: [
                                    '"',
                                    card.flavor,
                                    '"'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 47,
                                columnNumber: 3562
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 47,
                        columnNumber: 3292
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 47,
                columnNumber: 2543
            }, this),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 47,
        columnNumber: 684
    }, this);
});
// === Deck Tray (ย้ายมา) ===
const DeckTray = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(function DeckTray({ title, deck, onDropCard, onRemoveCard, capacity, highlight, onViewDeck }, ref) {
    const [{ isOver }, dropRef] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$react$2d$dnd$2f$dist$2f$hooks$2f$useDrop$2f$useDrop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDrop"])({
        accept: DND_TYPES.CARD,
        drop: (item)=>onDropCard(item.card),
        collect: (monitor)=>({
                isOver: monitor.isOver()
            })
    });
    const groupedDeck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return Object.values(deck.reduce((m, card)=>{
            const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nameKey"])(card.name);
            if (!m[key]) m[key] = {
                card,
                count: 0
            };
            m[key].count++;
            return m;
        }, {})).sort((a, b)=>a.card.name.localeCompare(b.card.name, 'th'));
    }, [
        deck
    ]);
    const cardsPerRow = 12;
    const numRows = groupedDeck.length > 0 ? Math.floor((groupedDeck.length - 1) / cardsPerRow) + 1 : 1;
    const containerHeight = numRows * 40 + 40;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `p-2 rounded-md border-2 ${isOver || highlight ? 'border-amber-400' : 'border-slate-600'} transition-colors bg-slate-900/50`,
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: dropRef,
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-2 gap-2",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xs font-bold text-white uppercase tracking-wider shrink-0",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 50,
                                columnNumber: 970
                            }, this),
                            " ",
                            onViewDeck && deck.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onViewDeck,
                                className: "text-xs text-amber-400 hover:text-amber-200 hover:underline transition",
                                children: "ดูเด็ค"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 50,
                                columnNumber: 1098
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-grow text-right",
                                children: [
                                    " ",
                                    typeof capacity === 'number' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-slate-300",
                                        children: [
                                            deck.length,
                                            capacity ? ` / ${capacity}` : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 50,
                                        columnNumber: 1302
                                    }, this),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 50,
                                columnNumber: 1229
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 50,
                        columnNumber: 907
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full transition-all",
                        style: {
                            height: `${containerHeight}px`
                        },
                        children: [
                            " ",
                            groupedDeck.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center justify-center text-slate-500 text-xs",
                                children: "ลากการ์ดมาวางที่นี่"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 50,
                                columnNumber: 1536
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0",
                                children: [
                                    " ",
                                    groupedDeck.map(({ card, count }, index)=>{
                                        const encodedImagePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodePath"])(card.imagePath);
                                        const fileId = card.id.replace(' - Only#1', '');
                                        const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
                                        const rowIndex = Math.floor(index / cardsPerRow);
                                        const colIndex = index % cardsPerRow;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute transition-all duration-200 ease-in-out group hover:-translate-y-2 hover:z-50",
                                            style: {
                                                left: `${colIndex * 22}px`,
                                                top: `${rowIndex * 40}px`,
                                                zIndex: colIndex,
                                                width: '56px'
                                            },
                                            title: `คลิกเพื่อลบ ${card.name}`,
                                            onClick: ()=>onRemoveCard(card),
                                            children: [
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: thumbPng,
                                                    alt: card.name,
                                                    className: "w-full h-auto rounded-md shadow-lg border-2 border-slate-600 group-hover:border-red-500 cursor-pointer",
                                                    onError: (e)=>{
                                                        if (!e.currentTarget.src.endsWith('.jpg')) {
                                                            e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg');
                                                        }
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 50,
                                                    columnNumber: 2323
                                                }, this),
                                                " ",
                                                count > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full border-2 border-slate-800",
                                                    children: count
                                                }, void 0, false, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 50,
                                                    columnNumber: 2627
                                                }, this),
                                                " "
                                            ]
                                        }, `${card.id}-${index}`, true, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 50,
                                            columnNumber: 2020
                                        }, this);
                                    }),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 50,
                                columnNumber: 1658
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 50,
                        columnNumber: 1414
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 50,
                columnNumber: 887
            }, this),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 50,
        columnNumber: 734
    }, this);
});
// === CardDetailModal (ย้ายมา) ===
function CardDetailModal({ card, onClose }) {
    if (!card) return null;
    const encodedImagePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodePath"])(card.imagePath);
    const fileId = card.id.replace(' - Only#1', '');
    const imgPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
    const imgJpg = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.jpg`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[300] p-4",
        onClick: onClose,
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: imgPng,
                alt: card.name,
                className: "max-w-full max-h-full h-auto w-auto object-contain rounded-xl shadow-2xl",
                onClick: (e)=>e.stopPropagation(),
                onError: (e)=>{
                    if (!e.currentTarget.src.endsWith('.jpg')) {
                        e.currentTarget.src = imgJpg;
                    }
                }
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 53,
                columnNumber: 476
            }, this),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onClose,
                className: "absolute top-4 right-4 text-white bg-slate-800/50 rounded-full p-2 hover:bg-slate-700",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "18",
                                y1: "6",
                                x2: "6",
                                y2: "18"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 53,
                                columnNumber: 1036
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "6",
                                y1: "6",
                                x2: "18",
                                y2: "18"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 53,
                                columnNumber: 1079
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 53,
                        columnNumber: 858
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 53,
                columnNumber: 733
            }, this),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 53,
        columnNumber: 352
    }, this), document.body);
}
// === DeckViewModal (ย้ายมา) ===
function DeckViewModal({ isOpen, onClose, deck, rules, onAddCard, onRemoveCard, title }) {
    const groupedDeck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!deck) return [];
        return Object.values(deck.reduce((m, card)=>{
            const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nameKey"])(card.name);
            if (!m[key]) m[key] = {
                card,
                count: 0
            };
            m[key].count++;
            return m;
        }, {})).sort((a, b)=>a.card.name.localeCompare(b.card.name, 'th'));
    }, [
        deck
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4",
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-900/70 border border-emerald-500/30 rounded-xl shadow-2xl w-full h-full flex flex-col",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "flex items-center justify-between p-4 border-b border-emerald-500/20 shrink-0",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-white",
                                children: [
                                    title,
                                    " (",
                                    deck.length,
                                    " / ",
                                    rules.size,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 56,
                                columnNumber: 745
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: onClose,
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 56,
                                columnNumber: 835
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 56,
                        columnNumber: 646
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-grow overflow-y-auto p-4",
                        children: [
                            " ",
                            groupedDeck.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center h-full",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-400",
                                    children: "เด็คนี้ว่างเปล่า"
                                }, void 0, false, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 56,
                                    columnNumber: 1021
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 56,
                                columnNumber: 964
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap justify-center gap-4",
                                children: [
                                    " ",
                                    groupedDeck.map(({ card, count })=>{
                                        const encodedImagePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodePath"])(card.imagePath);
                                        const fileId = card.id.replace(' - Only#1', '');
                                        const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
                                        const isAtMaxCopies = rules.maxCopiesPerName && count >= rules.maxCopiesPerName;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-40 flex flex-col items-center",
                                            children: [
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: thumbPng,
                                                    alt: card.name,
                                                    className: "w-full rounded-lg shadow-md mb-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 56,
                                                    columnNumber: 1515
                                                }, this),
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full flex items-center justify-around gap-2 bg-slate-800/50 p-1 rounded-md",
                                                    children: [
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>onRemoveCard(card),
                                                            className: "flex items-center justify-center w-7 h-7 bg-red-800/70 rounded-full hover:bg-red-700 transition active:scale-95 text-white font-bold text-xl",
                                                            children: "-"
                                                        }, void 0, false, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 56,
                                                            columnNumber: 1694
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold text-lg text-white w-6 text-center",
                                                            children: count
                                                        }, void 0, false, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 56,
                                                            columnNumber: 1901
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>onAddCard(card),
                                                            disabled: isAtMaxCopies,
                                                            className: "flex items-center justify-center w-7 h-7 bg-emerald-800/70 rounded-full hover:bg-emerald-700 transition active:scale-95 text-white font-bold text-xl disabled:bg-slate-600 disabled:cursor-not-allowed",
                                                            children: "+"
                                                        }, void 0, false, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 56,
                                                            columnNumber: 1979
                                                        }, this),
                                                        " "
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 56,
                                                    columnNumber: 1599
                                                }, this),
                                                " "
                                            ]
                                        }, card.id, true, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 56,
                                            columnNumber: 1451
                                        }, this);
                                    }),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 56,
                                columnNumber: 1084
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 56,
                        columnNumber: 886
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 56,
                columnNumber: 533
            }, this),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 56,
        columnNumber: 427
    }, this), document.body);
}
// === Deck Analysis Modal (ย้ายมา) ===
function DeckAnalysisModal({ isOpen, onClose, mainDeck, lifeDeck, showAlert }) {
    const analysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!mainDeck || mainDeck.length === 0) return null;
        const typeOrder = {
            'Avatar': 1,
            'Magic': 2,
            'Construction': 3
        };
        const only1Card = mainDeck.find((c)=>c.onlyRank === 1);
        const avatars = mainDeck.filter((c)=>c.type === 'Avatar' && c.onlyRank !== 1).sort((a, b)=>a.name.localeCompare(b.name, 'th'));
        const magics = mainDeck.filter((c)=>c.type === 'Magic').sort((a, b)=>a.name.localeCompare(b.name, 'th'));
        const constructs = mainDeck.filter((c)=>c.type === 'Construction').sort((a, b)=>a.name.localeCompare(b.name, 'th'));
        const otherCards = mainDeck.filter((c)=>c.onlyRank !== 1 && ![
                'Avatar',
                'Magic',
                'Construction'
            ].includes(c.type)).sort((a, b)=>(typeOrder[a.type] || 99) - (typeOrder[b.type] || 99) || a.name.localeCompare(b.name, 'th'));
        const avgCost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avg"])(mainDeck.map((c)=>c.cost));
        const avgPower = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avg"])(mainDeck.map((c)=>c.power));
        const avgGem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["avg"])(mainDeck.map((c)=>c.gem));
        const typeCounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["countBy"])(mainDeck, (c)=>c.type);
        const cardTypes = Object.entries(typeCounts).sort(([a], [b])=>(typeOrder[a] || 99) - (typeOrder[b] || 99));
        const labels = [
            'ความไวต้นเกม',
            'กลางเกม',
            'ท้ายเกม',
            'พลังโจมตี',
            'การป้องกัน',
            'การสนับสนุน'
        ];
        const maxStatValue = 100;
        const earlyGameScore = mainDeck.filter((c)=>(c.cost ?? 0) <= 2).length / (mainDeck.length * 0.5) * maxStatValue;
        const midGameScore = mainDeck.filter((c)=>(c.cost ?? 0) >= 3 && (c.cost ?? 0) <= 5).length / (mainDeck.length * 0.4) * maxStatValue;
        const lateGameScore = mainDeck.filter((c)=>(c.cost ?? 0) >= 6).length / (mainDeck.length * 0.2) * maxStatValue;
        const offenseScore = parseFloat(avgPower) / 6 * maxStatValue;
        const defenseScore = mainDeck.filter((c)=>c.type !== 'Magic').length / 40 * maxStatValue;
        const utilityScore = (typeCounts['Magic'] || 0) / 15 * maxStatValue;
        const radarData = {
            labels,
            datasets: [
                {
                    label: 'ศักยภาพเด็ค',
                    data: [
                        earlyGameScore,
                        midGameScore,
                        lateGameScore,
                        offenseScore,
                        defenseScore,
                        utilityScore
                    ].map((v)=>Math.round(Math.min(100, Math.max(0, v || 0)))),
                    backgroundColor: 'rgba(52, 211, 153, 0.2)',
                    borderColor: 'rgb(52, 211, 153)',
                    pointBackgroundColor: 'rgb(52, 211, 153)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(52, 211, 153)'
                }
            ]
        };
        const radarOptions = {
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    pointLabels: {
                        color: 'rgb(209, 213, 219)',
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        color: 'rgb(156, 163, 175)',
                        backdropColor: 'rgba(0, 0, 0, 0.5)',
                        stepSize: 20,
                        maxTicksLimit: 6
                    },
                    min: 0,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true
                }
            },
            maintainAspectRatio: false
        };
        const deckCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodeDeckCode"])(mainDeck, lifeDeck);
        return {
            avgCost,
            avgPower,
            avgGem,
            cardTypes,
            radarData,
            radarOptions,
            deckCode,
            only1Card,
            avatars,
            magics,
            constructs,
            otherCards
        };
    }, [
        mainDeck,
        lifeDeck
    ]);
    const handleCopyCode = ()=>{
        if (analysis?.deckCode) {
            navigator.clipboard.writeText(analysis.deckCode).then(()=>showAlert("Success!", `✅ คัดลอกรหัสเด็คลง Clipboard แล้ว!`)).catch((err)=>{
                console.error('Failed to copy code: ', err);
                showAlert("Error", "ไม่สามารถคัดลอกรหัสเด็คได้");
            });
        }
    };
    if (!isOpen || !analysis) return null;
    const renderCardSection = (title, cards)=>{
        if (!cards || cards.length === 0) return null;
        const groupedCards = cards.reduce((acc, card)=>{
            const existing = acc.find((item)=>item.card.id === card.id);
            if (existing) {
                existing.count++;
            } else {
                acc.push({
                    card,
                    count: 1
                });
            }
            return acc;
        }, []);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mt-6",
            children: [
                " ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                    className: "text-lg font-semibold text-emerald-300 border-b border-emerald-400/20 pb-1 mb-3",
                    children: [
                        title,
                        " (",
                        cards.length,
                        " ใบ)"
                    ]
                }, void 0, true, {
                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                    lineNumber: 79,
                    columnNumber: 337
                }, this),
                " ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-2 justify-center",
                    children: [
                        " ",
                        groupedCards.map(({ card, count })=>{
                            const encodedImagePath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodePath"])(card.imagePath);
                            const fileId = card.id.replace(' - Only#1', '');
                            const thumbPng = `/cards/${encodedImagePath}/${encodeURIComponent(fileId)}.png`;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-24",
                                children: [
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: thumbPng,
                                        alt: card.name,
                                        className: "w-full rounded-md shadow",
                                        onError: (e)=>{
                                            e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg');
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 79,
                                        columnNumber: 835
                                    }, this),
                                    " ",
                                    count > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full border-2 border-slate-800",
                                        children: count
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 79,
                                        columnNumber: 1015
                                    }, this),
                                    " "
                                ]
                            }, card.id, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 79,
                                columnNumber: 789
                            }, this);
                        }),
                        " "
                    ]
                }, void 0, true, {
                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                    lineNumber: 79,
                    columnNumber: 466
                }, this),
                " "
            ]
        }, void 0, true, {
            fileName: "[project]/bot-nextjs/src/app/page.jsx",
            lineNumber: 79,
            columnNumber: 314
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[250] p-4",
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-900/80 border border-emerald-500/30 rounded-xl shadow-2xl w-full h-full flex flex-col max-w-7xl max-h-[90vh]",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "flex items-center justify-between p-4 border-b border-emerald-500/20 shrink-0",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-2xl font-bold text-white",
                                children: "ผลลัพธ์การสร้างเด็ค"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 80,
                                columnNumber: 367
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: onClose,
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 80,
                                columnNumber: 438
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 80,
                        columnNumber: 268
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-grow overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 p-6",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2",
                                children: [
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3",
                                                children: "สถิติเด็ค"
                                            }, void 0, false, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 80,
                                                columnNumber: 654
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-3 gap-4 text-center",
                                                children: [
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-400",
                                                                children: "Avg Cost"
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 80,
                                                                columnNumber: 819
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-2xl font-bold text-emerald-400",
                                                                children: analysis.avgCost
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 80,
                                                                columnNumber: 874
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 80,
                                                        columnNumber: 814
                                                    }, this),
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-400",
                                                                children: "Avg Power"
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 80,
                                                                columnNumber: 959
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-2xl font-bold text-red-400",
                                                                children: analysis.avgPower
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 80,
                                                                columnNumber: 1015
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 80,
                                                        columnNumber: 954
                                                    }, this),
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-gray-400",
                                                                children: "Avg Gem"
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 80,
                                                                columnNumber: 1097
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-2xl font-bold text-amber-400",
                                                                children: analysis.avgGem
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 80,
                                                                columnNumber: 1151
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 80,
                                                        columnNumber: 1092
                                                    }, this),
                                                    " "
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 80,
                                                columnNumber: 761
                                            }, this),
                                            " "
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 80,
                                        columnNumber: 648
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "aspect-square w-full max-w-[350px] mx-auto",
                                        children: [
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$react$2d$chartjs$2d$2$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Radar"], {
                                                data: analysis.radarData,
                                                options: analysis.radarOptions
                                            }, void 0, false, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 80,
                                                columnNumber: 1303
                                            }, this),
                                            " "
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 80,
                                        columnNumber: 1242
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3",
                                                children: "ประเภทการ์ด"
                                            }, void 0, false, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 80,
                                                columnNumber: 1384
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "space-y-1 text-sm",
                                                children: [
                                                    " ",
                                                    analysis.cardTypes.map(([type, count])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex justify-between",
                                                            children: [
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: type
                                                                }, void 0, false, {
                                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                    lineNumber: 80,
                                                                    columnNumber: 1622
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        count,
                                                                        " ใบ"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                    lineNumber: 80,
                                                                    columnNumber: 1642
                                                                }, this),
                                                                " "
                                                            ]
                                                        }, type, true, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 80,
                                                            columnNumber: 1573
                                                        }, this)),
                                                    " "
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 80,
                                                columnNumber: 1493
                                            }, this),
                                            " "
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 80,
                                        columnNumber: 1378
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-3",
                                                children: "รหัส Export"
                                            }, void 0, false, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 80,
                                                columnNumber: 1695
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: handleCopyCode,
                                                className: "w-full",
                                                children: [
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CopyIcon"], {}, void 0, false, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 80,
                                                        columnNumber: 1857
                                                    }, this),
                                                    " คัดลอกรหัสเด็ค "
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 80,
                                                columnNumber: 1804
                                            }, this),
                                            " "
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 80,
                                        columnNumber: 1689
                                    }, this),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 80,
                                columnNumber: 575
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:col-span-2 overflow-y-auto pr-2 border-l border-emerald-500/20 pl-6",
                                children: [
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-semibold text-amber-300 border-b border-amber-400/20 pb-1 mb-4",
                                        children: [
                                            "การ์ดในเด็ค (",
                                            mainDeck.length,
                                            " ใบ)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 80,
                                        columnNumber: 1998
                                    }, this),
                                    " ",
                                    analysis.only1Card && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6 flex flex-col items-center",
                                        children: [
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-lg font-semibold text-emerald-300 mb-3",
                                                children: "Only #1"
                                            }, void 0, false, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 80,
                                                columnNumber: 2205
                                            }, this),
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative w-36 mx-auto",
                                                children: [
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: `/cards/${(0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodePath"])(analysis.only1Card.imagePath)}/${encodeURIComponent(analysis.only1Card.id.replace(' - Only#1', ''))}.png`,
                                                        alt: analysis.only1Card.name,
                                                        className: "w-full rounded-md shadow",
                                                        onError: (e)=>{
                                                            e.currentTarget.src = e.currentTarget.src.replace('.png', '.jpg');
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 80,
                                                        columnNumber: 2318
                                                    }, this),
                                                    " "
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 80,
                                                columnNumber: 2278
                                            }, this),
                                            " "
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 80,
                                        columnNumber: 2155
                                    }, this),
                                    " ",
                                    renderCardSection("Avatar Cards", analysis.avatars),
                                    " ",
                                    renderCardSection("Magic Cards", analysis.magics),
                                    " ",
                                    renderCardSection("Construct Cards", analysis.constructs),
                                    " ",
                                    analysis.otherCards.length > 0 && renderCardSection("Other Cards", analysis.otherCards),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 80,
                                columnNumber: 1909
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 80,
                        columnNumber: 489
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 80,
                columnNumber: 132
            }, this),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 80,
        columnNumber: 26
    }, this), document.body);
}
// === Deck List Modal (ย้ายมา) ===
function DeckListModal({ isOpen, onClose, userProfile, userDecks, setUserDecks, mainDeck, lifeDeck, setMainDeck, setLifeDeck, showAlert, setModal, closeModal, encodeDeckCode, decodeDeckCode, allCards, onShowCards }) {
    const [importingSlot, setImportingSlot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [importCode, setImportCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    if (!isOpen || !userProfile) return null;
    const email = userProfile.email;
    const getUserSlots = ()=>{
        const defaultSlots = [
            {
                name: "Slot 1",
                main: [],
                life: []
            },
            {
                name: "Slot 2",
                main: [],
                life: []
            }
        ];
        const userData = userDecks[email] || {
            slots: defaultSlots
        };
        if (!userDecks[email]) {
            setUserDecks((prev)=>({
                    ...prev,
                    [email]: userData
                }));
        }
        return userData.slots;
    };
    const slots = getUserSlots();
    const updateSlots = (newSlots)=>{
        setUserDecks((prev)=>({
                ...prev,
                [email]: {
                    ...prev[email],
                    slots: newSlots
                }
            }));
    };
    const handleNameChange = (index, newName)=>{
        const newSlots = [
            ...slots
        ];
        newSlots[index].name = newName;
        updateSlots(newSlots);
    };
    const handleSave = (index)=>{
        const newSlots = [
            ...slots
        ];
        newSlots[index] = {
            ...newSlots[index],
            main: mainDeck,
            life: lifeDeck
        };
        updateSlots(newSlots);
        showAlert("Deck Saved!", `บันทึกเด็คปัจจุบันลงใน "${newSlots[index].name}" แล้ว`);
    };
    const handleLoad = (index)=>{
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
    const handleExport = (index)=>{
        const slot = slots[index];
        if (slot.main.length === 0 && slot.life.length === 0) {
            showAlert("Empty Slot", "ไม่สามารถ Export Slot ที่ว่างเปล่าได้");
            return;
        }
        const code = encodeDeckCode(slot.main, slot.life);
        navigator.clipboard.writeText(code).then(()=>showAlert("Success!", `✅ คัดลอกรหัส Export ของ "${slot.name}" แล้ว!`)).catch((err)=>showAlert("Error", "ไม่สามารถคัดลอกรหัสได้"));
    };
    const handleImport = (index)=>{
        setImportingSlot(index);
        setImportCode('');
    };
    const confirmInternalImport = ()=>{
        const decoded = decodeDeckCode(importCode, allCards);
        if (decoded) {
            const newSlots = [
                ...slots
            ];
            newSlots[importingSlot].main = decoded.main;
            newSlots[importingSlot].life = decoded.life;
            updateSlots(newSlots);
            showAlert("Import Success", `นำเข้าเด็คลงใน "${slots[importingSlot].name}" สำเร็จ!`);
        } else {
            showAlert("Import Error", "รหัสเด็คไม่ถูกต้อง หรือไม่พบการ์ด");
        }
        setImportingSlot(null);
    };
    const handleShareDeck = async (index)=>{
        closeModal(); // ปิด Modal "Confirm Share" ทันที
        const slot = slots[index];
        const only1Card = slot.main.find((c)=>c.onlyRank === 1);
        if (!only1Card) {
            showAlert("ไม่สามารถแชร์ได้", "เด็คของคุณต้องมี 'Only #1' Card (การ์ดหลัก) ก่อนจึงจะแชร์ได้ค่ะ");
            return;
        }
        setModal({
            isOpen: true,
            title: "Confirm Share Deck",
            message: `คุณต้องการแชร์เด็ค "${slot.name}" สู่สาธารณะใช่หรือไม่? (ชื่อและรูปโปรไฟล์ Google ของคุณจะถูกแสดง)`,
            onConfirm: async ()=>{
                closeModal(); // ปิด Modal ยืนยัน
                try {
                    const deckData = {
                        deckName: slot.name,
                        mainDeck: slot.main.map((c)=>c.id),
                        lifeDeck: slot.life.map((c)=>c.id),
                        only1CardData: {
                            id: only1Card.id,
                            name: only1Card.name,
                            imagePath: only1Card.imagePath
                        },
                        user: {
                            name: userProfile.name,
                            picture: userProfile.picture,
                            email: userProfile.email
                        },
                        sharedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                    };
                    const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], "publicDecks"), deckData);
                    console.log("Deck shared with ID: ", docRef.id);
                    showAlert("แชร์สำเร็จ!", `เด็ค "${slot.name}" ของคุณถูกแชร์สู่สาธารณะแล้ว!`);
                } catch (e) {
                    console.error("Error adding document: ", e);
                    showAlert("เกิดข้อผิดพลาด", "ไม่สามารถแชร์เด็คได้ โปรดลองอีกครั้ง");
                }
            },
            confirmText: "Confirm Share",
            confirmIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UploadIcon"], {}, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 121,
                columnNumber: 50
            }, this)
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[220] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-slate-900/80 border border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                            className: "flex items-center justify-between p-4 border-b border-emerald-500/20 shrink-0",
                            children: [
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold text-white",
                                    children: "Deck List Manager"
                                }, void 0, false, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 128,
                                    columnNumber: 110
                                }, this),
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: onClose,
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 128,
                                    columnNumber: 179
                                }, this),
                                " "
                            ]
                        }, void 0, true, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-grow overflow-y-auto p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-300 mb-6",
                                    children: [
                                        " บันทึกเด็คของคุณที่เชื่อมต่อกับบัญชี: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-amber-300",
                                            children: userProfile.email
                                        }, void 0, false, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 130,
                                            columnNumber: 86
                                        }, this),
                                        " "
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                    children: slots.map((slot, index)=>{
                                        const deckSize = slot.main.length + slot.life.length;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardShell"], {
                                            className: "flex flex-col gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: slot.name,
                                                    onChange: (e)=>handleNameChange(index, e.target.value),
                                                    className: "w-full px-3 py-2 border border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-slate-700/50 placeholder-gray-400 text-white text-lg font-bold"
                                                }, void 0, false, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 136,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-slate-400",
                                                    children: [
                                                        " ",
                                                        deckSize > 0 ? `มี ${slot.main.length} (Main) / ${slot.life.length} (Life) ใบ` : "Slot ว่าง",
                                                        " "
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 137,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-2",
                                                    children: [
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: ()=>handleLoad(index),
                                                            disabled: deckSize === 0,
                                                            className: "bg-emerald-600/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50 hover:text-white",
                                                            children: " Load "
                                                        }, void 0, false, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 138,
                                                            columnNumber: 62
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: ()=>handleSave(index),
                                                            className: "bg-amber-600/30 border-amber-500/30 text-amber-300 hover:bg-amber-500/50 hover:text-white",
                                                            children: " Save Current "
                                                        }, void 0, false, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 138,
                                                            columnNumber: 256
                                                        }, this),
                                                        " "
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 138,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    onClick: ()=>onShowCards({
                                                            main: slot.main,
                                                            life: slot.life
                                                        }),
                                                    disabled: deckSize === 0,
                                                    className: "w-full bg-blue-600/30 border-blue-500/30 text-blue-300 hover:bg-blue-500/50 hover:text-white",
                                                    children: [
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EyeIcon"], {}, void 0, false, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 139,
                                                            columnNumber: 227
                                                        }, this),
                                                        " Show Cards "
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 139,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-2",
                                                    children: [
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: ()=>handleImport(index),
                                                            children: [
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ImportIcon"], {}, void 0, false, {
                                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                    lineNumber: 140,
                                                                    columnNumber: 107
                                                                }, this),
                                                                " Import "
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 140,
                                                            columnNumber: 62
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: ()=>handleExport(index),
                                                            disabled: deckSize === 0,
                                                            children: [
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExportIcon"], {}, void 0, false, {
                                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                    lineNumber: 140,
                                                                    columnNumber: 210
                                                                }, this),
                                                                " Export "
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 140,
                                                            columnNumber: 139
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            onClick: ()=>handleShareDeck(index),
                                                            disabled: deckSize === 0,
                                                            className: "bg-blue-600/30 border-blue-500/30 text-blue-300 hover:bg-blue-500/50 hover:text-white",
                                                            children: [
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UploadIcon"], {}, void 0, false, {
                                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                    lineNumber: 140,
                                                                    columnNumber: 414
                                                                }, this),
                                                                " Share "
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 140,
                                                            columnNumber: 242
                                                        }, this),
                                                        " "
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 140,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 135,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            importingSlot !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[230] p-4",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-slate-800 border border-emerald-500/30 rounded-xl shadow-2xl p-6 w-full max-w-md",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold text-white mb-4",
                                children: [
                                    "Import Deck Code (to ",
                                    slots[importingSlot].name,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 148,
                                columnNumber: 256
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: importCode,
                                onChange: (e)=>setImportCode(e.target.value),
                                placeholder: "วางรหัสเด็คที่นี่...",
                                rows: "4",
                                className: "w-full px-3 py-2 border border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-slate-700/50 placeholder-gray-400 text-white mb-6 resize-none"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 148,
                                columnNumber: 361
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-3",
                                children: [
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: ()=>setImportingSlot(null),
                                        className: "bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 148,
                                        columnNumber: 724
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: confirmInternalImport,
                                        className: "bg-emerald-900/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-800/50 hover:text-white",
                                        children: [
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ImportIcon"], {}, void 0, false, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 148,
                                                columnNumber: 1016
                                            }, this),
                                            " Import "
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 148,
                                        columnNumber: 865
                                    }, this),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 148,
                                columnNumber: 683
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 148,
                        columnNumber: 154
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 148,
                columnNumber: 48
            }, this), document.body)
        ]
    }, void 0, true), document.body);
}
// === Sidebar (ย้ายมา) ===
function LeftSidebar({ isSidebarOpen, searchTerm, setSearchTerm, allCardTypes, filterTypes, setFilterTypes, filterMagicType, setFilterMagicType, allColorTypes, filterColors, setFilterColors, allRarities, filterRarities, setFilterRarities, allSets, selectedSets, onSetSelectionChange, statFilters, onStatFilterChange, mainDeck, lifeDeck, RULES, addToMain, addToLife, removeFromMain, removeFromLife, handleImport, handleExport, handleClear, handleReloadFromTxt, mainDeckRef, onViewDeck, onAnalyzeDeck, isLoadingAnalysis }) {
    const allMagicTypes = [
        'Modification',
        'Land',
        'React',
        'Normal'
    ];
    const handleToggle = (setter, value)=>{
        setter((prev)=>prev.includes(value) ? prev.filter((item)=>item !== value) : [
                ...prev,
                value
            ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `w-full flex flex-col p-4 bg-black/40 md:h-full md:w-full md:shrink-0 md:border-r border-emerald-700/30 backdrop-blur-lg z-30 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}`,
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 md:overflow-y-auto pr-2 space-y-4",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold text-white mb-2",
                                children: "Filters"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 1047
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "search",
                                placeholder: "ค้นหาชื่อการ์ดหรือข้อความ...",
                                className: "w-full px-4 py-2 border border-emerald-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition bg-slate-700/50 placeholder-gray-400 text-white",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 1110
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 155,
                        columnNumber: 1041
                    }, this),
                    " ",
                    allCardTypes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilterTypes([]),
                                className: `px-3 py-1 text-sm rounded-full transition-colors ${filterTypes.length === 0 ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`,
                                children: "All"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 1501
                            }, this),
                            " ",
                            allCardTypes.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleToggle(setFilterTypes, type),
                                    className: `px-3 py-1 text-sm rounded-full transition-colors ${filterTypes.includes(type) ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`,
                                    children: type
                                }, type, false, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 155,
                                    columnNumber: 1776
                                }, this)),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 155,
                        columnNumber: 1462
                    }, this),
                    " ",
                    filterTypes.includes('Magic') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pl-4 mt-2 border-l-2 border-slate-600",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-gray-400 mt-2 mb-2 uppercase tracking-wider",
                                children: "Magic Type"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 2159
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: [
                                    " ",
                                    [
                                        'All',
                                        ...allMagicTypes
                                    ].map((magicType)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setFilterMagicType(magicType),
                                            className: `px-3 py-1 text-xs rounded-full transition-colors ${filterMagicType === magicType ? 'bg-amber-600 text-white font-semibold shadow' : 'bg-slate-600 hover:bg-slate-500 text-gray-300'}`,
                                            children: [
                                                " ",
                                                magicType,
                                                " "
                                            ]
                                        }, magicType, true, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 155,
                                            columnNumber: 2349
                                        }, this)),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 2262
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 155,
                        columnNumber: 2103
                    }, this),
                    " ",
                    allColorTypes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-gray-400 mt-4 mb-2 uppercase tracking-wider",
                                children: "Color Type"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 2696
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: [
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFilterColors([]),
                                        className: `px-3 py-1 text-sm rounded-full transition-colors ${filterColors.length === 0 ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`,
                                        children: "All"
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 155,
                                        columnNumber: 2838
                                    }, this),
                                    " ",
                                    allColorTypes.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleToggle(setFilterColors, color),
                                            className: `px-3 py-1 text-sm rounded-full transition-colors ${filterColors.includes(color) ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`,
                                            children: color
                                        }, color, false, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 155,
                                            columnNumber: 3118
                                        }, this)),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 2799
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 155,
                        columnNumber: 2690
                    }, this),
                    " ",
                    allRarities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-gray-400 mt-4 mb-2 uppercase tracking-wider",
                                children: "Rarity"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 3458
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: [
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFilterRarities([]),
                                        className: `px-3 py-1 text-sm rounded-full transition-colors ${filterRarities.length === 0 ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`,
                                        children: "All"
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 155,
                                        columnNumber: 3596
                                    }, this),
                                    " ",
                                    allRarities.map((rarity)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleToggle(setFilterRarities, rarity),
                                            className: `px-3 py-1 text-sm rounded-full transition-colors ${filterRarities.includes(rarity) ? 'bg-amber-500 text-white font-semibold shadow' : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}`,
                                            children: rarity
                                        }, rarity, false, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 155,
                                            columnNumber: 3879
                                        }, this)),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 3557
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 155,
                        columnNumber: 3452
                    }, this),
                    " ",
                    allSets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-white mb-2 mt-4",
                                children: "Card Sets"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 4223
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 max-h-40 overflow-y-auto pr-2",
                                children: [
                                    " ",
                                    allSets.map((set)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2 text-gray-300 cursor-pointer",
                                            children: [
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: selectedSets.includes(set),
                                                    onChange: ()=>onSetSelectionChange(set),
                                                    className: "w-4 h-4 rounded bg-slate-600 border-slate-500 text-amber-500 focus:ring-amber-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 155,
                                                    columnNumber: 4460
                                                }, this),
                                                " ",
                                                typeof set === 'string' ? set.split('/')[1] || set : set,
                                                " "
                                            ]
                                        }, set, true, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 155,
                                            columnNumber: 4377
                                        }, this)),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 4297
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 155,
                        columnNumber: 4217
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-white mb-2 mt-4",
                                children: "Stats"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 4757
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-2 text-sm",
                                children: [
                                    " ",
                                    [
                                        'cost',
                                        'power',
                                        'gem'
                                    ].map((stat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "capitalize text-gray-400",
                                                    children: stat
                                                }, void 0, false, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 155,
                                                    columnNumber: 4933
                                                }, this),
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    placeholder: "Min",
                                                    min: "0",
                                                    value: statFilters[stat].min,
                                                    onChange: (e)=>onStatFilterChange(stat, 'min', e.target.value),
                                                    className: "w-full mt-1 px-2 py-1 border border-emerald-500/30 rounded-md bg-slate-700/50 text-white text-center"
                                                }, void 0, false, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 155,
                                                    columnNumber: 4992
                                                }, this),
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    placeholder: "Max",
                                                    min: "0",
                                                    value: statFilters[stat].max,
                                                    onChange: (e)=>onStatFilterChange(stat, 'max', e.target.value),
                                                    className: "w-full mt-1 px-2 py-1 border border-emerald-500/30 rounded-md bg-slate-700/50 text-white text-center"
                                                }, void 0, false, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 155,
                                                    columnNumber: 5251
                                                }, this),
                                                " "
                                            ]
                                        }, stat, true, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 155,
                                            columnNumber: 4916
                                        }, this)),
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 4827
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 155,
                        columnNumber: 4751
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 155,
                columnNumber: 982
            }, this),
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0 pt-4",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4 mb-4",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckTray, {
                                ref: mainDeckRef,
                                title: `Main Deck`,
                                deck: mainDeck,
                                capacity: RULES.main.size,
                                onDropCard: addToMain,
                                onRemoveCard: removeFromMain,
                                highlight: true,
                                onViewDeck: ()=>onViewDeck('main')
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 5617
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckTray, {
                                title: `Life Deck`,
                                deck: lifeDeck,
                                capacity: RULES.life.size,
                                onDropCard: addToLife,
                                onRemoveCard: removeFromLife,
                                onViewDeck: ()=>onViewDeck('life')
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 5812
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 155,
                        columnNumber: 5574
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: onAnalyzeDeck,
                        disabled: isLoadingAnalysis,
                        className: "w-full bg-emerald-600/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/50 hover:text-white",
                        children: [
                            " ",
                            isLoadingAnalysis ? 'กำลังประมวลผล...' : 'สร้างเด็ค',
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 155,
                        columnNumber: 5986
                    }, this),
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-emerald-700/30",
                        children: [
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleImport,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ImportIcon"], {}, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 155,
                                        columnNumber: 6343
                                    }, this),
                                    " Import"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 6312
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleExport,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExportIcon"], {}, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 155,
                                        columnNumber: 6405
                                    }, this),
                                    " Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 6374
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleClear,
                                className: "col-span-2 bg-red-900/50 border-red-500/30 text-red-300 hover:bg-red-800/50 hover:text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClearIcon"], {}, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 155,
                                        columnNumber: 6571
                                    }, this),
                                    " Clear Deck"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 6436
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleReloadFromTxt,
                                className: "col-span-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DBLoadIcon"], {}, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 155,
                                        columnNumber: 6665
                                    }, this),
                                    " Reload from TXT"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 155,
                                columnNumber: 6604
                            }, this),
                            " "
                        ]
                    }, void 0, true, {
                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                        lineNumber: 155,
                        columnNumber: 6230
                    }, this),
                    " "
                ]
            }, void 0, true, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 155,
                columnNumber: 5542
            }, this),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 155,
        columnNumber: 741
    }, this);
}
// === Card grid (ย้ายมา) ===
function CardGrid({ cards, onDoubleClick, onViewDetails, onAddCard }) {
    if (cards.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardShell"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-16 text-slate-300",
                children: "ไม่พบการ์ดตามเงื่อนไข"
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 158,
                columnNumber: 118
            }, this)
        }, void 0, false, {
            fileName: "[project]/bot-nextjs/src/app/page.jsx",
            lineNumber: 158,
            columnNumber: 107
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8",
        children: [
            " ",
            cards.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CardItem, {
                    card: card,
                    onDoubleClick: onDoubleClick,
                    onViewDetails: onViewDetails,
                    onAddCard: onAddCard
                }, card.id, false, {
                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                    lineNumber: 158,
                    columnNumber: 356
                }, this)),
            " "
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 158,
        columnNumber: 221
    }, this);
}
// === Data loading from TXT (ย้ายมา) ===
// (หมายเหตุ: CARD_PATHS อาจจะต้องถูกย้ายไปไฟล์ config)
const CARD_PATHS = [
    'BOT-S01/Red',
    'BOT-S01/Green',
    'BOT-S01/Blue',
    'BOT-S01/Purple',
    'BOT-S01/Yellow',
    'BOT-S01/Black',
    'BOT-S01/White',
    'BOT-S01/Item'
];
async function fetchAllTxt() {
    let allCards = [];
    console.log("📦 Reloading cards from TXT...");
    for (const pathString of CARD_PATHS){
        const encodedPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodePath"])(pathString);
        const pathParts = typeof pathString === 'string' ? pathString.split('/') : [];
        const deckName = pathParts[1] || '';
        const filename = `cards${deckName}.txt`;
        const url = `/cards/${encodedPath}/${encodeURIComponent(filename)}`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.warn(`Could not fetch ${url}. Status: ${res.status}`);
                continue;
            }
            const txt = await res.text();
            const data = JSON.parse(txt);
            if (Array.isArray(data)) {
                const withPath = data.map((card)=>({
                        ...card,
                        imagePath: pathString,
                        onlyRank: card.id.includes('- Only#1') ? 1 : card.onlyRank
                    }));
                allCards = allCards.concat(withPath);
                console.log(`  ✔ ${data.length} from ${pathString}`);
            }
        } catch (e) {
            console.error(`load fail ${url}`, e);
        }
    }
    console.log(`✅ โหลดการ์ดทั้งหมด ${allCards.length} ใบ`);
    return allCards;
}
const getMagicSubType = (card)=>{
    if (card.type !== 'Magic') {
        return null;
    }
    return card.magicType || 'Normal';
};
function Page() {
    const [mainDeck, setMainDeck] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$hooks$2f$useLocalStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocalStorage"])("bot-mainDeck-v32-final", []);
    const [lifeDeck, setLifeDeck] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$hooks$2f$useLocalStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocalStorage"])("bot-lifeDeck-v32-final", []);
    const [cardDb, setCardDb] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$hooks$2f$useLocalStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocalStorage"])("bot-cardDb-v32-final", []);
    const [userDecks, setUserDecks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$hooks$2f$useLocalStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocalStorage"])("bot-userDecks-v1", {});
    const [isDeckListModalOpen, setIsDeckListModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAnimating, setIsAnimating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [flyingCard, setFlyingCard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const mainDeckRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [zoomedCard, setZoomedCard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [analysisDeck, setAnalysisDeck] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeView, setActiveView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('cards');
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterTypes, setFilterTypes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filterMagicType, setFilterMagicType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("All");
    const [filterColors, setFilterColors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filterRarities, setFilterRarities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedSets, setSelectedSets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [statFilters, setStatFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        cost: {
            min: '',
            max: ''
        },
        power: {
            min: '',
            max: ''
        },
        gem: {
            min: '',
            max: ''
        }
    });
    const allCardTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Array.from(new Set(cardDb.map((c)=>c.type).filter(Boolean))).sort(), [
        cardDb
    ]);
    const allColorTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Array.from(new Set(cardDb.map((c)=>c.colorType).filter(Boolean))).sort(), [
        cardDb
    ]);
    const allRarities = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Array.from(new Set(cardDb.map((c)=>c.rarity).filter(Boolean))).sort(), [
        cardDb
    ]);
    const allSets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Array.from(new Set(cardDb.map((c)=>c.imagePath).filter(Boolean))).sort(), [
        cardDb
    ]);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const PAGE_SIZE = 30;
    const [isSidebarOpen, setIsSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const toggleSidebar = ()=>setIsSidebarOpen((prev)=>!prev);
    const [modal, setModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });
    const [isImportModalOpen, setIsImportModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
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
    const closeImportModal = ()=>setIsImportModalOpen(false);
    const [userProfile, setUserProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$hooks$2f$useLocalStorage$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocalStorage"])("bot-userProfile-v1", null);
    const handleLoginSuccess = (credentialResponse)=>{
        console.log("Google Login Success:", credentialResponse);
        try {
            const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$jwt$2d$decode$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jwtDecode"])(credentialResponse.credential);
            console.log("Decoded User Info:", decoded);
            setUserProfile({
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture
            });
            if (!userDecks[decoded.email]) {
                console.log("Creating new deck slots for user:", decoded.email);
                setUserDecks((prev)=>({
                        ...prev,
                        [decoded.email]: {
                            slots: [
                                {
                                    name: "Slot 1",
                                    main: [],
                                    life: []
                                },
                                {
                                    name: "Slot 2",
                                    main: [],
                                    life: []
                                }
                            ]
                        }
                    }));
            }
        } catch (error) {
            console.error("Failed to decode JWT:", error);
        }
    };
    const handleLoginError = ()=>{
        console.log('Login Failed');
        showAlert("Login Failed", "ไม่สามารถเข้าสู่ระบบด้วย Google ได้ โปรดลองอีกครั้ง");
    };
    const handleLogout = ()=>{
        setUserProfile(null);
        setIsDeckListModalOpen(false);
        console.log("User logged out.");
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (cardDb.length === 0) {
            handleReloadFromTxt();
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setCurrentPage(1);
    }, [
        searchTerm,
        filterTypes,
        filterMagicType,
        filterColors,
        filterRarities,
        selectedSets,
        statFilters
    ]);
    const handleAnalyzeDeck = ()=>{
        if (mainDeck.length === 0) {
            showAlert("ไม่มีการ์ดในเด็ค", "โปรดใส่การ์ดใน Main Deck ก่อนทำการสร้างเด็ค");
            return;
        }
        setIsLoadingAnalysis(true);
        setTimeout(()=>{
            setIsLoadingAnalysis(false);
            setAnalysisDeck({
                main: mainDeck,
                life: lifeDeck
            });
        }, 500);
    };
    const handleReloadFromTxt = async ()=>{
        const all = await fetchAllTxt();
        if (all.length > 0) setCardDb(all);
    };
    const handleSetSelectionChange = (set)=>{
        setSelectedSets((prev)=>prev.includes(set) ? prev.filter((s)=>s !== set) : [
                ...prev,
                set
            ]);
    };
    const handleStatFilterChange = (stat, field, value)=>{
        const numValue = value === '' ? '' : Math.max(0, parseInt(value, 10));
        setStatFilters((prev)=>({
                ...prev,
                [stat]: {
                    ...prev[stat],
                    [field]: numValue
                }
            }));
    };
    const filteredCardDb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (cardDb.length === 0) return [];
        return cardDb.filter((c)=>{
            const term = searchTerm.toLowerCase();
            if (!(c.name?.toLowerCase().includes(term) || (c.text || "").toLowerCase().includes(term))) return false;
            if (selectedSets.length > 0 && !selectedSets.includes(c.imagePath)) return false;
            if (statFilters.cost.min !== '' && (c.cost ?? 0) < statFilters.cost.min) return false;
            if (statFilters.cost.max !== '' && (c.cost ?? 0) > statFilters.cost.max) return false;
            if (statFilters.power.min !== '' && (c.power ?? 0) < statFilters.power.min) return false;
            if (statFilters.power.max !== '' && (c.power ?? 0) > statFilters.power.max) return false;
            if (statFilters.gem.min !== '' && (c.gem ?? 0) < statFilters.gem.min) return false;
            if (statFilters.gem.max !== '' && (c.gem ?? 0) > statFilters.gem.max) return false;
            if (filterColors.length > 0 && !filterColors.includes(c.colorType)) return false;
            if (filterRarities.length > 0 && !filterRarities.includes(c.rarity)) return false;
            if (filterTypes.length > 0 && !filterTypes.includes(c.type)) return false;
            if (c.type === 'Magic' && filterTypes.includes('Magic') && filterMagicType !== 'All') {
                if (getMagicSubType(c) !== filterMagicType) {
                    return false;
                }
            }
            return true;
        });
    }, [
        cardDb,
        searchTerm,
        filterTypes,
        filterMagicType,
        filterColors,
        filterRarities,
        selectedSets,
        statFilters
    ]);
    const totalPages = Math.ceil(filteredCardDb.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedCards = filteredCardDb.slice(startIndex, endIndex);
    const [viewingDeck, setViewingDeck] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const addToMain = (card)=>{
        if (card.lifeEligible) {
            showAlert("ไม่สามารถเพิ่มได้", `การ์ด "${card.name}" เป็นการ์ดสำหรับ Life Deck เท่านั้น`);
            return;
        }
        if (card.onlyRank === 1 && mainDeck.some((c)=>c.onlyRank === 1)) {
            showAlert("Rule Violation", "You can only have one 'Only #1' card in your Main Deck.");
            return;
        }
        if (mainDeck.filter((c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nameKey"])(c.name) === (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nameKey"])(card.name)).length >= __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULES"].main.maxCopiesPerName) {
            showAlert("Rule Violation", `You cannot have more than ${__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULES"].main.maxCopiesPerName} copies of "${card.name}".`);
            return;
        }
        if (mainDeck.length >= __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULES"].main.size) {
            showAlert("Deck Full", "Your Main Deck has reached the 50-card limit.");
            return;
        }
        setMainDeck((prev)=>[
                ...prev,
                card
            ]);
    };
    const removeFromMain = (card)=>{
        const idx = mainDeck.findLastIndex((c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nameKey"])(c.name) === (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nameKey"])(card.name));
        if (idx > -1) setMainDeck((prev)=>prev.filter((_, i)=>i !== idx));
    };
    const addToLife = (card)=>{
        if (!card.lifeEligible) {
            showAlert("Invalid Card", `การ์ด "${card.name}" ไม่สามารถใส่ใน Life Deck ได้`);
            return;
        }
        ;
        if (lifeDeck.length >= __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULES"].life.size) {
            showAlert("Deck Full", `Life Deck เต็มแล้ว (ใส่ได้ ${__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULES"].life.size} ใบ)`);
            return;
        }
        ;
        if (!lifeDeck.some((c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nameKey"])(c.name) === (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nameKey"])(card.name))) {
            setLifeDeck((prev)=>[
                    ...prev,
                    card
                ]);
        } else {
            showAlert("Duplicate Card", `การ์ดชื่อ "${card.name}" มีใน Life Deck แล้ว (ชื่อห้ามซ้ำ)`);
        }
    };
    const removeFromLife = (card)=>{
        const idx = lifeDeck.findIndex((c)=>c.id === card.id);
        if (idx > -1) setLifeDeck((prev)=>prev.filter((_, i)=>i !== idx));
    };
    const handleCardDoubleClick = (card, cardElement)=>{
        if (isAnimating || !cardElement || !mainDeckRef.current) return;
        if (card.lifeEligible) {
            showAlert("ไม่สามารถเพิ่มได้", `การ์ด "${card.name}" เป็นการ์ดสำหรับ Life Deck เท่านั้น โปรดลากไปวางใน Life Deck`);
            return;
        }
        setIsAnimating(true);
        const startRect = cardElement.getBoundingClientRect();
        const endRect = mainDeckRef.current.getBoundingClientRect();
        setFlyingCard({
            card,
            startRect,
            endRect
        });
    };
    const handleAnimationComplete = ()=>{
        if (flyingCard) {
            addToMain(flyingCard.card);
            setFlyingCard(null);
            setIsAnimating(false);
        }
    };
    const handleExportCode = ()=>{
        if (mainDeck.length === 0 && lifeDeck.length === 0) {
            showAlert("Empty Deck", "เด็คของคุณว่างเปล่า ไม่มีอะไรให้ Export");
            return;
        }
        const code = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodeDeckCode"])(mainDeck, lifeDeck);
        navigator.clipboard.writeText(code).then(()=>showAlert("Success!", `✅ คัดลอกรหัสเด็คลง Clipboard แล้ว!`)).catch((err)=>{
            console.error('Failed to copy code: ', err);
            showAlert("Error", "ไม่สามารถคัดลอกรหัสเด็คได้");
        });
    };
    const handleImport = ()=>{
        setIsImportModalOpen(true);
    };
    const confirmImport = (code)=>{
        closeImportModal();
        if (!code) {
            return;
        }
        const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeDeckCode"])(code, cardDb);
        if (decoded) {
            setMainDeck(decoded.main);
            setLifeDeck(decoded.life);
            showAlert("Import Success", "นำเข้าเด็คสำเร็จ!");
        } else {
            showAlert("Import Error", "รหัสเด็คไม่ถูกต้อง หรือไม่พบการ์ดบางใบในฐานข้อมูลปัจจุบัน");
        }
    };
    const handleExport = handleExportCode;
    const handleClear = ()=>{
        setModal({
            isOpen: true,
            title: "Confirm Clear Deck",
            message: "คุณต้องการล้างเด็คทั้งหมด (Main และ Life) ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
            onConfirm: ()=>{
                setMainDeck([]);
                setLifeDeck([]);
                closeModal();
            },
            confirmText: "Confirm Clear",
            confirmIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClearIcon"], {}, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 284,
                columnNumber: 296
            }, this)
        });
    };
    return(// ✨ [แก้ไข] ลบ DndProvider ที่ห่อหุ้มออก (เพราะมันอยู่ใน layout.jsx แล้ว)
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DndStateProvider, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#334155}`
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 289,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomDragLayer, {}, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 290,
                columnNumber: 7
            }, this),
            flyingCard && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FlyingCard, {
                ...flyingCard,
                onComplete: handleAnimationComplete
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 291,
                columnNumber: 22
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-screen flex flex-col text-gray-200 bg-black",
                children: !userProfile ? // --- 1. หน้าจอเมื่อยังไม่ Login ---
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 flex flex-col items-center justify-center p-8 gap-6 bg-gradient-to-br from-slate-900 to-black",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/cards/LOGOBOT.png",
                            alt: "Battle Of Talingchan Logo",
                            className: "w-32 h-32 object-contain",
                            onError: (e)=>{
                                e.currentTarget.style.display = 'none';
                            }
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 299,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 to-emerald-400 bg-clip-text text-transparent text-center",
                            children: "Deck Builder"
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 305,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xl text-gray-300",
                            children: "กรุณาเข้าสู่ระบบด้วย Google เพื่อใช้งาน"
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 308,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 scale-110",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleLogin"], {
                                onSuccess: handleLoginSuccess,
                                onError: handleLoginError,
                                theme: "filled_black",
                                size: "large",
                                shape: "pill",
                                text: "signin_with",
                                logo_alignment: "left"
                            }, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 310,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 309,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-12 pt-8 border-t border-emerald-700/30 w-full max-w-sm flex flex-col items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-amber-300 mb-4 text-center",
                                    children: "สามารถสนับสนุนค่ากาแฟและค่าเซิร์ฟเวอร์ได้ที่นี่นะคะ ❤️❤️❤️"
                                }, void 0, false, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 321,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "/assets/QRCODE.png",
                                    alt: "Donate QR Code",
                                    className: "w-48 h-48 mx-auto rounded-lg border-4 border-emerald-500/30",
                                    onError: (e)=>{
                                        console.warn("QR Code image not found");
                                        e.currentTarget.style.display = 'none';
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 324,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                    src: "/assets/VDO.mov",
                                    autoPlay: true,
                                    loop: true,
                                    muted: true,
                                    playsInline: true,
                                    className: "w-full h-auto max-w-[400px] mt-6 rounded-lg border-4 border-emerald-500/30",
                                    width: "540",
                                    height: "540",
                                    onError: (e)=>{
                                        console.warn("VDO file not found");
                                        e.currentTarget.style.display = 'none';
                                    },
                                    children: "Your browser does not support the video tag."
                                }, void 0, false, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 330,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 320,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                    lineNumber: 298,
                    columnNumber: 11
                }, this) : // --- 2. หน้าแอปหลัก (เมื่อ Login แล้ว) ---
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                            className: "px-4 lg:px-6 py-2 border-b border-emerald-700/30 bg-black/60 backdrop-blur-sm shrink-0 z-40",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 to-emerald-400 bg-clip-text text-transparent",
                                        children: "Battle Of Talingchan"
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 346,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            userProfile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/public-decks",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                            as: "span",
                                                            className: "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg hover:from-blue-400 hover:to-purple-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UsersIcon"], {}, void 0, false, {
                                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                    lineNumber: 358,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "hidden md:inline",
                                                                    children: "Public Decks"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                    lineNumber: 359,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 354,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 353,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                        onClick: ()=>setIsDeckListModalOpen(true),
                                                        className: "bg-gradient-to-r from-amber-500 to-emerald-600 text-white border-none shadow-lg hover:from-amber-400 hover:to-emerald-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DeckIcon"], {}, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 366,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "hidden md:inline",
                                                                children: "My Deck List"
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 367,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 362,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true),
                                            userProfile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: userProfile.picture,
                                                        alt: userProfile.name,
                                                        className: "w-8 h-8 rounded-full border-2 border-emerald-500",
                                                        title: `Logged in as ${userProfile.name} (${userProfile.email})`
                                                    }, void 0, false, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 373,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white hidden md:block text-sm",
                                                        children: userProfile.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 379,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                        onClick: handleLogout,
                                                        className: "bg-red-900/50 border-red-500/30 text-red-300 hover:bg-red-800/50 hover:text-white px-3 py-1 text-sm",
                                                        children: "Logout"
                                                    }, void 0, false, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 382,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleLogin"], {
                                                onSuccess: handleLoginSuccess,
                                                onError: handleLoginError,
                                                theme: "filled_black",
                                                size: "medium",
                                                shape: "pill",
                                                text: "signin_with",
                                                logo_alignment: "left"
                                            }, void 0, false, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 390,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 349,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 345,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 344,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "flex-1 flex flex-col md:flex-row overflow-hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: ` ${activeView === 'deck' ? 'block' : 'hidden'} md:block ${isSidebarOpen ? 'md:w-[360px]' : 'md:w-0'} transition-all duration-300 ease-in-out overflow-hidden shrink-0 relative md:h-full w-full h-full overflow-y-auto md:overflow-y-hidden pb-16 md:pb-0 `,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LeftSidebar, {
                                        isSidebarOpen: isSidebarOpen,
                                        searchTerm: searchTerm,
                                        setSearchTerm: setSearchTerm,
                                        allCardTypes: allCardTypes,
                                        filterTypes: filterTypes,
                                        setFilterTypes: setFilterTypes,
                                        filterMagicType: filterMagicType,
                                        setFilterMagicType: setFilterMagicType,
                                        allColorTypes: allColorTypes,
                                        filterColors: filterColors,
                                        setFilterColors: setFilterColors,
                                        allRarities: allRarities,
                                        filterRarities: filterRarities,
                                        setFilterRarities: setFilterRarities,
                                        allSets: allSets,
                                        selectedSets: selectedSets,
                                        onSetSelectionChange: handleSetSelectionChange,
                                        statFilters: statFilters,
                                        onStatFilterChange: handleStatFilterChange,
                                        mainDeck: mainDeck,
                                        lifeDeck: lifeDeck,
                                        RULES: __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULES"],
                                        addToMain: addToMain,
                                        addToLife: addToLife,
                                        removeFromMain: removeFromMain,
                                        removeFromLife: removeFromLife,
                                        handleImport: handleImport,
                                        handleExport: handleExport,
                                        handleClear: handleClear,
                                        handleReloadFromTxt: handleReloadFromTxt,
                                        mainDeckRef: mainDeckRef,
                                        onViewDeck: setViewingDeck,
                                        onAnalyzeDeck: handleAnalyzeDeck,
                                        isLoadingAnalysis: isLoadingAnalysis
                                    }, void 0, false, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 407,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 406,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden md:flex items-center justify-center shrink-0 border-l border-emerald-700/30 bg-black/40",
                                    children: [
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: toggleSidebar,
                                            className: "p-1 text-emerald-400 hover:text-white hover:bg-emerald-700/50 rounded-full transition-colors",
                                            title: isSidebarOpen ? "ซ่อน Filter" : "แสดง Filter",
                                            children: [
                                                " ",
                                                isSidebarOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChevronLeftIcon"], {}, void 0, false, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 409,
                                                    columnNumber: 337
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ChevronRightIcon"], {}, void 0, false, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 409,
                                                    columnNumber: 359
                                                }, this),
                                                " "
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 409,
                                            columnNumber: 128
                                        }, this),
                                        " "
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 409,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${activeView === 'cards' ? 'flex' : 'hidden'} md:flex flex-1 flex-col`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: ` flex-1 overflow-y-auto transition-all duration-300 ease-in-out p-4 lg:py-8 md:pr-12 lg:pr-16 ${isSidebarOpen ? 'md:pl-12 lg:pl-16' : 'md:pl-16 lg:pl-24 xl:pl-32'} `,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative bg-slate-900 text-center py-8 px-4 border-b border-emerald-700/30 overflow-hidden rounded-lg mb-10",
                                                children: [
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 bg-gradient-to-b from-black/30 to-slate-900 opacity-50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 412,
                                                        columnNumber: 149
                                                    }, this),
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 bg-cover bg-center opacity-10",
                                                        style: {
                                                            backgroundImage: "url('https://www.tcgthailand.com/assets/img/banner.1b838965.webp')"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 412,
                                                        columnNumber: 245
                                                    }, this),
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative z-10 flex flex-col items-center justify-center",
                                                        children: [
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: "/cards/LOGOBOT.png",
                                                                alt: "Battle Of Talingchan Logo",
                                                                className: "w-24 h-24 md:w-28 md:h-28 mb-2 object-contain drop-shadow-lg",
                                                                onError: (e)=>{
                                                                    e.currentTarget.style.display = 'none';
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 412,
                                                                columnNumber: 486
                                                            }, this),
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                                className: "text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md",
                                                                children: "Battle Of Talingchan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 412,
                                                                columnNumber: 685
                                                            }, this),
                                                            " "
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 412,
                                                        columnNumber: 412
                                                    }, this),
                                                    " "
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 412,
                                                columnNumber: 23
                                            }, this),
                                            cardDb.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardShell"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center py-20",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-2xl font-bold text-white mb-2",
                                                            children: "กำลังโหลดฐานข้อมูลการ์ด..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 413,
                                                            columnNumber: 93
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-300",
                                                            children: 'หากไม่สำเร็จ ลองกด "Reload from TXT" ที่แถบซ้าย'
                                                        }, void 0, false, {
                                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                            lineNumber: 413,
                                                            columnNumber: 175
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                    lineNumber: 413,
                                                    columnNumber: 58
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                lineNumber: 413,
                                                columnNumber: 47
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CardGrid, {
                                                        cards: paginatedCards,
                                                        onDoubleClick: handleCardDoubleClick,
                                                        onViewDetails: setZoomedCard,
                                                        onAddCard: addToMain
                                                    }, void 0, false, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 415,
                                                        columnNumber: 27
                                                    }, this),
                                                    totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative z-[70] flex items-center justify-center gap-4 mt-12 py-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                onClick: ()=>setCurrentPage((p)=>Math.max(1, p - 1)),
                                                                disabled: currentPage === 1,
                                                                children: " ย้อนกลับ "
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 418,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-white font-semibold tabular-nums",
                                                                children: [
                                                                    " หน้า ",
                                                                    currentPage,
                                                                    " / ",
                                                                    totalPages,
                                                                    " "
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 419,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Common$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                onClick: ()=>setCurrentPage((p)=>Math.min(totalPages, p + 1)),
                                                                disabled: currentPage === totalPages,
                                                                children: " ถัดไป "
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 420,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 417,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                                        className: "relative z-[70] mt-16 py-10 text-center border-t border-emerald-700/30",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-lg font-semibold text-amber-300 mb-4",
                                                                children: "สามารถสนับสนุนค่ากาแฟและค่าเซิร์ฟเวอร์ได้ที่นี่นะคะ ❤️❤️❤️"
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 424,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: "/assets/QRCODE.png",
                                                                alt: "Donate QR Code",
                                                                className: "w-48 h-48 mx-auto rounded-lg border-4 border-emerald-500/30",
                                                                onError: (e)=>{
                                                                    console.warn("QR Code image not found");
                                                                    e.currentTarget.style.display = 'none';
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                                lineNumber: 427,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                                        lineNumber: 423,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                        lineNumber: 411,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 410,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 404,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-lg border-t border-emerald-700/30 z-50 flex items-stretch",
                            children: [
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `flex-1 flex flex-col items-center justify-center p-2 text-xs transition-colors ${activeView === 'cards' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`,
                                    onClick: ()=>setActiveView('cards'),
                                    children: [
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardsIcon"], {}, void 0, false, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 440,
                                            columnNumber: 383
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "การ์ด"
                                        }, void 0, false, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 440,
                                            columnNumber: 397
                                        }, this),
                                        " "
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 440,
                                    columnNumber: 160
                                }, this),
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `flex-1 flex flex-col items-center justify-center p-2 text-xs transition-colors ${activeView === 'deck' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`,
                                    onClick: ()=>setActiveView('deck'),
                                    children: [
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DeckIcon"], {}, void 0, false, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 440,
                                            columnNumber: 647
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "เด็ค"
                                        }, void 0, false, {
                                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                            lineNumber: 440,
                                            columnNumber: 660
                                        }, this),
                                        " "
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                    lineNumber: 440,
                                    columnNumber: 426
                                }, this),
                                " "
                            ]
                        }, void 0, true, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 440,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Modal$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            isOpen: modal.isOpen,
                            title: modal.title,
                            onClose: closeModal,
                            onConfirm: modal.onConfirm,
                            confirmText: modal.onConfirm ? modal.confirmText || "Confirm" : undefined,
                            confirmIcon: modal.onConfirm ? modal.confirmIcon || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$components$2f$ui$2f$Icons$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClearIcon"], {}, void 0, false, {
                                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                                lineNumber: 443,
                                columnNumber: 238
                            }, void 0) : undefined,
                            children: [
                                " ",
                                modal.message,
                                " "
                            ]
                        }, void 0, true, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 443,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ImportDeckModal, {
                            isOpen: isImportModalOpen,
                            onClose: closeImportModal,
                            onImport: confirmImport
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 444,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckAnalysisModal, {
                            isOpen: analysisDeck !== null,
                            onClose: ()=>setAnalysisDeck(null),
                            mainDeck: analysisDeck ? analysisDeck.main : [],
                            lifeDeck: analysisDeck ? analysisDeck.life : [],
                            showAlert: showAlert
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 445,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckViewModal, {
                            isOpen: viewingDeck !== null,
                            onClose: ()=>setViewingDeck(null),
                            deck: viewingDeck === 'main' ? mainDeck : lifeDeck,
                            rules: viewingDeck === 'main' ? __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULES"].main : __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULES"].life,
                            onAddCard: viewingDeck === 'main' ? addToMain : addToLife,
                            onRemoveCard: viewingDeck === 'main' ? removeFromMain : removeFromLife,
                            title: viewingDeck === 'main' ? "Main Deck" : "Life Deck"
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 452,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CardDetailModal, {
                            card: zoomedCard,
                            onClose: ()=>setZoomedCard(null)
                        }, void 0, false, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 453,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DeckListModal, {
                            isOpen: isDeckListModalOpen,
                            onClose: ()=>setIsDeckListModalOpen(false),
                            userProfile: userProfile,
                            userDecks: userDecks,
                            setUserDecks: setUserDecks,
                            mainDeck: mainDeck,
                            lifeDeck: lifeDeck,
                            setMainDeck: setMainDeck,
                            setLifeDeck: setLifeDeck,
                            showAlert: showAlert,
                            setModal: setModal,
                            closeModal: closeModal,
                            encodeDeckCode: __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodeDeckCode"],
                            decodeDeckCode: __TURBOPACK__imported__module__$5b$project$5d2f$bot$2d$nextjs$2f$src$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decodeDeckCode"],
                            allCards: cardDb,
                            onShowCards: (deck)=>setAnalysisDeck(deck)
                        }, userProfile?.email || 'guest', false, {
                            fileName: "[project]/bot-nextjs/src/app/page.jsx",
                            lineNumber: 454,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/bot-nextjs/src/app/page.jsx",
                lineNumber: 293,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/bot-nextjs/src/app/page.jsx",
        lineNumber: 288,
        columnNumber: 5
    }, this));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f1c2b420._.js.map