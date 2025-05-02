import axios, { AxiosError } from 'axios';

import { getNotificationToken } from '@/firebase/firebase';
import { is30DaysPast } from '@/utils/aboutDay';
import { createClientFromClient } from '@/utils/supabase/client';

import type { UpdateUserTokenData, UserTokenData } from '@/types/supabase';
import type { Message } from 'firebase-admin/messaging';

const supabaseClientClient = createClientFromClient();

export const savaNotificationToken = async (userId: string, tokenData: UpdateUserTokenData) => {
  const { error } = await supabaseClientClient
    .from('users')
    .update({ push_notification: tokenData })
    .eq('id', userId);

  if (error) throw new Error('푸시 알림 토큰 저장 오류');
};

export const getTargetUserNotificationToken = async (userId: string) => {
  const { data, error } = await supabaseClientClient
    .from('users')
    .select('push_notification')
    .eq('id', userId)
    .single();

  if (error) throw new Error('유저 토큰 불러오기 오류');

  if (data.push_notification) {
    const result = await checkTokenTime(userId, data.push_notification);
    if (result !== null) return result;
  }

  return data.push_notification;
};

export const reqSendPush = async (args: Message) => {
  try {
    await axios.post(window?.location?.origin + '/api/push', args);
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorUserId = error.response?.data.invited_user_id as string | undefined;
      await deleteTargetUserToken(errorUserId);
    }
  }
};

export const checkTokenTime = async (userId: string, tokenData: UserTokenData) => {
  if (!tokenData) return null;

  const { update_at } = tokenData;

  const needNew = is30DaysPast(update_at);
  if (needNew) {
    const newTokenData = await getNotificationToken(userId);
    return newTokenData;
  }

  return null;
};

const deleteTargetUserToken = async (targetId: string | undefined) => {
  if (!targetId) return;

  const { error } = await supabaseClientClient
    .from('users')
    .update({ push_notification: null })
    .eq('id', targetId);

  if (error) throw new Error('오류 푸시 알림 토큰 삭제 오류');
};
