import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import SearchIcon from '@/assets/icons/ic_magnifier.svg';
import Navigation from '@/components/layout/Navigation';
import RankingRow from '@/components/page/home/RankingItem';
import colors from '@/constants/color';

import { mockRankingData } from '@/mocks/data/home';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const options = {
  tabBarStyle: { display: 'none' },
};

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
  const [tab, setTab] = useState<'day' | 'month'>('day');
  const [filter, setFilter] = useState<string>('전체');
  const [data, setData] = useState(mockRankingData);

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
  }) => <RankingRow item={item} index={index} onPress={() => {}} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Navigation
        title='랭킹'
        left={<ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />}
        onLeftPress={() => router.push('/(tabs)/home')}
        right={<SearchIcon width={20} height={20} fill={colors.gray[900]} />}
        onRightPress={() => router.push('/home/search')}
      />

      <View style={{ flexDirection: 'row', marginHorizontal: 16 }}>
        <Pressable
          onPress={() => onChangeTab('day')}
          style={{
            flex: 1,
            paddingVertical: 8,
            borderBottomWidth: tab === 'day' ? 2 : 1,
            borderColor: tab === 'day' ? colors.gray[500] : colors.gray[300],
          }}
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
        <Pressable
          onPress={() => onChangeTab('month')}
          style={{
            flex: 1,
            paddingVertical: 8,
            borderBottomWidth: tab === 'month' ? 2 : 1,
            borderColor: tab === 'month' ? colors.gray[500] : colors.gray[300],
          }}
        >
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

      <View style={{ flexDirection: 'row', paddingVertical: 12 }}>
        {['전체', '체지방 감소', '에너지 소모/기초대사량 증가'].map((cat) => (
          <Pressable
            key={cat}
            onPress={() => onFilter(cat)}
            style={{
              marginLeft: cat === '전체' ? 16 : 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
            className={`${filter === cat ? 'bg-green-500 text-white' : 'bg-white text-gray-700'} rounded-full`}
          >
            <Text
              className={`${filter === cat ? 'text-white border-green-500' : 'text-gray-700 border-gray-300'} text-xs font-medium`}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
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
