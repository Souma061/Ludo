// 3d Dice UI component for rolling animation
import { motion } from "framer-motion";
import React, { useState } from "react";
import "./Dice.css";

interface DiceProps {
  onRoll: (value: number) => void;
  disabled?: boolean;
  showCube?: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRoll, disabled, showCube = true }) => {
  const [rotating, setRotating] = useState({ x: 0, y: 0 });
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    if (disabled || isRolling) return;
    setIsRolling(true);

    // Randomly determine the dice value (1-6)
    const diceValue = Math.floor(Math.random() * 6) + 1;

    // Calculate the rotation based on the dice value
    const rotateMap: Record<number, { x: number; y: number }> = {
      1: { x: 0, y: 0 },
      2: { x: 0, y: -90 },
      3: { x: 0, y: -180 },
      4: { x: 0, y: 90 },
      5: { x: -90, y: 0 },
      6: { x: 90, y: 0 },
    };

    // Add multiple spins for better effect
    const target = rotateMap[diceValue];
    const newRotation = {
      x: target.x + 360 * 5,
      y: target.y + 360 * 5,
    };
    setRotating(newRotation);

    setTimeout(() => {
      setIsRolling(false);
      onRoll(diceValue);
    }, 1200);
  };

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Glow effect during rolling */}
      {isRolling && <div className="dice-glow"></div>}

      {showCube && (
        <div className="dice-scene">
          <motion.div
            className="dice-cube"
            animate={{ rotateX: rotating.x, rotateY: rotating.y }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* FACE 1 */}
            <div className="dice-face face-1">
              <span>1</span>
            </div>
            {/* FACE 2 */}
            <div className="dice-face face-2">
              <span>2</span>
            </div>
            {/* FACE 3 */}
            <div className="dice-face face-3">
              <span>3</span>
            </div>
            {/* FACE 4 */}
            <div className="dice-face face-4">
              <span>4</span>
            </div>
            {/* FACE 5 */}
            <div className="dice-face face-5">
              <span>5</span>
            </div>
            {/* FACE 6 */}
            <div className="dice-face face-6">
              <span>6</span>
            </div>
          </motion.div>
        </div>
      )}

      <button
        onClick={rollDice}
        disabled={disabled || isRolling}
        className="dice-button group"
      >
        <span className={isRolling ? "animate-pulse" : ""}>
          {isRolling ? "Rolling..." : "Roll Dice"}
        </span>
        {isRolling && <div className="dice-button-glow"></div>}
      </button>
    </div>
  );
};

export default Dice;
