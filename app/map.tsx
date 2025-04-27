import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert, Text } from 'react-native';
import MapView, { Marker, Polyline, Region, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useRouter } from 'expo-router';
import 'react-native-get-random-values';
import { collection, getDocs } from '../node_modules/firebase/firestore';
import { db } from '../firebase';


interface Incident {
  location: {
    latitude: number;
    longitude: number;
  };
  type: string;
  timestamp: number;
  description: string;
}

const Map = () => {
  const router = useRouter();

  const [region, setRegion] = useState<Region>({
    latitude: 46.7712,
    longitude: 23.6236,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [polylineCoords, setPolylineCoords] = useState<{ latitude: number; longitude: number }[]>([]);

  const apiKey = 'AIzaSyBGpAZJoCkzjpSToJSVMkrUxqmbjp9gxHg'; // your Google Maps API key

  useEffect(() => {
    requestLocation();
    loadIncidents();
  }, []);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Using default location in Cluj-Napoca.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const loadIncidents = async () => {
    try {
      const reportsRef = collection(db, 'reports');
      const querySnapshot = await getDocs(reportsRef);
      const fetchedIncidents: Incident[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const incident: Incident = {
          location: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          },
          type: data.type,
          timestamp: data.timestamp,
          description: data.description || '', // <-- grab description
        };
        fetchedIncidents.push(incident);
      });

      setIncidents(fetchedIncidents);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handlePlaceSelect = async (data: any, details: any) => {
    if (!details) return;
  
    const { lat, lng } = details.geometry.location;
    setDestination({ latitude: lat, longitude: lng });
  
    try {
      const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${region.latitude},${region.longitude}&destination=${lat},${lng}&avoid=local_roads&key=${apiKey}`;
      const directionsResponse = await axios.get(directionsUrl);
  
      if (directionsResponse.data.routes.length) {
        const points = decodePolyline(directionsResponse.data.routes[0].overview_polyline.points);
        setPolylineCoords(points);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const decodePolyline = (t: string) => {
    let points = [];
    let index = 0, len = t.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  return (
    <View style={styles.container}>
      {/* Google Places Autocomplete */}
      <GooglePlacesAutocomplete
        placeholder="Search for a location..."
        onPress={handlePlaceSelect}
        query={{
          key: apiKey,
          language: 'en',
          components: 'country:ro',
        }}
        fetchDetails={true}
        styles={{
          container: {
            position: 'absolute',
            top: 10,
            width: '80%',
            alignSelf: 'left',
            left: 10,
            zIndex: 100,

          },
          textInput: {
            height: 41.5,
            borderRadius: 3,
            paddingHorizontal: 10,
            fontSize: 16,
            backgroundColor: '#fff',
            elevation: 25,
          },
          listView: {
            backgroundColor: 'white',
            zIndex: 100,
            elevation: 5,
          },
        }}
      />

      {/* Map */}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {incidents.map((incident, index) => (
  <Marker
    key={index}
    coordinate={incident.location}
    pinColor={
      incident.type === 'Assault' ? '#dc6900' :
      incident.type === 'Theft' ? '#eb8c00' :
      incident.type === 'Harassment' ? '#e0301e' :
      incident.type === 'Sexual Assault' ? '#a32020' :
      incident.type === 'Fraud' ? '#602320' :
      'blue'
    }
    onPress={() => {
      Alert.alert(
        `Incident Details: ${incident.type}`,
        `Description: ${incident.description || 'No description available.'}\n` +
        `Reported: ${new Date(incident.timestamp).toLocaleString()}`
      );
    }}
  />
))}





        {polylineCoords.length > 0 && (
          <Polyline
            coordinates={polylineCoords}
            strokeColor="#007AFF"
            strokeWidth={5}
          />
        )}
      </MapView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image style={styles.icon} source={require('../assets/images/home.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('./report')}>
          <Image style={[styles.icon , { tintColor: '#e74c3c' }]} source={require('../assets/images/flag.png')} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image style={styles.icon} source={require('../assets/images/user.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  map: {
    flex: 1,
    zIndex: 1,
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
});
