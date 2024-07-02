import { createClientFromClient } from '@/utils/supabase/client';

import { getUserInfoWithIdList } from './auth';
import { deleteBookMarkByUserAndPlanId } from './bookMark';
import { addPins, updatePins } from './pins';
import { addNewPlanMates, updateMates } from './planMate';

import type { AddPlanObj, PlanStatus, QuitPlanArgs, UpdatePlanObj } from '@/types/aboutPlan.type';
import type { PlanType } from '@/types/supabase';

const supabaseClientClient = createClientFromClient();

export const getPlanList = async (planIds: string[]) => {
  const { data, error } = await supabaseClientClient
    .from('plans')
    .select()
    .eq('isDeleted', false)
    .in('id', planIds);

  if (error) throw new Error(error.message);

  return data;
};

export const getPlansWithBookmarks = async (
  userId: string | undefined,
): Promise<PlanType[] | []> => {
  if (!userId) return [];

  const { data, error } = await supabaseClientClient
    .from('book_mark')
    .select('plan_id')
    .eq('user_id', userId);

  if (error) throw new Error('book_mark 데이터 불러오기 오류');

  if (data.length === 0) return [];

  const planIds = data.map((item) => item.plan_id);

  const bookMarkPlanData = await getPlanList(planIds);

  return bookMarkPlanData;
};

export const getPlanIdAndMateListByUserId = async (userId: string) => {
  const { data, error } = await supabaseClientClient
    .from('plan_mates')
    .select()
    .contains('users_id', [userId]);

  if (error) throw new Error(error.message);

  return data;
};

export const getPlanListAndMateList = async (userId: string | undefined) => {
  if (userId === undefined) return null;

  const planIdAndMateList = await getPlanIdAndMateListByUserId(userId);

  const planIdList = planIdAndMateList.map((data) => data.id).flat();
  const userIdList = planIdAndMateList.map((data) => data.users_id);

  if (userIdList.length === 0) {
    return {
      planDataList: [],
      planIdAndMatesInfoList: [],
    };
  }

  const planDataList = await getPlanList(planIdList);

  const planIdAndMatesInfoList = [];

  for (let i = 0; i < userIdList.length; i++) {
    const userInfoList = await getUserInfoWithIdList(userIdList[i]);

    const planIdAndMatesInfo = { [planIdList[i]]: userInfoList };

    planIdAndMatesInfoList.push(planIdAndMatesInfo);
  }

  return {
    planDataList,
    planIdAndMatesInfoList,
  };
};

export const addPlan = async (addPlanObj: AddPlanObj) => {
  const { plan, pins, invitedUser } = addPlanObj;

  const { data, error } = await supabaseClientClient.from('plans').insert(plan);

  if (error) throw new Error(error.message);

  await Promise.all([addPins(plan, pins), addNewPlanMates(plan.id, invitedUser)]);

  return { data };
};

export const updatePlan = async (updatePlanObj: UpdatePlanObj) => {
  const { plan, originPins, pins, invitedUser } = updatePlanObj;

  const { error } = await supabaseClientClient.from('plans').update(plan).eq('id', plan.id);

  if (error) throw new Error(error.message);

  await updatePins(originPins, plan, pins);

  const userIdList = invitedUser.map(({ id }) => id);

  await updateMates(userIdList, plan.id);
};

export const updatePlanStatus = async (planId: string, status: PlanStatus) => {
  const { error } = await supabaseClientClient
    .from('plans')
    .update({ plan_state: status })
    .eq('id', planId);

  if (error) throw new Error('여행 상태 변경 오류 발생');
};

export const getPlanDate = async (planId: string) => {
  const { data, error } = await supabaseClientClient
    .from('plans')
    .select('dates')
    .eq('id', planId)
    .single();

  if (error) throw new Error('엔딩 여행 불러오기 오류발생');

  return data;
};

export const deletePlan = async (planId: string) => {
  const { error } = await supabaseClientClient.from('plans').delete().eq('id', planId);

  if (error) throw new Error('여행 삭제 오류');
};

export const quitPlan = async ({ userId, planId }: QuitPlanArgs) => {
  const { data, error } = await supabaseClientClient
    .from('plan_mates')
    .select('users_id')
    .eq('id', planId)
    .single();

  if (error) throw new Error('여행 나가기 오류');

  const updatedMates = data.users_id.filter((id) => id !== userId);

  const needDelete = updatedMates.length === 0;
  if (needDelete) await deletePlan(planId);
  else {
    await Promise.all([
      updateMates(updatedMates, planId),
      deleteBookMarkByUserAndPlanId(userId, planId),
    ]);
  }
};
