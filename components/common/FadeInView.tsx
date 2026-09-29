import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ANIMATION } from '../../lib/constants';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  translateY?: number;
  style?: StyleProp<ViewStyle>;
}

export function FadeInView({
  children,
  delay = 0,
  duration = ANIMATION.standard,
  translateY = 8,
  style,
}: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    opacity.setValue(0);
    offset.setValue(translateY);

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(offset, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delay, duration, offset, opacity, translateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY: offset }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
