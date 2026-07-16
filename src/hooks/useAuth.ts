"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AuthState {
  isLoggedIn: boolean;
  role: string | null;
  isHydrated: boolean;
}

const LOGOUT_FLAG_KEY = "__intentional_logout__";

/**
 * Call right before clearing the session on a deliberate logout. Suppresses
 * the "Please sign in to continue" toast + redirect that PrivateRoute would
 * otherwise fire when it notices `isLoggedIn` flip to false out from under it
 * (the logout flow already shows its own toast and navigates).
 */
export function markIntentionalLogout() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LOGOUT_FLAG_KEY, "1");
}

/** Reads and clears the intentional-logout flag. Consume once per check. */
export function consumeIntentionalLogoutFlag(): boolean {
  if (typeof window === "undefined") return false;
  const flagged = sessionStorage.getItem(LOGOUT_FLAG_KEY) === "1";
  if (flagged) sessionStorage.removeItem(LOGOUT_FLAG_KEY);
  return flagged;
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
