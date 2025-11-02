import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { TextField } from '@/components/common/Inputs/TextField';
import Navigation from '@/components/layout/Navigation';
import { useResetPassword } from '@/hooks/auth/useFindAccount';
import { usePasswordReset } from '@/store/usePasswordReset';
import {
  hasPasswordComposition,
  isLen8to20,
  isSamePassword,
} from '@/utils/validation';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function change() {
  const router = useRouter();
  const { email, verificationToken, clear } = usePasswordReset();

  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const resetPasswordMutation = useResetPassword({
    onSuccess: () => {
      clear();
      router.replace('/mypage/completion?action=password');
    },
  });

  const handleSubmit = () => {
    resetPasswordMutation.mutate({
      email,
      new_password1: newPwd,
      new_password2: confirmPwd,
      verification_token: verificationToken!,
    });
  };

  const canSubmit =
    isLen8to20(newPwd) &&
    hasPasswordComposition(newPwd) &&
    isSamePassword(newPwd, confirmPwd);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='p-5'>
        <Text className='text-h-lg font-n-eb text-gray-700 mb-[12px]'>
          비밀번호 변경
        </Text>
        <Text className='text-b-md font-n-bd text-gray-700 mb-[8px]'>
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
            disabled={!canSubmit || resetPasswordMutation.isPending}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
