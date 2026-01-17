export type PlayerColor = "RED" | "GREEN" | "YELLOW" | "BLUE";
export type GameStatus = "PLAYING" | "FINISHED" | "PAUSED";

export interface TokenState {
  id: number;
  position: number;
  status: "BASE" | "ACTIVE" | "FINISHED";
}

export interface Player {
  color: PlayerColor;
  tokens: TokenState[];
  hasWon: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayer: number;
  status: GameStatus;
  diceValue: number;
  isRolling: boolean;
  canRoll: boolean;
  winner: PlayerColor | null;
  moveHistory: Array<{
    player: PlayerColor;
    from: number;
    to: number;
    captured?: boolean;
  }>;
}

export interface GameContextType {
  gameState: GameState;
  rollDice: () => void;
  moveToken: (playerId: number, tokenId: number) => void;
  resetGame: () => void;
}

export interface Player {
  id:number;
  name:string;
  color:PlayerColor;
  isHuman:boolean;
}


export interface GameSetup {
  players: Player[];
  mode: 'LOCAL' | 'ONLINE' | 'COMPUTER';
}
