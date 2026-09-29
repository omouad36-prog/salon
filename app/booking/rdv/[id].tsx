import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Warning } from 'phosphor-react-native';
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  RADIUS,
  FONT_WEIGHTS,
  BOOKING_MAX_WIDTH,
} from '../../../lib/constants';
import { formatPrice, formatDuration, formatTime } from '../../../lib/utils';
import { getMockAppointments, MOCK_SALON } from '../../../lib/mockData';
import { Button } from '../../../components/common/Button';

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

export default function AppointmentManagePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const appointment = useMemo(() => {
    return getMockAppointments().find((a) => a.id === id) ?? null;
  }, [id]);

  if (!appointment) {
    return (
      <View style={styles.outer}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Rendez-vous introuvable</Text>
        </View>
      </View>
    );
  }

  if (isCancelled) {
    return (
      <View style={styles.outer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.container}>
            <View style={styles.cancelledBlock}>
              <Text style={styles.cancelledTitle}>RDV annulé</Text>
              <Text style={styles.cancelledText}>
                Votre rendez-vous a bien été annulé. Un message de confirmation
                vous sera envoyé par WhatsApp.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const dateObj = new Date(appointment.scheduled_start);
  const formattedDate = `${DAYS_FR[dateObj.getDay()]} ${dateObj.getDate()} ${MONTHS_FR[dateObj.getMonth()]}`;
  const formattedTime = formatTime(appointment.scheduled_start);
  const salon = MOCK_SALON;

  return (
    <View style={styles.outer}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.pageTitle}>Votre rendez-vous</Text>

          <View style={styles.card}>
            <Row label="Salon" value={salon.name} />
            <Divider />
            {appointment.service && (
              <>
                <Row
                  label="Prestation"
                  value={`${appointment.service.name}\n${formatDuration(appointment.service.duration_minutes)} · ${formatPrice(appointment.service.price_cents)}`}
                />
                <Divider />
              </>
            )}
            {appointment.staff && (
              <>
                <Row label="Coiffeur" value={appointment.staff.name} />
                <Divider />
              </>
            )}
            <Row label="Date" value={`${formattedDate}\nà ${formattedTime}`} />
            {appointment.client && (
              <>
                <Divider />
                <Row
                  label="Client"
                  value={`${appointment.client.first_name} ${appointment.client.last_name}`}
                />
              </>
            )}
          </View>

          {/* Delay notice */}
          {appointment.delay_minutes > 0 && (
            <View style={styles.delayBanner}>
              <Text style={styles.delayText}>
                Retard estimé : ~{appointment.delay_minutes}min
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title="Modifier le créneau"
              onPress={() =>
                router.push(`/booking/${salon.slug}`)
              }
              variant="secondary"
              fullWidth
            />

            {!showCancelConfirm ? (
              <Button
                title="Annuler le rendez-vous"
                onPress={() => setShowCancelConfirm(true)}
                variant="ghost"
                fullWidth
              />
            ) : (
              <View style={styles.cancelConfirm}>
                <View style={styles.cancelWarning}>
                  <Warning size={18} color={COLORS.errorText} />
                  <Text style={styles.cancelWarningText}>
                    Êtes-vous sûr de vouloir annuler ce rendez-vous ?
                  </Text>
                </View>
                <View style={styles.cancelButtons}>
                  <Pressable
                    onPress={() => setShowCancelConfirm(false)}
                    style={styles.cancelKeep}
                  >
                    <Text style={styles.cancelKeepText}>Non, garder</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setIsCancelled(true)}
                    style={styles.cancelConfirmBtn}
                  >
                    <Text style={styles.cancelConfirmText}>
                      Oui, annuler
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING['2xl'],
    gap: SPACING.lg,
  },
  pageTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    letterSpacing: -0.24,
  },
  errorText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING['3xl'],
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    gap: SPACING.base,
  },
  rowLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
    width: 80,
  },
  rowValue: {
    flex: 1,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderDefault,
  },
  delayBanner: {
    backgroundColor: COLORS.delayBackground,
    borderWidth: 1,
    borderColor: COLORS.delayBorder,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  delayText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.delayText,
    textAlign: 'center',
  },
  actions: {
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  cancelConfirm: {
    backgroundColor: COLORS.errorBackground,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    gap: SPACING.md,
  },
  cancelWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  cancelWarningText: {
    flex: 1,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.errorText,
  },
  cancelButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cancelKeep: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.button,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelKeepText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
  },
  cancelConfirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.errorText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelConfirmText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textInverse,
  },
  cancelledBlock: {
    alignItems: 'center',
    paddingVertical: SPACING['3xl'],
    gap: SPACING.md,
  },
  cancelledTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  cancelledText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZES.body * 1.5,
  },
});
