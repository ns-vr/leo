import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Monitor, Camera, MonitorPlay, Square, Pause, Play, 
  Trash2, Check, Circle
} from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { useMediaRecorder, RecordingMode } from "@/hooks/useMediaRecorder";

interface MediaRecorderUIProps {
  onRecordingComplete: (blob: Blob, filename: string) => void;
  onCancel: () => void;
}

export function MediaRecorderUI({ onRecordingComplete, onCancel }: MediaRecorderUIProps) {
  const webcamPreviewRef = useRef<HTMLVideoElement>(null);
  
  const {
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
  } = useMediaRecorder();

  // Show webcam preview
  useEffect(() => {
    if (webcamPreviewRef.current && webcamStream) {
      webcamPreviewRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUseRecording = () => {
    if (recordedBlob) {
      const filename = `recording-${Date.now()}.webm`;
      onRecordingComplete(recordedBlob, filename);
    }
  };

  const recordingModes: { mode: RecordingMode; icon: typeof Monitor; label: string }[] = [
    { mode: "screen", icon: Monitor, label: "Screen" },
    { mode: "webcam", icon: Camera, label: "Webcam" },
    { mode: "screen-webcam", icon: MonitorPlay, label: "Screen + Cam" },
  ];

  return (
    <div className="space-y-4">
      {/* Recording Mode Selection */}
      {!isRecording && !previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <p className="text-sm font-mono text-muted-foreground text-center">
            Choose recording source
          </p>
          <div className="grid grid-cols-3 gap-2">
            {recordingModes.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => startRecording(mode)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border bg-muted hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all group"
              >
                <Icon size={28} className="text-muted-foreground group-hover:text-neon-cyan transition-colors" />
                <span className="text-xs font-mono text-muted-foreground group-hover:text-neon-cyan">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Recording UI */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          {/* Webcam Preview (if using webcam) */}
          {webcamStream && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <video
                ref={webcamPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover mirror"
              />
            </div>
          )}

          {/* Recording Indicator */}
          <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-muted">
            <motion.div
              animate={{ 
                opacity: isPaused ? 1 : [1, 0.3, 1],
                scale: isPaused ? 1 : [1, 1.1, 1]
              }}
              transition={{ 
                repeat: isPaused ? 0 : Infinity, 
                duration: 1.5 
              }}
              className="flex items-center gap-2"
            >
              <Circle 
                size={16} 
                className={`fill-current ${isPaused ? "text-yellow-500" : "text-destructive"}`} 
              />
              <span className={`text-sm font-mono ${isPaused ? "text-yellow-500" : "text-destructive"}`}>
                {isPaused ? "PAUSED" : "REC"}
              </span>
            </motion.div>
            
            <span className="text-2xl font-mono font-bold text-neon-magenta">
              {formatTime(recordingTime)}
            </span>
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="p-3 rounded-full bg-muted hover:bg-yellow-500/20 text-yellow-500 transition-colors"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
            
            <button
              onClick={stopRecording}
              className="p-4 rounded-full bg-destructive hover:bg-destructive/80 text-white transition-colors"
              title="Stop Recording"
            >
              <Square size={28} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Recording Preview */}
      {previewUrl && !isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
            <video
              src={previewUrl}
              controls
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex gap-2">
            <NeonButton
              variant="cyan"
              className="flex-1"
              onClick={clearRecording}
            >
              <Trash2 size={18} className="mr-2" />
              Discard
            </NeonButton>
            
            <NeonButton
              variant="green"
              className="flex-1"
              onClick={handleUseRecording}
            >
              <Check size={18} className="mr-2" />
              Use Recording
            </NeonButton>
          </div>
        </motion.div>
      )}

      {/* Cancel Button */}
      {!isRecording && !previewUrl && (
        <button
          onClick={onCancel}
          className="w-full py-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
