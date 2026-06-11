/* Firebase Cloud Messaging service worker.
 * The config below is intentionally hardcoded — it's the same public web
 * config exposed via NEXT_PUBLIC_* env vars; service workers can't read
 * process.env. Keep this in sync with .env.local. */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyClcn5vX-LShg8mj3m830QCHKegyYJDmr0",
  authDomain: "sleeknit-2e65c.firebaseapp.com",
  projectId: "sleeknit-2e65c",
  storageBucket: "sleeknit-2e65c.firebasestorage.app",
  messagingSenderId: "268144335869",
  appId: "1:268144335869:web:4172ac57699959940f9794",
  measurementId: "G-M73CKNEKWC",
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
