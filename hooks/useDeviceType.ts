import { useWindowDimensions } from 'react-native';

export type DeviceType = 'phone' | 'tablet';

export function useDeviceType(): DeviceType {
  const { width } = useWindowDimensions();
  return width >= 768 ? 'tablet' : 'phone';
}
