import * as yup from 'yup';

const emailRegExp = /^[a-zA-Z0-9]+(.[_a-z0-9-]+)*@(?:\w+\.)+\w+$/;
const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?`~^&])[A-Za-z\d@$!%*#?`~^&]{8,20}$/;
const nicknameRegExp = /^[가-힣|a-z|A-Z|0-9|]{2,6}$/;

const email = yup
  .string()
  .required('이메일을 입력해주세요.')
  .matches(emailRegExp, '이메일 형식이 올바르지 않습니다.')
  .min(6, '이메일은 6자리 이상이어야 합니다.')
  .max(20, '이메일은 20자리 이하이어야 합니다.');

const signinPassword = yup
  .string()
  .required('비밀번호를 입력해주세요.')
  .min(6, '올바른 비밀번호를 입력해주세요.')
  .max(20, '올바른 비밀번호를 입력해주세요.');

const password = yup
  .string()
  .required('비밀번호를 입력해주세요.')
  .matches(passwordRegExp, '비밀번호는 영문/숫자/특수문자 포함 8~20자리')
  .min(8, '비밀번호는 8자리 이상이어야 합니다.')
  .max(20, '비밀번호는 20자리 이하이어야 합니다.');

const confirmPassword = yup
  .string()
  .required('비밀번호를 입력해주세요.')
  .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다.');

const nickname = yup
  .string()
  .required('닉네임을 입력해주세요.')
  .matches(nicknameRegExp, '닉네임은 2~6자, 특수문자 불가입니다.')
  .min(2, '닉네임은 2자리 이상이어야 합니다.')
  .max(6, '닉네임은 6자리 이하이어야 합니다.');

const signinUser = { email, signinPassword };

const signupUser = {
  nickname,
  email,
  password,
  confirmPassword,
};

export const signinSchema = yup.object().shape(signinUser);
export const signupSchema = yup.object().shape(signupUser);
