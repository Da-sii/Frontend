import TextInput from '@/components/common/Inputs/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);

  const [validNew, setValidNew] = useState(false);
  const [matchConfirm, setMatchConfirm] = useState(false);

  useEffect(() => {
    // 8~20자, 영문, 숫자, 특수문자 포함 체크
    const regex = new RegExp(
      '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]:\\";\'<>?,./]).{8,20}$',
    );
    setValidNew(regex.test(newPwd));
    setMatchConfirm(newPwd === confirmPwd && confirmPwd.length > 0);
  }, [newPwd, confirmPwd]);

  const disabled = !(validNew && matchConfirm && currentPwd.length > 0);

  const handleSubmit = () => {
    if (!disabled) {
      // TODO: 실제 비밀번호 변경 API 호출
      console.log('비밀번호 변경 요청', { currentPwd, newPwd });
      router.replace('/mypage/completion?action=password');
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
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
          />
        </View>

        <View className='mb-2'>
          <TextInput value={confirmPwd} onChangeText={setConfirmPwd} />
        </View>

        <View className='mb-2'>
          <TextInput
            title='현재 비밀번호를 입력해주세요'
            value={currentPwd}
            onChangeText={setCurrentPwd}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={disabled}
          className={`mt-10 rounded-lg mx-4 py-4 items-center ${
            disabled ? 'bg-gray-300' : 'bg-primary-500'
          }`}
        >
          <Text
            className={`text-base font-medium ${disabled ? 'text-white' : 'text-white'}`}
          >
            비밀번호 변경
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
