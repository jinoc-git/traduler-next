import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { uuid } from '@supabase/gotrue-js/dist/module/lib/helpers';

import { type Database, type UserType } from '@/types/supabase';

const supabaseClientClient = createClientComponentClient<Database>();

export { supabaseClientClient };

export const signUpWithSB = async (
  email: string,
  password: string,
  nickname: string,
) => {
  const { data, error: authError } = await supabaseClientClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
    },
  });

  const isAuthError = Boolean(authError);
  if (isAuthError) {
    return authError;
  }

  const id = data.user?.id;
  const user = {
    id: id as string,
    email,
    nickname,
  };

  const res = await insertUser(user);

  const isUsersTableError = Boolean(res);
  if (isUsersTableError) {
    return res;
  }
};

export const insertUser = async (user: UserType) => {
  const { id, email, nickname } = user;
  const { error } = await supabaseClientClient.from('users').insert({
    id,
    email,
    nickname,
  });

  const isUsersTableError = Boolean(error);
  if (isUsersTableError) {
    return error;
  }
};

export const signInWithSB = async (email: string, password: string) => {
  const { error: authError } =
    await supabaseClientClient.auth.signInWithPassword({
      email,
      password,
    });

  const isAuthError = Boolean(authError);
  if (isAuthError) {
    return authError;
  }
};

export const signInWithGoogle = async () => {
  await supabaseClientClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/authloading',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
};

export const signOutForSB = async () => {
  await supabaseClientClient.auth.signOut();
};

export const uploadProfileImg = async (avatarFile: File, email: string) => {
  const { data, error: storageError } = await supabaseClientClient.storage
    .from('profile_img')
    .upload(`${email}/${uuid()}`, avatarFile, {
      cacheControl: '3600',
      upsert: false,
    });

  const isStorageError = Boolean(storageError);
  if (isStorageError) {
    return storageError;
  }
  if (data !== null) {
    return data.path;
  }
};

export const updateUserProfileImage = async (path: string, userId: string) => {
  const URL = `${
    process.env.NEXT_PUBLIC_SB_STORAGE_URL as string
  }/profile_img/${path}`;
  const { data } = await supabaseClientClient.auth.updateUser({
    data: { profileImg: URL },
  });

  const { error } = await supabaseClientClient
    .from('users')
    .update({ avatar_url: URL })
    .eq('id', userId)
    .select();

  const isUserTableError = Boolean(error);
  if (isUserTableError) {
    console.log(error);
    return null;
  }

  const isSuccess = Boolean(data);
  if (isSuccess) {
    return data.user;
  }
};

export const deleteUserProfileImage = async (userId: string) => {
  const { data } = await supabaseClientClient.auth.updateUser({
    data: { profileImg: null },
  });

  const { error } = await supabaseClientClient
    .from('users')
    .update({ avatar_url: null })
    .eq('id', userId)
    .select();

  const isUserTableError = Boolean(error);
  if (isUserTableError) {
    console.log(error);
    return null;
  }

  if (data !== null) {
    return data.user;
  }
};

export const checkUserNickname = async (nickname: string) => {
  const { data } = await supabaseClientClient
    .from('users')
    .select('nickname')
    .eq('nickname', nickname);

  if (data !== null && data.length === 0) {
    return true;
  }
  if (data !== null && data.length > 0) {
    return false;
  }
};

export const checkUserEmail = async (email: string) => {
  const { data } = await supabaseClientClient
    .from('users')
    .select('email')
    .eq('email', email);
  if (data !== null && data.length === 0) {
    return true;
  }
  if (data !== null && data.length > 0) {
    return false;
  }
};

export const updateUserNickname = async (nickname: string, userId: string) => {
  const { data } = await supabaseClientClient.auth.updateUser({
    data: { nickname },
  });

  const { error } = await supabaseClientClient
    .from('users')
    .update({ nickname })
    .eq('id', userId)
    .select();

  const isUserTableError = Boolean(error);
  if (isUserTableError) {
    console.log(error);
    return null;
  }

  const isSuccess = Boolean(data);
  if (isSuccess) {
    if (data.user !== null && data.user !== undefined) {
      const {
        id,
        email,
        user_metadata: { nickname, profileImg },
      } = data.user;

      return {
        id,
        email: email as string,
        nickname,
        profileImg,
      };
    }
  }
};

export const getUserInfoWithId = async (id: string) => {
  const { data: userData, error } = await supabaseClientClient
    .from('users')
    .select()
    .eq('id', id);

  if (error !== null || userData === null) {
    console.log('유저 데이터 불러오기 오류');
  }

  return userData;
};
