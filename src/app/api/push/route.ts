import admin from 'firebase-admin';
import { FirebaseMessagingError, type Message } from 'firebase-admin/messaging';
import { type NextRequest, NextResponse } from 'next/server';

import type { ServiceAccount } from 'firebase-admin';

export const POST = async (req: NextRequest) => {
  const message: Message = await req.json();
  try {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
      privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
    };

    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }

    await admin.messaging().send(message);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof FirebaseMessagingError) {
      return NextResponse.json(
        { invited_user_id: message?.data?.invited_user_id },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: '여행 초대 알림 오류' }, { status: 500 });
  }
};
