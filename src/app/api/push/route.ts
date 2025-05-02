import admin from 'firebase-admin';
import { type NextRequest, NextResponse } from 'next/server';

import type { ServiceAccount } from 'firebase-admin';
import type { Message } from 'firebase-admin/messaging';

export const POST = async (req: NextRequest) => {
  try {
    const message: Message = await req.json();

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
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
};
