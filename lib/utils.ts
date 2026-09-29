import { AVATAR_COLORS } from './constants';

/**
 * Format price in cents to display string (e.g., 2300 → "23€")
 */
export function formatPrice(cents: number): string {
  const euros = cents / 100;
  if (euros % 1 === 0) {
    return `${euros}€`;
  }
  return `${euros.toFixed(2).replace('.', ',')}€`;
}

/**
 * Format duration in minutes (e.g., 45 → "45min", 90 → "1h30")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
}

/**
 * Format time from ISO string (e.g., "14:30")
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format date relative to now (e.g., "3j", "2sem", "1mois")
 */
export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `${diffDays}j`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mois`;
  return `${Math.floor(diffDays / 365)}an`;
}

/**
 * Format date relative with compact labels for CRM rows (e.g. "3j", "2sem")
 */
export function formatRelativeCompactDate(isoString: string | null): string {
  if (!isoString) return '—';

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  if (diffDays < 7) return `${diffDays}j`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mois`;
  return `${Math.floor(diffDays / 365)}an`;
}

/**
 * Format "Client depuis {year}" from an ISO date.
 */
export function formatClientSince(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Client récent';
  return `Client depuis ${date.getFullYear()}`;
}

/**
 * Format a full date in French (e.g., "Lun 14 mars")
 */
export function formatDateFull(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Get initials from first and last name (e.g., "Aïdaa Benali" → "AB")
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Get a deterministic avatar color from a name
 */
export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Calculate client value score
 * score = (visit_count × avg_ticket × recency_factor) - (no_show_count × penalty)
 */
export function calculateClientScore(
  visitCount: number,
  totalSpentCents: number,
  lastVisitAt: string | null,
  noShowCount: number
): number {
  if (visitCount === 0) return 0;

  const avgTicket = totalSpentCents / visitCount / 100;
  const daysSinceLastVisit = lastVisitAt
    ? Math.floor((Date.now() - new Date(lastVisitAt).getTime()) / (1000 * 60 * 60 * 24))
    : 365;

  // Recency factor: 1.0 for today, decays over 90 days
  const recencyFactor = Math.max(0, 1 - daysSinceLastVisit / 90);

  const penalty = 15; // €15 penalty per no-show
  const score = visitCount * avgTicket * (0.3 + 0.7 * recencyFactor) - noShowCount * penalty;

  return Math.max(0, Math.round(score));
}

/**
 * Format timer display (e.g., 747 seconds → "12:27")
 */
export function formatTimerDisplay(totalSeconds: number): string {
  const absSeconds = Math.abs(totalSeconds);
  const minutes = Math.floor(absSeconds / 60);
  const seconds = absSeconds % 60;
  const prefix = totalSeconds < 0 ? '+' : '';
  return `${prefix}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate new running average
 * new_avg = (old_avg × (n-1) + actual_duration) / n
 */
export function updateRunningAverage(
  oldAvg: number,
  count: number,
  newValue: number
): number {
  return Math.round((oldAvg * (count - 1) + newValue) / count);
}
