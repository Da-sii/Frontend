import { useRecordVisibility } from '@/store/useRecordVisibility';
import { Text, TouchableOpacity, View } from 'react-native';

const TRACK_W = 48;
const TRACK_H = 20;
const KNOB = 16;
const PAD = 2;

/**
 * 보기/숨김 토글.
 * - 보기(값 노출): gray-300, 노브 왼쪽
 * - 숨김(값 가림): green-500, 노브 오른쪽
 * (이미지 기준 — 숨김 상태가 활성/초록색)
 */
export default function VisibilityToggle() {
  const isVisible = useRecordVisibility((s) => s.isVisible);
  const toggle = useRecordVisibility((s) => s.toggle);

  const knobLeft = isVisible ? PAD : TRACK_W - KNOB - PAD;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggle}
      accessibilityRole='switch'
      accessibilityState={{ checked: !isVisible }}
      style={{ width: TRACK_W, height: TRACK_H, borderRadius: TRACK_H / 2 }}
      className={`justify-center ${isVisible ? 'bg-gray-300' : 'bg-green-500'}`}
    >
      <Text
        className='font-n-bd text-white'
        style={{
          fontSize: 8,
          position: 'absolute',
          ...(isVisible ? { right: 7 } : { left: 7 }),
        }}
      >
        {isVisible ? '보기' : '숨김'}
      </Text>
      <View
        style={{
          width: KNOB,
          height: KNOB,
          borderRadius: KNOB / 2,
          position: 'absolute',
          left: knobLeft,
        }}
        className='bg-white'
      />
    </TouchableOpacity>
  );
}
