// services/auth/prelogin.ts
import { publicAxios } from '../index';

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
  const { data } = await publicAxios.post<PreloginResponse>(
    '/auth/prelogin/',
    req,
  );
  console.log('prelogin 요청 성공');
  return data;
}
