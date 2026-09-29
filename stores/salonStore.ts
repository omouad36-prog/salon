import { create } from 'zustand';
import type { Salon, Staff } from '../types/salon';

interface SalonState {
  salon: Salon | null;
  currentStaff: Staff | null;
  allStaff: Staff[];
  isLoading: boolean;

  setSalon: (salon: Salon) => void;
  setCurrentStaff: (staff: Staff) => void;
  setAllStaff: (staff: Staff[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useSalonStore = create<SalonState>((set) => ({
  salon: null,
  currentStaff: null,
  allStaff: [],
  isLoading: true,

  setSalon: (salon) => set({ salon }),
  setCurrentStaff: (currentStaff) => set({ currentStaff }),
  setAllStaff: (allStaff) => set({ allStaff }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ salon: null, currentStaff: null, allStaff: [], isLoading: false }),
}));
