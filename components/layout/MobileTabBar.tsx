import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarDots, ChartBar, GearSix, Users } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SHADOWS, SPACING, TAB_BAR_HEIGHT } from '../../lib/constants';

const ICONS = {
  agenda: CalendarDots,
  clients: Users,
  dashboard: ChartBar,
  settings: GearSix,
} as const;

export function MobileTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const isFocused = state.index === index;
          const Icon = ICONS[route.name as keyof typeof ICONS] ?? CalendarDots;
          const label =
            typeof descriptor.options.tabBarLabel === 'string'
              ? descriptor.options.tabBarLabel
              : descriptor.options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={descriptor.options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.item, isFocused && styles.itemActive]}
            >
              <Icon
                size={20}
                color={isFocused ? COLORS.textInverse : COLORS.textSecondary}
                weight={isFocused ? 'fill' : 'light'}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    backgroundColor: 'transparent',
  },
  inner: {
    minHeight: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.sidebarNav,
    ...SHADOWS.medium,
  },
  item: {
    flex: 1,
    minHeight: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  itemActive: {
    backgroundColor: COLORS.brandPrimary,
    ...SHADOWS.subtle,
  },
  label: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  labelActive: {
    color: COLORS.textInverse,
  },
});
