export type HairTexture = 'straight' | 'curly' | 'afro';
export type PreferredStyle = 'fade' | 'scissor' | 'taper' | 'buzz' | 'long';

export interface Client {
  id: string;
  salon_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  avatar_url: string | null;
  is_vip: boolean;
  hair_texture: HairTexture | null;
  preferred_style: PreferredStyle | null;
  has_beard: boolean | null;
  notes: string | null;
  whatsapp_opt_in_marketing: boolean;
  whatsapp_opt_in_utility: boolean;
  opt_in_timestamp: string | null;
  no_show_count: number;
  total_spent_cents: number;
  visit_count: number;
  last_visit_at: string | null;
  avg_visit_frequency_days: number | null;
  created_at: string;
}

export type ClientFilter = 'all' | 'vip' | 'inactive' | 'recent';
export type ClientSort = 'name' | 'last_visit' | 'total_spent';
export type ClientVisitStatus = 'completed' | 'no_show' | 'cancelled' | 'confirmed' | 'in_progress';

export interface ClientWithScore extends Client {
  value_score: number;
}

export interface ClientVisit {
  id: string;
  client_id: string;
  date: string;
  service_name: string;
  staff_name: string;
  price_cents: number;
  status: ClientVisitStatus;
}
