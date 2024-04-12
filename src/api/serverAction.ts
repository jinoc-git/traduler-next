import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import type { Database } from '@/types/supabase';

const supabaseServerClient = createServerComponentClient<Database>({ cookies });

export const getSessionFromServer = async () => {
  const {
    data: { session },
  } = await supabaseServerClient.auth.getSession();

  return session;
};

export const getPlanByIdFromServer = async (planId: string) => {
  const { data: plan, error } = await supabaseServerClient
    .from('plans')
    .select()
    .eq('id', planId)
    .single();

  return plan;
};

export const getAllPinsByPlanIdFromServer = async (planId: string) => {
  const { data, error } = await supabaseServerClient
    .from('pins')
    .select()
    .eq('plan_id', planId)
    .order('date', { ascending: true });

  return data;
};
