import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'phosphor-react-native';
import { COLORS, FONT_SIZES, SPACING, FONT_WEIGHTS } from '../../lib/constants';
import type { BookingStep } from '../../types/booking';

const STEPS = [
  { number: 1, label: 'Prestation' },
  { number: 2, label: 'Date & Heure' },
  { number: 3, label: 'Vos infos' },
  { number: 4, label: 'Confirmation' },
] as const;

const STEP_GREEN = '#10B981';

interface BookingStepperProps {
  currentStep: BookingStep;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  return (
    <View style={styles.container}>
      {STEPS.map((step, i) => {
        const isPast = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const leftConnectorGreen = step.number <= currentStep;
        const rightConnectorGreen = step.number < currentStep;

        return (
          <View key={step.number} style={styles.stepColumn}>
            <View style={styles.circleRow}>
              {i > 0 ? (
                <View
                  style={[
                    styles.connector,
                    leftConnectorGreen && styles.connectorGreen,
                  ]}
                />
              ) : (
                <View style={styles.connectorSpacer} />
              )}

              <View
                style={[
                  styles.circle,
                  isPast && styles.circlePast,
                  isCurrent && styles.circleCurrent,
                  !isPast && !isCurrent && styles.circleFuture,
                ]}
              >
                {isPast ? (
                  <Check size={14} color={COLORS.textInverse} weight="bold" />
                ) : (
                  <Text
                    style={[
                      styles.circleText,
                      isCurrent && styles.circleTextCurrent,
                      !isCurrent && !isPast && styles.circleTextFuture,
                    ]}
                  >
                    {step.number}
                  </Text>
                )}
              </View>

              {i < STEPS.length - 1 ? (
                <View
                  style={[
                    styles.connector,
                    rightConnectorGreen && styles.connectorGreen,
                  ]}
                />
              ) : (
                <View style={styles.connectorSpacer} />
              )}
            </View>

            <Text
              style={[
                styles.label,
                isPast && styles.labelPast,
                isCurrent && styles.labelCurrent,
                !isPast && !isCurrent && styles.labelFuture,
              ]}
              numberOfLines={1}
            >
              {step.label}
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
    paddingVertical: SPACING.base,
  },
  stepColumn: {
    flex: 1,
    alignItems: 'center',
  },
  circleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  connector: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderDefault,
  },
  connectorGreen: {
    backgroundColor: STEP_GREEN,
  },
  connectorSpacer: {
    flex: 1,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePast: {
    backgroundColor: STEP_GREEN,
  },
  circleCurrent: {
    backgroundColor: COLORS.brandPrimary,
  },
  circleFuture: {
    backgroundColor: COLORS.borderDefault,
  },
  circleText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  circleTextCurrent: {
    color: COLORS.textInverse,
  },
  circleTextFuture: {
    color: COLORS.textTertiary,
  },
  label: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.medium,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  labelPast: {
    color: COLORS.textSecondary,
  },
  labelCurrent: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  labelFuture: {
    color: COLORS.textTertiary,
  },
});
