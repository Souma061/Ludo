import { Howl } from "howler";
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
 * Professional sound system with catchy game sounds
 */
export const useSound = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const soundsRef = useRef<Map<SoundType, Howl>>(new Map());

  // Initialize all sounds with catchy effects
  useEffect(() => {
    const createWavFile = (samples: Float32Array, sampleRate: number) => {
      const numChannels = 1;
      const bitsPerSample = 16;
      const bytesPerSample = bitsPerSample / 8;
      const blockAlign = numChannels * bytesPerSample;
      const byteRate = sampleRate * blockAlign;
      const dataSize = samples.length * bytesPerSample;
      const buffer = new ArrayBuffer(44 + dataSize);
      const view = new DataView(buffer);

      // WAV header
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, "RIFF");
      view.setUint32(4, 36 + dataSize, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, byteRate, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitsPerSample, true);
      writeString(36, "data");
      view.setUint32(40, dataSize, true);

      // Write audio data
      let offset = 44;
      for (let i = 0; i < samples.length; i++) {
        const sample = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, sample * 0x7fff, true);
        offset += 2;
      }

      return new Uint8Array(buffer);
    };

    const createSound = (samples: Float32Array) => {
      const wavData = createWavFile(samples, 44100);
      return `data:audio/wav;base64,${btoa(String.fromCharCode(...wavData))}`;
    };

    const sounds = new Map<SoundType, Howl>();

    // DICE ROLL - Rattling effect
    const dice = new Float32Array(6615);
    for (let i = 0; i < dice.length; i++) {
      const t = i / 44100;
      const freq = 200 + Math.random() * 400;
      dice[i] = Math.sin(2 * Math.PI * freq * t) * 0.3 * (1 - t / 0.15);
    }
    sounds.set(
      "diceRoll",
      new Howl({ src: [createSound(dice)], volume: 0.35 }),
    );

    // TOKEN MOVE - Slide whistle
    const move = new Float32Array(4410);
    for (let i = 0; i < move.length; i++) {
      const t = i / 44100;
      const freq = 300 + (t / 0.1) * 200;
      move[i] = Math.sin(2 * Math.PI * freq * t) * 0.25;
    }
    sounds.set(
      "tokenMove",
      new Howl({ src: [createSound(move)], volume: 0.3 }),
    );

    // TOKEN CAPTURE - Descending chord
    const capture = new Float32Array(8820);
    for (let i = 0; i < capture.length; i++) {
      const t = i / 44100;
      const decay = 1 - t / 0.2;
      const f1 = 600 * Math.pow(0.5, t / 0.2);
      const f2 = 800 * Math.pow(0.5, t / 0.2);
      capture[i] =
        (Math.sin(2 * Math.PI * f1 * t) + Math.sin(2 * Math.PI * f2 * t)) *
        0.2 *
        decay;
    }
    sounds.set(
      "tokenCapture",
      new Howl({ src: [createSound(capture)], volume: 0.35 }),
    );

    // TOKEN HOME - Victory chime (C major chord)
    const home = new Float32Array(8820);
    for (let i = 0; i < home.length; i++) {
      const t = i / 44100;
      const decay = Math.exp(-t * 8);
      const c5 = Math.sin(2 * Math.PI * 523 * t);
      const e5 = Math.sin(2 * Math.PI * 659 * t);
      const g5 = Math.sin(2 * Math.PI * 784 * t);
      home[i] = ((c5 + e5 + g5) / 3) * 0.3 * decay;
    }
    sounds.set(
      "tokenHome",
      new Howl({ src: [createSound(home)], volume: 0.4 }),
    );

    // PLAYER WIN - Fanfare arpeggio
    const win = new Float32Array(17640);
    const notes = [523, 659, 784, 1047];
    for (let i = 0; i < win.length; i++) {
      const t = i / 44100;
      const idx = Math.floor(t / 0.1);
      const freq = notes[Math.min(idx, 3)];
      const decay = Math.exp(-t * 3);
      win[i] = Math.sin(2 * Math.PI * freq * t) * 0.35 * decay;
    }
    sounds.set(
      "playerWin",
      new Howl({ src: [createSound(win)], volume: 0.45 }),
    );

    // GAME START - Power up
    const start = new Float32Array(11025);
    for (let i = 0; i < start.length; i++) {
      const t = i / 44100;
      const freq = 200 + (t / 0.25) * 500;
      const decay = 1 - t / 0.25;
      start[i] = Math.sin(2 * Math.PI * freq * t) * 0.3 * decay;
    }
    sounds.set(
      "gameStart",
      new Howl({ src: [createSound(start)], volume: 0.35 }),
    );

    // TURN CHANGE - Quick chirp
    const turn = new Float32Array(3528);
    for (let i = 0; i < turn.length; i++) {
      const t = i / 44100;
      const envelope = Math.sin((t / 0.08) * Math.PI);
      turn[i] = Math.sin(2 * Math.PI * 600 * t) * 0.25 * envelope;
    }
    sounds.set(
      "turnChange",
      new Howl({ src: [createSound(turn)], volume: 0.25 }),
    );

    // BUTTON CLICK - UI click
    const click = new Float32Array(2205);
    for (let i = 0; i < click.length; i++) {
      const t = i / 44100;
      const decay = Math.exp(-t * 60);
      const hi = Math.sin(2 * Math.PI * 1200 * t);
      const lo = Math.sin(2 * Math.PI * 800 * t);
      click[i] = ((hi + lo) / 2) * 0.2 * decay;
    }
    sounds.set(
      "buttonClick",
      new Howl({ src: [createSound(click)], volume: 0.3 }),
    );

    // ERROR - Buzzer
    const error = new Float32Array(11025);
    for (let i = 0; i < error.length; i++) {
      const t = i / 44100;
      const decay = 1 - t / 0.25;
      const f1 = Math.sin(2 * Math.PI * 150 * t);
      const f2 = Math.sin(2 * Math.PI * 157 * t);
      error[i] = ((f1 + f2) / 2) * 0.3 * decay;
    }
    sounds.set("error", new Howl({ src: [createSound(error)], volume: 0.3 }));

    soundsRef.current = sounds;

    return () => {
      sounds.forEach((sound) => sound.unload());
    };
  }, []);

  useEffect(() => {
    soundsRef.current.forEach((sound) => sound.volume(volume));
  }, [volume]);

  useEffect(() => {
    soundsRef.current.forEach((sound) => sound.mute(isMuted));
  }, [isMuted]);

  const playSound = useCallback((soundType: SoundType) => {
    soundsRef.current.get(soundType)?.play();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return { playSound, isMuted, volume, toggleMute, setVolume };
};
