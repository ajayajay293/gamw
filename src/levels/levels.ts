// ===========================
// Shadow Veil: Awakening - Level Definitions
// ===========================
import type { LevelData, BiomeType } from '@/types/game';

// Tile types:
// 0 = empty, 1 = solid stone, 2 = platform, 3 = spike top, 4 = lava
// 5 = breakable, 6 = ice, 7 = bounce pad, 8 = checkpoint base
// 9 = portal exit, 10 = wall climbable, 11 = moving plat path
// 12 = water, 13 = secret wall (passable with dash)

function generateFlatGround(width: number, height: number, groundY: number): number[][] {
  const tiles: number[][] = [];
  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      if (y >= groundY) {
        tiles[y][x] = y === groundY ? 1 : 1; // solid ground
      } else {
        tiles[y][x] = 0;
      }
    }
  }
  return tiles;
}

function addPlatform(tiles: number[][], x: number, y: number, w: number) {
  for (let i = 0; i < w; i++) {
    if (y >= 0 && y < tiles.length && x + i >= 0 && x + i < tiles[0].length) {
      tiles[y][x + i] = 2;
    }
  }
}

function addWall(tiles: number[][], x: number, y: number, h: number) {
  for (let i = 0; i < h; i++) {
    if (y + i >= 0 && y + i < tiles.length && x >= 0 && x < tiles[0].length) {
      tiles[y + i][x] = 1;
    }
  }
}

function addSpikes(tiles: number[][], x: number, y: number, w: number) {
  for (let i = 0; i < w; i++) {
    if (y >= 0 && y < tiles.length && x + i >= 0 && x + i < tiles[0].length) {
      tiles[y][x + i] = 3;
    }
  }
}

const BG_MAP: Record<BiomeType, string> = {
  graveyard: '/bg/graveyard.jpg',
  forest: '/bg/forest.jpg',
  snow: '/bg/snow.jpg',
  desert: '/bg/desert.jpg',
  volcano: '/bg/volcano.jpg',
  castle: '/bg/castle.jpg',
  sky: '/bg/castle.jpg',
  underground: '/bg/underground.jpg',
};

// Level 1: The Hollow Graveyard - Tutorial
function createLevel1(): LevelData {
  const W = 80, H = 30;
  const tiles = generateFlatGround(W, H, 26);
  // Steps and small platforms
  addPlatform(tiles, 12, 23, 4);
  addPlatform(tiles, 20, 20, 4);
  addPlatform(tiles, 28, 18, 4);
  addPlatform(tiles, 36, 21, 5);
  addPlatform(tiles, 45, 18, 4);
  addPlatform(tiles, 52, 22, 3);
  addPlatform(tiles, 60, 19, 5);
  addPlatform(tiles, 68, 16, 6);
  // Small gaps
  for (let x = 38; x < 40; x++) tiles[26][x] = 0;
  for (let x = 55; x < 57; x++) tiles[26][x] = 0;

  return {
    id: 1, name: 'The Hollow Graveyard', biome: 'graveyard',
    width: W * 48, height: H * 48, tileSize: 48,
    tiles, playerSpawn: [100, 1100],
    enemies: [
      { type: 'wraith', x: 500, y: 1100, patrolDist: 150 },
      { type: 'wraith', x: 1500, y: 1100, patrolDist: 200 },
      { type: 'wraith', x: 2800, y: 860, patrolDist: 150 },
    ],
    collectibles: [
      { type: 'coin', x: 300, y: 1000 }, { type: 'coin', x: 350, y: 1000 }, { type: 'coin', x: 400, y: 1000 },
      { type: 'coin', x: 650, y: 900 }, { type: 'coin', x: 700, y: 900 },
      { type: 'coin', x: 1100, y: 900 }, { type: 'coin', x: 1150, y: 900 },
      { type: 'coin', x: 1400, y: 760 }, { type: 'coin', x: 1450, y: 760 },
      { type: 'coin', x: 1900, y: 900 }, { type: 'coin', x: 1950, y: 900 },
      { type: 'coin', x: 2300, y: 760 }, { type: 'coin', x: 2350, y: 760 },
      { type: 'coin', x: 2700, y: 1000 }, { type: 'coin', x: 2750, y: 1000 },
      { type: 'gem', x: 800, y: 800 }, { type: 'gem', x: 2200, y: 700 },
      { type: 'health', x: 1700, y: 900 },
    ],
    checkpoints: [[400, 1100], [2000, 900]],
    hazards: [
      { type: 'pit', x: 1824, y: 1248, width: 96, height: 48 },
      { type: 'pit', x: 2640, y: 1248, width: 96, height: 48 },
    ],
    platforms: [],
    portals: [{ x: 3400, y: 700, isExit: true, isActive: true }],
    targetTime: 45, bgImage: BG_MAP.graveyard, parallaxSpeed: 0.3,
    isBossLevel: false,
  };
}

// Level 2: Whispering Winds - Wall jumps
function createLevel2(): LevelData {
  const W = 60, H = 40;
  const tiles: number[][] = [];
  for (let y = 0; y < H; y++) { tiles[y] = new Array(W).fill(0); }
  // Ground floor
  for (let x = 0; x < 15; x++) tiles[38][x] = 1;
  for (let x = 20; x < 25; x++) tiles[38][x] = 1;
  for (let x = 30; x < 35; x++) tiles[38][x] = 1;
  for (let x = 40; x < 45; x++) tiles[38][x] = 1;
  for (let x = 50; x < 60; x++) tiles[38][x] = 1;
  // Wall jumps section
  addWall(tiles, 15, 20, 19); addWall(tiles, 25, 20, 19);
  addWall(tiles, 35, 15, 24); addWall(tiles, 45, 15, 24);
  // Platforms
  addPlatform(tiles, 5, 32, 6); addPlatform(tiles, 8, 26, 5);
  addPlatform(tiles, 5, 20, 5); addPlatform(tiles, 8, 14, 4);
  addPlatform(tiles, 20, 30, 4); addPlatform(tiles, 30, 28, 4);
  addPlatform(tiles, 40, 25, 4); addPlatform(tiles, 50, 22, 5);
  // Climbable walls
  for (let y = 5; y < 20; y++) tiles[y][1] = 10;
  for (let y = 5; y < 15; y++) tiles[y][58] = 10;

  return {
    id: 2, name: 'Whispering Winds', biome: 'castle',
    width: W * 48, height: H * 48, tileSize: 48,
    tiles, playerSpawn: [100, 1700],
    enemies: [
      { type: 'wraith', x: 400, y: 1500, patrolDist: 100 },
      { type: 'wraith', x: 1200, y: 1200, patrolDist: 100 },
      { type: 'bat', x: 800, y: 800, patrolDist: 200 },
      { type: 'bat', x: 1800, y: 600, patrolDist: 200 },
    ],
    collectibles: [
      { type: 'coin', x: 250, y: 1500 }, { type: 'coin', x: 300, y: 1500 },
      { type: 'coin', x: 450, y: 1200 }, { type: 'coin', x: 500, y: 1200 },
      { type: 'coin', x: 700, y: 1000 }, { type: 'coin', x: 750, y: 1000 },
      { type: 'coin', x: 1000, y: 1300 }, { type: 'coin', x: 1050, y: 1300 },
      { type: 'gem', x: 500, y: 700 }, { type: 'gem', x: 1500, y: 500 },
      { type: 'health', x: 800, y: 1200 },
    ],
    checkpoints: [[200, 1700], [1500, 1300]],
    hazards: [],
    platforms: [
      { x: 500, y: 1200, width: 192, height: 20, type: 'moving', moveAxis: 'x', moveSpeed: 60, moveRange: 150 },
      { x: 1200, y: 1000, width: 144, height: 20, type: 'moving', moveAxis: 'y', moveSpeed: 50, moveRange: 100 },
    ],
    portals: [{ x: 2700, y: 900, isExit: true, isActive: true }],
    targetTime: 60, bgImage: BG_MAP.castle, parallaxSpeed: 0.2,
    isBossLevel: false,
  };
}

// Level 3: Sunken Crypt - Combat focus
function createLevel3(): LevelData {
  const W = 50, H = 25;
  const tiles = generateFlatGround(W, H, 22);
  // Corridors
  addWall(tiles, 10, 10, 13); addWall(tiles, 25, 10, 13);
  addWall(tiles, 38, 5, 18);
  addPlatform(tiles, 12, 15, 8); addPlatform(tiles, 28, 15, 7);
  addPlatform(tiles, 15, 8, 6); addPlatform(tiles, 32, 8, 5);
  // Spike traps
  addSpikes(tiles, 18, 21, 4);

  return {
    id: 3, name: 'Sunken Crypt', biome: 'underground',
    width: W * 48, height: H * 48, tileSize: 48,
    tiles, playerSpawn: [100, 950],
    enemies: [
      { type: 'shield_knight', x: 600, y: 950, patrolDist: 150 },
      { type: 'wraith', x: 1100, y: 950, patrolDist: 100 },
      { type: 'shooter', x: 800, y: 650, patrolDist: 0 },
      { type: 'shield_knight', x: 1600, y: 950, patrolDist: 200 },
      { type: 'shooter', x: 1800, y: 350, patrolDist: 0 },
    ],
    collectibles: [
      { type: 'coin', x: 300, y: 850 }, { type: 'coin', x: 350, y: 850 },
      { type: 'coin', x: 500, y: 850 }, { type: 'coin', x: 550, y: 850 },
      { type: 'coin', x: 900, y: 550 }, { type: 'coin', x: 950, y: 550 },
      { type: 'gem', x: 700, y: 750 }, { type: 'gem', x: 1400, y: 850 },
      { type: 'health', x: 400, y: 850 }, { type: 'health', x: 1300, y: 850 },
    ],
    checkpoints: [[300, 950], [1400, 950]],
    hazards: [
      { type: 'spikes', x: 864, y: 1008, width: 192, height: 24 },
    ],
    platforms: [],
    portals: [{ x: 2200, y: 750, isExit: true, isActive: true }],
    targetTime: 50, bgImage: BG_MAP.underground, parallaxSpeed: 0.15,
    isBossLevel: false,
  };
}

// Level 4: Blood Falls - Ice/sliding
function createLevel4(): LevelData {
  const W = 55, H = 30;
  const tiles = generateFlatGround(W, H, 27);
  // Ice platforms (slippery)
  for (let x = 10; x < 25; x++) tiles[22][x] = 6;
  for (let x = 30; x < 42; x++) tiles[18][x] = 6;
  for (let x = 15; x < 30; x++) tiles[14][x] = 6;
  // Breakable platforms
  addPlatform(tiles, 5, 20, 3); tiles[20][5] = 5; tiles[20][6] = 5; tiles[20][7] = 5;
  addPlatform(tiles, 35, 12, 3); tiles[12][35] = 5; tiles[12][36] = 5; tiles[12][37] = 5;
  // Normal platforms
  addPlatform(tiles, 45, 15, 4); addPlatform(tiles, 48, 10, 5);
  // Bounce pads
  tiles[26][20] = 7; tiles[26][40] = 7;

  return {
    id: 4, name: 'Blood Falls', biome: 'snow',
    width: W * 48, height: H * 48, tileSize: 48,
    tiles, playerSpawn: [100, 1200],
    enemies: [
      { type: 'jumper', x: 600, y: 950, patrolDist: 100 },
      { type: 'jumper', x: 1000, y: 950, patrolDist: 100 },
      { type: 'wraith', x: 1600, y: 800, patrolDist: 150 },
      { type: 'charger', x: 2200, y: 1200, patrolDist: 200 },
      { type: 'jumper', x: 1800, y: 600, patrolDist: 100 },
    ],
    collectibles: [
      { type: 'coin', x: 300, y: 1100 }, { type: 'coin', x: 350, y: 1100 },
      { type: 'coin', x: 500, y: 900 }, { type: 'coin', x: 550, y: 900 },
      { type: 'coin', x: 800, y: 1100 }, { type: 'coin', x: 850, y: 1100 },
      { type: 'coin', x: 1200, y: 700 }, { type: 'coin', x: 1250, y: 700 },
      { type: 'gem', x: 960, y: 900 }, { type: 'gem', x: 1700, y: 500 },
      { type: 'health', x: 700, y: 1100 },
    ],
    checkpoints: [[400, 1200], [1500, 1200]],
    hazards: [
      { type: 'pit', x: 1200, y: 1296, width: 144, height: 48 },
    ],
    platforms: [
      { x: 600, y: 800, width: 144, height: 20, type: 'moving', moveAxis: 'y', moveSpeed: 40, moveRange: 150 },
    ],
    portals: [{ x: 2500, y: 400, isExit: true, isActive: true }],
    targetTime: 55, bgImage: BG_MAP.snow, parallaxSpeed: 0.2,
    isBossLevel: false,
  };
}

// Level 5: The Blight Tree - Vertical climb
function createLevel5(): LevelData {
  const W = 40, H = 50;
  const tiles: number[][] = [];
  for (let y = 0; y < H; y++) { tiles[y] = new Array(W).fill(0); }
  // Bottom
  for (let x = 0; x < 15; x++) tiles[48][x] = 1;
  // Left and right walls
  for (let y = 0; y < 49; y++) { tiles[y][0] = 1; tiles[y][39] = 1; }
  // Branching platforms
  addPlatform(tiles, 5, 42, 8); addPlatform(tiles, 20, 40, 8);
  addPlatform(tiles, 5, 36, 6); addPlatform(tiles, 25, 35, 8);
  addPlatform(tiles, 10, 30, 8); addPlatform(tiles, 28, 28, 6);
  addPlatform(tiles, 5, 24, 10); addPlatform(tiles, 22, 22, 8);
  addPlatform(tiles, 8, 18, 6); addPlatform(tiles, 25, 16, 8);
  addPlatform(tiles, 5, 12, 8); addPlatform(tiles, 20, 10, 8);
  addPlatform(tiles, 10, 6, 12);
  // Climbable vines
  for (let y = 10; y < 30; y++) tiles[y][15] = 10;
  for (let y = 5; y < 20; y++) tiles[y][35] = 10;

  return {
    id: 5, name: 'The Blight Tree', biome: 'forest',
    width: W * 48, height: H * 48, tileSize: 48,
    tiles, playerSpawn: [100, 2200],
    enemies: [
      { type: 'bat', x: 400, y: 1800, patrolDist: 200 },
      { type: 'bat', x: 800, y: 1400, patrolDist: 200 },
      { type: 'wraith', x: 500, y: 1000, patrolDist: 150 },
      { type: 'jumper', x: 1200, y: 500, patrolDist: 100 },
      { type: 'bat', x: 600, y: 600, patrolDist: 200 },
    ],
    collectibles: [
      { type: 'coin', x: 250, y: 2000 }, { type: 'coin', x: 300, y: 2000 },
      { type: 'coin', x: 400, y: 1700 }, { type: 'coin', x: 450, y: 1700 },
      { type: 'coin', x: 600, y: 1300 }, { type: 'coin', x: 650, y: 1300 },
      { type: 'coin', x: 800, y: 1000 }, { type: 'coin', x: 850, y: 1000 },
      { type: 'gem', x: 500, y: 1500 }, { type: 'gem', x: 1000, y: 400 },
      { type: 'gem', x: 700, y: 700 },
      { type: 'health', x: 300, y: 1900 },
    ],
    checkpoints: [[200, 2200], [600, 1300], [900, 500]],
    hazards: [
      { type: 'spikes', x: 480, y: 2016, width: 144, height: 24 },
    ],
    platforms: [
      { x: 500, y: 1500, width: 144, height: 20, type: 'moving', moveAxis: 'x', moveSpeed: 50, moveRange: 120 },
      { x: 1000, y: 800, width: 144, height: 20, type: 'moving', moveAxis: 'y', moveSpeed: 40, moveRange: 100 },
    ],
    portals: [{ x: 700, y: 200, isExit: true, isActive: true }],
    targetTime: 70, bgImage: BG_MAP.forest, parallaxSpeed: 0.1,
    isBossLevel: false,
  };
}

// Level 6: Ashfall Ruins - Falling hazards
function createLevel6(): LevelData {
  const W = 60, H = 25;
  const tiles = generateFlatGround(W, H, 22);
  // Platforms
  addPlatform(tiles, 10, 18, 5); addPlatform(tiles, 20, 16, 5);
  addPlatform(tiles, 30, 14, 5); addPlatform(tiles, 40, 16, 5);
  addPlatform(tiles, 15, 10, 5); addPlatform(tiles, 35, 10, 5);
  addPlatform(tiles, 25, 6, 5); addPlatform(tiles, 45, 8, 5);
  // Moving platforms

  return {
    id: 6, name: 'Ashfall Ruins', biome: 'volcano',
    width: W * 48, height: H * 48, tileSize: 48,
    tiles, playerSpawn: [100, 950],
    enemies: [
      { type: 'charger', x: 500, y: 950, patrolDist: 200 },
      { type: 'charger', x: 1200, y: 950, patrolDist: 200 },
      { type: 'wraith', x: 1000, y: 700, patrolDist: 150 },
      { type: 'shooter', x: 1800, y: 650, patrolDist: 0 },
      { type: 'charger', x: 2200, y: 950, patrolDist: 250 },
    ],
    collectibles: [
      { type: 'coin', x: 300, y: 850 }, { type: 'coin', x: 350, y: 850 },
      { type: 'coin', x: 500, y: 700 }, { type: 'coin', x: 550, y: 700 },
      { type: 'coin', x: 800, y: 600 }, { type: 'coin', x: 850, y: 600 },
      { type: 'coin', x: 1200, y: 550 }, { type: 'coin', x: 1250, y: 550 },
      { type: 'gem', x: 700, y: 750 }, { type: 'gem', x: 1600, y: 500 },
      { type: 'health', x: 400, y: 850 },
    ],
    checkpoints: [[400, 950], [1500, 950]],
    hazards: [
      { type: 'lava', x: 720, y: 1008, width: 240, height: 48 },
      { type: 'lava', x: 1440, y: 1008, width: 240, height: 48 },
    ],
    platforms: [
      { x: 600, y: 700, width: 144, height: 20, type: 'moving', moveAxis: 'x', moveSpeed: 55, moveRange: 150 },
      { x: 1400, y: 600, width: 144, height: 20, type: 'moving', moveAxis: 'y', moveSpeed: 45, moveRange: 100 },
    ],
    portals: [{ x: 2700, y: 700, isExit: true, isActive: true }],
    targetTime: 55, bgImage: BG_MAP.volcano, parallaxSpeed: 0.25,
    isBossLevel: false,
  };
}

// Level 7: Molten Passage - Rising lava
function createLevel7(): LevelData {
  const W = 70, H = 30;
  const tiles = generateFlatGround(W, H, 27);
  // Stepping stones
  addPlatform(tiles, 10, 24, 3); addPlatform(tiles, 18, 22, 3);
  addPlatform(tiles, 26, 20, 3); addPlatform(tiles, 34, 18, 3);
  addPlatform(tiles, 42, 20, 3); addPlatform(tiles, 50, 18, 3);
  addPlatform(tiles, 58, 16, 4);
  // Higher platforms
  addPlatform(tiles, 15, 15, 3); addPlatform(tiles, 30, 12, 3);
  addPlatform(tiles, 45, 10, 3); addPlatform(tiles, 55, 8, 3);

  return {
    id: 7, name: 'Molten Passage', biome: 'volcano',
    width: W * 48, height: H * 48, tileSize: 48,
    tiles, playerSpawn: [100, 1200],
    enemies: [
      { type: 'wraith', x: 600, y: 1050, patrolDist: 100 },
      { type: 'wraith', x: 1200, y: 900, patrolDist: 100 },
      { type: 'shooter', x: 1800, y: 850, patrolDist: 0 },
      { type: 'charger', x: 2500, y: 800, patrolDist: 200 },
    ],
    collectibles: [
      { type: 'coin', x: 300, y: 1100 }, { type: 'coin', x: 350, y: 1100 },
      { type: 'coin', x: 500, y: 1000 }, { type: 'coin', x: 550, y: 1000 },
      { type: 'coin', x: 900, y: 900 }, { type: 'coin', x: 950, y: 900 },
      { type: 'coin', x: 1400, y: 700 }, { type: 'coin', x: 1450, y: 700 },
      { type: 'gem', x: 800, y: 1050 }, { type: 'gem', x: 2000, y: 700 },
      { type: 'health', x: 400, y: 1100 },
    ],
    checkpoints: [[400, 1200], [1600, 1200]],
    hazards: [
      { type: 'lava', x: 0, y: 1416, width: 3360, height: 24, isInstantKill: true },
    ],
    platforms: [
      { x: 800, y: 900, width: 144, height: 20, type: 'moving', moveAxis: 'x', moveSpeed: 70, moveRange: 180 },
      { x: 2000, y: 700, width: 144, height: 20, type: 'moving', moveAxis: 'y', moveSpeed: 50, moveRange: 120 },
    ],
    portals: [{ x: 3100, y: 650, isExit: true, isActive: true }],
    targetTime: 50, bgImage: BG_MAP.volcano, parallaxSpeed: 0.3,
    isBossLevel: false,
  };
}

// Level 8: Hall of Mirrors - Maze
function createLevel8(): LevelData {
  const W = 45, H = 35;
  const tiles: number[][] = [];
  for (let y = 0; y < H; y++) { tiles[y] = new Array(W).fill(0); }
  // Maze walls
  for (let x = 0; x < W; x++) { tiles[0][x] = 1; tiles[34][x] = 1; }
  for (let y = 0; y < H; y++) { tiles[y][0] = 1; tiles[y][44] = 1; }
  // Inner maze
  for (let x = 5; x < 15; x++) tiles[10][x] = 1;
  for (let y = 5; y < 15; y++) tiles[y][20] = 1;
  for (let x = 25; x < 35; x++) tiles[15][x] = 1;
  for (let y = 15; y < 25; y++) tiles[y][30] = 1;
  for (let x = 10; x < 25; x++) tiles[25][x] = 1;
  for (let y = 20; y < 30; y++) tiles[y][10] = 1;
  // Secret walls (passable with dash)
  tiles[15][20] = 13; tiles[25][18] = 13;
  // Platforms
  addPlatform(tiles, 8, 18, 4); addPlatform(tiles, 35, 20, 4);
  addPlatform(tiles, 15, 8, 4); addPlatform(tiles, 38, 28, 4);
  addPlatform(tiles, 22, 30, 5);

  return {
    id: 8, name: 'Hall of Mirrors', biome: 'castle',
    width: W * 48, height: H * 48, tileSize: 48,
    tiles, playerSpawn: [100, 1500],
    enemies: [
      { type: 'shield_knight', x: 500, y: 1500, patrolDist: 100 },
      { type: 'shooter', x: 1200, y: 700, patrolDist: 0 },
      { type: 'wraith', x: 1800, y: 1500, patrolDist: 150 },
      { type: 'shield_knight', x: 1500, y: 500, patrolDist: 100 },
      { type: 'jumper', x: 800, y: 1300, patrolDist: 100 },
    ],
    collectibles: [
      { type: 'coin', x: 300, y: 1400 }, { type: 'coin', x: 350, y: 1400 },
      { type: 'coin', x: 600, y: 1300 }, { type: 'coin', x: 650, y: 1300 },
      { type: 'coin', x: 1000, y: 600 }, { type: 'coin', x: 1050, y: 600 },
      { type: 'gem', x: 500, y: 1200 }, { type: 'gem', x: 1600, y: 400 },
      { type: 'gem', x: 1400, y: 1300 },
      { type: 'health', x: 400, y: 1400 },
    ],
    checkpoints: [[200, 1500], [1400, 1500]],
    hazards: [
      { type: 'spikes', x: 480, y: 1584, width: 192, height: 24 },
    ],
    platforms: [],
    portals: [{ x: 1900, y: 1300, isExit: true, isActive: true }],
    targetTime: 65, bgImage: BG_MAP.castle, parallaxSpeed: 0.2,
    isBossLevel: false,
  };
}

// Level 9: The Aether Gate - Boss fight
function createLevel9(): LevelData {
  const W = 40, H = 25;
  const tiles = generateFlatGround(W, H, 22);
  // Arena pillars
  addWall(tiles, 10, 15, 8); addWall(tiles, 30, 15, 8);
  addPlatform(tiles, 5, 12, 4); addPlatform(tiles, 32, 12, 4);

  return {
    id: 9, name: 'The Aether Gate', biome: 'castle',
    width: W * 48, height: H * 48, tileSize: 48,
    tiles, playerSpawn: [200, 950],
    enemies: [
      { type: 'boss_gatekeeper', x: 1500, y: 950, patrolDist: 0, phase: 1 },
    ],
    collectibles: [
      { type: 'health', x: 300, y: 900 },
      { type: 'health', x: 400, y: 900 },
      { type: 'health', x: 500, y: 900 },
      { type: 'coin', x: 600, y: 900 }, { type: 'coin', x: 650, y: 900 },
    ],
    checkpoints: [[300, 950]],
    hazards: [
      { type: 'spikes', x: 432, y: 1056, width: 576, height: 24 },
    ],
    platforms: [
      { x: 500, y: 700, width: 144, height: 20, type: 'moving', moveAxis: 'y', moveSpeed: 40, moveRange: 150 },
      { x: 1300, y: 700, width: 144, height: 20, type: 'moving', moveAxis: 'y', moveSpeed: 40, moveRange: 150 },
    ],
    portals: [{ x: 1800, y: 900, isExit: true, isActive: false }],
    targetTime: 120, bgImage: BG_MAP.castle, parallaxSpeed: 0.2,
    isBossLevel: true,
  };
}

// Level 10: True Awakening - Final challenge
function createLevel10(): LevelData {
  const W = 80, H = 30;
  const tiles = generateFlatGround(W, H, 27);
  // Complex layout combining all mechanics
  addWall(tiles, 10, 10, 18); addWall(tiles, 25, 5, 23);
  addWall(tiles, 40, 10, 18); addWall(tiles, 55, 5, 23);
  // Ice section
  for (let x = 15; x < 25; x++) tiles[22][x] = 6;
  // Bounce pads
  tiles[26][30] = 7; tiles[26][45] = 7;
  // Breakable
  addPlatform(tiles, 35, 18, 3); tiles[18][35] = 5; tiles[18][36] = 5; tiles[18][37] = 5;
  addPlatform(tiles, 60, 15, 4); addPlatform(tiles, 65, 10, 5);
  // Spike traps
  addSpikes(tiles, 50, 26, 4);

  return {
    id: 10, name: 'True Awakening', biome: 'sky',
    width: W * 48, height: H * 48, tileSize: 48,
    tiles, playerSpawn: [100, 1200],
    enemies: [
      { type: 'wraith', x: 500, y: 1200, patrolDist: 150 },
      { type: 'shield_knight', x: 1000, y: 1200, patrolDist: 150 },
      { type: 'bat', x: 1400, y: 800, patrolDist: 200 },
      { type: 'charger', x: 2000, y: 1200, patrolDist: 250 },
      { type: 'shooter', x: 2400, y: 1000, patrolDist: 0 },
      { type: 'jumper', x: 2800, y: 1200, patrolDist: 150 },
      { type: 'boss_gatekeeper', x: 3500, y: 1200, patrolDist: 0, phase: 2 },
    ],
    collectibles: [
      { type: 'coin', x: 300, y: 1100 }, { type: 'coin', x: 350, y: 1100 },
      { type: 'coin', x: 500, y: 1000 }, { type: 'coin', x: 550, y: 1000 },
      { type: 'coin', x: 800, y: 1100 }, { type: 'coin', x: 850, y: 1100 },
      { type: 'coin', x: 1200, y: 700 }, { type: 'coin', x: 1250, y: 700 },
      { type: 'coin', x: 1600, y: 1100 }, { type: 'coin', x: 1650, y: 1100 },
      { type: 'gem', x: 700, y: 1000 }, { type: 'gem', x: 1500, y: 900 },
      { type: 'gem', x: 2500, y: 800 },
      { type: 'health', x: 400, y: 1100 }, { type: 'health', x: 1800, y: 1100 },
      { type: 'chest', x: 3200, y: 1100, value: 500 },
    ],
    checkpoints: [[400, 1200], [1800, 1200], [3000, 1200]],
    hazards: [
      { type: 'spikes', x: 2400, y: 1296, width: 192, height: 24 },
      { type: 'lava', x: 720, y: 1296, width: 144, height: 24 },
    ],
    platforms: [
      { x: 900, y: 900, width: 144, height: 20, type: 'moving', moveAxis: 'x', moveSpeed: 60, moveRange: 150 },
      { x: 2200, y: 800, width: 144, height: 20, type: 'moving', moveAxis: 'y', moveSpeed: 50, moveRange: 120 },
    ],
    portals: [{ x: 3700, y: 1100, isExit: true, isActive: true }],
    targetTime: 90, bgImage: BG_MAP.castle, parallaxSpeed: 0.2,
    isBossLevel: false,
  };
}

export const LEVELS: LevelData[] = [
  createLevel1(),
  createLevel2(),
  createLevel3(),
  createLevel4(),
  createLevel5(),
  createLevel6(),
  createLevel7(),
  createLevel8(),
  createLevel9(),
  createLevel10(),
];

export function getLevelById(id: number): LevelData | undefined {
  return LEVELS.find((l) => l.id === id);
}
