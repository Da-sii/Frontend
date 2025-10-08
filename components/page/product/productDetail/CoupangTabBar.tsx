import InfoIcon from '@/assets/icons/product/productDetail/ic_help.svg';
import { LongButton } from '@/components/common/buttons/LongButton';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  product: any;
}

export default function CoopangTabBar({ product }: Props) {
  //   if (!product) {
  //     return null;
  //   }

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isTooltipVisible) {
      setIsMounted(true);
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
      }).start(() => {
        setIsMounted(false);
      });
    }
  }, [isTooltipVisible, fadeAnim]);

  const handlePress = () => {
    Linking.openURL(product.productUrl).catch((err) =>
      console.error('URL을 여는 데 실패했습니다.', err),
    );
  };

  const toggleTooltip = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <View className='flex-row items-center px-4 py-4 border-t border-l border-r border-gray-200 rounded-t-xl'>
      {isMounted && (
        <Animated.View
          className='absolute bottom-[68px] left-4 bg-green-50 px-3 py-2 rounded-lg shadow-lg'
          style={{ opacity: fadeAnim }}
        >
          <Text className='text-xs text-gray-900 leading-[18px]'>
            쿠팡 파트너스 링크를 통해{'\n'}
            미판매 제품을 구매할 수 있어요.{'\n'}
            (구매 시 다시가 일정액 수수료를 받아요)
          </Text>
          <View style={styles.tooltipArrow} />
        </Animated.View>
      )}

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
