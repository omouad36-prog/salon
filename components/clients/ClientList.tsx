import { StyleSheet, Text, View } from 'react-native';
import { UsersThree } from 'phosphor-react-native';
import { ClientRow } from './ClientRow';
import { EmptyState } from '../common/EmptyState';
import { Card } from '../common/Card';
import { COLORS, FONT_SIZES, SPACING } from '../../lib/constants';
import type { ClientWithScore } from '../../types/client';

interface ClientListProps {
  clients: ClientWithScore[];
  onClientPress: (clientId: string) => void;
  onMessagePress: (client: ClientWithScore) => void;
}

export function ClientList({
  clients,
  onClientPress,
  onMessagePress,
}: ClientListProps) {
  if (clients.length === 0) {
    return (
      <EmptyState
        icon={<UsersThree size={48} color={COLORS.borderHover} weight="light" />}
        title="Aucun profil sur cette combinaison"
        description="Ajuste les segments ou la recherche pour retrouver un client et relancer la bonne cible."
      />
    );
  }

  return (
    <View style={styles.list}>
      <Card style={styles.panel} padding={0}>
        {clients.map((client, index) => (
          <ClientRow
            key={client.id}
            client={client}
            onPress={() => onClientPress(client.id)}
            onMessagePress={() => onMessagePress(client)}
            showDivider={index < clients.length - 1}
          />
        ))}
      </Card>
      <Text style={styles.caption}>
        Les lignes privilegient valeur, recence et risque pour agir vite depuis un iPhone ou un iPad.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: SPACING.md,
  },
  panel: {
    overflow: 'hidden',
  },
  caption: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
