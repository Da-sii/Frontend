import { LongButton } from '@/components/common/buttons/LongButton';
import TextInput from '@/components/common/Inputs/TextInput';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangeNickname() {
  const router = useRouter();
  const { updateNickname, isLoading } = useUser();

  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(false);

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
          headerTitle: '닉네임 변경',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className=''>
              <Ionicons name='chevron-back' size={24} color='#333' />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />

      <View className='px-5'>
        <TextInput
          title='닉네임'
          value={nickname}
          onChangeText={setNickname}
          conditionMessage='2자 이상 10자 ✓ 이하 한글, 영문, 숫자만 ✓'
        />
      </View>

      <LongButton
        label='수정 완료'
        onPress={handleUpdateNickname}
        disabled={isLoading || !isNicknameValid}
      />
    </SafeAreaView>
  );
}
