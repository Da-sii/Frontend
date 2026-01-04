// 기타 원료
import InfoIcon from '@/assets/icons/ic_info.svg';
import { Pressable, Text, View } from 'react-native';

interface Props {
  ingredients: string[] | undefined;
  onPressInfo: () => void;
}

export default function OtherIngredientsSection({
  ingredients,
  onPressInfo,
}: Props) {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <View className='p-5'>
      <View className='flex-row items-center justify-between mb-[10px]'>
        <View className='flex-row'>
          <Text className='text-b-lg font-n-bd'>기타 원료 </Text>
          <Text className='text-b-lg font-n-eb text-green-500'>
            {ingredients.length}개
          </Text>
        </View>

        <Pressable onPress={onPressInfo}>
          <InfoIcon />
        </Pressable>
      </View>

      <View className='bg-[#F6F5FA] rounded-xl p-4'>
        {ingredients.map((item, index) => (
          <Text key={index} className='text-b-sm font-n-bd mb-1'>
            • {item}
          </Text>
        ))}
      </View>
    </View>
  );
}
