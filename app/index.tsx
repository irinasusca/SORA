import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

const Home: React.FC = () => {
  const router = useRouter();

  const handleEmergencyPress = async () => {
    try {
      // Request location permission and get the current location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('Location:', location);

      // Navigate to emergency page
      console.log('Navigating to Emergency...');
      router.push('/emergency');
    } catch (error) {
      console.error('Emergency Error:', error);
      Alert.alert('Error', 'An error occurred while handling the emergency.');
    }
  };


  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image style={styles.logo} source={require('../assets/images/react-logo.png')} />
        <Text style={styles.headerText}>SORA+</Text>
      </View>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.redButton]}
          onPress={async () => {
            await handleEmergencyPress();
            router.push('/emergency');
          }}
        >
          <Text style={styles.buttonText}>Emergency</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.yellowButton]}
          onPress={() => router.push('/map')}
        >
          <Text style={styles.buttonText}>Safe Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity>
          <Image style={styles.icon} source={require('../assets/images/settings.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/map')}>
          <Image style={styles.icon} source={require('../assets/images/plus.png')} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image style={styles.icon} source={require('../assets/images/user.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    flexDirection: 'row',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 300,
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  redButton: {
    backgroundColor: '#e53935',
  },
  yellowButton: {
    backgroundColor: '#fbc02d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  navBar: {
    height: 80,
    backgroundColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});
