// hooks/useKakaoLogin.ts
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import {
  signInWithKakao,
  KakaoSignInResponse,
} from '../services/auth/signInWithKakao';
import { setTokens } from '../lib/authToken';
import { useRouter } from 'expo-router';

export const useKakaoLogin = () => {
  const router = useRouter();
  return useMutation<KakaoSignInResponse, unknown, string>({
    mutationFn: async (code: string) => {
      const res = await signInWithKakao(code);
      return res;
    },
    onSuccess: async (data) => {
      await setTokens(data.access, data.refresh);
      router.replace('/home');
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        '로그인 중 오류가 발생했어요.';
      Alert.alert('로그인 실패', msg);
    },
  });
};
