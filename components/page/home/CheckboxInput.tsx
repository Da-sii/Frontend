import CheckkIcon from '@/assets/icons/ic_check.svg';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  isSelected: boolean;
  label: string;
  onPress?: () => void;
  onDepthPress?: () => void;
}

export default function CheckboxInput({
  isSelected,
  label,
  onPress,
  onDepthPress,
}: Props) {
  const Container = onPress ? TouchableOpacity : View;
  const renderIcon = () => {
    if (isSelected)
      return <CheckkIcon width={12} height={12} color='#50D88F' />;
    return <CheckkIcon width={12} height={12} color='#181A1B' />;
  };
  const icon = renderIcon();
  return (
    <Container
      className='flex-row items-center justify-between py-0.5'
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className='flex flex-row gap-1 items-center'>
        {icon}
        <Text
          className={`text-sm ${isSelected ? 'text-green-500 ' : 'text-gray-400 '} : font-semibold`}
        >
          {label}
        </Text>
      </View>
    </Container>
  );
}
