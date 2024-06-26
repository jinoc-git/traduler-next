import React from 'react';

import Image from 'next/image';
import { redirect } from 'next/navigation';

import { getSessionFromServer } from '@/api/serverAction';
import SignupForm from '@/components/common/form/signupForm/SignupForm';

export default async function Signup() {
  const session = await getSessionFromServer();

  if (session) redirect('/main');

  return (
    <section className="flex-box w-full h-full">
      <Image
        src="/images/img-signup-bg.webp"
        alt="회원가입 배경"
        width={856}
        height={1080}
        className="absolute inset-0 w-full max-w-[856px] h-screen object-cover"
        priority
      />
      <SignupForm />
    </section>
  );
}
