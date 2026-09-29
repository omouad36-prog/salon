import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from '../../lib/constants';

interface KPICardProps {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  large?: boolean;
}

export function KPICard({ label, value, trend, trendDirection = 'neutral', large = false }: KPICardProps) {
  const trendColor =
    trendDirection === 'up'
      ? COLORS.confirmedText
      : trendDirection === 'down'
        ? COLORS.errorText
        : COLORS.textTertiary;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, large && styles.valueLarge]}>{value}</Text>
      {trend ? (
        <Text style={[styles.trend, { color: trendColor }]}>{trend}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 100,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceElevated,
  },
  label: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '400',
    color: COLORS.textSecondary,
    letterSpacing: 0.12,
    marginBottom: SPACING.xs,
  },
  value: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.h2,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  valueLarge: {
    fontSize: FONT_SIZES.h1,
    fontWeight: '600',
  },
  trend: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '400',
    marginTop: 2,
  },
});
