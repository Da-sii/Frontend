import ViewAllIcon from '@/assets/icons/ic_arrow_right.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import Navigation from '@/components/layout/Navigation';
import { useCategory } from '@/hooks/useCategory';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Category() {
  const router = useRouter();
  const { categories, fetchCategories } = useCategory();

  const [selectedBigCategory, setSelectedBigCategory] = useState('');
  const [colWidth, setColWidth] = useState<number>(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const bigCategories = useMemo(
    () => categories.map((cat) => cat.category),
    [categories],
  );

  const subCategoriesMap = useMemo(
    () =>
      categories.reduce(
        (acc, current) => {
          acc[current.category] = current.smallCategories;
          return acc;
        },
        {} as Record<string, string[]>,
      ),
    [categories],
  );

  useEffect(() => {
    if (bigCategories.length > 0 && !selectedBigCategory) {
      setSelectedBigCategory(bigCategories[0]);
    }
  }, [bigCategories, selectedBigCategory]);

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedBigCategory) {
      setSelectedBigCategory(categories[0].category);
    }
  }, [categories]);

  const onTextLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > colWidth) {
      setColWidth(w);
    }
  };
  const sidebarWidth = colWidth + 16 * 2;

  const goToList = (sub?: string) => {
    if (!selectedBigCategory) return;
    router.push({
      pathname: '/(tabs)/category/list',
      params: { main: selectedBigCategory, sub: sub || '전체' },
    });
  };

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'left', 'right']}>
      <Navigation
        title='카테고리'
        right={<SearchIcon width={18} height={18} />}
        onRightPress={() => router.push('/home/search')}
      />

      <View className='w-full border-b-[0.5px] border-gray-200' />

      <View className='flex-1 flex-row bg-white'>
        <ScrollView
          className='flex-none border-gray-200 bg-gray-100'
          style={{
            width: sidebarWidth,
            flexGrow: 0,
            flexShrink: 0,
          }}
        >
          {bigCategories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedBigCategory(cat)}
              className={`items-start py-3 ${
                selectedBigCategory === cat ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium pl-6 ${
                  selectedBigCategory === cat
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
                onLayout={onTextLayout}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className='flex-1'>
          <View className='flex-row justify-between items-center px-4 py-3'>
            <Text className='text-lg font-semibold text-gray-900'>
              {selectedBigCategory}
            </Text>
            <Pressable
              onPress={() => goToList()}
              className='flex-row items-center'
            >
              <Text className='text-xs text-gray-500 mr-1 font-semibold'>
                전체보기
              </Text>
              <ViewAllIcon width={10} height={10} />
            </Pressable>
          </View>

          <FlatList
            data={subCategoriesMap[selectedBigCategory] || []}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                className='py-3 px-4'
                onPress={() => {
                  goToList(item);
                }}
              >
                <Text className='text-sm text-gray-900'>{item}</Text>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
