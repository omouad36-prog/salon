import { useEffect, useRef } from 'react';
import { StyleSheet, Animated, type ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../../lib/constants';

interface SkeletonProps {
  width: ViewStyle['width'];
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width,
  height,
  borderRadius = RADIUS.pill,
  style,
}: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 0.7,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmer]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity: shimmer,
        },
        style,
      ]}
    />
  );
}

// Pre-built skeleton compositions
export function SkeletonCard() {
  return (
    <Animated.View style={styles.card}>
      <Skeleton width={36} height={36} borderRadius={18} />
      <Animated.View style={styles.cardLines}>
        <Skeleton width="70%" height={12} />
        <Skeleton width="50%" height={12} />
      </Animated.View>
    </Animated.View>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.borderDefault,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardLines: {
    flex: 1,
    gap: 8,
  },
});
