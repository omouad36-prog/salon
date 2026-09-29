import { View, Text, StyleSheet } from 'react-native';
import { Lightbulb } from 'phosphor-react-native';
import { COLORS, FONT_SIZES, SPACING, RADIUS, ICON_SIZES } from '../../lib/constants';

interface CizoInsightProps {
  text: string;
}

export function CizoInsight({ text }: CizoInsightProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Lightbulb size={ICON_SIZES.card} color={COLORS.freeSlotText} weight="regular" />
        <Text style={styles.title}>Cizo Insight</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.freeSlotBackground,
    borderWidth: 1,
    borderColor: COLORS.freeSlotBorder,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.h3,
    fontWeight: '600',
    color: COLORS.freeSlotText,
  },
  text: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: '400',
    color: COLORS.textPrimary,
    lineHeight: FONT_SIZES.body * 1.5,
    maxWidth: 320,
  },
});
