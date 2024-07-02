import { createClientFromClient } from '@/utils/supabase/client';

import { getUserInfoWithId } from './auth';

import type { PlanMatesType, UserType } from '@/types/supabase';

const supabaseClientClient = createClientFromClient();

export const findUsers = async (input: string) => {
  const { data: nickname, error: nicknameError } = await supabaseClientClient
    .from('users')
    .select()
    .like('nickname', `%${input}%`);

  const { data: email, error: emailerror } = await supabaseClientClient
    .from('users')
    .select()
    .like('email', `%${input}%`);

  if (nicknameError || emailerror) throw new Error('유저 찾기 오류');

  return { nickname, email };
};

export const getMatesInfo = async (planId: string) => {
  if (!planId) return null;

  const { data, error } = await supabaseClientClient
    .from('plan_mates')
    .select('users_id')
    .eq('id', planId)
    .single();

  if (error) throw new Error('동행자 찾기 오류');

  const matesInfo: UserType[] = [];

  const matesIdArr = data.users_id;

  for (let i = 0; i < matesIdArr.length; i++) {
    const mateUserData = await getUserInfoWithId(matesIdArr[i]);

    matesInfo.push(mateUserData);
  }

  return matesInfo;
};

export const updateMates = async (newMates: string[], planId: string) => {
  const { error } = await supabaseClientClient
    .from('plan_mates')
    .update({ users_id: newMates })
    .eq('id', planId)
    .select();

  if (error) throw new Error('동행자 업데이트 오류');
};

export const addNewPlanMates = async (newPlanId: string, newMates: UserType[]) => {
  const newplanMates: PlanMatesType = {
    id: newPlanId,
    users_id: newMates.map((user) => user.id),
  };

  const { error } = await supabaseClientClient.from('plan_mates').insert(newplanMates);

  if (error) throw new Error('동행자 저장 오류');
};

export const getPlanMatesUserId = async (planId: string) => {
  const { data, error } = await supabaseClientClient
    .from('plan_mates')
    .select('users_id')
    .eq('id', planId)
    .single();

  if (error) throw new Error(error.message);

  return data.users_id;
};
