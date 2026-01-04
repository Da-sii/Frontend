// 기능성 원료 렌더링

import InfoIcon from '@/assets/icons/ic_info.svg';
import MaterialInfo from '@/components/page/product/productDetail/materialInfo';
import { Pressable, Text, View } from 'react-native';

interface Props {
  ingredients: any[] | undefined;
  onPressInfo: () => void;
}

export default function FunctionalIngredientsSection({
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
          <Text className='text-b-lg font-n-bd'>기능성 원료 </Text>
          <Text className='text-b-lg font-n-eb text-green-500'>
            {ingredients.length}개
          </Text>
        </View>

        <Pressable onPress={onPressInfo}>
          <InfoIcon />
        </Pressable>
      </View>

      {ingredients.map((item, index) => (
        <MaterialInfo key={index} materialInfo={item} />
      ))}
    </View>
  );
}
