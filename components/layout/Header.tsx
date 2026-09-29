import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING } from '../../lib/constants';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export function Header({ title, subtitle, rightAction }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.md }]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightAction && <View style={styles.actions}>{rightAction}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.lg,
    backgroundColor: 'transparent',
    gap: SPACING.base,
  },
  textContainer: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.45,
  },
  subtitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingTop: 4,
  },
});
