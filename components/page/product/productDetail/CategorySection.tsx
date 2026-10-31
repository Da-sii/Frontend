import type { SmallCategory } from '@/types/models/product';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Text, View } from 'react-native';

type Props = {
  smallCategories: SmallCategory[];
};

const FUNCTIONAL_CATEGORIES = new Set([
  '체지방관리',
  '체지방감소',
  '장건강개선',
  '혈당조절',
  '혈당관리',
]);

export default function CategorySection({ smallCategories }: Props) {
  const visibleCategories = smallCategories.filter(({ category }) =>
    FUNCTIONAL_CATEGORIES.has(category.replace(/\s/g, '')),
  );

  if (visibleCategories.length === 0) return null;

  return (
    <View className='px-5 py-[15px]'>
      <LinearGradient
        colors={['#FDFFFB', '#F5FDFE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 20,
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#82E3AF33',
        }}
      >
        {visibleCategories.map(({ category, iconUrl }, index) => (
          <View
            key={`${category}-${index}`}
            className='flex-row items-center gap-1'
          >
            {iconUrl !== '' && (
              <Image
                source={{ uri: iconUrl }}
                style={{ width: 26, height: 26 }}
                resizeMode='contain'
                accessible={false}
              />
            )}
            <Text className='text-c2 font-n-bd text-gray-900'>{category}</Text>
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}
