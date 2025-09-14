module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { reanimated: false }]],
    plugins: ['nativewind/babel', 'react-native-worklets/plugin'],
  };
};
