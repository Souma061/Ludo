//  Constants= Safe_Zone [8,21,`34,47], Home_Base [0,13,26,39]


export const SAFE_ZONES = [
  0, 13, 26, 39, // Colored Start Positions
  8, 21, 34, 47  // White Star Positions
];


// Helper to check if a Global Path index is a Safe Zone

export const isSafeZone = (globalIndex: number): boolean => {
  return SAFE_ZONES.includes(globalIndex);
}
