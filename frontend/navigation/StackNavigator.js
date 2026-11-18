import { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

import WelcomeScreen from "../../screens/WelcomeScreen";
import LoginScreen from "../../screens/LoginScreen";
import RegisterScreen from "../../screens/RegisterScreen";

import BottomTabNavigator from "./BottomTabNavigator";

import CreateGroupScreen from "../../screens/CreateGroupScreen";
import EditProfileScreen from "../../screens/EditProfileScreen";
import ChangePasswordScreen from "../../screens/ChangePasswordScreen";
import PrivateChatScreen from "../../screens/PrivateChatScreen";
import GroupChatScreen from "../../screens/GroupChatScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { user, isCheckingAuth } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // Wait until the saved token has been checked
  if (isCheckingAuth) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.highlight} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

          <Stack.Screen name="PrivateChat" component={PrivateChatScreen} />

          <Stack.Screen name="GroupChat" component={GroupChatScreen} />

          <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />

          <Stack.Screen name="EditProfile" component={EditProfileScreen} />

          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />

          <Stack.Screen name="Login" component={LoginScreen} />

          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
