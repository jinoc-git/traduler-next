import { createClientFromClient } from '@/utils/supabase/client';

import { getTargetUserNotificationToken, reqSendPush } from './notification';

import type { NotificationMessage } from './notification';
import type { AlarmCallbackFunc } from '@/types/aboutAlarm.type';
import type { InsertInviteAlarmType } from '@/types/supabase';

export const addInviteAlarmList = async (datas: InsertInviteAlarmType[]) => {
  const supabaseClientClient = createClientFromClient();

  const checkedData: InsertInviteAlarmType[] = [];

  for (let data of datas) {
    const hasAlarm = await getUserUnConfirmedAlarm(data);
    if (!hasAlarm) checkedData.push(data);

    const targetNotificationToken = await getTargetUserNotificationToken(data.invite_to);
    console.log(targetNotificationToken);
    if (targetNotificationToken) {
      const message: NotificationMessage = {
        title: '여행 초대 알림',
        body: `${data.from_nickname}님이 ${data.plan_title}에 초대했습니다.`,
        click_action: `${window?.location?.origin}/plan/${data.invite_planId}`,
        token: targetNotificationToken,
      };

      await reqSendPush(message);
    }
  }

  if (checkedData.length > 0) {
    const { error } = await supabaseClientClient.from('invite_alarm').insert(checkedData);

    if (error) throw new Error('알림 리스트 추가 오류');
  }
};

export const getUserUnConfirmedAlarm = async (data: InsertInviteAlarmType) => {
  const supabaseClientClient = createClientFromClient();

  const { data: alarms, error } = await supabaseClientClient
    .from('invite_alarm')
    .select()
    .eq('invite_to', data.invite_to)
    .eq('invite_from', data.invite_from)
    .eq('invite_planId', data.invite_planId)
    .eq('isChecked', false);

  if (error) throw new Error('확인하지 않은 알람 갖고오기 오류');

  const hasAlarm = alarms.length > 0 ? true : false;

  return hasAlarm;
};

export const getUserUnConfirmedAlarmList = async (userId: string | undefined) => {
  if (!userId) return null;
  const supabaseClientClient = createClientFromClient();

  const { data, error } = await supabaseClientClient
    .from('invite_alarm')
    .select()
    .eq('invite_to', userId)
    .eq('isChecked', false)
    .order('created_at', { ascending: true });

  if (error) throw new Error('여행 초대 알림 데이터 불러오기 오류');

  return data;
};

export const confirmAlarm = async (alarmId: string) => {
  const supabaseClientClient = createClientFromClient();

  const { error } = await supabaseClientClient
    .from('invite_alarm')
    .update({ isChecked: true })
    .eq('id', alarmId)
    .select();

  if (error) throw new Error('알림 확인 오류');
};

export const userAlarmListener = (userId: string, callback: AlarmCallbackFunc) => {
  const supabaseClientClient = createClientFromClient();

  supabaseClientClient
    .channel('invite_alarm')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'invite_alarm',
        filter: `invite_to=in.(${[userId]})`,
      },
      callback,
    )
    .subscribe();
};
