import React, { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface NavigationProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export default function Navigation({
  title = '',
  left,
  right,
  onLeftPress,
  onRightPress,
}: NavigationProps) {
  return (
    <View className='flex-row items-center justify-between px-4 py-3'>
      <Pressable onPress={onLeftPress} className='p-1'>
        {left || <Text></Text>}
      </Pressable>

      <Text className='text-lg font-semibold'>{title}</Text>

      <Pressable onPress={onRightPress} className='p-1'>
        {right || <Text></Text>}
      </Pressable>
    </View>
  );
}
