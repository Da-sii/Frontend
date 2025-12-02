import CloseIcon from '@/assets/icons/ic_x.svg';
import { router, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

export default function CoupangPartnerScreen() {
  const { id, coupangUrl } = useLocalSearchParams<{
    id: string;
    coupangUrl: string;
  }>();

  // const handleGoToCoupang = () => {
  //   Linking.openURL(productUrl).catch((err) =>
  //     console.error('쿠팡 링크 이동 실패:', err),
  //   );
  // };

  return (
    <View className='flex-1 bg-white '>
      <View className='flex-row mt-10 justify-end p-4'>
        <TouchableOpacity
          onPress={() => router.back()}
          className='w-6 h-6 items-center justify-center'
        >
          <CloseIcon />
        </TouchableOpacity>
      </View>

      <View className='flex-1 items-center pt-[80px]'>
        {/* {!imageUrl && (
          <View className='w-[300px] h-[300px] flex justify-center items-center rounded-3xl mt-20 bg-gray-50'>
            <Text className='text-gray-400'>이미지 준비중입니다.</Text>
          </View>
        )}
        {imageUrl && (
          <Pressable onPress={() => Linking.openURL(productUrl)}>
            <View className='relative'>
              <Image
                className='w-[240px] h-[480px] resize-contain'
                src={imageUrl}
              />
              <View className='absolute w-[240px] h-[480px] inset-0 border-2 border-white pointer-events-none' />
            </View>
          </Pressable>
        )} */}
      </View>

      {/* <View className='px-6 mb-12'>
        <LongButton label='쇼핑하기' onPress={handleGoToCoupang} />
      </View> */}
    </View>
  );
}
