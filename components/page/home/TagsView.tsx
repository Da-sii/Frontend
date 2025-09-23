import { TopSmallCategory } from '@/types/models/main';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

interface TagsViewProps {
  categories: TopSmallCategory[];
  title?: string;
  isLoading: boolean;
}

const dummyTagWidths = [80, 110, 70, 90, 100, 80];

export default function TagsView({
  categories,
  title = '인기 카테고리',
}: TagsViewProps) {
  const router = useRouter();
  const isLoading = false;

  const handlePress = (cat: TopSmallCategory) => {
    router.push({
      pathname: '/(tabs)/home/ranking',
      params: { category: cat.smallCategory },
    });
  };

  return (
    <View>
      <Text className='text-base font-semibold mb-3'>{title}</Text>
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
          categories.map((cat: TopSmallCategory) => (
            <Pressable key={cat.smallCategory} onPress={() => handlePress(cat)}>
              <View
                key={cat.smallCategory}
                className='px-3 py-1 bg-white border-[0.5px] border-gray-100 text-gray-700 rounded-full'
              >
                <Text className='text-sm'>{cat.smallCategory}</Text>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}
