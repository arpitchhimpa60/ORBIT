
import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import StackNavigator from "./frontend/navigation/StackNavigator";
import ThemeProvider, { ThemeContext } from "./context/ThemeContext";

function AppContent() {
  const { themeName } = useContext(ThemeContext);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style={themeName === "Dark" ? "light" : "dark"} />
        <StackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
