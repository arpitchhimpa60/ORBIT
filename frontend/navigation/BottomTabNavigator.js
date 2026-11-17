
import { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ThemeContext } from "../../context/ThemeContext";

import ChatsScreen from "../../screens/ChatsScreen";
import DiscoverScreen from "../../screens/DiscoverScreen";
import GroupsScreen from "../../screens/GroupsScreen";
import ProfileScreen from "../../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        // Active and inactive tab colors
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,

        // Bottom navigation background
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },

        // Tab label styling
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen name="Chats" component={ChatsScreen} />

      <Tab.Screen name="Discover" component={DiscoverScreen} />

      <Tab.Screen name="Groups" component={GroupsScreen} />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
