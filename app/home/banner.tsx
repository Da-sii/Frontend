import GoBackIcon from '@/assets/icons/ic_arrow_left.svg';
import ShareIcon from '@/assets/icons/ic_graph.svg';
import Navigation from '@/components/layout/Navigation';
import { bannerData, bannerDetailData } from '@/constants/banner';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Banner() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const bannerItem = bannerData.find((item) => item.id === id);
  const detailData = bannerDetailData.find((data) => data.id === id);

  const handleShare = async () => {
    if (!bannerItem) return;
    try {
      await Share.share({
        message: `${bannerItem.title} | 다이어트의 시작, 다시`,
        url: `https://www.instagram.com/p/DPEBs27E5tb/?img_index=1`,
      });
    } catch (error) {
      console.error('공유하기 실패:', error);
    }
  };

  if (!bannerItem || !detailData) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center bg-white'>
        <Text className='text-gray-500 mb-4'>
          상세 정보를 불러올 수 없습니다.
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text className='text-blue-500 font-semibold'>돌아가기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'left', 'right']}>
      <Navigation
        left={<GoBackIcon width={17} height={17} />}
        onLeftPress={() => router.back()}
        title='뉴스' // 또는 bannerItem.title 사용 가능
        right={<ShareIcon width={18} height={18} />}
        onRightPress={handleShare}
      />

      <ScrollView className='flex-1'>
        <View>
          {detailData.images.map((imageSource, index) => (
            <Image
              key={index}
              source={imageSource}
              resizeMode='contain'
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').width * 1.3,
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
