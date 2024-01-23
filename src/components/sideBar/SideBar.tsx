'use client';

import React from 'react';

import { sideBarStore } from '@/store/sideBarStore';

import SideBarIcon from './SideBarIcon';
import SideBarLogo from './SideBarLogo';

export default function SideBar() {
  const { isVisibleSideBar, isSideBarOpen } = sideBarStore();

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
        <div></div>
      </aside>
    </>
  ) : null;
}
