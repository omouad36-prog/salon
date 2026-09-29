import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SHADOWS, SPACING } from '../../lib/constants';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.copyBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="secondary"
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING['2xl'],
    gap: SPACING.base,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.subtle,
  },
  copyBlock: {
    gap: SPACING.sm,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h2,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZES.body * 1.5,
    maxWidth: 380,
  },
  button: {
    marginTop: SPACING.lg,
  },
});
