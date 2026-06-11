# Push Notifications (Firebase Cloud Messaging)

How web push notifications work in this project: generating the FCM token,
registering it with the backend, keeping it in sync, and cleaning up on logout.

---

## 1. The pieces

| File | Role |
| --- | --- |
| [`src/lib/firebase.ts`](../src/lib/firebase.ts) | Firebase init + `requestFcmToken()` and `getOrCreateDeviceId()` helpers. |
| [`public/firebase-messaging-sw.js`](../public/firebase-messaging-sw.js) | Service worker that receives **background** push messages and shows the notification. |
| [`src/components/providers/FcmTokenSync.tsx`](../src/components/providers/FcmTokenSync.tsx) | Mounted once at the app root. Generates the token and registers it whenever the user is logged in. |
| [`src/redux/features/auth/authSlice.ts`](../src/redux/features/auth/authSlice.ts) | `registerFcmToken` mutation → `POST /auth/fcm-token`. Also `logoutUser` → `POST /auth/logout`. |
| [`src/hooks/useAuth.ts`](../src/hooks/useAuth.ts) | Reads login state from `localStorage` and reacts to the `authChanged` event. |
| [`src/components/auth/Loging.tsx`](../src/components/auth/Loging.tsx) | Login. Sends `deviceId`, then dispatches `authChanged`. Does **not** generate the FCM token itself. |

### Environment variables (`.env.local`)

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...   # Web Push certificate key pair (required for getToken)
```

> The service worker **cannot read `process.env`**, so the same public config is
> hardcoded in `public/firebase-messaging-sw.js`. If you change Firebase
> projects, update **both** `.env.local` and that file.

---

## 2. How it works (the flow)

```
  Login (Loging.tsx)
      │  setItem("token"), setItem("user")
      │  dispatch "authChanged"
      ▼
  useAuth()  ── isLoggedIn = true ──►  FcmTokenSync (mounted at app root)
                                            │
                                            │ 1. requestFcmToken()
                                            │      • check Notification permission
                                            │      • register /firebase-messaging-sw.js
                                            │      • getToken({ vapidKey })  ─────► Firebase
                                            │                                       returns FCM token
                                            │ 2. token === localStorage["fcmTokenSynced"]?
                                            │      • YES → stop (no network call)
                                            │      • NO  → continue
                                            │ 3. POST /auth/fcm-token
                                            │         { fcmToken, deviceId }   ──► Backend
                                            │ 4. on success:
                                            │      setItem("fcmToken", token)
                                            │      setItem("fcmTokenSynced", token)
                                            ▼
                                   Backend stores (deviceId → fcmToken)
                                   and can now push to this browser.
```

### Why the token lives in `FcmTokenSync`, not in the login handler

`FcmTokenSync` is mounted at the app root, so it runs on **every page load** while
the user is logged in — not only at the moment of login. This matters because:

- **Token rotation:** FCM tokens can change at any time. If the user closed the
  tab without logging out and comes back days later with a rotated token, a
  login-only approach would never re-register it. The root-mounted component
  re-checks on load and re-registers when the token differs.
- **Permission granted later:** if the user grants notification permission after
  login, the next load picks up the now-available token.

### Deduplication (no repeated registrations)

The last token we successfully registered is cached in
`localStorage["fcmTokenSynced"]`. On each run:

- current token **equals** the cached one → **do nothing** (no `POST`).
- current token is **new/changed** → `POST /auth/fcm-token`, then update the cache.

A `syncingRef` guard also prevents two overlapping runs from firing duplicate
requests.

### Logout

`handleLogout` (in [`Profile.tsx`](../src/components/CustomerDashboard/settings/Profile.tsx)
and [`VendorProfile.tsx`](../src/components/vendors/VendorProfile.tsx)):

1. `POST /auth/logout { deviceId }` **first** — while the `token` is still in
   `localStorage`, so the `Authorization` header is sent.
2. Removes `user`, `token`, `deviceId`, `fcmToken`, **and `fcmTokenSynced`**.

Clearing `fcmTokenSynced` is important: it forces a fresh registration on the
next login (otherwise dedup would skip it, since the browser's FCM token itself
doesn't change on logout).

---

## 3. Backend contract

| Method | URL | Body | When |
| --- | --- | --- | --- |
| `POST` | `/auth/fcm-token` | `{ fcmToken, deviceId }` | After login / when the token changes. |
| `POST` | `/auth/logout` | `{ deviceId }` | On logout (Bearer token required). |

`deviceId` is a persistent UUID created by `getOrCreateDeviceId()` and stored in
`localStorage["deviceId"]`. It lets the backend map one user to multiple devices.

---

## 4. Troubleshooting — "FCM token is not generated"

`requestFcmToken()` returns `null` (no token) for several reasons. After the
diagnostic logging was added, the browser console prints the exact cause with a
`[FCM]` prefix. Check these in order:

1. **Insecure context (most common in dev).**
   FCM, service workers, and the Notifications API only work on **`https://`** or
   **`http://localhost`** / `http://127.0.0.1`. Opening the dev server via a LAN
   IP over plain http — e.g. `http://10.10.11.118:3001` (or from a phone on the
   same network) — silently disables all of it.
   - Console shows: `[FCM] Messaging not supported in this context. isSecureContext = false`.
   - **Fix:** open `http://localhost:3001` on the dev machine, or serve over
     HTTPS (e.g. a tunnel like `ngrok`/`cloudflared`, or a self-signed cert) for
     testing on other devices.

2. **Notification permission not granted.**
   If permission is `denied` (or was dismissed earlier), no token is issued.
   - Console shows: `[FCM] Notification permission is 'denied'`.
   - **Fix:** click the lock/site icon in the address bar → reset Notifications →
     reload and allow.

3. **Missing VAPID key.**
   - Console shows: `[FCM] Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
   - **Fix:** set `NEXT_PUBLIC_FIREBASE_VAPID_KEY` in `.env.local` (Firebase
     Console → Project settings → Cloud Messaging → Web Push certificates) and
     restart `npm run dev`.

4. **Service worker failed to register or threw.**
   - Console shows: `[FCM] Service worker registration failed: ...` or a
     `getToken()` error.
   - **Fix:** confirm `public/firebase-messaging-sw.js` exists and its Firebase
     config matches `.env.local`. Verify the worker is active in
     DevTools → Application → Service Workers. Hard-reload after edits (workers
     cache aggressively).

   - **`AbortError: ... Subscription failed - no active Service Worker`** —
     `getToken()` ran before the freshly-registered worker became *active*
     (`register()` resolves during install, not activation). Handled in code by
     `waitForActiveWorker()`, which waits for the worker to reach `activated`
     before calling `getToken()`. If you still hit it, the worker isn't
     activating at all — open DevTools → Application → Service Workers and check
     for a script error in `firebase-messaging-sw.js` (e.g. a bad `importScripts`
     URL or config), then hard-reload.

5. **Unsupported browser / private mode.**
   Some browsers (or incognito/private windows without IndexedDB) report
   `isSupported() === false`.
   - Console shows: `[FCM] Messaging not supported in this context`.
   - **Fix:** test in a normal Chrome/Edge/Firefox window.

### Quick manual test

1. Run `npm run dev` and open **`http://localhost:3001`** (not the LAN IP).
2. Log in.
3. Open DevTools → Console. You should see the token logged from `FcmTokenSync`.
4. DevTools → Network: confirm `POST /auth/fcm-token` returns `200`.
5. DevTools → Application → Service Workers: `firebase-messaging-sw.js` is
   "activated and running".

If the token logs but step 4 is missing, the token was already registered
(`fcmTokenSynced` matched) — clear it with
`localStorage.removeItem("fcmTokenSynced")` and reload to force a re-send.
