import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useDashboard } from '../../hooks/useDashboard';
import { useDeviceType } from '../../hooks/useDeviceType';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import {
  COLORS,
  FONT_SIZES,
  MOBILE_GUTTER,
  RADIUS,
  SPACING,
  TABLET_GUTTER,
} from '../../lib/constants';
import { formatTime } from '../../lib/utils';

export function PilotView() {
  const router = useRouter();
  const deviceType = useDeviceType();
  const isTablet = deviceType === 'tablet';
  const {
    nextAppointments,
    nextRDV,
    countdownMinutes: initialCountdown,
    remainingCount,
    staffCompleted,
    staffTotal,
    hoursWorked,
    minutesWorked,
    waitlist,
    recentMessages,
  } = useDashboard();

  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    setCountdown(initialCountdown);
    if (initialCountdown == null || initialCountdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((previous) => (previous != null && previous > 0 ? previous - 1 : 0));
    }, 60000);

    return () => clearInterval(interval);
  }, [initialCountdown]);

  const completionLabel = `${staffCompleted}/${staffTotal || 0}`;
  const hoursLabel =
    minutesWorked > 0
      ? `${hoursWorked}h${minutesWorked.toString().padStart(2, '0')}`
      : `${hoursWorked}h`;
  const focusCountdownLabel =
    countdown == null
      ? 'Libre'
      : countdown <= 0
        ? 'Maintenant'
        : countdown < 120
          ? `${countdown} min`
          : `${Math.floor(countdown / 60)}h${(countdown % 60).toString().padStart(2, '0')}`;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        isTablet ? styles.contentTablet : styles.contentPhone,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroGrid, isTablet && styles.heroGridTablet]}>
        <Card style={[styles.heroCard, styles.queueCard]} padding="lg">
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.eyebrow}>Aujourd'hui</Text>
              <Text style={styles.sectionTitle}>Cadence cabine</Text>
            </View>
            <Button
              title="Voir agenda"
              variant="secondary"
              size="small"
              onPress={() => router.navigate('/(tabs)/agenda')}
            />
          </View>

          <View style={styles.queueList}>
            {nextAppointments.length > 0 ? (
              nextAppointments.map((appointment) => (
                <View key={appointment.id} style={styles.queueRow}>
                  <View style={styles.queueTimeBlock}>
                    <Text style={styles.queueTime}>{formatTime(appointment.scheduled_start)}</Text>
                    <View
                      style={[
                        styles.queueDot,
                        appointment.status === 'in_progress' && styles.queueDotLive,
                      ]}
                    />
                  </View>
                  <View style={styles.queueCopy}>
                    <Text style={styles.queueClient}>
                      {appointment.client
                        ? `${appointment.client.first_name} ${appointment.client.last_name}`
                        : 'Client'}
                    </Text>
                    <Text style={styles.queueService}>
                      {appointment.service?.name ?? 'Service'}
                    </Text>
                  </View>
                  <Badge
                    label={appointment.status === 'in_progress' ? 'En cours' : 'A venir'}
                    variant={appointment.status === 'in_progress' ? 'active' : 'outline'}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.emptyCopy}>Aucun rendez-vous restant sur cette plage.</Text>
            )}
          </View>

          {remainingCount > 0 ? (
            <Text style={styles.footnote}>
              +{remainingCount} autre{remainingCount > 1 ? 's' : ''} rendez-vous visibles ensuite
            </Text>
          ) : null}
        </Card>

        <Card
          style={[styles.heroCard, styles.focusCard]}
          variant={countdown != null && countdown < 15 ? 'delay' : 'active'}
          padding="lg"
        >
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.eyebrow}>Prochain focus</Text>
              <Text style={styles.sectionTitle}>Client a accueillir</Text>
            </View>
            <Badge
              label={countdown != null && countdown < 15 ? 'Imminent' : 'A venir'}
              variant={countdown != null && countdown < 15 ? 'delay' : 'active'}
            />
          </View>

          {nextRDV ? (
            <>
              <Text style={styles.focusClient}>
                {nextRDV.client
                  ? `${nextRDV.client.first_name} ${nextRDV.client.last_name}`
                  : 'Client'}
              </Text>
              <Text style={styles.focusMeta}>
                {nextRDV.service?.name ?? 'Service'} · {formatTime(nextRDV.scheduled_start)}
              </Text>
              <Text style={styles.focusCountdown}>
                {focusCountdownLabel}
              </Text>
            </>
          ) : (
            <Text style={styles.emptyCopy}>La file est vide. Tu peux respirer ou ouvrir des slots.</Text>
          )}
        </Card>
      </View>

      <View style={[styles.metricsRow, isTablet ? styles.metricsRowTablet : styles.metricsRowPhone]}>
        <PilotMetricCard
          label="Coupes bouclees"
          value={completionLabel}
          meta="Realisees aujourd'hui"
          tone="confirmed"
          compact={!isTablet}
        />
        <PilotMetricCard
          label="Temps passe"
          value={hoursLabel}
          meta="Temps de service cumule"
          tone="default"
          compact={!isTablet}
        />
        <PilotMetricCard
          label="Liste d'attente"
          value={`${waitlist.length}`}
          meta="Clients a rappeler"
          tone="freeSlot"
          compact={!isTablet}
        />
      </View>

      <View style={[styles.detailGrid, isTablet && styles.detailGridTablet]}>
        <Card style={styles.detailCard} variant="freeSlot" padding="lg">
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.eyebrow}>Opportunites</Text>
              <Text style={styles.sectionTitle}>Liste d'attente chaude</Text>
            </View>
            <Badge label={`${waitlist.length}`} variant="delay" />
          </View>

          <View style={styles.peopleList}>
            {waitlist.length > 0 ? (
              waitlist.map((entry) => {
                const parts = entry.clientName.split(' ');
                return (
                  <View key={entry.id} style={styles.personRow}>
                    <Avatar firstName={parts[0]} lastName={parts[1] ?? ''} size="sm" />
                    <View style={styles.personCopy}>
                      <Text style={styles.personName}>{entry.clientName}</Text>
                      <Text style={styles.personMeta}>{entry.service}</Text>
                    </View>
                    <Text style={styles.personAside}>
                      {Math.round((Date.now() - new Date(entry.waitingSince).getTime()) / 60000)}m
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyCopy}>Personne n'attend actuellement.</Text>
            )}
          </View>
        </Card>

        <Card style={styles.detailCard} padding="lg">
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.eyebrow}>Messages</Text>
              <Text style={styles.sectionTitle}>Retours recents</Text>
            </View>
            <Badge
              label={recentMessages.some((message) => !message.isRead) ? 'Nouveaux' : 'Calme'}
              variant={recentMessages.some((message) => !message.isRead) ? 'active' : 'outline'}
            />
          </View>

          <View style={styles.peopleList}>
            {recentMessages.map((message) => (
              <View key={message.id} style={styles.messageRow}>
                <View style={styles.messageDotWrap}>
                  <View
                    style={[
                      styles.messageDot,
                      !message.isRead && styles.messageDotUnread,
                    ]}
                  />
                </View>
                <View style={styles.personCopy}>
                  <Text style={styles.personName}>{message.clientName}</Text>
                  <Text style={styles.messageExcerpt} numberOfLines={2}>
                    {message.excerpt}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

function PilotMetricCard({
  label,
  value,
  meta,
  tone,
  compact = false,
}: {
  label: string;
  value: string;
  meta: string;
  tone: 'default' | 'confirmed' | 'freeSlot';
  compact?: boolean;
}) {
  return (
    <Card
      style={[styles.metricCard, compact && styles.metricCardCompact]}
      variant={tone === 'default' ? 'default' : tone}
      padding="lg"
    >
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricMeta}>{meta}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING['4xl'],
    gap: SPACING.base,
  },
  contentPhone: {
    paddingHorizontal: 0,
  },
  contentTablet: {
    paddingHorizontal: 0,
  },
  heroGrid: {
    gap: SPACING.base,
  },
  heroGridTablet: {
    flexDirection: 'row',
  },
  heroCard: {
    gap: SPACING.base,
  },
  queueCard: {
    flex: 1.4,
  },
  focusCard: {
    flex: 1,
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  eyebrow: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.24,
  },
  sectionTitle: {
    marginTop: 4,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  queueList: {
    gap: SPACING.sm,
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  queueTimeBlock: {
    width: 66,
    gap: 6,
  },
  queueTime: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  queueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderHover,
  },
  queueDotLive: {
    backgroundColor: COLORS.activeText,
  },
  queueCopy: {
    flex: 1,
    gap: 3,
  },
  queueClient: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  queueService: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  footnote: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
  focusClient: {
    marginTop: SPACING.sm,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.45,
  },
  focusMeta: {
    marginTop: SPACING.sm,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
  },
  focusCountdown: {
    marginTop: SPACING['2xl'],
    fontFamily: 'Satoshi-Variable',
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  metricsRow: {
    gap: SPACING.base,
  },
  metricsRowPhone: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  metricsRowTablet: {
    flexDirection: 'row',
  },
  metricCard: {
    flex: 1,
    minHeight: 136,
  },
  metricCardCompact: {
    flexBasis: '48%',
    minHeight: 114,
  },
  metricLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.24,
  },
  metricValue: {
    marginTop: SPACING.base,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.45,
  },
  metricMeta: {
    marginTop: SPACING.sm,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  detailGrid: {
    gap: SPACING.base,
  },
  detailGridTablet: {
    flexDirection: 'row',
  },
  detailCard: {
    flex: 1,
    gap: SPACING.base,
  },
  peopleList: {
    gap: SPACING.sm,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  personCopy: {
    flex: 1,
    gap: 3,
  },
  personName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  personMeta: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  personAside: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.freeSlotText,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  messageDotWrap: {
    paddingTop: 6,
  },
  messageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderHover,
  },
  messageDotUnread: {
    backgroundColor: COLORS.activeText,
  },
  messageExcerpt: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  emptyCopy: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
