import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { FadeInView } from '../common/FadeInView';
import { COLORS, FONTS, FONT_SIZES, SPACING } from '../../lib/constants';
import { formatTime, formatDuration, formatPrice } from '../../lib/utils';
import type { AppointmentWithRelations, AppointmentStatus } from '../../types/agenda';

interface TimeSlotCardProps {
  appointment: AppointmentWithRelations;
  onPress: (appointment: AppointmentWithRelations) => void;
  index?: number;
}

const STATUS_CONFIG: Record<
  AppointmentStatus,
  {
    variant: 'default' | 'active' | 'confirmed' | 'delay' | 'error' | 'completed';
    accentColor: string;
    badgeLabel: string;
    badgeVariant: 'active' | 'confirmed' | 'delay' | 'error' | 'completed';
  }
> = {
  confirmed: {
    variant: 'default',
    accentColor: COLORS.confirmedBorder,
    badgeLabel: 'CONFIRMÉ',
    badgeVariant: 'confirmed',
  },
  in_progress: {
    variant: 'active',
    accentColor: COLORS.activeText,
    badgeLabel: 'EN COURS',
    badgeVariant: 'active',
  },
  completed: {
    variant: 'completed',
    accentColor: COLORS.completedBorder,
    badgeLabel: 'TERMINÉ',
    badgeVariant: 'completed',
  },
  no_show: {
    variant: 'error',
    accentColor: COLORS.errorText,
    badgeLabel: 'NO-SHOW',
    badgeVariant: 'error',
  },
  cancelled: {
    variant: 'completed',
    accentColor: COLORS.completedBorder,
    badgeLabel: 'ANNULÉ',
    badgeVariant: 'completed',
  },
};

export function TimeSlotCard({ appointment, onPress, index = 0 }: TimeSlotCardProps) {
  const config = STATUS_CONFIG[appointment.status];
  const isDelayed = appointment.delay_minutes > 0 && appointment.status !== 'completed';
  const isInProgress = appointment.status === 'in_progress';
  const isCompleted = appointment.status === 'completed' || appointment.status === 'cancelled';

  const displayTime = appointment.estimated_start
    ? formatTime(appointment.estimated_start)
    : formatTime(appointment.scheduled_start);

  const scheduledDuration = appointment.service?.duration_minutes ?? 30;
  const displayPrice =
    appointment.price_cents ?? appointment.service?.price_cents ?? null;

  return (
    <FadeInView delay={index * 50} duration={250}>
      <Card
        variant={isDelayed && !isInProgress ? 'delay' : config.variant}
        onPress={() => onPress(appointment)}
        style={[styles.card, isCompleted && styles.cardCompleted]}
      >
        <View style={styles.topMetaRow}>
          <View style={styles.topMetaLeft}>
            {isInProgress && <Badge label="En cours" variant="active" />}
            {isDelayed && (
              <Badge
                label={`Retard +${appointment.delay_minutes}min`}
                variant="delay"
              />
            )}
            {!isInProgress && !isDelayed && appointment.status !== 'confirmed' && (
              <Badge label={config.badgeLabel} variant={config.badgeVariant} />
            )}
          </View>
          <View style={styles.timePill}>
            <Text style={styles.time}>{displayTime}</Text>
          </View>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.clientInfo}>
            {appointment.client ? (
              <Avatar
                firstName={appointment.client.first_name}
                lastName={appointment.client.last_name}
                imageUrl={appointment.client.avatar_url}
                size="md"
              />
            ) : (
              <View style={styles.walkInAvatar}>
                <Text style={styles.walkInText}>WI</Text>
              </View>
            )}
            <View style={styles.nameContainer}>
              <Text style={[styles.clientName, isCompleted && styles.mutedText]} numberOfLines={1}>
                {appointment.client
                  ? `${appointment.client.first_name} ${appointment.client.last_name}`
                  : 'Sans rendez-vous'}
              </Text>
              <Text style={styles.staffName} numberOfLines={1}>
                {appointment.staff?.name ?? 'Équipe Cizo'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.serviceName, isCompleted && styles.mutedText]} numberOfLines={1}>
            {appointment.service?.name ?? 'Service à confirmer'}
          </Text>
          <View style={styles.metrics}>
            <Text style={styles.duration}>{formatDuration(scheduledDuration)}</Text>
            <Text style={styles.metricDot}>·</Text>
            <Text style={styles.price}>
              {displayPrice !== null ? formatPrice(displayPrice) : '—'}
            </Text>
          </View>
        </View>

        {isInProgress && (
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>
        )}
      </Card>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: SPACING.sm,
  },
  cardCompleted: {
    opacity: 0.76,
  },
  topMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  topMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  walkInAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walkInText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 0.48,
    textTransform: 'uppercase',
  },
  nameContainer: {
    flex: 1,
    gap: 2,
  },
  clientName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  staffName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
  timePill: {
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  serviceName: {
    flex: 1,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '400',
    color: COLORS.textPrimary,
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  metricDot: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textTertiary,
  },
  price: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  mutedText: {
    color: COLORS.completedText,
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: COLORS.activeBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '60%', // Will be dynamically driven by timer
    backgroundColor: COLORS.activeText,
    borderRadius: 2,
  },
});
