import { useCallback, useEffect, useRef, useState } from "react";

export type SoundType =
  | "diceRoll"
  | "tokenMove"
  | "tokenCapture"
  | "tokenHome"
  | "playerWin"
  | "gameStart"
  | "turnChange"
  | "buttonClick"
  | "error";

/**
 * Custom hook for managing game sounds
 * Provides methods to play different sound effects and control volume
 */
export const useSound = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context
  useEffect(() => {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as Window &
        typeof globalThis & { webkitAudioContext: typeof AudioContext }
      ).webkitAudioContext;
    audioContextRef.current = new AudioContextClass();

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  /**
   * Generate a simple tone using Web Audio API
   * This is used when audio files are not available
   */
  const playTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (isMuted || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.value = volume;

      oscillator.start(ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + duration,
      );
      oscillator.stop(ctx.currentTime + duration);
    },
    [isMuted, volume],
  );

  /**
   * Play sound effects based on game events
   */
  const playSound = useCallback(
    (soundType: SoundType) => {
      if (isMuted) return;

      switch (soundType) {
        case "diceRoll":
          // Simulates dice rolling with multiple random tones
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              playTone(200 + Math.random() * 200, 0.05, "square");
            }, i * 30);
          }
          break;

        case "tokenMove":
          // Slide sound effect
          playTone(300, 0.1, "sine");
          setTimeout(() => playTone(250, 0.1, "sine"), 50);
          break;

        case "tokenCapture":
          // Capture sound - descending tone
          playTone(600, 0.1, "triangle");
          setTimeout(() => playTone(400, 0.1, "triangle"), 80);
          setTimeout(() => playTone(200, 0.15, "triangle"), 160);
          break;

        case "tokenHome":
          // Victory chime
          playTone(523.25, 0.15, "sine"); // C5
          setTimeout(() => playTone(659.25, 0.15, "sine"), 100); // E5
          setTimeout(() => playTone(783.99, 0.2, "sine"), 200); // G5
          break;

        case "playerWin": {
          // Victory fanfare
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 0.3, "triangle"), i * 150);
          });
          break;
        }

        case "gameStart":
          // Ascending chime
          playTone(261.63, 0.15, "sine"); // C4
          setTimeout(() => playTone(329.63, 0.15, "sine"), 100); // E4
          setTimeout(() => playTone(392, 0.2, "sine"), 200); // G4
          break;

        case "turnChange":
          // Quick notification sound
          playTone(440, 0.08, "sine");
          setTimeout(() => playTone(554.37, 0.08, "sine"), 80);
          break;

        case "buttonClick":
          // Quick click
          playTone(800, 0.05, "square");
          break;

        case "error":
          // Error buzz
          playTone(180, 0.2, "sawtooth");
          break;
      }
    },
    [isMuted, playTone],
  );

  /**
   * Toggle mute state
   */
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  /**
   * Set volume (0 to 1)
   */
  const setGameVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  }, []);

  return {
    playSound,
    isMuted,
    toggleMute,
    volume,
    setVolume: setGameVolume,
  };
};
