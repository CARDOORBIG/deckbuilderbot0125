import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from "react-dom";
import { ImageIcon, FacebookIcon, PhoneIcon, LineIcon, CheckIcon, PencilIcon } from './Icons';

const resizeImage = (file) => {
    // ... (โค้ด resize เดิม)
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

const ProfileSetupModal = ({ isOpen, onClose, userProfile, onSave }) => {
    const [nickname, setNickname] = useState(userProfile?.name || "");
    const [avatarUrl, setAvatarUrl] = useState(userProfile?.picture || "");
    const [useGoogleAvatar, setUseGoogleAvatar] = useState(true);
    
    const [facebook, setFacebook] = useState("");
    const [lineId, setLineId] = useState("");
    const [phone, setPhone] = useState("");

    const [editMode, setEditMode] = useState({
        facebook: false,
        lineId: false,
        phone: false
    });

    const fileInputRef = useRef(null);
  
    useEffect(() => { 
        if (isOpen) { 
            setNickname(userProfile?.name || ""); 
            setAvatarUrl(userProfile?.picture || ""); 
            setUseGoogleAvatar(true); 
            setFacebook(userProfile?.facebook || "");
            setLineId(userProfile?.lineId || "");
            setPhone(userProfile?.phone || "");
            setEditMode({ facebook: false, lineId: false, phone: false });
        } 
    }, [isOpen, userProfile]);

    const handleFileChange = async (e) => { if (e.target.files && e.target.files[0]) { const resized = await resizeImage(e.target.files[0]); setAvatarUrl(resized); setUseGoogleAvatar(false); } };
    
    const handleSave = () => { 
        // 🟢 เพิ่มการตรวจสอบ (Validation)
        if (facebook && !facebook.toLowerCase().includes('facebook.com')) {
            alert("⚠️ กรุณาระบุลิงก์ Facebook ให้ถูกต้อง\nตัวอย่าง: https://www.facebook.com/your.profile");
            return;
        }

        onSave({ 
            displayName: nickname, 
            avatarUrl: useGoogleAvatar ? userProfile.picture : avatarUrl,
            facebook,
            lineId,
            phone
        }); 
    };

    const toggleEdit = (field) => {
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (!isOpen) return null;
  
    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[700] p-4">
            <div className="bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-emerald-500/50 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
                
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-emerald-600 dark:from-amber-300 dark:to-emerald-400 mb-2">แก้ไขโปรไฟล์</h2>
                    <p className="text-slate-600 dark:text-gray-400">อัปเดตข้อมูลของคุณให้เป็นปัจจุบัน</p>
                </div>

                <div className="space-y-4">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg relative group">
                            <img src={useGoogleAvatar ? userProfile.picture : avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" onError={(e) => (e.target.src = "https://placehold.co/100x100/1e293b/ffffff?text=User")} />
                            {!useGoogleAvatar && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current.click()}><div className="text-white text-xs">เปลี่ยนรูป</div></div>)}
                        </div>
                        <div className="flex gap-2 text-sm">
                            <button onClick={() => setUseGoogleAvatar(true)} className={`px-3 py-1 rounded-full border ${useGoogleAvatar ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-400 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800"}`}>รูป Google</button>
                            <button onClick={() => fileInputRef.current.click()} className={`px-3 py-1 rounded-full border ${!useGoogleAvatar ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-400 dark:border-slate-600 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800"}`}><div className="flex items-center gap-1"><ImageIcon /> อัปโหลดรูป</div></button>
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-slate-600 dark:text-gray-400 mb-1 block">นามแฝง (Display Name)</label>
                            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-emerald-500 outline-none" placeholder="ชื่อเท่ๆ ของคุณ" />
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-bold text-slate-500 mb-2">ช่องทางติดต่อ (กดแก้ไขเพื่อพิมพ์)</p>
                            
                            <div className="space-y-3">
                                {/* Facebook */}
                                <div className={`flex items-center gap-2 bg-white dark:bg-slate-800 border ${editMode.facebook ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg px-3 py-2 transition-all`}>
                                    <FacebookIcon />
                                    <input 
                                        type="text" 
                                        value={facebook} 
                                        onChange={(e) => setFacebook(e.target.value)} 
                                        className={`flex-grow bg-transparent text-sm outline-none text-slate-900 dark:text-white ${!editMode.facebook && 'opacity-60 cursor-not-allowed'}`} 
                                        placeholder="ลิงก์ Facebook (https://...)" 
                                        disabled={!editMode.facebook}
                                    />
                                    <button onClick={() => toggleEdit('facebook')} className="text-slate-400 hover:text-blue-500 text-xs font-bold whitespace-nowrap px-1">
                                        {editMode.facebook ? <span className="text-emerald-500 flex items-center gap-1"><CheckIcon /> เสร็จ</span> : "แก้ไข"}
                                    </button>
                                </div>

                                {/* Line */}
                                <div className={`flex items-center gap-2 bg-white dark:bg-slate-800 border ${editMode.lineId ? 'border-green-500 ring-1 ring-green-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg px-3 py-2 transition-all`}>
                                    <div className="text-green-500"><LineIcon /></div>
                                    <input 
                                        type="text" 
                                        value={lineId} 
                                        onChange={(e) => setLineId(e.target.value)} 
                                        className={`flex-grow bg-transparent text-sm outline-none text-slate-900 dark:text-white ${!editMode.lineId && 'opacity-60 cursor-not-allowed'}`} 
                                        placeholder="LINE ID" 
                                        disabled={!editMode.lineId}
                                    />
                                    <button onClick={() => toggleEdit('lineId')} className="text-slate-400 hover:text-green-500 text-xs font-bold whitespace-nowrap px-1">
                                        {editMode.lineId ? <span className="text-emerald-500 flex items-center gap-1"><CheckIcon /> เสร็จ</span> : "แก้ไข"}
                                    </button>
                                </div>

                                {/* Phone */}
                                <div className={`flex items-center gap-2 bg-white dark:bg-slate-800 border ${editMode.phone ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-300 dark:border-slate-600'} rounded-lg px-3 py-2 transition-all`}>
                                    <div className="text-amber-500"><PhoneIcon /></div>
                                    <input 
                                        type="tel" 
                                        value={phone} 
                                        onChange={(e) => setPhone(e.target.value)} 
                                        className={`flex-grow bg-transparent text-sm outline-none text-slate-900 dark:text-white ${!editMode.phone && 'opacity-60 cursor-not-allowed'}`} 
                                        placeholder="เบอร์โทรศัพท์" 
                                        disabled={!editMode.phone}
                                    />
                                    <button onClick={() => toggleEdit('phone')} className="text-slate-400 hover:text-amber-500 text-xs font-bold whitespace-nowrap px-1">
                                        {editMode.phone ? <span className="text-emerald-500 flex items-center gap-1"><CheckIcon /> เสร็จ</span> : "แก้ไข"}
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex gap-3 mt-2">
                    <button onClick={onClose} className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg">ยกเลิก</button>
                    <button onClick={handleSave} className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 border-none text-white hover:shadow-lg hover:scale-105 rounded-lg font-bold">บันทึกข้อมูลถาวร</button>
                </div>
            </div>
        </div>, document.body
    );
};

export default ProfileSetupModal;