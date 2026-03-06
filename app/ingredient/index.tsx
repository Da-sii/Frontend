'use client';

import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';
import HomeIcon from '@/assets/icons/ic_home.svg';
import SearchBar from '@/components/common/SearchBar';
import Navigation from '@/components/layout/Navigation';
import colors from '@/constants/color';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Mock Data ---
const hotIngredients = [
  { id: 1, name: '가르시니아 캄보지아 추출물' },
  { id: 2, name: '밀크씨슬추출물' },
  { id: 3, name: '녹차추출물' },
];

const ingredientList = [
  { id: 4, name: '가르시니아 캄보지아 추출물' },
  { id: 5, name: '밀크씨슬추출물' },
  { id: 6, name: '녹차추출물' },
  { id: 7, name: '코엔자임Q10' },
  { id: 8, name: '비타민C (아스코르브산)' },
  { id: 9, name: '콜라겐 펩타이드' },
  { id: 10, name: '프로바이오틱스' },
  { id: 11, name: '루테인' },
  { id: 12, name: '오메가3' },
];

function IngredientRow({
  name,
  onPress,
}: {
  name: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className='flex-row items-center justify-between px-4 py-4 bg-white active:bg-gray-50'
    >
      <Text className='text-sm text-gray-800'>{name}</Text>
      <ArrowRightIcon width={12} height={12} fill={colors.gray[900]} />
    </Pressable>
  );
}

export default function IngredientGuidePage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    setSearchQuery(inputValue);
  };

  const handleChangeText = (text: string) => {
    setInputValue(text);
    if (text === '') setSearchQuery('');
  };

  const filteredHot = hotIngredients.filter((i) =>
    searchQuery ? i.name.includes(searchQuery) : true,
  );
  const filteredList = ingredientList.filter((i) =>
    searchQuery ? i.name.includes(searchQuery) : true,
  );

  const hasResults = filteredHot.length > 0 || filteredList.length > 0;

  return (
    <SafeAreaView className='bg-white flex-1'>
      {/* 헤더 */}
      <Navigation
        title='성분 가이드'
        left={<ArrowLeftIcon width={18} height={18} fill={colors.gray[900]} />}
        onLeftPress={() => router.back()}
        right={
          <Pressable onPress={() => router.push('/home')}>
            <HomeIcon width={18} height={18} fill={colors.gray[900]} />
          </Pressable>
        }
        onRightPress={() => router.push('/')}
      />

      {/* 검색바 */}
      <SearchBar
        value={inputValue}
        onChangeText={handleChangeText}
        onSubmit={handleSearch}
        placeholder='성분, 제품명으로 검색해보세요!'
      />

      {/* 스크롤 영역 */}
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {filteredHot.length > 0 && (
          <View className='mb-2'>
            <View className='px-4 pt-5 pb-2'>
              <Text className='text-lg font-n-eb'>요즘 뜨는 성분 🔥</Text>
            </View>
            {filteredHot.map((item, index) => (
              <View key={item.id}>
                <IngredientRow
                  name={item.name}
                  onPress={() => {
                    router.push({
                      pathname: '/ingredient/[id]',
                      params: { id: item.id },
                    });
                  }}
                />
              </View>
            ))}
          </View>
        )}
        <View className='h-[0.5px] bg-gray-200 mx-4' />
        {filteredList.length > 0 && (
          <View className='mb-2'>
            <View className='px-4 pt-5 pb-2'>
              <Text className='text-lg font-n-eb '>성분 리스트</Text>
            </View>
            {filteredList.map((item, index) => (
              <View key={item.id}>
                <IngredientRow
                  name={item.name}
                  onPress={() => {
                    router.push({
                      pathname: '/ingredient/[id]',
                      params: { id: item.id },
                    });
                  }}
                />
              </View>
            ))}
          </View>
        )}

        {searchQuery && !hasResults && (
          <View className='flex-1 items-center py-10'>
            <Text className='text-gray-400 font-medium text-center'>
              {`'${searchQuery}'에 대한\n검색 결과가 없습니다.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
