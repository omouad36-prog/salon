import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { COLORS, FONT_SIZES, RADIUS } from '../../lib/constants';

type BadgeVariant = 'active' | 'confirmed' | 'delay' | 'error' | 'completed' | 'freeSlot' | 'vip' | 'outline';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

const VARIANT_COLORS: Record<
  BadgeVariant,
  { bg: string; text: string; border: string }
> = {
  active: {
    bg: COLORS.activeBackground,
    text: COLORS.activeText,
    border: COLORS.activeBorder,
  },
  confirmed: {
    bg: COLORS.confirmedBackground,
    text: COLORS.confirmedText,
    border: COLORS.confirmedBorder,
  },
  delay: {
    bg: COLORS.delayBackground,
    text: COLORS.delayText,
    border: COLORS.delayBorder,
  },
  error: {
    bg: COLORS.errorBackground,
    text: COLORS.errorText,
    border: COLORS.errorBorder,
  },
  completed: {
    bg: COLORS.completedBackground,
    text: COLORS.completedText,
    border: COLORS.completedBorder,
  },
  freeSlot: {
    bg: COLORS.freeSlotBackground,
    text: COLORS.freeSlotText,
    border: COLORS.freeSlotBorder,
  },
  vip: { bg: COLORS.delayBackground, text: COLORS.delayText, border: COLORS.delayBorder },
  outline: {
    bg: COLORS.surface,
    text: COLORS.textSecondary,
    border: COLORS.borderDefault,
  },
};

export function Badge({ label, variant = 'confirmed', style }: BadgeProps) {
  const colors = VARIANT_COLORS[variant];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 26,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.label,
    fontWeight: '500',
    letterSpacing: 0.22,
    textTransform: 'uppercase',
  },
});
