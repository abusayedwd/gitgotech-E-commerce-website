"use client";

import { clearTokenExpiredState } from "@/lib/apiErrorToast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TokenExpiredModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Access denied. Token has expired.");

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      setMessage(
        customEvent.detail?.message || "Access denied. Token has expired.",
      );
      setOpen(true);
    };

    window.addEventListener("tokenExpired", handler);
    return () => window.removeEventListener("tokenExpired", handler);
  }, []);

  const handleLogin = () => {
    setOpen(false);
    clearTokenExpiredState();
    router.push("/auth/login");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
      <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">Session Expired</h3>
        <p className="text-gray-300 text-sm mb-6">{message}</p>
        <button
          type="button"
          onClick={handleLogin}
          className="w-full py-2.5 bg-[#6100FF] hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  );
}
