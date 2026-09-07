import { Text, View, ViewStyle } from 'react-native';

/** sm: 목록/카드용, lg: 제품 상세 상단용 */
type DaisoBadgeSize = 'sm' | 'lg';

interface Props {
  size?: DaisoBadgeSize;
  style?: ViewStyle;
}

const SIZES: Record<
  DaisoBadgeSize,
  { offset: number; container: string; text: string }
> = {
  sm: { offset: 6, container: 'px-1 py-[1px]', text: 'text-[10px]' },
  lg: {
    offset: 16,
    container: 'h-[40px] px-3 justify-center',
    text: 'text-h-md',
  },
};

/** 제품 이미지 영역 우측 상단에 절대 위치로 노출되는 배지 */
export default function DaisoBadge({ size = 'sm', style }: Props) {
  const { offset, container, text } = SIZES[size];

  return (
    <View
      className={`border border-blue-400 bg-blue-50 rounded-[4px] ${container}`}
      style={[
        { position: 'absolute', top: offset, right: offset, zIndex: 10 },
        style,
      ]}
    >
      <Text className={`font-n-bd text-blue-500 ${text}`}>다이소 제품</Text>
    </View>
  );
}
