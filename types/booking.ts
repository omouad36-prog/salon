import type { Staff } from './salon';

export type BookingStep = 1 | 2 | 3 | 4;

export interface BookingClientInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface TimeSlotOption {
  time: string; // "HH:MM"
  available: boolean;
}

export interface StaffAvailability {
  staff: Staff;
  currentDelayMinutes: number;
}

export interface BookingDay {
  date: string; // "YYYY-MM-DD"
  dayShort: string; // "Lun", "Mar", etc.
  dayNumber: number;
  monthShort: string;
  isToday: boolean;
  isClosed: boolean;
}
