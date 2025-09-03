import React, { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface NavigationProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  secondRight?: ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export default function Navigation({
  title = '',
  left,
  right,
  secondRight,
  onLeftPress,
  onRightPress,
}: NavigationProps) {
  return (
    <View className='flex-row items-center justify-between px-4 py-3'>
      <Pressable onPress={onLeftPress} className='p-1'>
        {left || <Text></Text>}
      </Pressable>

      <Text className='text-lg font-semibold'>{title}</Text>

      <Pressable
        onPress={onRightPress}
        className='p-1 flex-row items-center gap-6'
      >
        {right || <Text></Text>}
        {secondRight && (secondRight || <Text></Text>)}
      </Pressable>
    </View>
  );
}
