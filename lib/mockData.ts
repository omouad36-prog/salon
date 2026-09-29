import type { AppointmentWithRelations } from '../types/agenda';
import type { Staff, Service, Salon } from '../types/salon';
import type { Client } from '../types/client';

// ============================================
// SALON
// ============================================
export const MOCK_SALON: Salon = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Atelier Nord',
  slug: 'atelier-nord',
  address: '10 rue de la Démo',
  city: 'Paris',
  postal_code: '75000',
  phone: '+33 6 00 00 00 01',
  email: 'hello@example.com',
  logo_url: null,
  brand_color: '#1A1A1A',
  opening_hours: {
    monday: { open: '09:00', close: '19:00' },
    tuesday: { open: '09:00', close: '19:00' },
    wednesday: { open: '09:00', close: '19:00' },
    thursday: { open: '09:00', close: '20:00' },
    friday: { open: '09:00', close: '20:00' },
    saturday: { open: '08:30', close: '18:00' },
  },
  settings: { daily_revenue_target_cents: 65000 },
  stripe_customer_id: null,
  subscription_plan: 'pro',
  created_at: '2025-06-01T00:00:00Z',
};

// ============================================
// STAFF
// ============================================
export const MOCK_STAFF: Staff[] = [
  {
    id: 'staff-001',
    salon_id: MOCK_SALON.id,
    name: 'Karim Benzegra',
    avatar_url: null,
    role: 'manager',
    is_active: true,
    specialties: ['coupe-homme', 'barbe', 'coloration'],
    avg_service_times: { 'coupe-homme': 32, barbe: 18, coloration: 55 },
    created_at: '2025-06-01T00:00:00Z',
  },
  {
    id: 'staff-002',
    salon_id: MOCK_SALON.id,
    name: 'Cristiane Oliveira',
    avatar_url: null,
    role: 'barber',
    is_active: true,
    specialties: ['coupe-femme', 'coloration', 'soin'],
    avg_service_times: { 'coupe-femme': 42, coloration: 58, soin: 35 },
    created_at: '2025-06-01T00:00:00Z',
  },
  {
    id: 'staff-003',
    salon_id: MOCK_SALON.id,
    name: 'Aïdaa Benali',
    avatar_url: null,
    role: 'barber',
    is_active: true,
    specialties: ['coupe-homme', 'coupe-femme', 'barbe'],
    avg_service_times: { 'coupe-homme': 28, 'coupe-femme': 38, barbe: 15 },
    created_at: '2025-06-01T00:00:00Z',
  },
];

// ============================================
// SERVICES
// ============================================
export const MOCK_SERVICES: Service[] = [
  { id: 'svc-001', salon_id: MOCK_SALON.id, name: 'Coupe Homme', category: 'homme', duration_minutes: 30, price_cents: 2300, description: null, is_active: true, sort_order: 1, created_at: '' },
  { id: 'svc-002', salon_id: MOCK_SALON.id, name: 'Coupe + Barbe', category: 'homme', duration_minutes: 45, price_cents: 3700, description: null, is_active: true, sort_order: 2, created_at: '' },
  { id: 'svc-003', salon_id: MOCK_SALON.id, name: 'Taille de Barbe', category: 'barbe', duration_minutes: 20, price_cents: 1500, description: null, is_active: true, sort_order: 3, created_at: '' },
  { id: 'svc-004', salon_id: MOCK_SALON.id, name: 'Dégradé Américain', category: 'homme', duration_minutes: 35, price_cents: 2800, description: null, is_active: true, sort_order: 4, created_at: '' },
  { id: 'svc-005', salon_id: MOCK_SALON.id, name: 'Coupe Femme', category: 'femme', duration_minutes: 45, price_cents: 3500, description: null, is_active: true, sort_order: 5, created_at: '' },
  { id: 'svc-006', salon_id: MOCK_SALON.id, name: 'Coloration Complète', category: 'couleur', duration_minutes: 60, price_cents: 5500, description: null, is_active: true, sort_order: 6, created_at: '' },
  { id: 'svc-007', salon_id: MOCK_SALON.id, name: 'Soin Kératine', category: 'soin', duration_minutes: 40, price_cents: 4200, description: null, is_active: true, sort_order: 7, created_at: '' },
];

// ============================================
// CLIENTS
// ============================================
// Dates below are written against a fixed reference day and shifted to
// "now" at load, so the demo always looks current (recent visits, win-backs).
const MOCK_REFERENCE_DAY = Date.parse('2026-03-27T00:00:00Z');
const shiftToNow = (iso: string | null) =>
  iso ? new Date(Date.parse(iso) + (Date.now() - MOCK_REFERENCE_DAY)).toISOString() : iso;

const MOCK_CLIENTS_AT_REFERENCE: Client[] = [
  { id: 'cli-001', salon_id: MOCK_SALON.id, first_name: 'Aïdaa', last_name: 'Benali', phone: '+33 6 00 00 00 02', email: 'aidaa.b@example.com', avatar_url: null, is_vip: true, hair_texture: 'curly', preferred_style: 'fade', has_beard: true, notes: 'Préfère garder du volume au-dessus et éviter une nuque trop courte.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2024-02-14T10:00:00Z', no_show_count: 0, total_spent_cents: 38700, visit_count: 14, last_visit_at: '2026-03-22T11:00:00Z', avg_visit_frequency_days: 18, created_at: '2023-11-04T10:00:00Z' },
  { id: 'cli-002', salon_id: MOCK_SALON.id, first_name: 'Marco', last_name: 'Ferreira', phone: '+33 6 00 00 00 03', email: null, avatar_url: null, is_vip: false, hair_texture: 'straight', preferred_style: 'scissor', has_beard: false, notes: 'Passe surtout en semaine entre midi et deux.', whatsapp_opt_in_marketing: false, whatsapp_opt_in_utility: true, opt_in_timestamp: '2025-01-12T09:30:00Z', no_show_count: 1, total_spent_cents: 12400, visit_count: 5, last_visit_at: '2026-03-10T15:30:00Z', avg_visit_frequency_days: 24, created_at: '2024-08-19T09:00:00Z' },
  { id: 'cli-003', salon_id: MOCK_SALON.id, first_name: 'Léa', last_name: 'Dumont', phone: '+33 6 00 00 00 04', email: 'lea.dumont@example.com', avatar_url: null, is_vip: true, hair_texture: 'straight', preferred_style: null, has_beard: false, notes: 'Coloration tous les mois, aime finir avec un brushing souple.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2024-03-08T14:15:00Z', no_show_count: 0, total_spent_cents: 52300, visit_count: 11, last_visit_at: '2026-03-18T10:00:00Z', avg_visit_frequency_days: 21, created_at: '2023-06-21T14:00:00Z' },
  { id: 'cli-004', salon_id: MOCK_SALON.id, first_name: 'Sophie', last_name: 'Chen', phone: '+33 6 00 00 00 05', email: null, avatar_url: null, is_vip: false, hair_texture: 'straight', preferred_style: null, has_beard: false, notes: 'Préfère les rendez-vous calmes en début d’après-midi.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2025-02-01T11:00:00Z', no_show_count: 0, total_spent_cents: 18600, visit_count: 4, last_visit_at: '2026-02-28T14:00:00Z', avg_visit_frequency_days: 28, created_at: '2024-10-06T11:30:00Z' },
  { id: 'cli-005', salon_id: MOCK_SALON.id, first_name: 'Youssef', last_name: 'Kaddouri', phone: '+33 6 00 00 00 06', email: null, avatar_url: null, is_vip: false, hair_texture: 'curly', preferred_style: 'fade', has_beard: true, notes: 'Demande souvent une reprise de contours très nette.', whatsapp_opt_in_marketing: false, whatsapp_opt_in_utility: true, opt_in_timestamp: '2025-05-18T16:45:00Z', no_show_count: 2, total_spent_cents: 8700, visit_count: 3, last_visit_at: '2026-02-14T10:00:00Z', avg_visit_frequency_days: 35, created_at: '2025-02-03T16:30:00Z' },
  { id: 'cli-006', salon_id: MOCK_SALON.id, first_name: 'Chloé', last_name: 'Moreau', phone: '+33 6 00 00 00 07', email: 'chloe.m@example.com', avatar_url: null, is_vip: true, hair_texture: 'curly', preferred_style: null, has_beard: false, notes: 'Cliente fidèle pour soin + coupe, préfère la première heure du matin.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2023-09-05T08:50:00Z', no_show_count: 0, total_spent_cents: 71200, visit_count: 16, last_visit_at: '2026-03-24T09:30:00Z', avg_visit_frequency_days: 14, created_at: '2023-02-11T09:00:00Z' },
  { id: 'cli-007', salon_id: MOCK_SALON.id, first_name: 'Ibrahim', last_name: 'Diallo', phone: '+33 6 00 00 00 08', email: null, avatar_url: null, is_vip: false, hair_texture: 'afro', preferred_style: 'taper', has_beard: true, notes: 'Aime caler ses passages en fin de journée après le travail.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2024-11-20T18:05:00Z', no_show_count: 0, total_spent_cents: 21300, visit_count: 7, last_visit_at: '2026-03-20T16:00:00Z', avg_visit_frequency_days: 22, created_at: '2024-04-17T18:00:00Z' },
  { id: 'cli-008', salon_id: MOCK_SALON.id, first_name: 'Thomas', last_name: 'Nguyen', phone: '+33 6 00 00 00 12', email: 'thomas.ng@example.com', avatar_url: null, is_vip: true, hair_texture: 'straight', preferred_style: 'fade', has_beard: false, notes: 'Passe souvent juste avant ses rendez-vous clients, timing très serré.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2023-12-12T13:30:00Z', no_show_count: 0, total_spent_cents: 44100, visit_count: 18, last_visit_at: '2026-03-25T10:00:00Z', avg_visit_frequency_days: 12, created_at: '2023-04-09T13:00:00Z' },
  { id: 'cli-009', salon_id: MOCK_SALON.id, first_name: 'Emma', last_name: 'Petit', phone: '+33 6 00 00 00 09', email: 'emma.petit@example.com', avatar_url: null, is_vip: false, hair_texture: 'straight', preferred_style: null, has_beard: false, notes: null, whatsapp_opt_in_marketing: false, whatsapp_opt_in_utility: true, opt_in_timestamp: '2026-03-01T10:00:00Z', no_show_count: 0, total_spent_cents: 3500, visit_count: 1, last_visit_at: '2026-03-01T10:00:00Z', avg_visit_frequency_days: null, created_at: '2026-03-01T10:00:00Z' },
  { id: 'cli-010', salon_id: MOCK_SALON.id, first_name: 'Rayan', last_name: 'Amrani', phone: '+33 6 00 00 00 10', email: 'rayan.a@example.com', avatar_url: null, is_vip: false, hair_texture: 'curly', preferred_style: 'buzz', has_beard: true, notes: 'Coupe très courte sur les côtés, toujours pressé.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2025-12-22T11:00:00Z', no_show_count: 1, total_spent_cents: 15800, visit_count: 6, last_visit_at: '2026-03-05T11:30:00Z', avg_visit_frequency_days: 19, created_at: '2024-09-10T11:00:00Z' },
  { id: 'cli-011', salon_id: MOCK_SALON.id, first_name: 'Inès', last_name: 'Lavoie', phone: '+33 6 00 00 00 11', email: null, avatar_url: null, is_vip: false, hair_texture: 'straight', preferred_style: null, has_beard: false, notes: null, whatsapp_opt_in_marketing: false, whatsapp_opt_in_utility: true, opt_in_timestamp: '2026-02-15T15:00:00Z', no_show_count: 0, total_spent_cents: 9300, visit_count: 2, last_visit_at: '2026-02-15T15:00:00Z', avg_visit_frequency_days: 42, created_at: '2025-12-28T15:00:00Z' },
  { id: 'cli-012', salon_id: MOCK_SALON.id, first_name: 'Fatou', last_name: 'Sy', phone: '+33 6 00 00 00 13', email: null, avatar_url: null, is_vip: false, hair_texture: 'afro', preferred_style: null, has_beard: false, notes: 'Cheveux très denses, prévoir un peu plus de temps.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2026-01-15T14:00:00Z', no_show_count: 0, total_spent_cents: 13600, visit_count: 3, last_visit_at: '2026-03-12T13:00:00Z', avg_visit_frequency_days: 30, created_at: '2025-10-18T14:00:00Z' },
  { id: 'cli-013', salon_id: MOCK_SALON.id, first_name: 'Antoine', last_name: 'Dubois', phone: '+33 6 00 00 00 14', email: 'a.dubois@proton.me', avatar_url: null, is_vip: false, hair_texture: 'straight', preferred_style: 'scissor', has_beard: false, notes: 'Raie sur le côté classique, longueur moyenne dessus.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2025-07-03T09:00:00Z', no_show_count: 0, total_spent_cents: 27600, visit_count: 9, last_visit_at: '2026-03-21T09:30:00Z', avg_visit_frequency_days: 25, created_at: '2024-06-12T09:00:00Z' },
  { id: 'cli-014', salon_id: MOCK_SALON.id, first_name: 'Nadia', last_name: 'El Mansouri', phone: '+33 6 00 00 00 15', email: 'nadia.elm@example.com', avatar_url: null, is_vip: true, hair_texture: 'curly', preferred_style: null, has_beard: false, notes: 'Coupe + brushing à chaque fois. Fidèle depuis le début.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2023-06-20T10:00:00Z', no_show_count: 0, total_spent_cents: 63400, visit_count: 22, last_visit_at: '2026-03-26T10:00:00Z', avg_visit_frequency_days: 13, created_at: '2023-01-15T10:00:00Z' },
  { id: 'cli-015', salon_id: MOCK_SALON.id, first_name: 'Jules', last_name: 'Martin', phone: '+33 6 00 00 00 16', email: null, avatar_url: null, is_vip: false, hair_texture: 'straight', preferred_style: 'fade', has_beard: true, notes: 'Dégradé bas + barbe bien dessinée.', whatsapp_opt_in_marketing: false, whatsapp_opt_in_utility: true, opt_in_timestamp: '2026-01-10T17:00:00Z', no_show_count: 1, total_spent_cents: 11100, visit_count: 4, last_visit_at: '2026-03-15T17:30:00Z', avg_visit_frequency_days: 20, created_at: '2025-09-25T17:00:00Z' },
  { id: 'cli-016', salon_id: MOCK_SALON.id, first_name: 'Amina', last_name: 'Traoré', phone: '+33 6 00 00 00 17', email: 'amina.t@example.com', avatar_url: null, is_vip: false, hair_texture: 'afro', preferred_style: null, has_beard: false, notes: 'Traitement kératine tous les deux mois.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2025-04-22T13:30:00Z', no_show_count: 0, total_spent_cents: 33800, visit_count: 8, last_visit_at: '2026-03-19T14:00:00Z', avg_visit_frequency_days: 17, created_at: '2024-03-03T13:30:00Z' },
  { id: 'cli-017', salon_id: MOCK_SALON.id, first_name: 'Lucas', last_name: 'Bernard', phone: '+33 6 00 00 00 18', email: null, avatar_url: null, is_vip: false, hair_texture: 'curly', preferred_style: 'taper', has_beard: true, notes: null, whatsapp_opt_in_marketing: false, whatsapp_opt_in_utility: true, opt_in_timestamp: '2025-11-05T16:00:00Z', no_show_count: 3, total_spent_cents: 7200, visit_count: 4, last_visit_at: '2026-01-18T16:00:00Z', avg_visit_frequency_days: 32, created_at: '2025-06-14T16:00:00Z' },
  { id: 'cli-018', salon_id: MOCK_SALON.id, first_name: 'Samira', last_name: 'Hadj', phone: '+33 6 00 00 00 19', email: 'samira.hadj@example.com', avatar_url: null, is_vip: false, hair_texture: 'curly', preferred_style: null, has_beard: false, notes: 'Demande toujours un soin en plus de la coupe.', whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2025-08-11T11:00:00Z', no_show_count: 0, total_spent_cents: 19400, visit_count: 5, last_visit_at: '2026-03-23T11:00:00Z', avg_visit_frequency_days: 26, created_at: '2024-11-30T11:00:00Z' },
  { id: 'cli-019', salon_id: MOCK_SALON.id, first_name: 'Hugo', last_name: 'Lefèvre', phone: '+33 6 00 00 00 20', email: null, avatar_url: null, is_vip: false, hair_texture: 'straight', preferred_style: 'long', has_beard: false, notes: 'Cheveux longs, juste un rafraîchissement des pointes.', whatsapp_opt_in_marketing: false, whatsapp_opt_in_utility: true, opt_in_timestamp: '2026-02-20T14:00:00Z', no_show_count: 0, total_spent_cents: 4600, visit_count: 2, last_visit_at: '2026-02-20T14:00:00Z', avg_visit_frequency_days: 45, created_at: '2025-12-05T14:00:00Z' },
  { id: 'cli-020', salon_id: MOCK_SALON.id, first_name: 'Yasmine', last_name: 'Bouaziz', phone: '+33 6 00 00 00 21', email: 'yasmine.bz@example.com', avatar_url: null, is_vip: true, hair_texture: 'curly', preferred_style: null, has_beard: false, notes: "Coloration + mèches tous les mois. N'aime pas attendre.", whatsapp_opt_in_marketing: true, whatsapp_opt_in_utility: true, opt_in_timestamp: '2023-11-01T09:00:00Z', no_show_count: 0, total_spent_cents: 58700, visit_count: 19, last_visit_at: '2026-03-24T15:00:00Z', avg_visit_frequency_days: 15, created_at: '2023-03-22T09:00:00Z' },
];

export const MOCK_CLIENTS: Client[] = MOCK_CLIENTS_AT_REFERENCE.map((client) => ({
  ...client,
  last_visit_at: shiftToNow(client.last_visit_at),
  created_at: shiftToNow(client.created_at) ?? client.created_at,
  opt_in_timestamp: shiftToNow(client.opt_in_timestamp),
}));

// ============================================
// TODAY'S APPOINTMENTS
// ============================================
function todayAt(hours: number, minutes: number): string {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export function getMockAppointments(): AppointmentWithRelations[] {
  const karim = MOCK_STAFF[0];
  const cristiane = MOCK_STAFF[1];
  const aidaa = MOCK_STAFF[2];

  return [
    // Karim's day
    {
      id: 'apt-001', salon_id: MOCK_SALON.id, client_id: 'cli-001', staff_id: karim.id, service_id: 'svc-002',
      scheduled_start: todayAt(9, 0), scheduled_end: todayAt(9, 45),
      actual_start: todayAt(9, 2), actual_end: todayAt(9, 48),
      estimated_start: null, status: 'completed', delay_minutes: 0,
      price_cents: 3700, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[0], staff: karim, service: MOCK_SERVICES[1],
    },
    {
      id: 'apt-002', salon_id: MOCK_SALON.id, client_id: 'cli-005', staff_id: karim.id, service_id: 'svc-001',
      scheduled_start: todayAt(10, 0), scheduled_end: todayAt(10, 30),
      actual_start: todayAt(10, 3), actual_end: todayAt(10, 38),
      estimated_start: null, status: 'completed', delay_minutes: 0,
      price_cents: 2300, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[4], staff: karim, service: MOCK_SERVICES[0],
    },
    {
      id: 'apt-003', salon_id: MOCK_SALON.id, client_id: 'cli-007', staff_id: karim.id, service_id: 'svc-004',
      scheduled_start: todayAt(10, 45), scheduled_end: todayAt(11, 20),
      actual_start: todayAt(10, 50), actual_end: null,
      estimated_start: null, status: 'in_progress', delay_minutes: 8,
      price_cents: 2800, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[6], staff: karim, service: MOCK_SERVICES[3],
    },
    {
      id: 'apt-004', salon_id: MOCK_SALON.id, client_id: 'cli-002', staff_id: karim.id, service_id: 'svc-001',
      scheduled_start: todayAt(11, 30), scheduled_end: todayAt(12, 0),
      actual_start: null, actual_end: null,
      estimated_start: todayAt(11, 38), status: 'confirmed', delay_minutes: 8,
      price_cents: 2300, notes: null, source: 'manual', reminder_sent: true, delay_notified: true, created_at: '',
      client: MOCK_CLIENTS[1], staff: karim, service: MOCK_SERVICES[0],
    },
    {
      id: 'apt-005', salon_id: MOCK_SALON.id, client_id: 'cli-008', staff_id: karim.id, service_id: 'svc-002',
      scheduled_start: todayAt(13, 0), scheduled_end: todayAt(13, 45),
      actual_start: null, actual_end: null,
      estimated_start: null, status: 'confirmed', delay_minutes: 0,
      price_cents: 3700, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[7], staff: karim, service: MOCK_SERVICES[1],
    },
    {
      id: 'apt-006', salon_id: MOCK_SALON.id, client_id: 'cli-002', staff_id: karim.id, service_id: 'svc-003',
      scheduled_start: todayAt(14, 0), scheduled_end: todayAt(14, 20),
      actual_start: null, actual_end: null,
      estimated_start: null, status: 'confirmed', delay_minutes: 0,
      price_cents: 1500, notes: null, source: 'booking', reminder_sent: false, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[1], staff: karim, service: MOCK_SERVICES[2],
    },
    // Cristiane's day
    {
      id: 'apt-007', salon_id: MOCK_SALON.id, client_id: 'cli-003', staff_id: cristiane.id, service_id: 'svc-006',
      scheduled_start: todayAt(9, 0), scheduled_end: todayAt(10, 0),
      actual_start: todayAt(9, 5), actual_end: todayAt(10, 8),
      estimated_start: null, status: 'completed', delay_minutes: 0,
      price_cents: 5500, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[2], staff: cristiane, service: MOCK_SERVICES[5],
    },
    {
      id: 'apt-008', salon_id: MOCK_SALON.id, client_id: 'cli-006', staff_id: cristiane.id, service_id: 'svc-005',
      scheduled_start: todayAt(10, 15), scheduled_end: todayAt(11, 0),
      actual_start: todayAt(10, 20), actual_end: null,
      estimated_start: null, status: 'in_progress', delay_minutes: 0,
      price_cents: 3500, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[5], staff: cristiane, service: MOCK_SERVICES[4],
    },
    {
      id: 'apt-009', salon_id: MOCK_SALON.id, client_id: 'cli-004', staff_id: cristiane.id, service_id: 'svc-007',
      scheduled_start: todayAt(11, 30), scheduled_end: todayAt(12, 10),
      actual_start: null, actual_end: null,
      estimated_start: null, status: 'confirmed', delay_minutes: 0,
      price_cents: 4200, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[3], staff: cristiane, service: MOCK_SERVICES[6],
    },
    // Aïdaa's day
    {
      id: 'apt-010', salon_id: MOCK_SALON.id, client_id: 'cli-005', staff_id: aidaa.id, service_id: 'svc-001',
      scheduled_start: todayAt(9, 30), scheduled_end: todayAt(10, 0),
      actual_start: todayAt(9, 30), actual_end: todayAt(10, 2),
      estimated_start: null, status: 'completed', delay_minutes: 0,
      price_cents: 2300, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[4], staff: aidaa, service: MOCK_SERVICES[0],
    },
    {
      id: 'apt-011', salon_id: MOCK_SALON.id, client_id: 'cli-001', staff_id: aidaa.id, service_id: 'svc-005',
      scheduled_start: todayAt(10, 15), scheduled_end: todayAt(11, 0),
      actual_start: null, actual_end: null,
      estimated_start: null, status: 'confirmed', delay_minutes: 0,
      price_cents: 3500, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[0], staff: aidaa, service: MOCK_SERVICES[4],
    },
    {
      id: 'apt-012', salon_id: MOCK_SALON.id, client_id: 'cli-008', staff_id: aidaa.id, service_id: 'svc-001',
      scheduled_start: todayAt(14, 30), scheduled_end: todayAt(15, 0),
      actual_start: null, actual_end: null,
      estimated_start: null, status: 'confirmed', delay_minutes: 0,
      price_cents: 2300, notes: null, source: 'manual', reminder_sent: false, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[7], staff: aidaa, service: MOCK_SERVICES[0],
    },
    // Additional appointments for new clients
    {
      id: 'apt-013', salon_id: MOCK_SALON.id, client_id: 'cli-014', staff_id: cristiane.id, service_id: 'svc-005',
      scheduled_start: todayAt(14, 0), scheduled_end: todayAt(14, 45),
      actual_start: null, actual_end: null,
      estimated_start: null, status: 'confirmed', delay_minutes: 0,
      price_cents: 3500, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[13], staff: cristiane, service: MOCK_SERVICES[4],
    },
    {
      id: 'apt-014', salon_id: MOCK_SALON.id, client_id: 'cli-013', staff_id: karim.id, service_id: 'svc-001',
      scheduled_start: todayAt(15, 0), scheduled_end: todayAt(15, 30),
      actual_start: null, actual_end: null,
      estimated_start: null, status: 'confirmed', delay_minutes: 0,
      price_cents: 2300, notes: null, source: 'booking', reminder_sent: false, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[12], staff: karim, service: MOCK_SERVICES[0],
    },
    {
      id: 'apt-015', salon_id: MOCK_SALON.id, client_id: 'cli-020', staff_id: cristiane.id, service_id: 'svc-007',
      scheduled_start: todayAt(15, 0), scheduled_end: todayAt(16, 15),
      actual_start: null, actual_end: null,
      estimated_start: null, status: 'confirmed', delay_minutes: 0,
      price_cents: 6800, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[19], staff: cristiane, service: MOCK_SERVICES[6],
    },
    {
      id: 'apt-016', salon_id: MOCK_SALON.id, client_id: 'cli-016', staff_id: aidaa.id, service_id: 'svc-007',
      scheduled_start: todayAt(15, 30), scheduled_end: todayAt(16, 10),
      actual_start: null, actual_end: null,
      estimated_start: null, status: 'confirmed', delay_minutes: 0,
      price_cents: 4200, notes: null, source: 'booking', reminder_sent: true, delay_notified: false, created_at: '',
      client: MOCK_CLIENTS[15], staff: aidaa, service: MOCK_SERVICES[6],
    },
  ];
}
