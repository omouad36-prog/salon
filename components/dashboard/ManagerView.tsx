import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useDashboard } from '../../hooks/useDashboard';
import { useDeviceType } from '../../hooks/useDeviceType';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { COLORS, FONT_SIZES, SPACING } from '../../lib/constants';
import { formatPrice } from '../../lib/utils';

export function ManagerView() {
  const router = useRouter();
  const deviceType = useDeviceType();
  const isTablet = deviceType === 'tablet';
  const {
    todayRevenueCents,
    dailyTargetCents,
    revenueProgress,
    fillRate,
    noShowRate,
    weeklyRevenue,
    weekTotalCents,
    teamStats,
    stockAlerts,
    insightText,
  } = useDashboard();

  const targetGap = Math.max(0, dailyTargetCents - todayRevenueCents);
  const progressPercent = Math.round(revenueProgress * 100);
  const maxRevenue = Math.max(...weeklyRevenue.map((day) => day.revenue_cents), 1);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.heroGrid, isTablet && styles.heroGridTablet]}>
        <Card style={styles.revenueHero} padding="lg">
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.eyebrow}>Revenus du jour</Text>
              <Text style={styles.sectionTitle}>Objectif studio</Text>
            </View>
            <Badge
              label={progressPercent >= 100 ? 'Objectif atteint' : `${progressPercent}%`}
              variant={progressPercent >= 70 ? 'confirmed' : progressPercent >= 40 ? 'delay' : 'error'}
            />
          </View>

          <Text style={styles.heroValue}>{formatPrice(todayRevenueCents)}</Text>
          <Text style={styles.heroMeta}>
            sur {formatPrice(dailyTargetCents)} cibles aujourd'hui
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(progressPercent, 100)}%` }]} />
          </View>

          <Text style={styles.footnote}>
            {targetGap > 0 ? `${formatPrice(targetGap)} restants pour le palier du jour` : 'Le studio est au-dessus du plan du jour'}
          </Text>
        </Card>

        <Card style={styles.insightHero} variant="quiet" padding="lg">
          <Text style={styles.eyebrow}>Lecture manager</Text>
          <Text style={styles.insightTitle}>Signal du moment</Text>
          <Text style={styles.insightBody}>{insightText}</Text>
          <Button
            title="Tous les KPIs"
            variant="secondary"
            size="small"
            onPress={() => router.push('/kpis')}
          />
        </Card>
      </View>

      <View style={[styles.kpiRow, isTablet ? styles.kpiRowTablet : styles.kpiRowPhone]}>
        <ManagerMetricCard
          label="Remplissage"
          value={`${fillRate}%`}
          meta="Capacite exploitee"
          tone={fillRate >= 70 ? 'confirmed' : 'delay'}
          compact={!isTablet}
        />
        <ManagerMetricCard
          label="No-show"
          value={`${noShowRate}%`}
          meta="Rendez-vous perdus"
          tone={noShowRate > 5 ? 'error' : 'default'}
          compact={!isTablet}
        />
        <ManagerMetricCard
          label="Semaine"
          value={formatPrice(weekTotalCents)}
          meta="Cumule hebdo"
          tone="active"
          compact={!isTablet}
        />
      </View>

      <View style={[styles.detailGrid, isTablet && styles.detailGridTablet]}>
        <Card style={styles.detailCard} padding="lg">
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.eyebrow}>Semaine</Text>
              <Text style={styles.sectionTitle}>Revenu quotidien</Text>
            </View>
            <Badge label={formatPrice(weekTotalCents)} variant="outline" />
          </View>

          <View style={styles.chartList}>
            {weeklyRevenue.map((entry) => (
              <View key={entry.day} style={styles.chartRow}>
                <Text style={styles.chartDay}>{entry.day}</Text>
                <View style={styles.chartTrack}>
                  <View
                    style={[
                      styles.chartBar,
                      entry.isToday && styles.chartBarToday,
                      { width: `${Math.max(8, (entry.revenue_cents / maxRevenue) * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.chartValue}>{formatPrice(entry.revenue_cents)}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.detailCard} padding="lg">
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.eyebrow}>Equipe</Text>
              <Text style={styles.sectionTitle}>Retention et charge</Text>
            </View>
            <Badge label={`${teamStats.length} profils`} variant="outline" />
          </View>

          <View style={styles.teamList}>
            {teamStats.map((member) => (
              <View key={member.id} style={styles.teamRow}>
                <View style={styles.teamCopy}>
                  <Text style={styles.teamName}>{member.name}</Text>
                  <Text style={styles.teamMeta}>{member.todayApts} rendez-vous aujourd'hui</Text>
                </View>
                <Text style={styles.teamRetention}>{member.retention.toFixed(1)}%</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <Card style={styles.stockCard} variant="freeSlot" padding="lg">
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.eyebrow}>Stock critique</Text>
            <Text style={styles.sectionTitle}>Produits a recommander</Text>
          </View>
          <Badge label={`${stockAlerts.length}`} variant="delay" />
        </View>

        <View style={styles.stockList}>
          {stockAlerts.map((product) => (
            <View key={product.id} style={styles.stockRow}>
              <View style={styles.stockCopy}>
                <Text style={styles.stockName}>{product.name}</Text>
                <Text style={styles.stockMeta}>
                  {formatPrice(product.price_cents)} · seuil {product.low_stock_threshold}
                </Text>
              </View>
              <Text style={styles.stockQty}>{product.stock_quantity}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

function ManagerMetricCard({
  label,
  value,
  meta,
  tone,
  compact = false,
}: {
  label: string;
  value: string;
  meta: string;
  tone: 'default' | 'confirmed' | 'delay' | 'error' | 'active';
  compact?: boolean;
}) {
  return (
    <Card style={[styles.metricCard, compact && styles.metricCardCompact]} variant={tone} padding="lg">
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricMeta}>{meta}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
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
  revenueHero: {
    flex: 1.25,
    gap: SPACING.base,
  },
  insightHero: {
    flex: 1,
    gap: SPACING.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  eyebrow: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.24,
  },
  sectionTitle: {
    marginTop: 4,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  heroValue: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  heroMeta: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceMuted,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.brandAccent,
  },
  footnote: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  insightTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  insightBody: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  kpiRow: {
    gap: SPACING.base,
  },
  kpiRowPhone: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  kpiRowTablet: {
    flexDirection: 'row',
  },
  metricCard: {
    flex: 1,
    minHeight: 136,
  },
  metricCardCompact: {
    flexBasis: '48%',
    minHeight: 114,
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
    marginTop: SPACING.base,
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
  detailGrid: {
    gap: SPACING.base,
  },
  detailGridTablet: {
    flexDirection: 'row',
  },
  detailCard: {
    flex: 1,
    gap: SPACING.base,
  },
  chartList: {
    gap: SPACING.sm,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  chartDay: {
    width: 28,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  chartTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceMuted,
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.brandAccentSoft,
  },
  chartBarToday: {
    backgroundColor: COLORS.brandAccent,
  },
  chartValue: {
    width: 64,
    textAlign: 'right',
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  teamList: {
    gap: SPACING.sm,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  teamCopy: {
    flex: 1,
    gap: 3,
  },
  teamName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  teamMeta: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  teamRetention: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.brandAccentText,
  },
  stockCard: {
    gap: SPACING.base,
  },
  stockList: {
    gap: SPACING.sm,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.freeSlotBorder,
  },
  stockCopy: {
    flex: 1,
    gap: 3,
  },
  stockName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  stockMeta: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  stockQty: {
    minWidth: 32,
    textAlign: 'center',
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.delayText,
  },
});
