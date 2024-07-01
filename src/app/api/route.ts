import { sendFCMNotification } from '@/api/sendFCM';

import type { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { message } = await req.json();

  try {
    await sendFCMNotification(message);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
