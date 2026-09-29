import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../lib/constants';

export function ScreenBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={styles.topWash} />
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbRight]} />
      <View style={[styles.orb, styles.orbBottom]} />
      <View style={[styles.arc, styles.arcLeft]} />
      <View style={[styles.arc, styles.arcRight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  topWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(255, 248, 240, 0.52)',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbTop: {
    top: -160,
    left: -120,
    width: 360,
    height: 360,
    backgroundColor: 'rgba(192, 145, 99, 0.08)',
  },
  orbRight: {
    top: 110,
    right: -110,
    width: 300,
    height: 300,
    backgroundColor: 'rgba(102, 85, 190, 0.06)',
  },
  orbBottom: {
    bottom: -210,
    left: '22%',
    width: 420,
    height: 420,
    backgroundColor: 'rgba(240, 228, 214, 0.66)',
  },
  arc: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(231, 221, 208, 0.42)',
    borderRadius: 999,
  },
  arcLeft: {
    top: 28,
    left: -140,
    width: 300,
    height: 300,
  },
  arcRight: {
    top: 18,
    right: -190,
    width: 360,
    height: 360,
  },
});
