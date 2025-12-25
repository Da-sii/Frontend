import { login, me } from '@react-native-kakao/user';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { postSocialPrelogin } from '../../../services/auth/prelogin';
import { usePendingKakaoAuth } from '../../../store/usePendingKakaoAuth';

interface PreloginResponse {
  is_new_user: boolean;
}

export const useKakaoPrelogin = () => {
  const setPending = usePendingKakaoAuth((s) => s.setPending);

  return useMutation<PreloginResponse, unknown, void>({
    mutationFn: async () => {
      // 1) 카카오 로그인
      const kakao = await login();
      if (!kakao.accessToken) {
        throw new Error('카카오 로그인에 실패했어요.');
      }

      // 2) 카카오 유저 정보
      const profile = await me();
      const email = profile.email;

      if (!email) {
        throw new Error('카카오 이메일 정보가 없어요.');
      }

      // 3) 임시 저장 (동의 후 로그인에 사용)
      setPending({
        kakaoEmail: email,
        kakaoAccessToken: kakao.accessToken,
        kakaoRefreshToken: kakao.refreshToken ?? null,
      });

      // 4) 우리 서버에 prelogin 요청
      return postSocialPrelogin({
        provider: 'kakao',
        email,
      });
    },
    onError: (err: any) => {
      console.log('status', err?.response?.status);
      console.log('url', err?.config?.baseURL, err?.config?.url);
      console.log('data', err?.config?.data);
      Alert.alert(
        'pre로그인 실패',
        err?.message ?? '카카오 로그인 중 오류가 발생했어요.',
      );
    },
  });
};
