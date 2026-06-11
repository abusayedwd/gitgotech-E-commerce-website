"use client";

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, isSupported, Messaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

async function getMessagingIfSupported(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (messaging) return messaging;
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn(
        "[FCM] Messaging not supported in this context. isSecureContext =",
        window.isSecureContext,
        "| origin =",
        window.location.origin,
        "— FCM/service workers require https:// or http://localhost. A plain " +
          "LAN IP over http (e.g. http://10.10.11.118:3001) will always fail.",
      );
      return null;
    }
    messaging = getMessaging(getFirebaseApp());
    return messaging;
  } catch (err) {
    console.warn("[FCM] isSupported()/getMessaging() threw:", err);
    return null;
  }
}

/**
 * Resolves once the given service worker registration has an *active* worker.
 * `register()` resolves while the worker may still be installing/waiting, and
 * FCM's PushManager.subscribe needs it active, so we wait for activation here.
 */
function waitForActiveWorker(
  registration: ServiceWorkerRegistration,
): Promise<void> {
  if (registration.active) return Promise.resolve();
  const worker = registration.installing || registration.waiting;
  if (!worker) return navigator.serviceWorker.ready.then(() => undefined);
  return new Promise<void>((resolve) => {
    const onStateChange = () => {
      if (worker.state === "activated") {
        worker.removeEventListener("statechange", onStateChange);
        resolve();
      }
    };
    worker.addEventListener("statechange", onStateChange);
  });
}

/**
 * Requests notification permission and returns the FCM registration token.
 * Returns null if not supported, permission denied, or token retrieval fails.
 */
export async function requestFcmToken(): Promise<string | null> {
  try {
    if (typeof window === "undefined") return null;
    if (!("Notification" in window)) {
      console.warn("[FCM] Notification API unavailable in this browser.");
      return null;
    }
    if (!VAPID_KEY) {
      console.warn("[FCM] Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY env var.");
      return null;
    }

    const m = await getMessagingIfSupported();
    if (!m) return null; // reason already logged by getMessagingIfSupported

    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") {
      console.warn(
        "[FCM] Notification permission is '" +
          permission +
          "'. The browser must grant permission to issue a token.",
      );
      return null;
    }

    let registration: ServiceWorkerRegistration | undefined;
    if ("serviceWorker" in navigator) {
      try {
        registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );
        // register() resolves before the worker becomes ACTIVE, but
        // getToken() → PushManager.subscribe requires an active worker
        // ("Subscription failed - no active Service Worker"). Wait for it.
        await waitForActiveWorker(registration);
      } catch (err) {
        console.warn("[FCM] Service worker registration failed:", err);
      }
    } else {
      console.warn(
        "[FCM] serviceWorker missing from navigator (insecure context?).",
      );
    }

    const token = await getToken(m, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("[FCM] getToken() resolved empty — no token issued.");
      return null;
    }
    return token;
  } catch (err) {
    console.error("[FCM] requestFcmToken failed:", err);
    return null;
  }
}

/**
 * Returns a persistent device UUID stored in localStorage.
 * Creates one on first call.
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "deviceId";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}
