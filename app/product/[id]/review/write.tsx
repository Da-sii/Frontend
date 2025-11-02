import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import PhotoCameraIcon from '@/assets/icons/product/review/ic_blue_camera.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import ReviewStar from '@/components/page/product/productDetail/ReviewStar';
import colors from '@/constants/color';
import useEditMyReview from '@/hooks/my/useEditMyReview';
import { useDeleteReviewImage } from '@/hooks/product/review/image/useDeleteReviewImage';
import { useReviewImageUpload } from '@/hooks/product/review/image/useReviewImageUpload';
import useCreateReview from '@/hooks/product/review/useCreateReview';
import useProfanity from '@/hooks/useProfanity';
import { toCdnUrl } from '@/utils/cdn';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ExistingImage = { id: number; url: string };

type Picked = {
  uri: string;
  width: number;
  height: number;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

type GalleryItem =
  | { kind: 'existing'; id: number; uri: string }
  | { kind: 'new'; uri: string };

const startContent = {
  0: '선택해주세요',
  1: '별로예요',
  2: '그저 그래요',
  3: '괜찮아요',
  4: '꽤 만족해요',
  5: '최고예요',
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
  const MAX = 5;

  const { mutate: removeImage, isPending: isRemoving } = useDeleteReviewImage({
    productId: productIdNum,
    reviewId: reviewIdNum, // ✅ 훅 옵션으로 기본값 제공
  });

  const { check } = useProfanity();
  const [profanityOpen, setProfanityOpen] = useState(false);
  const productImage = (() => {
    try {
      return image
        ? (JSON.parse(image) as { id: number; url: string })
        : undefined;
    } catch {
      return undefined;
    }
  })();
  const gallery: GalleryItem[] = [
    ...existingImages.map((e) => ({
      kind: 'existing' as const,
      id: e.id,
      uri: toCdnUrl(e.url),
    })),
    ...images.map((img) => ({
      kind: 'new' as const,
      uri: img.uri,
    })),
  ];

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

  const openPicker = async () => {
    // 권한 요청 (iOS/Android)
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('권한 필요', '앨범 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // iOS 14+/Web에서 다중 선택
      selectionLimit: Math.max(0, MAX - existingImages.length - images.length),
      quality: 0.9,
      allowsEditing: false,
      exif: false,
    });

    if (result.canceled) return;

    // Expo 형식 정규화
    const next = result.assets.map((a) => ({
      uri: a.uri,
      width: a.width ?? 0,
      height: a.height ?? 0,
      fileName: a.fileName ?? a.uri.split('/').pop(),
      mimeType: a.mimeType ?? 'image/jpeg',
      fileSize: a.fileSize,
    }));

    // (선택) 용량/확장자 검증
    const filtered = next.filter((p) => {
      const okExt = /(jpe?g|png|heic)$/i.test(p.fileName ?? '');
      const okSize = (p.fileSize ?? 0) <= 5 * 1024 * 1024; // 5MB
      return okExt && okSize;
    });

    setImages((prev) => {
      // 기존 + 신규 합쳐서 MAX 넘지 않게 자르기
      const allowed = Math.max(0, MAX - existingImages.length - prev.length);
      const next = filtered.slice(0, allowed);
      return [...prev, ...next];
    });
  };

  const removeAt = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // 카메라로 촬영(1장)
  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (res.canceled) return;

    const a = res.assets[0];
    const one: Picked = {
      uri: a.uri,
      width: a.width ?? 0,
      height: a.height ?? 0,
      fileName: a.fileName ?? a.uri.split('/').pop(),
      mimeType: a.mimeType ?? 'image/jpeg',
      fileSize: a.fileSize,
    };

    //용량/확장자 검증
    const okExt = /(jpe?g|png|heic)$/i.test(one.fileName ?? '');
    const okSize = (one.fileSize ?? 0) <= 5 * 1024 * 1024; // 5MB
    if (!okExt) {
      Alert.alert('이미지 형식을 확인해 주세요. (jpg/png/heic)');
      return;
    }
    if (!okSize) {
      Alert.alert('5MB 이하의 사진만 첨부 가능합니다');
      return;
    }

    setImages((prev) => {
      const allowed = Math.max(0, MAX - existingImages.length - prev.length);
      return allowed > 0 ? [...prev, one] : prev;
    });
  };

  // iOS/Android 공통 선택창
  const handleAttachPress = () => {
    forceBlurCheck();
    if (existingImages.length + images.length >= MAX) {
      Alert.alert('사진은 최대 5개까지 첨부 가능합니다.');
      return;
    }
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '사진 찍기', '사진 보관함에서 선택'],
          cancelButtonIndex: 0,
        },
        (idx) => {
          if (idx === 1) takePhoto();
          if (idx === 2) openPicker(); // 기존 앨범 열기 함수 재사용
        },
      );
    } else {
      Alert.alert(
        '사진 첨부',
        undefined,
        [
          { text: '사진 찍기', onPress: takePhoto },
          { text: '보관함에서 선택', onPress: openPicker },
          { text: '취소', style: 'cancel' },
        ],
        { cancelable: true },
      );
    }
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
              <View className='w-[49px] aspect-square mr-[10px] border-gray-100 border rounded-[10px]'>
                {productImage ? (
                  <Image
                    source={{ uri: productImage.url }}
                    className='w-full h-full'
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

            <View className='border-y border-gray-100 py-5 flex-col items-center'>
              <View className='flex-row'>
                <Text className='text-b-sm font-n-bd text-[#FF3A4A] mr-1'>
                  *
                </Text>
                <Text className='text-h-md font-n-eb mb-[15px]'>
                  제품은 어떠셨나요?
                </Text>
              </View>
              <ReviewStar
                reviewRank={rate}
                height={24}
                gap={8}
                editable
                onChange={(newRate) => {
                  setRate(newRate);
                  if (!touched) setTouched(true);
                  setShowMinError(!isReviewValid(review));
                }}
              />
              <Text className='mt-[10px] text-c2 font-n-rg'>
                {startContent[rate as keyof typeof startContent]}
              </Text>
            </View>

            <View>
              <Text className='text-b-sm font-n-eb mb-[20px]'>
                자세한 제품 리뷰를 남겨주세요
              </Text>
              {/* 내용 입력 */}

              <View className='border border-gray-100 rounded-[12px] p-[15px] pb-[40px] h-[150px] text-b-md relative'>
                <TextInput
                  placeholder={`사용하신 제품에 대한 효과나\n양/부작용/섭취 팁 등에 대해 남겨주세요!`}
                  value={review}
                  onChangeText={(t) => {
                    if (t.trim().length <= 1000) {
                      setReview(t);
                    }
                    // TextField(menu=2)와 동일: blur 이후에는 입력 변화 즉시 유효/무효 반영
                    if (touched) setShowMinError(!isReviewValid(t));
                    else if (showMinError) setShowMinError(false); // blur 전에는 숨김
                  }}
                  onBlur={() => {
                    setTouched(true);
                    setShowMinError(!isReviewValid(review));
                  }}
                  onEndEditing={() => {
                    setTouched(true);
                    setShowMinError(!isReviewValid(review));
                  }}
                  multiline
                />
                {touched && showMinError && (
                  <Text className='mt-2 text-c3 font-n-rg text-[#FF3A4A] absolute bottom-[15px] left-[20px]'>
                    최소 20자 이상 입력해 주세요.
                  </Text>
                )}
              </View>

              <View className='flex-row items-center absolute bottom-[15px] right-5'>
                <Text className='text-c3 font-n-bd text-gray-700'>
                  {review.length}
                </Text>
                <Text className='text-c3 font-n-rg text-gray-400'>
                  {' '}
                  / 1,000 (최소 20자)
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleAttachPress}
              className='h-[50px] rounded-[12px] items-center justify-center bg-white border border-blue-600 flex-row'
            >
              <PhotoCameraIcon className='mr-2' />
              <Text className='text-b-md font-n-bd text-blue-600'>
                사진 첨부하기
              </Text>
            </Pressable>

            {/* ✅ 기존+신규 한 줄 갤러리 */}
            {gallery.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className='mt-4'
                contentContainerStyle={{ gap: 8 }}
              >
                {gallery.map((item) => (
                  <View
                    key={
                      item.kind === 'existing'
                        ? `ex-${item.id}`
                        : `new-${item.uri}`
                    }
                    className='relative'
                  >
                    <Image
                      source={{ uri: item.uri }}
                      className='w-[100px] h-[100px] rounded-[10px] bg-gray-100'
                    />
                    <Pressable
                      disabled={
                        item.kind === 'existing' &&
                        (isRemoving || deletingId === item.id)
                      }
                      onPress={() => {
                        if (item.kind === 'existing') {
                          if (!Number.isFinite(reviewIdNum)) {
                            Alert.alert(
                              '삭제 실패',
                              '리뷰 정보가 올바르지 않습니다.',
                            );
                            return;
                          }
                          setDeletingId(item.id);
                          removeImage(
                            { imageId: item.id, productId: productIdNum }, // reviewId는 훅 옵션 기본값 사용
                            {
                              onSuccess: () => {
                                setExistingImages((prev) =>
                                  prev.filter((e) => e.id !== item.id),
                                );
                              },
                              onSettled: () => setDeletingId(null),
                              onError: () => {
                                Alert.alert(
                                  '삭제 실패',
                                  '이미지 삭제에 실패했습니다.',
                                );
                              },
                            },
                          );
                        } else {
                          // 신규(로컬) 이미지 삭제
                          setImages((prev) =>
                            prev.filter((p) => p.uri !== item.uri),
                          );
                        }
                      }}
                      className='absolute top-2 right-2 w-[18px] h-[18px] rounded-full bg-black/50 items-center justify-center'
                    >
                      <Text className='text-white text-xs'>
                        {item.kind === 'existing' && deletingId === item.id
                          ? '…'
                          : '✕'}
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}

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
              label={isEdit ? '리뷰 수정하기' : '리뷰 등록하기'}
              onPress={() => {
                forceBlurCheck();
                onSubmit();
              }}
              disabled={!canSubmit || isPending || isUpdating || isUploading}
            />
          </View>
          <DefaultModal
            visible={profanityOpen}
            title='리뷰 등록이 불가합니다.'
            message='비속어 또는 부적절한 표현이 포함되어 있습니다. 수정 후 다시 시도해주세요.'
            onConfirm={() => setProfanityOpen(false)}
            singleButton
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    // </TouchableWithoutFeedback>
  );
}
