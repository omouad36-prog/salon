import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAgendaStore } from '../stores/agendaStore';
import { useSalonStore } from '../stores/salonStore';
import { useRealtime } from './useRealtime';
import type { Appointment, AppointmentWithRelations } from '../types/agenda';

export function useAgenda() {
  const {
    selectedDate,
    view,
    selectedStaffId,
    appointments,
    isLoading,
    setAppointments,
    updateAppointment,
    setLoading,
  } = useAgendaStore();

  const salon = useSalonStore((s) => s.salon);

  // Fetch appointments for the selected date range
  const fetchAppointments = useCallback(async () => {
    if (!salon) return;

    setLoading(true);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    let endDate: Date;
    if (view === 'week') {
      endDate = new Date(startOfDay);
      endDate.setDate(endDate.getDate() + 7);
    } else if (view === 'month') {
      endDate = new Date(startOfDay);
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate = new Date(startOfDay);
      endDate.setDate(endDate.getDate() + 1);
    }

    let query = supabase
      .from('appointments')
      .select(`
        *,
        client:clients(*),
        staff:staff(*),
        service:services(*)
      `)
      .eq('salon_id', salon.id)
      .gte('scheduled_start', startOfDay.toISOString())
      .lt('scheduled_start', endDate.toISOString())
      .neq('status', 'cancelled')
      .order('scheduled_start', { ascending: true });

    if (selectedStaffId) {
      query = query.eq('staff_id', selectedStaffId);
    }

    const { data, error } = await query;

    if (!error && data) {
      setAppointments(data as AppointmentWithRelations[]);
    }

    setLoading(false);
  }, [salon?.id, selectedDate, view, selectedStaffId]);

  // Initial fetch + refetch on dependencies change
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Realtime updates on appointments
  useRealtime({
    table: 'appointments',
    filter: salon ? `salon_id=eq.${salon.id}` : undefined,
    enabled: !!salon,
    onInsert: () => fetchAppointments(),
    onUpdate: (updated) => {
      // Optimistic: merge the update into local state
      updateAppointment(updated.id as string, updated as Partial<AppointmentWithRelations>);
    },
    onDelete: () => fetchAppointments(),
  });

  // Start a service (transition to in_progress)
  const startService = useCallback(
    async (appointmentId: string) => {
      const now = new Date().toISOString();
      // Optimistic update
      updateAppointment(appointmentId, {
        status: 'in_progress',
        actual_start: now,
      });

      await supabase
        .from('appointments')
        .update({ status: 'in_progress', actual_start: now })
        .eq('id', appointmentId);
    },
    [updateAppointment]
  );

  // Complete a service
  const completeService = useCallback(
    async (appointmentId: string) => {
      const now = new Date().toISOString();
      updateAppointment(appointmentId, {
        status: 'completed',
        actual_end: now,
      });

      await supabase
        .from('appointments')
        .update({ status: 'completed', actual_end: now })
        .eq('id', appointmentId);
    },
    [updateAppointment]
  );

  // Mark as no-show
  const markNoShow = useCallback(
    async (appointmentId: string) => {
      updateAppointment(appointmentId, { status: 'no_show' });

      await supabase
        .from('appointments')
        .update({ status: 'no_show' })
        .eq('id', appointmentId);
    },
    [updateAppointment]
  );

  // Recalibrate: update delay and shift subsequent appointments
  const recalibrate = useCallback(
    async (staffId: string, delayMinutes: number) => {
      if (!salon) return;

      const now = new Date();

      // Find all upcoming confirmed appointments for this staff member today
      const upcoming = appointments.filter(
        (apt) =>
          apt.staff_id === staffId &&
          apt.status === 'confirmed' &&
          new Date(apt.scheduled_start) > now
      );

      // Update estimated_start for each upcoming appointment
      for (const apt of upcoming) {
        const originalStart = new Date(apt.scheduled_start);
        const newEstimatedStart = new Date(
          originalStart.getTime() + delayMinutes * 60 * 1000
        );

        updateAppointment(apt.id, {
          estimated_start: newEstimatedStart.toISOString(),
          delay_minutes: delayMinutes,
        });

        await supabase
          .from('appointments')
          .update({
            estimated_start: newEstimatedStart.toISOString(),
            delay_minutes: delayMinutes,
          })
          .eq('id', apt.id);
      }
    },
    [salon, appointments, updateAppointment]
  );

  // Create manual appointment
  const createAppointment = useCallback(
    async (data: {
      clientId: string | null;
      staffId: string;
      serviceId: string;
      scheduledStart: string;
      scheduledEnd: string;
      priceCents: number;
    }) => {
      if (!salon) return;

      const { error } = await supabase.from('appointments').insert({
        salon_id: salon.id,
        client_id: data.clientId,
        staff_id: data.staffId,
        service_id: data.serviceId,
        scheduled_start: data.scheduledStart,
        scheduled_end: data.scheduledEnd,
        price_cents: data.priceCents,
        source: 'manual',
      });

      if (!error) {
        await fetchAppointments();
      }

      return { error };
    },
    [salon, fetchAppointments]
  );

  // Get appointments grouped by staff
  const appointmentsByStaff = appointments.reduce(
    (acc, apt) => {
      const key = apt.staff_id ?? 'unassigned';
      if (!acc[key]) acc[key] = [];
      acc[key].push(apt);
      return acc;
    },
    {} as Record<string, AppointmentWithRelations[]>
  );

  // Detect free slots (gaps >= 30min between appointments)
  const detectFreeSlots = useCallback(
    (staffAppointments: AppointmentWithRelations[]) => {
      const sorted = [...staffAppointments].sort(
        (a, b) =>
          new Date(a.scheduled_start).getTime() -
          new Date(b.scheduled_start).getTime()
      );

      const freeSlots: { start: string; end: string; durationMinutes: number }[] = [];

      for (let i = 0; i < sorted.length - 1; i++) {
        const currentEnd = new Date(sorted[i].scheduled_end);
        const nextStart = new Date(sorted[i + 1].scheduled_start);
        const gapMinutes =
          (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60);

        if (gapMinutes >= 30) {
          freeSlots.push({
            start: currentEnd.toISOString(),
            end: nextStart.toISOString(),
            durationMinutes: gapMinutes,
          });
        }
      }

      return freeSlots;
    },
    []
  );

  return {
    appointments,
    appointmentsByStaff,
    isLoading,
    fetchAppointments,
    startService,
    completeService,
    markNoShow,
    recalibrate,
    createAppointment,
    detectFreeSlots,
  };
}
