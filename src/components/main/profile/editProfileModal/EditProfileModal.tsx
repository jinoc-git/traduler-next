'use client';

import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  checkUserNickname,
  updateUserNickname,
  updateUserProfileImage,
  uploadProfileImg,
} from '@/api/auth';
import DuplicateInput from '@/components/common/input/DuplicateInput';
import ModalLayout from '@/components/common/layout/ModalLayout';
import { editProfileSchema } from '@/schema/editProfileSchema';
import { useAuthStoreActions, useAuthStoreState } from '@/store/authStore';

import type { EditProfile } from '@/schema/editProfileSchema';

interface Props {
  handleCloseModal: () => void;
  isAnimate: boolean;
}

const EditProfileModal = ({ isAnimate, handleCloseModal }: Props) => {
  const router = useRouter();

  const user = useAuthStoreState();
  const { setUser } = useAuthStoreActions();

  const [isDuplicateNickname, setIsDuplicateNickname] = React.useState(true);

  const resolver = yupResolver(editProfileSchema);

  const {
    handleSubmit,
    register,
    watch,
    resetField,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: 'onChange', resolver });

  const onSubmit: SubmitHandler<EditProfile> = async (data) => {
    console.log(data);
    if (!user) return;

    const { nickname, avatar } = data;

    try {
      if (nickname) {
        const result = await updateUserNickname(nickname, user.id);
        console.log('닉네임 업데이트', result);
        setUser(result);
      }
      if (avatar && avatar.length > 0) {
        const path = await uploadProfileImg(avatar[0], user.email);
        const result = await updateUserProfileImage(path, user.id);
        console.log('사진 업데이트', result);
        setUser(result);
      }
      toast.success('프로필 변경 완료');
      handleCloseModal();
      router.refresh();
    } catch (error) {}
  };

  const avatar = watch('avatar');
  const isChangeAvatar = avatar !== undefined && avatar.length > 0;

  const nickname = watch('nickname');
  const isChangeNickname = nickname !== undefined && nickname !== '';

  const blockSubmit = (!isChangeAvatar && !isChangeNickname) || isDuplicateNickname;

  // 사진만 변경, 닉네임만 변경

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
    console.log('render');
    return () => {
      resetField('avatar');
      resetField('nickname');
      setIsDuplicateNickname(true);
    };
  }, []);

  return (
    <ModalLayout isAnimate={isAnimate}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative flexcol items-center align-middle rounded-xl
        md:h-[575px] md:w-[396px] md:justify-between md:gap-0
        sm:h-[404px] sm:w-[310px] sm:gap-[15px]"
      >
        <button
          onClick={handleCloseModal}
          type="button"
          name="profile-modal-close-btn"
          className=" absolute sm:top-0 sm:right-0 md:top-1 md:right-1"
        >
          <Image
            src="/images/svgs/close.svg"
            alt="프로필 아이콘"
            width={30}
            height={30}
            className="sm:w-[24px] sm:h-[24px] md:w-[30px] md:h-[30px]"
          />
        </button>
        <div className="md:flex items-center gap-3 w-full">
          <Image
            src="/images/svgs/userDefault.svg"
            alt="프로필 아이콘"
            width={30}
            height={30}
            className="w-[30px] h-[30px] md:block sm:hidden rounded-full border border-gray"
          />
          <p className="font-semibold md:text-xlg sm:text-lg text-gray_dark_2">프로필 편집</p>
          <p className="md:hidden text-[16px]">프로필 사진과 닉네임을 변경하세요 </p>
        </div>
        <div className="relative hover:brightness-75 sm:w-[150px] sm:h-[150px] md:w-[200px] md:h-[200px]">
          <label htmlFor="avatar">
            <Image
              src="/images/svgs/userDefault.svg"
              alt="프로필 아이콘"
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
            {...register('avatar')}
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
        <div className="flex justify-between md:w-[408px] sm:w-[310px]">
          <button
            name="profile-remove-avatar-btn"
            type="button"
            // onClick={removeAvatarBtnHandler}
            className="border border-navy rounded-lg text-navy hover:bg-navy_light_1 disabled:bg-gray_light_3 
              md:w-[200px] md:h-[45px]
              sm:w-[150px] sm:h-[41px]
              "
            // disabled={previewImg === ''}
          >
            사진 제거
          </button>
          <button
            name="profile-change-btn"
            disabled={blockSubmit}
            type="submit"
            className="border rounded-lg bg-navy text-white hover:bg-navy_light_3 disabled:bg-gray_light_3
              md:w-[200px] md:h-[45px]
              sm:w-[150px] sm:h-[41px]
              "
          >
            프로필 변경
            {/* {isSubmitting && '제출중'} */}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default EditProfileModal;
