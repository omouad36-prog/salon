import { create } from 'zustand';
import type { AgendaView, AppointmentWithRelations } from '../types/agenda';

interface AgendaState {
  selectedDate: Date;
  view: AgendaView;
  selectedStaffId: string | null; // null = all staff
  appointments: AppointmentWithRelations[];
  isLoading: boolean;

  setSelectedDate: (date: Date) => void;
  setView: (view: AgendaView) => void;
  setSelectedStaffId: (id: string | null) => void;
  setAppointments: (appointments: AppointmentWithRelations[]) => void;
  updateAppointment: (id: string, updates: Partial<AppointmentWithRelations>) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAgendaStore = create<AgendaState>((set) => ({
  selectedDate: new Date(),
  view: 'day',
  selectedStaffId: null,
  appointments: [],
  isLoading: true,

  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setView: (view) => set({ view }),
  setSelectedStaffId: (selectedStaffId) => set({ selectedStaffId }),
  setAppointments: (appointments) => set({ appointments }),
  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, ...updates } : apt
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({
    selectedDate: new Date(),
    view: 'day',
    selectedStaffId: null,
    appointments: [],
    isLoading: false,
  }),
}));
