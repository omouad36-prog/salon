import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  type LayoutChangeEvent,
  useWindowDimensions,
} from 'react-native';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { TimeSlotCard } from './TimeSlotCard';
import { FreeSlotCard } from './FreeSlotCard';
import { COLORS, FONT_SIZES, RADIUS, SPACING } from '../../lib/constants';
import type { AppointmentWithRelations } from '../../types/agenda';
import type { Staff } from '../../types/salon';

interface StaffDayBoardProps {
  staff: Staff[];
  appointments: AppointmentWithRelations[];
  onAppointmentPress: (appointment: AppointmentWithRelations) => void;
  onFlashOffer: (start: string, end: string) => void;
  onWaitlist: (start: string, end: string) => void;
}

type BoardItem =
  | {
      type: 'appointment';
      id: string;
      startsAt: number;
      appointment: AppointmentWithRelations;
    }
  | {
      type: 'free';
      id: string;
      startsAt: number;
      start: string;
      end: string;
      durationMinutes: number;
    };

export function StaffDayBoard({
  staff,
  appointments,
  onAppointmentPress,
  onFlashOffer,
  onWaitlist,
}: StaffDayBoardProps) {
  const { width } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(0);
  const horizontalPadding = SPACING.base * 2;
  const availableWidth = Math.max(
    0,
    (contentWidth || width) - horizontalPadding,
  );
  const columnsPerRow =
    availableWidth >= 1360 ? 3 : availableWidth >= 980 ? 2 : 1;
  const totalGap = SPACING.base * (columnsPerRow - 1);
  const columnWidth =
    columnsPerRow === 1
      ? availableWidth
      : Math.max(
          280,
          Math.floor((availableWidth - totalGap) / columnsPerRow),
        );

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setContentWidth(nativeEvent.layout.width);
  };

  const appointmentsByStaff = useMemo(() => {
    const map: Record<string, AppointmentWithRelations[]> = {};

    for (const member of staff) {
      map[member.id] = appointments
        .filter((appointment) => appointment.staff_id === member.id)
        .sort(
          (a, b) =>
            new Date(a.scheduled_start).getTime() -
            new Date(b.scheduled_start).getTime(),
        );
    }

    return map;
  }, [appointments, staff]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.board} onLayout={handleLayout}>
        {staff.map((member) => {
          const staffAppointments = appointmentsByStaff[member.id] ?? [];
          const items = buildBoardItems(staffAppointments);
          const hasInProgress = staffAppointments.some(
            (appointment) => appointment.status === 'in_progress',
          );
          const hasDelay = staffAppointments.some(
            (appointment) => appointment.delay_minutes > 0,
          );

          return (
            <View key={member.id} style={[styles.column, { width: columnWidth }]}>
              <Card style={styles.columnHeader} padding="base">
                <View style={styles.headerTop}>
                  <Avatar
                    firstName={member.name.split(' ')[0] ?? member.name}
                    lastName={member.name.split(' ').slice(1).join(' ')}
                    imageUrl={member.avatar_url}
                    size="md"
                  />
                  <View style={styles.headerCopy}>
                    <Text style={styles.staffName}>{member.name}</Text>
                    <Text style={styles.staffRole}>
                      {member.role === 'manager'
                        ? 'Manager'
                        : member.role === 'receptionist'
                          ? 'Accueil'
                          : 'Coiffeur'}
                    </Text>
                  </View>
                  <Badge
                    label={`${staffAppointments.length} RDV`}
                    variant="outline"
                  />
                </View>

                <View style={styles.headerBadges}>
                  {hasInProgress && <Badge label="En cours" variant="active" />}
                  {!hasInProgress && hasDelay && (
                    <Badge label="Attention" variant="delay" />
                  )}
                  {!hasInProgress && !hasDelay && (
                    <Badge label="Stable" variant="confirmed" />
                  )}
                </View>
              </Card>

              <View style={styles.columnBody}>
                {items.length === 0 ? (
                  <Card variant="quiet" style={styles.emptyCard} padding="lg">
                    <Text style={styles.emptyTitle}>Aucun rendez-vous</Text>
                    <Text style={styles.emptyText}>
                      Journée libre pour {member.name.split(' ')[0]}.
                    </Text>
                  </Card>
                ) : (
                  items.map((item, index) =>
                    item.type === 'appointment' ? (
                      <TimeSlotCard
                        key={item.id}
                        appointment={item.appointment}
                        onPress={onAppointmentPress}
                        index={index}
                      />
                    ) : (
                      <FreeSlotCard
                        key={item.id}
                        start={item.start}
                        end={item.end}
                        durationMinutes={item.durationMinutes}
                        onFlashOffer={() => onFlashOffer(item.start, item.end)}
                        onWaitlist={() => onWaitlist(item.start, item.end)}
                        index={index}
                      />
                    ),
                  )
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function buildBoardItems(
  appointments: AppointmentWithRelations[],
): BoardItem[] {
  const items: BoardItem[] = [];

  for (let index = 0; index < appointments.length; index += 1) {
    const appointment = appointments[index];

    items.push({
      type: 'appointment',
      id: appointment.id,
      startsAt: new Date(
        appointment.estimated_start ?? appointment.scheduled_start,
      ).getTime(),
      appointment,
    });

    const nextAppointment = appointments[index + 1];
    if (!nextAppointment) continue;

    const gapStart = new Date(appointment.scheduled_end);
    const gapEnd = new Date(nextAppointment.scheduled_start);
    const durationMinutes =
      (gapEnd.getTime() - gapStart.getTime()) / (1000 * 60);

    if (durationMinutes >= 30) {
      items.push({
        type: 'free',
        id: `free-${appointment.id}-${nextAppointment.id}`,
        startsAt: gapStart.getTime(),
        start: gapStart.toISOString(),
        end: gapEnd.toISOString(),
        durationMinutes,
      });
    }
  }

  return items.sort((a, b) => a.startsAt - b.startsAt);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.base,
    paddingTop: 0,
    paddingBottom: SPACING['3xl'],
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    gap: SPACING.base,
    width: '100%',
  },
  column: {
    gap: SPACING.base,
  },
  columnHeader: {
    gap: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  staffName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  staffRole: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  columnBody: {
    gap: SPACING.sm,
  },
  emptyCard: {
    minHeight: 132,
    justifyContent: 'center',
    borderRadius: RADIUS.card,
  },
  emptyTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZES.bodySmall * 1.5,
  },
});
