import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'phosphor-react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../lib/constants';

interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <View style={styles.container}>
      {steps.map((label, index) => {
        const isPast = index < currentStep;
        const isActive = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <View key={label} style={styles.stepWrapper}>
            <View style={styles.stepRow}>
              {/* Circle */}
              <View
                style={[
                  styles.circle,
                  isPast && styles.circlePast,
                  isActive && styles.circleActive,
                ]}
              >
                {isPast ? (
                  <Check size={14} color={COLORS.textInverse} weight="bold" />
                ) : (
                  <Text
                    style={[
                      styles.circleText,
                      isActive && styles.circleTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              {/* Connector line */}
              {!isLast && (
                <View style={[styles.line, isPast && styles.linePast]} />
              )}
            </View>

            {/* Label */}
            <Text
              style={[
                styles.label,
                isActive && styles.labelActive,
                isPast && styles.labelPast,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.base,
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    zIndex: 1,
  },
  circleActive: {
    backgroundColor: COLORS.brandPrimary,
  },
  circlePast: {
    backgroundColor: '#10B981',
  },
  circleText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },
  circleTextActive: {
    color: COLORS.textInverse,
  },
  line: {
    position: 'absolute',
    left: '50%',
    right: '-50%',
    height: 1,
    backgroundColor: COLORS.borderDefault,
    top: 14,
  },
  linePast: {
    backgroundColor: '#10B981',
  },
  label: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  labelActive: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  labelPast: {
    color: COLORS.textSecondary,
  },
});
