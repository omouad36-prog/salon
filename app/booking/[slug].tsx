import { useRef, useCallback, useMemo } from 'react';
import { View, ScrollView, Animated, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  COLORS,
  SPACING,
  BOOKING_MAX_WIDTH,
} from '../../lib/constants';
import {
  MOCK_SALON,
  MOCK_SERVICES,
  MOCK_STAFF,
  MOCK_CLIENTS,
  getMockAppointments,
} from '../../lib/mockData';
import { useBookingFlow } from '../../hooks/useBookingFlow';
import { SalonHeader } from '../../components/booking/SalonHeader';
import { BookingStepper } from '../../components/booking/BookingStepper';
import { ServiceStep } from '../../components/booking/ServiceStep';
import { DateTimeStep } from '../../components/booking/DateTimeStep';
import { ClientInfoStep } from '../../components/booking/ClientInfoStep';
import { ConfirmationStep } from '../../components/booking/ConfirmationStep';
import { SuccessScreen } from '../../components/booking/SuccessScreen';
import { Button } from '../../components/common/Button';

const DAYS_FR = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
];
const MONTHS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

export default function BookingPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  // Production: fetch salon by slug from Supabase
  const salon = MOCK_SALON;
  const services = MOCK_SERVICES;
  const staff = MOCK_STAFF;
  const appointments = useMemo(() => getMockAppointments(), []);

  const booking = useBookingFlow(salon, services, staff, appointments, MOCK_CLIENTS);

  // Step transition animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateTransition = useCallback(
    (direction: 'forward' | 'back', callback: () => void) => {
      const slideOut = direction === 'forward' ? -20 : 20;
      const slideIn = direction === 'forward' ? 20 : -20;

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 125,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: slideOut,
          duration: 125,
          useNativeDriver: true,
        }),
      ]).start(() => {
        callback();
        slideAnim.setValue(slideIn);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 125,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 125,
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [fadeAnim, slideAnim],
  );

  const handleNext = useCallback(() => {
    if (booking.step === 4) {
      void booking.submit();
      return;
    }
    animateTransition('forward', booking.nextStep);
  }, [booking.step, booking.nextStep, booking.submit, animateTransition]);

  const handleBack = useCallback(() => {
    animateTransition('back', booking.prevStep);
  }, [booking.prevStep, animateTransition]);

  // Success screen
  if (booking.isSuccess && booking.selectedDate && booking.selectedTime) {
    const dateObj = new Date(booking.selectedDate + 'T00:00:00');
    const formattedDate = `${DAYS_FR[dateObj.getDay()]} ${dateObj.getDate()} ${MONTHS_FR[dateObj.getMonth()]}`;

    return (
      <View style={styles.outer}>
        <View style={styles.successContainer}>
          <SuccessScreen
            salonName={salon.name}
            date={formattedDate}
            time={booking.selectedTime}
          />
        </View>
      </View>
    );
  }

  const buttonLabel = booking.step === 4 ? 'Confirmer mon RDV' : 'Continuer';

  return (
    <View style={styles.outer}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <SalonHeader salon={salon} />
          <BookingStepper currentStep={booking.step} />

          {/* Animated step content */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
          >
            {booking.step === 1 && (
              <ServiceStep
                services={services}
                staffAvailability={booking.staffAvailability}
                selectedService={booking.selectedService}
                selectedStaff={booking.selectedStaff}
                onSelectService={booking.selectService}
                onSelectStaff={booking.selectStaff}
              />
            )}

            {booking.step === 2 && (
              <DateTimeStep
                salon={salon}
                selectedDate={booking.selectedDate}
                selectedTime={booking.selectedTime}
                availableSlots={booking.availableSlots}
                selectedStaffName={
                  booking.selectedStaff?.name.split(' ')[0] ?? null
                }
                currentDelay={booking.currentStaffDelay}
                onSelectDate={booking.selectDate}
                onSelectTime={booking.selectTime}
              />
            )}

            {booking.step === 3 && (
              <ClientInfoStep
                clientInfo={booking.clientInfo}
                optInUtility={booking.optInUtility}
                optInMarketing={booking.optInMarketing}
                isKnownClient={booking.isKnownClient}
                errors={booking.errors}
                onUpdateClientInfo={booking.updateClientInfo}
                onToggleOptInUtility={booking.toggleOptInUtility}
                onToggleOptInMarketing={booking.toggleOptInMarketing}
              />
            )}

            {booking.step === 4 &&
              booking.selectedService &&
              booking.selectedDate &&
              booking.selectedTime && (
                <ConfirmationStep
                  salon={salon}
                  service={booking.selectedService}
                  staff={booking.selectedStaff}
                  date={booking.selectedDate}
                  time={booking.selectedTime}
                  clientInfo={booking.clientInfo}
                />
              )}
          </Animated.View>

          {/* Navigation buttons */}
          <View style={styles.buttons}>
            {booking.step > 1 && (
              <Button
                title="Retour"
                onPress={handleBack}
                variant="ghost"
                style={styles.backButton}
              />
            )}
            <Button
              title={buttonLabel}
              onPress={handleNext}
              disabled={!booking.canProceed}
              loading={booking.isSubmitting}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    alignItems: 'center',
  },
  scroll: {
    width: '100%',
    maxWidth: BOOKING_MAX_WIDTH,
    backgroundColor: COLORS.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['3xl'],
  },
  successContainer: {
    width: '100%',
    maxWidth: BOOKING_MAX_WIDTH,
    backgroundColor: COLORS.surface,
    flex: 1,
    paddingTop: SPACING['2xl'],
    paddingHorizontal: SPACING.xl,
  },
  buttons: {
    marginTop: SPACING['2xl'],
    gap: SPACING.sm,
  },
  backButton: {
    alignSelf: 'center',
  },
});
