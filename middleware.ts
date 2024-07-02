import { updateSession } from '@/utils/supabase/middleware';

import type { NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  return await updateSession(request);
};
