import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type LongButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  height?: string;
};

export const LongButton: React.FC<LongButtonProps> = ({
  label,
  onPress,
  disabled,
  height,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`w-full ${height ? height : 'h-60px'} rounded-xl items-center 
        ${disabled ? 'bg-gray-200' : 'bg-green-500 active:bg-green-600'}
      `}
    >
      <Text className='text-white text-b-lg font-extrabold my-auto'>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
