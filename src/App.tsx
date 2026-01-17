import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import LudoBoard from "./components/Board/BoardGrid";
import Token from "./components/Board/Token";
import Dice from "./components/Game/Dice";
import WinnerModal from "./components/Game/WinnerModal";
import SoundControls from "./components/UI/SoundControls";
import {
  BASE_POSITIONS,
  GLOBAL_PATH,
  HOME_PATHS,
  START_INDEX,
} from "./constants/coordinates.ts";
import { useGameLogics } from "./hooks/useGameLogics";
import { useSound } from "./hooks/useSound";
import type { PlayerColor } from "./types/index";

function App() {
  const {
    gameState,
    handleRollDice,
    moveToken,
    getPlayerStats,
    resetGame,
    getMovableTokenIds,
  } = useGameLogics();
  const [showWinner, setShowWinner] = useState(false);

  // Sound system
  const { playSound, isMuted, toggleMute, volume, setVolume } = useSound();

  // Track previous values using refs to avoid cascading renders
  const prevDiceValueRef = useRef<number | null>(null);
  const prevWinnersCountRef = useRef(0);
  const prevTurnRef = useRef<PlayerColor>(gameState.currentTurn);

  // Play dice roll sound
  useEffect(() => {
    if (
      gameState.diceValue !== null &&
      gameState.diceValue !== prevDiceValueRef.current
    ) {
      playSound("diceRoll");
      prevDiceValueRef.current = gameState.diceValue;
    }
  }, [gameState.diceValue, playSound]);

  // Play turn change sound
  useEffect(() => {
    if (gameState.currentTurn !== prevTurnRef.current) {
      playSound("turnChange");
      prevTurnRef.current = gameState.currentTurn;
    }
  }, [gameState.currentTurn, playSound]);

  // Play winner sound
  useEffect(() => {
    if (gameState.winners.length > prevWinnersCountRef.current) {
      playSound("playerWin");
      prevWinnersCountRef.current = gameState.winners.length;
    }
  }, [gameState.winners.length, playSound]);

  // Wrapper to play sound on token move (wrapped in useCallback)
  const handleTokenMove = useCallback(
    (tokenId: number) => {
      playSound("tokenMove");
      moveToken(tokenId);
    },
    [playSound, moveToken],
  );

  // Auto-move when only one token is movable (UX improvement)
  useEffect(() => {
    if (gameState.diceValue !== null && gameState.gameStatus === "PLAYING") {
      const movableTokenIds = getMovableTokenIds(
        gameState.currentTurn,
        gameState.diceValue,
      );

      // If exactly one token can move, auto-move it after a short delay
      if (movableTokenIds.length === 1) {
        const autoMoveTimer = setTimeout(() => {
          handleTokenMove(movableTokenIds[0]);
        }, 400); // Small delay for better UX (let user see the dice result)

        return () => clearTimeout(autoMoveTimer);
      }
    }
  }, [
    gameState.diceValue,
    gameState.currentTurn,
    gameState.gameStatus,
    getMovableTokenIds,
    handleTokenMove,
  ]);

  useEffect(() => {
    if (gameState.winners.length > 0 && !showWinner) {
      const timer = setTimeout(() => setShowWinner(true), 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.winners, showWinner]);

  const getVisualPosition = (
    color: PlayerColor,
    tokenIndex: number,
    logicalPos: number,
  ) => {
    if (logicalPos === -1) {
      return BASE_POSITIONS[color][tokenIndex];
    }
    if (logicalPos >= 51 && logicalPos < 57) {
      const homeIndex = logicalPos - 51;
      return HOME_PATHS[color][homeIndex];
    }
    if (logicalPos === 57) {
      return { r: 7, c: 7 };
    }
    const offset = START_INDEX[color];
    const globalIndex = (offset + logicalPos) % 52;
    return GLOBAL_PATH[globalIndex];
  };

  const getPlayerColor = (color: PlayerColor): string => {
    const colors: Record<PlayerColor, string> = {
      RED: "#ef4444",
      GREEN: "#22c55e",
      YELLOW: "#eab308",
      BLUE: "#3b82f6",
    };
    return colors[color];
  };

  const getPlayerLabel = (color: PlayerColor): string => {
    const labels: Record<PlayerColor, string> = {
      RED: "🔴 RED",
      GREEN: "🟢 GREEN",
      YELLOW: "🟡 YELLOW",
      BLUE: "🔵 BLUE",
    };
    return labels[color];
  };

  const playerStats = {
    RED: getPlayerStats("RED"),
    GREEN: getPlayerStats("GREEN"),
    YELLOW: getPlayerStats("YELLOW"),
    BLUE: getPlayerStats("BLUE"),
  };

  return (
    <div className="app-container">
      {/* Sound Controls */}
      <SoundControls
        isMuted={isMuted}
        volume={volume}
        onToggleMute={toggleMute}
        onVolumeChange={setVolume}
      />

      {/* Background Gradient */}
      <div className="app-background"></div>

      {/* Main Content */}
      <div className="app-content">
        {/* Header */}
        <motion.header
          className="app-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="app-title">
            🎲 LUDO <span className="title-accent">GAME</span>
          </h1>
          <p className="app-subtitle">Indian Classic Board Game</p>
        </motion.header>

        {/* Main Game Area */}
        <div className="game-layout">
          {/* Center - Board */}
          <motion.div
            className="board-area"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="board-wrapper-main">
              {/* Pass tokens as children inside LudoBoard */}
              <LudoBoard>
                {(["RED", "GREEN", "YELLOW", "BLUE"] as PlayerColor[]).map(
                  (color) => {
                    const movableTokenIds = getMovableTokenIds(
                      color,
                      gameState.diceValue,
                    );
                    return gameState.tokens[color].map((token) => (
                      <Token
                        key={`${color}-${token.id}`}
                        color={color}
                        position={getVisualPosition(
                          color,
                          token.id,
                          token.position,
                        )}
                        onClick={() => handleTokenMove(token.id)}
                        isMovable={
                          color === gameState.currentTurn &&
                          movableTokenIds.includes(token.id)
                        }
                      />
                    ));
                  },
                )}
              </LudoBoard>
            </div>
          </motion.div>

          {/* Right Sidebar - Stats and Controls */}
          <div className="right-sidebar">
            {/* Left Sidebar - Player Stats */}
            <motion.div
              className="stats-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="stats-header">
                <h2 className="stats-title">Players</h2>
                <div
                  className="stats-turn-badge"
                  style={{ borderColor: getPlayerColor(gameState.currentTurn) }}
                >
                  {getPlayerLabel(gameState.currentTurn)}
                </div>
              </div>

              <div className="stats-grid">
                {(["RED", "GREEN", "YELLOW", "BLUE"] as PlayerColor[]).map(
                  (color) => {
                    const stats = playerStats[color];
                    const isCurrentTurn = color === gameState.currentTurn;

                    return (
                      <motion.div
                        key={color}
                        className={`stat-card ${isCurrentTurn ? "stat-active" : ""}`}
                        style={{
                          borderColor: getPlayerColor(color),
                          boxShadow: isCurrentTurn
                            ? `0 0 15px ${getPlayerColor(color)}`
                            : "none",
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div
                          className="stat-color"
                          style={{ backgroundColor: getPlayerColor(color) }}
                        ></div>
                        <div className="stat-info">
                          <span className="stat-label">
                            {getPlayerLabel(color)}
                          </span>
                          <div className="stat-tokens">
                            <span className="token-count">
                              🏃 {stats.tokensActive}
                            </span>
                            <span className="token-count">
                              🏠 {stats.tokensCaptured}
                            </span>
                            <span className="token-count">
                              🏁 {stats.tokensFinished}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  },
                )}
              </div>
            </motion.div>

            {/* Right Sidebar - Controls */}
            <motion.div
              className="control-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Dice Display */}
              <div className="control-section">
                <h3 className="control-title">Current Roll</h3>
                <motion.div
                  className="dice-display"
                  key={gameState.diceValue}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="dice-value">
                    {gameState.diceValue ?? "—"}
                  </span>
                </motion.div>
              </div>

              {/* Dice Component */}
              <div className="control-section">
                <Dice
                  onRoll={handleRollDice}
                  disabled={
                    gameState.diceValue !== null ||
                    gameState.gameStatus !== "PLAYING"
                  }
                  showCube={gameState.diceValue === null}
                />
              </div>

              {/* Game Status */}
              <div className="control-section">
                <div className="status-info">
                  {gameState.diceValue ? (
                    <motion.p
                      className="status-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ✋ Select a token to move
                    </motion.p>
                  ) : (
                    <p className="status-text">
                      🎲 Waiting for {gameState.currentTurn} to roll
                    </p>
                  )}
                </div>
              </div>

              {/* Winners List */}
              {gameState.winners.length > 0 && (
                <motion.div
                  className="winners-list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h4 className="winners-title">🏆 Leaderboard</h4>
                  {gameState.winners.map((winner, index) => (
                    <motion.div
                      key={winner}
                      className="winner-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="winner-rank">#{index + 1}</span>
                      <span className="winner-name">
                        {getPlayerLabel(winner)}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Reset Button */}
              {gameState.gameStatus === "FINISHED" && (
                <motion.button
                  className="reset-btn"
                  onClick={resetGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 New Game
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      <AnimatePresence>
        {showWinner && gameState.winners.length > 0 && (
          <WinnerModal
            winner={gameState.winners[gameState.winners.length - 1]}
            rank={gameState.winners.length}
            onClose={() => setShowWinner(false)}
            onReset={resetGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
