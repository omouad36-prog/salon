import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '../stores/timerStore';
import { useAgenda } from './useAgenda';

const RECALIBRATION_THRESHOLD_SECONDS = 5 * 60; // 5 minutes

export function useTimer() {
  const {
    activeAppointmentId,
    isRunning,
    isPaused,
    elapsedSeconds,
    totalDurationSeconds,
    adjustmentSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    tick,
    adjustTime,
  } = useTimerStore();

  const { recalibrate, completeService } = useAgenda();
  const hasRecalibratedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const staffIdRef = useRef<string | null>(null);

  // Adjusted total duration (after ±15min adjustments)
  const adjustedDuration = totalDurationSeconds + adjustmentSeconds;

  // Time remaining (can go negative = overtime)
  const remainingSeconds = adjustedDuration - elapsedSeconds;

  // Progress 0→1 (clamped)
  const progress = adjustedDuration > 0
    ? Math.min(1, elapsedSeconds / adjustedDuration)
    : 0;

  // Is overtime?
  const isOvertime = remainingSeconds < 0;

  // Overtime minutes (for recalibration)
  const overtimeMinutes = isOvertime
    ? Math.ceil(Math.abs(remainingSeconds) / 60)
    : 0;

  // Tick every second
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, tick]);

  // Trigger recalibration when overtime exceeds threshold
  useEffect(() => {
    if (
      isOvertime &&
      Math.abs(remainingSeconds) >= RECALIBRATION_THRESHOLD_SECONDS &&
      !hasRecalibratedRef.current &&
      staffIdRef.current
    ) {
      hasRecalibratedRef.current = true;
      recalibrate(staffIdRef.current, overtimeMinutes);
    }
  }, [isOvertime, remainingSeconds, overtimeMinutes, recalibrate]);

  const handleStart = useCallback(
    (appointmentId: string, durationMinutes: number, staffId: string) => {
      staffIdRef.current = staffId;
      hasRecalibratedRef.current = false;
      startTimer(appointmentId, durationMinutes);
    },
    [startTimer]
  );

  const handleFinish = useCallback(async () => {
    if (activeAppointmentId) {
      await completeService(activeAppointmentId);
    }
    staffIdRef.current = null;
    hasRecalibratedRef.current = false;
    stopTimer();
  }, [activeAppointmentId, completeService, stopTimer]);

  const handleAdjust = useCallback(
    (deltaMinutes: number) => {
      adjustTime(deltaMinutes * 60);
    },
    [adjustTime]
  );

  return {
    activeAppointmentId,
    isRunning,
    isPaused,
    elapsedSeconds,
    remainingSeconds,
    adjustedDuration,
    progress,
    isOvertime,
    overtimeMinutes,

    start: handleStart,
    pause: pauseTimer,
    resume: resumeTimer,
    finish: handleFinish,
    adjust: handleAdjust,
  };
}
