import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ListIcon from '@/assets/icons/ic_clock.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import ResetIcon from '@/assets/icons/ic_refresh.svg';
import SkeletonRankingItem from '@/components/common/skeleton/ProductListItemSkeleton';
import Navigation from '@/components/layout/Navigation';
import RankingItem from '@/components/page/home/RankingItem';
import colors from '@/constants/color';
import { useCategory } from '@/hooks/useCategory';
import { useFetchRankingQuery } from '@/hooks/useProductQueries';
import { IRankingProduct } from '@/types/models/product';
import { formatCurrentTime } from '@/utils/date';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Ranking() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { categories, fetchCategories } = useCategory();
  const initialFilter = params.category ? (params.category as string) : '전체';
  const initialTab = params.initialTab === 'monthly' ? 'monthly' : 'daily';
  const [filter, setFilter] = useState<string>(initialFilter);
  const [tab, setTab] = useState<'daily' | 'monthly'>(initialTab);

  const { data: rankingInfo, isLoading } = useFetchRankingQuery({
    period: tab === 'daily' ? 'daily' : 'monthly',
    category: filter === '전체' ? '전체' : filter,
    page: 1,
  });

  const allSmallCategories = useMemo(() => {
    if (!categories) {
      return ['전체'];
    }
    const flattenedCategories = categories.flatMap(
      (category) => category.smallCategories,
    );
    return ['전체', ...flattenedCategories];
  }, [categories]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (params.initialTab === 'daily' || params.initialTab === 'monthly') {
      setTab(params.initialTab);
    }
  }, [params.initialTab]);

  useEffect(() => {
    if (
      params.category &&
      allSmallCategories.includes(params.category as string)
    ) {
      setFilter(params.category as string);
    }
  }, [params.category]);

  const handleReset = () => {
    setFilter('전체');
    setTab('daily');
  };

  const onChangeTab = (next: 'daily' | 'monthly') => {
    setTab(next);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: IRankingProduct;
    index: number;
  }) => (
    <RankingItem
      item={item}
      index={index}
      showDiff={true}
      onPress={() =>
        router.push({
          pathname: '/product/[id]/productDetail',
          params: { id: item.id },
        })
      }
    />
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#fff' }}
      edges={['top', 'left', 'right']}
    >
      <Navigation
        title='랭킹'
        left={<ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />}
        onLeftPress={() => router.push('/(tabs)/home')}
        right={<SearchIcon width={20} height={20} fill={colors.gray[900]} />}
        onRightPress={() => router.push('/home/search')}
      />

      <View className='flex-row w-full border-t-[0.5px] border-b-[0.5px] border-gray-200'>
        <Pressable
          onPress={() => {
            setFilter('전체');
            onChangeTab('daily');
          }}
          className='px-2 py-3 mx-2'
        >
          <Text
            className='text-xs'
            style={{
              textAlign: 'center',
              color: tab === 'daily' ? colors.gray[900] : colors.gray[400],
            }}
          >
            현재 급상승 랭킹
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setFilter('전체');
            onChangeTab('monthly');
          }}
          className='px-2 py-3'
        >
          <Text
            className='text-xs'
            style={{
              textAlign: 'center',
              color: tab === 'monthly' ? colors.gray[900] : colors.gray[500],
            }}
          >
            월간 랭킹
          </Text>
        </Pressable>
      </View>

      <View className='flex-col'>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
          className='mb-4'
        >
          <View className='flex-row'>
            {allSmallCategories.map((cat) => {
              const selected = filter === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setFilter(cat)}
                  style={{
                    borderWidth: 1,
                    borderColor: selected ? '#50D88F' : '#D1D5DB',
                  }}
                  className={`mr-2 rounded-full px-3.5 py-1 ${
                    selected ? 'bg-green-500' : 'bg-white'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selected
                        ? 'text-white font-n-eb'
                        : 'text-gray-700 font-n-rg'
                    }`}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View className='flex-row justify-between mx-4 items-center'>
          {tab === 'daily' ? (
            <Pressable onPress={handleReset}>
              <View className='flex-row items-center'>
                <ResetIcon width={12} height={12} className='mr-1' />
                <Text className='text-gray-200 text-xs'>초기화</Text>
              </View>
            </Pressable>
          ) : (
            <View />
          )}
          <View className='flex-row items-center'>
            <ListIcon width={12} height={12} className='mr-1' />
            <Text className='text-gray-200 text-xs'>
              {formatCurrentTime(tab)}
            </Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <FlatList
          data={Array.from({ length: 10 })}
          renderItem={() => (
            <SkeletonRankingItem showDiff={tab === 'monthly'} />
          )}
          keyExtractor={(item, idx) => idx.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View className='h-[0.5px] bg-gray-200 mx-4' />
          )}
        />
      ) : (
        <FlatList
          data={rankingInfo?.results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View className='h-[0.5px] bg-gray-200 mx-4' />
          )}
        />
      )}
    </SafeAreaView>
  );
}
