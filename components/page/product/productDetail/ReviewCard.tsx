import { Text, View } from 'react-native';
import ReviewStar from './ReviewStar';

interface ReviewCardProps {
  reviewRank: number;
  distribution?: { [key: number]: number };
}

export default function ReviewCard({
  reviewRank,
  distribution,
}: ReviewCardProps) {
  // entries: 5점 → 1점 순서
  const entries = Object.entries(distribution || {}).sort(
    (a, b) => Number(b[0]) - Number(a[0]),
  );

  // 최댓값(퍼센트)과 그 점수키 하나만 선정 (동률이면 첫 번째)
  const maxPercent = Math.max(...entries.map(([, p]) => Number(p || 0)));
  const topScoreKey = entries.find(([, p]) => Number(p) === maxPercent)?.[0];

  return (
    <View className='bg-[#F6F5FA] h-[140px] rounded-[12px] flex-row items-center w-full '>
      {/* 왼쪽 영역 */}
      <View
        className='h-[100px] border-r border-gray-200 items-center justify-center'
        style={{ flex: 0.4 }}
      >
        <Text className='text-[28px] font-extrabold'>
          {reviewRank.toFixed(2)}
        </Text>
        <ReviewStar reviewRank={reviewRank} height={16} />
      </View>

      {/* 오른쪽 영역 */}
      <View
        className=' h-[100px] justify-center flex-row'
        style={{ flex: 0.6 }}
      >
        <View className='justify-center flex-row w-[170px]'>
          {entries.map(([score, percent]) => {
            const isTop = score === topScoreKey;
            return (
              <View
                key={score}
                className='flex-1 flex-col items-center justify-center space-y-[5px] relative'
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode='clip'
                  className={`absolute top-[0%] text-center text-c3 ${isTop ? 'text-green-500 font-extrabold' : ' text-gray-700 font-bold'}`}
                >
                  {percent}%
                </Text>
                <View className='bg-gray-200 w-[5px] h-[60px] rounded-full overflow-hidden justify-end'>
                  <View
                    className='bg-green-500 rounded-full'
                    style={{ height: `${percent}%` }}
                  />
                </View>

                <Text className='text-gray-700 text-c3 font-bold'>
                  {score}점
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
