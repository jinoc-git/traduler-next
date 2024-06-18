'use client';

import React from 'react';

import { uuid } from '@supabase/gotrue-js/dist/module/lib/helpers';

import { addinviteAlarm } from '@/api/alarm';
import { useAuthStoreState } from '@/store/authStore';

import AlarmImage from './alarmImage/AlarmImage';

import type { AlarmCallbackFuncArgs } from '@/types/aboutAlarm.type';

const mock: any[] = ['알림1', '알림2', '알림3', '알림4', '알림5', '알림6'];

const Alarm = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const user = useAuthStoreState();

  const hasNewAlarm = mock.length > 0; // 수정 필요

  const handleToggleDropDownMenu = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const a = async () => {
    await addinviteAlarm();
  };

  const handleAlarmCallback = (payload: AlarmCallbackFuncArgs) => {
    console.log(payload);
  };

  React.useEffect(() => {
    // if (user) userAlarmListener(user.id, handleAlarmCallback);
  }, []);

  return (
    <div className=" relative pr-6 h-6">
      <button type="button" onClick={handleToggleDropDownMenu} className=" ">
        <AlarmImage hasNew={hasNewAlarm} />
      </button>
      {isOpen && (
        <ul
          className={`alarm-drop-down absolute top-10 right-6 w-[200px] max-h-[140px] bg-white rounded-lg
          ${mock.length > 5 ? 'overflow-y-scroll scrollbar-custom overscroll-y-contain' : ''}
        `}
        >
          {mock.map((text) => (
            <li key={uuid()} className="w-full h-7 p-1 hover:bg-slate-200 cursor-pointer">
              {text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Alarm;
