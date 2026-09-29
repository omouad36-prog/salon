import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { CalendarDots, Users, ChartBar, GearSix } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDeviceType } from '../../hooks/useDeviceType';
import { MobileTabBar } from '../../components/layout/MobileTabBar';
import { SidebarNav } from '../../components/layout/SidebarNav';
import { COLORS, FONT_SIZES, TAB_BAR_HEIGHT, ICON_SIZES } from '../../lib/constants';

export default function TabLayout() {
  const deviceType = useDeviceType();
  const insets = useSafeAreaInsets();

  if (deviceType === 'tablet') {
    return <TabLayoutWithSidebar />;
  }

  return (
    <Tabs
      tabBar={(props) => <MobileTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarLabelStyle: {
          fontFamily: 'Satoshi-Variable',
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="agenda"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, focused }) => (
            <CalendarDots
              size={ICON_SIZES.nav}
              color={color}
              weight={focused ? 'regular' : 'light'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients',
          tabBarIcon: ({ color, focused }) => (
            <Users
              size={ICON_SIZES.nav}
              color={color}
              weight={focused ? 'regular' : 'light'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <ChartBar
              size={ICON_SIZES.nav}
              color={color}
              weight={focused ? 'regular' : 'light'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ color, focused }) => (
            <GearSix
              size={ICON_SIZES.nav}
              color={color}
              weight={focused ? 'regular' : 'light'}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function TabLayoutWithSidebar() {
  return (
    <View style={styles.tabletContainer}>
      <SidebarNav />
      <View style={styles.tabletContent}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tabs.Screen name="agenda" />
          <Tabs.Screen name="clients" />
          <Tabs.Screen name="dashboard" />
          <Tabs.Screen name="settings" />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabletContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.canvas,
  },
  tabletContent: {
    flex: 1,
    paddingVertical: 0,
    paddingRight: 0,
  },
});
