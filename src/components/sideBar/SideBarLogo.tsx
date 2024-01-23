'use client';

import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SideBarLogo() {
  const router = useRouter();

  const onClickLogo = () => {
    router.push('/main');
  };

  return (
    <div
      className="flex items-center justify-end bg-white
      sm:w-[310px] sm:h-[70px] sm:gap-[58px] sm:mt-[8px]
      md:w-[222px] md:h-[55px] md:gap-[34px]"
    >
      <Image
        src="/images/logo-color.webp"
        alt="logo"
        width={134}
        height={33}
        onClick={onClickLogo}
        className=" mr-[14px]"
      />
    </div>
  );
}