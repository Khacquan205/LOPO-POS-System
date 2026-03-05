import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AppProviders } from './src/app/providers/AppProviders';
import { useAuthStore } from './src/store/auth.store';
import { useAppStore } from './src/store/app.store';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App(): React.JSX.Element | null {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare(): Promise<void> {
      try {
        const hydrateAuth = useAuthStore.getState().hydrateAuth;
        const hydrateLaunchFlag = useAppStore.getState().hydrateLaunchFlag;

        await Promise.all([hydrateAuth(), hydrateLaunchFlag()]);

        // Artificial delay to show splash (optional)
        await new Promise<void>((resolve) => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn('Error during app initialization:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <AppProviders />
      <StatusBar style="auto" />
    </View>
  );
}
