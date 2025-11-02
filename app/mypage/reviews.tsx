import BackIcon from '@/assets/icons/ic_arrow_left.svg';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import ReviewItems from '@/components/page/product/productDetail/reviewItem'; // 실제 경로로 수정
import { useDeleteReview } from '@/hooks/my/useDeleteMyReview';
import { useGetMyReview } from '@/hooks/my/useGetMyReview';
import { useState } from 'react';

import { MyReview } from '@/services/my/getReviewList';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

  const [showDeleteCheckModal, setShowDeleteCheckModal] = useState(false);
  const [targetReviewId, setTargetReviewId] = useState<number | null>(null);
  const { mutate: deleteReview } = useDeleteReview({
    onSuccessInvalidateKeys: () => [
      ['my', 'reviews'], // ← 실제 키와 일치시키기
    ],
  });

  const keyExtractor = useCallback((item: MyReview, idx: number) => {
    // review_id가 있으면 그걸로만
    if (item.review_id != null) return String(item.review_id);
    // 없으면 안전한 고유키
    return `${item.nickname}-${item.date}-${idx}`;
  }, []);

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const flatReviews = myReviews?.pages?.flat() ?? [];

  const renderItem = ({ item }: { item: MyReview }) => {
    const images: string[] = Array.isArray(item.images)
      ? item.images.map((img: any) =>
          typeof img === 'string' ? img : img?.url,
        )
      : [];

    const canDelete = item.review_id != null;

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
              if (item.review_id == null) return;

              router.push({
                pathname: '/product/[id]/review/write', // ReviewWritePage 경로
                params: {
                  id: String(item.product_info?.id ?? ''),
                  mode: 'edit',
                  reviewId: String(item.review_id),
                  imageId: String(item.product_info?.image.id ?? ''),
                  name: item.product_info?.name ?? '',
                  brand: item.product_info?.company ?? '',
                  image: JSON.stringify(item.product_info?.image ?? {}),
                  initRate: String(item.rate ?? 0),
                  initReview: item.review ?? '',
                  initImages: JSON.stringify(
                    Array.isArray(item.images) ? item.images : [],
                  ),
                },
              });
            }}
          >
            <Text className='text-xs'>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-1 px-4 border rounded-full ml-2 items-center ${
              canDelete ? 'border-gray-200' : 'border-gray-100 opacity-50'
            }`}
            disabled={!canDelete}
            onPress={() => {
              setShowDeleteCheckModal(true);
              setTargetReviewId(item.review_id!);
            }}
          >
            <Text className='text-xs'>삭제</Text>
          </TouchableOpacity>
        </View>
        <DefaultModal
          visible={targetReviewId !== null}
          title='리뷰를 삭제하시겠습니까?'
          message='소중하게 남겨주신 리뷰는 삭제 후 복구 불가합니다.'
          secondMessage='정말 삭제하시겠습니까?'
          onConfirm={() => {
            if (targetReviewId == null) return;
            deleteReview(targetReviewId);
            setTargetReviewId(null);
          }}
          onCancel={() => setTargetReviewId(null)}
          confirmText='확인'
          cancelText='취소'
        />
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

  return (
    <View className='flex-1 bg-white px-4'>
      <Navigation
        title='내가 쓴 리뷰'
        left={<BackIcon width={17} height={17} />}
        onLeftPress={() => router.back()}
      />

      <FlatList
        data={flatReviews}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <Text className='px-1 pt-4 pb-2 text-base font-n-bd'>
            {flatReviews.length ?? 0}개의 리뷰를 작성했어요!
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
