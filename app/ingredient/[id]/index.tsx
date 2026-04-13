'use client';

import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';

import HomeIcon from '@/assets/icons/ic_home.svg';
import Navigation from '@/components/layout/Navigation';
import colors from '@/constants/color';
import { useGetIngredientDetail } from '@/hooks/useIngredients';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function parseStringToArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {}
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function IngredientDetailPage() {
  const router = useRouter();
  const { id, from, productName } = useLocalSearchParams<{
    id: string;
    from?: 'list' | 'product';
    productName?: string;
  }>();

  const { data: ingredient, isLoading } = useGetIngredientDetail(id);
  const headerTitle =
    from === 'product' && productName ? productName : '성분 가이드';
  const [showSourceModal, setShowSourceModal] = useState(false);

  const keyPoints = parseStringToArray(ingredient?.keyPoints);
  const sources = parseStringToArray(ingredient?.sources);
  const productCount = Number(ingredient?.productCount ?? 0);

  return (
    <SafeAreaView className='bg-white flex-1'>
      {/* 헤더 */}
      <View className='border-b border-gray-50'>
        <Navigation
          title={headerTitle}
          left={<ArrowLeftIcon width={18} height={18} />}
          onLeftPress={() => router.back()}
          right={
            <Pressable onPress={() => router.push('/home')}>
              <HomeIcon width={18} height={18} />
            </Pressable>
          }
          onRightPress={() => router.push('/')}
        />
      </View>

      {isLoading ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator color={colors.green[600]} />
        </View>
      ) : !ingredient ? (
        <View className='flex-1 items-center justify-center'>
          <Text className='text-gray-400'>성분 정보를 불러올 수 없습니다.</Text>
        </View>
      ) : (
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          {/* 성분명 헤더 영역 */}
          <View className='items-center pt-5 pb-5 text-center'>
            <Text className='font-n-eb'>{ingredient.name}</Text>
            {ingredient.mainIngredients ? (
              <Text className='text-c3 text-gray-400 mt-1'>
                (주성분 : {ingredient.mainIngredients})
              </Text>
            ) : null}
          </View>

          {/* 핵심 포인트 카드 */}
          <LinearGradient
            colors={['#FDFFFB', '#F5FDFE']}
            locations={[0, 0.7, 0.95, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className='mx-4 mb-[10px] rounded-2xl px-4 py-4'
            style={{
              borderWidth: 1,
              borderColor: '#82E3AF33',
            }}
          >
            <Text className='text-sm font-n-eb text-gray-800 mb-5'>
              핵심 포인트
            </Text>
            <View className='gap-y-3'>
              {keyPoints.length > 0 ? (
                keyPoints.map((point, index) => (
                  <View key={index} className='flex-row items-start gap-x-2'>
                    <Text className='text-sm mt-[1px]'>•</Text>
                    <Text className='text-sm flex-1 leading-5'>{point}</Text>
                  </View>
                ))
              ) : (
                <Text className='text-sm text-gray-400'>정보 없음</Text>
              )}
            </View>
          </LinearGradient>

          {/* 출처 링크 */}
          {sources.length > 0 ? (
            <View className='mx-[30px] mb-[50px]'>
              <Pressable onPress={() => setShowSourceModal(true)}>
                <Text className='text-xs text-gray-400 underline'>
                  출처 자세히 보기
                </Text>
              </Pressable>
            </View>
          ) : null}

          {/* 이 성분이 포함된 제품 보러가기 버튼 */}
          <View className='mx-4'>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/home/search',
                  params: { word: ingredient.name },
                })
              }
              className='flex-row items-center justify-center py-3 rounded-2xl border border-gray-200 active:bg-gray-50'
            >
              <View className='flex-row items-center mr-[10px]'>
                <Text className='text-c1 font-semibold'>
                  이 성분이 포함된 제품{' '}
                </Text>
                <Text className='text-c1 text-green-600 font-n-eb'>
                  {productCount}개
                </Text>
                <Text className='text-c1 font-semibold'> 보러가기</Text>
              </View>
              <ArrowRightIcon width={12} height={12} />
            </Pressable>
          </View>
        </ScrollView>
      )}

      <Modal
        visible={showSourceModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowSourceModal(false)}
      >
        <View className='flex-1 bg-black/60 items-center justify-center px-4'>
          <View className='bg-white rounded-[12px] justify-center max-w-xs pt-5 overflow-hidden'>
            <Text className='font-n-eb text-b-md px-5 mb-[15px]'>출처</Text>

            <View className='w-full px-5'>
              {sources.map((src, index) => (
                <View key={index} className='flex-row items-start mb-1'>
                  <Text className='text-sm text-gray-500 mr-1'>•</Text>
                  <Pressable onPress={() => Linking.openURL(src)}>
                    <Text className='text-xs text-gray-500 flex-wrap underline'>
                      {src}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
            <View className='flex-row justify-center items-center w-full border-t border-gray-100 mt-5'>
              <TouchableOpacity
                className='flex-1 py-[15px] items-center justify-center active:bg-gray-100 overflow-hidden'
                onPress={() => setShowSourceModal(false)}
                activeOpacity={0.7}
              >
                <Text className='text-b-md font-n-bd text-green-600'>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
