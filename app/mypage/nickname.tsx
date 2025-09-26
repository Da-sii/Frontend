import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { TextField } from '@/components/common/Inputs/TextField';
import Navigation from '@/components/layout/Navigation';
import { useUser } from '@/hooks/useUser';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangeNickname() {
  const router = useRouter();
  const { updateNickname, isLoading } = useUser();

  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  const isLen8to20 = (text: string) => {
    return text.length >= 8 && text.length <= 20;
  };

  const hasNicknameComposition = (text: string) => {
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]+$/;
    return regex.test(text);
  };

  useEffect(() => {
    const validateNickname = () => {
      if (nickname.length >= 2 && nickname.length <= 10) {
        const regex = /^[가-힣a-zA-Z0-9]+$/;
        return regex.test(nickname);
      }
      return false;
    };

    setIsNicknameValid(validateNickname());
  }, [nickname]);

  const handleUpdateNickname = () => {
    updateNickname({ nickname });
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Navigation
        left={<ArrowLeftIcon width={20} height={20} />}
        onLeftPress={() => router.back()}
        title='닉네임 변경'
      />

      <View className='px-5 py-3 pb-5'>
        <View>
          <Text className='mb-3 font-semibold'>닉네임</Text>
        </View>
        <TextField
          menu={1}
          value={nickname}
          onChangeText={setNickname}
          secureTextEntry={false}
          placeholder='닉네임을 입력해주세요'
          firstMessage='2-10자 이내'
          secondMessage='영문, 숫자, 특수문자 포함'
          validateFirst={isLen8to20}
          validateSecond={hasNicknameComposition}
          maxLength={20}
        />
      </View>

      <View className='px-5'>
        <LongButton
          label='수정 완료'
          onPress={handleUpdateNickname}
          disabled={isLoading || !isNicknameValid}
        />
      </View>
    </SafeAreaView>
  );
}
