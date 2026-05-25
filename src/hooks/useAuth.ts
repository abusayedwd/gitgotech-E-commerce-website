"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AuthState {
  isLoggedIn: boolean;
  role: string | null;
  isHydrated: boolean;
}

function readAuth(): AuthState {
  if (typeof window === "undefined") {
    return { isLoggedIn: false, role: null, isHydrated: false };
  }
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return { isLoggedIn: false, role: null, isHydrated: true };
    const parsed = JSON.parse(raw);
    return {
      isLoggedIn: !!parsed?.isLoggedIn,
      role: parsed?.role ?? null,
      isHydrated: true,
    };
  } catch {
    return { isLoggedIn: false, role: null, isHydrated: true };
  }
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
    isHydrated: false,
  });

  useEffect(() => {
    const update = () => setState(readAuth());
    update();
    window.addEventListener("storage", update);
    window.addEventListener("authChanged", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("authChanged", update);
    };
  }, []);

  const requireLogin = useCallback(
    (message?: string, redirectTo: string = "/auth/login") => {
      if (state.isLoggedIn) return true;
      toast.error(message || "Please sign in to continue");
      router.push(redirectTo);
      return false;
    },
    [state.isLoggedIn, router],
  );

  return { ...state, requireLogin };
}
