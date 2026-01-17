//🎯 Critical: The Arrays mapping steps to (x, y) coordinates on the board
export interface Corrdinates {
  r: number;
  c: number;
}

export const GLOBAL_PATH: Corrdinates[] = [
  //rED (bOTTOM LEFT TO TOP LEFT)
  { r: 6, c: 1 },
  { r: 6, c: 2 },
  { r: 6, c: 3 },
  { r: 6, c: 4 },
  { r: 6, c: 5 }, // 0-4
  { r: 5, c: 6 },
  { r: 4, c: 6 },
  { r: 3, c: 6 },
  { r: 2, c: 6 },
  { r: 1, c: 6 },
  { r: 0, c: 6 }, // 5-10
  { r: 0, c: 7 },
  { r: 0, c: 8 }, // 11 - 12 (turning top corner)

  //GREEN (TOP RIGHT TO BOTTOM RIGHT)
  { r: 1, c: 8 },
  { r: 2, c: 8 },
  { r: 3, c: 8 },
  { r: 4, c: 8 },
  { r: 5, c: 8 }, // 13-17 (13 is Green Start)
  { r: 6, c: 9 },
  { r: 6, c: 10 },
  { r: 6, c: 11 },
  { r: 6, c: 12 },
  { r: 6, c: 13 },
  { r: 6, c: 14 }, // 18-23
  { r: 7, c: 14 },
  { r: 8, c: 14 }, // 24 - 25 (turning right corner)

  // YELLOW (BOTTOM RIGHT TO BOTTOM LEFT)

  { r: 8, c: 13 },
  { r: 8, c: 12 },
  { r: 8, c: 11 },
  { r: 8, c: 10 },
  { r: 8, c: 9 }, // 26-30 (26 is Yellow Start)
  { r: 9, c: 8 },
  { r: 10, c: 8 },
  { r: 11, c: 8 },
  { r: 12, c: 8 },
  { r: 13, c: 8 },
  { r: 14, c: 8 }, // 31-36
  { r: 14, c: 7 },
  { r: 14, c: 6 }, // 37 - 38 (turning bottom corner)

  // BLUE (BOTTOM LEFT TO TOP LEFT)
  { r: 13, c: 6 },
  { r: 12, c: 6 },
  { r: 11, c: 6 },
  { r: 10, c: 6 },
  { r: 9, c: 6 }, // 39-43 (39 is Blue Start)
  { r: 8, c: 5 },
  { r: 8, c: 4 },
  { r: 8, c: 3 },
  { r: 8, c: 2 },
  { r: 8, c: 1 },
  { r: 8, c: 0 }, // 44-49
  { r: 7, c: 0 },
  { r: 6, c: 0 }, // 50 - 51 (turning left corner)
];

export const HOME_PATHS = {
  RED: [
    { r: 7, c: 1 },
    { r: 7, c: 2 },
    { r: 7, c: 3 },
    { r: 7, c: 4 },
    { r: 7, c: 5 },
    // Position 56 (center) is handled separately
  ],
  GREEN: [
    { r: 1, c: 7 },
    { r: 2, c: 7 },
    { r: 3, c: 7 },
    { r: 4, c: 7 },
    { r: 5, c: 7 },
    // Position 56 (center) is handled separately
  ],
  YELLOW: [
    { r: 7, c: 13 },
    { r: 7, c: 12 },
    { r: 7, c: 11 },
    { r: 7, c: 10 },
    { r: 7, c: 9 },
    // Position 56 (center) is handled separately
  ],
  BLUE: [
    { r: 13, c: 7 },
    { r: 12, c: 7 },
    { r: 11, c: 7 },
    { r: 10, c: 7 },
    { r: 9, c: 7 },
    // Position 56 (center) is handled separately
  ],
};

export const BASE_POSITIONS = {
  RED: [
    { r: 1.8, c: 1.8 },
    { r: 1.8, c: 3.2 },
    { r: 3.2, c: 1.8 },
    { r: 3.2, c: 3.2 },
  ],
  GREEN: [
    { r: 1.8, c: 10.8 },
    { r: 1.8, c: 12.2 },
    { r: 3.2, c: 10.8 },
    { r: 3.2, c: 12.2 },
  ],
  YELLOW: [
    { r: 10.8, c: 10.8 },
    { r: 10.8, c: 12.2 },
    { r: 12.2, c: 10.8 },
    { r: 12.2, c: 12.2 },
  ],
  BLUE: [
    { r: 10.8, c: 1.8 },
    { r: 10.8, c: 3.2 },
    { r: 12.2, c: 1.8 },
    { r: 12.2, c: 3.2 },
  ],
};

export const START_INDEX = {
  RED: 0,
  GREEN: 13,
  YELLOW: 26,
  BLUE: 39,
};

// Center victory position (7, 7)
export const CENTER_POSITION: Corrdinates = { r: 7, c: 7 };
