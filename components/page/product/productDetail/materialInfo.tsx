import ArrowRightIcon from '@/assets/icons/ic_arrow_right.svg';
import EffectIfon from '@/assets/icons/ic_effect.svg';
import IngredienStatusIcon from '@/assets/icons/ic_ingredien_status.svg';
import DownArrowIcon from '@/assets/icons/product/productDetail/ic_arrow_down.svg';
import UpArrowIcon from '@/assets/icons/product/productDetail/ic_arrow_up.svg';
import { ProductIngredient } from '@/services/product/getProductDetail';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Stop,
  LinearGradient as SvgGradient,
} from 'react-native-svg';

// ─── Donut chart ─────────────────────────────────────────────────────────────

const DONUT_SIZE = 74;
const CENTER = DONUT_SIZE / 2;
const RADIUS = 30;
const STROKE_WIDTH = 11;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STATUS_COLORS: Record<string, { start: string; end: string }> = {
  초과: { start: '#FDDF02', end: '#FF0000' },
  적정: { start: '#FDDF02', end: '#9DD716' },
  미만: { start: '#FDDF02', end: '#FFA600' },
};

function parseNumeric(s: string) {
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
}

function formatNumber(s: string): string {
  return parseNumeric(s).toLocaleString('ko-KR');
}

/** 단위를 μg 기준으로 정규화 */
function toMicrograms(s: string): number {
  const value = parseNumeric(s);
  const unit = (s.match(/[a-zA-Zμ]+/)?.[0] ?? '').toLowerCase();
  if (unit === 'g') return value * 1_000_000;
  if (unit === 'mg') return value * 1_000;
  if (unit === 'μg' || unit === 'mcg' || unit === 'ug') return value;
  // 단위 없거나 알 수 없는 경우 그대로 비교
  return value;
}

/** 백엔드가 단위 미고려로 잘못 계산할 수 있으므로 프론트에서 재계산 */
function computeStatus(
  amount: string,
  minRecommended: string,
  maxRecommended: string,
): string {
  const a = toMicrograms(amount);
  const min = toMicrograms(minRecommended);
  const max = toMicrograms(maxRecommended);
  if (a > max) return '초과';
  if (a < min) return '미만';
  return '적정';
}

function DonutChart({
  amount,
  maxRecommended,
  status,
}: {
  amount: string;
  maxRecommended: string;
  status: string;
}) {
  const fillRatio =
    status === '초과'
      ? 1
      : Math.min(toMicrograms(amount) / (toMicrograms(maxRecommended) || 1), 1);
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS['미만'];
  const dashOffset = CIRCUMFERENCE * (1 - fillRatio);
  const amountTextColor =
    status === '초과' ? '#FF3A4A' : status === '미만' ? '#FFA600' : '#25A762';

  return (
    <View
      style={{ width: DONUT_SIZE, height: DONUT_SIZE }}
      className='items-center justify-center'
    >
      <Svg
        width={DONUT_SIZE}
        height={DONUT_SIZE}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Defs>
          {/*
           * Circle에 rotate(-90, CENTER, CENTER) transform이 있으므로
           * userSpaceOnUse 좌표는 그 회전된 좌표계 기준임.
           * 역변환(+90) 적용 결과:
           *   (DONUT_SIZE, DONUT_SIZE) → 스크린 Q1(우상단) = 노란색
           *   (0, 0)                  → 스크린 Q3(좌하단) = 상태색
           */}
          <SvgGradient
            id='donutGrad'
            gradientUnits='userSpaceOnUse'
            x1={DONUT_SIZE}
            y1={DONUT_SIZE}
            x2={0}
            y2={0}
          >
            <Stop offset='0' stopColor={colors.start} />
            <Stop offset='1' stopColor={colors.end} />
          </SvgGradient>
        </Defs>
        {/* 배경 트랙 */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke='#E4E6E7'
          strokeWidth={STROKE_WIDTH}
          fill='none'
        />
        {/* 채워지는 호 */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke='url(#donutGrad)'
          strokeWidth={STROKE_WIDTH}
          fill='none'
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap='round'
          transform={`rotate(-90, ${CENTER}, ${CENTER})`}
        />
      </Svg>
      {/* 중앙 텍스트 */}
      <View className='items-center'>
        <Text className='text-c3 font-n-eb' style={{ color: amountTextColor }}>
          {formatNumber(amount)}
        </Text>
        <View className='w-[20px] h-[1px] bg-gray-200' />
        <Text className='text-c3 font-n-rg text-gray-400'>
          /{formatNumber(maxRecommended)}
        </Text>
      </View>
    </View>
  );
}

// ─── Speech bubble ────────────────────────────────────────────────────────────

function SpeechBubble() {
  return (
    <View className='items-center'>
      <View className='bg-gray-100 rounded-full px-2 py-[3px]'>
        <Text className='text-c3 font-n-bd text-gray-700'>주성분 포함량</Text>
      </View>
      {/* 아래 삼각형 */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderTopWidth: 5,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: '#E4E6E7',
        }}
      />
    </View>
  );
}

// ─── Status tag ───────────────────────────────────────────────────────────────

function StatusTag({ status }: { status: string }) {
  const bgColor =
    status === '초과'
      ? 'bg-[#FF3A4A]'
      : status === '미만'
        ? 'bg-[#FFA600]'
        : 'bg-green-600';
  return (
    <View className={`px-[5px] py-[2px] rounded-full ${bgColor}`}>
      <Text className='text-white font-n-bd' style={{ fontSize: 8 }}>
        {status}
      </Text>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MaterialInfo({
  materialInfo,
}: {
  materialInfo: ProductIngredient;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const status = computeStatus(
    materialInfo.amount,
    materialInfo.minRecommended,
    materialInfo.maxRecommended,
  );

  const renderBulletList = (items: string[]) => {
    if (!items || items.length === 0) {
      return (
        <Text className='flex-1 text-c1 font-n-rg text-gray-400'>
          정보 없음
        </Text>
      );
    }
    return (
      <View className='flex-1'>
        {items.map((txt, idx) => (
          <View key={`${txt}-${idx}`} className='flex-row mb-1'>
            <Text className='mr-2 text-c1 font-n-rg'>•</Text>
            <Text className='flex-1 text-c1 font-n-rg'>{txt}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      {/* ── 카드 ─────────────────────────────────────── */}
      <View
        className='rounded-[15px] w-full flex-row overflow-hidden mb-3'
        style={{ backgroundColor: '#F6F5FA' }}
      >
        {/* 좌측 콘텐츠 */}
        <View className='flex-1 pl-5'>
          {/* 제목 */}
          <Pressable
            className='flex-row items-center pt-4'
            onPress={() =>
              // TODO: API 연결 필요 - ingredientName으로 성분 ID를 조회하는 API가 필요합니다.
              router.push('/ingredient/1')
            }
          >
            <Text className='text-b-sm font-n-eb mr-[3px]'>
              {materialInfo.ingredientName}
            </Text>
            <ArrowRightIcon width={10} height={10} />
          </Pressable>

          {/* 주성분 부제목 */}
          {materialInfo.mainIngredient ? (
            <Text
              className='text-c3 text-gray-400 font-n-rg'
              style={{ marginTop: 5 }}
            >
              (주성분 : {materialInfo.mainIngredient})
            </Text>
          ) : null}

          {/* 포함량 행 */}
          <View
            className='flex-row items-center mb-[10px]'
            style={{ marginTop: 13 }}
          >
            <View className='bg-gray-100 rounded-full px-[6px] py-[2px]'>
              <Text className='text-c3 font-n-rg text-gray-700'>포함량</Text>
            </View>
            <View style={{ width: 7 }} />
            <Text className='text-c1 font-n-bd'>{materialInfo.amount}</Text>
            <View style={{ width: 5 }} />
            <StatusTag status={status} />
          </View>

          {/* 적정 섭취량 행 */}
          <View className='flex-row items-center' style={{ paddingBottom: 16 }}>
            <View className='bg-gray-100 rounded-full px-[6px] py-[2px]'>
              <Text className='text-c3 font-n-rg text-gray-700'>
                적정 섭취량
              </Text>
            </View>
            <View style={{ width: 7 }} />
            <Text className='text-c1 font-n-bd'>
              {materialInfo.minRecommended}~{materialInfo.maxRecommended}
            </Text>
          </View>
        </View>

        {/* 세로 구분선 */}
        <View className='w-[1px] bg-gray-100 self-stretch my-[10px]' />

        {/* 우측: 도넛 */}
        <View
          style={{ paddingHorizontal: 16, paddingVertical: 12 }}
          className='items-center justify-center'
        >
          <SpeechBubble />
          <View style={{ height: 5 }} />
          <DonutChart
            amount={materialInfo.amount}
            maxRecommended={materialInfo.maxRecommended}
            status={status}
          />
        </View>
      </View>

      {/* ── 효과 및 부작용 알아보기 (기존 유지) ─────── */}
      {isOpen ? (
        <View className='bg-[#F6F5FA] rounded-[12px] flex-col px-3 mb-5'>
          <Pressable
            onPress={() => setIsOpen(false)}
            className='flex-row justify-between items-center h-[40px]'
          >
            <Text className='text-c1 font-n-bd'>효과 및 부작용 알아보기</Text>
            <View className='p-1'>
              <UpArrowIcon className='w-[12px] h-[12px]' />
            </View>
          </Pressable>
          <View className='mt-1'>
            <View className='flex-row justify-between mb-5 px-[7px]'>
              <EffectIfon className='mr-[14px]' />
              {renderBulletList(materialInfo.effect ?? [])}
            </View>
            <View className='w-full h-[1px]' />
            <View className='flex-row justify-between mb-5 mt-5 px-[7px]'>
              <IngredienStatusIcon className='mr-[14px]' />
              {renderBulletList(materialInfo.sideEffect ?? [])}
            </View>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => setIsOpen(true)}
          className='bg-[#F6F5FA] rounded-[12px] flex-row justify-between items-center px-3 h-[40px] mb-5'
        >
          <Text className='text-c1 font-n-bd'>효과 및 부작용 알아보기</Text>
          <View className='p-1'>
            <DownArrowIcon className='w-[12px] h-[12px]' />
          </View>
        </Pressable>
      )}
    </>
  );
}
