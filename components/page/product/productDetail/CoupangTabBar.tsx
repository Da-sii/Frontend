// TODO: 쿠팡 15만원 채우기 전까지 버튼 클릭 시 바로 링크로 이동, 이후 coupangPartnerScreen으로 이동

import InfoIcon from '@/assets/icons/product/productDetail/ic_help.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { getSafeUrl } from '@/utils/getSafeUrl';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  id: string;
  coupangUrl: string;
}

export default function CoopangTabBar({ id, coupangUrl }: Props) {
  const finalUrl = getSafeUrl(coupangUrl);
  if (!id || !finalUrl) {
    return;
  }

  // const router = useRouter();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTooltipVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {});
    }
  }, [isTooltipVisible, fadeAnim]);

  const handlePress = async () => {
    if (!finalUrl) {
      return;
    }
    const canOpen = await Linking.canOpenURL(finalUrl);
    if (canOpen) {
      await Linking.openURL(finalUrl);
    }
    // router.push({
    //   pathname: '/product/[id]/coupangPartnerScreen',
    //   params: {
    //     id: String(id),
    //     coupangUrl: coupang || '',
    //     // imageUrl: cproduct.imageUrl || '',
    //   },
    // });
  };

  const toggleTooltip = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <View className='flex-row items-center px-4 py-4 border-t border-l border-r border-gray-200 rounded-t-xl'>
      <Modal
        visible={isTooltipVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={toggleTooltip}
      >
        <Pressable style={styles.modalBackdrop} onPress={toggleTooltip}>
          <View className='absolute bottom-[100px] left-4 bg-green-50 px-3 py-2 rounded-lg shadow-lg'>
            <Text className='text-xs text-gray-900 leading-[18px]'>
              쿠팡 파트너스 링크를 통해{'\n'}
              미판매 제품을 구매할 수 있어요.{'\n'}
              (구매 시 다시가 일정액 수수료를 받아요)
            </Text>
            <View style={styles.tooltipArrow} />
          </View>
        </Pressable>
      </Modal>

      <TouchableOpacity onPress={toggleTooltip} className='pl-1'>
        <InfoIcon className='mr-5 items-center justify-center' />
      </TouchableOpacity>

      <View className='flex-1'>
        <LongButton
          label='최저가 보러가기'
          onPress={handlePress}
          height='h-[48px]'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -8,
    left: 10,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E6F9E6',
  },
});
