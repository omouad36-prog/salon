import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZES,
  FONTS,
  SPACING,
  RADIUS,
  FONT_WEIGHTS,
} from '../../lib/constants';
import { formatPrice, formatDuration } from '../../lib/utils';
import type { Service, ServiceCategory, Staff } from '../../types/salon';
import type { StaffAvailability } from '../../types/booking';

interface ServiceStepProps {
  services: Service[];
  staffAvailability: StaffAvailability[];
  selectedService: Service | null;
  selectedStaff: Staff | null;
  onSelectService: (service: Service) => void;
  onSelectStaff: (staff: Staff | null) => void;
}

const CATEGORIES: { key: ServiceCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'homme', label: 'Homme' },
  { key: 'femme', label: 'Femme' },
  { key: 'barbe', label: 'Barbe' },
  { key: 'couleur', label: 'Couleur' },
  { key: 'soin', label: 'Soins' },
];

export function ServiceStep({
  services,
  staffAvailability,
  selectedService,
  selectedStaff,
  onSelectService,
  onSelectStaff,
}: ServiceStepProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategory | 'all'
  >('all');

  const activeServices = services.filter((s) => s.is_active);

  const filteredServices = activeServices.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory,
  );

  const availableCategories = CATEGORIES.filter(
    (cat) =>
      cat.key === 'all' ||
      activeServices.some((s) => s.category === cat.key),
  );

  return (
    <View style={styles.container}>
      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillRow}
      >
        {availableCategories.map((cat) => {
          const isActive = selectedCategory === cat.key;
          return (
            <Pressable
              key={cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              style={[styles.pill, isActive && styles.pillActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Service list */}
      <View style={styles.serviceList}>
        {filteredServices.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <Pressable
              key={service.id}
              onPress={() => onSelectService(service)}
              style={[styles.serviceRow, isSelected && styles.serviceRowSelected]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text style={styles.serviceName}>{service.name}</Text>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceDuration}>
                  {formatDuration(service.duration_minutes)}
                </Text>
                <Text style={styles.serviceDot}> · </Text>
                <Text style={styles.servicePrice}>
                  {formatPrice(service.price_cents)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Staff selection — visible once a service is picked */}
      {selectedService && (
        <View style={styles.staffSection}>
          <Text style={styles.staffTitle}>Choisir un coiffeur</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillRow}
          >
            {/* "Sans préférence" */}
            <Pressable
              onPress={() => onSelectStaff(null)}
              style={[
                styles.staffPill,
                selectedStaff === null && styles.staffPillActive,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedStaff === null }}
            >
              <Text
                style={[
                  styles.staffPillName,
                  selectedStaff === null && styles.staffPillNameActive,
                ]}
              >
                Sans préférence
              </Text>
            </Pressable>

            {staffAvailability.map(({ staff, currentDelayMinutes }) => {
              const isActive = selectedStaff?.id === staff.id;
              return (
                <Pressable
                  key={staff.id}
                  onPress={() => onSelectStaff(staff)}
                  style={[styles.staffPill, isActive && styles.staffPillActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    style={[
                      styles.staffPillName,
                      isActive && styles.staffPillNameActive,
                    ]}
                  >
                    {staff.name.split(' ')[0]}
                  </Text>
                  {currentDelayMinutes > 0 && (
                    <Text style={styles.staffDelay}>
                      ~{currentDelayMinutes}min de retard
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  pillRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  pill: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
    minHeight: 36,
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: COLORS.brandPrimary,
    borderColor: COLORS.brandPrimary,
  },
  pillText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
  },
  pillTextActive: {
    color: COLORS.textInverse,
  },
  serviceList: {
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  serviceRow: {
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDefault,
    minHeight: 60,
    justifyContent: 'center',
  },
  serviceRowSelected: {
    backgroundColor: COLORS.confirmedBackground,
    borderColor: COLORS.confirmedBorder,
  },
  serviceName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textPrimary,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  serviceDuration: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
  },
  serviceDot: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    color: COLORS.textSecondary,
  },
  servicePrice: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.body,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  staffSection: {
    gap: SPACING.md,
  },
  staffTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
  },
  staffPill: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  staffPillActive: {
    backgroundColor: COLORS.activeBackground,
    borderColor: COLORS.activeBorder,
  },
  staffPillName: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textPrimary,
  },
  staffPillNameActive: {
    color: COLORS.activeText,
  },
  staffDelay: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.delayText,
    marginTop: 2,
  },
});
