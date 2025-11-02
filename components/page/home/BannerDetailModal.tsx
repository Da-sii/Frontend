import GoBackIcon from '@/assets/icons/ic_arrow_left.svg';
import ShareIcon from '@/assets/icons/ic_graph.svg';
import Navigation from '@/components/layout/Navigation';
import { bannerDetailData } from '@/constants/banner';
import { IBannerCell } from '@/types/models/main';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
interface BannerDetailModalProps {
  visible: boolean;
  onClose: () => void;
  bannerItem: IBannerCell;
}

export default function BannerDetailModal({
  visible,
  onClose,
  bannerItem,
}: BannerDetailModalProps) {
  const insets = useSafeAreaInsets();
  if (!bannerItem) {
    return null;
  }

  const detailData = bannerDetailData.find((data) => data.id === bannerItem.id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${bannerItem.title} | 다이어트의 시작, 다시`,
        url: `https://www.instagram.com/p/DPEBs27E5tb/?img_index=1`,
      });
    } catch (error) {
      console.error('공유하기 실패:', error);
    }
  };

  if (!detailData) {
    return (
      <Modal visible={visible} onRequestClose={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          <Text>상세 정보를 불러올 수 없습니다.</Text>
          <Pressable onPress={onClose}>
            <Text>돌아가기</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <Navigation
          left={<GoBackIcon width={17} height={17} />}
          onLeftPress={onClose}
          title={'뉴스'}
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
      </View>
    </Modal>
  );
}
