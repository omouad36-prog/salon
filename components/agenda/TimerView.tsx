import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Pause, Play, Minus, Plus, CheckCircle } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressRing } from './ProgressRing';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { FadeInView } from '../common/FadeInView';
import { COLORS, FONT_SIZES, SPACING, TOUCH_TARGET } from '../../lib/constants';
import { formatTimerDisplay } from '../../lib/utils';
import { useTimerStore } from '../../stores/timerStore';
import { useAgendaStore } from '../../stores/agendaStore';

interface TimerViewProps {
  onClose: () => void;
}

export function TimerView({ onClose }: TimerViewProps) {
  const insets = useSafeAreaInsets();
  const store = useTimerStore();
  const updateAppointment = useAgendaStore((s) => s.updateAppointment);

  const {
    activeAppointmentId,
    isRunning,
    isPaused,
    elapsedSeconds,
    totalDurationSeconds,
    adjustmentSeconds,
  } = store;

  const adjustedDuration = totalDurationSeconds + adjustmentSeconds;
  const remainingSeconds = adjustedDuration - elapsedSeconds;
  const progress = adjustedDuration > 0 ? Math.min(1, elapsedSeconds / adjustedDuration) : 0;
  const isOvertime = remainingSeconds < 0;
  const overtimeMinutes = isOvertime ? Math.ceil(Math.abs(remainingSeconds) / 60) : 0;

  const appointments = useAgendaStore((s) => s.appointments);
  const activeAppointment = appointments.find(
    (a) => a.id === activeAppointmentId
  );

  if (!activeAppointment || !isRunning) return null;

  const clientName = activeAppointment.client
    ? `${activeAppointment.client.first_name} ${activeAppointment.client.last_name}`
    : 'Sans rendez-vous';
  const serviceName = activeAppointment.service?.name ?? 'Service';

  // Tick the timer every second
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => { store.tick(); }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isPaused]);

  const handleFinish = () => {
    updateAppointment(activeAppointmentId!, { status: 'completed', actual_end: new Date().toISOString() });
    store.stopTimer();
    onClose();
  };

  const handleAdjust = (deltaMinutes: number) => {
    store.adjustTime(deltaMinutes * 60);
  };

  return (
    <FadeInView
      duration={250}
      translateY={16}
      style={[styles.container, { paddingTop: insets.top + SPACING.xl }]}
    >
      {/* Progress Ring */}
      <ProgressRing
        size={200}
        strokeWidth={6}
        progress={progress}
        isOvertime={isOvertime}
      >
        <View style={styles.timerContent}>
          <Text
            style={[
              styles.timerDisplay,
              isOvertime && styles.timerOvertime,
            ]}
          >
            {formatTimerDisplay(remainingSeconds)}
          </Text>
          <Text style={styles.timerLabel}>
            {isOvertime ? 'dépassement' : 'restant'}
          </Text>
        </View>
      </ProgressRing>

      {/* Client & Service info */}
      <View style={styles.info}>
        <Text style={styles.clientName}>{clientName}</Text>
        <Text style={styles.serviceName}>{serviceName}</Text>
        {isOvertime && (
          <Badge
            label={`RETARD +${overtimeMinutes}min`}
            variant="delay"
            style={styles.badge}
          />
        )}
      </View>

      {/* Controls: -15min | Pause/Play | +15min */}
      <View style={styles.controls}>
        <Pressable
          onPress={() => handleAdjust(-15)}
          style={styles.adjustButton}
          accessibilityLabel="Réduire de 15 minutes"
        >
          <Minus size={20} color={COLORS.textSecondary} weight="light" />
          <Text style={styles.adjustLabel}>15min</Text>
        </Pressable>

        <Pressable
          onPress={isPaused ? store.resumeTimer : store.pauseTimer}
          style={styles.playPauseButton}
          accessibilityLabel={isPaused ? 'Reprendre' : 'Pause'}
        >
          {isPaused ? (
            <Play size={24} color={COLORS.textInverse} weight="fill" />
          ) : (
            <Pause size={24} color={COLORS.textInverse} weight="fill" />
          )}
        </Pressable>

        <Pressable
          onPress={() => handleAdjust(15)}
          style={styles.adjustButton}
          accessibilityLabel="Ajouter 15 minutes"
        >
          <Plus size={20} color={COLORS.textSecondary} weight="light" />
          <Text style={styles.adjustLabel}>15min</Text>
        </Pressable>
      </View>

      {/* Finish button */}
      <Button
        title="Terminer"
        onPress={handleFinish}
        variant="primary"
        fullWidth
        icon={<CheckCircle size={18} color={COLORS.textInverse} weight="light" />}
        style={styles.finishButton}
      />
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING['2xl'],
    gap: SPACING['2xl'],
    zIndex: 100,
  },
  timerContent: {
    alignItems: 'center',
    gap: 4,
  },
  timerDisplay: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.display,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.72,
  },
  timerOvertime: {
    color: '#854D0E',
  },
  timerLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  info: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  clientName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  serviceName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
  },
  badge: {
    marginTop: SPACING.sm,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  adjustButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minWidth: TOUCH_TARGET,
    minHeight: TOUCH_TARGET,
  },
  adjustLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 9,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  playPauseButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: TOUCH_TARGET,
    minHeight: TOUCH_TARGET,
  },
  finishButton: {
    position: 'absolute',
    bottom: SPACING['3xl'],
    left: SPACING.base,
    right: SPACING.base,
  },
});
