import { toast } from 'react-toastify';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getUserUnConfirmedAlarmList } from '@/api/alarm';
import { useAuthStoreState } from '@/store/authStore';

const useAlarmMutation = () => {
  const user = useAuthStoreState();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: getUserUnConfirmedAlarmList,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userAlaram', user?.id] });
      await queryClient.invalidateQueries({ queryKey: ['plan_mates', user?.id] });
      await queryClient.invalidateQueries({ queryKey: ['book_mark', user?.id] });
    },
    onError: () => {
      toast.error('새로운 알림 추가 오류');
    },
  });

  return { alarmMutate: mutate };
};

export default useAlarmMutation;
