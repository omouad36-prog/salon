import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Lightning, ListPlus } from 'phosphor-react-native';
import { Card } from '../common/Card';
import { FadeInView } from '../common/FadeInView';
import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from '../../lib/constants';
import { formatDuration, formatTime } from '../../lib/utils';

interface FreeSlotCardProps {
  start: string;
  end: string;
  durationMinutes: number;
  onFlashOffer: () => void;
  onWaitlist: () => void;
  index?: number;
}

export function FreeSlotCard({
  start,
  end,
  durationMinutes,
  onFlashOffer,
  onWaitlist,
  index = 0,
}: FreeSlotCardProps) {
  return (
    <FadeInView delay={index * 50} duration={250}>
      <Card variant="freeSlot" style={styles.card}>
        <Text style={styles.eyebrow}>Opportunité</Text>
        <Text style={styles.label}>Créneau libre</Text>
        <Text style={styles.timeRange}>
          {formatTime(start)} – {formatTime(end)} · {formatDuration(durationMinutes)}
        </Text>
        <View style={styles.actions}>
          <Pressable onPress={onFlashOffer} style={styles.actionButton}>
            <Lightning size={16} color={COLORS.freeSlotText} weight="light" />
            <Text style={styles.actionLabel}>Offre Flash</Text>
          </Pressable>
          <Pressable onPress={onWaitlist} style={styles.actionButton}>
            <ListPlus size={16} color={COLORS.freeSlotText} weight="light" />
            <Text style={styles.actionLabel}>Liste d'attente</Text>
          </Pressable>
        </View>
      </Card>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    gap: SPACING.sm,
    paddingVertical: SPACING.base,
  },
  label: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.freeSlotText,
  },
  eyebrow: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.freeSlotText,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
  },
  timeRange: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    flexWrap: 'wrap',
  },
  actionButton: {
    minHeight: 40,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.freeSlotBorder,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.freeSlotText,
  },
});
