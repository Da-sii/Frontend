import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Text, View } from 'react-native';

interface progressBarProps {
  recommended: string;
  status: string;
  amount: string;
}

export default function ProgressBar({
  recommended,
  status,
  amount,
}: progressBarProps) {
  const [textWidth, setTextWidth] = useState(0);

  const currentAmount = parseFloat(amount);
  const recommendedAmount = parseFloat(recommended);
  const max = recommendedAmount / 0.8;
  const percent = (currentAmount / max) * 100;
  const recommendPercent = (recommendedAmount / max) * 100;
  return (
    <View className='w-full h-[47px] mb-5 relative flex-col justify-between'>
      <View className=''>
        <Text
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
          className=' absolute text-gray-400 text-c3 font-bold mb-1 whitespace-nowrap '
          style={{
            left: `${recommendPercent}%`,
            transform: [{ translateX: -textWidth / 2 }],
          }}
        >
          하루 최대치 {recommended}
        </Text>
      </View>

      <View
        className='w-[5px] h-[5px] rounded-full bg-gray-400 mb-1'
        style={{
          left: `${recommendPercent}%`,
          transform: [{ translateY: 14 }],
        }}
      />

      <View className='bg-[#E2E2E2] h-[20px] rounded-full overflow-hidden mt-[10px]'>
        <LinearGradient
          colors={
            status === '초과'
              ? ['#FDDF02', '#FF0000']
              : status === '미만'
                ? ['#FDDF02', '#FFA600']
                : ['#FDDF02', '#9DD716']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${percent}%`,
            minWidth: '15%',
            height: '100%',
            borderRadius: 9999,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            className='text-white text-c3 font-extrabold '
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {amount}
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}
