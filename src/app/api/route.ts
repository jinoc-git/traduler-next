import { type NextRequest, NextResponse } from 'next/server';

import { sendFCMNotification } from '@/api/sendFCM';

import type { NotificationData } from '@/api/sendFCM';

export const POST = async (req: NextRequest) => {
  try {
    const message: NotificationData = await req.json();

    await sendFCMNotification(message);

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
