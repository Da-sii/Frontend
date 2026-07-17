import KakaoIcon from '@/assets/icons/ic_kakao.svg';
import LoginButton from '@/components/common/buttons/LoginButton';
import { isKakaoTalkLoginAvailable, login, me } from '@react-native-kakao/user';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { usePendingKakaoAuth } from '../../../store/usePendingKakaoAuth';
export default function KakaoLoginButton() {
  const router = useRouter();
  const setPending = usePendingKakaoAuth((s) => s.setPending);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isLoggingInRef = useRef(false);

  const onPressKakao = async () => {
    if (isLoggingInRef.current) return; // 중복 클릭 방지: 동시에 여러 인증 세션이 뜨면 PKCE 검증 에러가 남
    isLoggingInRef.current = true;
    setIsLoggingIn(true);

    try {
      const talkAvailable = await isKakaoTalkLoginAvailable();

      const kakao = await login({
        useKakaoAccountLogin: talkAvailable ? false : true,
      });

      if (!kakao.accessToken) throw new Error('카카오 로그인에 실패했어요.');

      const user = await me();

      setPending({
        kakaoEmail: user.email,
        kakaoAccessToken: kakao.accessToken,
        kakaoRefreshToken: kakao.refreshToken ?? null,
      });

      router.replace('/oauth');
    } catch (e: any) {
      // ✅ 유저 취소 케이스: 조용히 종료
      const msg = String(e?.message ?? '');
      const code = String(e?.code ?? '');

      if (
        msg.includes('canceled by user') ||
        msg.includes('cancelled') ||
        code === 'E_CANCELLED_OPERATION'
      ) {
        return;
      }

      // ❗ 그 외는 진짜 에러
      console.error('Kakao login failed:', e);
      // Alert.alert('로그인 실패', '카카오 로그인 중 오류가 발생했어요.');
    } finally {
      isLoggingInRef.current = false;
      setIsLoggingIn(false);
    }
  };

  return (
    <LoginButton
      label={'카카오로 로그인'}
      onPress={onPressKakao}
      color='bg-kakao'
      Icon={KakaoIcon}
      textColor='text-black'
      border='border-none'
      IconWidth={18}
      IconHeight={18}
      disabled={isLoggingIn}
    />
  );
}
