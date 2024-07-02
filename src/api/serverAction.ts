import { cache } from 'react';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import type { Database, EndingPlanType, PlanType } from '@/types/supabase';

export const getSessionFromServer = async () => {
  const cookieStore = cookies();
  const supabaseServerClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // setAll(cookiesToSet) {
        //   cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        // },
      },
    },
  );

  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  if (error) throw new Error('세션 불러오기 오류 발생');

  return session;
};

export const getPlanByIdFromServer = async (planId: string) => {
  const cookieStore = cookies();
  const supabaseServerClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    },
  );

  const { data, error } = await supabaseServerClient
    .from('plans')
    .select()
    .eq('id', planId)
    .single();

  if (error) throw new Error('여행 불러오기 오류 발생');

  return data;
};

export const getAllPinsByPlanFromServer = async (plan: PlanType | EndingPlanType) => {
  const cookieStore = cookies();
  const supabaseServerClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    },
  );

  const { data, error } = await supabaseServerClient
    .from('pins')
    .select()
    .eq('plan_id', plan.id)
    .in('date', plan.dates)
    .order('date', { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};

export const getEndingPlanFromServer = cache(async (planId: string) => {
  const cookieStore = cookies();
  const supabaseServerClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    },
  );

  const { data, error } = await supabaseServerClient
    .from('plans_ending')
    .select()
    .eq('id', planId)
    .single();

  if (error) throw new Error(error.message);

  return data;
});
