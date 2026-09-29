import { Image, StyleSheet, Text, View, type ImageStyle, type ViewStyle } from 'react-native';
import { getInitials, getAvatarColor } from '../../lib/utils';
import { COLORS, SHADOWS } from '../../lib/constants';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 64,
};

interface AvatarProps {
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
  size?: AvatarSize;
  style?: ViewStyle | ImageStyle;
}

export function Avatar({ firstName, lastName, imageUrl, size = 'md', style }: AvatarProps) {
  const dimension = SIZE_MAP[size];
  const fontSize = dimension * 0.4;
  const fullName = `${firstName} ${lastName}`;
  const bgColor = getAvatarColor(fullName);

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          {
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          },
          style as ImageStyle,
        ]}
        accessibilityLabel={fullName}
      />
    );
  }

  return (
    <View
      style={[
        styles.initialsContainer,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: bgColor,
        },
        style,
      ]}
      accessibilityLabel={fullName}
    >
      <Text style={[styles.initials, { fontSize }]}>
        {getInitials(firstName, lastName)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderWidth: 2,
    borderColor: COLORS.surface,
    ...SHADOWS.subtle,
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
    ...SHADOWS.subtle,
  },
  initials: {
    fontFamily: 'Satoshi-Variable',
    fontWeight: '600',
    color: COLORS.textInverse,
  },
});
