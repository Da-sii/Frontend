import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { TextField } from '@/components/common/Inputs/TextField';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import { useCheckEmailExists } from '@/hooks/auth/useCheckExistsEmail';
import { usePasswordReset } from '@/store/usePasswordReset';
import { isEmail } from '@/utils/validation';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();

  const { email, setEmail, clear } = usePasswordReset();
  const [visibleModal, setVisibleModal] = useState(false);

  const { mutate: checkEmail, isPending } = useCheckEmailExists({
    onSuccess: (res) => {
      if (res.exists) {
        router.push('/auth/phone?menu=findPassword');
      } else {
        setVisibleModal(true);
      }
    },
    onError: (err) => {
      const msg =
        // @ts-ignore
        err?.response?.data?.message || '이메일 확인 중 오류가 발생했습니다.';
    },
  });

  useEffect(() => {
    clear();
  }, [clear]);

  const handlePhoneAuthPress = () => {
    checkEmail({ email });
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
          비밀번호 변경
        </Text>
        <Text className='text-b-md font-n-bd text-gray-700 mb-[8px]'>
          가입하신 이메일을 입력해주세요.
        </Text>
        <Text className='text-b-md font-n-bd text-gray-700 mb-[25px]'>
          휴대폰 인증을 통해 비밀번호를 변경할 수 있습니다.
        </Text>

        <View className='mb-[30px]'>
          <TextField
            menu={2}
            value={email}
            onChangeText={setEmail}
            placeholder='이메일 (abc@dasii.com)'
            firstMessage='이메일 형식'
            validateFirst={isEmail}
          />
        </View>
        <View className='mb-[25px]'>
          <LongButton
            label={isPending ? '확인 중...' : '휴대폰 본인인증'}
            onPress={handlePhoneAuthPress}
            disabled={!isEmail(email) || isPending}
          />
        </View>
        <View className='flex-row items-center justify-center mt-[10px]'>
          <Text className='text-b-sm font-n-bd text-gray-500'>
            이메일을 잊으셨나요?
          </Text>
          <Pressable
            onPress={() => {
              router.push('/auth/find/id');
            }}
          >
            <Text className='text-b-md font-n-eb text-[#19B375] ml-1'>
              계정 찾기
            </Text>
          </Pressable>
        </View>
      </View>
      {visibleModal && (
        <DefaultModal
          visible={visibleModal}
          onConfirm={() => {
            setVisibleModal(false);
            router.push('/auth/signUp');
          }}
          onCancel={() => setVisibleModal(false)}
          title='계정을 찾을 수 없습니다.'
          message='해당 정보로 가입된 계정을 찾을 수 없습니다.'
          secondMessage='다시 한번 확인해주시거나, 회원가입을 진행해주세요.'
          confirmText='회원가입'
          cancelText='처음으로'
        />
      )}
    </SafeAreaView>
  );
}
