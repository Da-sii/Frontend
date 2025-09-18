import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import Navigation from '@/components/layout/Navigation';
import { Stack, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { useState } from 'react';
import { TextField } from '@/components/common/Inputs/TextField';
import { LongButton } from '@/components/common/buttons/LongButton';
import { useMemo } from 'react';
import DefaultModal from '@/components/common/modals/DefaultModal';
import { useSignup } from '@/hooks/useSignUp';
import { useSignupDraft } from '@/store/useSignupDraft';
export default function Index() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [authNumber, setAuthNumber] = useState('');
  const [requestAuthNumber, setRequestAuthNumber] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);

  const { email, password, confirmPassword, clear } = useSignupDraft();
  const MOCK_AUTH_NUMBER = '123456';

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    if (digits.length <= 3) return digits; // 010
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`; // 010-0000
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const checkAuthNumber = (authNumber: string) => {
    return authNumber === MOCK_AUTH_NUMBER;
  };
  const signupMutation = useSignup({
    onSuccess: () => {
      clear();
      router.replace('/auth/signUp/result');
    },
  });

  const canSubmit = useMemo(() => {
    if (phone.length !== 11 || phone.slice(0, 3) !== '010') {
      setDisabledButton(true);
      return false;
    }
    if (requestAuthNumber) {
      if (authNumber.length !== 6) {
        setDisabledButton(true);
        return false;
      }
    }
    setDisabledButton(false);
    return true;
  }, [phone, authNumber, requestAuthNumber]);

  const onVerified = () => {
    signupMutation.mutate({
      email,
      password,
      password2: confirmPassword,
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
        <Text className='text-b-md font-bold text-gray-700 mb-[8px]'>
          계정 생성 후,
        </Text>
        <Text className='text-b-md font-bold text-gray-700 mb-[25px]'>
          휴대폰 본인인증을 완료하면 가입이 완료됩니다.
        </Text>

        <TextField
          menu={1}
          value={formatPhoneNumber(phone)}
          onChangeText={(text) =>
            setPhone(text.replace(/\D/g, '').slice(0, 11))
          }
          placeholder='휴대폰 번호를 입력해주세요.'
          keyboardType='number-pad'
          disabled={requestAuthNumber}
        />
        {requestAuthNumber && (
          <TextField
            menu={1}
            value={authNumber}
            onChangeText={(text) =>
              setAuthNumber(text.replace(/\D/g, '').slice(0, 6))
            }
            placeholder='인증번호를 입력해주세요.'
            keyboardType='number-pad'
          />
        )}
        <View className='mt-[30px]'>
          <LongButton
            label={requestAuthNumber ? '본인 인증 완료' : '인증 번호 요청'}
            onPress={() => {
              // router.push('/auth/find/id/result');
              if (requestAuthNumber) {
                // 인증번호 확인
                if (checkAuthNumber(authNumber)) {
                  onVerified();
                } else {
                  setVisibleModal(true);
                }
              } else {
                setRequestAuthNumber(true);
              }
            }}
            disabled={disabledButton || !canSubmit}
          />
        </View>
      </View>
      <DefaultModal
        visible={visibleModal}
        onConfirm={() => setVisibleModal(false)}
        onCancel={() => setVisibleModal(false)}
        // title='인증번호가 일치하지 않습니다.'
        message='인증번호가 일치하지 않습니다'
        confirmText='확인'
        singleButton
      />
    </SafeAreaView>
  );
}
