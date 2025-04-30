import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

import { savaNotificationToken } from '@/api/notification';

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_KEY;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGE_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const getNotificationToken = async (userId: string) => {
  const messaging = getMessaging(app);

  try {
    const registration = await navigator.serviceWorker.getRegistration('/');
    if (!registration) throw new Error('토큰 발급 오류');

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    const tokenData = { token, update_at: new Date() };
    await savaNotificationToken(userId, tokenData);

    return tokenData;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message !== '푸시 알림 토큰 저장 오류') throw new Error('토큰 발급 오류');
    }
    return null;
  }
};
