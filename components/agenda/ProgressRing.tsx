import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../lib/constants';

interface ProgressRingProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0 → 1
  isOvertime?: boolean;
  color?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  size,
  strokeWidth,
  progress,
  isOvertime = false,
  color,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const boundedProgress = Math.min(progress, 1);
  const strokeDashoffset = circumference * (1 - boundedProgress);

  const trackColor = COLORS.borderDefault;
  const progressColor = color ?? (isOvertime ? '#F59E0B' : '#8B5CF6');

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
