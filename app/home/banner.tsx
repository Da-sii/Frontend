import GoBackIcon from '@/assets/icons/ic_arrow_left.svg';
import ShareIcon from '@/assets/icons/ic_graph.svg';
import Navigation from '@/components/layout/Navigation';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dimensions, Image, ScrollView, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Banner() {
  const router = useRouter();
  const { imageUrl: encodedUrl } = useLocalSearchParams<{ imageUrl: string }>();
  const imageUrl = encodedUrl ? decodeURIComponent(encodedUrl) : undefined;

  const handleShare = async () => {
    try {
      await Share.share({
        message: '다이어트의 시작, 다시',
        url: `https://www.instagram.com/p/DPEBs27E5tb/?img_index=1`,
      });
    } catch (error) {
      console.error('공유하기 실패:', error);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'left', 'right']}>
      <Navigation
        left={<GoBackIcon width={17} height={17} />}
        onLeftPress={() => router.back()}
        title='뉴스'
        right={<ShareIcon width={18} height={18} />}
        onRightPress={handleShare}
      />

      <ScrollView className='flex-1'>
        <Image
          source={{ uri: imageUrl }}
          resizeMode='contain'
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width * 1.3,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
