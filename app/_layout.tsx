import { Slot } from 'expo-router';
import { VideoRecordingProvider } from './VideoRecordingContext'; // adjust the path if needed

export default function Layout() {
  return (
      <VideoRecordingProvider>  {/* Wrap both the providers here */}
        <Slot />
      </VideoRecordingProvider>
  );
}
