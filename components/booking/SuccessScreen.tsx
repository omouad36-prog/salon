import { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { CheckCircle } from 'phosphor-react-native';
import { COLORS, FONT_SIZES, SPACING, FONT_WEIGHTS } from '../../lib/constants';

interface SuccessScreenProps {
  salonName: string;
  date: string;
  time: string;
}

export function SuccessScreen({ salonName, date, time }: SuccessScreenProps) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim, textOpacity]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconShell,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <CheckCircle size={72} color="#10B981" weight="fill" />
      </Animated.View>

      <Animated.View style={[styles.textBlock, { opacity: textOpacity }]}>
        <Text style={styles.title}>RDV confirmé !</Text>
        <Text style={styles.subtitle}>
          Votre rendez-vous chez {salonName} est confirmé pour le {date} à{' '}
          {time}.
        </Text>
        <Text style={styles.whatsappNote}>
          Un message de confirmation vous sera envoyé par WhatsApp.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['3xl'],
    gap: SPACING.xl,
  },
  textBlock: {
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  iconShell: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: COLORS.confirmedBackground,
    borderWidth: 1,
    borderColor: COLORS.confirmedBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    letterSpacing: -0.24,
  },
  subtitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZES.body * 1.5,
  },
  whatsappNote: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});
