import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../lib/constants';
import type { WeeklyRevenue } from '../../types/dashboard';

interface RevenueChartProps {
  data: WeeklyRevenue[];
  totalCents: number;
}

const CHART_HEIGHT = 120;
const BAR_WIDTH = 28;
const BAR_GAP = 12;
const BAR_RADIUS = 4;

export function RevenueChart({ data, totalCents }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue_cents), 1);
  const chartWidth = data.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Hebdomadaire</Text>
        <Text style={styles.title}>CA Hebdomadaire</Text>
      </View>

      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={CHART_HEIGHT} style={styles.svg}>
          <G>
            {data.map((item, i) => {
              const barHeight = maxRevenue > 0
                ? (item.revenue_cents / maxRevenue) * (CHART_HEIGHT - 4)
                : 0;
              const x = i * (BAR_WIDTH + BAR_GAP);
              const y = CHART_HEIGHT - barHeight;
              const fill = item.isToday ? COLORS.brandPrimary : COLORS.borderDefault;

              return (
                <Rect
                  key={item.day}
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={Math.max(barHeight, 2)}
                  rx={BAR_RADIUS}
                  ry={BAR_RADIUS}
                  fill={fill}
                />
              );
            })}
          </G>
        </Svg>
      </View>

      <View style={styles.labels}>
        {data.map((item) => (
          <Text
            key={item.day}
            style={[styles.dayLabel, item.isToday && styles.dayLabelActive]}
          >
            {item.day}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.total}>{Math.round(totalCents / 100)}€</Text>
        <Text style={styles.trend}> · +12%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.base,
    gap: 2,
  },
  eyebrow: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  svg: {
    overflow: 'visible',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  dayLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '400',
    color: COLORS.textTertiary,
    width: BAR_WIDTH + BAR_GAP,
    textAlign: 'center',
  },
  dayLabelActive: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  total: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  trend: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.confirmedText,
  },
});
