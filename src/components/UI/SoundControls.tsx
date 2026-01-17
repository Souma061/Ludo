import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./SoundControls.css";

interface SoundControlsProps {
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

const SoundControls: React.FC<SoundControlsProps> = ({
  isMuted,
  volume,
  onToggleMute,
  onVolumeChange,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (showVolumeSlider) {
      const timer = setTimeout(() => setShowVolumeSlider(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showVolumeSlider]);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return "🔇";
    if (volume < 0.3) return "🔈";
    if (volume < 0.7) return "🔉";
    return "🔊";
  };

  return (
    <div className="sound-controls">
      <motion.button
        className="sound-toggle-btn"
        onClick={onToggleMute}
        onMouseEnter={() => setShowVolumeSlider(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {getVolumeIcon()}
      </motion.button>

      {showVolumeSlider && (
        <motion.div
          className="volume-slider-container"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
            className="volume-slider"
          />
          <span className="volume-label">{Math.round(volume * 100)}%</span>
        </motion.div>
      )}
    </div>
  );
};

export default SoundControls;
