import { useCallback, useEffect, useState } from "react";
import { START_INDEX } from "../constants/coordinates";
import {
  BOARD_PATH_LENGTH,
  FINISH_LINE,
  HOME_STRETCH_START,
  MAX_SIXES_STREAK,
  isSafeZone,
} from "../constants/rules";
import type { GameStatus, PlayerColor, TokenState } from "../types";

export interface PlayerStats {
  color: PlayerColor;
  tokensFinished: number;
  tokensActive: number;
  tokensCaptured: number;
}

export interface PlayerConfig {
  name: string;
  color: PlayerColor;
  isAI: boolean;
}

const INITIAL_TOKENS = [0, 1, 2, 3].map((id) => ({
  id,
  position: -1,
  status: "BASE" as const,
}));

// Default 4 players if nothing is configured
const DEFAULT_PLAYERS: PlayerConfig[] = [
  { name: "Player 1", color: "RED", isAI: false },
  { name: "Player 2", color: "GREEN", isAI: false },
  { name: "Player 3", color: "YELLOW", isAI: false },
  { name: "Player 4", color: "BLUE", isAI: false },
];

export interface GameState {
  currentTurn: PlayerColor;
  diceValue: number | null;
  tokens: { [key in PlayerColor]: TokenState[] };
  sixesStreak: number;
  winners: PlayerColor[];
  gameStatus: GameStatus;
  lastMoveTime: number;
  playerConfigs: PlayerConfig[];
}

export const useGameLogics = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // 1. Try to load ACTIVE player config (who is playing?)
    let loadedConfig = DEFAULT_PLAYERS;
    try {
      const configStr = localStorage.getItem("playerConfig");
      if (configStr) {
        loadedConfig = JSON.parse(configStr);
      }
    } catch (e) {
      console.warn("Error loading player config", e);
    }

    // 2. Try to load SAVED GAME state
    try {
      const savedState = localStorage.getItem("ludoGameState");
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Merge the config in case it changed (though usually we'd only load state if resuming)
        // For now, if we have a saved state, we assume it matches the current session intentions
        // OR we overwrite the playerConfigs with what we just loaded to be safe.
        return {
          ...parsed,
          playerConfigs: loadedConfig,
        };
      }
    } catch (error) {
      console.warn("Failed to load saved game state:", error);
    }

    // 3. Default Initial State
    return {
      currentTurn: loadedConfig[0].color, // Start with first configured player
      diceValue: null,
      tokens: {
        RED: [...INITIAL_TOKENS],
        GREEN: [...INITIAL_TOKENS],
        YELLOW: [...INITIAL_TOKENS],
        BLUE: [...INITIAL_TOKENS],
      },
      sixesStreak: 0,
      winners: [],
      gameStatus: "PLAYING",
      lastMoveTime: 0,
      playerConfigs: loadedConfig,
    };
  });

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("ludoGameState", JSON.stringify(gameState));
    } catch (error) {
      console.warn("Failed to save game state:", error);
    }
  }, [gameState]);



  // --- HELPER: Switch Turn ---
  const switchTurn = useCallback(() => {
    setGameState((prev) => {
      const activeColors = prev.playerConfigs.map((p) => p.color);
      const currentIndex = activeColors.indexOf(prev.currentTurn);

      // Calculate next index, skipping winners?
      // Traditional Ludo: Winners might drop out, or play until 3 finish.
      // For now, simple cycle.
      const nextIndex = (currentIndex + 1) % activeColors.length;
      const nextColor = activeColors[nextIndex];

      // Skip players who have already won (if we want that behavior)
      // Usually in Ludo, you keep cycling until only one is left?
      // Let's keep simple cycle for now, but if we wanted to skip winners:
      // while (prev.winners.includes(nextColor) && prev.winners.length < activeColors.length - 1) { ... }

      return {
        ...prev,
        currentTurn: nextColor,
        diceValue: null,
        sixesStreak: 0,
      };
    });
  }, []);

  // --- HELPER: Check Valid Moves ---
  const hasValidMoves = (dice: number, tokens: TokenState[]) => {
    return tokens.some((token) => {
      if (token.status === "FINISHED") return false;
      if (token.status === "BASE") return dice === 6;
      return token.position + dice <= 57;
    });
  };

  // --- ACTION: Roll Dice ---
  const handleRollDice = useCallback(
    (value: number) => {
      setGameState((prev) => {
        if (prev.gameStatus !== "PLAYING" || prev.diceValue !== null)
          return prev;

        const diceValue = value;
        let newStreak = prev.sixesStreak;

        // Handle 3 Sixes in a row
        if (diceValue === 6) {
          newStreak += 1;
          if (newStreak === MAX_SIXES_STREAK) {
            setTimeout(switchTurn, 1000); // Auto skip turn
            return {
              ...prev,
              diceValue,
              sixesStreak: 0,
              lastMoveTime: Date.now(),
            };
          }
        } else {
          newStreak = 0;
        }

        return {
          ...prev,
          diceValue,
          sixesStreak: newStreak,
          lastMoveTime: Date.now(),
        };
      });
    },
    [switchTurn],
  );

  // --- EFFECT: Auto-Switch if No Moves ---
  useEffect(() => {
    if (
      gameState.diceValue &&
      !gameState.winners.includes(gameState.currentTurn)
    ) {
      const canMove = hasValidMoves(
        gameState.diceValue,
        gameState.tokens[gameState.currentTurn],
      );

      // If player cannot move any token, wait 1s and pass turn
      if (!canMove && gameState.sixesStreak < MAX_SIXES_STREAK) {
        const timeout = setTimeout(switchTurn, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [
    gameState.diceValue,
    gameState.currentTurn,
    gameState.tokens,
    switchTurn,
    gameState.winners,
    gameState.sixesStreak,
  ]);

  // --- ACTION: Move Token ---
  const moveToken = useCallback((tokenId: number) => {
    setGameState((prev) => {
      if (!prev.diceValue || prev.gameStatus !== "PLAYING") return prev;

      const currentColor = prev.currentTurn;
      const tokens = prev.tokens[currentColor];
      const token = tokens.find((t) => t.id === tokenId);

      if (!token) return prev;

      const newTokens = { ...prev.tokens };
      const colorTokens = [...newTokens[currentColor]];
      const tokenIndex = colorTokens.findIndex((t) => t.id === tokenId);
      const dice = prev.diceValue;

      let newPosition = colorTokens[tokenIndex].position;
      let newStatus = colorTokens[tokenIndex].status;

      // 1. Calculate New Position
      if (newStatus === "BASE") {
        if (dice === 6) {
          newPosition = 0; // Start of path
          newStatus = "ACTIVE";
        } else {
          return prev;
        }
      } else if (newStatus === "ACTIVE") {
        if (newPosition + dice <= FINISH_LINE) {
          newPosition += dice;
          if (newPosition === FINISH_LINE) newStatus = "FINISHED";
        } else {
          return prev;
        }
      } else {
        return prev;
      }

      // 2. Collision / Killing Logic
      let globalPos = -1;
      if (newStatus === "ACTIVE" && newPosition < HOME_STRETCH_START) {
        const offset = START_INDEX[currentColor];
        globalPos = (offset + newPosition) % BOARD_PATH_LENGTH;
      }

      let opponentKilled = false;

      // Only check collision if we are on the main board
      if (globalPos !== -1 && !isSafeZone(globalPos)) {
        // Iterate only through ACTIVE players/colors for collision
        // (Though iterating all colors is technically safe as inactive ones stay in base,
        //  but good to be consistent)
        const activeColors = prev.playerConfigs.map((p) => p.color);

        activeColors.forEach((oppColor) => {
          if (oppColor === currentColor) return;

          const oppTokens = [...newTokens[oppColor]];
          // Find tokens at the exact same spot
          const victims = oppTokens.filter((t) => {
            if (t.status !== "ACTIVE" || t.position >= HOME_STRETCH_START)
              return false;
            const oppOffset = START_INDEX[oppColor];
            const oppGlobal = (oppOffset + t.position) % BOARD_PATH_LENGTH;
            return oppGlobal === globalPos;
          });

          // Kill logic: If exactly 1 token is there
          if (victims.length === 1) {
            const victimIndex = oppTokens.indexOf(victims[0]);
            oppTokens[victimIndex] = {
              ...oppTokens[victimIndex],
              position: -1,
              status: "BASE",
            };
            newTokens[oppColor] = oppTokens;
            opponentKilled = true;
          }
        },
        );
      }

      // 3. Update State
      colorTokens[tokenIndex] = {
        ...colorTokens[tokenIndex],
        position: newPosition,
        status: newStatus,
      };
      newTokens[currentColor] = colorTokens;

      const allFinished = colorTokens.every((t) => t.status === "FINISHED");
      const winners = allFinished
        ? [...prev.winners, currentColor]
        : prev.winners;

      // Check for Game Over (if all but one finished, or all finished)
      // For now simple checking:
      const totalPlayers = prev.playerConfigs.length;
      let gameStatus: GameStatus = prev.gameStatus;
      if (winners.length >= totalPlayers - 1 && totalPlayers > 1) {
        // If 3 out of 4 move, game is technically done for the last one usually?
        // Or just let them play. Let's finish when all finish for now.
        if (winners.length === totalPlayers) {
          gameStatus = "FINISHED";
        }
      }

      // 4. Determine Next Turn
      const bonusTurn = dice === 6 || opponentKilled;

      let nextTurn = currentColor;
      let nextStreak = prev.sixesStreak;

      if (!bonusTurn) {
        const activeColors = prev.playerConfigs.map((p) => p.color);
        const currentIndex = activeColors.indexOf(currentColor);
        const nextIndex = (currentIndex + 1) % activeColors.length;
        nextTurn = activeColors[nextIndex];
        nextStreak = 0;
      }

      return {
        ...prev,
        tokens: newTokens,
        winners,
        currentTurn: nextTurn,
        diceValue: null,
        sixesStreak: nextStreak,
        gameStatus: gameStatus,
        lastMoveTime: Date.now(),
      };
    });
  }, []);

  const isTokenMovable = useCallback(
    (tokenId: number, color: PlayerColor, diceValue: number | null) => {
      if (diceValue === null) return false;
      const token = gameState.tokens[color].find((t) => t.id === tokenId);
      if (!token || token.status === "FINISHED") return false;

      // Base tokens only move with 6
      if (token.status === "BASE" && diceValue !== 6) return false;

      // Can't move if would overshoot finish line
      if (token.status === "ACTIVE") {
        const newPos = token.position + diceValue;
        if (newPos > FINISH_LINE) return false;
      }

      return true;
    },
    [gameState.tokens],
  );

  const getMovableTokenIds = useCallback(
    (color: PlayerColor, diceValue: number | null): number[] => {
      if (diceValue === null) return [];
      const tokens = gameState.tokens[color];
      return tokens
        .filter((t) => isTokenMovable(t.id, color, diceValue))
        .map((t) => t.id);
    },
    [gameState.tokens, isTokenMovable],
  );

  const getPlayerStats = useCallback(
    (color: PlayerColor): PlayerStats => {
      const tokens = gameState.tokens[color];
      return {
        color,
        tokensFinished: tokens.filter((t) => t.status === "FINISHED").length,
        tokensActive: tokens.filter((t) => t.status === "ACTIVE").length,
        tokensCaptured: tokens.filter((t) => t.status === "BASE").length,
      };
    },
    [gameState.tokens],
  );

  const resetGame = useCallback(() => {
    // Re-read config on reset
    let loadedConfig = DEFAULT_PLAYERS;
    try {
      const configStr = localStorage.getItem("playerConfig");
      if (configStr) {
        loadedConfig = JSON.parse(configStr);
      }
    } catch {
      // Ignore
    }

    setGameState({
      currentTurn: loadedConfig[0].color,
      diceValue: null,
      tokens: {
        RED: [...INITIAL_TOKENS],
        GREEN: [...INITIAL_TOKENS],
        YELLOW: [...INITIAL_TOKENS],
        BLUE: [...INITIAL_TOKENS],
      },
      sixesStreak: 0,
      winners: [],
      gameStatus: "PLAYING",
      lastMoveTime: Date.now(),
      playerConfigs: loadedConfig,
    });
  }, []);

  return {
    gameState,
    handleRollDice,
    moveToken,
    getPlayerStats,
    resetGame,
    isTokenMovable,
    getMovableTokenIds,
  };
};
