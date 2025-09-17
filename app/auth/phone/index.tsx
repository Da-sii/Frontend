import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import Navigation from '@/components/layout/Navigation';
import { Stack, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { useState } from 'react';
import { TextField } from '@/components/common/Inputs/TextField';
import { LongButton } from '@/components/common/buttons/LongButton';
import { useMemo } from 'react';
export default function Index() {
  const router = useRouter();

  const [phone, setPhone] = useState('');

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    if (digits.length <= 3) return digits; // 010
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`; // 010-0000
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const canSubmit = useMemo(() => {
    if (phone.length !== 11) return false;
    if (phone.slice(0, 3) !== '010') return false;
    return true;
  }, [phone]);

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
        />
        <View className='mt-[30px]'>
          <LongButton
            label='인증 번호 요청'
            onPress={() => {
              router.push('/auth/find/id/result');
            }}
            disabled={!canSubmit}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
