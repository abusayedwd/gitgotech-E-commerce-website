"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

/**
 * Client-side auth gate for private routes.
 *
 * - While the auth state is still hydrating from localStorage → shows a spinner.
 * - Once hydrated, if the user is not logged in → toasts once and redirects
 *   to `/auth/login`. Nothing sensitive from `children` is rendered.
 * - When logged in → renders children.
 *
 * Wrap this around either a whole route segment via `layout.tsx` or a single
 * page's default-exported component.
 */
export default function PrivateRoute({
  children,
  redirectTo = "/auth/login",
  message = "Please sign in to continue",
}: {
  children: React.ReactNode;
  redirectTo?: string;
  message?: string;
}) {
  const { isLoggedIn, isHydrated } = useAuth();
  const router = useRouter();
  const toastedRef = useRef(false);

  useEffect(() => {
    if (!isHydrated || isLoggedIn) return;
    if (!toastedRef.current) {
      toast.error(message);
      toastedRef.current = true;
    }
    router.replace(redirectTo);
  }, [isHydrated, isLoggedIn, router, redirectTo, message]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-300">
        <p className="text-sm">Redirecting to sign in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
