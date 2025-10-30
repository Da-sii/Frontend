// 1. Sentry의 *Expo 전용* 설정 함수와 Reanimated 래퍼를 가져옵니다.
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */

// 2. getDefaultConfig 대신 getSentryExpoConfig를 사용합니다.
// 이 함수는 Expo의 기본 설정을 이미 포함하고 있으며, Sentry의 시리얼라이저를 올바르게 적용합니다.
const config = getSentryExpoConfig(__dirname);

// 3. 기존 SVG 트랜스포머 설정을 Sentry가 적용된 config 객체에 추가합니다.
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer',
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg',
);
config.resolver.sourceExts.push('svg');

// 4. Sentry와 SVG 설정이 모두 적용된 config를 Reanimated 래퍼로 감싸줍니다.
// (Reanimated는 Sentry 설정 이후에 래핑하는 것이 좋습니다.)
module.exports = wrapWithReanimatedMetroConfig(config);
