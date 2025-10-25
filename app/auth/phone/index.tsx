import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { TextField } from '@/components/common/Inputs/TextField';
import { LongButton } from '@/components/common/buttons/LongButton';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import { useFindIDWithPhone } from '@/hooks/auth/useFindAccount';
import {
  useSendPhoneAuth,
  useVerifyAuthCode,
  useVerifyAuthToken,
} from '@/hooks/auth/usePhoneAuth';
import { useSignup } from '@/hooks/useSignUp';
import { useFoundAccounts } from '@/store/useFoundAccounts';
import { usePasswordReset } from '@/store/usePasswordReset';
import { useSignupDraft } from '@/store/useSignupDraft';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

export default function Index() {
  const { menu } = useLocalSearchParams<{ menu?: string }>();
  const router = useRouter();
  const { setVerificationToken: setResetPwToken } = usePasswordReset();

  const [phone, setPhone] = useState('');
  const [authNumber, setAuthNumber] = useState('');
  const [requestAuthNumber, setRequestAuthNumber] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [modalSecondMessage, setModalSecondMessage] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null,
  );
  const [singleButton, setSingleButton] = useState(true);
  const setAccountPhone = useFoundAccounts((s) => s.setFound);

  const [remainSec, setRemainSec] = useState(0);

  const [modalMessage, setModalMessage] =
    useState('인증 번호가 일치하지 않습니다');
  const EXPIRE_SECONDS = 180;

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    if (digits.length <= 3) return digits; // 010
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`; // 010-0000
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const { email, password, confirmPassword, clear } = useSignupDraft();
  const {
    data: findData,
    refetch: refetchFindId,
    isFetching: isFinding,
  } = useFindIDWithPhone(phone, { enabled: false });
  // 1) 인증번호 발송 훅
  const sendPhoneAuthMutation = useSendPhoneAuth({
    onSuccess: (res) => {
      setRequestAuthNumber(true); // 입력창 열기
      setRemainSec(180); // 5분
    },
    onError: (err: any) =>
      console.error('[sendPhoneAuth error]', err?.response?.data),
  });

  // 2) 인증번호 검증 훅
  const verifyAuthCodeMutation = useVerifyAuthCode({
    onSuccess: (data) => {
      const token = data.verification_token;
      setVerificationToken(token);
      setResetPwToken(token);
      onVerified(token);
    },
    onError: () => {
      setModalMessage('인증번호가 일치하지 않습니다');
      setVisibleModal(true); // "인증번호 불일치" 모달
    },
  });
  // (선택) 3) 토큰 검증 훅 — 필요 시 사용
  const verifyAuthTokenMutation = useVerifyAuthToken();

  // 카운트다운
  useEffect(() => {
    if (!requestAuthNumber || remainSec <= 0) return;
    const id = setInterval(() => setRemainSec((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [requestAuthNumber, remainSec]);

  useEffect(() => {
    if (!requestAuthNumber) return;
    if (remainSec === 0) {
      // 단계 롤백 + 입력 초기화
      setRequestAuthNumber(false); // 번호 입력 단계로 돌아감
      setAuthNumber('');
      setVerificationToken(null);
      // 필요하면 안내 모달/토스트
      setModalMessage(
        '인증번호 유효시간이 만료되었습니다.\n다시 요청해 주세요.',
      );
      setVisibleModal(true);
    }
  }, [requestAuthNumber, remainSec]);

  const remainText = useMemo(() => {
    const m = Math.floor(remainSec / 60);
    const s = String(remainSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, [remainSec]);

  const signupMutation = useSignup({
    onSuccess: () => {
      clear();
      router.replace('/auth/signUp/result');
    },
  });

  const canSubmit = useMemo(() => {
    if (phone.length !== 11 || phone.slice(0, 3) !== '010') return false;
    if (requestAuthNumber) return authNumber.length === 6;
    return true;
  }, [phone, authNumber, requestAuthNumber]);

  const onVerified = async (token?: string) => {
    if (menu === 'signUp') {
      signupMutation.mutate({
        email,
        password,
        password2: confirmPassword,
        phoneNumber: phone,
      });
    } else if (menu === 'findPassword') {
      setPhone(phone);
      if (!token) {
        setModalMessage('인증 토큰을 확인할 수 없습니다. 다시 시도해 주세요.');
        setVisibleModal(true);
        return;
      }
      setResetPwToken(token);
      router.replace('/auth/find/password/change');
      return;
      // router.push('/auth/find/result');
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

      // ✅ 결과 페이지로 전달 (예: params 또는 state)
      router.push({
        pathname: '/auth/find/id/result',
      });
    }
  };

  const isLoading =
    sendPhoneAuthMutation.isPending || verifyAuthCodeMutation.isPending;

  const handlePress = () => {
    if (requestAuthNumber) {
      // ⛔️ 만료 시 검증 막고 모달
      if (remainSec <= 0) {
        setModalMessage(
          '인증번호 유효시간이 만료되었습니다.\n다시 요청해 주세요.',
        );
        setVisibleModal(true);
        return;
      }
      // 인증번호 검증 단계
      verifyAuthCodeMutation.mutate({
        phoneNumber: phone, // 하이픈 제거 숫자만
        verificationCode: authNumber, // 6자리
      });

      // (선택) 토큰을 따로 서버가 검증하라면:
      // verifyAuthTokenMutation.mutate(verificationToken!)
    } else {
      // 인증번호 발송 단계
      sendPhoneAuthMutation.mutate(phone); // 숫자만 전달
    }
  };

  const handleResend = () => {
    if (!phone || phone.length !== 11) {
      setModalMessage('휴대폰 번호를 올바르게 입력해 주세요.');
      setVisibleModal(true);
      return;
    }

    // 이전 시도 상태 초기화
    verifyAuthCodeMutation.reset();
    setAuthNumber('');
    setVerificationToken(null);
    setVisibleModal(false);

    // 재전송
    sendPhoneAuthMutation.mutate(phone, {
      onSuccess: (res) => {
        setRequestAuthNumber(true);
        setRemainSec(EXPIRE_SECONDS); // 서버값 있으면 사용
      },
    });
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='p-5'>
        <Text className='text-h-lg font-extrabold text-gray-700 mb-[12px]'>
          휴대폰 본인 인증
        </Text>
        {menu === 'signUp' ? (
          <>
            <Text className='text-b-md font-bold text-gray-700 mb-[8px]'>
              계정 생성 후,
            </Text>
            <Text className='text-b-md font-bold text-gray-700 mb-[25px]'>
              휴대폰 본인인증을 완료하면 가입이 완료됩니다.
            </Text>
          </>
        ) : (
          <>
            <Text className='text-b-md font-bold text-gray-700 mb-[25px]'>
              입력하신 정보는 본인 확인을 위해서만 사용됩니다.
            </Text>
          </>
        )}

        {/* 휴대폰 번호 */}
        <TextField
          menu={1}
          value={formatPhoneNumber(phone)}
          onChangeText={(text) =>
            setPhone(text.replace(/\D/g, '').slice(0, 11))
          }
          placeholder='휴대폰 번호를 입력해주세요.'
          keyboardType='number-pad'
          disabled={requestAuthNumber || isLoading}
        />

        {/* 인증번호 입력 (발송 후에만 노출) */}
        {requestAuthNumber && (
          <>
            <TextField
              menu={1}
              value={authNumber}
              onChangeText={(text) =>
                setAuthNumber(text.replace(/\D/g, '').slice(0, 6))
              }
              placeholder='인증번호를 입력해주세요.'
              keyboardType='number-pad'
              disabled={isLoading}
            />
            {authNumber.length < 6 && (
              <View className=' ml-[17px]'>
                <Text className='text-c2 text-[#FF3A4A]'>
                  유효시간 {remainText}
                </Text>
              </View>
            )}
          </>
        )}

        <View className='mt-[25px]'>
          <LongButton
            label={
              isLoading
                ? '처리 중...'
                : requestAuthNumber
                  ? '본인 인증 완료'
                  : '인증 번호 요청'
            }
            onPress={handlePress}
            disabled={disabledButton || !canSubmit || isLoading}
          />
        </View>
      </View>
      {requestAuthNumber && (
        <View className='flex-row items-center justify-center'>
          <View className='flex-row '>
            <Text className='text-b-sm font-bold text-gray-500 mr-2'>
              인증번호를 받지 못하셨나요?
            </Text>
            <Pressable onPress={handleResend}>
              <Text className='text-b-md font-extrabold text-[#19B375]'>
                재전송
              </Text>
            </Pressable>
          </View>
        </View>
      )}
      <DefaultModal
        visible={visibleModal}
        onConfirm={() => setVisibleModal(false)}
        onCancel={() => setVisibleModal(false)}
        message={modalMessage}
        secondMessage={modalSecondMessage}
        confirmText='확인'
        cancelText='취소'
        singleButton={singleButton}
      />
    </SafeAreaView>
  );
}
