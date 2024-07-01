'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthStoreActions } from '@/store/authStore';
import { useSideBarStoreActions } from '@/store/sideBarStore';

import Alarm from './alarm/Alarm';
import Logo from './logo/Logo';

import type { Session } from '@supabase/supabase-js';

interface Props {
  session: Session | null;
}

export default function Header({ session }: Props) {
  const pathname = usePathname();

  const { authObserver } = useAuthStoreActions();
  const { setVisibilitySideBar } = useSideBarStoreActions();

  const isLogin = session !== null;

  const bgWhite =
    pathname !== '/' && pathname !== '/signin' && pathname !== '/signup' && pathname !== '/main';

  React.useEffect(() => {
    authObserver();

    if (isLogin && pathname !== '/') setVisibilitySideBar(true);
    else setVisibilitySideBar(false);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 z-40 flex justify-between items-center w-screen 
      sm:h-[80px] sm:justify-end
      md:h-[70px] md:justify-between
      ${bgWhite ? 'bg-bg_white' : 'bg-transparent'}
      `}
    >
      <Logo isLogin={isLogin} isMain={pathname === '/main'} />

      {isLogin ? (
        <Alarm userId={session?.user.id} />
      ) : (
        <div className="header-link-box flex-box md:w-[134px] sm:w-[84px]">
          {pathname === '/signin' ? (
            <Link href="/signup">회원가입</Link>
          ) : (
            <Link href="/signin">로그인</Link>
          )}
        </div>
      )}
    </header>
  );
}
