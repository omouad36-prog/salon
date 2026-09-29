import { View, Text, StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  RADIUS,
  FONT_WEIGHTS,
} from '../../lib/constants';
import { formatPrice, formatDuration } from '../../lib/utils';
import type { Salon, Service, Staff } from '../../types/salon';
import type { BookingClientInfo } from '../../types/booking';

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

interface ConfirmationStepProps {
  salon: Salon;
  service: Service;
  staff: Staff | null;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  clientInfo: BookingClientInfo;
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

export function ConfirmationStep({
  salon,
  service,
  staff,
  date,
  time,
  clientInfo,
}: ConfirmationStepProps) {
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = `${DAYS_FR[dateObj.getDay()]} ${dateObj.getDate()} ${MONTHS_FR[dateObj.getMonth()]}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Récapitulatif</Text>

      <View style={styles.card}>
        <Row
          label="Salon"
          value={`${salon.name}${salon.address ? `\n${salon.address}${salon.city ? `, ${salon.city}` : ''}` : ''}`}
        />
        <Divider />
        <Row
          label="Prestation"
          value={`${service.name}\n${formatDuration(service.duration_minutes)} · ${formatPrice(service.price_cents)}`}
        />
        <Divider />
        <Row
          label="Coiffeur"
          value={staff ? staff.name : 'Sans préférence'}
        />
        <Divider />
        <Row label="Date" value={`${formattedDate}\nà ${time}`} />
        <Divider />
        <Row
          label="Client"
          value={`${clientInfo.firstName} ${clientInfo.lastName}\n${clientInfo.phone}`}
        />
      </View>

      {salon.settings?.booking_info && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Information du salon</Text>
          <Text style={styles.infoText}>{salon.settings.booking_info}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  title: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
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
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
    width: 80,
    textTransform: 'uppercase',
    letterSpacing: 0.24,
  },
  rowValue: {
    flex: 1,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textPrimary,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderDefault,
  },
  infoCard: {
    backgroundColor: COLORS.delayBackground,
    borderWidth: 1,
    borderColor: COLORS.delayBorder,
    borderRadius: RADIUS.card,
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  infoTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.delayText,
  },
  infoText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.delayText,
    lineHeight: FONT_SIZES.bodySmall * 1.5,
  },
});
