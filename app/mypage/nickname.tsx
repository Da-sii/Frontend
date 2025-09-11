import TextInput from '@/components/common/Inputs/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChangeNickname() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
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
    </SafeAreaView>
  );
}
