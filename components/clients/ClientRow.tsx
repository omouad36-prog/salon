import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChatCircleDots, CaretRight } from 'phosphor-react-native';
import { useDeviceType } from '../../hooks/useDeviceType';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import {
  COLORS,
  FONT_SIZES,
  ICON_SIZES,
  RADIUS,
  SPACING,
  TOUCH_TARGET,
} from '../../lib/constants';
import { formatPrice, formatRelativeCompactDate } from '../../lib/utils';
import type { ClientWithScore } from '../../types/client';

interface ClientRowProps {
  client: ClientWithScore;
  onPress: () => void;
  onMessagePress: () => void;
  showDivider?: boolean;
}

export function ClientRow({
  client,
  onPress,
  onMessagePress,
  showDivider = false,
}: ClientRowProps) {
  const isTablet = useDeviceType() === 'tablet';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        showDivider && styles.cardDivider,
      ]}
    >
      <View style={[styles.row, isTablet && styles.rowTablet]}>
        <View style={styles.identity}>
          <Avatar
            firstName={client.first_name}
            lastName={client.last_name}
            imageUrl={client.avatar_url}
            size="md"
          />

          <View style={styles.identityCopy}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {client.first_name} {client.last_name}
              </Text>
              {client.is_vip ? <Badge label="VIP" variant="vip" /> : null}
            </View>

            <Text style={styles.meta} numberOfLines={1}>
              Derniere visite {formatRelativeCompactDate(client.last_visit_at)} · {client.visit_count} visites
            </Text>
          </View>
        </View>

        <View style={[styles.metrics, isTablet && styles.metricsTablet]}>
          <MetricPill label="Valeur" value={`${client.value_score}`} />
          <MetricPill label="CA" value={formatPrice(client.total_spent_cents)} />
          <MetricPill label="No-show" value={`${client.no_show_count}`} tone={client.no_show_count > 0 ? 'alert' : 'default'} />
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={onMessagePress}
            style={styles.messageButton}
            accessibilityLabel={`Message rapide pour ${client.first_name} ${client.last_name}`}
          >
            <ChatCircleDots size={18} color={COLORS.textSecondary} weight="light" />
          </Pressable>

          <View style={styles.chevronButton}>
            <CaretRight size={ICON_SIZES.inline} color={COLORS.textTertiary} weight="bold" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function MetricPill({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'alert';
}) {
  return (
    <View style={[styles.metricPill, tone === 'alert' && styles.metricPillAlert]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.base,
    backgroundColor: COLORS.surface,
  },
  cardPressed: {
    backgroundColor: COLORS.surfaceSoft,
  },
  cardDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  row: {
    gap: SPACING.base,
  },
  rowTablet: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  identityCopy: {
    flex: 1,
    gap: 5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  name: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  meta: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  metricsTablet: {
    minWidth: 290,
    justifyContent: 'flex-end',
  },
  metricPill: {
    minWidth: 78,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
    gap: 2,
  },
  metricPillAlert: {
    backgroundColor: COLORS.errorBackground,
    borderColor: COLORS.errorBorder,
  },
  metricLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  messageButton: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronButton: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
