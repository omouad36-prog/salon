import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, RADIUS } from '../../lib/constants';
import type { AppointmentWithRelations } from '../../types/agenda';

const DAYS_HEADER = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface MonthViewProps {
  currentMonth: Date;
  appointments: AppointmentWithRelations[];
  onDayPress: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthView({
  currentMonth,
  appointments,
  onDayPress,
  onPrevMonth,
  onNextMonth,
}: MonthViewProps) {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  // Build appointment count by day
  const appointmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const apt of appointments) {
      const d = new Date(apt.scheduled_start);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [appointments]);

  // Build calendar grid
  const weeks = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    // Monday = 0, Sunday = 6
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];

    // Pad start
    for (let i = 0; i < startDow; i++) cells.push(null);
    // Fill days
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    // Pad end
    while (cells.length % 7 !== 0) cells.push(null);

    // Split into weeks
    const result: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  }, [currentMonth]);

  const monthLabel = currentMonth.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  // Summary stats
  const totalAppointments = appointments.length;
  const totalDays = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const daysWithAppointments = Object.keys(appointmentCounts).length;

  return (
    <View style={styles.container}>
      {/* Month header with navigation */}
      <View style={styles.monthHeader}>
        <Pressable onPress={onPrevMonth} style={styles.navButton} accessibilityLabel="Mois précédent">
          <Text style={styles.navArrow}>{'‹'}</Text>
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <Pressable onPress={onNextMonth} style={styles.navButton} accessibilityLabel="Mois suivant">
          <Text style={styles.navArrow}>{'›'}</Text>
        </Pressable>
      </View>

      {/* Day headers */}
      <View style={styles.daysHeader}>
        {DAYS_HEADER.map((d, i) => (
          <Text key={i} style={styles.dayHeaderText}>
            {d}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((day, di) => {
            if (!day) {
              return <View key={`empty-${di}`} style={styles.dayCell} />;
            }

            const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
            const isToday = key === todayKey;
            const count = appointmentCounts[key] ?? 0;

            return (
              <Pressable
                key={key}
                style={[styles.dayCell, isToday && styles.dayCellToday]}
                onPress={() => onDayPress(day)}
                accessibilityLabel={`${day.getDate()}, ${count} rendez-vous`}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isToday && styles.dayNumberToday,
                  ]}
                >
                  {day.getDate()}
                </Text>
                {count > 0 && (
                  <View style={styles.dotContainer}>
                    <View
                      style={[
                        styles.dot,
                        count >= 5 && styles.dotBusy,
                      ]}
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}

      {/* Monthly summary */}
      <View style={styles.summary}>
        <SummaryItem label="Total RDV" value={totalAppointments.toString()} />
        <SummaryItem
          label="Taux remplissage"
          value={`${Math.round((daysWithAppointments / totalDays) * 100)}%`}
        />
        <SummaryItem label="Jours actifs" value={`${daysWithAppointments}/${totalDays}`} />
      </View>
    </View>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.base,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingVertical: SPACING.base,
  },
  navButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  monthLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textTransform: 'capitalize',
    minWidth: 160,
    textAlign: 'center',
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    gap: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  dayCellToday: {
    backgroundColor: COLORS.brandPrimary,
  },
  dayNumber: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  dayNumberToday: {
    color: COLORS.textInverse,
    fontWeight: '600',
  },
  dotContainer: {
    height: 6,
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  dotBusy: {
    backgroundColor: '#F59E0B',
  },
  summary: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    paddingVertical: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDefault,
    gap: SPACING.base,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  summaryLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.textTertiary,
  },
});
