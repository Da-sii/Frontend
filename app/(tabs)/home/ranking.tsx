import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ListIcon from '@/assets/icons/ic_clock.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import ResetIcon from '@/assets/icons/ic_refresh.svg';
import Navigation from '@/components/layout/Navigation';
import RankingItem from '@/components/page/home/RankingItem';
import colors from '@/constants/color';
import { IRankingProduct } from '@/types/models/product';

import SkeletonRankingItem from '@/components/common/skeleton/ProductListItemSkeleton';
import { useRanking } from '@/hooks/useRanking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  '전체',
  '소분류 1',
  '소분류 2',
  '소분류 3',
  '소분류 4',
  '소분류 5',
  '소분류 6',
  '소분류 7',
];

export default function Ranking() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { fetchRanking, isLoading, rankingInfo } = useRanking();
  const initialFilter = params.category ? (params.category as string) : '전체';
  const [filter, setFilter] = useState<string>(initialFilter);
  const [tab, setTab] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    const period = tab === 'daily' ? 'daily' : 'monthly';

    const category = filter === '전체' ? '전체' : filter;

    fetchRanking({
      period,
      category,
      page: 1,
    });
  }, [tab, filter]);

  useEffect(() => {
    if (params.category && categories.includes(params.category as string)) {
      setFilter(params.category as string);
    }
  }, [params.category]);

  const onChangeTab = (next: 'daily' | 'monthly') => {
    setTab(next);
    // setData(next === 'day' ? mockRankingToday : mockRankingMonth);
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
      showDiff={tab === 'monthly'}
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
          onPress={() => onChangeTab('daily')}
          className='px-2 py-3 mx-2'
        >
          <Text
            style={{
              textAlign: 'center',
              color: tab === 'daily' ? colors.gray[900] : colors.gray[500],
            }}
          >
            현재 급상승 랭킹
          </Text>
        </Pressable>
        <Pressable onPress={() => onChangeTab('monthly')} className='px-2 py-3'>
          <Text
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
            {categories.map((cat) => {
              const selected = filter === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setFilter(cat)}
                  style={{
                    borderWidth: 1,
                    borderColor: selected ? '#50D88F' : '#D1D5DB',
                  }}
                  className={`mr-2 rounded-full px-3 py-1 ${
                    selected ? 'bg-green-500' : 'bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selected ? 'text-white' : 'text-gray-700'
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
            <Pressable
              onPress={() =>
                fetchRanking({
                  period: 'daily',
                  category: filter,
                  page: 1,
                })
              }
            >
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
              {tab === 'daily' && 'MM.DD '}18:00 기준
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
