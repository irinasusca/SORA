import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Map = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map Page</Text>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
