'use client';

import React from 'react';

import Image from 'next/image';

import { useSideBarStoreState } from '@/store/sideBarStore';

interface Props {
  isModify: boolean;
  handleSaveOrModifyBtnClick: () => void;
}

export default function PlanTopBar(props: Props) {
  const { isModify, handleSaveOrModifyBtnClick } = props;

  const { isSideBarOpen } = useSideBarStoreState();

  return (
    <div
      className={`flex justify-between items-center w-full border-b-[1px] border-navy py-[11.5px] bg-white z-30
      sm:fixed sm:top-[80px] side-bar-transition
      md:static md:pt-[86px] ${
        isSideBarOpen ? 'md:pl-[270px]' : 'md:pl-[88px]'
      }`}
    >
      <div
        className="text-navy_dark font-semibold
      sm:text-sm sm:ml-[25px]
      md:text-normal md:ml-[80px]"
      >
        여행 계획 시작
      </div>
      <div
        className="flex items-center font-semibold ml-[25px]
      sm:text-sm
      md:text-normal"
      >
        <button
          name="nav-multifunctional-btn"
          className="text-navy_dark flex items-center gap-2
          sm:mr-[25px] 
          md:mr-[80px] "
          type="button"
          onClick={handleSaveOrModifyBtnClick}
        >
          <Image
            alt="edit-icon"
            src={'/images/svgs/edit-blue.svg'}
            width={16}
            height={16}
          />
          {isModify ? `저장하기` : `수정하기`}
        </button>
      </div>
    </div>
  );
}