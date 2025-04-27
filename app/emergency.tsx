import { Audio } from 'expo-av'; // For audio recording
import { Camera } from 'expo-camera'; // Use Camera for video recording
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useVideoRecording } from './VideoRecordingContext'; // Use VideoRecordingContext to access video recording
import { router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';

const Emergency = () => {
  const { videoRecording, setVideoRecording, cameraRef } = useVideoRecording();
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const startRecording = async () => {
      try {
        // Request permissions
        const { status: audioStatus } = await Audio.requestPermissionsAsync();
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();

        if (audioStatus !== 'granted' || cameraStatus !== 'granted') {
          Alert.alert('Permission Denied', 'Audio or Camera permission is required.');
          return;
        }

        // Prepare Audio
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        if (cameraRef.current) {
          setIsRecording(true);

          const audioRecordingPromise = Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
          );

          const videoRecordingPromise = cameraRef.current.recordAsync({
            quality: '1080p',
          });

          const [audioRecording, videoRecording] = await Promise.all([
            audioRecordingPromise,
            videoRecordingPromise,
          ]);

          setVideoRecording(videoRecording);
          console.log('Audio and Video recording started');
        } else {
          console.error('Camera reference is missing');
        }
      } catch (err) {
        console.error('Failed to start recording:', err);
      }
    };

    startRecording(); // start when Emergency screen loads
  }, []);

  // Function to stop the recording (audio and video)
  const stopRecording = async () => {
    try {
      // Stop video recording (audio is included in the video)
      if (cameraRef.current) {
        console.log('Stopping video recording...');
        await cameraRef.current.stopRecording();
      }

      // Save video file to gallery
      if (videoRecording?.uri) {
        const videoAsset = await MediaLibrary.createAssetAsync(videoRecording.uri);
        console.log('Video and Audio saved to gallery:', videoAsset.uri);
      }

      router.push('/'); // Go back to home screen
    } catch (error) {
      console.error('Stop Recording Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Recording</Text>

      <TouchableOpacity
        style={styles.stopButton}
        onPress={stopRecording} // Use the stopRecording function
      >
        <Text style={styles.stopText}>STOP</Text>
      </TouchableOpacity>

      <Text style={styles.text}>The recording will be sent automatically to your emergency contact list.</Text>
    </View>
  );
};

export default Emergency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#d32f2f',
  },
  text: {
    fontSize: 20,
    marginBottom: 5,
    color: '#d32f2f',
    width:'85%',
    textAlign: 'center',
  },
  stopButton: {
    width: 200,
    height: 200,
    borderRadius: 80, // Circle shape
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // subtle shadow for Android
    shadowColor: '#000', // subtle shadow for iOS
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 30,
    shadowRadius: 4,
  },
  stopText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
