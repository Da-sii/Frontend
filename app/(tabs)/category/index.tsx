import ViewAllIcon from '@/assets/icons/ic_arrow_right.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import Navigation from '@/components/layout/Navigation';
import colors from '@/constants/color';
import { useCategory } from '@/hooks/useCategory';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Category() {
  const router = useRouter();
  const { categories, fetchCategories } = useCategory();

  const [selectedBigCategory, setSelectedBigCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const bigCategories = useMemo(
    () => categories.map((cat) => cat.category),
    [categories],
  );
  const middleCategories = useMemo(() => {
    return (
      categories.find((c) => c.category === selectedBigCategory)
        ?.middleCategories ?? []
    );
  }, [categories, selectedBigCategory]);

  useEffect(() => {
    if (categories.length > 0 && !selectedBigCategory) {
      setSelectedBigCategory(categories[0].category);
    }
  }, [categories, selectedBigCategory]);

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedBigCategory) {
      setSelectedBigCategory(categories[0].category);
    }
  }, [categories]);

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

      <View className='flex-row bg-white'>
        {/* 대분류 */}

        <ScrollView
          className='flex h-screen bg-gray-100 border-gray-200'
          style={{
            flexGrow: 0,
            flexShrink: 0,
            minWidth: 127,
          }}
        >
          {bigCategories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedBigCategory(cat)}
              className={`items-center py-[16px] z-10 ${
                selectedBigCategory === cat ? 'bg-white' : 'bg-gray-100'
              }`}
            >
              <Text
                numberOfLines={1}
                className={`text-b-sm font-n-bd pl-3 pr-3 ${
                  selectedBigCategory === cat
                    ? 'text-gray-900 font-n-bd'
                    : 'text-gray-400 font-n-bd'
                }`}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* 중분류 */}
        <View className='flex-1 '>
          <FlatList
            data={middleCategories}
            keyExtractor={(item, index) => `${item.category}-${index}`}
            renderItem={({ item }) => (
              <View className='px-5'>
                <Pressable
                  className='flex-row justify-between items-center  pt-[15px] pb-[17px]'
                  onPress={() => goToList()}
                >
                  <Text className='text-gray-900 text-b-md font-n-bd'>
                    {item.category}
                  </Text>
                  <View className='flex-row items-center'>
                    <ViewAllIcon
                      width={13}
                      height={13}
                      color={colors.gray[900]}
                    />
                  </View>
                </Pressable>
                {/* 소분류 */}
                <View className='flex-col flex-wrap mb-2'>
                  {item.smallCategories.map((small) => (
                    <Pressable
                      key={small}
                      onPress={() => goToList(small)} // 소분류 클릭 시 해당 카테고리로 이동
                      className='py-2 '
                    >
                      <Text className='text-gray-900 text-c1 font-n-bd'>
                        {small}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View className='w-full border-b-[0.5px] border-gray-200' />
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
