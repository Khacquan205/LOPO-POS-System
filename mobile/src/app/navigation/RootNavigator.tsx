import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import { IntroScreen } from "../../features/intro/screens/IntroScreen";
import { AuthStack } from "./AuthStack";
import { MainStack } from "./MainStack";
import { useAppStore } from "../../store/app.store";
import { useAuthStore } from "../../store/auth.store";
import { useStoreStore } from "../../features/home/store/store.store";
import { colors } from "../../ui/theme";
import type { RootStackParamList } from "../../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { hasLaunched, isHydrated, hydrateLaunchFlag } = useAppStore();
  const { isAuthenticated, hydrateAuth } = useAuthStore();
  const fetchMyStores = useStoreStore((s) => s.fetchMyStores);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async (): Promise<void> => {
      await Promise.all([hydrateLaunchFlag(), hydrateAuth()]);
      setIsReady(true);
    };
    init();
  }, []);

  // Fetch stores once auth is ready and user is authenticated
  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchMyStores();
    }
  }, [isReady, isAuthenticated]);

  if (!isHydrated || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <Stack.Navigator id="RootAuth" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainStack} />
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator id="RootUnauth" screenOptions={{ headerShown: false }}>
      {!hasLaunched && <Stack.Screen name="Intro" component={IntroScreen} />}
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Main" component={MainStack} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
