import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const wallpaperImg = "/assets/wallblueR.jpg";
const logoImg = "/assets/LOGO.png";

const Login = ({ onSuccess, onError }) => {
  return (
    <div className="fixed inset-0 flex flex-row w-full h-full overflow-hidden bg-gray-900">

      {/* ================= LEFT SIDE: Login Strip ================= */}
      <div className="w-full md:w-[450px] flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-20 relative h-full">

         {/* 1. ส่วนบน: LOGO */}
         <div className="h-[45%] bg-slate-800 flex items-center justify-center p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 opacity-10"></div>
            <img
              src={logoImg} 
              alt="Logo"
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 w-full h-6 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
         </div>

         {/* 2. ส่วนล่าง: FORM */}
         <div className="h-[55%] bg-white flex flex-col justify-center items-center px-10 pb-10 relative">
            
            <div className="w-full max-w-xs">
                <div className="mb-8">
                    <h2 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 font-medium">เข้าสู่ระบบเพื่อจัดการเด็คและการประมูลของคุณ</p>
                </div>

                {/* ปุ่ม Google */}
                <div className="flex justify-center w-full transform hover:-translate-y-1 transition-transform duration-300 shadow-sm rounded-full overflow-hidden">
                  <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onError}
                    useOneTap
                    theme="outline"
                    size="large"
                    shape="pill"
                    text="continue_with"
                    width="250"
                  />
                </div>

                <div className="mt-8 text-[10px] text-center text-slate-400 leading-relaxed">
                    By continuing, you agree to our <br/>
                    <span className="underline cursor-pointer hover:text-slate-600">Terms of Service</span> and <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
                </div>
            </div>

            <div className="absolute bottom-4 text-center text-slate-300 text-[10px]">
                © 2024 DeckBuilder Inc. All rights reserved.
            </div>
         </div>

      </div>

      {/* ================= RIGHT SIDE: Wallpaper ================= */}
      <div 
        className="hidden md:flex flex-1 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${wallpaperImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>

    </div>
  );
};

export default Login;