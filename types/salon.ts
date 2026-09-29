export interface Salon {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  brand_color: string;
  opening_hours: OpeningHours | null;
  settings: SalonSettings;
  stripe_customer_id: string | null;
  subscription_plan: SubscriptionPlan;
  created_at: string;
}

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string; // "09:00"
  close: string; // "19:00"
}

export type SubscriptionPlan = 'starter' | 'pro' | 'salon';

export interface SalonSettings {
  deposit_required?: boolean;
  deposit_amount_cents?: number;
  cancellation_delay_hours?: number;
  booking_info?: string;
  auto_reminder?: boolean;
  auto_reactivation?: boolean;
  daily_revenue_target_cents?: number;
}

export interface Staff {
  id: string;
  salon_id: string;
  name: string;
  avatar_url: string | null;
  role: StaffRole;
  is_active: boolean;
  specialties: string[];
  avg_service_times: Record<string, number>;
  created_at: string;
}

export type StaffRole = 'barber' | 'manager' | 'receptionist';

export interface Service {
  id: string;
  salon_id: string;
  name: string;
  category: ServiceCategory | null;
  duration_minutes: number;
  price_cents: number;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export type ServiceCategory = 'homme' | 'femme' | 'barbe' | 'couleur' | 'soin';
