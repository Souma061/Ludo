import { useCallback, useState } from "react";
import { START_INDEX } from "../constants/coordinates";
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
  moveHistory: Array<{ player: PlayerColor; action: string; timestamp: number }>;
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
    moveHistory: []
  });

  const handleRollDice = useCallback(() => {
    setGameState(prev => {
      if (prev.gameStatus !== "PLAYING") return prev;

      const diceValue = Math.floor(Math.random() * 6) + 1;
      return {
        ...prev,
        diceValue,
        lastMoveTime: Date.now()
      };
    });
  }, []);

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

      if (tokenIndex === -1) return prev;

      const dice = prev.diceValue;
      let newPosition = colorTokens[tokenIndex].position;

      // Handle movement logic
      if (newPosition === -1 && dice === 6) {
        newPosition = START_INDEX[currentColor];
      } else if (newPosition >= 0) {
        newPosition += dice;
      } else {
        return prev; // Can't move
      }

      // Update token
      colorTokens[tokenIndex] = {
        ...colorTokens[tokenIndex],
        position: newPosition,
        status: newPosition >= 57 ? "FINISHED" : "ACTIVE"
      };

      newTokens[currentColor] = colorTokens;

      // Check for win
      const allFinished = colorTokens.every(t => t.status === "FINISHED");
      const winners = allFinished ? [...prev.winners, currentColor] : prev.winners;

      // Switch turn if didn't roll 6
      const turns: PlayerColor[] = ["RED", "GREEN", "YELLOW", "BLUE"];
      let nextTurn = currentColor;

      if (dice !== 6) {
        const currentIndex = turns.indexOf(currentColor);
        const nextIndex = (currentIndex + 1) % turns.length;
        nextTurn = turns[nextIndex];
      }

      return {
        ...prev,
        tokens: newTokens,
        winners,
        currentTurn: nextTurn,
        diceValue: null,
        sixesStreak: dice === 6 ? prev.sixesStreak + 1 : 0,
        gameStatus: winners.length >= 3 ? "FINISHED" : "PLAYING",
        lastMoveTime: Date.now()
      };
    });
  }, []);

  const getPlayerStats = useCallback((color: PlayerColor): PlayerStats => {
    const tokens = gameState.tokens[color];
    if (!tokens) {
      return {
        color,
        tokensFinished: 0,
        tokensActive: 0,
        tokensCaptured: 0
      };
    }
    return {
      color,
      tokensFinished: tokens.filter(t => t.status === "FINISHED").length,
      tokensActive: tokens.filter(t => t.status === "ACTIVE").length,
      tokensCaptured: 0
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
      moveHistory: []
    });
  }, []);

  return { gameState, handleRollDice, moveToken, getPlayerStats, resetGame };
};
