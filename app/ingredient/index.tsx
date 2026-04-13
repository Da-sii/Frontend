'use client';

import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';
import HomeIcon from '@/assets/icons/ic_home.svg';
import SearchBar from '@/components/common/SearchBar';
import Navigation from '@/components/layout/Navigation';
import colors from '@/constants/color';
import { useGetIngredients } from '@/hooks/useIngredients';
import { Ingredient } from '@/services/ingredient/getIngredients';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAGE_SIZE = 10;

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
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useGetIngredients({
    search: searchQuery || undefined,
    page,
  });

  console.log('[Ingredients] data:', data, 'isError:', isError, 'error:', error);

  const ingredients = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(inputValue);
  };

  const handleChangeText = (text: string) => {
    setInputValue(text);
    if (text === '') {
      setPage(1);
      setSearchQuery('');
    }
  };

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
        {isLoading ? (
          <View className='flex-1 items-center py-10'>
            <ActivityIndicator color={colors.green[600]} />
          </View>
        ) : isError ? (
          <View className='flex-1 items-center py-10'>
            <Text className='text-red-400 text-center'>
              데이터를 불러오지 못했습니다.{'\n'}
              {(error as Error)?.message}
            </Text>
          </View>
        ) : ingredients.length > 0 ? (
          <View className='mb-2'>
            <View className='px-4 pt-5 pb-2 flex-row items-center gap-x-1'>
              <Text className='text-lg font-n-eb'>성분 리스트</Text>
              <Text className='text-sm text-gray-400'>({totalCount}개)</Text>
            </View>
            {ingredients.map((item: Ingredient) => (
              <View key={item.id}>
                <IngredientRow
                  name={item.ingredient_name}
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
        ) : (
          <View className='flex-1 items-center py-10'>
            <Text className='text-gray-400 font-medium text-center'>
              {searchQuery
                ? `'${searchQuery}'에 대한\n검색 결과가 없습니다.`
                : '성분 정보가 없습니다.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <View className='flex-row items-center justify-center gap-x-6 py-3 border-t border-gray-100'>
          <Pressable
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className='p-2'
          >
            <ArrowLeftIcon
              width={14}
              height={14}
              fill={page === 1 ? colors.gray[300] : colors.gray[900]}
            />
          </Pressable>
          <Text className='text-sm text-gray-700'>
            {page} / {totalPages}
          </Text>
          <Pressable
            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className='p-2'
          >
            <ArrowRightIcon
              width={14}
              height={14}
              fill={page === totalPages ? colors.gray[300] : colors.gray[900]}
            />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
