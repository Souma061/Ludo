// The 'Goti' or playing piece for each player
import { motion } from "framer-motion";
import React from "react";
import type { Corrdinates } from "../../constants/coordinates.ts";

interface TokenProps {
  color: "RED" | "GREEN" | "YELLOW" | "BLUE";
  position: Corrdinates;
  onClick?: () => void;
  isMovable?: boolean;
}

const Token: React.FC<TokenProps> = ({
  color,
  position,
  onClick,
  isMovable = false,
}) => {
  // Simple calculation - tokens now share the same coordinate system as the grid
  const cellSize = 100 / 15;
  const tokenSize = cellSize * 0.65;

  // Position at cell center
  const top = `${position.r * cellSize + cellSize / 2}%`;
  const left = `${position.c * cellSize + cellSize / 2}%`;
  const size = `${tokenSize}%`;

  // 3D Marble Gradient Styles
  const tokenStyles = {
    RED: "bg-gradient-to-br from-red-400 via-red-600 to-red-900 shadow-[0_4px_8px_rgba(220,38,38,0.6)] border-red-300",
    GREEN:
      "bg-gradient-to-br from-green-400 via-green-600 to-green-900 shadow-[0_4px_8px_rgba(22,163,74,0.6)] border-green-300",
    YELLOW:
      "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-800 shadow-[0_4px_8px_rgba(234,179,8,0.6)] border-yellow-200",
    BLUE: "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[0_4px_8px_rgba(37,99,235,0.6)] border-blue-300",
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{ top, left }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={isMovable ? onClick : undefined}
      className={`absolute z-20 flex items-center justify-center ${isMovable ? "cursor-pointer hover:z-40" : "cursor-not-allowed"}`}
      style={{
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* The Marble Body */}
      <div
        className={`w-[85%] h-[85%] rounded-full border-2 ${tokenStyles[color]} relative overflow-hidden transition-all duration-300`}
      >
        {/* The "Shine" (Reflection) */}
        <div className="absolute top-[15%] left-[20%] w-[35%] h-[20%] bg-white opacity-40 rounded-full blur-[1px]" />

        {/* Additional gradient overlay for depth */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
          }}
        />

        {/* Movable pulse effect */}
        {isMovable && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-white opacity-60"
          />
        )}
      </div>
    </motion.div>
  );
};

export default Token;
