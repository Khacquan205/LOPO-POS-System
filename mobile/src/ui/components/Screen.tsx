import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edge } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safe?: boolean;
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  edges?: Edge[];
  contentContainerStyle?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  safe = true,
  scroll = false,
  keyboardAvoiding = false,
  edges = ['top', 'bottom'],
  contentContainerStyle,
}) => {
  const Container = safe ? SafeAreaView : View;

  const content = scroll ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  const wrappedContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <Container style={[styles.container, style]} edges={edges}>
      {wrappedContent}
    </Container>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.screenPadding,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: -spacing.screenPadding,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    flexGrow: 1,
  },
});
