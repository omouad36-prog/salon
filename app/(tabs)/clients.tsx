import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MegaphoneSimple } from 'phosphor-react-native';
import { ClientFilters } from '../../components/clients/ClientFilters';
import { ClientList } from '../../components/clients/ClientList';
import { Card } from '../../components/common/Card';
import { Header } from '../../components/layout/Header';
import { ScreenBackground } from '../../components/layout/ScreenBackground';
import { Button } from '../../components/common/Button';
import { SkeletonList } from '../../components/common/Skeleton';
import {
  COLORS,
  FONT_SIZES,
  MOBILE_GUTTER,
  SCREEN_MAX_WIDTH,
  SPACING,
  TABLET_GUTTER,
} from '../../lib/constants';
import { useClients } from '../../hooks/useClients';
import { useClientStore } from '../../stores/clientStore';
import type { ClientFilter, ClientSort, ClientWithScore } from '../../types/client';
import { useDeviceType } from '../../hooks/useDeviceType';

export default function ClientsScreen() {
  const router = useRouter();
  const deviceType = useDeviceType();
  const isTablet = deviceType === 'tablet';
  const [filter, setFilter] = useState<ClientFilter>('all');
  const [sort, setSort] = useState<ClientSort>('last_visit');
  const [searchQuery, setSearchQuery] = useState('');
  const allClients = useClientStore((state) => state.clients);

  const { clients, totalCount, isLoading } = useClients({ filter, sort, searchQuery });

  const metrics = useMemo(() => {
    const vipCount = allClients.filter((client) => client.is_vip).length;
    const inactiveCount = allClients.filter((client) => {
      if (!client.last_visit_at) return true;
      const diffDays =
        (Date.now() - new Date(client.last_visit_at).getTime()) / 86400000;
      return diffDays > 21;
    }).length;
    const recentCount = allClients.filter((client) => {
      if (!client.last_visit_at) return false;
      const diffDays =
        (Date.now() - new Date(client.last_visit_at).getTime()) / 86400000;
      return diffDays <= 7;
    }).length;

    return [
      { label: 'Profils suivis', value: `${totalCount}`, meta: 'Base active', tone: 'default' as const },
      { label: 'VIP', value: `${vipCount}`, meta: 'Clients a haute valeur', tone: 'freeSlot' as const },
      { label: 'A relancer', value: `${inactiveCount}`, meta: 'Absents > 21 jours', tone: 'delay' as const },
      { label: 'Recents', value: `${recentCount}`, meta: 'Passes cette semaine', tone: 'confirmed' as const },
    ];
  }, [allClients, totalCount]);

  const handleMessagePress = (client: ClientWithScore) => {
    Alert.alert(
      'Message rapide',
      `La messagerie WhatsApp pour ${client.first_name} sera branchee dans le module suivant.`,
    );
  };

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <View style={[styles.page, isTablet ? styles.pageTablet : styles.pagePhone]}>
        <Header
          title="Clients"
          subtitle="Segmentation, relance et valeur CRM"
          rightAction={
            <Button
              title="Campagne"
              variant="primary"
              size="small"
              icon={<MegaphoneSimple size={16} color={COLORS.textInverse} weight="light" />}
              onPress={() => router.push('/campaign')}
            />
          }
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.metricsRow,
              isTablet ? styles.metricsRowTablet : styles.metricsRowPhone,
            ]}
          >
            {metrics.map((metric) => (
              <Card
                key={metric.label}
                style={[styles.metricCard, !isTablet && styles.metricCardPhone]}
                variant={metric.tone}
                padding="lg"
              >
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricMeta}>{metric.meta}</Text>
              </Card>
            ))}
          </View>

          <Card style={styles.filtersCard} padding="lg">
            <ClientFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filter={filter}
              onFilterChange={setFilter}
              sort={sort}
              onSortChange={setSort}
            />
          </Card>

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Base relationnelle</Text>
            <Text style={styles.listMeta}>
              {clients.length} profil{clients.length > 1 ? 's' : ''} sur cette vue
            </Text>
          </View>

          {isLoading ? (
            <SkeletonList count={5} />
          ) : (
            <ClientList
              clients={clients}
              onClientPress={(clientId) => router.push(`/client/${clientId}`)}
              onMessagePress={handleMessagePress}
            />
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING['4xl'],
    gap: SPACING.base,
  },
  metricsRow: {
    gap: SPACING.base,
  },
  metricsRowPhone: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  metricsRowTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricCard: {
    flex: 1,
    minHeight: 132,
  },
  metricCardPhone: {
    minHeight: 108,
    flexBasis: '48%',
  },
  metricLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.24,
  },
  metricValue: {
    marginTop: SPACING.md,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.45,
  },
  metricMeta: {
    marginTop: SPACING.sm,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  filtersCard: {
    backgroundColor: COLORS.surfaceElevated,
  },
  listHeader: {
    gap: 4,
  },
  listTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  listMeta: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
  },
});
