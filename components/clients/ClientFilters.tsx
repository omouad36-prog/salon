import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useDeviceType } from '../../hooks/useDeviceType';
import { COLORS, FONT_SIZES, RADIUS, SPACING, TOUCH_TARGET } from '../../lib/constants';
import type { ClientFilter, ClientSort } from '../../types/client';

const FILTER_OPTIONS: { value: ClientFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'vip', label: 'VIP' },
  { value: 'inactive', label: 'Inactifs' },
  { value: 'recent', label: 'Recents' },
];

const SORT_OPTIONS: { value: ClientSort; label: string }[] = [
  { value: 'last_visit', label: 'Derniere visite' },
  { value: 'total_spent', label: 'Total depense' },
  { value: 'name', label: 'Nom' },
];

interface ClientFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter: ClientFilter;
  onFilterChange: (value: ClientFilter) => void;
  sort: ClientSort;
  onSortChange: (value: ClientSort) => void;
}

export function ClientFilters({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
}: ClientFiltersProps) {
  const isTablet = useDeviceType() === 'tablet';

  return (
    <View style={styles.container}>
      <View style={[styles.layout, isTablet && styles.layoutTablet]}>
        <View style={[styles.searchBlock, isTablet && styles.searchBlockTablet]}>
          <Text style={styles.label}>Recherche</Text>
          <View style={styles.searchInput}>
            <MagnifyingGlass size={17} color={COLORS.textTertiary} weight="light" />
            <TextInput
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder="Nom, telephone, email"
              placeholderTextColor={COLORS.textTertiary}
              style={styles.searchTextInput}
              accessibilityLabel="Recherche client"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.controlsGroup}>
          <FilterStrip
            label="Segments"
            options={FILTER_OPTIONS}
            selectedValue={filter}
            onSelect={(value) => onFilterChange(value as ClientFilter)}
          />

          <FilterStrip
            label="Tri"
            options={SORT_OPTIONS}
            selectedValue={sort}
            onSelect={(value) => onSortChange(value as ClientSort)}
          />
        </View>
      </View>
    </View>
  );
}

function FilterStrip({
  label,
  options,
  selectedValue,
  onSelect,
}: {
  label: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        {options.map((option) => {
          const isActive = option.value === selectedValue;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[styles.pill, isActive && styles.pillActive]}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.base,
  },
  layout: {
    gap: SPACING.base,
  },
  layoutTablet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  searchBlock: {
    gap: SPACING.sm,
  },
  searchBlockTablet: {
    flex: 1.2,
  },
  controlsGroup: {
    gap: SPACING.base,
    flex: 1,
  },
  field: {
    gap: SPACING.sm,
  },
  label: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    color: COLORS.textSecondary,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
  },
  searchInput: {
    minHeight: TOUCH_TARGET + 4,
    borderRadius: RADIUS.input,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  searchTextInput: {
    flex: 1,
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
  },
  pillsRow: {
    gap: SPACING.sm,
  },
  pill: {
    minHeight: 40,
    paddingHorizontal: SPACING.base,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: COLORS.brandPrimary,
    borderColor: COLORS.brandPrimary,
  },
  pillText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: COLORS.textInverse,
  },
});
