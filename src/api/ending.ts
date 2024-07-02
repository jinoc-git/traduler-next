import { addCommas } from '@/utils/numberFormat';
import { createClientFromClient } from '@/utils/supabase/client';

import { getPath } from './path';
import { getAllPinsByIdAndDates } from './pins';
import { getPlanDate } from './plan';

import type { Distance, EndingPlanType, PinContentsType } from '@/types/supabase';

const supabaseClientClient = createClientFromClient();

export const calcAllPath = async (allPinsContent: PinContentsType[][]) => {
  const distanceArr: Distance = [];

  for (const pinArr of allPinsContent) {
    const oneDay: string[][] = [];

    for (let i = 0; i < pinArr.length - 1; i++) {
      const { lat: originLat, lng: originLng } = pinArr[i];
      const { lat: destinationLat, lng: destinationLng } = pinArr[i + 1];

      try {
        const result = await getPath({
          origin: `${originLng},${originLat}`,
          destination: `${destinationLng},${destinationLat}`,
        });

        const distanceInKm = result / 1000;

        oneDay.push([`${i}`, distanceInKm.toFixed(1)]);
      } catch (err) {
        throw new Error('거리 계산 오류');
      }
    }

    if (oneDay.length === 0) distanceArr.push({ '0': '0' });
    else distanceArr.push(Object.fromEntries(oneDay));
  }

  return distanceArr;
};

export const getCosts = async (planId: string) => {
  const { dates } = await getPlanDate(planId);

  const data = await getAllPinsByIdAndDates([planId, dates]);

  const result = data.map(({ contents }) => contents.map(({ cost }) => cost));

  return result;
};

export const calcCostAndInsertPlansEnding = async (planId: string) => {
  const datesCost: string[] = [];

  const response = await getCosts(planId);

  response.forEach((value) => {
    let totalCost = 0;

    value.forEach((cost) => {
      if (cost) totalCost += Number(cost.replaceAll(',', ''));
    });

    datesCost.push(addCommas(totalCost));
  });

  return datesCost;
};

export const insertPlanEnding = async (options: EndingPlanType) => {
  const { error } = await supabaseClientClient.from('plans_ending').insert(options);

  if (error) throw new Error('엔딩 데이터 추가 오류');
};
