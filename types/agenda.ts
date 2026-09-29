import type { Client } from './client';
import type { Service, Staff } from './salon';

export type AppointmentStatus =
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'no_show'
  | 'cancelled';

export type AppointmentSource = 'booking' | 'manual' | 'flash_offer' | 'waitlist';

export interface Appointment {
  id: string;
  salon_id: string;
  client_id: string | null;
  staff_id: string | null;
  service_id: string | null;

  // Timing
  scheduled_start: string;
  scheduled_end: string;
  actual_start: string | null;
  actual_end: string | null;
  estimated_start: string | null;

  // State
  status: AppointmentStatus;
  delay_minutes: number;

  // Metadata
  price_cents: number | null;
  notes: string | null;
  source: AppointmentSource;
  reminder_sent: boolean;
  delay_notified: boolean;

  created_at: string;
}

export interface AppointmentWithRelations extends Appointment {
  client: Client | null;
  staff: Staff | null;
  service: Service | null;
}

export type AgendaView = 'day' | 'week' | 'month';

export interface TimeSlot {
  start: string;
  end: string;
  appointment: AppointmentWithRelations | null;
  isFreeSlot: boolean;
  durationMinutes: number;
}

export type WaitlistStatus = 'waiting' | 'contacted' | 'booked' | 'expired';

export interface WaitlistEntry {
  id: string;
  salon_id: string;
  client_id: string;
  service_id: string | null;
  staff_id: string | null;
  added_at: string;
  contacted_at: string | null;
  status: WaitlistStatus;
  client?: Client;
  service?: Service;
}
