import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Header } from '../../components/layout/Header';
import { ManagerView } from '../../components/dashboard/ManagerView';
import { PilotView } from '../../components/dashboard/PilotView';
import { ScreenBackground } from '../../components/layout/ScreenBackground';
import {
  COLORS,
  FONT_SIZES,
  MOBILE_GUTTER,
  RADIUS,
  SCREEN_MAX_WIDTH,
  SPACING,
  TABLET_GUTTER,
  TOUCH_TARGET,
} from '../../lib/constants';
import { useDeviceType } from '../../hooks/useDeviceType';
import type { DashboardView } from '../../types/dashboard';

const TABS: { key: DashboardView; label: string }[] = [
  { key: 'pilot', label: 'Pilote' },
  { key: 'manager', label: 'Manager' },
];

export default function DashboardScreen() {
  const deviceType = useDeviceType();
  const [activeView, setActiveView] = useState<DashboardView>('pilot');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const switchView = (view: DashboardView) => {
    if (view === activeView) return;

    setActiveView(view);
    Animated.timing(slideAnim, {
      toValue: view === 'manager' ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const pilotTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });
  const managerTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });

  return (
    <View style={styles.container}>
      <ScreenBackground />
      <View
        style={[
          styles.page,
          deviceType === 'tablet' ? styles.pageTablet : styles.pagePhone,
        ]}
      >
        <Header
          title="Pulse studio"
          subtitle="Lecture operationnelle, revenus et signaux equipe"
          rightAction={
            <View style={styles.toggle}>
              {TABS.map((tab) => {
                const isActive = activeView === tab.key;
                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => switchView(tab.key)}
                    style={[styles.toggleTab, isActive && styles.toggleTabActive]}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      style={[
                        styles.toggleLabel,
                        isActive && styles.toggleLabelActive,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          }
        />

        <View style={styles.viewContainer}>
          <Animated.View
            style={[
              styles.animatedView,
              { transform: [{ translateX: pilotTranslate }] },
            ]}
            pointerEvents={activeView === 'pilot' ? 'auto' : 'none'}
          >
            <PilotView />
          </Animated.View>
          <Animated.View
            style={[
              styles.animatedView,
              styles.overlayView,
              { transform: [{ translateX: managerTranslate }] },
            ]}
            pointerEvents={activeView === 'manager' ? 'auto' : 'none'}
          >
            <ManagerView />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: SCREEN_MAX_WIDTH,
    alignSelf: 'center',
  },
  pagePhone: {
    paddingHorizontal: MOBILE_GUTTER,
  },
  pageTablet: {
    paddingHorizontal: TABLET_GUTTER,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    padding: 4,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    backgroundColor: COLORS.surfaceSoft,
  },
  toggleTab: {
    minHeight: TOUCH_TARGET,
    minWidth: 92,
    paddingHorizontal: SPACING.base,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTabActive: {
    backgroundColor: COLORS.brandPrimary,
  },
  toggleLabel: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  toggleLabelActive: {
    color: COLORS.textInverse,
  },
  viewContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  animatedView: {
    flex: 1,
  },
  overlayView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
