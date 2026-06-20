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
    if (!isHydrated || !isLoggedIn) return;
    if (syncingRef.current) return;

    let cancelled = false;
    syncingRef.current = true;

    (async () => {
      try {
        // Requests notification permission if needed and returns the current
        // (possibly refreshed) token, or null if unsupported/denied.
        const fcmToken = await requestFcmToken();
        if (cancelled || !fcmToken) return;
        // console.log(fcmToken,"token get>>>>>>>>>:")

        // Already registered this exact token → nothing to do.
        if (localStorage.getItem(SYNCED_KEY) === fcmToken) return;

        const deviceId = getOrCreateDeviceId();
        // console.log(deviceId,"deviceId get>>>>>>>>>:")
        await registerFcmToken({ fcmToken, deviceId }).unwrap();

        localStorage.setItem("fcmToken", fcmToken);
        localStorage.setItem(SYNCED_KEY, fcmToken);
      } catch (err) {
        // Non-fatal: push notifications just won't reach this device.
        console.error("FCM token registration failed:", err);
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
