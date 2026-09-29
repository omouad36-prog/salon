import type { ClientVisit } from '../types/client';
import { MOCK_SERVICES, MOCK_STAFF } from './mockData';

function daysAgoAt(daysAgo: number, hours: number, minutes: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

const serviceById = Object.fromEntries(MOCK_SERVICES.map((service) => [service.id, service]));
const staffById = Object.fromEntries(MOCK_STAFF.map((staff) => [staff.id, staff]));

function createVisit(
  id: string,
  clientId: string,
  serviceId: string,
  staffId: string,
  priceCents: number,
  daysAgo: number,
  hours: number,
  minutes: number,
  status: ClientVisit['status'] = 'completed'
): ClientVisit {
  return {
    id,
    client_id: clientId,
    date: daysAgoAt(daysAgo, hours, minutes),
    service_name: serviceById[serviceId]?.name ?? 'Service',
    staff_name: staffById[staffId]?.name ?? 'Équipe Cizo2',
    price_cents: priceCents,
    status,
  };
}

export const MOCK_CLIENT_VISITS: ClientVisit[] = [
  // cli-001 Aïdaa Benali (VIP, 14 visits)
  createVisit('visit-001', 'cli-001', 'svc-002', 'staff-001', 3700, 5, 10, 15),
  createVisit('visit-002', 'cli-001', 'svc-001', 'staff-003', 2300, 18, 9, 30),
  createVisit('visit-003', 'cli-001', 'svc-005', 'staff-003', 3500, 36, 14, 0),

  // cli-002 Marco Ferreira (1 no-show, 5 visits)
  createVisit('visit-004', 'cli-002', 'svc-001', 'staff-001', 2300, 17, 11, 0),
  createVisit('visit-005', 'cli-002', 'svc-003', 'staff-001', 1500, 41, 13, 45),
  createVisit('visit-006', 'cli-002', 'svc-001', 'staff-001', 2300, 62, 10, 0, 'no_show'),

  // cli-003 Léa Dumont (VIP, 11 visits)
  createVisit('visit-007', 'cli-003', 'svc-006', 'staff-002', 5500, 9, 9, 0),
  createVisit('visit-008', 'cli-003', 'svc-005', 'staff-002', 3500, 29, 11, 30),
  createVisit('visit-009', 'cli-003', 'svc-007', 'staff-002', 4200, 54, 15, 15),

  // cli-004 Sophie Chen (4 visits)
  createVisit('visit-010', 'cli-004', 'svc-007', 'staff-002', 4200, 28, 14, 0),
  createVisit('visit-011', 'cli-004', 'svc-005', 'staff-002', 3500, 57, 13, 30),

  // cli-005 Youssef Kaddouri (2 no-shows, 3 visits)
  createVisit('visit-012', 'cli-005', 'svc-004', 'staff-001', 2800, 42, 10, 45),
  createVisit('visit-013', 'cli-005', 'svc-001', 'staff-003', 2300, 77, 9, 30),

  // cli-006 Chloé Moreau (VIP, 16 visits)
  createVisit('visit-014', 'cli-006', 'svc-005', 'staff-002', 3500, 3, 9, 30),
  createVisit('visit-015', 'cli-006', 'svc-006', 'staff-002', 5500, 15, 10, 0),
  createVisit('visit-016', 'cli-006', 'svc-007', 'staff-002', 4200, 31, 16, 30),

  // cli-007 Ibrahim Diallo (7 visits)
  createVisit('visit-017', 'cli-007', 'svc-004', 'staff-001', 2800, 7, 16, 0),
  createVisit('visit-018', 'cli-007', 'svc-002', 'staff-001', 3700, 24, 18, 15),
  createVisit('visit-019', 'cli-007', 'svc-003', 'staff-003', 1500, 46, 17, 0),

  // cli-008 Thomas Nguyen (VIP, 18 visits)
  createVisit('visit-020', 'cli-008', 'svc-002', 'staff-001', 3700, 2, 10, 0),
  createVisit('visit-021', 'cli-008', 'svc-001', 'staff-003', 2300, 14, 9, 0),
  createVisit('visit-022', 'cli-008', 'svc-004', 'staff-001', 2800, 25, 12, 15),

  // cli-009 Emma Petit (1 visit, new)
  createVisit('visit-023', 'cli-009', 'svc-005', 'staff-002', 3500, 26, 10, 0),

  // cli-010 Rayan Amrani (1 no-show, 6 visits)
  createVisit('visit-024', 'cli-010', 'svc-001', 'staff-001', 2300, 22, 11, 30),
  createVisit('visit-025', 'cli-010', 'svc-002', 'staff-001', 3700, 38, 14, 0),
  createVisit('visit-026', 'cli-010', 'svc-004', 'staff-003', 2800, 55, 10, 15, 'no_show'),

  // cli-011 Inès Lavoie (2 visits)
  createVisit('visit-027', 'cli-011', 'svc-005', 'staff-002', 3500, 40, 15, 0),
  createVisit('visit-028', 'cli-011', 'svc-007', 'staff-002', 4200, 82, 14, 30),

  // cli-012 Fatou Sy (3 visits)
  createVisit('visit-029', 'cli-012', 'svc-005', 'staff-003', 3500, 15, 13, 0),
  createVisit('visit-030', 'cli-012', 'svc-007', 'staff-002', 4200, 44, 11, 0),
  createVisit('visit-031', 'cli-012', 'svc-006', 'staff-002', 5500, 72, 10, 30),

  // cli-013 Antoine Dubois (9 visits)
  createVisit('visit-032', 'cli-013', 'svc-001', 'staff-001', 2300, 6, 9, 30),
  createVisit('visit-033', 'cli-013', 'svc-002', 'staff-001', 3700, 31, 10, 0),
  createVisit('visit-034', 'cli-013', 'svc-001', 'staff-003', 2300, 56, 11, 15),
  createVisit('visit-035', 'cli-013', 'svc-003', 'staff-001', 1500, 81, 9, 45),

  // cli-014 Nadia El Mansouri (VIP, 22 visits)
  createVisit('visit-036', 'cli-014', 'svc-005', 'staff-002', 3500, 1, 10, 0),
  createVisit('visit-037', 'cli-014', 'svc-006', 'staff-002', 5500, 14, 9, 30),
  createVisit('visit-038', 'cli-014', 'svc-005', 'staff-002', 3500, 27, 11, 0),
  createVisit('visit-039', 'cli-014', 'svc-007', 'staff-002', 6800, 41, 10, 15),
  createVisit('visit-040', 'cli-014', 'svc-007', 'staff-002', 4200, 55, 14, 30),

  // cli-015 Jules Martin (1 no-show, 4 visits)
  createVisit('visit-041', 'cli-015', 'svc-002', 'staff-001', 3700, 12, 17, 30),
  createVisit('visit-042', 'cli-015', 'svc-001', 'staff-001', 2300, 32, 18, 0, 'no_show'),
  createVisit('visit-043', 'cli-015', 'svc-004', 'staff-003', 2800, 52, 16, 45),

  // cli-016 Amina Traoré (8 visits)
  createVisit('visit-044', 'cli-016', 'svc-007', 'staff-002', 4200, 8, 14, 0),
  createVisit('visit-045', 'cli-016', 'svc-005', 'staff-003', 3500, 25, 11, 30),
  createVisit('visit-046', 'cli-016', 'svc-007', 'staff-002', 4200, 42, 13, 15),
  createVisit('visit-047', 'cli-016', 'svc-006', 'staff-002', 5500, 59, 10, 0),

  // cli-017 Lucas Bernard (3 no-shows, 4 visits)
  createVisit('visit-048', 'cli-017', 'svc-001', 'staff-001', 2300, 68, 16, 0),
  createVisit('visit-049', 'cli-017', 'svc-004', 'staff-003', 2800, 36, 15, 30, 'no_show'),
  createVisit('visit-050', 'cli-017', 'svc-002', 'staff-001', 3700, 100, 17, 0, 'no_show'),

  // cli-018 Samira Hadj (5 visits)
  createVisit('visit-051', 'cli-018', 'svc-005', 'staff-002', 3500, 4, 11, 0),
  createVisit('visit-052', 'cli-018', 'svc-007', 'staff-002', 4200, 30, 10, 30),
  createVisit('visit-053', 'cli-018', 'svc-005', 'staff-003', 3500, 56, 14, 0),

  // cli-019 Hugo Lefèvre (2 visits)
  createVisit('visit-054', 'cli-019', 'svc-005', 'staff-002', 3500, 35, 14, 0),
  createVisit('visit-055', 'cli-019', 'svc-001', 'staff-003', 2300, 78, 10, 30),

  // cli-020 Yasmine Bouaziz (VIP, 19 visits)
  createVisit('visit-056', 'cli-020', 'svc-006', 'staff-002', 5500, 3, 15, 0),
  createVisit('visit-057', 'cli-020', 'svc-007', 'staff-002', 6800, 18, 10, 30),
  createVisit('visit-058', 'cli-020', 'svc-005', 'staff-002', 3500, 33, 14, 15),
  createVisit('visit-059', 'cli-020', 'svc-006', 'staff-002', 5500, 48, 9, 0),
  createVisit('visit-060', 'cli-020', 'svc-007', 'staff-002', 4200, 63, 11, 45),
];

export function getMockClientVisits(clientId: string): ClientVisit[] {
  return MOCK_CLIENT_VISITS
    .filter((visit) => visit.client_id === clientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
