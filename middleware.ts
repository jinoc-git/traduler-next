import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { Database } from '@/types/supabase';
import type { NextRequest } from 'next/server';

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  await supabase.auth.getSession();

  return res;
};
