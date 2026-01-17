# 🎵 Sound System Documentation

## Overview

This Ludo game now includes a comprehensive sound effects system that provides audio feedback for various game events. The system uses the Web Audio API to generate procedural sounds, meaning no external audio files are required.

## Features

### ✅ Implemented Sound Effects

1. **Dice Roll** - Multi-tone sound when rolling the dice
2. **Token Move** - Sliding sound when moving a token
3. **Token Capture** - Descending tone when capturing an opponent's token
4. **Token Home** - Victory chime when a token reaches home
5. **Player Win** - Fanfare when a player wins the game
6. **Game Start** - Ascending chime at game start
7. **Turn Change** - Quick notification when turn changes
8. **Button Click** - UI interaction sound
9. **Error** - Buzz sound for invalid actions

### 🎮 Sound Controls

- **Volume Slider**: Adjust sound volume from 0-100%
- **Mute Toggle**: Quickly mute/unmute all sounds
- **Visual Feedback**: Dynamic volume icon that changes based on level
- **Auto-Hide**: Volume slider appears on hover and auto-hides after 3 seconds

## Usage

### Basic Usage

The sound system is already integrated into the game. It automatically plays sounds for:

- **Dice rolls**: When you click the dice
- **Token movements**: When you click a token to move it
- **Turn changes**: When the turn switches to another player
- **Player victories**: When someone wins

### Controlling Sound

Look for the sound control button in the top-right corner of the game:

1. **Click the sound icon** to mute/unmute
2. **Hover over the icon** to show the volume slider
3. **Adjust the slider** to change volume

## Architecture

### File Structure

```
src/
├── hooks/
│   └── useSound.ts          # Sound generation and management hook
├── components/
│   └── UI/
│       ├── SoundControls.tsx    # Volume control UI component
│       └── SoundControls.css    # Styling for sound controls
└── App.tsx                   # Main app with sound integration
```

### How It Works

1. **useSound Hook**:
   - Manages AudioContext for sound generation
   - Provides `playSound()` function for triggering effects
   - Handles mute state and volume control
   - Uses Web Audio API oscillators to generate tones

2. **SoundControls Component**:
   - Displays mute/unmute button
   - Shows volume slider on hover
   - Provides visual feedback for current volume level

3. **Integration in App.tsx**:
   - Tracks game state changes using `useRef` to avoid re-renders
   - Plays appropriate sounds when events occur
   - Wraps token movement to include sound feedback

## Adding New Sound Effects

### Step 1: Add Sound Type

Edit `src/hooks/useSound.ts` and add your sound type to the `SoundType` union:

```typescript
export type SoundType =
  | "diceRoll"
  | "tokenMove"
  | "tokenCapture"
  | "tokenHome"
  | "playerWin"
  | "gameStart"
  | "turnChange"
  | "buttonClick"
  | "error"
  | "yourNewSound"; // Add here
```

### Step 2: Define Sound Pattern

In the `playSound` function, add a new case to the switch statement:

```typescript
case "yourNewSound":
  //Example: simple beep
  playTone(440, 0.2, "sine");  // A4 note, 0.2s duration, sine wave
  break;
```

### Step 3: Trigger the Sound

In your component, call the sound effect:

```typescript
const { playSound } = useSound();

// Trigger it when needed
playSound("yourNewSound");
```

## Sound Design Tips

### Understanding playTone()

```typescript
playTone(frequency, duration, type);
```

- **frequency**: Pitch in Hz (220-880 is a good range)
  - 261.63 = Middle C (C4)
  - 440 = A4 (standard tuning note)
  - Higher = higher pitch

- **duration**: Length in seconds (0.05-0.5 typical)

- **type**: Waveform shape
  - `"sine"` - Pure, smooth tone (good for melodies)
  - `"square"` - Harsh, retro game sound
  - `"triangle"` - Softer than square, warmer than sine
  - `"sawtooth"` - Buzzy, harsh (good for errors)

### Creating Complex Sounds

Use `setTimeout` to sequence multiple tones:

```typescript
// Ascending scale
playTone(261.63, 0.15, "sine"); // C
setTimeout(() => playTone(329.63, 0.15, "sine"), 150); // E
setTimeout(() => playTone(392, 0.2, "sine"), 300); // G
```

### Random Variations

Add randomness for more dynamic sounds:

```typescript
// Dice roll with random pitches
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    playTone(200 + Math.random() * 200, 0.05, "square");
  }, i * 30);
}
```

## Advanced Features

### Using External Audio Files (Optional)

While the current system uses procedural sounds, you can extend it to load audio files:

1. Add audio files to `public/sounds/`
2. Modify `useSound` hook to load files using`AudioBuffer`
3. Use `AudioBufferSourceNode` to play loaded sounds

Example:

```typescript
// In useSound.ts
const loadSound = async (url: string) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer =
    await audioContextRef.current!.decodeAudioData(arrayBuffer);
  return audioBuffer;
};

const playLoadedSound = (buffer: AudioBuffer) => {
  const source = audioContextRef.current!.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContextRef.current!.destination);
  source.start();
};
```

### Background Music

To add background music:

1. Create a new hook `useBackgroundMusic.ts`
2. Use `<audio>` element with loop attribute
3. Control with volume and mute from sound system

```typescript
const BackgroundMusic = ({ volume, isMuted }: { volume: number; isMuted: boolean }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  return (
    <audio ref={audioRef} loop autoPlay>
      <source src="/music/background.mp3" type="audio/mpeg" />
    </audio>
  );
};
```

## Performance Considerations

- **Efficient**: Web Audio API is hardware-accelerated
- **Lightweight**: No audio file loading/decoding overhead
- **Memory**: Minimal memory footprint
- **Compatibility**: Supported in all modern browsers

## Browser Compatibility

The sound system works in all modern browsers:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

**Note**: Some browsers require user interaction before playing audio. The first sound might be delayed until the user clicks something.

## Future Enhancements

Possible improvements you could add:

1. **Sound Themes**: Different sound packs (8-bit, orchestral, etc.)
2. **Spatial Audio**: Pan sounds left/right based on player position
3. **Sound Preloading**: Cache AudioBuffers for external files
4. **Accessibility**: Visual indicators for deaf/hard-of-hearing users
5. **Sound Effects Library**: Import real sampled sounds
6. **Volume Presets**: Quick presets (silent, low, medium, high)
7. **Per-Event Volume**: Different volumes for different sound types

## Troubleshooting

### No Sound Playing

1. Check if browser has given audio permission
2. Ensure volume slider is not at 0%
3. Check if mute button is active
4. Try clicking something first (browser auto play policy)
5. Check browser console for AudioContext errors

### Sounds Stuttering

1. Reduce the number of simultaneous sounds
2. Increase setTimeout delays between tones
3. Check CPU usage - may be device performance issue

### Volume Not Working

1. Ensure `volume` state is being updated
2. Check that `gainNode.gain.value` is using current volume
3. Verify volume slider onChange is calling setVolume

## Credits

Sound system implemented using:

- **Web Audio API**: For sound generation
- **React Hooks**: For state management
- **Framer Motion**: For UI animations

---

**Happy Gaming! 🎮🎲**
