import recommendationPromptImage from '@/assets/images/home/recommendation-prompt.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DISMISS_STORAGE_KEY = 'homeRecommendationPromptDismissed';

export default function RecommendationPromptBottomSheet() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadDismissedState = async () => {
      const isDismissed = await AsyncStorage.getItem(DISMISS_STORAGE_KEY);
      setIsVisible(isDismissed !== 'true');
    };

    loadDismissedState().catch(() => setIsVisible(true));
  }, []);

  const handleDismissForever = async () => {
    setIsVisible(false);
    try {
      await AsyncStorage.setItem(DISMISS_STORAGE_KEY, 'true');
    } catch {
      // 저장에 실패해도 현재 세션에서는 시트를 닫습니다.
    }
  };

  const handleStartRecommendation = () => {
    setIsVisible(false);
    router.push('/recommendation' as never);
  };

  return (
    <Modal
      transparent
      animationType='fade'
      visible={isVisible}
      statusBarTranslucent
      onRequestClose={() => setIsVisible(false)}
    >
      <View className='justify-end flex-1 bg-black/60'>
        <View className='w-full overflow-hidden bg-white rounded-t-2xl'>
          <View className='h-[150px] bg-[#CFE1FF] px-10 pt-[27px]'>
            <Text className='text-sm text-gray-900 font-n-eb'>
              내 몸에 맞는 보조제 추천받기
            </Text>
            <Text className='mt-[7px] text-c2 text-gray-600 font-n-bd'>
              어떤 게 좋을지 몰라 고민인 당신에게,{`\n`}
              <Text className='text-green-600'>3분</Text> 만에 딱 맞는 보조제를
              알려드려요!
            </Text>

            <Pressable
              onPress={handleStartRecommendation}
              className='mt-[20px] self-start flex-row items-center rounded-[22px] bg-gray-50 py-[6px] px-[10px]'
              accessibilityRole='button'
              accessibilityLabel='보조제 추천 받기'
            >
              <Text className='text-gray-600 text-c2 font-n-bd'>
                추천받으러 가기
              </Text>
              <Text className='ml-[5px] text-c2 font-n-bd text-gray-600'>
                →
              </Text>
            </Pressable>

            <Image
              source={recommendationPromptImage}
              className='absolute bottom-[0px] right-[0px] h-[150px] w-[190px]'
              resizeMode='contain'
              accessibilityIgnoresInvertColors
            />
          </View>

          <View className='h-[63px] flex-row py-[10px] justify-between px-6'>
            <Pressable
              hitSlop={8}
              onPress={handleDismissForever}
              accessibilityRole='button'
            >
              <Text className='text-gray-300 text-c2 font-n-bd'>
                이제 그만 보기
              </Text>
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() => setIsVisible(false)}
              accessibilityRole='button'
            >
              <Text className='text-gray-900 text-c2 font-n-bd'>닫기</Text>
            </Pressable>
          </View>

          <SafeAreaView className='bg-white' edges={['bottom']} />
        </View>
      </View>
    </Modal>
  );
}
