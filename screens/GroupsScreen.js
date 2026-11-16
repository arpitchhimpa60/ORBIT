
import { View, Text, StyleSheet } from 'react-native';

import OrbitalBackground from '../components/OrbitalBackground';

export default function GroupsScreen() {
  return (
    <OrbitalBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Groups</Text>
        <Text style={styles.description}>
          Your group conversations will appear here.
        </Text>
      </View>
    </OrbitalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  description: {
    color: '#D8D2FF',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
});
