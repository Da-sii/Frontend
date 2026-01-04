import BottomSheet from '@gorhom/bottom-sheet';
import { Text, View } from 'react-native';
import BottomSheetLayout from './BottomSheetLayout';

interface Props {
  sheetRef: React.RefObject<BottomSheet | null>;
  type: 'functional' | 'other' | null;
  snapPoints: number[];
}

export default function IngredientInfoBottomSheet({
  sheetRef,
  type,
  snapPoints,
}: Props) {
  if (!type) return null;

  return (
    <BottomSheetLayout sheetRef={sheetRef} snapPoints={snapPoints}>
      {/* 기능성 원료 출처 */}
      {type === 'functional' ? (
        <View className='px-[30px] mt-[30px] mb-[44px]'>
          <Text className='text-b-sm font-n-eb text-gray-900 mb-[25px]'>
            성분 정보의 출처
          </Text>

          <Text className='text-c2 font-n-bd text-gray-400 mb-[11px]'>
            본 정보는 식품의약품안전처 건강기능식품 및 영양성분 기준을
            참고했습니다.
          </Text>

          <Text className='text-c2 font-n-bd text-gray-400'>
            (https://www.foodsafetykorea.go.kr)
          </Text>
        </View>
      ) : (
        // 기타 원료 출처
        <View className='px-[30px] mt-[30px] mb-[44px]'>
          <Text className='text-b-sm font-n-eb mb-[16px]'>기타 원료?</Text>

          <Text className='text-c2 font-n-bd text-gray-400'>
            해당 원료는 식품의약품안전처 기준 건강기능식품 기능성 안전 대상에
            포함되지 않은 원료입니다.
          </Text>
        </View>
      )}
    </BottomSheetLayout>
  );
}
