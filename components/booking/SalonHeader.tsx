import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, FONT_WEIGHTS, RADIUS } from '../../lib/constants';
import { getAvatarColor } from '../../lib/utils';
import type { Salon } from '../../types/salon';

interface SalonHeaderProps {
  salon: Salon;
}

export function SalonHeader({ salon }: SalonHeaderProps) {
  const parts = salon.name.split(' ');
  const initials = `${(parts[0]?.[0] ?? '').toUpperCase()}${(parts[1]?.[0] ?? '').toUpperCase()}`;
  const avatarColor = getAvatarColor(salon.name);

  return (
    <View style={styles.container}>
      <View style={styles.logoShell}>
        {salon.logo_url ? (
          <Image
            source={{ uri: salon.logo_url }}
            style={styles.logo}
            accessibilityLabel={`Logo ${salon.name}`}
          />
        ) : (
          <View style={[styles.logoFallback, { backgroundColor: avatarColor }]}>
            <Text style={styles.logoInitials}>{initials}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.eyebrow}>Réservation en ligne</Text>
        <Text style={styles.name}>{salon.name}</Text>
        {(salon.address || salon.city) && (
          <Text style={styles.address}>
            {salon.address}
            {salon.city ? `, ${salon.city}` : ''}
          </Text>
        )}
        <View style={styles.ratingPill}>
          <Text style={styles.rating}>4.9 · 124 avis</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.base,
    paddingVertical: SPACING.lg,
  },
  logoShell: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: SPACING.sm,
  },
  logoFallback: {
    width: 48,
    height: 48,
    borderRadius: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitials: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textInverse,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
    letterSpacing: -0.18,
  },
  address: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
  },
  rating: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.delayText,
  },
  ratingPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.delayBorder,
    backgroundColor: COLORS.delayBackground,
  },
});
