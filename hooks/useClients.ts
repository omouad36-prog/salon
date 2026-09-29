import { useMemo } from 'react';
import { useClientStore } from '../stores/clientStore';
import { calculateClientScore } from '../lib/utils';
import type { ClientFilter, ClientSort, ClientWithScore } from '../types/client';

interface UseClientsOptions {
  filter: ClientFilter;
  sort: ClientSort;
  searchQuery: string;
}

export function useClients({ filter, sort, searchQuery }: UseClientsOptions) {
  const clients = useClientStore((s) => s.clients);
  const isLoading = useClientStore((s) => s.isLoading);

  const clientsWithScore = useMemo<ClientWithScore[]>(
    () =>
      clients.map((client) => ({
        ...client,
        value_score: calculateClientScore(
          client.visit_count,
          client.total_spent_cents,
          client.last_visit_at,
          client.no_show_count
        ),
      })),
    [clients]
  );

  const filteredClients = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return clientsWithScore
      .filter((client) => {
        if (filter === 'vip' && !client.is_vip) return false;
        if (filter === 'inactive') {
          if (!client.last_visit_at) return true;
          const daysSinceVisit =
            (Date.now() - new Date(client.last_visit_at).getTime()) /
            (1000 * 60 * 60 * 24);
          if (daysSinceVisit < 21) return false;
        }
        if (filter === 'recent') {
          if (!client.last_visit_at) return false;
          const daysSinceVisit =
            (Date.now() - new Date(client.last_visit_at).getTime()) /
            (1000 * 60 * 60 * 24);
          if (daysSinceVisit > 7) return false;
        }

        if (!normalizedQuery) return true;

        const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
        const email = client.email?.toLowerCase() ?? '';
        return (
          fullName.includes(normalizedQuery) ||
          client.phone.includes(normalizedQuery) ||
          email.includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        if (sort === 'name') {
          return `${a.last_name} ${a.first_name}`.localeCompare(
            `${b.last_name} ${b.first_name}`,
            'fr-FR'
          );
        }

        if (sort === 'total_spent') {
          return b.total_spent_cents - a.total_spent_cents;
        }

        // Default: sort by last visit (most recent first)
        const aTime = a.last_visit_at ? new Date(a.last_visit_at).getTime() : 0;
        const bTime = b.last_visit_at ? new Date(b.last_visit_at).getTime() : 0;
        return bTime - aTime;
      });
  }, [clientsWithScore, filter, searchQuery, sort]);

  return {
    clients: filteredClients,
    totalCount: clients.length,
    isLoading,
  };
}
