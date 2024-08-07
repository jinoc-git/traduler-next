'use client';

import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import { checkUserEmail, checkUserNickname, signUpWithSB } from '@/api/auth';
import { signupSchema } from '@/schema/formSchema';

import GoogleLoginButton from '../../button/googleLoginButton/GoogleLoginButton';
import KakaoLoginButton from '../../button/kakaoLoginButton/KakaoLoginButton';
import DuplicateInput from '../../input/DuplicateInput';
import PasswordInput from '../../input/PasswordInput';

export interface SignupFormInputList {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const router = useRouter();

  const [duplicate, setDuplicate] = React.useState({ nickname: true, email: true });

  const resolver = yupResolver(signupSchema);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: 'onChange', resolver });

  const onSubmit: SubmitHandler<SignupFormInputList> = async (data) => {
    const { email, password, nickname } = data;
    try {
      await signUpWithSB(email, password, nickname);

      reset();

      toast.success('회원가입에 성공하였습니다');
      router.push('/main');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const checkNicknameDuplication = async () => {
    const nicknameValue = watch('nickname');

    if (!nicknameValue) {
      toast.warning('닉네임을 확인해주세요.');
      return;
    }

    try {
      const res = await checkUserNickname(nicknameValue);

      if (res) {
        setDuplicate({ ...duplicate, nickname: false });
        toast.success('사용 가능한 닉네임입니다.');
      } else {
        toast.warning('닉네임이 중복 되었습니다.');
      }
    } catch (error) {
      toast.warning('잠시후 다시 시도해주세요.');
    }
  };

  const checkEmailDuplication = async () => {
    const emailValue = watch('email');

    if (!emailValue) {
      toast.warning('이메일을 확인해주세요.');
      return;
    }

    try {
      const res = await checkUserEmail(emailValue);

      if (res) {
        setDuplicate({ ...duplicate, email: false });
        toast.success('사용 가능한 이메일입니다.');
      } else {
        toast.warning('이메일이 중복 되었습니다.');
      }
    } catch (error) {
      toast.warning('잠시후 다시 시도해주세요.');
    }
  };

  const goToSignIn = () => {
    router.push('/signin');
  };

  React.useEffect(() => {
    setDuplicate((prev) => ({ ...prev, nickname: true }));
  }, [watch('nickname')]);

  React.useEffect(() => {
    setDuplicate((prev) => ({ ...prev, email: true }));
  }, [watch('email')]);

  return (
    <form
      className="position-center flexcol rounded-xl bg-[#F9F9FB]
        md:w-[450px] md:px-[50px] md:py-[37px] md:gap-y-2.5
        sm:w-[320px] sm:px-[30px] sm:py-[22px] sm:gap-y-2
      "
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="text-blue border-blue border-b-2 w-fit text-lg font-semibold">회원가입</h3>
      <DuplicateInput<SignupFormInputList>
        name="nickname"
        placeholder="닉네임을 입력해주세요."
        register={register('nickname')}
        leftIcon={{ src: '/images/svgs/person.svg', alt: '사람 아이콘' }}
        errors={errors}
        duplicate={watch('nickname') === undefined || watch('nickname') === ''}
        checkFunc={checkNicknameDuplication}
      />
      <DuplicateInput<SignupFormInputList>
        name="email"
        placeholder="이메일을 입력해주세요."
        register={register('email')}
        leftIcon={{ src: '/images/svgs/message.svg', alt: '이메일 아이콘' }}
        errors={errors}
        duplicate={watch('email') === undefined || watch('email') === ''}
        checkFunc={checkEmailDuplication}
      />
      <PasswordInput
        name="password"
        placeholder="특수문자 포함 8~20자 이내"
        register={register('password')}
        errors={errors}
      />
      <PasswordInput
        name="confirmPassword"
        placeholder="비밀번호를 다시 입력해주세요."
        register={register('confirmPassword')}
        errors={errors}
      />
      <button
        disabled={isSubmitting || !isValid || duplicate.email || duplicate.nickname}
        name="signup-submit-btn"
        className="h-[45px] rounded-lg text-white bg-blue hover:bg-blue_dark disabled:bg-gray_light_3 normal-transition"
      >
        회원가입
      </button>
      <div className="flex justify-between items-center my-2">
        <span className="block w-5/12 h-px bg-slate-400" />
        <span className="text-slate-400">또는</span>
        <span className="block w-5/12 h-px bg-slate-400" />
      </div>
      <GoogleLoginButton />
      <KakaoLoginButton />
      <div
        className="flex justify-center gap-1 absolute left-1/2 -translate-x-1/2 min-w-[240px] p-2 rounded-lg text-sm font-semibold
          md:bottom-[-50px] md:bg-white/20
          sm:bottom-[-60px] sm:bg-white/50
        "
      >
        <p className=" text-gray_dark_1">이미 계정이 있나요?</p>
        <p onClick={goToSignIn} className="w-fit underline text-black cursor-pointer">
          지금 로그인하세요!
        </p>
      </div>
    </form>
  );
}
