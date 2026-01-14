import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import colors from '@/constants/color';
import useEditMyReview from '@/hooks/my/useEditMyReview';
import { useDeleteReviewImage } from '@/hooks/product/review/image/useDeleteReviewImage';
import { useReviewImageUpload } from '@/hooks/product/review/image/useReviewImageUpload';
import useCreateReview from '@/hooks/product/review/useCreateReview';
import useProfanity from '@/hooks/useProfanity';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReviewPhotoSection from './writeSections/ReviewPhotoSection';
import ReviewStarSection from './writeSections/ReviewStarSection';
import ReviewTextSection from './writeSections/ReviewTextSection';

type ExistingImage = { id: number; url: string };

type Picked = {
  uri: string;
  width: number;
  height: number;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

export default function ReviewWritePage() {
  const router = useRouter();
  const safeParse = <T,>(s: string | undefined, fallback: T): T => {
    try {
      return s ? (JSON.parse(s) as T) : fallback;
    } catch {
      return fallback;
    }
  };
  const {
    id,
    name,
    brand,
    image,
    mode,
    reviewId,
    initRate,
    initReview,
    initImages,
  } = useLocalSearchParams<{
    id: string;
    name?: string;
    brand?: string;
    image?: string; // JSON string of { id: number; url: string }
    mode?: 'create' | 'edit';
    reviewId?: string;
    initRate?: string;
    initReview?: string;
    initImages?: string; // JSON string
  }>();

  const productIdNum = Number(id);
  const reviewIdNum = reviewId ? Number(reviewId) : NaN;
  const isEdit = mode === 'edit' && Number.isFinite(reviewIdNum);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [images, setImages] = useState<Picked[]>([]);

  const originalExisting = safeParse<ExistingImage[]>(initImages, []);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    isEdit ? originalExisting : [],
  );

  const { mutate: removeImage, isPending: isRemoving } = useDeleteReviewImage({
    productId: productIdNum,
    reviewId: reviewIdNum, // ✅ 훅 옵션으로 기본값 제공
  });

  const { check } = useProfanity();
  const [profanityOpen, setProfanityOpen] = useState(false);

  const [rate, setRate] = useState<number>(isEdit ? Number(initRate ?? 0) : 0);
  const [review, setReview] = useState<string>(
    isEdit ? (initReview ?? '') : '',
  );

  const [showMinError, setShowMinError] = useState(false);
  const [touched, setTouched] = useState(false);
  const { mutateAsync: createReviewMutate, isPending } = useCreateReview(
    Number(id),
  );
  const { upload, isUploading } = useReviewImageUpload();
  const { mutateAsync: editReviewMutate, isPending: isUpdating } =
    useEditMyReview(reviewIdNum, { productId: productIdNum });

  const isLoading = isUpdating || isUploading || isPending;

  const isReviewValid = (text: string) => text.trim().length >= 20;
  const canSubmit =
    Number.isFinite(rate) && rate >= 1 && rate <= 5 && isReviewValid(review);

  const onSubmit = async () => {
    const { isProfane } = check(review);
    if (isProfane) {
      setProfanityOpen(true); // 모달 오픈
      return; // 등록 막기
    }

    if (!canSubmit) return;
    try {
      if (!isEdit) {
        // ========== CREATE ==========
        const created = await createReviewMutate({
          rate,
          review: review.trim(),
        });
        const newId = created?.review_id;
        if (!newId) throw new Error('리뷰 생성 실패: review_id 없음');

        if (images.length) await upload(newId, images);
        router.push(`/product/${id}/review/success`);
        return;
      }

      // ========== UPDATE ==========

      await editReviewMutate({
        rate,
        review: review.trim(),
      });

      if (images.length) {
        await upload(reviewIdNum, images); // 신규 파일 업로드
      }

      router.back();
    } catch (e) {}
  };

  const forceBlurCheck = () => {
    Keyboard.dismiss();
    if (!touched) setTouched(true);
    setShowMinError(!isReviewValid(review));
  };

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        title={isEdit ? '리뷰 수정' : '리뷰 작성'}
        left={<ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />}
        onLeftPress={() => {
          forceBlurCheck();
          router.back();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        className='flex-1 bg-white'
      >
        <ScrollView
          className='flex-1'
          keyboardShouldPersistTaps='handled' // 입력 중에도 스크롤/탭 동작 허용
          keyboardDismissMode='on-drag' // 드래그하면 키보드 닫기
          nestedScrollEnabled
          contentContainerStyle={{
            padding: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className='gap-y-4'>
            <View className='flex-row'>
              <View className='w-[49px] aspect-square mr-[10px] border-gray-100 border rounded-[10px] '>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    className='w-full h-full rounded-[10px]'
                  />
                ) : (
                  <View className='border-gray-100 w-full h-full items-center justify-center'>
                    <Text className='text-b-lg font-n-bd text-gray-500'>?</Text>
                  </View>
                )}
              </View>

              <View className='py-1 flex-1'>
                <Text
                  className='text-c2 text-gray-500 mb-[7px]'
                  ellipsizeMode='tail'
                  numberOfLines={1}
                >
                  {brand}
                </Text>
                <Text
                  className='text-b-sm font-n-bd'
                  ellipsizeMode='tail'
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </View>
            </View>
            {/* 별점 */}
            <ReviewStarSection
              rate={rate}
              review={review}
              touched={touched}
              setTouched={setTouched}
              setShowMinError={setShowMinError}
              isReviewValid={isReviewValid}
              onChange={setRate}
            />

            {/* 텍스트리뷰 */}
            <ReviewTextSection
              review={review}
              setReview={setReview}
              touched={touched}
              setTouched={setTouched}
              showMinError={showMinError}
              setShowMinError={setShowMinError}
              isReviewValid={isReviewValid}
            />
            {/* 사진 */}
            <ReviewPhotoSection
              existingImages={existingImages}
              setExistingImages={setExistingImages}
              images={images}
              setImages={setImages}
              deletingId={deletingId}
              onDeleteExisting={(imageId) => {
                setDeletingId(imageId);
                removeImage(
                  { imageId, productId: productIdNum },
                  {
                    onSuccess: () =>
                      setExistingImages((prev) =>
                        prev.filter((e) => e.id !== imageId),
                      ),
                    onSettled: () => setDeletingId(null),
                  },
                );
              }}
            />

            <View className='p-[13px] bg-gray-50 rounded-[12px] '>
              <View className='flex-row items-start mb-[5px]'>
                <Text className='mr-1 text-c3 font-n-rg text-gray-400'>•</Text>
                <Text className='flex-1 text-c3 font-n-rg text-gray-400'>
                  상품과 무관하거나 비속어 및 음란물이 포함된 사진 및 리뷰는
                  통보 없이 삭제처리 될 수 있으며 고지 없이 경고 조치 됩니다.
                </Text>
              </View>
              <View className='flex-row items-start'>
                <Text className='mr-1 text-c3 font-n-rg text-gray-400'>•</Text>
                <Text className='flex-1 text-c3 font-n-rg text-gray-400'>
                  경고 누적 시 리뷰 작성이 제한될 수 있습니다.
                </Text>
              </View>
            </View>
          </View>
          <View className='mb-7 mt-[59px]'>
            <LongButton
              label={isEdit ? '리뷰 수정' : '리뷰 등록'}
              onPress={() => {
                forceBlurCheck();
                onSubmit();
              }}
              disabled={!canSubmit || isLoading}
            />
          </View>
          <DefaultModal
            visible={profanityOpen}
            title='리뷰 등록이 불가합니다.'
            message={
              '비속어 또는 부적절한 표현이 포함되어 있습니다.\n수정 후 다시 시도해주세요.' // TODO: 추후 모달 리팩토링후 \n말고 다른 방식으로 입력
            }
            onConfirm={() => setProfanityOpen(false)}
            singleButton
          />
        </ScrollView>
      </KeyboardAvoidingView>
      {isLoading && (
        <View
          pointerEvents='auto'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <LoadingSpinner />
        </View>
      )}
    </SafeAreaView>
    // </TouchableWithoutFeedback>
  );
}
