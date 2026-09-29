import { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  type StyleProp,
  type ViewStyle,
  View,
} from 'react-native';
import { ANIMATION, COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING, TOUCH_TARGET } from '../../lib/constants';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'ghost';
type ButtonSize = 'default' | 'small';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const variantStyles = VARIANT_STYLES[variant];
  const isSmall = size === 'small';
  const contentColor = variantStyles.textColor;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        Animated.timing(scale, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.timing(scale, {
          toValue: 1,
          duration: ANIMATION.fast,
          useNativeDriver: true,
        }).start();
      }}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      style={[
        styles.base,
        isSmall && styles.small,
        variantStyles.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        { transform: [{ scale }] },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={contentColor}
        />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              styles.label,
              isSmall && styles.labelSmall,
              { color: contentColor },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const VARIANT_STYLES = {
  primary: {
    container: {
      backgroundColor: COLORS.brandPrimary,
      borderWidth: 0,
      ...SHADOWS.subtle,
    } as ViewStyle,
    textColor: COLORS.textInverse,
  },
  secondary: {
    container: {
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.borderDefault,
    } as ViewStyle,
    textColor: COLORS.textPrimary,
  },
  whatsapp: {
    container: {
      backgroundColor: COLORS.whatsappGreen,
      borderWidth: 0,
    } as ViewStyle,
    textColor: COLORS.textInverse,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    } as ViewStyle,
    textColor: COLORS.textPrimary,
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET,
    minWidth: TOUCH_TARGET,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.button,
    gap: SPACING.sm,
  },
  small: {
    minHeight: 40,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: 14,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.45,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  label: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '500',
    letterSpacing: -0.15,
  },
  labelSmall: {
    fontSize: FONT_SIZES.bodySmall,
  },
});
