import TextInput from '@/components/common/Inputs/TextInput';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangePassword() {
  const router = useRouter();
  const { updatePassword, isLoading } = useUser();

  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');

  const [validNew, setValidNew] = useState(false);
  const [matchConfirm, setMatchConfirm] = useState(false);

  useEffect(() => {
    const regex = new RegExp(
      '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:\\";\'<>?,./]).{8,20}$',
    );
    setValidNew(regex.test(newPwd));
    setMatchConfirm(newPwd === confirmPwd && confirmPwd.length > 0);
  }, [newPwd, confirmPwd]);

  const disabled = !(validNew && matchConfirm && currentPwd.length > 0);

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

  return (
    <SafeAreaView className='flex-1 bg-white px-2'>
      <Stack.Screen
        options={{
          headerTitle: '비밀번호 변경',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className='px-4'>
              <Ionicons name='chevron-back' size={24} color='#333' />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 px-4'
      >
        <View className='mb-2'>
          <TextInput
            title='새로운 비밀번호를 입력해주세요'
            value={newPwd}
            onChangeText={setNewPwd}
            secureTextEntry={true}
            placeholder='새로운 비밀번호를 입력해주세요'
            conditionMessage='8-20자 이내 ✓ 영문, 숫자, 특수문자 포함 ✓'
          />
        </View>

        <View className='mb-8'>
          <TextInput
            value={confirmPwd}
            onChangeText={setConfirmPwd}
            secureTextEntry={true}
            placeholder='새로운 비밀번호를 다시 입력해주세요'
            conditionMessage='비밀번호 일치 ✓'
          />
        </View>

        <View className='mb-2'>
          <TextInput
            title='현재 비밀번호를 입력해주세요'
            value={currentPwd}
            onChangeText={setCurrentPwd}
            secureTextEntry={true}
            placeholder='현재 비밀번호를 입력해주세요'
            conditionMessage='비밀번호 일치 ✓'
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={disabled}
          className={`mt-4 rounded-xl py-4 items-center transition-all duration-300  ${
            disabled ? 'bg-gray-200' : 'bg-green-500'
          }`}
        >
          <Text
            className={`text-base font-bold ${disabled ? 'text-white' : 'text-white'}`}
          >
            비밀번호 변경
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
