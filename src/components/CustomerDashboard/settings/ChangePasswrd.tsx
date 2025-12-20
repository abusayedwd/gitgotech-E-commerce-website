"use client";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChangePasswordPage() {
    const router = useRouter();
  const [show, setShow] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = () => {
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);
    console.log("Confirm Password:", confirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#120a2a] to-black flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className=" mt-4 flex items-center gap-4 mb-6">
             <button onClick={()=> router.back()} className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600/40 cursor-pointer flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
          <h1 className="text-2xl font-semibold text-gray-300 font-cormorant">Change Password</h1>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl p-8 bg-gradient-to-br from-[#1b1233] to-[#0e0a1f] shadow-xl border border-purple-500/40">
          <p className="text-center text-sm text-gray-300 mb-6">
            Password must be minimum 8 characters, include letters & numbers.
          </p>

          {error && (
            <p className="mb-4 text-sm text-red-400 text-center">{error}</p>
          )}

          {/* Inputs */}
          <div className="space-y-4">
            <PasswordInput label="Current Password" value={currentPassword} setValue={setCurrentPassword} show={show} setShow={setShow} />
            <PasswordInput label="New Password" value={newPassword} setValue={setNewPassword} show={show} setShow={setShow} />
            <PasswordInput label="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} show={show} setShow={setShow} />
          </div>

          {/* Button */}
          <button
            onClick={handleUpdate}
            className="mt-8 w-full py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordInput({ label, value, setValue, show, setShow }) {
  return (
    <div>
      <label className="block mb-2 text-sm text-gray-300">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="********"
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/40 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
