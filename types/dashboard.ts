export interface WaitlistEntry {
  id: string;
  client_id: string;
  clientName: string;
  service: string;
  waitingSince: string;
  status: 'waiting' | 'contacted' | 'booked' | 'expired';
}

export interface Product {
  id: string;
  name: string;
  price_cents: number;
  stock_quantity: number;
  low_stock_threshold: number;
}

export interface WeeklyRevenue {
  day: string;
  revenue_cents: number;
  isToday: boolean;
}

export interface RecentMessage {
  id: string;
  clientName: string;
  excerpt: string;
  sentAt: string;
  isRead: boolean;
}

export interface DashboardKPI {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export type DashboardView = 'pilot' | 'manager';
