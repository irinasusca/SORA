import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';



const Home = () => {
  const router = useRouter();
 


  

  return (



    
    <View style={styles.container}>
      
      
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require('../assets/images/react-logo.png')}  // Optional: replace with your logo
        />
        <Text style={styles.headerText}>SORA</Text>
      </View>



 {/* Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.redButton]}>
          <Text style={styles.buttonText}>Emergency</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.yellowButton]}
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
        <TouchableOpacity onPress={() => router.push('/report')}>
          <Image style={[styles.icon , { tintColor: '#e74c3c' }]} source={require('../assets/images/flag.png')} />
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
    backgroundColor: '#141f25',
    justifyContent: 'space-between',
    
  },

  header: {
    height: 40,                  
    justifyContent: 'center',             
    alignItems: 'center',                 
    backgroundColor: '#2C3A47',         
    flexDirection: 'row'  
  },

  logo: {
    width: 25,
    height: 25,
    marginRight: 10,                     // Space between logo and text
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ecf0f1',
    
  },

  buttonContainer: {
    flex:1, 
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
    backgroundColor: '#e74c3c',
   
  },
  yellowButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#ecf0f1',
    fontSize: 32,
    fontWeight: 'bold',
   
  },
  navBar: {
    height: 80,
    backgroundColor: '#2C3A47',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: '#ecf0f1',
  },
});
