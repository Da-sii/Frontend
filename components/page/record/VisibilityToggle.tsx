import { useRecordVisibility } from '@/store/useRecordVisibility';
import { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';

const TRACK_W = 48;
const TRACK_H = 20;
const KNOB = 16;
const PAD = 2;

export default function VisibilityToggle() {
  const isVisible = useRecordVisibility((s) => s.isVisible);
  const toggle = useRecordVisibility((s) => s.toggle);

  const knobAnim = useRef(
    new Animated.Value(isVisible ? PAD : TRACK_W - KNOB - PAD),
  ).current;
  const trackAnim = useRef(new Animated.Value(isVisible ? 0 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(knobAnim, {
        toValue: isVisible ? PAD : TRACK_W - KNOB - PAD,
        useNativeDriver: false,
        bounciness: 0,
        speed: 20,
      }),
      Animated.timing(trackAnim, {
        toValue: isVisible ? 0 : 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isVisible]);

  const trackColor = trackAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#AEB3B7', '#50D88F'], // gray-300 → green-500
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggle}
      accessibilityRole='switch'
      accessibilityState={{ checked: !isVisible }}
    >
      <Animated.View
        style={{
          width: TRACK_W,
          height: TRACK_H,
          borderRadius: TRACK_H / 2,
          backgroundColor: trackColor,
          justifyContent: 'center',
        }}
      >
        <Text
          className='font-n-bd text-gray-50'
          style={{
            fontSize: 8,
            position: 'absolute',
            ...(isVisible ? { right: 9 } : { left: 9 }),
          }}
        >
          {isVisible ? '보기' : '숨김'}
        </Text>
        <Animated.View
          style={{
            width: KNOB,
            height: KNOB,
            borderRadius: KNOB / 2,
            position: 'absolute',
            left: knobAnim,
            backgroundColor: 'white',
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
