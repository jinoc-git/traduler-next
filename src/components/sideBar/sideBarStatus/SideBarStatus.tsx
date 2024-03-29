'use client';

import React from 'react';

import { useQuery } from '@tanstack/react-query';

import { getPlanListAndMateList } from '@/api/plan';
import { authStore } from '@/store/authStore';
import { sideBarCallback } from '@/utils/arrayCallbackFunctionList';

import SideBarPlanInfo from './SideBarPlanInfo';
import SideBarStatusChip from './SideBarStatusChip';

interface SideBarStatusProps {
  isOpen: boolean;
}

export default function SideBarStatus(props: SideBarStatusProps) {
  const { isOpen } = props;
  const user = authStore((state) => state.user);

  const { data: matesData, isError: matesError } = useQuery({
    queryKey: ['plan_mates', user?.id],
    queryFn: async () => {
      return await getPlanListAndMateList(user === null ? '' : user.id);
    },
    enabled: user !== null,
    staleTime: 20 * 1000,
  });

  const sortedData = matesData?.planDataList?.sort(sideBarCallback.sorting);

  const startPlans = sortedData?.filter(sideBarCallback.filtering('planning'));
  const endPlans = sortedData?.filter(sideBarCallback.filtering('end'));
  const activePlan = sortedData?.find(sideBarCallback.filtering('traveling'));

  const nextPlan = startPlans != null ? startPlans[0] : undefined;
  const hasNextPlan = Boolean(nextPlan);

  const hasActivePlan = activePlan !== undefined;

  const status = hasActivePlan
    ? '여행 중'
    : hasNextPlan
      ? '여행 예정'
      : '여행 없음';

  return (
    <div
      className="flex flex-col items-center border-slate-200
      sm:h-[234] sm:border-t-2 sm:py-[30px]
      md:h-[202px] md:border-y-2 md:py-[12px] "
    >
      <div
        className={`flex items-center justify-between mb-[15px] side-bar-transition ${
          isOpen ? 'sm:w-[309px] md:w-[221px] ' : ' md:w-[40px] md:flex-col '
        }`}
      >
        <span className="font-semibold text-xs text-gray_dark_1">STATUS</span>
        <SideBarStatusChip isOpen={isOpen} status={status} />
      </div>
      <SideBarPlanInfo
        activePlan={activePlan}
        nextPlan={nextPlan}
        isOpen={isOpen}
        status={status}
      />
    </div>
  );
}
