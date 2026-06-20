# Prompt: Implement Firebase Cloud Messaging (Web Push) for the Admin Panel

Copy everything below the divider into your admin project's Claude session.
This implements **web push notifications** end-to-end: token generation,
backend registration, automatic re-sync on rotation, and cleanup on logout.

---

## Task

Implement Firebase Cloud Messaging (FCM) web push notifications in this
Next.js (App Router) + TypeScript + Redux Toolkit Query admin panel. The
backend already exposes `POST /auth/fcm-token` and `POST /auth/logout`
endpoints — your job is the **frontend** wiring.

### Goal

- After admin logs in, generate the browser's FCM token and register it
  with the backend (`POST /auth/fcm-token`).
- Token must auto-sync on every page load (FCM tokens can rotate; if the
  admin came back days later, re-register the new one).
- Avoid redundant network calls (don't re-POST the same token).
- On logout, call `POST /auth/logout` first, then clear local storage so the
  next login re-registers fresh.
- Background notifications must show a system notification even when the
  tab is in the background or closed.

### Backend contract (already implemented — don't change)

| Method | URL | Body | When |
| --- | --- | --- | --- |
| `POST` | `/auth/fcm-token` | `{ fcmToken, deviceId }` | After login / on token change |
| `POST` | `/auth/logout` | `{ deviceId }` | On logout (Bearer token required) |

`deviceId` is a persistent UUID created client-side and stored in
`localStorage["deviceId"]`. It lets the backend map one admin user to
multiple devices.

---

## Architecture (mirror this exactly)

```
Login form
   │  setItem("token"), setItem("user", { isLoggedIn, role, ... })
   │  dispatch new Event("authChanged")
   ▼
useAuth()  ── isLoggedIn = true ──►  <FcmTokenSync />  (mounted at app root)
                                          │
                                          │ 1. requestFcmToken()
                                          │      a. check Notification permission
                                          │      b. register /firebase-messaging-sw.js
                                          │      c. wait for the worker to become ACTIVE
                                          │      d. getToken({ vapidKey })
                                          │ 2. token === localStorage["fcmTokenSynced"]?
                                          │      YES → stop (no network call)
                                          │      NO  → continue
                                          │ 3. POST /auth/fcm-token { fcmToken, deviceId }
                                          │ 4. on success:
                                          │      setItem("fcmToken", token)
                                          │      setItem("fcmTokenSynced", token)
                                          ▼
                                Backend stores (deviceId → fcmToken)
```

**Why a root-mounted `FcmTokenSync`** (not inline in the login handler):
- Tokens can rotate at any time. A login-only approach won't re-register a
  rotated token if the admin returns days later without logging in again.
- If permission was granted *after* login, the next page load picks it up.

**Dedup:** `localStorage["fcmTokenSynced"]` caches the last successfully
registered token. Next run compares; equal → skip the POST.

**Logout:** clear `fcmTokenSynced` along with everything else, so the next
login forces a fresh registration (the browser's FCM token itself doesn't
change on logout — only the cache flag does).

---

## Step-by-step implementation

### Step 1 — Install Firebase

```bash
npm install firebase
```

### Step 2 — Environment variables

Create `.env.local` at the repo root:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...
```

Ask the user for these values from **Firebase Console → Project settings**:
- **General → Your apps → Web app → SDK setup** → the `firebaseConfig` block
- **Cloud Messaging → Web Push certificates → Generate key pair** → VAPID key

If the user doesn't provide them yet, scaffold with placeholders and tell
the user where to find them — DO NOT invent values.

### Step 3 — `src/lib/firebase.ts`

Create this file exactly:

```ts
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
 * `register()` resolves while the worker may still be installing/waiting,
 * but getToken() → PushManager.subscribe needs an active worker (otherwise
 * "AbortError: Subscription failed - no active Service Worker").
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
    if (!m) return null;

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
```

### Step 4 — `public/firebase-messaging-sw.js`

Service workers **cannot read `process.env`**, so the same public web
config has to be hardcoded here. **Keep this file in sync with
`.env.local`** — if the user switches Firebase projects, both must change.

```js
/* Firebase Cloud Messaging service worker.
 * Keep this config in sync with .env.local — service workers cannot read
 * process.env. */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.firebasestorage.app",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
  measurementId: "REPLACE_ME",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title || payload.data?.title || "New notification";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: payload.notification?.icon || "/images/logo.png",
    data: payload.data || {},
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

Replace the `REPLACE_ME` values with the user-provided Firebase config
(same as `.env.local`).

### Step 5 — `src/hooks/useAuth.ts`

If the project already has an auth hook, reuse it as long as it exposes
`{ isLoggedIn, isHydrated }` and listens to the `authChanged` custom
event. Otherwise create:

```ts
"use client";

import { useEffect, useState } from "react";

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

  return state;
}
```

### Step 6 — RTK Query auth slice

Add two mutations to the existing auth slice (or create one). The path
might already exist — look for `auth/login` first and add into the same
`apiSlice.injectEndpoints` call:

```ts
logoutUser: builder.mutation({
  query: (data: { deviceId: string }) => ({
    url: `/auth/logout`,
    method: "POST",
    body: data,
  }),
}),

registerFcmToken: builder.mutation({
  query: (data: { fcmToken: string; deviceId: string }) => ({
    url: `/auth/fcm-token`,
    method: "POST",
    body: data,
  }),
}),
```

Export the generated hooks (`useLogoutUserMutation`,
`useRegisterFcmTokenMutation`).

Also verify the base RTK Query `prepareHeaders` attaches the Bearer token
from `localStorage["token"]`, guarded for SSR:

```ts
prepareHeaders: (headers) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
},
```

### Step 7 — `src/components/providers/FcmTokenSync.tsx`

Root-mounted component that handles the entire sync flow:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRegisterFcmTokenMutation } from "@/redux/features/auth/authSlice";
import { getOrCreateDeviceId, requestFcmToken } from "@/lib/firebase";

const SYNCED_KEY = "fcmTokenSynced";

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
        const fcmToken = await requestFcmToken();
        if (cancelled || !fcmToken) return;

        if (localStorage.getItem(SYNCED_KEY) === fcmToken) return;

        const deviceId = getOrCreateDeviceId();
        await registerFcmToken({ fcmToken, deviceId }).unwrap();

        localStorage.setItem("fcmToken", fcmToken);
        localStorage.setItem(SYNCED_KEY, fcmToken);
      } catch (err) {
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
```

### Step 8 — Mount `<FcmTokenSync />` at the app root

In `src/app/layout.tsx` (App Router), inside the Redux provider so the
RTK Query mutation works:

```tsx
import FcmTokenSync from "@/components/providers/FcmTokenSync";

// inside <Providers> or wherever the Redux store is provided:
<Providers>
  <FcmTokenSync />
  {children}
</Providers>
```

If using Pages Router, put it inside `_app.tsx`.

### Step 9 — Update the Login handler

The login handler should:
1. Generate a `deviceId` (so the backend can associate the device early).
2. Save `token` + `user` (with `isLoggedIn: true` and `role`) to localStorage.
3. Dispatch `new Event("authChanged")` so `useAuth` updates and
   `FcmTokenSync` fires.

```ts
import { getOrCreateDeviceId } from "@/lib/firebase";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // Ensure deviceId exists before login; backend may need it on /auth/login too.
    // FCM token itself is registered separately by <FcmTokenSync /> once
    // auth state flips to logged-in (so token rotations after login are
    // also covered).
    const deviceId = getOrCreateDeviceId();

    const res = await login({ email, password, deviceId }).unwrap();
    if (res?.success || res?.status === 200) {
      const token = res?.token || res?.data?.token;
      if (token) localStorage.setItem("token", token);

      const user = res?.data?.user || res?.user;
      const userToStore = {
        ...user,
        isLoggedIn: true,
        role: user?.role || "admin",
      };
      localStorage.setItem("user", JSON.stringify(userToStore));

      window.dispatchEvent(new Event("authChanged"));
      router.push("/dashboard");
    }
  } catch (err: any) {
    toast.error(err?.data?.message || "Login failed");
  }
};
```

**Important:** do **NOT** request the FCM token inside the login handler.
Keep that in `FcmTokenSync` so token rotations are also covered without a
fresh login.

### Step 10 — Update the Logout handler

Find every logout button (sidebar, profile menu, etc.) and update:

```ts
import { useLogoutUserMutation } from "@/redux/features/auth/authSlice";
import { getOrCreateDeviceId } from "@/lib/firebase";

const [logoutUser] = useLogoutUserMutation();

const handleLogout = async () => {
  // Call backend FIRST — while the Bearer token is still in localStorage.
  // Best-effort: log out locally even if the request fails.
  try {
    await logoutUser({ deviceId: getOrCreateDeviceId() }).unwrap();
  } catch (err) {
    console.error("Logout request failed:", err);
  }

  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("deviceId");
  localStorage.removeItem("fcmToken");
  localStorage.removeItem("fcmTokenSynced"); // critical — see note below

  window.dispatchEvent(new Event("authChanged"));
  router.push("/auth/login");
};
```

> **Why clear `fcmTokenSynced`:** the browser's FCM token doesn't change
> when an admin logs out and a different admin logs in on the same
> machine. Without clearing this flag, the dedup check would skip the
> next `POST /auth/fcm-token`, and the new admin's row would never get
> the device registered.

---

## Testing checklist

1. `npm run dev` and open **`http://localhost:3000`** (not a LAN IP — FCM
   requires `https://` or `localhost`).
2. Log in. A notification permission prompt should appear → click Allow.
3. DevTools → Console: look for the `[FCM]` warnings (none should appear
   on success). The token gets registered silently.
4. DevTools → Network: `POST /auth/fcm-token` returns `200`.
5. DevTools → Application → Service Workers:
   `firebase-messaging-sw.js` is "activated and running".
6. DevTools → Application → Local Storage: `deviceId`, `fcmToken`,
   `fcmTokenSynced` all present.
7. Reload the page — no second `POST /auth/fcm-token` (dedup hit).
8. Log out → log back in: confirm a fresh `POST /auth/fcm-token` fires.
9. Send a test push from Firebase Console → Cloud Messaging → New
   campaign → paste the token → confirm the system notification appears.

## Troubleshooting (paste into docs)

| Console message | Cause | Fix |
| --- | --- | --- |
| `[FCM] Messaging not supported in this context. isSecureContext = false` | Opened via LAN IP over plain http | Use `http://localhost:PORT` or HTTPS tunnel (ngrok, cloudflared) |
| `[FCM] Notification permission is 'denied'` | User blocked / dismissed permission | Click site icon in address bar → reset Notifications → reload |
| `[FCM] Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY` | env var not set | Add VAPID key to `.env.local`, restart dev server |
| `AbortError: Subscription failed - no active Service Worker` | Worker not activated yet | Already handled by `waitForActiveWorker()`; if it still fires, open DevTools → Application → Service Workers and look for a script error in `firebase-messaging-sw.js` (bad importScripts URL, bad config) |
| `getToken() resolved empty` | Firebase project mismatch between `.env.local` and `public/firebase-messaging-sw.js` | Confirm both have identical config |

---

## What NOT to do

- ❌ Don't put Firebase **admin SDK** service account JSON anywhere in the
  frontend. That's server-only. The frontend only needs the public web
  config + VAPID key.
- ❌ Don't generate the FCM token inside the login handler. Use
  `FcmTokenSync` so rotated tokens get re-registered on subsequent visits.
- ❌ Don't skip `waitForActiveWorker()` — `register()` resolves before
  the worker is active, and `getToken()` will fail with `AbortError`.
- ❌ Don't forget to clear `fcmTokenSynced` on logout, or the next admin
  on the same machine won't get registered.
- ❌ Don't read `localStorage` during SSR / in module scope — wrap with
  `typeof window !== "undefined"` checks (already handled above).

---

After implementation, write a short `docs/FCM_NOTIFICATIONS.md` summarizing
the flow and the troubleshooting table for future maintainers.
