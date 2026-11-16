
import { View, Text, StyleSheet } from 'react-native';

import OrbitalBackground from '../components/OrbitalBackground';

export default function DiscoverScreen() {
  return (
    <OrbitalBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Discover</Text>
        <Text style={styles.description}>
          Find and connect with people on ORBIT.
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
