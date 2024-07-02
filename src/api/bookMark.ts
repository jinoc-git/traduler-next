import { createClientFromClient } from '@/utils/supabase/client';

import type { InsertBookMarkType } from '@/types/supabase';

const supabaseClientClient = createClientFromClient();

export const getBookMarkDataByUserId = async (userId: string | undefined) => {
  if (userId === undefined) return null;

  const { data, error } = await supabaseClientClient
    .from('book_mark')
    .select('*')
    .eq('user_id', userId);

  if (error) throw new Error('getBookMark오류발생');

  return data;
};

export const addBookMark = async (newBookMark: InsertBookMarkType) => {
  const { plan_id: planId, user_id: userId } = newBookMark;

  const { error } = await supabaseClientClient.from('book_mark').insert({
    plan_id: planId,
    user_id: userId,
  });

  if (error) throw new Error('addBookMark오류발생');
};

export const deleteBookMark = async (bookMarkId: string) => {
  const { error } = await supabaseClientClient.from('book_mark').delete().eq('id', bookMarkId);

  if (error) throw new Error('오류발생');
};

export const deleteBookMarkByUserAndPlanId = async (userId: string, planId: string) => {
  const { error } = await supabaseClientClient
    .from('book_mark')
    .delete()
    .match({ plan_id: planId, user_id: userId });

  if (error) throw new Error('나간 여행 북마크 삭제 오류');
};
