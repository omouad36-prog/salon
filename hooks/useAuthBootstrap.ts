import { useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_CLIENTS, MOCK_SALON, MOCK_STAFF, getMockAppointments } from '../lib/mockData';
import { useAuthStore } from '../stores/authStore';
import { useSalonStore } from '../stores/salonStore';
import { useAgendaStore } from '../stores/agendaStore';
import { useClientStore } from '../stores/clientStore';

function bootstrapDemoState() {
  const authStore = useAuthStore.getState();
  const salonStore = useSalonStore.getState();
  const agendaStore = useAgendaStore.getState();
  const clientStore = useClientStore.getState();

  authStore.setSession(null);
  authStore.setSetupError(null);
  authStore.setConfigured(false);

  salonStore.setSalon(MOCK_SALON);
  salonStore.setCurrentStaff(MOCK_STAFF[0]);
  salonStore.setAllStaff(MOCK_STAFF);
  clientStore.setClients(MOCK_CLIENTS);
  agendaStore.setAppointments(getMockAppointments());

  salonStore.setLoading(false);
  agendaStore.setLoading(false);
  clientStore.setLoading(false);
  authStore.setLoading(false);
}

async function bootstrapSession(session: Session | null) {
  const authStore = useAuthStore.getState();
  const salonStore = useSalonStore.getState();
  const agendaStore = useAgendaStore.getState();
  const clientStore = useClientStore.getState();

  authStore.setSession(session);
  authStore.setSetupError(null);

  if (!session) {
    salonStore.reset();
    agendaStore.reset();
    clientStore.reset();
    authStore.setLoading(false);
    return;
  }

  authStore.setLoading(true);
  salonStore.setLoading(true);
  agendaStore.setLoading(true);
  clientStore.setLoading(true);

  try {
    const { data: staffRecord, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single();

    if (staffError) {
      throw staffError;
    }

    if (!staffRecord) {
      salonStore.reset();
      agendaStore.reset();
      clientStore.reset();
      authStore.setSetupError(
        'Ton compte existe, mais aucun profil staff n’est encore rattaché dans Supabase.'
      );
      authStore.setLoading(false);
      return;
    }

    const [
      salonResult,
      staffResult,
      clientsResult,
      appointmentsResult,
    ] = await Promise.all([
      supabase.from('salons').select('*').eq('id', staffRecord.salon_id).single(),
      supabase.from('staff').select('*').eq('salon_id', staffRecord.salon_id).eq('is_active', true),
      supabase.from('clients').select('*').eq('salon_id', staffRecord.salon_id).order('created_at', { ascending: false }),
      supabase
        .from('appointments')
        .select(`
          *,
          client:clients(*),
          staff:staff(*),
          service:services(*)
        `)
        .eq('salon_id', staffRecord.salon_id)
        .order('scheduled_start', { ascending: true }),
    ]);

    if (salonResult.error) throw salonResult.error;
    if (staffResult.error) throw staffResult.error;
    if (clientsResult.error) throw clientsResult.error;
    if (appointmentsResult.error) throw appointmentsResult.error;

    if (salonResult.data) {
      salonStore.setSalon(salonResult.data);
    }

    salonStore.setCurrentStaff(staffRecord);
    salonStore.setAllStaff(staffResult.data ?? []);
    clientStore.setClients(clientsResult.data ?? []);
    agendaStore.setAppointments(appointmentsResult.data ?? []);
  } catch (error) {
    console.error('Error bootstrapping auth session:', error);
    salonStore.reset();
    agendaStore.reset();
    clientStore.reset();
    authStore.setSetupError(
      'Connexion OK, mais le chargement des donnees du salon a echoue.'
    );
  } finally {
    salonStore.setLoading(false);
    agendaStore.setLoading(false);
    clientStore.setLoading(false);
    authStore.setLoading(false);
  }
}

export function useAuthBootstrap() {
  useEffect(() => {
    useAuthStore.getState().setConfigured(isSupabaseConfigured);

    if (!isSupabaseConfigured) {
      bootstrapDemoState();
      return;
    }

    let isMounted = true;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      void bootstrapSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      void bootstrapSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
}
