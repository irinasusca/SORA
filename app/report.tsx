import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { collection, addDoc } from '../node_modules/firebase/firestore';  // Firestore imports
import { db } from '../firebase';

const ReportIncident = () => {
  const [type, setType] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('#fff');
  const [description, setDescription] = useState<string>('');
  const [incidentModalVisible, setIncidentModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');
  const router = useRouter();

  const apiKey = 'AIzaSyBGpAZJoCkzjpSToJSVMkrUxqmbjp9gxHg'; // Replace with your actual API key

  const incidentTypes = [
    { label: 'Assault', value: 'Assault', color: '#dc6900' },
    { label: 'Theft', value: 'Theft', color: '#eb8c00' },
    { label: 'Harassment', value: 'Harassment', color: '#e0301e' },
    { label: 'Sexual Assault', value: 'Sexual Assault', color: '#a32020' },
    { label: 'Fraud', value: 'Fraud', color: '#602320' },
  ];

  const handleSubmit = async () => {
    if (!type || !description || !selectedLocation) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    // Create the incident report object
    const incident = {
      type,                // The type of the incident
      description,         // Description of the incident
      location: {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude
      },                  // Store location as an object
      timestamp: new Date().toISOString(),  // Include timestamp for the report
    };
  
    try {
      // Add the report to Firestore under the "reports" collection
      const docRef = await addDoc(collection(db, 'reports'), incident);
      Alert.alert('Success', 'Your incident has been successfully reported.');
      router.push('/');  // Navigate back to the home page after successful submission
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', 'There was an issue reporting your incident.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* Incident Type Button */}
        <TouchableOpacity 
          style={[styles.dropdownButton, { backgroundColor: type ? selectedColor : '#52656c' }]} 
          onPress={() => setIncidentModalVisible(true)}
        >
          <Text style={[styles.dropdownButtonText, { color: '#ecf0f1' }]}>
            {type ? type : 'Select incident type'}
          </Text>
        </TouchableOpacity>

        {/* Incident Modal */}
        <Modal transparent={true} visible={incidentModalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIncidentModalVisible(false)}>
                <Image source={require('../assets/images/cancel.png')} style={styles.cancelIcon} />
              </TouchableOpacity>
              <FlatList
                data={incidentTypes}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.dropdownItem, { backgroundColor: item.color }]}
                    onPress={() => {
                      setType(item.label);
                      setSelectedColor(item.color);
                      setIncidentModalVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Description Input */}
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#ecf0f1"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
        />

        {/* Location Picker Button */}
        <TouchableOpacity 
          style={styles.locationPickerButton} 
          onPress={() => setLocationModalVisible(true)}
        >
          <Text style={styles.locationPickerText}>
            {selectedLocationName || "Select location..."}
          </Text>
        </TouchableOpacity>

        {/* Location Modal */}
        <Modal transparent={true} visible={locationModalVisible} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.locationModalContent}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setLocationModalVisible(false)}>
                <Image source={require('../assets/images/cancel.png')} style={styles.cancelIcon} />
              </TouchableOpacity>

              <GooglePlacesAutocomplete
                placeholder="Search for location..."
                onPress={(data, details = null) => {
                  if (details) {
                    const { lat, lng } = details.geometry.location;
                    setSelectedLocation({ latitude: lat, longitude: lng });
                    setSelectedLocationName(data.description);
                    setLocationModalVisible(false);
                  }
                }}
                query={{
                  key: apiKey,
                  language: 'en',
                  components: 'country:ro',
                }}
                fetchDetails={true}
                styles={{
                  container: {
                    width: '100%',
                    backgroundColor: '#fff',
                    paddingTop: 50,
                    borderRadius: 10,
                  },
                  textInput: {
                    height: 50,
                    borderColor: '#52656c',
                    borderWidth: 2,
                    borderRadius: 8,
                    paddingLeft: 10,
                    backgroundColor: '#fff',
                    fontSize: 18,
                  },
                  listView: {
                    backgroundColor: '#fff',
                  },
                }}
              />
            </View>
          </View>
        </Modal>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
          <Image source={require('../assets/images/arrow.png')} style={styles.submitButtonIcon} />
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image style={styles.icon} source={require('../assets/images/home.png')} />
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

export default ReportIncident;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#141f25',
  },
  formContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButton: {
    width: '100%',
    height: 50,
    borderColor: '#52656c',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: '#52656c',
  },
  dropdownButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    minHeight: 50,
    maxHeight: 150,
    fontSize: 20,
    width: '100%',
    borderColor: '#52656c',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#2C3A47',
    color: '#ecf0f1',
  },
  locationPickerButton: {
    width: '100%',
    height: 50,
    borderColor: '#52656c',
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: 10,
    backgroundColor: '#2C3A47',
    marginBottom: 20,
  },
  locationPickerText: {
    fontSize: 20,
    color: '#ecf0f1',
    textAlign: 'left',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52656c',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 50,
    width: '100%',
  },
  submitButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginRight: 10,
  },
  submitButtonIcon: {
    width: 28,
    height: 28,
    tintColor: '#ecf0f1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationModalContent: {
    width: '90%',
    height: '70%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignSelf: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dropdownItem: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: '#2C3A47',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10,
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: '#ecf0f1',
  },
  cancelButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  cancelIcon: {
    width: 30,
    height: 30,
  },
});
