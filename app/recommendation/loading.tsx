import ArrowLeftIcon from '@/assets/icons/ic_arrow_left.svg';
import HomeIcon from '@/assets/icons/ic_home.svg';
import DefaultModal from '@/components/common/modals/DefaultModal';
import Navigation from '@/components/layout/Navigation';
import colors from '@/constants/color';
import {
  createRecommendations,
  RecommendationSurveyPayload,
} from '@/services/recommendation';
import { useRecommendationResult } from '@/store/useRecommendationResult';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const analysisSteps = [
  '프로필 분석',
  '성분 데이터베이스 검색',
  '개인화 추천 생성',
];

function AnalysisSpinner() {
  return (
    <Svg
      width={87}
      height={88}
      viewBox='0 0 87 88'
      fill='none'
      style={
        Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          },
          android: { elevation: 4 },
        })
      }
    >
      <Defs>
        <LinearGradient
          id='spinnerGradient'
          x1={4}
          y1={4}
          x2={84}
          y2={84}
          gradientUnits='userSpaceOnUse'
        >
          <Stop offset='0' stopColor='#50D88F' />
          <Stop offset='0.5' stopColor='#51B9C6' />
          <Stop offset='1' stopColor='#5398FF' />
        </LinearGradient>
      </Defs>
      <Path
        d='M84 44C84 66.0914 66.0914 84 44 84C21.9086 84 4 66.0914 4 44C4 21.9086 21.9086 4 44 4C66.0914 4 84 21.9086 84 44ZM13.2252 44C13.2252 60.9965 27.0035 74.7748 44 74.7748C60.9965 74.7748 74.7748 60.9965 74.7748 44C74.7748 27.0035 60.9965 13.2252 44 13.2252C27.0035 13.2252 13.2252 27.0035 13.2252 44Z'
        fill='#C9CCCF'
      />
      <Path
        d='M78.8507 37.86C81.3595 37.418 83.0609 35.0145 82.3331 32.5732C80.9023 27.7733 78.5786 23.2713 75.4702 19.3093C71.4097 14.134 66.1357 10.04 60.1151 7.38984C54.0945 4.7397 47.5133 3.61526 40.9543 4.11612C34.3954 4.61698 28.0612 6.72769 22.5128 10.2613C16.9645 13.7949 12.3732 18.6423 9.14569 24.3741C5.91818 30.1059 4.15408 36.5452 4.00964 43.1217C3.86521 49.6981 5.34489 56.2087 8.31762 62.0767C10.5934 66.569 13.6905 70.5785 17.4349 73.9048C19.3395 75.5967 22.237 75.0713 23.6985 72.9848C25.1599 70.8982 24.6236 68.0445 22.7787 66.2878C20.2473 63.8776 18.1367 61.0457 16.547 57.9077C14.2599 53.393 13.1214 48.384 13.2326 43.3243C13.3437 38.2645 14.701 33.3103 17.1841 28.9004C19.6672 24.4905 23.1996 20.761 27.4684 18.0424C31.7371 15.3238 36.6105 13.6998 41.6568 13.3145C46.703 12.9291 51.7664 13.7943 56.3985 15.8332C61.0305 17.8721 65.0883 21.022 68.2122 25.0037C70.3836 27.7713 72.0573 30.8814 73.1709 34.1945C73.9826 36.6092 76.3419 38.302 78.8507 37.86Z'
        fill='url(#spinnerGradient)'
      />
      <Path
        d='M59.8145 12.3436C60.953 10.0647 60.0347 7.26676 57.64 6.39805C52.9317 4.69009 47.931 3.87683 42.8971 4.01562C36.3215 4.19692 29.8922 5.99709 24.1785 9.25667C18.4649 12.5162 13.6433 17.1346 10.1409 22.7027C6.63845 28.2708 4.56328 34.6167 4.09919 41.1784C3.6351 47.74 4.79642 54.3149 7.48026 60.3205C10.1641 66.3261 14.2877 71.5772 19.4856 75.6085C24.6836 79.6398 30.7956 82.327 37.2801 83.432C42.2444 84.278 47.3098 84.1766 52.2116 83.1484C54.7048 82.6254 56.0078 79.9846 55.2014 77.5681C54.395 75.1516 51.7827 73.8836 49.273 74.3201C45.8294 74.919 42.2976 74.9289 38.8298 74.338C33.8408 73.4878 29.1384 71.4203 25.1392 68.3188C21.1401 65.2172 17.9675 61.1772 15.9027 56.5566C13.8378 51.936 12.9443 46.8776 13.3014 41.8292C13.6584 36.7809 15.255 31.8985 17.9497 27.6146C20.6443 23.3307 24.3539 19.7774 28.7498 17.2696C33.1457 14.7618 38.0923 13.3768 43.1513 13.2373C46.6677 13.1403 50.163 13.6472 53.488 14.7248C55.9114 15.5103 58.6761 14.6225 59.8145 12.3436Z'
        fill='url(#spinnerGradient)'
      />
    </Svg>
  );
}

export default function RecommendationLoadingPage() {
  const router = useRouter();
  const { survey } = useLocalSearchParams<{ survey?: string }>();
  const setResult = useRecommendationResult((state) => state.setResult);
  const rotation = useRef(new Animated.Value(0)).current;
  const hasStarted = useRef(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      { iterations: -1 },
    );

    rotation.setValue(0);
    animation.start();
    return () => animation.stop();
  }, [rotation]);

  useEffect(() => {
    const secondStepTimer = setTimeout(() => setActiveStep(1), 1300);
    const thirdStepTimer = setTimeout(() => setActiveStep(2), 2600);

    return () => {
      clearTimeout(secondStepTimer);
      clearTimeout(thirdStepTimer);
    };
  }, []);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const runAnalysis = async () => {
      try {
        if (!survey) throw new Error('설문 응답이 없습니다.');

        const payload = JSON.parse(survey) as RecommendationSurveyPayload;
        const [recommendationResult] = await Promise.all([
          createRecommendations(payload),
          new Promise((resolve) => setTimeout(resolve, 2800)),
        ]);

        setResult(recommendationResult);
        router.replace('/recommendation/result' as never);
      } catch {
        setShowErrorModal(true);
      }
    };

    runAnalysis();
  }, [router, setResult, survey]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-53.463deg', '306.537deg'],
  });

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'left', 'right']}>
      <Navigation
        title='맞춤 분석'
        left={<ArrowLeftIcon width={18} height={18} fill={colors.gray[900]} />}
        onLeftPress={() => router.back()}
        right={<HomeIcon width={18} height={18} fill={colors.gray[900]} />}
        onRightPress={() => router.replace('/(tabs)/home')}
      />
      <View className='h-px bg-gray-100' />

      <View className='flex-1 items-center pt-[70px]'>
        <Animated.View
          className='h-[88px] w-[87px]'
          style={{
            transform: [{ rotate }],
          }}
        >
          <AnalysisSpinner />
        </Animated.View>

        <Text className='mt-[20px] font-n-eb text-h-lg  text-gray-900'>
          분석 중...
        </Text>
        <Text className='mt-[10px] text-center font-n-bd text-sm text-gray-600'>
          입력하신 정보를 바탕으로{'\n'}
          최적의 성분을 찾고 있어요.
        </Text>

        {/* TODO: 다른 비동기 처리 화면에서도 사용할 수 있도록 AnalysisProgressSteps로 분리 */}
        <View className='mt-[50px]'>
          {analysisSteps.map((label, index) => {
            const isComplete = index <= activeStep;

            return (
              <View key={label} className='flex-row'>
                <View className='items-center '>
                  <View
                    className={`h-[10px] w-[10px] rounded-full ${
                      isComplete ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                  {index < analysisSteps.length - 1 && (
                    <View
                      className={`h-[20px] w-[1px] my-[4.5px] ${
                        index < activeStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </View>
                <Text
                  className={`ml-[14px] -mt-[10px] font-n-bd text-lg  ${
                    isComplete ? 'text-green-500' : 'text-gray-400'
                  }`}
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <DefaultModal
        visible={showErrorModal}
        title='분석 결과를 불러오지 못했어요.'
        message='잠시 후 다시 시도해주세요.'
        confirmText='확인'
        singleButton
        onConfirm={() => router.back()}
      />
    </SafeAreaView>
  );
}
