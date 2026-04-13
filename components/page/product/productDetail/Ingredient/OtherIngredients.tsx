// 기타 원료
import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';
import InfoIcon from '@/assets/icons/ic_info.svg';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface Props {
  ingredients: string[] | undefined;
  onPressInfo: () => void;
}

// TODO: API 연결 필요 - 원료명으로 성분 ID를 조회하는 API가 필요합니다.
const MOCK_INGREDIENT_ID = '1';

export default function OtherIngredientsSection({
  ingredients,
  onPressInfo,
}: Props) {
  const router = useRouter();

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

      <View className='bg-[#F6F5FA] rounded-xl px-4 py-2'>
        {ingredients.map((item, index) => (
          <Pressable
            key={index}
            onPress={() =>
              // TODO: API 연결 필요 - item(원료명)에 해당하는 실제 성분 ID로 교체해야 합니다.
              router.push(`/ingredient/${MOCK_INGREDIENT_ID}`)
            }
            className='flex-row items-center justify-between py-[10px]'
          >
            <View className='flex-row items-center gap-x-2'>
              <Text className='text-b-sm font-n-bd'>•</Text>
              <Text className='text-b-sm font-n-bd'>{item}</Text>
            </View>
            <ArrowRightIcon />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
