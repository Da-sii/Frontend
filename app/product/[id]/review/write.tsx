import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import PhotoCameraIcon from '@/assets/icons/product/review/ic_blue_camera.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import Navigation from '@/components/layout/Navigation';
import ReviewStar from '@/components/page/product/productDetail/ReviewStar';
import colors from '@/constants/color';
import { mockProductData } from '@/mocks/data/productDetail';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useCreateReview from '@/hooks/product/review/useCreateReview';
import { useReviewImageUpload } from '@/hooks/product/review/image/useReviewImageUpload';

type Picked = {
  uri: string;
  width: number;
  height: number;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

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
  const { id, name, brand, image } = useLocalSearchParams<{
    id: string;
    name?: string;
    brand?: string;
    image?: string; // URL만
  }>();
  const [rate, setRate] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const product = mockProductData.find((item) => item.id === id);
  const [images, setImages] = useState<Picked[]>([]);
  const { mutateAsync: createReviewMutate, isPending } = useCreateReview(
    Number(id),
  );
  const { upload, isUploading, progress, error, cancel } =
    useReviewImageUpload();

  const canSubmit =
    Number.isFinite(rate) &&
    rate >= 1 &&
    rate <= 5 &&
    review.trim().length >= 20;

  const onSubmit = async () => {
    if (!canSubmit) return;
    try {
      // 1) 리뷰 생성 → review_id 확보
      const created = await createReviewMutate({ rate, review: review.trim() });
      const reviewId = created?.review_id;
      if (!reviewId) throw new Error('리뷰 생성 실패: review_id 없음');
      // 2) 이미지 있으면 업로드
      if (images.length) {
        await upload(reviewId, images);
      }

      router.push(`/product/${id}/review/success`);
    } catch (e) {
      console.log('리뷰업로드실패: ', e);
    }
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
      selectionLimit: 5 - images.length, // 최대 5장 예시
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
    console.log(filtered);

    setImages((prev) => {
      const merged = [...prev, ...filtered];
      return merged.slice(0, 5); // 총 5장 제한
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

    setImages((prev) => [...prev, one].slice(0, 5));
  };

  // iOS/Android 공통 선택창
  const handleAttachPress = () => {
    if (images.length >= 5) {
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

  //   const upload = async () => {
  //     // 서버 스펙에 맞게 FormData로 업로드
  //     const fd = new FormData();
  //     images.forEach((img, i) => {
  //       fd.append('images', {
  //         // @ts-ignore: React Native FormData file shape
  //         uri: img.uri,
  //         name: img.fileName ?? `photo_${i}.jpg`,
  //         type: img.mimeType ?? 'image/jpeg',
  //       });
  //     });

  //     // 예시: 리뷰와 함께 전송
  //     fd.append('rating', String(5));
  //     fd.append('content', '리뷰 내용');

  //     try {
  //       const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reviews`, {
  //         method: 'POST',
  //         headers: {
  //           // 주의: RN에서 multipart는 Content-Type 수동 지정 X (자동으로 boundary 붙음)
  //           Authorization: `Bearer YOUR_TOKEN`,
  //         },
  //         body: fd,
  //       });
  //       if (!res.ok) throw new Error('업로드 실패');
  //       alert('등록 완료!');
  //     } catch (e: any) {
  //       alert(e.message ?? '에러');
  //     }
  //   };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <Stack.Screen options={{ headerShown: false }} />
      <Navigation
        title='리뷰 작성'
        left={<ArrowLeftIcon width={20} height={20} fill={colors.gray[900]} />}
        onLeftPress={() => router.back()}
      />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        className='flex-1 bg-white'
      >
        <ScrollView
          className='flex-1'
          keyboardShouldPersistTaps='handled'
          nestedScrollEnabled
          contentContainerStyle={{
            padding: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className='gap-y-4'>
            <View className='flex-row'>
              <View className=' w-[14%] aspect-square mr-[10px] border-gray-100 border rounded-[10px]'>
                {product?.image ? (
                  typeof product.image === 'string' ? (
                    <Image source={{ uri: image }} className='w-full h-full' />
                  ) : (
                    <Image
                      source={product.image as any}
                      className='w-full h-full'
                    />
                  )
                ) : (
                  <View className='border-gray-100 w-full h-full items-center justify-center'>
                    <Text className='text-b-lg font-bold text-gray-500'>?</Text>
                  </View>
                )}
              </View>

              <View className='gap-y-[7px] flex-1'>
                <Text
                  className='text-c2 text-gray-500'
                  ellipsizeMode='tail'
                  numberOfLines={1}
                >
                  {brand}
                </Text>
                <Text
                  className='text-b-sm font-bold'
                  ellipsizeMode='tail'
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </View>
            </View>

            <View className='border-y border-gray-100 py-5 flex-col items-center'>
              <View className='flex-row'>
                <Text className='text-b-sm font-bold text-[#FF3A4A] mr-1'>
                  *
                </Text>
                <Text className='text-h-md font-extrabold mb-[15px]'>
                  제품은 어떠셨나요?
                </Text>
              </View>
              <ReviewStar
                reviewRank={rate}
                height={24}
                gap={8}
                editable
                onChange={setRate}
              />
              <Text className='mt-[10px] text-c2 font-regular'>
                {startContent[rate as keyof typeof startContent]}
              </Text>
            </View>

            <View>
              <Text className='text-b-sm font-extrabold mb-[20px]'>
                자세한 제품 리뷰를 남겨주세요
              </Text>
              {/* 내용 입력 */}

              <View className='border border-gray-100 rounded-[12px] p-[15px] pb-[40px] h-[150px] text-b-md relative'>
                <TextInput
                  placeholder={`사용하신 제품에 대한 효과나\n양/부작용/섭취 팁 등에 대해 남겨주세요!`}
                  value={review}
                  onChangeText={setReview}
                  multiline
                />
              </View>

              <View className='flex-row items-center absolute bottom-[15px] right-5'>
                <Text className='text-c3 font-bold text-gray-700'>
                  {review.length}
                </Text>
                <Text className='text-c3 font-regular text-gray-400'>
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
              <Text className='text-b-md font-bold text-blue-600'>
                사진 첨부하기
              </Text>
            </Pressable>

            {images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className='mt-4'
                contentContainerStyle={{ gap: 8 }}
              >
                {images.map((img, idx) => (
                  <View key={idx} className='relative'>
                    <Image
                      source={{ uri: img.uri }}
                      className='w-[100px] h-[100px] rounded-[10px] bg-gray-100'
                    />
                    <Pressable
                      onPress={() => removeAt(idx)}
                      className='absolute top-2 right-2 w-[18px] h-[18px] rounded-full bg-black/50 items-center justify-center'
                    >
                      <Text className='text-white text-xs'>✕</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}
            <View className='p-[13px] bg-gray-50 rounded-[12px] '>
              <View className='flex-row items-start mb-[5px]'>
                <Text className='mr-1 text-c3 font-regular text-gray-400'>
                  •
                </Text>
                <Text className='flex-1 text-c3 font-regular text-gray-400'>
                  상품과 무관하거나 비속어 및 음란물이 포함된 사진 및 리뷰는
                  통보 없이 삭제처리 될 수 있으며 고지 없이 경고 조치 됩니다.
                </Text>
              </View>
              <View className='flex-row items-start'>
                <Text className='mr-1 text-c3 font-regular text-gray-400'>
                  •
                </Text>
                <Text className='flex-1 text-c3 font-regular text-gray-400'>
                  경고 누적 시 리뷰 작성이 제한될 수 있습니다.
                </Text>
              </View>
            </View>
          </View>
          <View className='mb-7 mt-[59px]'>
            <LongButton
              label='리뷰 등록하기'
              onPress={onSubmit}
              disabled={!canSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
