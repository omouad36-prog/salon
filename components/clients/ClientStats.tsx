import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_SIZES, FONTS, RADIUS, SPACING } from '../../lib/constants';
import { formatPrice } from '../../lib/utils';
import type { ClientWithScore } from '../../types/client';

interface ClientStatsProps {
  client: ClientWithScore;
}

export function ClientStats({ client }: ClientStatsProps) {
  return (
    <View style={styles.grid}>
      <StatCard label="Visites" value={client.visit_count.toString()} />
      <StatCard
        label="No-shows"
        value={client.no_show_count.toString()}
        tone={client.no_show_count > 0 ? 'alert' : 'muted'}
      />
      <StatCard
        label="Total dépensé"
        value={formatPrice(client.total_spent_cents)}
        mono
        tone="active"
      />
    </View>
  );
}

function StatCard({
  label,
  value,
  mono = false,
  tone = 'default',
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: 'default' | 'muted' | 'alert' | 'active';
}) {
  const toneStyles =
    tone === 'alert'
      ? styles.cardAlert
      : tone === 'active'
        ? styles.cardActive
        : tone === 'muted'
          ? styles.cardMuted
          : null;

  return (
    <View style={[styles.card, toneStyles]}>
      <Text style={[styles.value, mono && styles.valueMono]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  card: {
    flex: 1,
    minHeight: 88,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.base,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  cardMuted: {
    backgroundColor: COLORS.surfaceSoft,
    borderColor: COLORS.surfaceSoft,
  },
  cardAlert: {
    backgroundColor: COLORS.errorBackground,
    borderColor: COLORS.errorBorder,
  },
  cardActive: {
    backgroundColor: COLORS.activeBackground,
    borderColor: COLORS.activeBorder,
  },
  value: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  valueMono: {
    fontFamily: FONTS.mono,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
});
