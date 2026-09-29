import { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  COLORS,
  RADIUS,
  FONT_SIZES,
  SPACING,
  SHADOWS,
  ANIMATION,
  TOUCH_TARGET,
} from '../../lib/constants';

type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  actions?: ToastAction[];
}

const TYPE_STYLES: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: { bg: COLORS.confirmedBackground, border: COLORS.confirmedBorder, text: COLORS.confirmedText },
  error: { bg: COLORS.errorBackground, border: COLORS.errorBorder, text: COLORS.errorText },
  info: { bg: COLORS.surface, border: COLORS.borderDefault, text: COLORS.textPrimary },
};

export function Toast({ message, type = 'info', visible, onDismiss, duration = 4000, actions }: ToastProps) {
  const insets = useSafeAreaInsets();
  const [shouldRender, setShouldRender] = useState(visible);
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDismissTimeout = useCallback(() => {
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = null;
    }
  }, []);

  const animateOut = useCallback(
    (notifyParent: boolean) => {
      clearDismissTimeout();

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: ANIMATION.standard,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATION.fast,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        setShouldRender(false);
        if (notifyParent) {
          onDismiss();
        }
      });
    },
    [clearDismissTimeout, onDismiss, opacity, translateY]
  );

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!shouldRender) return;

    clearDismissTimeout();

    if (visible) {
      translateY.setValue(100);
      opacity.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION.standard,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION.standard,
          useNativeDriver: true,
        }),
      ]).start();

      dismissTimeoutRef.current = setTimeout(() => {
        animateOut(true);
      }, duration);
    } else {
      animateOut(false);
    }

    return clearDismissTimeout;
  }, [
    animateOut,
    clearDismissTimeout,
    duration,
    opacity,
    shouldRender,
    translateY,
    visible,
  ]);

  const colors = TYPE_STYLES[type];

  if (!shouldRender) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: insets.bottom + SPACING.base,
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        SHADOWS.medium,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      {actions && actions.length > 0 && (
        <View style={styles.actionsRow}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              onPress={() => {
                action.onPress();
                animateOut(true);
              }}
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Text style={[styles.actionLabel, { color: colors.text }]}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING.base,
    right: SPACING.base,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    zIndex: 9999,
  },
  message: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionButton: {
    minHeight: TOUCH_TARGET,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
  },
});
