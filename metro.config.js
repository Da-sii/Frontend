const { getDefaultConfig } = require('expo/metro-config');
const { withSentryConfig } = require('@sentry/react-native/metro');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */

// 2. Expo의 기본 설정을 가져옵니다.
const config = getDefaultConfig(__dirname);

// 3. SVG 및 기타 설정을 추가합니다.
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer',
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg',
);
config.resolver.sourceExts.push('svg');

// 4. Reanimated 설정으로 한번 감싸고,
const reanimatedConfig = wrapWithReanimatedMetroConfig(config);

// 5. 마지막으로 Sentry 설정으로 전체를 감싸서 내보냅니다.
module.exports = withSentryConfig(reanimatedConfig);
