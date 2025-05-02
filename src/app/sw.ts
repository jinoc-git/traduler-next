import { defaultCache } from '@serwist/next/worker';
import { Serwist } from 'serwist';

import type { Message } from 'firebase-admin/messaging';
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

const firebaseApp = self.firebase.initializeApp(firebaseConfig);
const messaging = self.firebase.messaging();

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  disableDevLogs: true,
});

serwist.addEventListeners();

messaging.onBackgroundMessage((payload: Message) => {
  console.log('백그라운드 메시지 수신:', payload);
  const { notification, data } = payload;

  const title = notification?.title || '여행 초대 알림';
  const body = notification?.body || data?.body;
  const icon = '/images/android/android-launchericon-144-144.png';
  const badge = '/images/android/android-launchericon-72-72.png';
  const clickAction = data?.click_action || '/';

  const notificationOptions = {
    body,
    icon,
    badge,
    data: { click_action: clickAction },
  };

  return self.registration.showNotification(title, notificationOptions);
});

// self.addEventListener('push', (event) => {
//   console.log('Push event received:', event.data?.text());
//   if (!event.data) return;

//   try {
//     const payload = event.data.json();
//     const { notification, data } = payload;

//     const title = notification?.title || data?.title;
//     const body = notification?.body || data?.body;
//     const image = '/images/android/android-launchericon-144-144.png';
//     const icon = '/images/android/android-launchericon-72-72.png';
//     const clickAction = data?.click_action || '/';

//     const options = {
//       body,
//       image,
//       icon,
//       data: {
//         click_action: clickAction,
//       },
//     };

//     if (notification) {
//       event.waitUntil(self.registration.showNotification(title, options));
//     }
//   } catch (error) {
//     console.error('Push event error:', error);
//   }
// });

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
