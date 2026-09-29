import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClientProfile } from '../../components/clients/ClientProfile';
import { EmptyState } from '../../components/common/EmptyState';
import { Toast } from '../../components/common/Toast';
import type { ToastAction } from '../../components/common/Toast';
import { ScreenBackground } from '../../components/layout/ScreenBackground';
import {
  COLORS,
  FONT_SIZES,
  MOBILE_GUTTER,
  SCREEN_MAX_WIDTH,
  SPACING,
  TABLET_GUTTER,
  TOUCH_TARGET,
} from '../../lib/constants';
import { getMockClientVisits } from '../../lib/mockClientVisits';
import { calculateClientScore } from '../../lib/utils';
import { useAgendaStore } from '../../stores/agendaStore';
import { useClientStore } from '../../stores/clientStore';
import { useDeviceType } from '../../hooks/useDeviceType';
import type { ClientVisit, ClientWithScore } from '../../types/client';

export default function ClientDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isTablet = useDeviceType() === 'tablet';
  const { id } = useLocalSearchParams<{ id: string }>();
  const clients = useClientStore((state) => state.clients);
  const updateClientNotes = useClientStore((state) => state.updateClientNotes);
  const incrementNoShow = useClientStore((state) => state.incrementNoShow);
  const appointments = useAgendaStore((state) => state.appointments);
  const updateAppointment = useAgendaStore((state) => state.updateAppointment);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastActions, setToastActions] = useState<ToastAction[]>([]);

  const client = useMemo<ClientWithScore | null>(() => {
    const match = clients.find((entry) => entry.id === id);
    if (!match) return null;

    return {
      ...match,
      value_score: calculateClientScore(
        match.visit_count,
        match.total_spent_cents,
        match.last_visit_at,
        match.no_show_count,
      ),
    };
  }, [clients, id]);

  const visits = useMemo<ClientVisit[]>(() => {
    if (!id) return [];

    const todayVisits = appointments
      .filter((appointment) => appointment.client_id === id)
      .map((appointment) => ({
        id: `live-${appointment.id}`,
        client_id: id,
        date: appointment.actual_start ?? appointment.scheduled_start,
        service_name: appointment.service?.name ?? 'Service',
        staff_name: appointment.staff?.name ?? 'Equipe Cizo',
        price_cents: appointment.price_cents ?? appointment.service?.price_cents ?? 0,
        status: appointment.status,
      }));

    return [...todayVisits, ...getMockClientVisits(id)].sort(
      (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime(),
    );
  }, [appointments, id]);

  const handleMessage = () => {
    if (!client) return;
    Alert.alert(
      'Message rapide',
      `La messagerie WhatsApp pour ${client.first_name} sera branchee dans le module suivant.`,
    );
  };

  const handleNoShow = useCallback(() => {
    if (!client) return;

    incrementNoShow(client.id);

    const nextAppointment = appointments
      .filter((appointment) => appointment.client_id === client.id && appointment.status === 'confirmed')
      .sort(
        (first, second) =>
          new Date(first.scheduled_start).getTime() - new Date(second.scheduled_start).getTime(),
      )[0];

    if (nextAppointment) {
      updateAppointment(nextAppointment.id, { status: 'no_show' });
    }

    setToastActions([
      {
        label: 'Offre flash',
        onPress: () => {
          // Campaign flow lands with messaging tooling.
        },
      },
      {
        label: 'Liste attente',
        onPress: () => {
          // Waitlist flow lands with messaging tooling.
        },
      },
    ]);
    setToastVisible(true);
  }, [appointments, client, incrementNoShow, updateAppointment]);

  if (!client) {
    return (
      <View style={styles.container}>
        <ScreenBackground />
        <View style={[styles.page, isTablet ? styles.pageTablet : styles.pagePhone]}>
          <View style={[styles.topBar, { paddingTop: insets.top + SPACING.sm }]}>
            <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Retour">
              <CaretLeft size={18} color={COLORS.textPrimary} weight="light" />
            </Pressable>
          </View>

          <EmptyState
            title="Client introuvable"
            description="Le profil demande n'existe plus dans les donnees de demonstration."
            actionLabel="Retour clients"
            onAction={() => router.push('/(tabs)/clients')}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <View style={[styles.page, isTablet ? styles.pageTablet : styles.pagePhone]}>
        <View style={[styles.topBar, { paddingTop: insets.top + SPACING.sm }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Retour">
            <CaretLeft size={18} color={COLORS.textPrimary} weight="light" />
          </Pressable>

          <View style={styles.topBarCopy}>
            <Text style={styles.topBarTitle}>
              {client.first_name} {client.last_name}
            </Text>
            <Text style={styles.topBarSubtitle}>Fiche relationnelle et historique salon</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ClientProfile
            client={client}
            visits={visits}
            onNotesChange={(value) => updateClientNotes(client.id, value)}
            onMessage={handleMessage}
            onNoShow={handleNoShow}
            onBook={() => router.push('/(tabs)/agenda')}
          />
        </ScrollView>

        <Toast
          message="Creneau libere"
          type="success"
          visible={toastVisible}
          onDismiss={() => setToastVisible(false)}
          duration={4000}
          actions={toastActions}
        />
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
  topBarCopy: {
    flex: 1,
    gap: 4,
  },
  topBarTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h1,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.45,
  },
  topBarSubtitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING['4xl'],
  },
});
