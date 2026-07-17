// hooks/auth/useVerificationComplete.ts
import { useFindIDWithPhone } from '@/hooks/auth/useFindAccount';
import { useSignup } from '@/hooks/useSignUp';
import { useFoundAccounts } from '@/store/useFoundAccounts';
import { usePasswordReset } from '@/store/usePasswordReset';
import { useSignupDraft } from '@/store/useSignupDraft';
import { formatPhoneNumber } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useState } from 'react';

/**
 * 휴대폰 본인인증(SMS 인증번호 / 옥토모 발신 인증 공통) 완료 후
 * menu(signUp/findPassword/findId)에 따라 다음 단계로 분기하는 로직.
 * app/auth/phone/sms.tsx, app/auth/phone/index.tsx 에서 공유합니다.
 */
export const useVerificationComplete = (
  menu: string | undefined,
  phone: string,
) => {
  const router = useRouter();
  const { email, password, confirmPassword, clear: clearSignupDraft } =
    useSignupDraft();
  const { setVerificationToken: setResetPwToken } = usePasswordReset();
  const setAccountPhone = useFoundAccounts((s) => s.setFound);
  const { refetch: refetchFindId } = useFindIDWithPhone(phone, {
    enabled: false,
  });

  const [modalMessage, setModalMessage] = useState(
    '인증 번호가 일치하지 않습니다',
  );
  const [modalSecondMessage, setModalSecondMessage] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);

  const signupMutation = useSignup({
    onSuccess: () => {
      clearSignupDraft();
      router.replace('/auth/signUp/result');
    },
  });

  const handleVerified = async (token?: string) => {
    if (menu === 'signUp') {
      signupMutation.mutate({
        email,
        password,
        password2: confirmPassword,
        phoneNumber: phone,
      });
    } else if (menu === 'findPassword') {
      if (!token) {
        setModalMessage('인증 토큰을 확인할 수 없습니다. 다시 시도해 주세요.');
        setVisibleModal(true);
        return;
      }
      setResetPwToken(token);
      router.replace('/auth/find/password/change');
    } else if (menu === 'findId') {
      const { data: res } = await refetchFindId();

      if (res?.message === '해당 핸드폰번호로 등록된 계정이 없습니다.') {
        setModalMessage('계정을 찾을 수 없습니다.');
        setModalSecondMessage(
          '해당 정보로 가입된 계정을 찾을 수 없습니다. 다시 한번 확인해주시거나, 회원가입을 진행해 주세요',
        );
        setVisibleModal(true);
        return;
      }
      setAccountPhone(formatPhoneNumber(phone), res?.accounts || []);
      router.push({ pathname: '/auth/find/id/result' });
    }
  };

  return {
    handleVerified,
    isSigningUp: signupMutation.isPending,
    modalMessage,
    modalSecondMessage,
    setModalMessage,
    setModalSecondMessage,
    visibleModal,
    setVisibleModal,
  };
};
