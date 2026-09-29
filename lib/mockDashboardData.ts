import type { WaitlistEntry, Product, WeeklyRevenue, RecentMessage } from '../types/dashboard';

export const MOCK_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wl-001',
    client_id: 'cli-010',
    clientName: 'Rayan Amrani',
    service: 'Coupe Homme',
    waitingSince: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'waiting',
  },
  {
    id: 'wl-002',
    client_id: 'cli-015',
    clientName: 'Jules Martin',
    service: 'Coupe + Barbe',
    waitingSince: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'waiting',
  },
  {
    id: 'wl-003',
    client_id: 'cli-009',
    clientName: 'Emma Petit',
    service: 'Coupe Femme',
    waitingSince: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    status: 'waiting',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-001', name: 'Cire Matt Clay', price_cents: 1800, stock_quantity: 3, low_stock_threshold: 5 },
  { id: 'prod-002', name: 'Huile à Barbe', price_cents: 2200, stock_quantity: 12, low_stock_threshold: 5 },
  { id: 'prod-003', name: 'Shampoing Kérastase', price_cents: 2600, stock_quantity: 1, low_stock_threshold: 5 },
  { id: 'prod-004', name: 'Spray Fixant', price_cents: 1400, stock_quantity: 8, low_stock_threshold: 5 },
  { id: 'prod-005', name: 'Lame Tondeuse Pro', price_cents: 3200, stock_quantity: 4, low_stock_threshold: 3 },
];

export function getMockWeeklyRevenue(): WeeklyRevenue[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const pastRevenues = [48700, 42300, 53100, 51800, 13800, 0, 0];

  return DAYS_FR.map((day, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + mondayOffset + i);
    const dayIndex = date.getDate() - today.getDate();
    const isFuture = dayIndex > 0;
    const isToday = dayIndex === 0;

    return {
      day,
      revenue_cents: isFuture ? 0 : pastRevenues[i],
      isToday,
    };
  });
}

export const MOCK_RECENT_MESSAGES: RecentMessage[] = [
  {
    id: 'msg-001',
    clientName: 'Aïdaa Benali',
    excerpt: 'Rappel : votre RDV demain à 11h chez Atelier Nord.',
    sentAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 'msg-002',
    clientName: 'Thomas Nguyen',
    excerpt: 'Confirmation RDV Coupe + Barbe jeudi 13h.',
    sentAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 'msg-003',
    clientName: 'Marco Ferreira',
    excerpt: 'Bonjour, Karim a un léger retard de ~8min.',
    sentAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    isRead: false,
  },
];

// Staff retention rates (mock, percentage)
export const MOCK_STAFF_RETENTION: Record<string, number> = {
  'staff-001': 87.3,
  'staff-002': 91.6,
  'staff-003': 78.4,
};
