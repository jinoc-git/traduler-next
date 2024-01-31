import React from 'react';

import { useRouter } from 'next/navigation';

import type { PlanType } from '@/types/supabase';

interface SideBarDropDownProps {
  isSideBarOpen: boolean;
  isDropDownOpen: boolean;
  filterName: '즐겨찾기 한 목록' | '예정된 여행' | '다녀온 여행';
  planList: PlanType[];
}

export default function SideBarDropDown(props: SideBarDropDownProps) {
  const { isSideBarOpen, isDropDownOpen, filterName, planList } = props;
  const router = useRouter();

  const onClickListItem = (state: string, id: string) => {
    if (state === 'planning') router.push(`/plan/${id}`);
    if (state === 'traveling') router.push(`/plan/${id}`);
    if (state === 'recording') router.push(`/addPhoto/${id}`);
    if (state === 'end') router.push(`/ending/${id}`);
  };

  return (
    <ul
      style={{ overflow: isDropDownOpen ? 'visible' : '' }}
      className={` flex flex-col md:w-[200px] sm:w-[285px] ${
        isDropDownOpen
          ? ' fixed flex-center ml-[68px] mt-[-40px] w-[190px] border border-gray_light_3 rounded-lg  bg-white'
          : 'items-end ml-[22px]'
      } `}
    >
      {isSideBarOpen &&
        planList.length > 0 &&
        planList.slice(0, 3).map((plan) => (
          <li
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={() => {
              onClickListItem(plan.plan_state, plan.id);
            }}
            style={{ overflow: isDropDownOpen ? 'visible' : '' }}
            className="flex  p-2 rounded-lg hover:bg-[#F6F6F6] text-gray hover:text-gray_dark_2 cursor-pointer 
              md:w-[175px] md:my-[5px]
              sm:w-[234px] sm:mt-[5px]
              "
            key={uuid()}
          >
            <p
              className={`text-[13px]   ${
                isDropDownOpen ? '' : 'md:max-w-[100px] truncate'
              }`}
            >
              {plan.title}
            </p>
            {!isDropDownOpen && (
              <span className="text-[13px] ml-[4px]">
                ({changeSideBarFormat(plan.dates[0])})
              </span>
            )}
          </li>
        ))}

      {isSideBarOpen && planList.length > 3 && (
        <li
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={onClickMoreBtn}
          style={{ overflow: isDropDownOpen ? 'visible' : '' }}
          className="md:w-[175px] sm:w-[234px] mb-[5px] p-2 rounded-lg hover:bg-[#F6F6F6] text-gray text-center hover:text-gray_dark_2 cursor-pointer "
        >
          <p className="text-[13px]">+ 더보기</p>
        </li>
      )}

      {isSideBarOpen && planList.length === 0 && (
        <li
          className="my-[5px] p-2 rounded-lg hover:bg-[#F6F6F6] text-gray hover:text-gray_dark_2 cursor-pointer 
            md:w-[175px]
            sm:w-[234px]
            "
        >
          <p className="text-[13px]">{listName[filter]}이 없습니다</p>
        </li>
      )}
    </ul>
  );
}
