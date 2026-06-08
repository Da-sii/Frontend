import { useRecordVisibility } from '@/store/useRecordVisibility';
import { IDailyRecord } from '@/types/models/record';
import { recentDayKeys, todayKey } from '@/utils/recordDate';
import { useMemo } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import Svg, { Circle, Line } from 'react-native-svg';
import VisibilityToggle from './VisibilityToggle';

const SCREEN_W = Dimensions.get('window').width;
const CARD_MARGIN = 20; // mx-5
const CARD_PADDING = 10; // p-2.5
const CHART_W = SCREEN_W - CARD_MARGIN * 2 - CARD_PADDING * 2;
const CHART_H = 80;
const CHART_BASELINE = CHART_H - 18;

interface WeightGraphCardProps {
  records: IDailyRecord[];
}

export default function WeightGraphCard({ records }: WeightGraphCardProps) {
  const isVisible = useRecordVisibility((s) => s.isVisible);
  const today = todayKey();

  const todayWeight = useMemo(
    () => records.find((r) => r.date === today)?.weight ?? null,
    [records, today],
  );
  const hasToday = todayWeight != null;

  const weights = useMemo(() => {
    const last7 = recentDayKeys(7);
    return last7
      .map((k) => records.find((r) => r.date === k)?.weight)
      .filter((w): w is number => w != null);
  }, [records]);

  const { min, max } = useMemo(() => {
    if (weights.length === 0) return { min: 0, max: 1 };
    return { min: Math.min(...weights), max: Math.max(...weights) };
  }, [weights]);

  const chartData = useMemo(
    () =>
      weights.map((value, i) => ({
        value,
        // 마지막 점에만 끝점 표시
        ...(i === weights.length - 1
          ? {
              customDataPoint: () => (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: '#50D88F',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              ),
            }
          : {}),
      })),
    [weights],
  );

  const spacing =
    weights.length > 1 ? (CHART_W - 24) / (weights.length - 1) : CHART_W - 24;

  const weightLabel = !isVisible
    ? '?? kg'
    : `${(todayWeight ?? 0).toFixed(1)}kg`;

  const bubbleText = hasToday
    ? '오늘 기록을 완료했어요!'
    : '오늘 기록을 기다리고 있어요.';

  return (
    <View
      className='bg-white rounded-[16px] border border-gray-50'
      style={{ marginHorizontal: CARD_MARGIN, padding: CARD_PADDING }}
    >
      {/* 헤더: 체중 + 보기/숨김 토글 */}
      <View
        className='flex-row items-center justify-between'
        style={{ paddingHorizontal: 10, marginBottom: 10 }}
      >
        <Text className='text-c3 font-n-bd text-gray-500'>체중</Text>
        <VisibilityToggle />
      </View>

      {/* 체중 값 + 말풍선 */}
      <View
        className='flex-row items-center'
        style={{ paddingHorizontal: 10 }}
      >
        <Text className='text-h-lg font-n-eb text-gray-900'>{weightLabel}</Text>
        <View className='flex-row items-center' style={{ marginLeft: 8 }}>
          <View
            style={{
              width: 0,
              height: 0,
              borderTopWidth: 4,
              borderBottomWidth: 4,
              borderRightWidth: 5,
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderRightColor: '#66A3FF',
            }}
          />
          <View className='bg-blue-300 rounded-[8px] px-2 py-1'>
            <Text className='text-c3 font-n-eb text-white'>{bubbleText}</Text>
          </View>
        </View>
      </View>

      {/* 그래프 */}
      <View style={{ height: CHART_H, marginTop: 4 }}>
        {isVisible ? (
          <LineChart
            data={chartData}
            width={CHART_W}
            height={CHART_H}
            spacing={spacing}
            initialSpacing={12}
            endSpacing={12}
            thickness={2}
            color='#82E3AF'
            curved
            areaChart
            startFillColor='#82E3AF'
            endFillColor='#EAFAF2'
            startOpacity={0.5}
            endOpacity={0.05}
            hideDataPoints
            hideAxesAndRules
            hideYAxisText
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisOffset={Math.max(min - 0.5, 0)}
            maxValue={max + 0.5}
            disableScroll
            adjustToWidth
          />
        ) : (
          <Svg width={CHART_W} height={CHART_H}>
            <Line
              x1={12}
              y1={CHART_BASELINE}
              x2={CHART_W - 12}
              y2={CHART_BASELINE}
              stroke='#82E3AF'
              strokeWidth={2}
              strokeDasharray='6 6'
            />
            <Circle
              cx={CHART_W - 12}
              cy={CHART_BASELINE}
              r={4}
              fill='#FFFFFF'
              stroke='#82E3AF'
              strokeWidth={2}
            />
          </Svg>
        )}
      </View>

      {/* 푸터 */}
      <Text
        className='text-c3 font-n-rg text-gray-400 text-right'
        style={{ paddingHorizontal: 10 }}
      >
        최근 7일 기록
      </Text>
    </View>
  );
}
