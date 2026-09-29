import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header } from '../../components/layout/Header';
import { ScreenBackground } from '../../components/layout/ScreenBackground';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useDeviceType } from '../../hooks/useDeviceType';
import { useSalonStore } from '../../stores/salonStore';
import {
  COLORS,
  FONT_SIZES,
  MOBILE_GUTTER,
  SCREEN_MAX_WIDTH,
  SPACING,
  TABLET_GUTTER,
} from '../../lib/constants';

export default function SettingsScreen() {
  const { signOut, isConfigured } = useAuth();
  const isTablet = useDeviceType() === 'tablet';
  const salon = useSalonStore((state) => state.salon);
  const currentStaff = useSalonStore((state) => state.currentStaff);

  const settingItems = [
    {
      label: 'Plan',
      value: salon?.subscription_plan ?? 'demo',
    },
    {
      label: 'Depot',
      value: salon?.settings?.deposit_required ? 'Actif' : 'Desactive',
    },
    {
      label: 'Rappel auto',
      value: salon?.settings?.auto_reminder ? 'Actif' : 'Desactive',
    },
    {
      label: 'Objectif jour',
      value: salon?.settings?.daily_revenue_target_cents
        ? `${Math.round(salon.settings.daily_revenue_target_cents / 100)} EUR`
        : 'Non defini',
    },
  ];

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <View style={[styles.page, isTablet ? styles.pageTablet : styles.pagePhone]}>
        <Header
          title="Reglages"
          subtitle="Studio, environnement et preferes de pilotage"
          rightAction={
            <Badge
              label={isConfigured ? 'Live' : 'Demo'}
              variant={isConfigured ? 'confirmed' : 'delay'}
            />
          }
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.heroGrid, isTablet && styles.heroGridTablet]}>
            <Card style={styles.heroCard} padding="lg">
              <Text style={styles.sectionLabel}>Compte</Text>
              <Text style={styles.heroTitle}>
                {currentStaff?.name ?? 'Aucun profil charge'}
              </Text>
              <Text style={styles.heroMeta}>
                {salon?.name ?? 'Studio non charge'}
              </Text>
              <Text style={styles.heroMeta}>
                {salon?.city ? `${salon.city} · ${salon.address ?? 'adresse a preciser'}` : 'Paris · mode demonstration'}
              </Text>
            </Card>

            <Card
              style={styles.heroCard}
              variant={isConfigured ? 'confirmed' : 'delay'}
              padding="lg"
            >
              <Text style={styles.sectionLabel}>Environnement</Text>
              <Text style={styles.heroTitle}>
                {isConfigured ? 'Connecte a Supabase' : 'Mode demo actif'}
              </Text>
              <Text style={styles.heroMeta}>
                {isConfigured
                  ? 'Les donnees viennent de ton backend configure.'
                  : "L'app charge les donnees mock pour permettre une revue UI complete sans blocage d'auth."}
              </Text>
            </Card>
          </View>

          <View style={[styles.grid, isTablet && styles.gridTablet]}>
            <Card style={styles.sectionCard} padding="lg">
              <Text style={styles.sectionTitle}>Parametres studio</Text>
              <View style={styles.list}>
                {settingItems.map((item) => (
                  <View key={item.label} style={styles.listRow}>
                    <Text style={styles.listLabel}>{item.label}</Text>
                    <Text style={styles.listValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </Card>

            <Card style={styles.sectionCard} padding="lg">
              <Text style={styles.sectionTitle}>Coordonnees</Text>
              <View style={styles.list}>
                <View style={styles.listRow}>
                  <Text style={styles.listLabel}>Telephone</Text>
                  <Text style={styles.listValue}>{salon?.phone ?? 'A preciser'}</Text>
                </View>
                <View style={styles.listRow}>
                  <Text style={styles.listLabel}>Email</Text>
                  <Text style={styles.listValue}>{salon?.email ?? 'A preciser'}</Text>
                </View>
                <View style={styles.listRow}>
                  <Text style={styles.listLabel}>Slug</Text>
                  <Text style={styles.listValue}>{salon?.slug ?? 'demo'}</Text>
                </View>
              </View>
            </Card>
          </View>

          {isConfigured ? (
            <Button
              title="Se deconnecter"
              variant="secondary"
              fullWidth
              onPress={() => {
                void signOut();
              }}
            />
          ) : (
            <Card variant="quiet" padding="lg">
              <Text style={styles.demoNote}>
                Le mode demo reste volontairement accessible pour verifier le design en continu sur iPhone et iPad avant le branchement live.
              </Text>
            </Card>
          )}
        </ScrollView>
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
  },
  pagePhone: {
    paddingHorizontal: MOBILE_GUTTER,
  },
  pageTablet: {
    paddingHorizontal: TABLET_GUTTER,
  },
  content: {
    paddingBottom: SPACING['4xl'],
    gap: SPACING.base,
  },
  heroGrid: {
    gap: SPACING.base,
  },
  heroGridTablet: {
    flexDirection: 'row',
  },
  heroCard: {
    flex: 1,
    gap: SPACING.sm,
  },
  sectionLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.24,
  },
  heroTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  heroMeta: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  grid: {
    gap: SPACING.base,
  },
  gridTablet: {
    flexDirection: 'row',
  },
  sectionCard: {
    flex: 1,
    gap: SPACING.base,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  list: {
    gap: SPACING.base,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.base,
  },
  listLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  listValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  demoNote: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
