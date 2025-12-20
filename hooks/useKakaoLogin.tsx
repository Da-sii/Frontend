import { login } from '@react-native-kakao/user';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { setTokens } from '../lib/authToken';
import {
  KakaoSignInResponse,
  signInWithKakao,
} from '../services/auth/signInWithKakao';

export const useKakaoLogin = () => {
  return useMutation<KakaoSignInResponse, unknown, void>({
    mutationFn: async () => {
      // 1) 카카오 네이티브 로그인
      const kakao = await login();
      const kakaoAccessToken = kakao.accessToken;
      const kakaoRefreshToken = kakao.refreshToken;

      console.log('kakaoRefreshToken:', kakaoRefreshToken);
      console.log('kakaoAccessToken:', kakaoAccessToken);

      if (!kakaoAccessToken) {
        throw new Error('카카오 로그인에 실패했어요. 다시 시도해 주세요.');
      }

      // 2) 우리 서버 로그인
      const data = await signInWithKakao(kakaoAccessToken, kakaoRefreshToken);

      // 3) 우리 서비스 access 토큰 저장
      if (data.access) {
        await setTokens(data.access);
      } else {
        throw new Error('서버에서 액세스 토큰을 받지 못했어요.');
      }

      // 4) 응답 전체를 onSuccess 쪽에서 쓰게 리턴
      return data;
    },
    onError: (err: any) => {
      console.log('Kakao login error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        '로그인 중 오류가 발생했어요.';
      Alert.alert('로그인 실패', msg);
    },
  });
};
