
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ChatsScreen from '../../screens/ChatsScreen';
import DiscoverScreen from '../../screens/DiscoverScreen';
import GroupsScreen from '../../screens/GroupsScreen';
import ProfileScreen from '../../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#BDB5E8',

        tabBarStyle: {
          backgroundColor: '#211650',
          borderTopColor: '#6258E8',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
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
