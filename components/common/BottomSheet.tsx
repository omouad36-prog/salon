import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SHADOWS, ANIMATION } from '../../lib/constants';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[]; // percentage of screen height
}

export function BottomSheet({
  visible,
  onClose,
  children,
  snapPoints = [0.6],
}: BottomSheetProps) {
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const sheetHeight = screenHeight * snapPoints[0];
  const [shouldRender, setShouldRender] = useState(visible);

  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: sheetHeight,
        duration: ANIMATION.standard,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: ANIMATION.fast,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShouldRender(false);
      }
    });
  }, [backdropOpacity, sheetHeight, translateY]);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!shouldRender) return;

    if (visible) {
      translateY.setValue(sheetHeight);
      backdropOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION.slow,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: ANIMATION.standard,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      animateOut();
    }
  }, [animateOut, backdropOpacity, sheetHeight, shouldRender, translateY, visible]);

  useEffect(() => {
    if (!visible) {
      translateY.setValue(sheetHeight);
      backdropOpacity.setValue(0);
    }
  }, [backdropOpacity, sheetHeight, translateY, visible]);

  if (!shouldRender) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            height: sheetHeight,
            paddingBottom: insets.bottom,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.bottomSheet,
    borderTopRightRadius: RADIUS.bottomSheet,
    paddingHorizontal: 20,
    paddingTop: 20,
    ...SHADOWS.modal,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderHover,
    alignSelf: 'center',
    marginBottom: 16,
  },
});
