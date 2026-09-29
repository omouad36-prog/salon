// CIZO Design System Constants
// Source of truth: DESIGN_SYSTEM.md

import { Platform } from 'react-native';

export const COLORS = {
  // Foundation
  canvas: '#F7F4EF',
  canvasDeep: '#EFE6DA',
  surface: 'rgba(255, 253, 249, 0.94)',
  surfaceElevated: 'rgba(255, 250, 244, 0.82)',
  surfaceSoft: 'rgba(249, 244, 237, 0.9)',
  surfaceMuted: '#F4EBE0',
  sidebarNav: 'rgba(255, 252, 247, 0.72)',
  overlay: 'rgba(34, 25, 17, 0.12)',

  // Ink
  textPrimary: '#221911',
  textSecondary: '#716659',
  textTertiary: '#A19385',
  textInverse: '#FFFFFF',

  // Borders
  borderDefault: '#E7DDD0',
  borderHover: '#DCCFBE',
  borderFocus: '#221911',

  // Brand
  brandPrimary: '#221911',
  brandHover: '#3A2B22',
  brandAccent: '#C09163',
  brandAccentSoft: '#F7EBDD',
  brandAccentText: '#8F6438',
  whatsappGreen: '#25D366',
  whatsappDark: '#128C7E',
  whatsappBubble: '#005C4B',

  // Semantic tones
  activeBackground: 'rgba(233, 229, 251, 0.82)',
  activeText: '#6655BE',
  activeBorder: '#D9D2F5',

  confirmedBackground: 'rgba(234, 244, 236, 0.86)',
  confirmedText: '#2F6A46',
  confirmedBorder: '#CAE4D1',

  delayBackground: 'rgba(255, 242, 214, 0.88)',
  delayText: '#9A6624',
  delayBorder: '#F0D28A',

  errorBackground: 'rgba(249, 232, 229, 0.9)',
  errorText: '#9B4A3A',
  errorBorder: '#EBC7BF',

  completedBackground: 'rgba(243, 238, 232, 0.92)',
  completedText: '#897B6E',
  completedBorder: '#E4D9CC',

  freeSlotBackground: 'rgba(255, 247, 231, 0.88)',
  freeSlotText: '#9E6E30',
  freeSlotBorder: '#F0D59C',

  // Utility accents
  skyBackground: 'rgba(232, 241, 251, 0.88)',
  skyText: '#3A6088',
  roseBackground: 'rgba(251, 233, 238, 0.9)',
  roseText: '#A04A69',
  sageBackground: 'rgba(235, 241, 229, 0.9)',
  sageText: '#4F6B46',

  // Timeline
  timelineNow: '#C55A4E',
} as const;

export const AVATAR_COLORS = [
  '#8F7AE8',
  '#E47C92',
  '#D9A45B',
  '#6E9C77',
  '#7196C9',
  '#C67C68',
  '#5FA0A0',
  '#8C6EB2',
] as const;

export const FONTS = {
  satoshi: 'Satoshi-Variable',
  mono: Platform.select({
    ios: 'SF Mono',
    android: 'monospace',
    default: 'monospace',
  }) as string,
  system: '-apple-system, BlinkMacSystemFont, sans-serif',
} as const;

export const FONT_SIZES = {
  display: 40,
  h1: 30,
  h2: 22,
  h3: 17,
  body: 15,
  bodySmall: 13,
  caption: 12,
  label: 11,
  tabLabel: 10,
} as const;

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
};

export const LINE_HEIGHTS = {
  display: 1.0,
  h1: 1.2,
  h2: 1.3,
  h3: 1.4,
  body: 1.5,
  bodySmall: 1.5,
  caption: 1.4,
  label: 1.0,
} as const;

export const LETTER_SPACINGS = {
  display: -1.0,
  h1: -0.45,
  h2: -0.22,
  h3: 0,
  body: 0,
  bodySmall: 0,
  caption: 0.12,
  label: 0.22,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const RADIUS = {
  pill: 12,
  card: 26,
  button: 16,
  avatar: 9999,
  bottomSheet: 28,
  input: 18,
  checkbox: 6,
} as const;

export const SHADOWS = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.045,
    shadowRadius: 24,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.09,
    shadowRadius: 40,
    elevation: 6,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.14,
    shadowRadius: 48,
    elevation: 10,
  },
} as const;

export const ICON_SIZES = {
  nav: 22,
  card: 18,
  inline: 16,
  small: 14,
  hero: 24,
} as const;

export const ANIMATION = {
  fast: 150,
  standard: 250,
  slow: 400,
} as const;

export const TOUCH_TARGET = 44;

export const TAB_BAR_HEIGHT = 86;

export const SIDEBAR_WIDTH_COLLAPSED = 92;
export const SIDEBAR_WIDTH_EXPANDED = 280;

export const MOBILE_GUTTER = 16;
export const TABLET_GUTTER = 24;
export const SCREEN_MAX_WIDTH = 1480;
export const WIDE_PANEL_MAX_WIDTH = 1640;
export const RAIL_CARD_WIDTH = 320;
export const BOOKING_MAX_WIDTH = 680;
