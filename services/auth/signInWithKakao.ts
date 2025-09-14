import { axiosInstance } from '../index';

export type KakaoSignInRequest = {
  code: string; // 카카오에서 받은 authorization code
};
export type KakaoSignInResponse = {
  success: boolean;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
  access: string;
  refresh: string;
  message: string;
};

export const signInWithKakao = async (code: string) => {
  const { data } = await axiosInstance.post('/auth/kakao/token/', { code });
  return data;
};
