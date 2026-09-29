import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CalendarDots, CaretLeft, CaretRight, Plus } from 'phosphor-react-native';
import { DayTimeline } from '../../components/agenda/DayTimeline';
import { MonthView } from '../../components/agenda/MonthView';
import { StaffDayBoard } from '../../components/agenda/StaffDayBoard';
import { TimerView } from '../../components/agenda/TimerView';
import { WeekGrid } from '../../components/agenda/WeekGrid';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonList } from '../../components/common/Skeleton';
import { Header } from '../../components/layout/Header';
import { ScreenBackground } from '../../components/layout/ScreenBackground';
import { useDeviceType } from '../../hooks/useDeviceType';
import {
  COLORS,
  FONT_SIZES,
  MOBILE_GUTTER,
  RADIUS,
  RAIL_CARD_WIDTH,
  SCREEN_MAX_WIDTH,
  SPACING,
  TABLET_GUTTER,
  TOUCH_TARGET,
} from '../../lib/constants';
import { formatPrice, formatTime } from '../../lib/utils';
import { useAgendaStore } from '../../stores/agendaStore';
import { useSalonStore } from '../../stores/salonStore';
import { useTimerStore } from '../../stores/timerStore';
import type { AgendaView, AppointmentWithRelations } from '../../types/agenda';

const VIEW_OPTIONS: { value: AgendaView; label: string }[] = [
  { value: 'day', label: 'Jour' },
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
];

interface OpportunitySlot {
  staffName: string;
  start: string;
  end: string;
  durationMinutes: number;
}

export default function AgendaScreen() {
  const deviceType = useDeviceType();
  const isTablet = deviceType === 'tablet';
  const salon = useSalonStore((state) => state.salon);
  const allStaff = useSalonStore((state) => state.allStaff);
  const timerStore = useTimerStore();
  const [showTimer, setShowTimer] = useState(false);

  const {
    selectedDate,
    view,
    selectedStaffId,
    appointments,
    isLoading,
    setSelectedDate,
    setView,
    setSelectedStaffId,
    updateAppointment,
  } = useAgendaStore();

  const detectFreeSlots = useCallback((staffAppointments: AppointmentWithRelations[]) => {
    const sorted = [...staffAppointments].sort(
      (first, second) =>
        new Date(first.scheduled_start).getTime() -
        new Date(second.scheduled_start).getTime(),
    );
    const slots: OpportunitySlot[] = [];

    for (let index = 0; index < sorted.length - 1; index += 1) {
      const current = sorted[index];
      const next = sorted[index + 1];
      const currentEnd = new Date(current.scheduled_end);
      const nextStart = new Date(next.scheduled_start);
      const gapMinutes = (nextStart.getTime() - currentEnd.getTime()) / 60000;

      if (gapMinutes >= 30) {
        slots.push({
          staffName: current.staff?.name ?? 'Equipe',
          start: currentEnd.toISOString(),
          end: nextStart.toISOString(),
          durationMinutes: gapMinutes,
        });
      }
    }

    return slots;
  }, []);

  const monthLabel = useMemo(
    () =>
      selectedDate.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      }),
    [selectedDate],
  );

  const dateLabel = useMemo(() => {
    if (view === 'month') return monthLabel;
    return selectedDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, [monthLabel, selectedDate, view]);

  const navigateDate = useCallback(
    (delta: number) => {
      const nextDate = new Date(selectedDate);
      if (view === 'day') nextDate.setDate(nextDate.getDate() + delta);
      else if (view === 'week') nextDate.setDate(nextDate.getDate() + delta * 7);
      else nextDate.setMonth(nextDate.getMonth() + delta);
      setSelectedDate(nextDate);
    },
    [selectedDate, setSelectedDate, view],
  );

  const weekStart = useMemo(() => {
    const current = new Date(selectedDate);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    current.setDate(diff);
    current.setHours(0, 0, 0, 0);
    return current;
  }, [selectedDate]);

  const filteredAppointments = useMemo(() => {
    if (!selectedStaffId) return appointments;
    return appointments.filter((appointment) => appointment.staff_id === selectedStaffId);
  }, [appointments, selectedStaffId]);

  const freeSlots = useMemo(() => {
    if (view !== 'day' || !selectedStaffId) return [];
    return detectFreeSlots(filteredAppointments);
  }, [detectFreeSlots, filteredAppointments, selectedStaffId, view]);

  const opportunitySlots = useMemo(() => {
    const slots = selectedStaffId
      ? detectFreeSlots(filteredAppointments)
      : allStaff.flatMap((staff) =>
          detectFreeSlots(
            appointments.filter((appointment) => appointment.staff_id === staff.id),
          ),
        );

    return slots
      .sort((first, second) => {
        if (second.durationMinutes !== first.durationMinutes) {
          return second.durationMinutes - first.durationMinutes;
        }

        return (
          new Date(first.start).getTime() - new Date(second.start).getTime()
        );
      })
      .slice(0, 4);
  }, [allStaff, appointments, detectFreeSlots, filteredAppointments, selectedStaffId]);

  const agendaStats = useMemo(() => {
    const inProgressCount = filteredAppointments.filter(
      (appointment) => appointment.status === 'in_progress',
    ).length;
    const confirmedCount = filteredAppointments.filter(
      (appointment) => appointment.status === 'confirmed',
    ).length;
    const completedCount = filteredAppointments.filter(
      (appointment) => appointment.status === 'completed',
    ).length;
    const revenueCents = filteredAppointments.reduce(
      (sum, appointment) => sum + (appointment.price_cents ?? 0),
      0,
    );

    return [
      {
        label: 'Rendez-vous',
        value: `${filteredAppointments.length}`,
        meta: `${confirmedCount} a venir`,
        tone: 'default' as const,
      },
      {
        label: 'En cours',
        value: `${inProgressCount}`,
        meta: completedCount > 0 ? `${completedCount} termines` : 'Equipe en veille',
        tone: 'active' as const,
      },
      {
        label: 'Creneaux libres',
        value: `${opportunitySlots.length}`,
        meta: opportunitySlots[0]
          ? `${opportunitySlots[0].durationMinutes} min max`
          : 'Journee dense',
        tone: 'freeSlot' as const,
      },
      {
        label: 'CA prevu',
        value: formatPrice(revenueCents),
        meta: selectedStaffId ? 'Vue individuelle' : 'Vue studio',
        tone: 'confirmed' as const,
      },
    ];
  }, [filteredAppointments, opportunitySlots.length, selectedStaffId]);

  const selectedStaffName = useMemo(() => {
    if (!selectedStaffId) return 'Toute l equipe';
    return allStaff.find((staff) => staff.id === selectedStaffId)?.name ?? 'Equipe';
  }, [allStaff, selectedStaffId]);

  const handleAppointmentPress = useCallback(
    (appointment: AppointmentWithRelations) => {
      if (appointment.status === 'confirmed') {
        updateAppointment(appointment.id, {
          status: 'in_progress',
          actual_start: new Date().toISOString(),
        });

        if (appointment.service && appointment.staff_id) {
          timerStore.startTimer(appointment.id, appointment.service.duration_minutes);
          setShowTimer(true);
        }
      } else if (appointment.status === 'in_progress') {
        if (!timerStore.isRunning && appointment.service) {
          timerStore.startTimer(appointment.id, appointment.service.duration_minutes);
        }
        setShowTimer(true);
      }
    },
    [timerStore, updateAppointment],
  );

  const handleDayPress = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setView('day');
    },
    [setSelectedDate, setView],
  );

  if (showTimer && timerStore.isRunning) {
    return <TimerView onClose={() => setShowTimer(false)} />;
  }

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <View style={[styles.page, isTablet && styles.pageTablet]}>
        <Header
          title="Agenda studio"
          subtitle={`${salon?.name ?? 'Cizo'} · ${dateLabel}`}
          rightAction={
            <Button
              title="Nouveau"
              variant="primary"
              size="small"
              icon={<Plus size={16} color={COLORS.textInverse} weight="bold" />}
              onPress={() => {
                // Booking modal will be wired in the next product phase.
              }}
            />
          }
        />

        <Card style={styles.controlsCard} padding="lg">
          <View style={[styles.controlsRow, isTablet && styles.controlsRowTablet]}>
            <View style={styles.controlBlock}>
              <Text style={styles.controlLabel}>Vue</Text>
              <View style={styles.segmentedControl}>
                {VIEW_OPTIONS.map((option) => {
                  const isActive = option.value === view;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setView(option.value)}
                      style={[
                        styles.segmentItem,
                        isActive && styles.segmentItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentLabel,
                          isActive && styles.segmentLabelActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={[styles.controlBlock, styles.controlBlockGrow]}>
              <Text style={styles.controlLabel}>Equipe</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pillRow}
              >
                <Pressable
                  onPress={() => setSelectedStaffId(null)}
                  style={[
                    styles.filterPill,
                    !selectedStaffId && styles.filterPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      !selectedStaffId && styles.filterPillTextActive,
                    ]}
                  >
                    Tous
                  </Text>
                </Pressable>

                {allStaff.map((staff) => {
                  const isSelected = selectedStaffId === staff.id;
                  return (
                    <Pressable
                      key={staff.id}
                      onPress={() => setSelectedStaffId(staff.id)}
                      style={[
                        styles.filterPill,
                        isSelected && styles.filterPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          isSelected && styles.filterPillTextActive,
                        ]}
                      >
                        {staff.name.split(' ')[0]}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.dateNav}>
              <Pressable
                onPress={() => navigateDate(-1)}
                style={styles.dateNavButton}
                accessibilityLabel="Periode precedente"
              >
                <CaretLeft size={18} color={COLORS.textSecondary} weight="light" />
              </Pressable>
              <Pressable
                onPress={() => setSelectedDate(new Date())}
                style={styles.todayButton}
                accessibilityLabel="Aujourd'hui"
              >
                <Text style={styles.todayButtonText}>Auj.</Text>
              </Pressable>
              <Pressable
                onPress={() => navigateDate(1)}
                style={styles.dateNavButton}
                accessibilityLabel="Periode suivante"
              >
                <CaretRight size={18} color={COLORS.textSecondary} weight="light" />
              </Pressable>
            </View>
          </View>
        </Card>

        <View style={[styles.statsRow, !isTablet && styles.statsRowPhone]}>
          {agendaStats.map((item) => (
            <Card
              key={item.label}
              style={[
                styles.statCard,
                !isTablet && styles.statCardPhone,
              ]}
              variant={item.tone}
              padding="lg"
            >
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statMeta}>{item.meta}</Text>
            </Card>
          ))}
        </View>

        <View style={[styles.contentShell, isTablet && view === 'day' && styles.contentShellTablet]}>
          <View style={styles.mainColumn}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <SkeletonList count={6} />
              </View>
            ) : filteredAppointments.length === 0 && view === 'day' ? (
              <EmptyState
                icon={<CalendarDots size={48} color={COLORS.borderHover} weight="light" />}
                title="Journee ouverte"
                description="Ton studio n'a aucun rendez-vous sur cette plage. C'est le bon moment pour pousser un lien de reservation ou une offre flash."
                actionLabel="Partager le lien"
                onAction={() => {
                  // Booking share action will be added when messaging flows land.
                }}
              />
            ) : view === 'day' && !selectedStaffId ? (
              <StaffDayBoard
                staff={allStaff}
                appointments={filteredAppointments}
                onAppointmentPress={handleAppointmentPress}
                onFlashOffer={() => {
                  // Flash-offer flow ships with campaign tooling.
                }}
                onWaitlist={() => {
                  // Waitlist flow ships with campaign tooling.
                }}
              />
            ) : view === 'day' ? (
              <DayTimeline
                appointments={filteredAppointments}
                freeSlots={freeSlots}
                onAppointmentPress={handleAppointmentPress}
                onFlashOffer={() => {
                  // Flash-offer flow ships with campaign tooling.
                }}
                onWaitlist={() => {
                  // Waitlist flow ships with campaign tooling.
                }}
              />
            ) : view === 'week' ? (
              <WeekGrid
                appointments={filteredAppointments}
                weekStart={weekStart}
                onDayPress={handleDayPress}
                onAppointmentPress={handleAppointmentPress}
              />
            ) : (
              <MonthView
                currentMonth={selectedDate}
                appointments={filteredAppointments}
                onDayPress={handleDayPress}
                onPrevMonth={() => navigateDate(-1)}
                onNextMonth={() => navigateDate(1)}
              />
            )}
          </View>

          {isTablet && view === 'day' ? (
            <View style={styles.sideColumn}>
              <Card style={styles.sideCard} padding="lg">
                <View style={styles.sideHeader}>
                  <View>
                    <Text style={styles.sideEyebrow}>Focus equipe</Text>
                    <Text style={styles.sideTitle}>{selectedStaffName}</Text>
                  </View>
                  <Badge
                    label={selectedStaffId ? 'Individuel' : 'Studio'}
                    variant={selectedStaffId ? 'active' : 'outline'}
                  />
                </View>

                <View style={styles.summaryRows}>
                  {agendaStats.slice(0, 3).map((item) => (
                    <View key={item.label} style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>{item.label}</Text>
                      <Text style={styles.summaryValue}>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </Card>

              <Card style={styles.sideCard} variant="freeSlot" padding="lg">
                <View style={styles.sideHeader}>
                  <View>
                    <Text style={styles.sideEyebrow}>Opportunites</Text>
                    <Text style={styles.sideTitle}>Creneaux a pousser</Text>
                  </View>
                  <Badge label={`${opportunitySlots.length}`} variant="delay" />
                </View>

                <View style={styles.slotList}>
                  {opportunitySlots.length > 0 ? (
                    opportunitySlots.map((slot) => (
                      <View key={`${slot.staffName}-${slot.start}`} style={styles.slotRow}>
                        <View style={styles.slotCopy}>
                          <Text style={styles.slotTitle}>
                            {slot.staffName.split(' ')[0]} · {formatTime(slot.start)} - {formatTime(slot.end)}
                          </Text>
                          <Text style={styles.slotMeta}>
                            Fenetre de {slot.durationMinutes} min
                          </Text>
                        </View>
                        <Text style={styles.slotDuration}>{slot.durationMinutes}m</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.slotEmpty}>
                      Aucun trou majeur a monnayer sur cette vue.
                    </Text>
                  )}
                </View>
              </Card>

              <Card style={styles.sideCard} variant="quiet" padding="lg">
                <Text style={styles.sideEyebrow}>Lecture UX</Text>
                <Text style={styles.sideNote}>
                  L'agenda priorise maintenant la lecture studio avant les details. Le but est d'aider a voir la charge, les trous et l'etat de l'equipe en moins de trois secondes.
                </Text>
              </Card>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: MOBILE_GUTTER,
    paddingBottom: SPACING.base,
    gap: SPACING.base,
  },
  pageTablet: {
    paddingHorizontal: TABLET_GUTTER,
    paddingBottom: SPACING.lg,
    gap: SPACING.lg,
  },
  controlsCard: {
    backgroundColor: COLORS.surfaceElevated,
  },
  controlsRow: {
    gap: SPACING.base,
  },
  controlsRowTablet: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  controlBlock: {
    gap: SPACING.sm,
  },
  controlBlockGrow: {
    flex: 1,
  },
  controlLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
  },
  segmentedControl: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: SPACING.xs,
    padding: 4,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
  },
  segmentItem: {
    minHeight: 40,
    minWidth: 72,
    paddingHorizontal: SPACING.md,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: COLORS.brandPrimary,
  },
  segmentLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  segmentLabelActive: {
    color: COLORS.textInverse,
  },
  pillRow: {
    gap: SPACING.sm,
  },
  filterPill: {
    minHeight: 40,
    paddingHorizontal: SPACING.base,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: COLORS.activeBackground,
    borderColor: COLORS.activeBorder,
  },
  filterPillText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.activeText,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.sm,
  },
  dateNavButton: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayButton: {
    minHeight: TOUCH_TARGET,
    paddingHorizontal: SPACING.base,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayButtonText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.base,
  },
  statsRowPhone: {
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    minHeight: 132,
  },
  statCardPhone: {
    flexBasis: '48%',
    minHeight: 110,
  },
  statLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.24,
  },
  statValue: {
    marginTop: SPACING.md,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.45,
  },
  statMeta: {
    marginTop: SPACING.sm,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  contentShell: {
    flex: 1,
  },
  contentShellTablet: {
    flexDirection: 'row',
    gap: SPACING.base,
    alignItems: 'stretch',
  },
  mainColumn: {
    flex: 1,
    minHeight: 0,
  },
  sideColumn: {
    width: RAIL_CARD_WIDTH,
    gap: SPACING.base,
  },
  sideCard: {
    gap: SPACING.base,
  },
  sideHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  sideEyebrow: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.24,
  },
  sideTitle: {
    marginTop: 4,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  summaryRows: {
    gap: SPACING.base,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  summaryLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  slotList: {
    gap: SPACING.sm,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  slotCopy: {
    flex: 1,
    gap: 3,
  },
  slotTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  slotMeta: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
  slotDuration: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.freeSlotText,
  },
  slotEmpty: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  sideNote: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
  },
});
