"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRegisterFcmTokenMutation } from "@/redux/features/auth/authSlice";
import { getOrCreateDeviceId, requestFcmToken } from "@/lib/firebase";

// Key under which we cache the last token that was successfully registered with
// the backend. Used to skip redundant /auth/fcm-token calls.
const SYNCED_KEY = "fcmTokenSynced";

/**
 * Registers this browser's FCM token with the backend whenever the user is
 * logged in.
 *
 * Mounted once at the app root (so it never unmounts on navigation). It reacts
 * to auth state via useAuth(), which listens to the `authChanged` event the
 * login/logout flows dispatch. Because it runs on every load — not only right
 * after login — a token that rotated while the user was away (e.g. they closed
 * the tab without logging out) gets re-registered on their next visit.
 *
 * The last successfully-registered token is cached in localStorage, so we only
 * POST when the token is new or has changed. The logout flow clears that cache,
 * which forces a fresh registration on the next login.
 */
export default function FcmTokenSync() {
  const { isLoggedIn, isHydrated } = useAuth();
  const [registerFcmToken] = useRegisterFcmTokenMutation();
  const syncingRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) {
      // console.log("[FcmTokenSync] waiting for hydration");
      return;
    }
    if (!isLoggedIn) {
      // console.log("[FcmTokenSync] user is not logged in — nothing to do");
      return;
    }
    if (syncingRef.current) {
      // console.log("[FcmTokenSync] sync already in progress");
      return;
    }

    let cancelled = false;
    syncingRef.current = true;
    // console.log("[FcmTokenSync] starting sync flow");

    (async () => {
      try {
        // Requests notification permission if needed and returns the current
        // (possibly refreshed) token, or null if unsupported/denied.
        const fcmToken = await requestFcmToken();
        if (cancelled) {
          // console.log("[FcmTokenSync] cancelled before token usage");
          return;
        }
        if (!fcmToken) {
          console.warn(
            "[FcmTokenSync] requestFcmToken() returned null — check earlier [FCM] warnings above for the cause (insecure context / permission denied / missing VAPID / service worker error).",
          );
          return;
        }

        // console.log("[FcmTokenSync] got FCM token:", fcmToken);

        const cachedSynced = localStorage.getItem(SYNCED_KEY);
        if (cachedSynced === fcmToken) {
          // console.log(
            // "[FcmTokenSync] dedup hit — token unchanged since last register. Skip POST. " +
              // "To force re-register, run: localStorage.removeItem('fcmTokenSynced')",
          // );
          // Ensure fcmToken is still mirrored even if we skip the POST.
          if (localStorage.getItem("fcmToken") !== fcmToken) {
            localStorage.setItem("fcmToken", fcmToken);
          }
          return;
        }

        const deviceId = getOrCreateDeviceId();
        // console.log("[FcmTokenSync] registering with backend", {
          // fcmToken,
          // deviceId,
        // });

        const res = await registerFcmToken({ fcmToken, deviceId }).unwrap();
        // console.log("[FcmTokenSync] backend register success:", res);

        localStorage.setItem("fcmToken", fcmToken);
        localStorage.setItem(SYNCED_KEY, fcmToken);
        // console.log(
          // "[FcmTokenSync] saved fcmToken + fcmTokenSynced to localStorage",
        // );
      } catch (err) {
        // Non-fatal: push notifications just won't reach this device.
        console.error("[FcmTokenSync] registration failed:", err);
      } finally {
        syncingRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, isLoggedIn, registerFcmToken]);

  return null;
}
