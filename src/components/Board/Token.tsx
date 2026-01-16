// The 'Goti' or playing piece for each player
import { motion } from 'framer-motion';
import React from 'react';
import type { Corrdinates } from '../../constants/coordinates.ts';



interface TokenProps {
  color: 'RED' | 'GREEN' | 'YELLOW' | 'BLUE';
  position: Corrdinates;
  onClick?: () => void;
  isMovable?: boolean;
}


const Token: React.FC<TokenProps> = ({ color, position, onClick, isMovable = false }) => {
  // Adjust positioning for better alignment with grid
  const cellSize = 100 / 15;
  const top = `${(position.r * cellSize) + (cellSize * 0.15)}%`;
  const left = `${(position.c * cellSize) + (cellSize * 0.15)}%`;
  const size = `${cellSize * 0.7}%`;

  const colorMap = {
    RED: "#ef4444",
    GREEN: "#22c55e",
    YELLOW: "#eab308",
    BLUE: "#3b82f6"
  };

  return (
    <motion.div
      layout
      initial={false}
      animate={{ top, left }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={isMovable ? onClick : undefined}
      className={`absolute z-30 flex items-center justify-center ${isMovable ? 'cursor-pointer hover:z-40' : 'cursor-not-allowed'}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%"
      }}
    >
      <div
        className="w-full h-full rounded-full border-2 border-white relative overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: colorMap[color],
          boxShadow: isMovable
            ? '0 2px 8px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1), 0 0 12px 2px rgba(255,255,255,0.4)'
            : '0 2px 8px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)'
        }}
      >
        <div className="absolute top-1 left-1 w-[35%] h-[35%] bg-white opacity-25 rounded-full" />
        <div className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)`
          }} />
        {isMovable && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-white opacity-60"
          />
        )}
      </div>
    </motion.div>
  )
}

export default Token;
