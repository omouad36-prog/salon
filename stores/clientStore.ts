import { create } from 'zustand';
import type { Client } from '../types/client';

interface ClientState {
  clients: Client[];
  isLoading: boolean;

  setClients: (clients: Client[]) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  updateClientNotes: (id: string, notes: string) => void;
  incrementNoShow: (id: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  isLoading: true,

  setClients: (clients) => set({ clients }),
  updateClient: (id, updates) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...updates } : client
      ),
    })),
  updateClientNotes: (id, notes) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, notes } : client
      ),
    })),
  incrementNoShow: (id) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id
          ? { ...client, no_show_count: client.no_show_count + 1 }
          : client
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ clients: [], isLoading: false }),
}));
