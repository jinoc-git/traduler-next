import { v4 as uuidv4 } from 'uuid';

import { type UserType } from '@/types/supabase';
import { createClientFromClient } from '@/utils/supabase/client';

const supabaseClientClient = createClientFromClient();

export const signUpWithSB = async (email: string, password: string, nickname: string) => {
  const { data, error } = await supabaseClientClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
    },
  });

  if (error) throw new Error('회원가입 오류 발생');

  const id = data.user?.id;
  const user = {
    id: id as string,
    email,
    nickname,
  };

  await insertUser(user);
};

export const insertUser = async (user: UserType) => {
  const { id, email, nickname, avatar_url } = user;

  const { error } = await supabaseClientClient.from('users').insert({
    id,
    email,
    nickname,
    avatar_url: avatar_url ?? null,
  });

  if (error) throw new Error('유저 데이터 추가 오류');
};

export const signInWithSB = async (email: string, password: string) => {
  const { error } = await supabaseClientClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error('로그인 오류');
};

export const signInWithGoogle = async () => {
  const { error } = await supabaseClientClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/authloading`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw new Error('구글 로그인 오류');
};

export const checkOAuthUser = async () => {
  const {
    data: { session },
    error,
  } = await supabaseClientClient.auth.getSession();

  if (error) throw new Error('세션 불러오기 오류');

  if (session) {
    const {
      id,
      email,
      user_metadata: { name: nickname, avatar_url },
    } = session.user;

    const { data: check, error } = await supabaseClientClient
      .from('users')
      .select('id')
      .eq('id', id);

    if (error) throw new Error('유저 체크 오류');

    if (check && check.length === 0) {
      const user: UserType = {
        id,
        email: email as string,
        nickname,
        avatar_url: avatar_url ?? null,
      };

      await insertUser(user);
    }
  }
};

export const signinWithKakao = async () => {
  const { error } = await supabaseClientClient.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/authloading`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw new Error('카카오 로그인 오류');
};

export const signOutForSB = async () => {
  await supabaseClientClient.auth.signOut();
  await supabaseClientClient.auth.refreshSession();
};

export const uploadProfileImg = async (avatarFile: File, email: string) => {
  const { data, error } = await supabaseClientClient.storage
    .from('profile_img')
    .upload(`${email}/${uuidv4()}`, avatarFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw new Error('프로필 사진 업로드 오류');

  return data.path;
};

export const updateUserProfileImage = async (path: string, userId: string) => {
  const URL = `${process.env.NEXT_PUBLIC_SB_STORAGE_URL as string}/profile_img/${path}`;

  const { data, error } = await supabaseClientClient.auth.updateUser({
    data: { profileImg: URL },
  });

  const { error: tableError } = await supabaseClientClient
    .from('users')
    .update({ avatar_url: URL })
    .eq('id', userId)
    .select();

  if (error || tableError) throw new Error('프로필 업데이트 오류');

  const { id, email, user_metadata } = data.user;

  return {
    id,
    email: email as string,
    nickname: user_metadata.nickname as string,
    profileImg: user_metadata.profileImg ? (user_metadata.profileImg as string) : '',
  };
};

export const deleteUserProfileImg = async (userId: string) => {
  const { data, error } = await supabaseClientClient.auth.updateUser({
    data: { profileImg: null },
  });

  const { error: tableError } = await supabaseClientClient
    .from('users')
    .update({ avatar_url: null })
    .eq('id', userId)
    .select();

  if (error || tableError) throw new Error('아바타 삭제 오류');

  const { id, email, user_metadata } = data.user;

  return {
    id,
    email: email as string,
    nickname: user_metadata.nickname as string,
    profileImg: user_metadata.profileImg ? (user_metadata.profileImg as string) : '',
  };
};

export const checkUserNickname = async (nickname: string) => {
  const { data, error } = await supabaseClientClient
    .from('users')
    .select('nickname')
    .eq('nickname', nickname);

  if (error) throw new Error('닉네임 중복 확인 오류');

  const isOK = data.length === 0;
  if (isOK) return true;

  return false;
};

export const checkUserEmail = async (email: string) => {
  const { data, error } = await supabaseClientClient
    .from('users')
    .select('email')
    .eq('email', email);

  if (error) throw new Error('이메일 중복 확인 오류');

  const isOk = data.length === 0;
  if (isOk) return true;

  return false;
};

export const updateUserNickname = async (nickname: string, userId: string) => {
  const { data, error } = await supabaseClientClient.auth.updateUser({
    data: { nickname },
  });

  const { error: tableError } = await supabaseClientClient
    .from('users')
    .update({ nickname })
    .eq('id', userId)
    .select();

  if (error || tableError) throw new Error('닉네임 업데이트 오류');

  const { id, email, user_metadata } = data.user;

  return {
    id,
    email: email as string,
    nickname: user_metadata.nickname as string,
    profileImg: user_metadata.profileImg ? (user_metadata.profileImg as string) : '',
  };
};

export const getUserInfoWithId = async (id: string) => {
  const { data, error } = await supabaseClientClient.from('users').select().eq('id', id).single();

  if (error) throw new Error(error.message);

  return data;
};

export const getUserInfoWithIdList = async (userIdList: string[]) => {
  const { data, error } = await supabaseClientClient.from('users').select().in('id', userIdList);

  if (error) throw new Error(error.message);

  return data;
};
