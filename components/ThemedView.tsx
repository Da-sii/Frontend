import { View, type ViewProps } from 'react-native';

import colors from '@/constants/color';

export type ThemedViewProps = ViewProps & {};

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  const backgroundColor = colors.gray.box;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
