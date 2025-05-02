import { defaultCache } from '@serwist/next/worker';
import { Serwist } from 'serwist';

import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    firebase: any;
  }
}

declare const self: ServiceWorkerGlobalScope;

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGE_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

try {
  // @ts-ignore: Firebase types not fully compatible with ServiceWorker
  const firebaseApp = self.firebase.initializeApp(firebaseConfig);
  const messaging = self.firebase.messaging();
  console.log('Firebase initialized in Service Worker');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  disableDevLogs: true,
});

serwist.addEventListeners();

self.addEventListener('push', (event) => {
  console.log('Push event received:', event.data?.text());
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const { notification, data } = payload;

    const title = notification?.title || data?.title;
    const body = notification?.body || data?.body;
    const icon = '/images/android/android-launchericon-144-144.png';
    const clickAction = data?.click_action || '/';

    if (notification) {
      event.waitUntil(
        self.registration.showNotification(title, {
          body,
          icon,
          data: { click_action: clickAction },
        }),
      );
    }
  } catch (error) {
    console.error('Push event error:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.click_action || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      // const url = event.notification.data.url;
      for (const client of clientsArr) {
        if (client.url.includes(urlToOpen)) {
          return client.focus();
        }
      }
      return self.clients.openWindow(urlToOpen);
    }),
  );
});
