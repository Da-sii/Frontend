import IC_AI_LOGO from '@/assets/icons/ic_ai_logo.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

type Props = {
  summary: string[];
};

export default function AISummary({ summary }: Props) {
  return (
    <View className='mx-4 mb-[10px]'>
      <View className='flex-row items-center' style={{ gap: 2 }}>
        <IC_AI_LOGO className='w-4 h-4' />
        <Text className='text-lg font-n-eb text-gray-800'>
          AI 기반 제품 요약
        </Text>
      </View>
      <LinearGradient
        colors={['#FDFFFB', '#F5FDFE']}
        locations={[0, 0.7, 0.95, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className='rounded-2xl px-4 py-4'
        style={{
          marginTop: 12,
          borderWidth: 1,
          borderColor: '#82E3AF33',
        }}
      >
        <View className='gap-y-3'>
          {summary.map((item, index) => (
            <View key={index} className='flex-row items-start gap-x-2'>
              <Text className='text-sm mt-[1px]'>•</Text>
              <Text className='text-sm flex-1 leading-5'>{item}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}
