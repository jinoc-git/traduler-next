import Script from 'next/script';

import { getSessionFromServer } from '@/api/serverAction';
import Confirm from '@/components/common/confirm/Confirm';
import AnimateProvider from '@/components/common/providers/animateProvider/AnimateProvider';
import TanstackQueryProvider from '@/components/common/providers/tanstackQueryProvider/TanstackQueryProvider';
import ToastProvider from '@/components/common/providers/toastProvider/ToastProvider';
import Header from '@/components/header/Header';
import SideBar from '@/components/sideBar/SideBar';

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Traduler',
  description: '다 같이 여행을 떠날 때 저희 서비스와 함께해요!',
};

const KAKAO_MAP_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=services,clusterer`;

async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromServer();

  return (
    <html lang="ko">
      <body>
        <TanstackQueryProvider>
          <Header session={session} />
          <SideBar />
          <Script src={KAKAO_MAP_URL} strategy="beforeInteractive" />
          <AnimateProvider>{children}</AnimateProvider>
          <ToastProvider />
        </TanstackQueryProvider>
        <Confirm />
        <div id="modal-portal" />
        <div id="datepiker-portal" />
      </body>
    </html>
  );
}

export default RootLayout;
