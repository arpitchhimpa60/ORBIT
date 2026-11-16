import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import StackNavigator from './frontend/navigation/StackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <StackNavigator />
    </NavigationContainer>
  );
}
