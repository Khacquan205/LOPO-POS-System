import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { colors, radius, spacing } from '../../../ui/theme';

const OTP_LENGTH = 6;

interface OtpInputProps {
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({ value = '', onChange, error }) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Convert string value to array
  const otpArray = value.split('').slice(0, OTP_LENGTH);
  while (otpArray.length < OTP_LENGTH) {
    otpArray.push('');
  }

  // Focus first empty input on mount
  useEffect(() => {
    const firstEmptyIndex = otpArray.findIndex((d) => d === '');
    const idx = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
    inputRefs.current[idx]?.focus();
  }, []);

  const handleChange = (text: string, index: number): void => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);

    const newOtp = [...otpArray];
    newOtp[index] = digit;
    const newValue = newOtp.join('');
    onChange(newValue);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ): void => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otpArray[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otpArray];
        newOtp[index - 1] = '';
        onChange(newOtp.join(''));
      }
    }
  };

  return (
    <View style={styles.container}>
      {otpArray.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={[
            styles.input,
            digit ? styles.inputFilled : null,
            error ? styles.inputError : null,
          ]}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSecondary,
  },
  inputError: {
    borderColor: colors.error,
  },
});
