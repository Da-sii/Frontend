import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TextField } from './TextField';

type TextInputProps = {
  title?: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  conditionMessage?: string;
  maxLength?: number;
};

export default function TextInput({
  title,
  value,
  placeholder,
  onChangeText,
  secureTextEntry = false,
  disabled = false,
  errorMessage,
  conditionMessage,
  maxLength,
}: TextInputProps) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setShowError(!!errorMessage && value.length > 0);
  }, [value, errorMessage]);

  return (
    <View className='w-full items-center'>
      {title ? (
        <Text className='self-start mb-2 text-base font-medium'>{title}</Text>
      ) : null}

      <TextField
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        disabled={disabled}
        maxLength={maxLength}
      />

      {conditionMessage && !showError ? (
        <Text className='self-start w-[90%] px-4 text-sm text-green-600'>
          {conditionMessage}
        </Text>
      ) : null}

      {showError ? (
        <Text className='self-start w-[90%] mt-2 text-sm text-red-600'>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}
