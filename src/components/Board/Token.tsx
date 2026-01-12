// The 'Goti' or playing piece for each player
import React from 'react'
import {motion} from 'framer-motion'
import type  {Corrdinates} from '../../constants/coordinates.ts';



interface TokenProps {
  color: 'RED' | 'GREEN' | 'YELLOW' | 'BLUE';
  position: Corrdinates;
  onClick?: () => void;
}


const Token: React.FC<TokenProps> = ({color,position,onClick}) => {
  const top = `${(position.r * 100) / 15}%`;
  const left = `${(position.c * 100) / 15}%`;
  const size = `${100 / 15}%`;

  const colorMap = {
    RED: "#ef4444",    // tailwind red-500
    GREEN: "#22c55e",  // tailwind green-500
    YELLOW: "#eab308", // tailwind yellow-500
    BLUE: "#3b82f6"   // tailwind blue-500
  };
  return (
    <motion.div
    layout
    initial={false}
    animate={{ top, left }}
    transition={{type:"spring",stiffness:300,damping:25}}
    onClick={onClick}
      className="absolute z-20 flex items-center justify-center cursor-pointer"
      style={{ width: size, height: size, backgroundColor: colorMap[color], borderRadius: "50%" }}
    >
      <div
        className="w-[75%] h-[75%] rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.3)] border-2 border-white relative"
        style={{ backgroundColor: colorMap[color] }}
      >
        <div className="absolute top-1 left-1 w-[40%] h-[40%] bg-white opacity-30 rounded-full" />
      </div>
    </motion.div>
  )
}
export default Token
