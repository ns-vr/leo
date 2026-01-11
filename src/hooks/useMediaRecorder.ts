import { useState, useRef, useCallback } from "react";

export type RecordingMode = "screen" | "webcam" | "screen-webcam";

interface UseMediaRecorderOptions {
  onRecordingComplete?: (blob: Blob) => void;
  onError?: (error: Error) => void;
}

interface UseMediaRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  recordedBlob: Blob | null;
  previewUrl: string | null;
  webcamStream: MediaStream | null;
  startRecording: (mode: RecordingMode) => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  clearRecording: () => void;
}

export function useMediaRecorder(options: UseMediaRecorderOptions = {}): UseMediaRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamsRef = useRef<MediaStream[]>([]);

  const cleanupStreams = useCallback(() => {
    streamsRef.current.forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
    streamsRef.current = [];
    setWebcamStream(null);
  }, []);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async (mode: RecordingMode) => {
    try {
      cleanupStreams();
      chunksRef.current = [];
      setRecordingTime(0);
      setRecordedBlob(null);
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      let combinedStream: MediaStream;

      if (mode === "screen") {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { 
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          },
          audio: true
        });
        streamsRef.current.push(screenStream);
        combinedStream = screenStream;

        // Handle when user stops screen share via browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          stopRecording();
        };

      } else if (mode === "webcam") {
        const webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          },
          audio: true
        });
        streamsRef.current.push(webcamStream);
        setWebcamStream(webcamStream);
        combinedStream = webcamStream;

      } else {
        // Screen + Webcam picture-in-picture style
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { 
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          },
          audio: true
        });
        streamsRef.current.push(screenStream);

        const webcam = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: "user"
          },
          audio: false // Avoid echo, use screen audio only
        });
        streamsRef.current.push(webcam);
        setWebcamStream(webcam);

        // Handle when user stops screen share
        screenStream.getVideoTracks()[0].onended = () => {
          stopRecording();
        };

        // Combine tracks
        const tracks = [
          ...screenStream.getVideoTracks(),
          ...screenStream.getAudioTracks(),
        ];
        combinedStream = new MediaStream(tracks);
      }

      // Create MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "video/mp4";

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType,
        videoBitsPerSecond: 2500000
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        options.onRecordingComplete?.(blob);
        cleanupStreams();
        stopTimer();
        setIsRecording(false);
        setIsPaused(false);
      };

      mediaRecorder.onerror = (event) => {
        const error = new Error("Recording failed");
        options.onError?.(error);
        cleanupStreams();
        stopTimer();
        setIsRecording(false);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      startTimer();

    } catch (error) {
      console.error("Failed to start recording:", error);
      cleanupStreams();
      options.onError?.(error instanceof Error ? error : new Error("Failed to start recording"));
    }
  }, [cleanupStreams, options, previewUrl, startTimer, stopTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  }, [startTimer]);

  const clearRecording = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setRecordedBlob(null);
    setPreviewUrl(null);
    setRecordingTime(0);
    chunksRef.current = [];
  }, [previewUrl]);

  return {
    isRecording,
    isPaused,
    recordingTime,
    recordedBlob,
    previewUrl,
    webcamStream,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording
  };
}
