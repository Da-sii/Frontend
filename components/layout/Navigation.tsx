import React, { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface NavigationProps {
  title?: string;
  center?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  secondRight?: ReactNode;
  onCenterPress?: () => void;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export default function Navigation({
  title = '',
  center,
  left,
  right,
  secondRight,
  onCenterPress,
  onLeftPress,
  onRightPress,
}: NavigationProps) {
  return (
    <View className='flex-row items-center justify-between px-4 py-3'>
      <Pressable onPress={onLeftPress} className='p-1'>
        {left || <Text></Text>}
      </Pressable>

      <Pressable onPress={onCenterPress} className='flex-1 items-center'>
        {center || <Text className='text-lg font-extrabold'>{title}</Text>}
      </Pressable>

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
