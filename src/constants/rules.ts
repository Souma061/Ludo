//  Constants= Safe_Zone [8,21,`34,47], Home_Base [0,13,26,39]

// Game Board Constants
export const BOARD_PATH_LENGTH = 52;
export const VICTORY_POSITION = 56;
export const HOME_STRETCH_START = 51;
export const MAX_SIXES_STREAK = 3;
export const TOKENS_PER_PLAYER = 4;
export const TOTAL_PLAYERS = 4;
export const FINISH_LINE = 56; // Position where token is finished (5 home boxes + center)

export const SAFE_ZONES = [
  0,
  13,
  26,
  39, // Colored Start Positions
  8,
  21,
  34,
  47, // White Star Positions
];

// Helper to check if a Global Path index is a Safe Zone
export const isSafeZone = (globalIndex: number): boolean => {
  return SAFE_ZONES.includes(globalIndex);
};
