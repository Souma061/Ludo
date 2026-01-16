import { Crown, Star } from 'lucide-react';
import { cn } from '../../utils/helpers.ts';
import './BoardGrid.css';

const LudoBoard = () => {
  const getCellProps = (index: number) => {
    const row = Math.floor(index / 15);
    const col = index % 15;
    let className = "cell-white";
    let content = null;
    let isSpecial = false;

    // --- 1. HOME RUN PATHS (The Colored Lines) ---
    if (row === 7 && col >= 1 && col <= 5) className = "cell-red-path";
    else if (col === 7 && row >= 1 && row <= 5) className = "cell-green-path";
    else if (col === 7 && row >= 9 && row <= 13) className = "cell-blue-path";
    else if (row === 7 && col >= 9 && col <= 13) className = "cell-yellow-path";

    // --- 2. STARTING POINTS (Colored Safe Zones) ---
    if (row === 6 && col === 1) {
      className = "cell-red-start";
      content = <Star size={14} className="text-white" />;
      isSpecial = true;
    } else if (row === 1 && col === 8) {
      className = "cell-green-start";
      content = <Star size={14} className="text-white" />;
      isSpecial = true;
    } else if (row === 8 && col === 13) {
      className = "cell-yellow-start";
      content = <Star size={14} className="text-white" />;
      isSpecial = true;
    } else if (row === 13 && col === 6) {
      className = "cell-blue-start";
      content = <Star size={14} className="text-white" />;
      isSpecial = true;
    }
    // --- 3. GENERAL SAFE ZONES (Marked Tiles) ---
    else if (
      (row === 2 && col === 6) ||
      (row === 6 && col === 12) ||
      (row === 8 && col === 2) ||
      (row === 12 && col === 8)
    ) {
      className = "cell-safe-zone";
      content = <Star size={10} className="text-slate-600" />;
      isSpecial = true;
    }

    if (isSpecial) {
      className += " border-2 border-slate-300";
    }

    return { className, content };
  };

  return (
    <div className="board-container">
      {/* Main Board */}
      <div className="board-wrapper">
        {/* Grid Background */}
        <div className="board-grid">
          {Array.from({ length: 225 }).map((_, index) => {
            const { className, content } = getCellProps(index);
            return (
              <div key={index} className={cn("board-cell", className)}>
                {content}
              </div>
            );
          })}
        </div>

        {/* Base Zones */}
        {/* RED BASE */}
        <div className="base-zone base-red">
          <div className="base-content">
            <div className="base-title">🔴 RED</div>
            <div className="base-tokens">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="base-slot"></div>
              ))}
            </div>
          </div>
        </div>

        {/* GREEN BASE */}
        <div className="base-zone base-green">
          <div className="base-content">
            <div className="base-title">🟢 GREEN</div>
            <div className="base-tokens">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="base-slot"></div>
              ))}
            </div>
          </div>
        </div>

        {/* BLUE BASE */}
        <div className="base-zone base-blue">
          <div className="base-content">
            <div className="base-title">🔵 BLUE</div>
            <div className="base-tokens">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="base-slot"></div>
              ))}
            </div>
          </div>
        </div>

        {/* YELLOW BASE */}
        <div className="base-zone base-yellow">
          <div className="base-content">
            <div className="base-title">🟡 YELLOW</div>
            <div className="base-tokens">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="base-slot"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Victory Zone */}
        <div className="victory-zone">
          <Crown size={24} className="victory-icon" />
        </div>
      </div>
    </div>
  );
};

export default LudoBoard;
