import AsyncStorage from '@react-native-async-storage/async-storage';
import { isKakaoTalkLoginAvailable, login, me } from '@react-native-kakao/user';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { postSocialPrelogin } from '../../../services/auth/prelogin';
import { usePendingKakaoAuth } from '../../../store/usePendingKakaoAuth';

const KAKAO_FLOW_KEY = 'kakao_flow';
const KAKAO_PRELOGIN_DONE_KEY = 'kakao_prelogin_done';
const KAKAO_IS_NEW_USER_KEY = 'kakao_is_new_user';

interface PreloginResponse {
  is_new_user: boolean;
}

export const useKakaoPrelogin = () => {
  const setPending = usePendingKakaoAuth((s) => s.setPending);

  return useMutation<PreloginResponse, unknown, void>({
    mutationFn: async () => {
      // ✅ 로그인 시작 표시
      await AsyncStorage.setItem(KAKAO_FLOW_KEY, 'in_progress');

      // 1) 카카오 로그인 (앱/웹)
      const talkAvailable = await isKakaoTalkLoginAvailable();
      const kakao = await login({
        // ✅ 카카오톡 앱로그인 가능한 경우엔 웹 로그인 강제 옵션을 꺼둔다
        useKakaoAccountLogin: talkAvailable ? false : true,
      });

      if (!kakao.accessToken) throw new Error('카카오 로그인에 실패했어요.');
      // 앱이면 여기서 /login으로 감

      // 2) 카카오 유저 정보 (웹만 진행됨)
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
    onSuccess: async (res) => {
      await AsyncStorage.setItem(KAKAO_PRELOGIN_DONE_KEY, 'true');
      await AsyncStorage.setItem(
        KAKAO_IS_NEW_USER_KEY,
        String(res.is_new_user),
      );
    },
    onError: async (err: any) => {
      await AsyncStorage.multiRemove([
        KAKAO_FLOW_KEY,
        KAKAO_PRELOGIN_DONE_KEY,
        KAKAO_IS_NEW_USER_KEY,
      ]);

      Alert.alert(
        'prelogin 실패, 다시 시도해주세요.',
        err?.message ?? '카카오 로그인 중 오류가 발생했어요.',
      );
    },
  });
};
