import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { TextField } from '@/components/common/Inputs/TextField';
import Navigation from '@/components/layout/Navigation';
import {
  hasPasswordComposition,
  isEmail,
  isLen8to20,
  isSamePassword,
} from '@/utils/validation';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { useSignupDraft } from '@/store/useSignupDraft';
import { usePasswordReset } from '@/store/usePasswordReset';
import { useResetPassword } from '@/hooks/auth/useFindAccount';
export default function change() {
  const router = useRouter();
  const { email, verificationToken, clear } = usePasswordReset();
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [validNew, setValidNew] = useState(false);
  const [matchConfirm, setMatchConfirm] = useState(false);

  // 이메일 형식 체크
  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const resetPasswordMutation = useResetPassword({
    onSuccess: () => {
      clear();
      router.replace('/mypage/completion?action=password');
    },
  });

  useEffect(() => {
    if (!validateEmail(email)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  }, [email]);

  const handleSubmit = () => {
    resetPasswordMutation.mutate({
      email,
      new_password1: newPwd,
      new_password2: confirmPwd,
      verification_token: verificationToken!,
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
          비밀번호 변경
        </Text>
        <Text className='text-b-md font-bold text-gray-700 mb-[8px]'>
          새로운 비밀번호를 입력해주세요.
        </Text>

        <View className='mt-[25px] mb-[25px]'>
          <View className='mb-[18px]'>
            <TextField
              menu={1}
              value={newPwd}
              onChangeText={setNewPwd}
              placeholder='비밀번호를 입력해주세요.'
              firstMessage='8-20자 이내'
              secondMessage='영문, 숫자, 특수문자 포함'
              validateFirst={isLen8to20}
              validateSecond={hasPasswordComposition}
            />
          </View>
          <View>
            <TextField
              menu={1}
              value={confirmPwd}
              onChangeText={setConfirmPwd}
              placeholder='비밀번호를 입력해주세요.'
              firstMessage='비밀번호 일치'
              validateFirst={() => isSamePassword(newPwd, confirmPwd)}
            />
          </View>
        </View>
        <View className='mb-[25px]'>
          <LongButton
            label={
              resetPasswordMutation.isPending ? '변경 중...' : '비밀번호 변경'
            }
            onPress={handleSubmit}
            disabled={
              newPwd.length === 0 ||
              confirmPwd.length === 0 ||
              !isSamePassword(newPwd, confirmPwd) ||
              !isLen8to20(newPwd) ||
              !isLen8to20(confirmPwd) ||
              !hasPasswordComposition(newPwd) ||
              !hasPasswordComposition(confirmPwd)
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
