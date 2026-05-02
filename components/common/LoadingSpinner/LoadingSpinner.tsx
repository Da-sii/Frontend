import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 48;
const STROKE_WIDTH = 4;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DASH = CIRCUMFERENCE * 0.25;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default function LoadingSpinner() {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.overlay}>
      <AnimatedSvg
        width={SIZE}
        height={SIZE}
        style={{ transform: [{ rotate: spin }] }}
      >
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke='rgba(147,154,159,0.8)'
          strokeWidth={STROKE_WIDTH}
          strokeLinecap='round'
          strokeDasharray={[DASH, CIRCUMFERENCE]}
          fill='none'
        />
      </AnimatedSvg>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
