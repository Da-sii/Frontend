import DepthIcon from '@/assets/icons/ic_arrow_right.svg';
import { Text, TouchableOpacity, View } from 'react-native';

interface ItemProps {
  label: string;
  subLabel?: string;
  value?: string;
  onPress?: () => void;
}

export function SettingItem({ label, subLabel, value, onPress }: ItemProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      className='flex-row items-center justify-between py-1.5'
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className='flex flex-row gap-1 items-center'>
        <Text className='text-base text-gray-800 font-bold'>{label}</Text>
        {subLabel && (
          <Text style={{ fontWeight: 700 }} className='text-xs text-green-600'>
            {subLabel}
          </Text>
        )}
      </View>

      <View className='flex-row items-center'>
        {value && (
          <Text className='text-xs text-light text-gray-600'>{value}</Text>
        )}

        {onPress && <DepthIcon width={15} height={15} />}
      </View>
    </Container>
  );
}
