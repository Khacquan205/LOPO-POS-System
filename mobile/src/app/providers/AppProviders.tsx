import React, { createContext, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  colors,
  spacing,
  typography,
  radius,
  shadow,
  fontFamily,
} from "../../ui/theme";
import { RootNavigator } from "../navigation/RootNavigator";
import { ToastProvider } from "../../ui/components";

// Theme type
interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  typography: typeof typography;
  radius: typeof radius;
  shadow: typeof shadow;
  fontFamily: typeof fontFamily;
}

const theme: Theme = {
  colors,
  spacing,
  typography,
  radius,
  shadow,
  fontFamily,
};

const ThemeContext = createContext<Theme | null>(null);

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    return theme;
  }
  return context;
};

export const AppProviders: React.FC = () => {
  return (
    <ThemeContext.Provider value={theme}>
      <SafeAreaProvider>
        <ToastProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ToastProvider>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
};
