import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { TextField } from '@/components/common/Inputs/TextField';
import { LongButton } from '@/components/common/buttons/LongButton';
import Navigation from '@/components/layout/Navigation';
import { formatPhoneNumber, isValidPhoneNumber } from '@/utils/validation';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { menu } = useLocalSearchParams<{ menu?: string }>();
  const router = useRouter();

  const [phone, setPhone] = useState('');

  const onPressNext = () => {
    if (!isValidPhoneNumber(phone)) return;
    router.push({ pathname: '/auth/phone/octomo', params: { phone, menu } });
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
      />

      <View className='flex-1 p-5'>
        <Text className='text-h-lg font-n-eb text-gray-700 mb-[12px]'>
          휴대폰 본인확인
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
          <Text className='text-b-md font-n-bd text-gray-700 mb-[25px]'>
            입력하신 정보는 본인 확인을 위해서만 사용됩니다.
          </Text>
        )}

        <TextField
          menu={1}
          value={formatPhoneNumber(phone)}
          onChangeText={(text) =>
            setPhone(text.replace(/\D/g, '').slice(0, 11))
          }
          placeholder='휴대폰 번호를 입력해주세요.'
          keyboardType='number-pad'
        />
      </View>

      <View className='p-5'>
        <LongButton
          label='다음'
          onPress={onPressNext}
          disabled={!isValidPhoneNumber(phone)}
        />
      </View>
    </SafeAreaView>
  );
}
