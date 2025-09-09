import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type TextFieldProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  disabled?: boolean;
};

export const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className='flex-row items-center w-full h-[60px] rounded-xl py-[21px] px-4 border border-gray-200'>
      {value.length === 0 && (
        <Text className='absolute left-[16px] text-b-sm font-normal text-gray-400'>
          {placeholder}
        </Text>
      )}
      <TextInput
        className='flex-1 text-b-sm font-bold text-gray-900'
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        editable={!disabled}
      />

      {secureTextEntry && !disabled && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color='#9ca3af'
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
