// components/page/login/kakaoLogin.tsx
import LoginButton from '@/components/common/buttons/LoginButton';
import KakaoIcon from '@/assets/icons/ic_kakao.svg';
import { useKakaoLogin } from '@/hooks/useKakaoLogin';
import { useRouter } from 'expo-router';
import { useState } from 'react';

type Props = {
  onPress: () => void;
};
export default function LoginScreen({ onPress }: Props) {
  const [showWV, setShowWV] = useState(false);
  const router = useRouter();
  const kakaoLogin = useKakaoLogin({
    onSuccess: () => router.replace('/home'),
  });

  return (
    <>
      <LoginButton
        label={kakaoLogin.isPending ? '로그인 중...' : '카카오로 로그인'}
        onPress={onPress}
        color='bg-kakao'
        Icon={KakaoIcon}
        textColor='text-black'
        border='border-none'
        IconWidth={18}
        IconHeight={18}
      />
      {/* <KakaoLoginWebView visible={showWV} onClose={() => setShowWV(false)} /> */}
    </>
  );
}
// app/auth/login/index.tsx (발췌)
// import LoginButton from '@/components/common/buttons/LoginButton';
// import KakaoIcon from '@/assets/icons/ic_kakao.svg';
// import { useKakaoLogin } from '@/hooks/useKakaoLogin';
// import { useRouter } from 'expo-router';
// import { startKakaoLogin } from '@/lib/kakaoAuth';

// export default function LoginScreen() {
//   const router = useRouter();
//   useKakaoLogin(); // Linking 이벤트 리스너 등록

//   const handleKakaoLogin = async () => {
//     try {
//       await startKakaoLogin();
//     } catch (error) {
//       console.error('카카오 로그인 실패:', error);
//     }
//   };

//   return (
//     <LoginButton
//       label='카카오로 로그인'
//       onPress={handleKakaoLogin}
//       color='bg-kakao'
//       Icon={KakaoIcon}
//       textColor='text-black'
//       border='border-none'
//       IconWidth={18}
//       IconHeight={18}
//     />
//   );
// }
