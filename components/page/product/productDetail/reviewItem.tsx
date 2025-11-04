import MoreIcon from '@/assets/icons/product/productDetail/ic_more_line.svg';
import DefaultModal from '@/components/common/modals/DefaultModal';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextLayoutEventData,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { LongButton } from '@/components/common/buttons/LongButton';
import BottomSheetLayout from '@/components/page/product/productDetail/BottomSeetLayout';
import { useIsLoggedIn } from '@/hooks/auth/useIsLoggedIn';
import { useReportReview } from '@/hooks/useReportReview';
import { useUser } from '@/hooks/useUser';
import { ReportReason } from '@/services/report';
import { toCdnUrl } from '@/utils/cdn';
import ReviewStar from './ReviewStar';

interface reviewItem {
  id: number;
  reviewId?: number;
  name: string;
  company?: string;
  product_name?: string;
  date: string;
  isEdited: boolean;
  content: string;
  rating: number;
  images: any[];
  product_image?: string;
}

interface reviewItemProups {
  reviewItem: reviewItem;
  onMorePress?: () => void;
  isPhoto?: boolean;
  isMore?: boolean;
  id?: string;
  isMyReview?: boolean;
  enableBottomSheet?: boolean;
}

type SheetView = 'menu' | 'report';

const REASON_LABELS = [
  '제품과 관련 없는 이미지 / 내용',
  '제품 미사용 / 리뷰 내용과 다른 제품 선택',
  '광고 홍보 / 거래 시도',
  '욕설, 비속어가 포함된 내용',
  '개인 정보 노출',
] as const;

// 서버 API 코드 매핑
const REASON_CODES: Record<(typeof REASON_LABELS)[number], ReportReason> = {
  '제품과 관련 없는 이미지 / 내용': 'IRRELEVANT',
  '제품 미사용 / 리뷰 내용과 다른 제품 선택': 'MISMATCH',
  '광고 홍보 / 거래 시도': 'PROMOTION',
  '욕설, 비속어가 포함된 내용': 'ABUSE',
  '개인 정보 노출': 'PRIVACY',
};

export default function ReviewItems({
  reviewItem,
  isPhoto = true,
  isMore = true,
  id,
  isMyReview,
  enableBottomSheet,
}: reviewItemProups) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { blockReview } = useUser();
  const idNum = Number(id);
  const [isOpen, setIsOpen] = useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const [sheetView, setSheetView] = useState<SheetView>('menu');
  const [selected, setSelected] = useState<number | null>(null);
  const isLoggedIn = useIsLoggedIn();

  const { mutate: report, isPending } = useReportReview();
  const photoViewerKey = (token: string) => ['photoViewer', token] as const;
  const MAX_LINES = 5;
  const MAX_HEIGHT = 100;

  // ===== BottomSheet =====
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [300], [414]);

  const navigateToEmergencyLogin = (href: string) => {
    closeSheet();
    requestAnimationFrame(() => {
      router.push(href as any);
    });
  };

  const openSheet = () => {
    setSheetView('menu'); // 항상 메뉴부터
    sheetRef.current?.snapToIndex?.(0); // 첫 스냅으로 열기
  };
  const closeSheet = () => sheetRef.current?.close();

  const goReport = () => {
    if (!isLoggedIn) {
      navigateToEmergencyLogin('/auth/login/emergency');
      return;
    }
    setSheetView('report');
    sheetRef.current?.snapToIndex(1);
  };

  const goBlock = () => {
    if (!isLoggedIn) {
      navigateToEmergencyLogin('/auth/login/emergency');
      return;
    }
    setIsBlockModalVisible(true);
  };

  const submitReport = async () => {
    if (!isLoggedIn) {
      navigateToEmergencyLogin('/auth/login/emergency');
      return;
    }
    if (selected == null) return;
    const label = REASON_LABELS[selected];
    const reason = REASON_CODES[label];

    if (isPending) return;

    report(
      { reviewId: reviewItem.id, reason },
      {
        onSuccess: () => {
          setSelected(null);
          closeSheet();
        },
      },
    );

    closeSheet();
  };

  const { mutate: blockUserMutate, isPending: isBlocking } = useMutation({
    mutationFn: (reviewId: number) => blockReview(reviewId),
    onSuccess: () => {
      setIsBlockModalVisible(false);

      queryClient.invalidateQueries({
        queryKey: ['product', 'reviews', idNum, 'time'],
      });
      queryClient.invalidateQueries({
        queryKey: ['product', 'ratingStats', idNum],
      });
      queryClient.invalidateQueries({
        queryKey: ['product', 'detail', idNum],
      });
      queryClient.invalidateQueries({
        queryKey: ['review', 'imageList', idNum],
      });
    },
    onError: (error) => {
      console.error('리뷰 차단 실패:', error);
      setIsBlockModalVisible(false);
    },
  });

  const onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (measured) return;
      const lines = e.nativeEvent.lines ?? [];
      const totalHeight = lines.reduce((sum, l) => sum + (l.height ?? 0), 0);
      const shouldClamp = lines.length > MAX_LINES || totalHeight > MAX_HEIGHT;

      setNeedsClamp(shouldClamp);
      setMeasured(true);
    },
    [measured],
  );

  // ====== 이미지 가로 스크롤 세팅 ======
  const THUMB = 100; // 썸네일 한 변(px)
  const GAP = 12; // 카드 간격(px)

  // reviewItem.images가 string[]/object[] 혼용일 수 있으니 URL로 정규화
  const imageKeys: string[] = (reviewItem.images ?? [])
    .map((it: any) => (typeof it === 'string' ? it : (it?.url ?? '')))
    .filter(Boolean);

  return (
    <View className='w-full p-5'>
      <View
        className={`flex-row ${isMyReview ? 'justify-start' : 'justify-between'} mb-[19px]`}
      >
        {isMyReview && (
          <Image
            source={{ uri: reviewItem.product_image ?? '' }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: '#E4E6E7',
            }}
            resizeMode='cover'
            className='mr-2 '
          />
        )}
        <View className='flex-col flex-1'>
          {isMyReview && (
            <Text numberOfLines={1} className='mb-[5px] text-xs color-gray-500'>
              {reviewItem.company}
            </Text>
          )}
          <Text numberOfLines={1} className='mb-[5px]'>
            {reviewItem.name}
          </Text>
          {!isMyReview && (
            <View className='flex-row items-center'>
              <ReviewStar height={12} reviewRank={reviewItem.rating} />
              <Text className='border-l ml-1 pl-1 border-[#E4E6E7] text-c3 font-n-bd text-gray-300'>
                {reviewItem.date}
                {reviewItem.isEdited && '  수정됨'}
              </Text>
            </View>
          )}
        </View>
        {!isMyReview && !enableBottomSheet && (
          <Pressable onPress={openSheet} hitSlop={8} className='my-auto'>
            <MoreIcon className='my-auto' />
          </Pressable>
        )}
      </View>
      {isMyReview && (
        <View className='flex-row items-center pb-2'>
          <ReviewStar height={12} reviewRank={reviewItem.rating} />
          <Text className='border-l ml-1 pl-1 border-[#E4E6E7] text-c3 font-n-rg text-gray-300'>
            {reviewItem.date}
            {reviewItem.isEdited && ' 수정됨'}
          </Text>
        </View>
      )}
      <View>
        <Text
          className='text-[13px] font-n-rg'
          numberOfLines={
            isMore && !isOpen && needsClamp ? MAX_LINES : undefined
          }
          ellipsizeMode='tail'
          onTextLayout={onTextLayout}
        >
          {reviewItem.content}
        </Text>

        {needsClamp && isMore && (
          <Pressable
            onPress={() => setIsOpen((v) => !v)}
            accessibilityRole='button'
            accessibilityLabel={isOpen ? '접기' : '더보기'}
            className='mt-[7px] self-start '
            hitSlop={8}
          >
            <Text className='text-c2 font-regular text-gray-400'>
              {isOpen ? '접기' : '더보기'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* 이미지: 가로 스크롤 썸네일 리스트 */}
      {imageKeys.length > 0 && isPhoto && (
        <FlatList
          className='mt-3'
          data={imageKeys}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_: any, idx: number) => `img-${idx}`}
          // 좌우 여백과 아이템 간 간격
          contentContainerStyle={{}}
          ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
          // 스냅(옵션): 카드 하나 단위로 착 붙게
          snapToInterval={THUMB + GAP}
          decelerationRate='fast'
          snapToAlignment='start'
          // iOS에서 스냅 부드럽게(옵션)
          // pagingEnabled={false}
          renderItem={({ item, index }: { item: string; index: number }) => (
            <Pressable
              onPress={() => {
                const images = imageKeys.map(toCdnUrl);
                const token = `${Date.now()}-${Math.random()}`;
                queryClient.setQueryData(photoViewerKey(token), images);

                router.push({
                  pathname: '/product/[id]/review/photo/viewer',
                  params: {
                    id: String(id),
                    token,
                    index: String(index),
                  },
                });
              }}
              className='rounded-[12px] overflow-hidden'
              style={{ width: THUMB, height: THUMB }}
            >
              <Image
                source={{ uri: toCdnUrl(item) }}
                resizeMode='cover'
                style={{ width: '100%', height: '100%' }}
              />
            </Pressable>
          )}
        />
      )}

      {/* 신고하기 */}
      <BottomSheetLayout snapPoints={snapPoints} sheetRef={sheetRef}>
        {sheetView === 'menu' ? (
          // ===== 메뉴 화면 =====
          <View className='px-5 pt-[30px] pb-[44px]'>
            <Pressable onPress={goReport} hitSlop={8}>
              <Text className='text-b-sm font-n-bd mb-[25px]'>신고하기</Text>
            </Pressable>
            <Pressable onPress={goBlock} hitSlop={8}>
              <Text className='text-b-sm font-n-bd mb-[25px]'>
                리뷰 차단하기
              </Text>
            </Pressable>
            <Pressable onPress={closeSheet} hitSlop={8}>
              <Text className='text-b-sm font-n-bd text-gray-400'>닫기</Text>
            </Pressable>
          </View>
        ) : (
          // ===== 신고 사유 선택 화면 =====
          <View className='px-5 pt-[30px] pb-[45px]'>
            <View className='flex-row items-center justify-between'>
              <Text className='text-b-md font-n-eb text-gray-700 mb-[25px]'>
                이 리뷰를 신고하는 이유가 무엇인가요?
              </Text>
            </View>

            <View className='gap-y-[25px] mb-[25px]'>
              {REASON_LABELS.map((label, idx) => {
                const checked = selected === idx;
                return (
                  <Pressable
                    key={idx}
                    onPress={() => setSelected(idx)}
                    className='flex-row items-center '
                    hitSlop={8}
                  >
                    <Svg width={18} height={18} viewBox='0 0 18 18' fill='none'>
                      <Path
                        d='M16.5 4.5L6.5 15L1.5 9'
                        stroke={checked ? '#181A1B' : '#C9CDD2'}
                        strokeWidth={1.5}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </Svg>

                    <Text
                      className={`ml-[13px] font-n-bd text-b-sm ${
                        !checked && 'text-b-sm text-gray-400'
                      }`}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <LongButton
              label={isPending ? '신고 처리 중…' : '리뷰 신고 완료'}
              onPress={submitReport}
              disabled={selected === null || isPending}
            />
          </View>
        )}
      </BottomSheetLayout>

      <DefaultModal
        visible={isBlockModalVisible}
        onConfirm={() => {
          if (isBlocking) return;
          blockUserMutate(reviewItem.id);
        }}
        onCancel={() => {
          setIsBlockModalVisible(false);
        }}
        title='해당 리뷰를 차단하시겠습니까?'
        message={`해당 유저가 작성한 모든 리뷰를 \n 더 이상 확인할 수 없습니다.`}
        confirmText='확인'
        cancelText='취소'
      />
    </View>
  );
}
