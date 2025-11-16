import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  weight: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  weight,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(weight);

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Rubik-Regular',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: 'Rubik-SemiBold',
  },
  title: {
    fontSize: 34,
    lineHeight: 34,
    fontFamily: 'Rubik-Bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Light',
  },
  link: {
    lineHeight: 16,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: 'Rubik-Regular',
  },
});