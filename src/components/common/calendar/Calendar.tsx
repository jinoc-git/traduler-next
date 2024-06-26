'use client';

import React from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

import { ko } from 'date-fns/locale';
import dayjs from 'dayjs';
import Image from 'next/image';

import { useModifyPlanStoreActions, useModifyPlanStoreState } from '@/store/modifyPlanStore';

import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  startDate: Date | null;
  endDate: Date | null;
  handleStartDate: (date: Date | null) => void;
  handleEndDate: (date: Date | null) => void;
}

registerLocale('ko', ko);

export default function Calendar(props: Props) {
  const { startDate, endDate, handleStartDate, handleEndDate } = props;

  const { modifyState } = useModifyPlanStoreState();
  const { clearRequiredDates } = useModifyPlanStoreActions();

  React.useEffect(() => {
    return () => {
      clearRequiredDates();
    };
  }, []);

  return (
    <div
      className="relative z-10 inner-content-layout
      sm:block sm:pt-[15px] sm:justify-between 
      md:py-[10px] md:flex"
    >
      <div className="sm:flex sm:justify-between sm:w-[286px] md:w-[280px] ">
        <div className="content-lable">
          <Image alt="캘린더 아이콘" src={'/images/svgs/calendarIcon.svg'} width={20} height={20} />
          <p>여행 시작일</p>
        </div>
        <ReactDatePicker
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => {
            return (
              <div className="flex-box bg-white m-[10px]">
                <div className="flex justify-between items-center w-[140px] ">
                  <button
                    className="w-[24px] h-[24px] font-Bold text-gray_dark_1"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    type="button"
                  >
                    {'<'}
                  </button>
                  <div className="text-[15px] font-SemiBold">
                    {dayjs(date).format('YYYY년 M월')}
                  </div>
                  <button
                    className="w-[24px] h-[24px] font-Bold text-gray_dark_1"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    type="button"
                  >
                    {'>'}
                  </button>
                </div>
              </div>
            );
          }}
          dateFormat="yyyy년 MM월 dd일"
          shouldCloseOnSelect
          selected={startDate}
          onChange={(date) => {
            handleStartDate(date);
          }}
          minDate={new Date()}
          maxDate={endDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          locale="ko"
          dayClassName={(d) =>
            d.getDate() === startDate?.getDate() ?? false ? `react-datepicker__startDay` : ``
          }
          className={`text-center react-datepicker read-only:cursor-default ${
            modifyState === 'readOnly' ? '!border-none' : ''
          }
            sm:w-[132px] sm:h-[28px]
            md:w-[120px] md:mr-[20px]`}
          readOnly={modifyState === 'readOnly'}
          placeholderText="YYYY / MM / DD"
          required
          withPortal={true}
          portalId="datepiker-portal"
        />
      </div>
      <div className="sm:flex sm:justify-between sm:w-[286px] md:w-[280px] sm:mt-[10px] md:mt-0">
        <div className="content-lable">
          <Image alt="캘린더 아이콘" src={'/images/svgs/calendarIcon.svg'} width={20} height={20} />
          <p>여행 종료일</p>
        </div>
        <ReactDatePicker
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => {
            return (
              <div className="flex-box bg-white m-[10px]">
                <div className="flex justify-between items-center w-[140px] ">
                  <button
                    className="w-[24px] h-[24px] font-Bold text-gray_dark_1"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    type="button"
                  >
                    {'<'}
                  </button>
                  <div className="text-[15px] font-SemiBold">
                    {dayjs(date).format('YYYY년 M월')}
                  </div>
                  <button
                    className="w-[24px] h-[24px] font-Bold text-gray_dark_1"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    type="button"
                  >
                    {'>'}
                  </button>
                </div>
              </div>
            );
          }}
          dateFormat="yyyy년 MM월 dd일"
          shouldCloseOnSelect
          selected={endDate}
          onChange={handleEndDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          locale="ko"
          dayClassName={(d) =>
            d.getDate() === startDate?.getDate() ?? false ? `react-datepicker__startDay` : ``
          }
          className={`text-center react-datepicker read-only:cursor-default ${
            modifyState === 'readOnly' ? '!border-none' : ''
          }
            sm:w-[132px] sm:h-[28px]
            md:w-[120px] md:mr-[20px]`}
          readOnly={modifyState === 'readOnly'}
          placeholderText="YYYY / MM / DD"
          required
          withPortal={true}
          portalId="datepiker-portal"
        />
      </div>
    </div>
  );
}
