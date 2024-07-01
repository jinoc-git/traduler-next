import axios from 'axios';

import { supabaseClientClient } from './auth';

export const savaNotificationToken = async (userId: string, token: string) => {
  const { error } = await supabaseClientClient
    .from('users')
    .update({ push_notification: token })
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

  if (data.push_notification) return data.push_notification;
  else return false;
};

export interface NotificationMessage {
  title: string;
  body: string;
  click_action: string;
  token: string;
}

export const reqSendPush = async (args: NotificationMessage) => {
  const { title, body, token, click_action } = args;
  const message = {
    data: {
      title,
      body,
      click_action,
    },
    token,
  };

  await axios.post(window?.location?.origin + '/api', message);
};
