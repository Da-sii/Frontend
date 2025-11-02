import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

interface progressBarProps {
  current: number;
  recommended: number;
}

export default function ProgressBar({
  current,
  recommended,
}: progressBarProps) {
  const max = recommended / 0.8;

  const percent = (current / max) * 100;
  const recommendPercent = (recommended / max) * 100;

  return (
    <View className='w-full h-[47px] mb-5 relative'>
      <View
        className='w-[93px] items-center'
        style={{
          left: `${recommendPercent}%`,
          transform: [{ translateX: -50 }],
        }}
      >
        <Text className='text-gray-400 text-c3 font-bold mb-1'>
          하루 최대치 {recommended}mg
        </Text>
        <View className='w-[5px] h-[5px] rounded-full bg-gray-400 mb-1' />
      </View>
      <View className='bg-[#E2E2E2] h-[20px] rounded-full overflow-hidden'>
        <LinearGradient
          colors={['#FDDF02', '#FF0000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${percent}%`, height: '100%', borderRadius: 9999 }}
        />
        <View className='absolute top-0 left-0 right-0 h-5 items-center justify-center'>
          <Text className='text-white text-c3 font-extrabold'>{current}mg</Text>
        </View>
      </View>
    </View>
  );
}
