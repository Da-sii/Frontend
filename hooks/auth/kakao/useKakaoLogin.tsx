import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { setTokens } from '../../../lib/authToken';
import {
  KakaoSignInResponse,
  signInWithKakao,
} from '../../../services/auth/signInWithKakao';
import { usePendingKakaoAuth } from '../../../store/usePendingKakaoAuth';

export const useKakaoLogin = () => {
  const { kakaoAccessToken, kakaoRefreshToken, clear } = usePendingKakaoAuth();

  return useMutation<KakaoSignInResponse, unknown, void>({
    mutationFn: async () => {
      if (!kakaoAccessToken || !kakaoRefreshToken) {
        throw new Error('카카오 인증 정보가 없어요. 다시 로그인해 주세요.');
      }

      // 1) 우리 서버 로그인
      const data = await signInWithKakao(kakaoAccessToken, kakaoRefreshToken);
      console.log('서버 로그인 성공');

      // 2) 우리 서비스 access 토큰 저장
      if (!data.access) {
        throw new Error('서버에서 액세스 토큰을 받지 못했어요.');
      }

      await setTokens(data.access);

      clear();
      await AsyncStorage.removeItem('pendingAgreement');
      return data;
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        '로그인 중 오류가 발생했어요.';
      Alert.alert('카카오 로그인 실패', msg);
    },
  });
};
