// app/mypage/review.tsx
import ReviewItems from '@/components/page/product/productDetail/reviewItem'; // 실제 경로로 수정
import { useGetMyReview } from '@/hooks/my/useGetMyReview';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
<<<<<<< HEAD
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { MyReview } from '@/services/my/getReviewList';
import DefaultModal from '@/components/common/modals/DefaultModal';
import { useState } from 'react';
import { useDeleteReview } from '@/hooks/my/useDeleteMyReview';
export default function MyReviews() {
  const router = useRouter();
  const { data: myReviews } = useGetMyReview();
  const [showDeleteCheckModal, setShowDeleteCheckModal] = useState(false);
  const { mutate: deleteReview } = useDeleteReview();
  const renderItem = ({ item }: { item: MyReview }) => (
    <View className='border-b border-gray-100'>
      <ReviewItems
        reviewItem={{
          id: item.nickname ?? '',
          name: item.nickname ?? '',
          date: item.date ?? '-',
          isEdited: false,
          content: item.review ?? '',
          rating: item.rate ?? 0,
          images: item.images ?? [],
        }}
        isMyReview={true}
        id={item.nickname}
      />

      <View className='flex-row px-4 pb-4'>
        <TouchableOpacity
          className='p-1 px-4 border border-gray-200 rounded-full items-center'
          onPress={() => {}}
        >
          <Text className='text-xs'>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='p-1 px-4 border border-gray-200 rounded-full ml-2 items-center'
          onPress={() => {
            console.log('삭제:', item.nickname);
            setShowDeleteCheckModal(true);
          }}
        >
          <Text className='text-xs'>삭제</Text>
        </TouchableOpacity>
      </View>
      <DefaultModal
        visible={showDeleteCheckModal}
        title='리뷰를 삭제하시겠습니까?'
        message='소중하게 남겨주신 리뷰는 삭제 후 복구 불가합니다.'
        secondMessage='정말 삭제하시겠습니까?'
        onConfirm={() => {
          // deleteReview(); 리뷰아이디 필요
        }}
        onCancel={() => {
          setShowDeleteCheckModal(false);
        }}
        confirmText='확인'
        cancelText='취소'
      />
    </View>
  );
=======
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MyReview } from '@/services/my/getReviewList';
import { useCallback } from 'react';

export default function MyReviews() {
  const router = useRouter();
  const {
    data: myReviews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useGetMyReview(0);

  const keyExtractor = useCallback((item: MyReview, idx: number) => {
    return String(
      item.review_id ??
        item.review_id ??
        `${item.nickname}-${item.date}-${idx}`,
    );
  }, []);

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const flatReviews = myReviews?.pages?.flat() ?? [];
  console.log('flatReviews', flatReviews);

  const renderItem = ({ item }: { item: MyReview }) => {
    const images: string[] = Array.isArray(item.images)
      ? item.images.map((img: any) =>
          typeof img === 'string' ? img : img?.url,
        )
      : [];

    console.log('images', images);
    return (
      <View className='border-b border-gray-100'>
        <ReviewItems
          reviewItem={{
            id: item.review_id ?? 0,
            company: item.product_info.company ?? '',
            name: item.product_info.name ?? '',
            date: item.date ?? '-',
            isEdited: false,
            content: item.review ?? '',
            rating: item.rate ?? 0,
            images,
          }}
          isMyReview={true}
        />

        <View className='flex-row px-4 pb-4'>
          <TouchableOpacity
            className='p-1 px-4 border border-gray-200 rounded-full items-center'
            onPress={() => {
              console.log('수정:', item.nickname);
            }}
          >
            <Text className='text-xs'>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='p-1 px-4 border border-gray-200 rounded-full ml-2 items-center'
            onPress={() => {
              console.log('삭제:', item.nickname);
            }}
          >
            <Text className='text-xs'>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator />
      </View>
    );
  }
>>>>>>> c79eb88 (feat: 마이페이지 내가 쓴 리뷰 조회 api 연동)

  return (
    <View className='flex-1 bg-white px-4'>
      <Stack.Screen
        options={{
          headerTitle: '내가 쓴 리뷰',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className='px-4'>
              <Ionicons name='chevron-back' size={24} color='#333' />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />

      <FlatList
<<<<<<< HEAD
        data={myReviews ?? []}
        keyExtractor={(item) => item.nickname}
        ListHeaderComponent={
          <Text className='px-4 pt-4 pb-2 text-base font-medium'>
            {myReviews?.length ?? 0}개의 리뷰를 작성했어요!
=======
        data={flatReviews}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <Text className='px-4 pt-4 pb-2 text-base font-medium'>
            {flatReviews.length ?? 0}개의 리뷰를 작성했어요!
>>>>>>> c79eb88 (feat: 마이페이지 내가 쓴 리뷰 조회 api 연동)
          </Text>
        }
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => (
          <View className='h-[0.5px] bg-gray-100' />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className='py-4'>
              <ActivityIndicator />
            </View>
          ) : null
        }
        refreshing={isRefetching}
        onRefresh={refetch}
      />
    </View>
  );
}
