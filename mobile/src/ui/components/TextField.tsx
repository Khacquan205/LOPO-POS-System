import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
  leftIconName?: React.ComponentProps<typeof Ionicons>['name'];
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  style,
  leftIcon,
  leftIconName,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState<boolean>(secureTextEntry === true);

  const toggleSecure = () => setIsSecure((prev) => !prev);

  const renderLeftIcon = (): React.ReactNode => {
    if (leftIcon) {
      return <View style={styles.leftIconBox}>{leftIcon}</View>;
    }

    if (leftIconName) {
      return (
        <View style={styles.leftIconBox}>
          <Ionicons
            name={leftIconName}
            size={20}
            color={colors.white || '#FFFFFF'}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          error && styles.inputContainerError,
          style,
        ]}
      >
        {renderLeftIcon()}

        <TextInput
          {...props}
          key={secureTextEntry ? 'secure-input' : 'plain-input'}
          style={[
            styles.input,
            (leftIconName || leftIcon) ? styles.inputWithIcon : null,
            inputStyle,
          ]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isSecure}
          underlineColorAndroid="transparent"
          autoCorrect={secureTextEntry ? false : props.autoCorrect}
          autoCapitalize={secureTextEntry ? 'none' : props.autoCapitalize}
          autoComplete={secureTextEntry ? 'password' : props.autoComplete}
          textContentType={secureTextEntry ? 'oneTimeCode' : props.textContentType}
          keyboardType={secureTextEntry ? 'default' : props.keyboardType}
          importantForAutofill={secureTextEntry ? 'no' : 'auto'}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecure} style={styles.eyeButton}>
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    overflow: 'hidden',
    minHeight: 56,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  leftIconBox: {
    width: 56,
    height: 56,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    ...typography.body,
    color: colors.textPrimary,
  },
  inputWithIcon: {
    paddingLeft: spacing.md,
  },
  eyeButton: {
    padding: spacing.md,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});