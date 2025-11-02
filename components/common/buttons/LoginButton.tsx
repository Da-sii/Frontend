import { ComponentType } from 'react';
import { Pressable, Text } from 'react-native';
import { SvgProps } from 'react-native-svg';

type LoginButtonProps = {
  label: string;
  onPress: () => void;
  color: string;
  Icon: ComponentType<SvgProps>;
  textColor: string;
  borderColor?: string;
  border: string;
  IconWidth?: number;
  IconHeight?: number;
};

export default function LoginButton({
  label,
  onPress,
  color,
  Icon,
  textColor,
  borderColor,
  border,
  IconWidth,
  IconHeight,
}: LoginButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-center w-full h-[55px] rounded-xl px-4 mb-[15px] ${borderColor} ${border} ${color}`}
    >
      <Icon
        width={IconWidth}
        height={IconHeight}
        className='absolute left-[17px]'
      />
      <Text className={`text-b-sm font-n-bd ${textColor} `}>{label}</Text>
    </Pressable>
  );
}
