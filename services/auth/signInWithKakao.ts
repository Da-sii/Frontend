import { axiosInstance } from '../index';

export type KakaoSignInRequest = {
  kakao_access_token: string; // 카카오에서 받은 authorization code
  kakao_refresh_token: string;
};
export type KakaoSignInResponse = {
  success: boolean;
  user: {
    id: number;
    email: string;
    nickname: string;
    kakao: boolean;
  };
  access: string;
  message: string;
  is_new_user: boolean;
};

export const signInWithKakao = async (
  kakao_access_token: string,
  kakao_refresh_token: string,
) => {
  const { data } = await axiosInstance.post('/auth/kakao/token/', {
    kakao_access_token,
    kakao_refresh_token,
  });
  return data;
};
