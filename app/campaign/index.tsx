import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ScreenBackground } from '../../components/layout/ScreenBackground';
import { COLORS, FONT_SIZES, MOBILE_GUTTER, SCREEN_MAX_WIDTH, SPACING, TABLET_GUTTER } from '../../lib/constants';
import { useDeviceType } from '../../hooks/useDeviceType';

export default function CampaignScreen() {
  const router = useRouter();
  const isTablet = useDeviceType() === 'tablet';

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <View style={[styles.page, isTablet ? styles.pageTablet : styles.pagePhone]}>
        <Card style={styles.heroCard} padding="xl">
          <Text style={styles.kicker}>Campagnes WhatsApp</Text>
          <Text style={styles.title}>Le moteur marketing est en train d'etre branche proprement.</Text>
          <Text style={styles.body}>
            L'ecran est maintenant aligne avec le nouveau shell. La prochaine etape produit reliera segmentation, templates et reactivation directement a la base CRM.
          </Text>

          <View style={styles.roadmap}>
            <Text style={styles.roadmapItem}>1. Segmenter les inactifs, VIP et visites recentes</Text>
            <Text style={styles.roadmapItem}>2. Previsualiser un message avant envoi</Text>
            <Text style={styles.roadmapItem}>3. Mesurer clic, reservation et revenu genere</Text>
          </View>

          <Button title="Retour CRM" variant="secondary" onPress={() => router.back()} />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  pagePhone: {
    paddingHorizontal: MOBILE_GUTTER,
  },
  pageTablet: {
    paddingHorizontal: TABLET_GUTTER,
  },
  heroCard: {
    gap: SPACING.base,
  },
  kicker: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.45,
  },
  body: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  roadmap: {
    gap: SPACING.sm,
  },
  roadmapItem: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
  },
});
