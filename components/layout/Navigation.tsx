import { ReactNode } from 'react';
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
    <View className='flex-row items-center justify-between px-4 h-[6.9vh]'>
      <Pressable onPress={onLeftPress} className='p-1'>
        {left || <Text></Text>}
      </Pressable>

      <View
        className='absolute left-0 right-0 top-0 bottom-0 flex-1 items-center justify-center'
        pointerEvents='box-none'
      >
        <Pressable onPress={onCenterPress} className='items-center'>
          {center || (
            <Text className='text-lg font-n-bd text-gray-900' numberOfLines={1}>
              {title}
            </Text>
          )}
        </Pressable>
      </View>

      <Pressable
        onPress={onRightPress}
        className='p-1 flex-row items-center gap-6'
        hitSlop={8}
      >
        {right || <Text></Text>}
        {secondRight && (secondRight || <Text></Text>)}
      </Pressable>
    </View>
  );
}
