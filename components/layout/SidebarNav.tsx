import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarDots, Users, ChartBar, GearSix } from 'phosphor-react-native';
import { Avatar } from '../common/Avatar';
import { useSalonStore } from '../../stores/salonStore';
import { COLORS, SHADOWS, SIDEBAR_WIDTH_COLLAPSED, SPACING } from '../../lib/constants';

const NAV_ITEMS = [
  { href: '/(tabs)/agenda', label: 'Agenda', icon: CalendarDots },
  { href: '/(tabs)/clients', label: 'Clients', icon: Users },
  { href: '/(tabs)/dashboard', label: 'Dashboard', icon: ChartBar },
  { href: '/(tabs)/settings', label: 'Réglages', icon: GearSix },
] as const;

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const currentStaff = useSalonStore((state) => state.currentStaff);

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.base }]}>
      <View style={styles.rail}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoLetter}>C</Text>
        </View>

        <View style={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.includes(item.href.split('/').pop()!);
            const Icon = item.icon;

            return (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href as never)}
                style={[styles.navItem, isActive && styles.navItemActive]}
                accessibilityLabel={item.label}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Icon
                  size={22}
                  color={isActive ? COLORS.textInverse : COLORS.textSecondary}
                  weight={isActive ? 'fill' : 'light'}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Avatar
            firstName={currentStaff?.name.split(' ')[0] ?? 'Ci'}
            lastName={currentStaff?.name.split(' ').slice(1).join(' ') ?? 'zo'}
            size="md"
            style={styles.profileAvatar}
          />
          <Text style={styles.footerLabel}>Cz</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIDEBAR_WIDTH_COLLAPSED,
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  rail: {
    flex: 1,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.sidebarNav,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.base,
    ...SHADOWS.subtle,
  },
  logoBadge: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: COLORS.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textInverse,
  },
  nav: {
    flex: 1,
    gap: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceElevated,
  },
  navItemActive: {
    backgroundColor: COLORS.brandPrimary,
    borderColor: COLORS.brandPrimary,
    ...SHADOWS.subtle,
  },
  footer: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  footerLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
  },
  profileAvatar: {
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
});
