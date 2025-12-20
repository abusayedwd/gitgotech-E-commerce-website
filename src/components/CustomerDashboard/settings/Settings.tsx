"use client";
import { ArrowLeft, Lock, CreditCard, FileText, RotateCcw, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-[#120a2a] to-black flex items-center justify-center">
          
      <div className="w-full max-w-2xl">
        <div className=" py-2 flex items-center gap-4">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Settings</h1>
        </div>
        {/* Header */}
      
        {/* Settings Card */}
        <div className="space-y-4">
          <SettingButton 
           onClick={() => router.push("/profile/change-password")}  
          icon={<Lock />} label="Change Password" primary />

          {/* <SettingButton icon={<CreditCard />} label="Update Payment Methods" /> */}

          <SettingButton onClick={() => router.push("/terms-condition")} icon={<FileText />} label="Terms & Conditions" />

          <SettingButton onClick={() => router.push("/privacy-policy")} icon={<Shield />} label="Privacy Policy" />

          <SettingButton onClick={() => router.push("/return-policy")} icon={<RotateCcw />} label="Return Policy" />


          <SettingButton
            icon={<Trash2 />}
            label="Delete Account"
            danger
          />
        </div>
     
    </div>
    </div>
  );
}

function SettingButton({ icon, label, primary, danger, onClick }) {
  const base = "flex items-center justify-center gap-3 w-full py-3 rounded-xl text-sm font-medium transition";

  const styles = danger
    ? "bg-red-900/50 text-red-400 hover:bg-red-900/70"
    : primary
    ? "bg-[#6100FF] text-white hover:bg-purple-700"
    : "bg-white/10 border border-gray-700 text-gray-200 hover:bg-white/10";

  return (
    <button className={`${base} ${styles}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}
