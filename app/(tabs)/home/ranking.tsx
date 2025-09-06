import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ListIcon from '@/assets/icons/ic_clock.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import ResetIcon from '@/assets/icons/ic_refresh.svg';
import Navigation from '@/components/layout/Navigation';
import RankingItem from '@/components/page/home/RankingItem';
import colors from '@/constants/color';

import { mockRankingData } from '@/mocks/data/home';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = [
  '전체',
  '체지방 감소',
  '에너지 소모/기초대사량 증가',
  '에너지 소모/기초대사량 감소',
  '에너지 소모/기초대사량 일정',
  '에너지 소모/기초대사량 몰라',
];

const { width } = Dimensions.get('window');

interface RankingItem {
  id: string;
  image: any;
  brand: string;
  name: string;
  rating: number;
  reviewCount: string;
  price: string;
  weight: string;
  change: number;
  isNew?: boolean;
}

export default function Ranking() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialFilter = params.category ? (params.category as string) : '전체';

  const [filter, setFilter] = useState<string>(initialFilter);
  const [tab, setTab] = useState<'day' | 'month'>('day');
  const [data, setData] = useState(mockRankingData);

  useEffect(() => {
    if (params.category && categories.includes(params.category as string)) {
      setFilter(params.category as string);
    }
  }, [params.category]);

  const onChangeTab = (next: 'day' | 'month') => {
    setTab(next);
    // setData(next === 'day' ? mockRankingToday : mockRankingMonth);
  };

  const onFilter = (category: string) => {
    setFilter(category);
    // 실제 필터링 로직 필요 시 구현
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: RankingItem;
    index: number;
  }) => (
    <RankingItem
      item={item}
      index={index}
      onPress={() =>
        router.push({
          pathname: '/productDetail/[id]',
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
          onPress={() => onChangeTab('day')}
          className='px-2 py-3 mx-2'
        >
          <Text
            style={{
              textAlign: 'center',
              color: tab === 'day' ? colors.gray[900] : colors.gray[500],
              fontWeight: tab === 'day' ? '600' : '400',
            }}
          >
            현재 급상승 랭킹
          </Text>
        </Pressable>
        <Pressable onPress={() => onChangeTab('month')} className='px-2 py-3'>
          <Text
            style={{
              textAlign: 'center',
              color: tab === 'month' ? colors.gray[900] : colors.gray[500],
              fontWeight: tab === 'month' ? '600' : '400',
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
                  onPress={() => onFilter(cat)}
                  style={{
                    borderWidth: 1,
                    borderColor: selected ? '#22C55E' : '#D1D5DB',
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
          {tab === 'day' ? (
            <View className='flex-row items-center'>
              <ResetIcon width={12} height={12} className='mr-1' />
              <Text className='text-gray-200 text-xs'>초기화</Text>
            </View>
          ) : (
            <View />
          )}
          <View className='flex-row items-center'>
            <ListIcon width={12} height={12} className='mr-1' />
            <Text className='text-gray-200 text-xs'>
              {tab === 'day' && 'MM.DD '}18:00 기준
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className='h-px bg-gray-200' />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});
