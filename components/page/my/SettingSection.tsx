import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  title?: string;
  children: React.ReactNode;
  topBorder?: boolean;
  bottomBorder?: boolean;
}

export function SettingSection({
  title = '',
  children,
  topBorder = false,
  bottomBorder = false,
}: Props) {
  return (
    <View className='px-4 pb-2'>
      {topBorder && <View className={`h-px bg-gray-100`} />}
      {title && (
        <Text className='text-sm text-gray-500 mt-4 mb-2 font-semibold'>
          {title}
        </Text>
      )}
      {children}
      {bottomBorder && <View className={`h-px bg-gray-100`} />}
    </View>
  );
}
