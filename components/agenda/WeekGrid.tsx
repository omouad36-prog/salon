import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { FadeInView } from '../common/FadeInView';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../../lib/constants';
import { formatTime } from '../../lib/utils';
import type { AppointmentWithRelations } from '../../types/agenda';

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

interface WeekGridProps {
  appointments: AppointmentWithRelations[];
  weekStart: Date;
  onDayPress: (date: Date) => void;
  onAppointmentPress: (appointment: AppointmentWithRelations) => void;
}

export function WeekGrid({
  appointments,
  weekStart,
  onDayPress,
  onAppointmentPress,
}: WeekGridProps) {
  // Generate 7 days starting from weekStart (Monday)
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart.toISOString()]);

  // Group appointments by day
  const appointmentsByDay = useMemo(() => {
    const map: Record<string, AppointmentWithRelations[]> = {};
    for (const day of days) {
      const key = day.toISOString().split('T')[0];
      map[key] = [];
    }
    for (const apt of appointments) {
      const key = new Date(apt.scheduled_start).toISOString().split('T')[0];
      if (map[key]) map[key].push(apt);
    }
    return map;
  }, [appointments, days]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.grid}>
        {days.map((day, i) => {
          const key = day.toISOString().split('T')[0];
          const dayAppointments = appointmentsByDay[key] ?? [];
          const isToday = key === today;
          const fillRate =
            dayAppointments.length > 0
              ? Math.min(100, Math.round((dayAppointments.length / 10) * 100))
              : 0;

          return (
            <Pressable
              key={key}
              style={styles.dayColumn}
              onPress={() => onDayPress(day)}
            >
              {/* Day header */}
              <View style={[styles.dayHeader, isToday && styles.dayHeaderToday]}>
                <Text style={[styles.dayName, isToday && styles.dayNameToday]}>
                  {DAYS_FR[i]}
                </Text>
                <Text style={[styles.dayNumber, isToday && styles.dayNumberToday]}>
                  {day.getDate()}
                </Text>
                <Text style={styles.fillRate}>{fillRate}%</Text>
              </View>

              {/* Appointment cells */}
              <View style={styles.daySlots}>
                {dayAppointments.map((apt, idx) => (
                  <FadeInView
                    key={apt.id}
                    delay={idx * 30}
                    duration={200}
                    translateY={6}
                  >
                    <Pressable
                      style={[
                        styles.miniCard,
                        getMiniCardStyle(apt.status),
                      ]}
                      onPress={() => onAppointmentPress(apt)}
                    >
                      <Text style={styles.miniTime}>
                        {formatTime(apt.scheduled_start)}
                      </Text>
                      <Text style={styles.miniName} numberOfLines={1}>
                        {apt.client
                          ? apt.client.first_name
                          : '—'}
                      </Text>
                    </Pressable>
                  </FadeInView>
                ))}

                {dayAppointments.length === 0 && (
                  <Text style={styles.emptyDay}>—</Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function getMiniCardStyle(status: string): { backgroundColor: string; borderColor: string } {
  switch (status) {
    case 'in_progress':
      return {
        backgroundColor: COLORS.activeBackground,
        borderColor: COLORS.activeBorder,
      };
    case 'completed':
      return {
        backgroundColor: COLORS.completedBackground,
        borderColor: COLORS.completedBorder,
      };
    case 'no_show':
      return {
        backgroundColor: COLORS.errorBackground,
        borderColor: COLORS.errorBorder,
      };
    default:
      return {
        backgroundColor: COLORS.surface,
        borderColor: COLORS.confirmedBorder,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  dayColumn: {
    flex: 1,
    minWidth: 100,
  },
  dayHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
    gap: 2,
  },
  dayHeaderToday: {
    backgroundColor: COLORS.brandPrimary,
    borderRadius: RADIUS.pill,
    marginHorizontal: SPACING.xs,
  },
  dayName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  dayNameToday: {
    color: COLORS.textInverse,
  },
  dayNumber: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dayNumberToday: {
    color: COLORS.textInverse,
  },
  fillRate: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 10,
    color: COLORS.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  daySlots: {
    paddingTop: SPACING.sm,
    gap: SPACING.xs,
  },
  miniCard: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  miniTime: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  miniName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  emptyDay: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
});
