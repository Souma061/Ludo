import { useCallback, useEffect, useState } from "react";
import { START_INDEX } from "../constants/coordinates";
import { isSafeZone } from "../constants/rules";
import type { GameStatus, PlayerColor, TokenState } from "../types";

export interface PlayerStats {
  color: PlayerColor;
  tokensFinished: number;
  tokensActive: number;
  tokensCaptured: number;
}

const INITIAL_TOKENS = [0, 1, 2, 3].map((id) => ({ id, position: -1, status: "BASE" as const }));

interface LegacyGameState {
  currentTurn: PlayerColor;
  diceValue: number | null;
  tokens: { [key in PlayerColor]: TokenState[] };
  sixesStreak: number;
  winners: PlayerColor[];
  gameStatus: GameStatus;
  lastMoveTime: number;
}

export const useGameLogics = () => {
  const [gameState, setGameState] = useState<LegacyGameState>({
    currentTurn: "RED",
    diceValue: null,
    tokens: {
      RED: [...INITIAL_TOKENS],
      GREEN: [...INITIAL_TOKENS],
      YELLOW: [...INITIAL_TOKENS],
      BLUE: [...INITIAL_TOKENS]
    },
    sixesStreak: 0,
    winners: [],
    gameStatus: "PLAYING",
    lastMoveTime: 0,
  });

  // --- HELPER: Switch Turn ---
  const switchTurn = useCallback(() => {
    const turns: PlayerColor[] = ["RED", "GREEN", "YELLOW", "BLUE"];
    setGameState(prev => {
      const currentIndex = turns.indexOf(prev.currentTurn);
      const nextIndex = (currentIndex + 1) % turns.length;
      return {
        ...prev,
        currentTurn: turns[nextIndex],
        diceValue: null,
        sixesStreak: 0
      };
    });
  }, []);

  // --- HELPER: Check Valid Moves ---
  const hasValidMoves = (dice: number, tokens: TokenState[]) => {
    return tokens.some(token => {
      if (token.status === "FINISHED") return false;
      if (token.status === "BASE") return dice === 6;
      return token.position + dice <= 57;
    });
  };

  // --- ACTION: Roll Dice ---
  const handleRollDice = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== "PLAYING" || prev.diceValue !== null) return prev;

      const diceValue = Math.floor(Math.random() * 6) + 1;
      let newStreak = prev.sixesStreak;

      // Handle 3 Sixes in a row
      if (diceValue === 6) {
        newStreak += 1;
        if (newStreak === 3) {
          setTimeout(switchTurn, 1000); // Auto skip turn
          return {
            ...prev,
            diceValue,
            sixesStreak: 0,
            lastMoveTime: Date.now()
          };
        }
      } else {
        newStreak = 0;
      }

      return {
        ...prev,
        diceValue,
        sixesStreak: newStreak,
        lastMoveTime: Date.now()
      };
    });
  }, [switchTurn]);

  // --- EFFECT: Auto-Switch if No Moves ---
  useEffect(() => {
    if (gameState.diceValue && !gameState.winners.includes(gameState.currentTurn)) {
      const canMove = hasValidMoves(
        gameState.diceValue,
        gameState.tokens[gameState.currentTurn]
      );

      // If player cannot move any token, wait 1s and pass turn
      if (!canMove && gameState.sixesStreak < 3) {
        const timeout = setTimeout(switchTurn, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [gameState.diceValue, gameState.currentTurn, gameState.tokens, switchTurn, gameState.winners, gameState.sixesStreak]);


  // --- ACTION: Move Token ---
  const moveToken = useCallback((tokenId: number) => {
    setGameState(prev => {
      if (!prev.diceValue || prev.gameStatus !== "PLAYING") return prev;

      const currentColor = prev.currentTurn;
      const tokens = prev.tokens[currentColor];
      const token = tokens.find(t => t.id === tokenId);

      if (!token) return prev;

      const newTokens = { ...prev.tokens };
      const colorTokens = [...newTokens[currentColor]];
      const tokenIndex = colorTokens.findIndex(t => t.id === tokenId);
      const dice = prev.diceValue;

      let newPosition = colorTokens[tokenIndex].position;
      let newStatus = colorTokens[tokenIndex].status;

      // 1. Calculate New Position
      if (newStatus === "BASE") {
        if (dice === 6) {
          newPosition = 0; // ✅ FIX: Always 0 (Start of path)
          newStatus = "ACTIVE";
        } else {
          return prev;
        }
      } else if (newStatus === "ACTIVE") {
        if (newPosition + dice <= 57) {
          newPosition += dice;
          if (newPosition === 57) newStatus = "FINISHED";
        } else {
          return prev;
        }
      } else {
        return prev;
      }

      // 2. Collision / Killing Logic
      let globalPos = -1;
      if (newStatus === "ACTIVE" && newPosition < 51) {
        const offset = START_INDEX[currentColor];
        globalPos = (offset + newPosition) % 52;
      }

      let opponentKilled = false;

      // Only check collision if we are on the main board (not home run) and not in a Safe Zone
      if (globalPos !== -1 && !isSafeZone(globalPos)) {
        (['RED', 'GREEN', 'YELLOW', 'BLUE'] as PlayerColor[]).forEach(oppColor => {
          if (oppColor === currentColor) return;

          const oppTokens = [...newTokens[oppColor]];
          // Find tokens at the exact same spot
          const victims = oppTokens.filter(t => {
            if (t.status !== "ACTIVE" || t.position >= 51) return false;
            const oppOffset = START_INDEX[oppColor];
            const oppGlobal = (oppOffset + t.position) % 52;
            return oppGlobal === globalPos;
          });

          // Kill logic: If exactly 1 token is there (not a stack)
          if (victims.length === 1) {
            const victimIndex = oppTokens.indexOf(victims[0]);
            oppTokens[victimIndex] = { ...oppTokens[victimIndex], position: -1, status: "BASE" };
            newTokens[oppColor] = oppTokens;
            opponentKilled = true;
          }
        });
      }

      // 3. Update State
      colorTokens[tokenIndex] = {
        ...colorTokens[tokenIndex],
        position: newPosition,
        status: newStatus
      };
      newTokens[currentColor] = colorTokens;

      const allFinished = colorTokens.every(t => t.status === "FINISHED");
      const winners = allFinished ? [...prev.winners, currentColor] : prev.winners;

      // 4. Determine Next Turn
      // Bonus turn if: Rolled 6 OR Killed Opponent
      const bonusTurn = dice === 6 || opponentKilled;

      let nextTurn = currentColor;
      let nextStreak = prev.sixesStreak;

      if (!bonusTurn) {
        const turns: PlayerColor[] = ["RED", "GREEN", "YELLOW", "BLUE"];
        const currentIndex = turns.indexOf(currentColor);
        const nextIndex = (currentIndex + 1) % turns.length;
        nextTurn = turns[nextIndex];
        nextStreak = 0;
      }

      return {
        ...prev,
        tokens: newTokens,
        winners,
        currentTurn: nextTurn,
        diceValue: null, // Reset dice
        sixesStreak: nextStreak,
        gameStatus: winners.length >= 3 ? "FINISHED" : "PLAYING",
        lastMoveTime: Date.now()
      };
    });
  }, []);

  const getPlayerStats = useCallback((color: PlayerColor): PlayerStats => {
    const tokens = gameState.tokens[color];
    return {
      color,
      tokensFinished: tokens.filter(t => t.status === "FINISHED").length,
      tokensActive: tokens.filter(t => t.status === "ACTIVE").length,
      tokensCaptured: tokens.filter(t => t.status === "BASE").length
    };
  }, [gameState.tokens]);

  const resetGame = useCallback(() => {
    setGameState({
      currentTurn: "RED",
      diceValue: null,
      tokens: {
        RED: [...INITIAL_TOKENS],
        GREEN: [...INITIAL_TOKENS],
        YELLOW: [...INITIAL_TOKENS],
        BLUE: [...INITIAL_TOKENS]
      },
      sixesStreak: 0,
      winners: [],
      gameStatus: "PLAYING",
      lastMoveTime: Date.now(),
    });
  }, []);

  return { gameState, handleRollDice, moveToken, getPlayerStats, resetGame };
};
