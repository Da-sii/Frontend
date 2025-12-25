import { setTokens } from '@/lib/authToken';
import { axiosInstance } from '@/services/index';
import appleAuth from '@invertase/react-native-apple-authentication';
import { router } from 'expo-router';
import { Alert } from 'react-native';

async function handleSignInApple() {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      const identityToken = appleAuthRequestResponse.identityToken;

      if (!identityToken) {
        console.error('Apple 로그인 응답에 identityToken이 없습니다.');
        Alert.alert('오류', 'Apple 로그인 정보를 가져오지 못했습니다.');
        return null;
      }

      try {
        const backendResponse = await axiosInstance.post('/auth/apple/', {
          identityToken: identityToken,
        });

        setTokens(backendResponse.data.access);
        router.replace('/home');
      } catch (backendError: any) {
        console.error(
          '백엔드 Apple 로그인 실패:',
          backendError.response?.data || backendError.message,
        );
        Alert.alert('애플로그인 실패', '서버 통신 중 오류가 발생했습니다.');
        return null;
      }
    }
    return null;
  } catch (error: any) {
    if (error.code === appleAuth.Error.CANCELED) {
      // console.log('사용자가 Apple 로그인을 취소했습니다.');
    } else if (error.code === appleAuth.Error.UNKNOWN) {
      console.error('Apple 로그인 에러 (1000):', error);
      Alert.alert(
        'Apple 로그인 설정에 실패했습니다. Xcode에서 "Sign in with Apple" Capability를 확인하세요.',
      );
    } else {
      console.error('Apple 로그인 에러:', error);
      Alert.alert('로그인 오류', 'Apple 로그인 중 문제가 발생했습니다.'); // 사용자 친화적 메시지
    }
    return null;
  }
}

export const useAppleLogin = () => {
  return handleSignInApple;
};
