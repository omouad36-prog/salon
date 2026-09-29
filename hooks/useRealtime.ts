import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

type TableName = 'appointments' | 'waitlist' | 'message_log';

interface UseRealtimeOptions {
  table: TableName;
  filter?: string; // e.g. "salon_id=eq.xxx"
  onInsert?: (record: Record<string, unknown>) => void;
  onUpdate?: (record: Record<string, unknown>) => void;
  onDelete?: (oldRecord: Record<string, unknown>) => void;
  enabled?: boolean;
}

export function useRealtime({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeOptions) {
  useEffect(() => {
    if (!enabled) return;

    const channelName = `realtime-${table}-${filter ?? 'all'}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter ? { filter } : {}),
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload.new);
              break;
            case 'UPDATE':
              onUpdate?.(payload.new);
              break;
            case 'DELETE':
              onDelete?.(payload.old);
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, enabled]);
}
