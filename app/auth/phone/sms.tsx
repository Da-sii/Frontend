import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { TextField } from '@/components/common/Inputs/TextField';
import { LongButton } from '@/components/common/buttons/LongButton';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import { useSendPhoneAuth, useVerifyAuthCode } from '@/hooks/auth/usePhoneAuth';
import { useVerificationComplete } from '@/hooks/auth/useVerificationComplete';
import { formatPhoneNumber } from '@/utils/validation';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Sms() {
  const { menu } = useLocalSearchParams<{ menu?: string }>();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [authNumber, setAuthNumber] = useState('');
  const [requestAuthNumber, setRequestAuthNumber] = useState(false);

  const [remainSec, setRemainSec] = useState(0);

  const EXPIRE_SECONDS = 180;

  const {
    handleVerified: onVerified,
    modalMessage,
    modalSecondMessage,
    setModalMessage,
    visibleModal,
    setVisibleModal,
  } = useVerificationComplete(menu, phone);

  const sendPhoneAuthMutation = useSendPhoneAuth({
    onSuccess: () => {
      setRequestAuthNumber(true);
      setRemainSec(EXPIRE_SECONDS);
    },
    onError: (err: any) =>
      console.error('[sendPhoneAuth error]', err?.response?.data),
  });

  const verifyAuthCodeMutation = useVerifyAuthCode({
    onSuccess: (data) => {
      onVerified(data.verification_token);
    },
    onError: () => {
      setModalMessage('인증번호가 일치하지 않습니다');
      setVisibleModal(true);
    },
  });

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

  const canSubmit = useMemo(() => {
    if (phone.length !== 11 || phone.slice(0, 3) !== '010') return false;
    if (requestAuthNumber) return authNumber.length === 6;
    return true;
  }, [phone, authNumber, requestAuthNumber]);

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
      verifyAuthCodeMutation.mutate({
        phoneNumber: phone,
        verificationCode: authNumber,
      });
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

    verifyAuthCodeMutation.reset();
    setAuthNumber('');
    setVisibleModal(false);

    sendPhoneAuthMutation.mutate(phone, {
      onSuccess: () => {
        setRequestAuthNumber(true);
        setRemainSec(EXPIRE_SECONDS);
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
        <Text className='text-h-lg font-n-eb text-gray-700 mb-[12px]'>
          휴대폰 본인 인증
        </Text>
        {menu === 'signUp' ? (
          <>
            <Text className='text-b-md font-n-bd text-gray-700 mb-[8px]'>
              계정 생성 후,
            </Text>
            <Text className='text-b-md font-n-bd text-gray-700 mb-[25px]'>
              휴대폰 본인인증을 완료하면 가입이 완료됩니다.
            </Text>
          </>
        ) : (
          <>
            <Text className='text-b-md font-n-bd text-gray-700 mb-[25px]'>
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
            disabled={!canSubmit || isLoading}
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
        onConfirm={() => {
          setVisibleModal(false);
          router.replace('/auth/signUp');
        }}
        onCancel={() => setVisibleModal(false)}
        message={modalMessage}
        secondMessage={modalSecondMessage}
        confirmText='회원가입'
        cancelText='취소'
      />
    </SafeAreaView>
  );
}
