import { useState, useMemo, useCallback } from 'react';
import type { Service, Staff, Salon, OpeningHours } from '../types/salon';
import type { AppointmentWithRelations } from '../types/agenda';
import type { Client } from '../types/client';
import type {
  BookingStep,
  BookingClientInfo,
  TimeSlotOption,
  StaffAvailability,
} from '../types/booking';

const DAY_KEYS: (keyof OpeningHours)[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function useBookingFlow(
  salon: Salon,
  services: Service[],
  allStaff: Staff[],
  appointments: AppointmentWithRelations[],
  existingClients: Client[],
) {
  const [step, setStep] = useState<BookingStep>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<BookingClientInfo>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [optInUtility, setOptInUtility] = useState(true);
  const [optInMarketing, setOptInMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Staff availability with real-time delay info
  const staffAvailability = useMemo((): StaffAvailability[] => {
    return allStaff
      .filter((s) => s.is_active)
      .map((s) => {
        const inProgress = appointments.find(
          (a) => a.staff_id === s.id && a.status === 'in_progress',
        );
        return {
          staff: s,
          currentDelayMinutes: inProgress?.delay_minutes ?? 0,
        };
      });
  }, [allStaff, appointments]);

  // Available time slots for selected date/staff/service
  const availableSlots = useMemo((): TimeSlotOption[] => {
    if (!selectedDate || !selectedService) return [];

    const dateObj = new Date(selectedDate + 'T00:00:00');
    const dayKey = DAY_KEYS[dateObj.getDay()];
    const hours = salon.opening_hours?.[dayKey];
    if (!hours) return [];

    const [openH, openM] = hours.open.split(':').map(Number);
    const [closeH, closeM] = hours.close.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    const serviceDuration = selectedService.duration_minutes;

    const staffIds = selectedStaff
      ? [selectedStaff.id]
      : allStaff.filter((s) => s.is_active).map((s) => s.id);

    // Filter appointments for the selected date (local time comparison)
    const dayAppts = appointments.filter((a) => {
      if (a.status === 'cancelled' || a.status === 'no_show') return false;
      const apptDate = new Date(a.scheduled_start);
      return (
        apptDate.getFullYear() === dateObj.getFullYear() &&
        apptDate.getMonth() === dateObj.getMonth() &&
        apptDate.getDate() === dateObj.getDate()
      );
    });

    const now = new Date();
    const isToday = dateObj.toDateString() === now.toDateString();

    const slots: TimeSlotOption[] = [];

    for (let time = openMinutes; time + serviceDuration <= closeMinutes; time += 30) {
      const h = Math.floor(time / 60);
      const m = time % 60;
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

      // Check if at least one eligible staff member is available
      const isAvailable = staffIds.some((staffId) => {
        return !dayAppts.some((a) => {
          if (a.staff_id !== staffId) return false;

          const apptStart = new Date(a.scheduled_start);
          const apptEnd = new Date(a.scheduled_end);
          const delay = a.delay_minutes || 0;
          const adjustedEnd = new Date(apptEnd.getTime() + delay * 60_000);

          const slotStart = new Date(selectedDate + 'T00:00:00');
          slotStart.setHours(h, m, 0, 0);
          const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60_000);

          return slotStart < adjustedEnd && slotEnd > apptStart;
        });
      });

      // Past slots are unavailable
      let isInFuture = true;
      if (isToday) {
        const slotDate = new Date();
        slotDate.setHours(h, m, 0, 0);
        isInFuture = slotDate > now;
      }

      slots.push({ time: timeStr, available: isAvailable && isInFuture });
    }

    return slots;
  }, [selectedDate, selectedService, selectedStaff, allStaff, appointments, salon.opening_hours]);

  // Current delay for selected staff
  const currentStaffDelay = useMemo(() => {
    if (!selectedStaff) return 0;
    return (
      staffAvailability.find((sa) => sa.staff.id === selectedStaff.id)
        ?.currentDelayMinutes ?? 0
    );
  }, [selectedStaff, staffAvailability]);

  // Is known client (phone auto-fill detection)
  const isKnownClient = useMemo(() => {
    const normalized = clientInfo.phone.replace(/\s/g, '');
    if (normalized.length < 10) return false;
    return existingClients.some(
      (c) => c.phone.replace(/\s/g, '') === normalized,
    );
  }, [clientInfo.phone, existingClients]);

  // Validation for step 3
  const validateStep3 = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!clientInfo.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!clientInfo.lastName.trim()) newErrors.lastName = 'Nom requis';

    const phone = clientInfo.phone.replace(/\s/g, '');
    if (!phone) {
      newErrors.phone = 'Téléphone requis';
    } else if (!/^(\+33|0)[67]\d{8}$/.test(phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [clientInfo]);

  // Can proceed to next step
  const canProceed = useMemo((): boolean => {
    switch (step) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedDate !== null && selectedTime !== null;
      case 3:
        return (
          clientInfo.firstName.trim() !== '' &&
          clientInfo.lastName.trim() !== '' &&
          clientInfo.phone.replace(/\s/g, '').length >= 10
        );
      case 4:
        return true;
      default:
        return false;
    }
  }, [step, selectedService, selectedDate, selectedTime, clientInfo]);

  const nextStep = useCallback(() => {
    if (step === 3 && !validateStep3()) return;
    if (step < 4) setStep((s) => (s + 1) as BookingStep);
  }, [step, validateStep3]);

  const prevStep = useCallback(() => {
    if (step > 1) setStep((s) => (s - 1) as BookingStep);
    setErrors({});
  }, [step]);

  const selectService = useCallback((service: Service) => {
    setSelectedService(service);
    setSelectedStaff(null);
  }, []);

  const selectStaff = useCallback((staff: Staff | null) => {
    setSelectedStaff(staff);
  }, []);

  const selectDate = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  const selectTime = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const updateClientInfo = useCallback(
    (updates: Partial<BookingClientInfo>) => {
      setClientInfo((prev) => {
        const next = { ...prev, ...updates };

        // Phone auto-fill from existing clients
        if (updates.phone !== undefined) {
          const normalized = updates.phone.replace(/\s/g, '');
          if (normalized.length >= 10) {
            const existing = existingClients.find(
              (c) => c.phone.replace(/\s/g, '') === normalized,
            );
            if (existing) {
              next.firstName = existing.first_name;
              next.lastName = existing.last_name;
              if (existing.email) next.email = existing.email;
            }
          }
        }

        return next;
      });

      // Clear errors for updated fields
      const keys = Object.keys(updates);
      if (keys.length > 0) {
        setErrors((prev) => {
          const next = { ...prev };
          for (const k of keys) delete next[k];
          return next;
        });
      }
    },
    [existingClients],
  );

  const toggleOptInUtility = useCallback(() => {
    setOptInUtility((prev) => !prev);
  }, []);

  const toggleOptInMarketing = useCallback(() => {
    setOptInMarketing((prev) => !prev);
  }, []);

  const submit = useCallback(async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    try {
      // Production: upsert client, create appointment, send WhatsApp confirmation
      // Mock: simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedService, selectedDate, selectedTime]);

  return {
    step,
    nextStep,
    prevStep,
    canProceed,

    selectedService,
    selectService,
    selectedStaff,
    selectStaff,
    staffAvailability,
    currentStaffDelay,

    selectedDate,
    selectDate,
    selectedTime,
    selectTime,
    availableSlots,

    clientInfo,
    updateClientInfo,
    isKnownClient,
    errors,

    optInUtility,
    toggleOptInUtility,
    optInMarketing,
    toggleOptInMarketing,

    isSubmitting,
    isSuccess,
    submit,
  };
}
