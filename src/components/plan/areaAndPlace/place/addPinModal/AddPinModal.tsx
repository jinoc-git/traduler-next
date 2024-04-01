'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';

import TitleInput from '@/components/common/input/TitleInput';
import ModalLayout from '@/components/common/layout/ModalLayout';
import { addPinSchema } from '@/schema/addPinModalSchema';
import { pinStore } from '@/store/pinStore';
import { addCommas } from '@/utils/numberFormat';

import type { PinContentsType } from '@/types/supabase';

export interface AddPinInputType {
  placeName: string;
  address: string;
  cost: string;
}

interface Props {
  isAnimate: boolean;
  currentPage: number;
  setPins: React.Dispatch<React.SetStateAction<PinContentsType[][]>>;
  closeModal: () => void;
}

const AddPinModal = (props: Props) => {
  const { isAnimate, currentPage, setPins, closeModal } = props;
  const { pin, idx, resetPin } = pinStore();

  const resolver = yupResolver(addPinSchema);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddPinInputType>({
    mode: 'onChange',
    defaultValues: {
      placeName: pin !== null ? pin.placeName : '',
      cost: pin !== null && typeof pin.cost === 'string' ? pin.cost : '0',
    },
  });

  const onChangeCost = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.substring(0, 8);

    setValue('cost', addCommas(+val));
  };

  return (
    <ModalLayout isAnimate={isAnimate}>
      <TitleInput
        title="장소 이름"
        name="placeName"
        placeholder="장소 이름을 입력하세요."
        register={register('placeName')}
        errors={errors}
      />
      <TitleInput
        title="주소"
        name="address"
        placeholder="주소를 검색하세요."
        register={register('address')}
        errors={errors}
      />
      <TitleInput
        title="지출 비용"
        name="cost"
        placeholder="지출 비용을 입력하세요."
        defaultValue="0"
        register={register('cost', { onChange: onChangeCost })}
        errors={errors}
      />
    </ModalLayout>
  );
};

export default AddPinModal;
