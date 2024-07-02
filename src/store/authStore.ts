import { create } from 'zustand';

import { createClientFromClient } from '@/utils/supabase/client';

import type { UserType } from '@/types/supabase';

interface Actions {
  authObserver: () => void;
  setUser: (user: UserType) => void;
  resetUser: () => void;
}

interface Store {
  user: UserType | null;
  actions: Actions;
}

export const authStore = create<Store>((set, get) => ({
  user: null,
  actions: {
    authObserver: () => {
      const supabaseClientClient = createClientFromClient();

      supabaseClientClient.auth.onAuthStateChange((event, session) => {
        const currentUser = get().user;
        if (session !== null && currentUser === null) {
          localStorage.setItem('isLogin', 'true');

          if (session.user.app_metadata.provider === 'google') {
            const {
              id,
              email,
              user_metadata: { name, nickname, profileImg },
            } = session.user;

            const user: UserType = {
              id,
              email: email as string,
              nickname: nickname ?? name,
              avatar_url: profileImg ?? null,
            };

            set({ user });
          } else if (session.user.app_metadata.provider === 'kakao') {
            const {
              id,
              email,
              user_metadata: { name, user_name, avatar_url },
            } = session.user;

            const user: UserType = {
              id,
              email: email as string,
              nickname: name ?? user_name,
              avatar_url: avatar_url ?? null,
            };

            set({ user });
          } else {
            const {
              id,
              email,
              user_metadata: { nickname, profileImg },
            } = session.user;

            const user: UserType = {
              id,
              email: email as string,
              nickname,
              avatar_url: profileImg ?? null,
            };

            set({ user });
          }
        } else if (session === null) {
          localStorage.setItem('isLogin', 'false');
        }
      });
    },

    setUser: (user: UserType) => {
      set({ user });
    },

    resetUser: () => {
      set({ user: null });
    },
  },
}));

export const useAuthStoreState = () => authStore((store) => store.user);
export const useAuthStoreActions = () => authStore((store) => store.actions);
