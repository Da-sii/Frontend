import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

interface IngredientTag {
  id: number;
  name: string;
}
// TODO: api 연결
interface TagsViewProps {
  title?: string;
  isLoading?: boolean;
  showArrow?: boolean;
}

const mockIngredients: IngredientTag[] = [
  { id: 1, name: '가르시니아이캄보지아(HCA)' },
  { id: 2, name: '판토텐산' },
  { id: 3, name: '프락토올리고당' },
  { id: 4, name: '인동덩굴꽃봉오리추출물' },
  { id: 5, name: '녹차추출물' },
  { id: 6, name: '바나바잎추출물' },
  { id: 7, name: '셀렌' },
];

const dummyTagWidths = [80, 110, 70, 90, 100, 80];

export default function TagsView({
  title = '성분 가이드',
  isLoading = false,
  showArrow = false,
}: TagsViewProps) {
  const router = useRouter();

  const handleTagPress = (ingredient: IngredientTag) => {
    router.push({
      pathname: '/home/search',
      params: { word: ingredient.name },
    });
  };

  const handleArrowPress = () => {
    router.push('/ingredient');
  };

  return (
    <View>
      <View className='flex-row items-center justify-between mb-4'>
        <Text className='text-lg font-n-eb'>{title}</Text>
        {showArrow && (
          <Pressable onPress={handleArrowPress}>
            <ArrowRightIcon width={16} height={16} />
          </Pressable>
        )}
      </View>
      <View className='flex-row flex-wrap gap-2 mb-1'>
        {isLoading ? (
          <View className='flex-row flex-wrap gap-2 mb-3'>
            {dummyTagWidths.map((width, index) => (
              <ShimmerPlaceholder
                key={index}
                LinearGradient={LinearGradient}
                style={{ width: width, height: 25, borderRadius: 999 }}
              />
            ))}
          </View>
        ) : (
          mockIngredients.map((ingredient) => (
            <Pressable
              key={ingredient.id}
              onPress={() => handleTagPress(ingredient)}
            >
              {({ pressed }) => (
                <View
                  className={`px-3 py-1 border-[0.5px] border-gray-100 rounded-full ${
                    pressed ? 'bg-gray-100' : 'bg-white'
                  }`}
                >
                  <Text className='text-sm text-gray-700'>
                    {ingredient.name}
                  </Text>
                </View>
              )}
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}
