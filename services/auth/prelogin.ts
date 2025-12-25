// services/auth/prelogin.ts
import { axiosInstance, publicAxios } from '../index';

export type SocialProvider = 'kakao' | 'apple';

export type PreloginRequest = {
  provider: SocialProvider;
  email?: string; // kakao
  apple_sub?: string; // apple
};

export type PreloginResponse = {
  is_new_user: boolean;
};

export async function postSocialPrelogin(
  req: PreloginRequest,
): Promise<PreloginResponse> {
  console.log('prelogin req: ', req);
  console.log('prelogin headers', axiosInstance.defaults.headers);
  const { data } = await publicAxios.post<PreloginResponse>(
    '/auth/prelogin/',
    req,
  );
  console.log('prelogin data:ㄲ;ㄹ낄 ', data);
  return data;
}
