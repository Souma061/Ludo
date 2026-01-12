import { Star } from 'lucide-react';
import { GLOBAL_PATH } from '../../constants/coordinates.ts';
import { cn } from '../../utils/helpers.ts';
import Token from './Token.tsx';
const LudoBoard = () => {
  const getCellProps = (index: number) => {
    const row = Math.floor(index / 15);
    const col = index % 15;
    let className = "bg-white";
    let content = null;

    // --- 1. HOME RUN PATHS (The Colored Lines) ---
    if (row === 7 && col >= 1 && col <= 5) className = "bg-red-500";       // Red Path
    else if (col === 7 && row >= 1 && row <= 5) className = "bg-green-500"; // Green Path
    else if (col === 7 && row >= 9 && row <= 13) className = "bg-blue-500"; // Blue Path
    else if (row === 7 && col >= 9 && col <= 13) className = "bg-yellow-400"; // Yellow Path


    // --- 2. STARTING POINTS (Colored Safe Zones) ---
    // These are the entry points you identified:

    // Red Start (Row 6, Col 1)
    if (row === 6 && col === 1) {
      className = "bg-red-500";
      content = <Star size={12} className="text-white" />;
    }
    // Green Start (Row 1, Col 8)
    else if (row === 1 && col === 8) {
      className = "bg-green-500";
      content = <Star size={12} className="text-white" />;
    }
    // Yellow Start (Row 8, Col 13)
    else if (row === 8 && col === 13) {
      className = "bg-yellow-400";
      content = <Star size={12} className="text-white" />;
    }
    // Blue Start (Row 13, Col 6)
    else if (row === 13 && col === 6) {
      className = "bg-blue-500";
      content = <Star size={12} className="text-white" />;
    }


    // --- 3. GENERAL SAFE ZONES (White Tiles) ---

    else if (
      (row === 2 && col === 6) ||  // Index 36  (Top Left)
      (row === 6 && col === 12) || // Index 102 (Top Right)
      (row === 8 && col === 2) || // Index 122 (Bottom Left)
      (row === 12 && col === 8)    // Index 188 (Bottom Right)
    ) {
      content = <Star size={10} className="text-slate-400" />;
    }


    if (content) {
      className += " border-2 border-slate-300";
    }

    return { className, content };
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">

      {/* 1. The Main Board Wrapper */}
      <div className="relative bg-white border-2 border-black shadow-2xl">

        {/* This is the 15x15 Grid.
        We use the custom 'grid-cols-15' and 'grid-rows-15' we added to tailwind.config
        */}
        <div
          className="grid grid-cols-15 grid-rows-15 w-[90vw] h-[90vw] max-w-[600px] max-h-[600px]"
        >

          {/* Loop to create 225 Cells (15 x 15)
            We map over them to create the visual grid lines.
          */}
          {Array.from({ length: 225 }).map((_, index) => {
            const { className, content } = getCellProps(index);
            return (
              <div
                key={index}
                className={cn(className, "border-[0.5px] border-slate-400 w-full h-full flex items-center justify-center text-[8px] text-gray-300")}
              >
                {/* Optional: Show index for debugging later */}
                {index}
                {content}
                <span className="absolute opacity-20 ">{index}</span>

              </div>
            );
          })}
        </div>

        {/* 2. The 4 Home Bases (Overlays)
        We place these absolutely on top of the grid to cover the cells underneath.
          Each base is 6x6 cells (40% width/height of the board).
        */}

        {/* RED BASE (Top Left) */}
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-white border-r-2 border-b-2 border-black p-4">
          <div className="w-full h-full bg-red-600 rounded-xl border-2 border-black flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <span className="font-bold text-red-600">RED </span>
            </div>
          </div>

        </div>

        {/* GREEN BASE (Top Right) */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-white border-l-2 border-b-2 border-black p-4">
          <div className="w-full h-full bg-green-600 rounded-xl border-2 border-black flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <span className="font-bold text-green-600">GREEN</span>
            </div>
          </div>

        </div>

        {/* BLUE BASE (Bottom Left) */}
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-white border-r-2 border-t-2 border-black p-4">
          <div className="w-full h-full bg-blue-600 rounded-xl border-2 border-black flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <span className="font-bold text-blue-600">BLUE</span>
            </div>
          </div>

        </div>

        {/* YELLOW BASE (Bottom Right) */}
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-white border-l-2 border-t-2 border-black p-4">
          <div className="w-full h-full bg-yellow-400 rounded-xl border-2 border-black flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <span className="font-bold text-yellow-600">YELLOW</span>
            </div>
          </div>

        </div>


        {/* 3. The Center Victory Triangle
           Located in the exact middle (Row 7-9, Col 7-9)
        */}
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-slate-800 flex flex-wrap">
          {/* You can use CSS triangles here later to make the 4 colored triangles */}
          <div className="w-full h-full flex items-center justify-center text-white text-xs">
            WIN
          </div>
        </div>


        <Token color="RED" position={GLOBAL_PATH[0]} />
        <Token color="GREEN" position={GLOBAL_PATH[13]} /> {/* Index 13 is the Green Start */}
        <Token color="YELLOW" position={GLOBAL_PATH[26]} />
        <Token color="BLUE" position={GLOBAL_PATH[39]} />

      </div>
    </div>
  );
};

export default LudoBoard;
