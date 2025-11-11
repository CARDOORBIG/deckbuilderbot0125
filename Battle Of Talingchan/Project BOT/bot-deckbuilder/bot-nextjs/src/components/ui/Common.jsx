import React, { forwardRef } from 'react'; // <--- ต้องมี forwardRef

export const Button = ({ className = "", children, ...props }) => (
  <button
    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-amber-400/20 bg-amber-900/30 text-amber-300 hover:bg-amber-700/50 hover:text-white hover:border-amber-400/60 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-900/30 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Pill = ({ children, className = "" }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${className}`}>{children}</span>
);

export const CardShell = forwardRef(function CardShell({ children, className = "", ...props }, ref) {
  return (
    <div ref={ref} className={`bg-slate-900/70 backdrop-blur-sm p-4 rounded-xl border border-emerald-500/20 shadow-lg transition-all hover:border-amber-400/50 hover:shadow-amber-500/10 ${className}`} {...props}>
      {children}
    </div>
  );
});

export const ColorPip = ({ color }) => {
  const colorClasses = { Red: 'bg-red-500', Green: 'bg-green-500', Purple: 'bg-purple-500', Blue: 'bg-blue-500', Yellow: 'bg-yellow-500', Black: 'bg-gray-800', White: 'bg-slate-200' };
  return <span className={`w-3 h-3 rounded-full ${colorClasses[color] || 'bg-slate-400'}`} title={color}></span>;
};