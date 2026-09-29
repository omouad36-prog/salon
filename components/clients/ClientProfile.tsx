import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CalendarPlus, ChatCircleDots, WarningCircle } from 'phosphor-react-native';
import { useDeviceType } from '../../hooks/useDeviceType';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ClientStats } from './ClientStats';
import { COLORS, FONT_SIZES, SPACING } from '../../lib/constants';
import { formatClientSince, formatDateFull, formatPrice } from '../../lib/utils';
import type { ClientVisit, ClientWithScore, HairTexture } from '../../types/client';

const NOTES_DEBOUNCE_MS = 1000;

interface ClientProfileProps {
  client: ClientWithScore;
  visits: ClientVisit[];
  onNotesChange: (value: string) => void;
  onMessage: () => void;
  onNoShow: () => void;
  onBook: () => void;
}

export function ClientProfile({
  client,
  visits,
  onNotesChange,
  onMessage,
  onNoShow,
  onBook,
}: ClientProfileProps) {
  const isTablet = useDeviceType() === 'tablet';
  const favoriteService = getFavoriteService(visits);
  const preferredSlot = getPreferredSlot(visits);
  const [localNotes, setLocalNotes] = useState(client.notes ?? '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalNotes(client.notes ?? '');
  }, [client.id, client.notes]);

  const handleNotesChange = useCallback(
    (value: string) => {
      setLocalNotes(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onNotesChange(value);
      }, NOTES_DEBOUNCE_MS);
    },
    [onNotesChange],
  );

  useEffect(
    () => () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    },
    [],
  );

  return (
    <View style={styles.content}>
      <Card style={styles.heroCard} padding="xl">
        <View style={[styles.heroTop, isTablet && styles.heroTopTablet]}>
          <View style={styles.heroIdentity}>
            <Avatar
              firstName={client.first_name}
              lastName={client.last_name}
              imageUrl={client.avatar_url}
              size="xl"
            />

            <View style={styles.heroCopy}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {client.first_name} {client.last_name}
                </Text>
                {client.is_vip ? <Badge label="VIP" variant="vip" /> : null}
              </View>

              <Text style={styles.memberSince}>{formatClientSince(client.created_at)}</Text>
              <Text style={styles.contact}>{client.phone}</Text>
              {client.email ? <Text style={styles.contact}>{client.email}</Text> : null}

              <View style={styles.inlineBadges}>
                <Badge label={`Score ${client.value_score}`} variant="outline" />
                <Badge label={preferredSlot} variant="active" />
              </View>
            </View>
          </View>

          <View style={styles.heroActions}>
            <Button
              title="Message"
              variant="secondary"
              onPress={onMessage}
              icon={<ChatCircleDots size={18} color={COLORS.textPrimary} weight="light" />}
              style={styles.heroActionButton}
            />
            <Button
              title="No-show"
              variant="secondary"
              onPress={onNoShow}
              icon={<WarningCircle size={18} color={COLORS.textPrimary} weight="light" />}
              style={styles.heroActionButton}
            />
            <Button
              title="Reserver"
              variant="primary"
              onPress={onBook}
              icon={<CalendarPlus size={18} color={COLORS.textInverse} weight="light" />}
              style={styles.heroActionButton}
            />
          </View>
        </View>
      </Card>

      <ClientStats client={client} />

      <View style={[styles.detailGrid, isTablet && styles.detailGridTablet]}>
        <View style={styles.leftColumn}>
          <Card style={styles.sectionCard} padding="lg">
            <Text style={styles.sectionTitle}>Profil de visite</Text>
            <View style={styles.preferenceList}>
              <PreferenceRow label="Texture">
                <HairTexturePill texture={client.hair_texture} />
              </PreferenceRow>
              <PreferenceRow label="Service favori">
                <Text style={styles.preferenceValue}>{favoriteService}</Text>
              </PreferenceRow>
              <PreferenceRow label="Creneau prefere">
                <Text style={styles.preferenceValue}>{preferredSlot}</Text>
              </PreferenceRow>
              <PreferenceRow label="Depense cumulee">
                <Text style={styles.preferenceValue}>{formatPrice(client.total_spent_cents)}</Text>
              </PreferenceRow>
            </View>
          </Card>

          <Card style={styles.sectionCard} padding="lg">
            <Text style={styles.sectionTitle}>Notes du salon</Text>
            <TextInput
              multiline
              value={localNotes}
              onChangeText={handleNotesChange}
              placeholder="Ajoute une note utile pour le prochain rendez-vous."
              placeholderTextColor={COLORS.textTertiary}
              style={styles.notesInput}
              textAlignVertical="top"
              accessibilityLabel="Notes client"
            />
          </Card>
        </View>

        <Card style={[styles.sectionCard, styles.historyCard]} padding="lg">
          <Text style={styles.sectionTitle}>Historique recent</Text>
          <View style={styles.historyList}>
            {visits.map((visit, index) => (
              <View
                key={visit.id}
                style={[
                  styles.historyRow,
                  index < visits.length - 1 && styles.historyRowBorder,
                ]}
              >
                <View style={styles.historyMain}>
                  <Text style={styles.historyService}>{visit.service_name}</Text>
                  <Text style={styles.historyMeta}>
                    {formatDateFull(visit.date)} · {visit.staff_name}
                  </Text>
                </View>

                <View style={styles.historyAside}>
                  {visit.status === 'no_show' ? <Badge label="No-show" variant="error" /> : null}
                  <Text style={styles.historyPrice}>{formatPrice(visit.price_cents)}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </View>
    </View>
  );
}

function PreferenceRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.preferenceRow}>
      <Text style={styles.preferenceLabel}>{label}</Text>
      {children}
    </View>
  );
}

function HairTexturePill({ texture }: { texture: HairTexture | null }) {
  const info = getHairTextureInfo(texture);
  return <Badge label={info.label} variant={info.variant} />;
}

function getHairTextureInfo(texture: HairTexture | null): {
  label: string;
  variant: 'active' | 'confirmed' | 'delay' | 'outline';
} {
  switch (texture) {
    case 'straight':
      return { label: 'Lisse', variant: 'confirmed' };
    case 'curly':
      return { label: 'Boucle', variant: 'active' };
    case 'afro':
      return { label: 'Afro', variant: 'delay' };
    default:
      return { label: 'A preciser', variant: 'outline' };
  }
}

function getFavoriteService(visits: ClientVisit[]): string {
  if (visits.length === 0) return 'A decouvrir';

  const counts = visits.reduce<Record<string, number>>((accumulator, visit) => {
    if (visit.status !== 'completed') return accumulator;
    accumulator[visit.service_name] = (accumulator[visit.service_name] ?? 0) + 1;
    return accumulator;
  }, {});

  const favorite = Object.entries(counts).sort((first, second) => second[1] - first[1])[0];
  return favorite?.[0] ?? 'A decouvrir';
}

function getPreferredSlot(visits: ClientVisit[]): string {
  if (visits.length === 0) return 'A definir';

  const totalHours = visits.reduce((sum, visit) => sum + new Date(visit.date).getHours(), 0);
  const averageHour = totalHours / visits.length;

  if (averageHour < 11) return 'Matin';
  if (averageHour < 15) return 'Debut aprem';
  if (averageHour < 18) return 'Apres-midi';
  return 'Fin de journee';
}

const styles = StyleSheet.create({
  content: {
    gap: SPACING.base,
  },
  heroCard: {
    gap: SPACING.base,
  },
  heroTop: {
    gap: SPACING.base,
  },
  heroTopTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
    flex: 1,
  },
  heroCopy: {
    flex: 1,
    gap: 5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  name: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.45,
  },
  memberSince: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
  },
  contact: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  inlineBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  heroActions: {
    gap: SPACING.sm,
    width: '100%',
  },
  heroActionButton: {
    width: '100%',
  },
  detailGrid: {
    gap: SPACING.base,
  },
  detailGridTablet: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  leftColumn: {
    flex: 1,
    gap: SPACING.base,
  },
  sectionCard: {
    gap: SPACING.base,
    flex: 1,
  },
  historyCard: {
    flex: 1.15,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  preferenceList: {
    gap: SPACING.base,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.base,
  },
  preferenceLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  preferenceValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  notesInput: {
    minHeight: 150,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  historyList: {
    gap: SPACING.sm,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  historyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
  },
  historyMain: {
    flex: 1,
    gap: 4,
  },
  historyService: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  historyMeta: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  historyAside: {
    alignItems: 'flex-end',
    gap: SPACING.sm,
  },
  historyPrice: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
