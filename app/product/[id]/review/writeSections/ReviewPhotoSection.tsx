'use client';

import PhotoCameraIcon from '@/assets/icons/product/review/ic_blue_camera.svg';
import { toCdnUrl } from '@/utils/cdn';
import * as ImagePicker from 'expo-image-picker';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

type ExistingImage = { id: number; url: string };
type Picked = {
  uri: string;
  width: number;
  height: number;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

type Props = {
  existingImages: ExistingImage[];
  setExistingImages: React.Dispatch<React.SetStateAction<ExistingImage[]>>;
  images: Picked[];
  setImages: React.Dispatch<React.SetStateAction<Picked[]>>;
  onDeleteExisting: (imageId: number) => void;
  deletingId: number | null;
  max?: number;
};

export default function ReviewPhotoSection({
  existingImages,
  setExistingImages,
  images,
  setImages,
  onDeleteExisting,
  deletingId,
  max = 5,
}: Props) {
  const openPicker = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('권한 필요', '앨범 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: Math.max(0, max - existingImages.length - images.length),
      quality: 0.9,
    });

    if (result.canceled) return;

    const next = result.assets.map((a) => ({
      uri: a.uri,
      width: a.width ?? 0,
      height: a.height ?? 0,
      fileName: a.fileName ?? a.uri.split('/').pop(),
      mimeType: a.mimeType ?? 'image/jpeg',
      fileSize: a.fileSize,
    }));

    const filtered = next.filter((p) => {
      const okExt = /(jpe?g|png|heic)$/i.test(p.fileName ?? '');
      const okSize = (p.fileSize ?? 0) <= 5 * 1024 * 1024;
      return okExt && okSize;
    });

    setImages((prev) => {
      const allowed = Math.max(0, max - existingImages.length - prev.length);
      return [...prev, ...filtered.slice(0, allowed)];
    });
  };

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
    setImages((prev) => {
      const allowed = Math.max(0, max - existingImages.length - prev.length);
      if (allowed <= 0) return prev;

      return [
        ...prev,
        {
          uri: a.uri,
          width: a.width ?? 0,
          height: a.height ?? 0,
          fileName: a.fileName ?? undefined,
          mimeType: a.mimeType ?? 'image/jpeg',
          fileSize: a.fileSize,
        },
      ];
    });
  };

  const handleAttachPress = () => {
    if (existingImages.length + images.length >= max) {
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
          if (idx === 2) openPicker();
        },
      );
    } else {
      Alert.alert('사진 첨부', undefined, [
        { text: '사진 찍기', onPress: takePhoto },
        { text: '보관함에서 선택', onPress: openPicker },
        { text: '취소', style: 'cancel' },
      ]);
    }
  };

  const gallery = [
    ...existingImages.map((e) => ({
      kind: 'existing' as const,
      id: e.id,
      uri: toCdnUrl(e.url),
    })),
    ...images.map((i) => ({ kind: 'new' as const, uri: i.uri })),
  ];

  return (
    <>
      <Pressable
        onPress={handleAttachPress}
        className='h-[50px] rounded-[12px] items-center justify-center mt-5 bg-white border border-blue-600 flex-row'
      >
        <PhotoCameraIcon className='mr-2' />
        <Text className='text-b-md font-n-bd text-blue-600'>사진 첨부하기</Text>
      </Pressable>

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
                item.kind === 'existing' ? `ex-${item.id}` : `new-${item.uri}`
              }
              className='relative'
            >
              <Image
                source={{ uri: item.uri }}
                className='w-[100px] h-[100px] rounded-[10px] bg-gray-100'
              />
              <Pressable
                onPress={() =>
                  item.kind === 'existing'
                    ? onDeleteExisting(item.id)
                    : setImages((prev) =>
                        prev.filter((p) => p.uri !== item.uri),
                      )
                }
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
    </>
  );
}
