import React, { createContext, useState, useContext, ReactNode } from 'react';

// Type for Video Recording
type VideoRecording = {
  uri: string;
};

// Define Context Interface
interface VideoRecordingContextProps {
  videoRecording: VideoRecording | null;
  setVideoRecording: (recording: VideoRecording | null) => void;
  cameraRef: React.MutableRefObject<any | null>; // `any` to remove CameraType dependency
}

// Create Context
const VideoRecordingContext = createContext<VideoRecordingContextProps | undefined>(undefined);

// VideoRecordingProvider component
export const VideoRecordingProvider = ({ children }: { children: ReactNode }) => {
  const [videoRecording, setVideoRecording] = useState<VideoRecording | null>(null);
  const cameraRef = React.useRef<any>(null); // `any` type since Camera is used elsewhere

  return (
    <VideoRecordingContext.Provider value={{ videoRecording, setVideoRecording, cameraRef }}>
      {children}
    </VideoRecordingContext.Provider>
  );
};

// Custom hook to access context
export const useVideoRecording = () => {
  const context = useContext(VideoRecordingContext);
  if (!context) {
    throw new Error('useVideoRecording must be used within a VideoRecordingProvider');
  }
  return context;
};
