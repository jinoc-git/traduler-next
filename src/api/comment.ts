import { createClientFromClient } from '@/utils/supabase/client';

import type { InsertCommentsType } from '@/types/supabase';
const supabaseClientClient = createClientFromClient();

export const addComment = async (newComment: InsertCommentsType) => {
  const { error } = await supabaseClientClient.from('comments').insert(newComment);

  if (error) throw new Error('댓글 작성 오류 발생');
};

export const getComments = async (planId: string) => {
  const { data, error } = await supabaseClientClient
    .from('comments')
    .select()
    .eq('plan_id', planId)
    .order('created_at');

  if (error) throw new Error('댓글 가져오기 오류 발생');

  return data;
};

export const deleteComment = async (commentId: string) => {
  const { error } = await supabaseClientClient.from('comments').delete().eq('id', commentId);

  if (error) throw new Error('댓글 삭제하기 오류 발생');
};
