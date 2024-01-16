import ToastProvider from '@/components/common/toastProvider/ToastProvider';
import Header from '@/components/header/Header';

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="flex-box">{children}</main>
        <ToastProvider />
      </body>
    </html>
  );
}

export default RootLayout;
