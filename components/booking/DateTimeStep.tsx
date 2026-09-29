import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZES,
  FONTS,
  SPACING,
  RADIUS,
  FONT_WEIGHTS,
  TOUCH_TARGET,
} from '../../lib/constants';
import type { Salon, OpeningHours } from '../../types/salon';
import type { TimeSlotOption, BookingDay } from '../../types/booking';

const DAYS_SHORT_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS_SHORT_FR = [
  'janv.',
  'fév.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];
const DAY_KEYS: (keyof OpeningHours)[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

interface DateTimeStepProps {
  salon: Salon;
  selectedDate: string | null;
  selectedTime: string | null;
  availableSlots: TimeSlotOption[];
  selectedStaffName: string | null;
  currentDelay: number;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

function generateBookingDays(salon: Salon, count: number): BookingDay[] {
  const days: BookingDay[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dow = date.getDay();
    const dayKey = DAY_KEYS[dow];
    const isClosed = !salon.opening_hours?.[dayKey];

    days.push({
      date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
      dayShort: DAYS_SHORT_FR[dow],
      dayNumber: date.getDate(),
      monthShort: MONTHS_SHORT_FR[date.getMonth()],
      isToday: i === 0,
      isClosed,
    });
  }

  return days;
}

export function DateTimeStep({
  salon,
  selectedDate,
  selectedTime,
  availableSlots,
  selectedStaffName,
  currentDelay,
  onSelectDate,
  onSelectTime,
}: DateTimeStepProps) {
  const bookingDays = useMemo(() => generateBookingDays(salon, 14), [salon]);

  return (
    <View style={styles.container}>
      {/* Delay banner */}
      {selectedStaffName && currentDelay > 0 && (
        <View style={styles.delayBanner}>
          <Text style={styles.delayText}>
            {selectedStaffName} — ~{currentDelay}min de retard actuellement
          </Text>
        </View>
      )}

      {/* Horizontal date strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateStrip}
      >
        {bookingDays.map((day) => {
          const isSelected = selectedDate === day.date;
          return (
            <Pressable
              key={day.date}
              onPress={() => !day.isClosed && onSelectDate(day.date)}
              disabled={day.isClosed}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                day.isClosed && styles.dayCellClosed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${day.dayShort} ${day.dayNumber} ${day.monthShort}`}
              accessibilityState={{ selected: isSelected, disabled: day.isClosed }}
            >
              <Text
                style={[
                  styles.dayName,
                  day.isToday && styles.dayToday,
                  isSelected && styles.dayTextSelected,
                  day.isClosed && styles.dayTextClosed,
                ]}
              >
                {day.dayShort}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  day.isToday && styles.dayToday,
                  isSelected && styles.dayTextSelected,
                  day.isClosed && styles.dayTextClosed,
                ]}
              >
                {day.dayNumber}
              </Text>
              <Text
                style={[
                  styles.dayMonth,
                  isSelected && styles.dayTextSelected,
                  day.isClosed && styles.dayTextClosed,
                ]}
              >
                {day.monthShort}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Time slots grid */}
      {selectedDate && (
        <View style={styles.slotsSection}>
          <Text style={styles.slotsTitle}>Créneaux disponibles</Text>
          {availableSlots.length > 0 ? (
            <View style={styles.slotsGrid}>
              {availableSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <Pressable
                    key={slot.time}
                    onPress={() => slot.available && onSelectTime(slot.time)}
                    disabled={!slot.available}
                    style={[
                      styles.slotBtn,
                      isSelected && styles.slotBtnSelected,
                      !slot.available && styles.slotBtnDisabled,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: isSelected,
                      disabled: !slot.available,
                    }}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        isSelected && styles.slotTextSelected,
                        !slot.available && styles.slotTextDisabled,
                      ]}
                    >
                      {slot.time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text style={styles.noSlots}>
              Aucun créneau disponible pour cette date
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  delayBanner: {
    backgroundColor: COLORS.delayBackground,
    borderWidth: 1,
    borderColor: COLORS.delayBorder,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  delayText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.delayText,
    textAlign: 'center',
  },
  dateStrip: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  dayCell: {
    width: 64,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: 'center',
    gap: 2,
  },
  dayCellSelected: {
    backgroundColor: COLORS.activeBackground,
    borderColor: COLORS.activeBorder,
  },
  dayCellClosed: {
    opacity: 0.4,
  },
  dayName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
  },
  dayNumber: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
  },
  dayMonth: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textTertiary,
  },
  dayToday: {
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  dayTextSelected: {
    color: COLORS.activeText,
  },
  dayTextClosed: {
    color: COLORS.borderHover,
  },
  slotsSection: {
    gap: SPACING.md,
  },
  slotsTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  slotBtn: {
    minWidth: 80,
    height: TOUCH_TARGET,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotBtnSelected: {
    backgroundColor: COLORS.activeBackground,
    borderColor: COLORS.activeBorder,
  },
  slotBtnDisabled: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  slotText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  slotTextSelected: {
    color: COLORS.activeText,
  },
  slotTextDisabled: {
    color: COLORS.borderHover,
  },
  noSlots: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING['2xl'],
  },
});
