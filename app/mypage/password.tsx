import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { TextField } from '@/components/common/Inputs/TextField';
import Navigation from '@/components/layout/Navigation';
import { useUser } from '@/hooks/useUser';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangePassword() {
  const router = useRouter();
  const { updatePassword, isLoading, verifyCurrentPassword } = useUser();

  const [step, setStep] = useState<'current' | 'new'>('current');

  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');

  const [currentPwdValid, setCurrentPwdValid] = useState<boolean | undefined>(
    undefined,
  );
  const [validNew, setValidNew] = useState(false);
  const [matchConfirm, setMatchConfirm] = useState(false);

  useEffect(() => {
    const regex = new RegExp(
      '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:\\";\'<>?,./]).{8,20}$',
    );
    setValidNew(regex.test(newPwd));
    setMatchConfirm(newPwd === confirmPwd && confirmPwd.length > 0);
  }, [newPwd, confirmPwd]);

  const isNextDisabled = currentPwd.length === 0 || currentPwdValid === false;
  const isSubmitDisabled = !(validNew && matchConfirm);
  const disabled = step === 'current' ? isNextDisabled : isSubmitDisabled;

  const isLen8to20 = (text: string) => {
    return text.length >= 8 && text.length <= 20;
  };

  const hasPasswordComposition = (text: string) => {
    const regex = new RegExp(
      '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:\\";\'<>?,./]).{8,20}$',
    );
    return regex.test(text);
  };

  const handleSubmit = () => {
    if (!disabled) {
      updatePassword({
        current_password: currentPwd,
        new_password1: newPwd,
        new_password2: confirmPwd,
      });
      router.replace('/mypage/completion?action=password');
    }
  };

  const handlePressNextOrSubmit = async () => {
    if (disabled || isLoading) return;

    if (step === 'current') {
      const data = await verifyCurrentPassword({
        current_password: currentPwd,
      });
      if (data?.valid === true) {
        setStep('new');
        setCurrentPwdValid(true);
      } else {
        setCurrentPwdValid(false);
      }
    } else if (step === 'new') {
      handleSubmit();
    }
  };

  const handleVerifyPassword = async () => {
    if (!currentPwd) {
      setCurrentPwdValid(undefined);
      return;
    }

    try {
      const data = await verifyCurrentPassword({
        current_password: currentPwd,
      });
      setCurrentPwdValid(data?.valid === true);
    } catch (error) {
      console.error('비밀번호 검증 실패:', error);
      setCurrentPwdValid(false);
    }
  };

  // 3. TextField로 전달할 유효성 검사 함수
  const isCurrentPwdValid = (text: string): boolean => {
    if (text.length === 0) return false;

    // 아직 검증 전(undefined)이면, 에러를 표시하지 않기 위해 true를 반환 (또는 원하는 초기 동작 설정)
    if (currentPwdValid === undefined) return true;

    // 검증 후에는 실제 결과(true 또는 false)를 반환
    return currentPwdValid;
  };
  return (
    <SafeAreaView className='flex-1 bg-white px-2'>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.push('/mypage')}
        title='비밀번호 변경'
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 px-4 py-3'
      >
        {step === 'new' && (
          <View className='mb-2'>
            <View>
              <Text className='mb-3 font-n-bd'>
                새로운 비밀번호를 입력해주세요
              </Text>
            </View>

            <View className='mb-3'>
              <TextField
                menu={1}
                value={newPwd}
                onChangeText={setNewPwd}
                secureTextEntry={true}
                placeholder='새로운 비밀번호를 입력해주세요'
                firstMessage='8-20자 이내'
                secondMessage='영문, 숫자, 특수문자 포함'
                validateFirst={isLen8to20}
                validateSecond={hasPasswordComposition}
                maxLength={20}
              />
            </View>

            <View className='mb-3'>
              <TextField
                menu={1}
                value={confirmPwd}
                onChangeText={setConfirmPwd}
                secureTextEntry={true}
                placeholder='새로운 비밀번호를 다시 입력해주세요'
                firstMessage='비밀번호 일치'
                validateFirst={isLen8to20}
                maxLength={20}
              />
            </View>
          </View>
        )}

        {step === 'current' && (
          <View className='mb-6'>
            <View>
              <Text className='mb-3 font-n-bd'>
                현재 비밀번호를 입력해주세요
              </Text>
            </View>

            <TextField
              menu={1}
              value={currentPwd}
              onChangeText={setCurrentPwd}
              secureTextEntry={true}
              placeholder='현재 비밀번호를 다시 입력해주세요'
              firstMessage='비밀번호 일치'
              validateFirst={isCurrentPwdValid}
              maxLength={20}
              onBlur={handleVerifyPassword}
            />
          </View>
        )}

        <LongButton
          label={step === 'current' ? '다음' : '비밀번호 변경'}
          onPress={handlePressNextOrSubmit}
          disabled={disabled || isLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
