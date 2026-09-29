import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../lib/constants';

type CardVariant =
  | 'default'
  | 'quiet'
  | 'active'
  | 'confirmed'
  | 'delay'
  | 'error'
  | 'completed'
  | 'freeSlot';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  padding?: keyof typeof SPACING | number;
  style?: StyleProp<ViewStyle>;
}

const VARIANT_COLORS: Record<CardVariant, { bg: string; border: string }> = {
  default: { bg: COLORS.surface, border: COLORS.borderDefault },
  quiet: { bg: COLORS.surfaceSoft, border: COLORS.surfaceSoft },
  active: { bg: COLORS.activeBackground, border: COLORS.activeBorder },
  confirmed: { bg: COLORS.confirmedBackground, border: COLORS.confirmedBorder },
  delay: { bg: COLORS.delayBackground, border: COLORS.delayBorder },
  error: { bg: COLORS.errorBackground, border: COLORS.errorBorder },
  completed: { bg: COLORS.completedBackground, border: COLORS.completedBorder },
  freeSlot: { bg: COLORS.freeSlotBackground, border: COLORS.freeSlotBorder },
};

export function Card({
  children,
  variant = 'default',
  onPress,
  padding = 'lg',
  style,
}: CardProps) {
  const colors = VARIANT_COLORS[variant];
  const isFreeSlot = variant === 'freeSlot';
  const resolvedPadding =
    typeof padding === 'number' ? padding : SPACING[padding];

  const cardStyle: ViewStyle = {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: isFreeSlot ? 'dashed' : 'solid',
    padding: resolvedPadding,
  };

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.base,
          cardStyle,
          pressed && styles.pressed,
          style,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.base, cardStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.card,
    ...SHADOWS.subtle,
  },
  pressed: {
    transform: [{ scale: 0.995 }],
    shadowOpacity: 0.035,
  },
});
