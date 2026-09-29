import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { COLORS, FONT_SIZES, RADIUS, SHADOWS, SPACING, TOUCH_TARGET } from '../../lib/constants';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, ...textInputProps }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...textInputProps}
        onFocus={(e) => {
          setIsFocused(true);
          textInputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          textInputProps.onBlur?.(e);
        }}
        placeholderTextColor={COLORS.textTertiary}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
        accessibilityLabel={label}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!error && helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.bodySmall,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  input: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.body,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: RADIUS.input,
    paddingHorizontal: 16,
    paddingVertical: SPACING.md,
    minHeight: TOUCH_TARGET,
    ...SHADOWS.subtle,
  },
  inputFocused: {
    borderColor: COLORS.borderFocus,
    shadowOpacity: 0.08,
  },
  inputError: {
    borderColor: COLORS.errorText,
    backgroundColor: COLORS.errorBackground,
  },
  errorText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.errorText,
  },
  helperText: {
    fontFamily: 'Satoshi-Variable',
    fontSize: FONT_SIZES.caption,
    color: COLORS.textSecondary,
  },
});
