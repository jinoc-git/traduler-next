import { NextResponse } from 'next/server';

import { sendFCMNotification } from '@/api/sendFCM';

import type { NextRequest } from 'next/server';

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { message } = await req.json();

  try {
    const result = await sendFCMNotification(message);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
