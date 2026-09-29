import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Check } from 'phosphor-react-native';
import {
  COLORS,
  FONT_SIZES,
  SPACING,
  RADIUS,
  FONT_WEIGHTS,
} from '../../lib/constants';
import { Input } from '../common/Input';
import type { BookingClientInfo } from '../../types/booking';

interface ClientInfoStepProps {
  clientInfo: BookingClientInfo;
  optInUtility: boolean;
  optInMarketing: boolean;
  isKnownClient: boolean;
  errors: Record<string, string>;
  onUpdateClientInfo: (updates: Partial<BookingClientInfo>) => void;
  onToggleOptInUtility: () => void;
  onToggleOptInMarketing: () => void;
}

function Checkbox({
  checked,
  onPress,
  label,
}: {
  checked: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.checkboxRow}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Check size={14} color={COLORS.textInverse} weight="bold" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </Pressable>
  );
}

export function ClientInfoStep({
  clientInfo,
  optInUtility,
  optInMarketing,
  isKnownClient,
  errors,
  onUpdateClientInfo,
  onToggleOptInUtility,
  onToggleOptInMarketing,
}: ClientInfoStepProps) {
  return (
    <View style={styles.container}>
      <Input
        label="Téléphone"
        value={clientInfo.phone}
        onChangeText={(text: string) => onUpdateClientInfo({ phone: text })}
        placeholder="06 12 34 56 78"
        keyboardType="phone-pad"
        error={errors.phone}
        helperText={
          isKnownClient ? 'Client reconnu — informations pré-remplies' : undefined
        }
      />

      <Input
        label="Prénom"
        value={clientInfo.firstName}
        onChangeText={(text: string) => onUpdateClientInfo({ firstName: text })}
        placeholder="Votre prénom"
        autoCapitalize="words"
        error={errors.firstName}
      />

      <Input
        label="Nom"
        value={clientInfo.lastName}
        onChangeText={(text: string) => onUpdateClientInfo({ lastName: text })}
        placeholder="Votre nom"
        autoCapitalize="words"
        error={errors.lastName}
      />

      <Input
        label="Email (optionnel)"
        value={clientInfo.email}
        onChangeText={(text: string) => onUpdateClientInfo({ email: text })}
        placeholder="email@exemple.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.optIns}>
        <Checkbox
          checked={optInUtility}
          onPress={onToggleOptInUtility}
          label="Recevoir les confirmations et rappels par WhatsApp"
        />
        <Checkbox
          checked={optInMarketing}
          onPress={onToggleOptInMarketing}
          label="Recevoir les offres exclusives du salon par WhatsApp"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.base,
  },
  optIns: {
    gap: SPACING.md,
    marginTop: SPACING.sm,
    padding: SPACING.base,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.checkbox,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: COLORS.brandPrimary,
    borderColor: COLORS.brandPrimary,
  },
  checkboxLabel: {
    flex: 1,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textPrimary,
    lineHeight: FONT_SIZES.bodySmall * 1.5,
  },
});
