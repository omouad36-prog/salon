import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, RADIUS } from '../../lib/constants';
import { Badge } from '../common/Badge';
import type { Product } from '../../types/dashboard';

interface StaffStat {
  id: string;
  name: string;
  retention: number;
  todayApts: number;
}

interface TeamStatsProps {
  team: StaffStat[];
  stock: Product[];
}

function getStockVariant(product: Product): 'confirmed' | 'delay' | 'error' {
  if (product.stock_quantity <= 2) return 'error';
  if (product.stock_quantity <= product.low_stock_threshold) return 'delay';
  return 'confirmed';
}

function getStockLabel(product: Product): string {
  if (product.stock_quantity <= 2) return 'Critique';
  if (product.stock_quantity <= product.low_stock_threshold) return 'Bas';
  return 'OK';
}

export function TeamStats({ team, stock }: TeamStatsProps) {
  return (
    <View style={styles.row}>
      {/* Team column */}
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Rétention</Text>
        <Text style={styles.title}>Équipe</Text>
        {team.map((member) => (
          <View key={member.id} style={styles.teamRow}>
            <Text style={styles.memberName} numberOfLines={1}>
              {member.name.split(' ')[0]}
            </Text>
            <View style={styles.barContainer}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${member.retention}%` },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>{member.retention}%</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Stock column */}
      <View style={[styles.card, styles.stockCard]}>
        <Text style={styles.eyebrow}>Surveillance</Text>
        <Text style={styles.title}>Stock</Text>
        {stock.map((product) => (
          <View key={product.id} style={styles.stockRow}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>
            <View style={styles.stockRight}>
              <Text style={styles.stockQty}>{product.stock_quantity}</Text>
              <Badge
                label={getStockLabel(product)}
                variant={getStockVariant(product)}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
  },
  stockCard: {
    backgroundColor: COLORS.surfaceSoft,
  },
  eyebrow: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  teamRow: {
    marginBottom: SPACING.sm,
  },
  memberName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '400',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.borderDefault,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    backgroundColor: COLORS.brandPrimary,
    borderRadius: 2,
  },
  barValue: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    width: 40,
    textAlign: 'right',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    paddingVertical: 2,
  },
  productName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '400',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  stockRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  stockQty: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
});
