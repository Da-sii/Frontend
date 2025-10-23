import appleAuth from '@invertase/react-native-apple-authentication';

async function handleSignInApple() {
  try {
    // 1. 로그인 요청
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    // 2. 인증 상태 가져오기
    // (실제 기기에서만 테스트해야 함)
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // 3. 인증 완료 확인
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // 인증 성공!
      console.log('Apple 로그인 성공:', appleAuthRequestResponse);
      return appleAuthRequestResponse; // 성공 시 결과 반환
    }

    // 인증되었지만 상태가 정상이 아닐 수 있음
    return null;
  } catch (error: any) {
    // 4. 에러 처리
    if (error.code === appleAuth.Error.CANCELED) {
      // error.code '1001' - 사용자가 '취소' 버튼을 누름
      console.log('사용자가 Apple 로그인을 취소했습니다.');
    } else if (error.code === appleAuth.Error.UNKNOWN) {
      // error.code '1000' - 알 수 없는 에러 (아마도 Capability 문제)
      console.error('Apple 로그인 에러 (1000):', error);
      alert(
        'Apple 로그인 설정에 실패했습니다. Xcode에서 "Sign in with Apple" Capability를 확인하세요.',
      );
    } else {
      // 기타 에러
      console.error('Apple 로그인 에러:', error);
    }
    return null; // 실패 시 null 반환
  }
}

export const useAppleLogin = () => {
  return handleSignInApple;
};
