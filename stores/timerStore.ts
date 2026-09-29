import { create } from 'zustand';

interface TimerState {
  activeAppointmentId: string | null;
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  totalDurationSeconds: number;
  adjustmentSeconds: number; // +/- 15min adjustments

  startTimer: (appointmentId: string, durationMinutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  tick: () => void;
  adjustTime: (deltaSeconds: number) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  activeAppointmentId: null,
  isRunning: false,
  isPaused: false,
  elapsedSeconds: 0,
  totalDurationSeconds: 0,
  adjustmentSeconds: 0,

  startTimer: (appointmentId, durationMinutes) =>
    set({
      activeAppointmentId: appointmentId,
      isRunning: true,
      isPaused: false,
      elapsedSeconds: 0,
      totalDurationSeconds: durationMinutes * 60,
      adjustmentSeconds: 0,
    }),

  pauseTimer: () => set({ isPaused: true }),
  resumeTimer: () => set({ isPaused: false }),

  stopTimer: () =>
    set({
      activeAppointmentId: null,
      isRunning: false,
      isPaused: false,
      elapsedSeconds: 0,
      totalDurationSeconds: 0,
      adjustmentSeconds: 0,
    }),

  tick: () =>
    set((state) => {
      if (!state.isRunning || state.isPaused) return state;
      return { elapsedSeconds: state.elapsedSeconds + 1 };
    }),

  adjustTime: (deltaSeconds) =>
    set((state) => ({
      adjustmentSeconds: state.adjustmentSeconds + deltaSeconds,
    })),
}));
