import { cache } from 'react';

import { createClientFromServer } from '@/utils/supabase/server';

import type { EndingPlanType, PlanType } from '@/types/supabase';

export const getSessionFromServer = async () => {
  const supabaseServerClient = createClientFromServer();

  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  if (error) throw new Error('세션 불러오기 오류 발생');

  return session;
};

export const getPlanByIdFromServer = async (planId: string) => {
  const supabaseServerClient = createClientFromServer();

  const { data, error } = await supabaseServerClient
    .from('plans')
    .select()
    .eq('id', planId)
    .single();

  if (error) throw new Error('여행 불러오기 오류 발생');

  return data;
};

export const getAllPinsByPlanFromServer = async (plan: PlanType | EndingPlanType) => {
  const supabaseServerClient = createClientFromServer();

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
  const supabaseServerClient = createClientFromServer();

  const { data, error } = await supabaseServerClient
    .from('plans_ending')
    .select()
    .eq('id', planId)
    .single();

  if (error) throw new Error(error.message);

  return data;
});
