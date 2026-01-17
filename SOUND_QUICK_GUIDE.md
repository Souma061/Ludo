# 🎵 Quick Sound Effects Guide

## Adding a New Sound Effect in 3 Easy Steps

### 1️⃣ Add the Sound Type

**File**: `src/hooks/useSound.ts`

```typescript
export type SoundType = "diceRoll" | "tokenMove" | "yourNewSound"; // ← Add here
```

### 2️⃣ Define the Sound Pattern

**File**: `src/hooks/useSound.ts` (in the `playSound` function)

```typescript
case "yourNewSound":
  playTone(440, 0.2, "sine");  // frequency, duration, waveform
  break;
```

### 3️⃣ Use It in Your Code

**Example**: `src/App.tsx` or any component

```typescript
const { playSound } = useSound();

// Play the sound when an event happens
const handleMyEvent = () => {
  playSound("yourNewSound");
  // ... rest of your logic
};
```

## Common Sound Patterns

### Simple Beep

```typescript
playTone(440, 0.1, "sine");
```

### Success Chime (3 notes ascending)

```typescript
playTone(523.25, 0.15, "sine"); // C5
setTimeout(() => playTone(659.25, 0.15, "sine"), 150); // E5
setTimeout(() => playTone(783.99, 0.2, "sine"), 300); // G5
```

### Error Buzz

```typescript
playTone(180, 0.2, "sawtooth");
```

### Click Sound

```typescript
playTone(800, 0.05, "square");
```

### Swoosh/Slide (2 quick tones)

```typescript
playTone(300, 0.1, "sine");
setTimeout(() => playTone(250, 0.1, "sine"), 50);
```

### Random Rattle (good for dice/collision)

```typescript
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    playTone(200 + Math.random() * 200, 0.05, "square");
  }, i * 30);
}
```

## Musical Notes Reference

| Note          | Frequency (Hz) | Use Case              |
| ------------- | -------------- | --------------------- |
| C4 (Middle C) | 261.63         | Neutral, calm sounds  |
| D4            | 293.66         | Slightly brighter     |
| E4            | 329.63         | Happy, positive       |
| F4            | 349.23         | Mellow                |
| G4            | 392.00         | Confident             |
| A4            | 440.00         | Standard tuning pitch |
| C5            | 523.25         | Victory, success      |
| E5            | 659.25         | Bright, energetic     |
| G5            | 783.99         | High, exciting        |

## Waveform Types

| Type         | Sound Character | Best For                      |
| ------------ | --------------- | ----------------------------- |
| `"sine"`     | Pure, smooth    | Melodic sounds, chimes, bells |
| `"square"`   | Harsh, retro    | 8-bit games, alerts, errors   |
| `"triangle"` | Warm, soft      | Balanced tones,background     |
| `"sawtooth"` | Buzzy, rich     | Bass sounds, harsh warnings   |

## playTone() Parameters

```typescript
playTone(frequency, duration, type);
```

- **frequency** (number): Pitch in Hz (100-2000 typical range)
- **duration** (number): Length in seconds (0.05-1.0 typical)
- **type** (OscillatorType): "sine" | "square" | "triangle" | "sawtooth"

## Tips

- 🎵 **Lower frequencies** (100-300 Hz) = bass, deep sounds
- 🎶 **Mid frequencies** (300-800 Hz) = most game sounds
- 🎤 **Higher frequencies** (800-2000 Hz) = bright, attention-grabbing

- ⏱️ **Short durations** (0.05-0.1s) = clicks, taps
- ⏰ **Medium durations** (0.1-0.3s) = notes, alerts
- ⏳ **Long durations** (0.3-1.0s) = sustained tones, music

- 🔁 Use `setTimeout()` to chain multiple tones for complex melodies
- 🎲 Add `Math.random()` for variation and organic feel
- 🔊 Test at different volume levels to ensure clarity

## Example Scenarios

### When Token Lands on Safe Zone

```typescript
playTone(523.25, 0.1, "sine"); // Quick high C
```

### When Token Gets Captured

```typescript
playTone(600, 0.1, "triangle");
setTimeout(() => playTone(400, 0.1, "triangle"), 80);
setTimeout(() => playTone(200, 0.15, "triangle"), 160);
```

### When Player Gets a 6

```typescript
playTone(659.25, 0.15, "sine");
setTimeout(() => playTone(783.99, 0.15, "sine"), 100);
```

### Invalid Move Attempt

```typescript
playTone(200, 0.1, "sawtooth");
```

---

**Need more help?** Check out [SOUND_SYSTEM.md](./SOUND_SYSTEM.md) for the full documentation.
