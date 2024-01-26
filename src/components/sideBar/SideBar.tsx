'use client';

import React from 'react';

import { useQuery } from '@tanstack/react-query';

import { getPlansWithBookmarks } from '@/api/plan';
import { authStore } from '@/store/authStore';
import { sideBarStore } from '@/store/sideBarStore';

import SideBarIcon from './SideBarIcon';
import SideBarLogo from './SideBarLogo';
import SideBarStatus from './SideBarStatus';
import SideBarTrips from './SideBarTrips';

import type { PlanType } from '@/types/supabase';

export default function SideBar() {
  const { isVisibleSideBar, isSideBarOpen } = sideBarStore();
  const user = authStore((state) => state.user);

  const { data: bookMarkPlanData } = useQuery<PlanType[] | []>({
    queryKey: ['book_mark', 'plans', user?.id],
    queryFn: async () =>
      await getPlansWithBookmarks(user === null ? '' : user.id),
    enabled: user !== null,
    refetchOnWindowFocus: false,
  });

  return isVisibleSideBar ? (
    <>
      <SideBarIcon />
      <aside
        className={` touch-none fixed h-[100vh] border-r border-slate-300 rounded-r-[12px] z-[31] overflow-hidden bg-white side-bar-transition  ${
          isSideBarOpen
            ? 'sm:w-[357px] sm:px-[24px] md:w-[270px] md:px-[24px] '
            : 'sm:w-[0px] sm:px-[0px] md:w-[88px] md:px-[24px]'
        }`}
      >
        <SideBarLogo />
        <div className="flex flex-col md:gap-[20px] sm:gap-[10px]">
          <SideBarStatus isOpen={isSideBarOpen} />
          <SideBarTrips isOpen={isSideBarOpen} />
        </div>
        <div></div>
      </aside>
    </>
  ) : null;
}
