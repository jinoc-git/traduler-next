'use client';

import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';

import {
  checkUserNickname,
  deleteUserProfileImg,
  updateUserNickname,
  updateUserProfileImage,
  uploadProfileImg,
} from '@/api/auth';
import DuplicateInput from '@/components/common/input/DuplicateInput';
import ModalLayout from '@/components/common/layout/ModalLayout';
import useUserInfoMutation from '@/hooks/useUserInfoMutation';
import { editProfileSchema } from '@/schema/editProfileSchema';
import { useAuthStoreActions, useAuthStoreState } from '@/store/authStore';
import { createClientFromClient } from '@/utils/supabase/client';

import type { ModalProps } from '@/components/common/layout/ModalLayout';
import type { EditProfile } from '@/schema/editProfileSchema';

interface Props extends ModalProps {
  handleCloseModal: () => void;
}

const EditProfileModal = ({ isAnimate, handleCloseModal, modalBGRef, onClickModalBG }: Props) => {
  const user = useAuthStoreState();
  const { setUser } = useAuthStoreActions();
  const { userInfoMutate } = useUserInfoMutation(user?.id);

  const [preview, setPreview] = React.useState(user?.avatar_url || '');
  const [isRemoveAvartar, setIsRemoveAvartar] = React.useState(false);
  const [isDuplicateNickname, setIsDuplicateNickname] = React.useState(true);

  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }, []);

  const resolver = yupResolver(editProfileSchema);

  const {
    handleSubmit,
    register,
    watch,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange', resolver });

  const onSubmit: SubmitHandler<EditProfile> = React.useCallback(
    async (data) => {
      if (!user) return;

      const { nickname, avatar } = data;

      try {
        if (nickname) await updateUserNickname(nickname, user.id);
        if (avatar && avatar.length > 0) {
          const path = await uploadProfileImg(avatar[0], user.email);
          await updateUserProfileImage(path, user.id);
        }
        if (isRemoveAvartar) await deleteUserProfileImg(user.id);

        const { data, error } = await createClientFromClient().auth.refreshSession();
        if (error || data.user === null) throw new Error('세션 초기화 오류');

        const {
          user: { id, email, user_metadata },
        } = data;

        const result = {
          id,
          email: email as string,
          nickname: user_metadata.nickname as string,
          avatar_url: user_metadata.profileImg ? (user_metadata.profileImg as string) : '',
        };

        userInfoMutate(user.id);

        toast.success('프로필 변경 완료');
        handleCloseModal();
        setUser(result);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      }
    },
    [user, userInfoMutate, isRemoveAvartar],
  );

  const avatar = watch('avatar');
  const isChangeAvatar = (avatar !== undefined && avatar.length > 0) || isRemoveAvartar;

  const nickname = watch('nickname');
  const isChangeNickname = nickname !== undefined && nickname !== '';
  const needCheckNickname = isChangeNickname && isDuplicateNickname;

  const blockSubmit = (!isChangeAvatar && !isChangeNickname) || needCheckNickname;

  const handleRemoveAvartar = React.useCallback(() => {
    resetField('avatar');
    setPreview('');

    if (preview !== '') setIsRemoveAvartar(true);
  }, []);

  const checkNickname = React.useCallback(async () => {
    if (nickname) {
      const isOk = await checkUserNickname(nickname);

      if (isOk) {
        setIsDuplicateNickname(false);
        toast.success('사용 가능한 닉네임입니다.');
      } else {
        setIsDuplicateNickname(true);
        toast.error('중복된 닉네임입니다.');
      }
    }
  }, [nickname]);

  React.useEffect(() => {
    setIsDuplicateNickname(true);
  }, [nickname]);

  React.useEffect(() => {
    return () => {
      resetField('avatar');
      resetField('nickname');
      setIsDuplicateNickname(true);
    };
  }, []);

  return (
    <ModalLayout isAnimate={isAnimate} modalBGRef={modalBGRef} onClickModalBG={onClickModalBG}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flexcol items-center align-middle rounded-xl
        md:h-[575px] md:w-[396px] md:justify-between md:gap-0
        sm:h-[404px] sm:w-full sm:gap-[15px]"
      >
        <button
          onClick={handleCloseModal}
          type="button"
          name="profile-modal-close-btn"
          className=" absolute sm:top-0 sm:right-0 md:top-1 md:right-1"
        >
          <Image
            src="/images/svgs/close.svg"
            alt="닫기 아이콘"
            width={30}
            height={30}
            className="sm:w-[24px] sm:h-[24px] md:w-[30px] md:h-[30px]"
          />
        </button>
        <div className="md:flex items-center gap-3 w-full">
          <Image
            src={user?.avatar_url || '/images/svgs/userDefault.svg'}
            alt="프로필 아이콘"
            width={200}
            height={200}
            className="w-[30px] h-[30px] md:block sm:hidden rounded-full border border-gray"
          />
          <p className="font-semibold md:text-xlg sm:text-lg text-gray_dark_2">프로필 편집</p>
          <p className="md:hidden text-[16px]">프로필 사진과 닉네임을 변경하세요 </p>
        </div>
        <div className="relative hover:brightness-75 sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px] normal-transition">
          <label htmlFor="avatar">
            <Image
              src={preview || '/images/svgs/userDefault.svg'}
              alt="유저 프로필 사진"
              width={200}
              height={200}
              className="w-full h-full rounded-full border-[2.5px] border-gray object-cover cursor-pointer"
            />
            <div
              className="absolute flex-box w-[42px] h-[42px] rounded-full bg-white border-[2px] border-gray cursor-pointer
              md:top-3/4 md:left-[140px]
              sm:top-3/4 sm:left-[110px]
              "
            >
              <Image
                src="/images/svgs/camera.svg"
                alt="카메라 아이콘"
                width={21}
                height={21}
                className="w-[21px] h-[21px] cursor-pointer mt-1"
              />
            </div>
          </label>
          <input
            id="avatar"
            type="file"
            {...register('avatar', { onChange: handleFileChange })}
            accept=".jpg, .jpeg, .png, .heic, .heif, .HEIC, .HEIF"
            className="hidden"
          />
        </div>
        <p className="text-center md:text-normal sm:text-xs">
          프로필 사진은 정사각형 비율로 된 사진을 업로드해 주세요. <br />
          (100 X 100픽셀 권장)
        </p>
        <DuplicateInput<EditProfile>
          leftIcon={{ src: '/images/svgs/person.svg', alt: '사람 아이콘' }}
          name="nickname"
          placeholder={user ? user.nickname : ''}
          register={register('nickname')}
          duplicate={!isChangeNickname}
          errors={errors}
          checkFunc={checkNickname}
        />
        <div className="flex justify-between md:w-[408px] sm:w-full gap-[10px]">
          <button
            name="profile-remove-avatar-btn"
            type="button"
            onClick={handleRemoveAvartar}
            className="w-full border border-navy rounded-lg text-navy hover:bg-navy_light_1 disabled:bg-gray_light_3 normal-transition
              md:h-[45px]
              sm:h-[41px]
              "
            disabled={preview === ''}
          >
            사진 제거
          </button>
          <button
            name="profile-change-btn"
            disabled={blockSubmit}
            type="submit"
            className="flex-box gap-2 w-full border rounded-lg bg-navy text-white hover:bg-navy_light_3 disabled:bg-gray_light_3 normal-transition
              md:h-[45px]
              sm:h-[41px]
              "
          >
            프로필 변경
            {isSubmitting && (
              <Image
                src="/images/gif/loader-all-color.gif"
                alt="로딩 스피너"
                width={32}
                height={32}
              />
            )}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default EditProfileModal;
