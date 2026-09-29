import { useMemo } from 'react';
import { useAgendaStore } from '../stores/agendaStore';
import { useSalonStore } from '../stores/salonStore';
import { useClientStore } from '../stores/clientStore';
import {
  getMockWeeklyRevenue,
  MOCK_WAITLIST,
  MOCK_PRODUCTS,
  MOCK_RECENT_MESSAGES,
  MOCK_STAFF_RETENTION,
} from '../lib/mockDashboardData';
import type { AppointmentWithRelations } from '../types/agenda';
import type { DashboardKPI } from '../types/dashboard';

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function minutesUntil(dateStr: string): number {
  return Math.max(0, Math.round((new Date(dateStr).getTime() - Date.now()) / 60000));
}

export function useDashboard() {
  const appointments = useAgendaStore((s) => s.appointments);
  const currentStaff = useSalonStore((s) => s.currentStaff);
  const allStaff = useSalonStore((s) => s.allStaff);
  const salon = useSalonStore((s) => s.salon);
  const clients = useClientStore((s) => s.clients);

  return useMemo(() => {
    const todayApts = appointments.filter(
      (a) => isToday(a.scheduled_start)
    );

    const completed = todayApts.filter((a) => a.status === 'completed');
    const inProgress = todayApts.filter((a) => a.status === 'in_progress');
    const confirmed = todayApts.filter((a) => a.status === 'confirmed');
    const noShows = todayApts.filter((a) => a.status === 'no_show');

    // Revenue
    const todayRevenueCents = completed.reduce((sum, a) => sum + (a.price_cents ?? 0), 0);
    const dailyTargetCents = salon?.settings?.daily_revenue_target_cents ?? 65000;
    const revenueProgress = Math.min(todayRevenueCents / dailyTargetCents, 1);

    // Pilot — staff-specific
    const staffApts = currentStaff
      ? todayApts.filter((a) => a.staff_id === currentStaff.id)
      : todayApts;
    const staffCompleted = staffApts.filter((a) => a.status === 'completed');
    const staffConfirmed = staffApts
      .filter((a) => a.status === 'confirmed')
      .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime());
    const staffInProgress = staffApts.filter((a) => a.status === 'in_progress');

    const nextAppointments = [...staffInProgress, ...staffConfirmed].slice(0, 3);
    const nextRDV = staffConfirmed[0] ?? null;
    const countdownMinutes = nextRDV ? minutesUntil(nextRDV.scheduled_start) : null;
    const remainingCount = Math.max(0, staffConfirmed.length + staffInProgress.length - 3);

    // Hours worked
    const workedMinutes = staffCompleted.reduce((sum, a) => {
      if (a.actual_start && a.actual_end) {
        return sum + (new Date(a.actual_end).getTime() - new Date(a.actual_start).getTime()) / 60000;
      }
      return sum + (a.service?.duration_minutes ?? 30);
    }, 0);
    const hoursWorked = Math.floor(workedMinutes / 60);
    const minutesWorked = Math.round(workedMinutes % 60);

    // Fill rate
    const totalSlotsEstimate = allStaff.length * 16; // ~16 slots of 30min per staff in a 8h day
    const fillRate = todayApts.length > 0
      ? Math.round((todayApts.length / totalSlotsEstimate) * 100)
      : 0;
    const noShowRate = todayApts.length > 0
      ? parseFloat(((noShows.length / todayApts.length) * 100).toFixed(1))
      : 0;

    // Weekly revenue
    const weeklyRevenue = getMockWeeklyRevenue();
    const weekTotalCents = weeklyRevenue.reduce((s, d) => s + d.revenue_cents, 0);

    // Team stats with retention
    const teamStats = allStaff.map((staff) => ({
      id: staff.id,
      name: staff.name,
      retention: MOCK_STAFF_RETENTION[staff.id] ?? 80,
      todayApts: todayApts.filter((a) => a.staff_id === staff.id).length,
    }));

    // Stock alerts (sorted by urgency)
    const stockAlerts = [...MOCK_PRODUCTS]
      .sort((a, b) => a.stock_quantity - b.stock_quantity)
      .slice(0, 3);

    // Cizo Insight
    let insightText = '';
    if (fillRate < 70) {
      insightText =
        'Forte demande prévue vendredi. Ouvre 2 créneaux supplémentaires entre 14h-16h pour +80€ estimés.';
    } else if (noShowRate > 5) {
      insightText =
        'Ton taux de no-show est élevé ce mois. Active les acomptes pour les nouveaux clients.';
    } else {
      const lowStock = MOCK_PRODUCTS.find(
        (p) => p.stock_quantity <= p.low_stock_threshold
      );
      if (lowStock) {
        insightText = `${lowStock.name} est bientôt en rupture. Pense à recommander.`;
      } else {
        insightText =
          'Bonne journée en vue ! Ton taux de remplissage est solide. Continue sur cette lancée.';
      }
    }

    // KPIs for full page
    const avgTicketCents =
      completed.length > 0
        ? Math.round(todayRevenueCents / completed.length)
        : 0;

    const activeClients = clients.filter((c) => {
      if (!c.last_visit_at) return false;
      const days = (Date.now() - new Date(c.last_visit_at).getTime()) / 86400000;
      return days <= 30;
    }).length;

    const newClientsThisMonth = clients.filter((c) => {
      const created = new Date(c.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    const avgFrequency =
      clients.reduce((s, c) => s + (c.avg_visit_frequency_days ?? 0), 0) /
      Math.max(1, clients.filter((c) => c.avg_visit_frequency_days != null).length);

    const kpiRevenue: DashboardKPI[] = [
      { label: 'CA du jour', value: `${Math.round(todayRevenueCents / 100)}€`, trend: '+12%', trendDirection: 'up' },
      { label: 'CA semaine', value: `${Math.round(weekTotalCents / 100)}€`, trend: '+8.3%', trendDirection: 'up' },
      { label: 'CA mois', value: '8 740€', trend: '+5.1%', trendDirection: 'up' },
      { label: 'Panier moyen', value: `${Math.round(avgTicketCents / 100)}€`, trend: '−2€', trendDirection: 'down' },
      { label: 'Pourboires/jour', value: '12€', trend: '+3€', trendDirection: 'up' },
    ];

    const kpiClients: DashboardKPI[] = [
      { label: 'Nouveaux clients', value: `${newClientsThisMonth}`, trend: '+2', trendDirection: 'up' },
      { label: 'Taux de rétention', value: '82.7%', trend: '+3.2%', trendDirection: 'up' },
      { label: 'Taux no-show', value: `${noShowRate}%`, trend: '−1.5%', trendDirection: 'up' },
      { label: 'Fréquence visite', value: `${Math.round(avgFrequency)}j`, trend: '−2j', trendDirection: 'up' },
      { label: 'Score NPS', value: '72', trend: '+5', trendDirection: 'up' },
      { label: 'Clients actifs', value: `${activeClients}`, trend: '+4', trendDirection: 'up' },
    ];

    const kpiOperations: DashboardKPI[] = [
      { label: 'Taux remplissage', value: `${fillRate}%`, trend: '+5%', trendDirection: 'up' },
      { label: 'Temps moyen/service', value: '34min', trend: '−2min', trendDirection: 'up' },
      { label: 'Attente moyenne', value: '7min', trend: '−3min', trendDirection: 'up' },
      { label: 'RDV/jour', value: `${todayApts.length}`, trend: '+1.2', trendDirection: 'up' },
      { label: 'Créneaux perdus', value: '2', trend: '−1', trendDirection: 'up' },
    ];

    const kpiEquipe: DashboardKPI[] = [
      { label: 'CA/coiffeur', value: '287€', trend: '+18€', trendDirection: 'up' },
      { label: 'Productivité', value: '78.3%', trend: '+4.1%', trendDirection: 'up' },
      { label: 'Taux rebooking', value: '64.2%', trend: '+2.8%', trendDirection: 'up' },
      { label: 'Heures/semaine', value: '38h', trend: '', trendDirection: 'neutral' },
    ];

    return {
      // Pilot
      nextAppointments,
      nextRDV,
      countdownMinutes,
      remainingCount,
      staffCompleted: staffCompleted.length,
      staffTotal: staffApts.length,
      hoursWorked,
      minutesWorked,
      waitlist: MOCK_WAITLIST,
      recentMessages: MOCK_RECENT_MESSAGES,

      // Manager
      todayRevenueCents,
      dailyTargetCents,
      revenueProgress,
      fillRate,
      noShowRate,
      weeklyRevenue,
      weekTotalCents,
      teamStats,
      stockAlerts,
      insightText,

      // KPI page
      kpiRevenue,
      kpiClients,
      kpiOperations,
      kpiEquipe,
    };
  }, [appointments, currentStaff, allStaff, salon, clients]);
}
