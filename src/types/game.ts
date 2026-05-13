// ===========================
// Shadow Veil: Awakening - Game Types
// ===========================

export interface Vec2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  coins: number;
  gems: number;
  xp: number;
  level: number;
  lives: number;
  facing: 1 | -1;
  isGrounded: boolean;
  isJumping: boolean;
  isAttacking: boolean;
  isDashing: boolean;
  isHurt: boolean;
  isDead: boolean;
  isWallSliding: boolean;
  isClimbing: boolean;
  isSwimming: boolean;
  isGliding: boolean;
  isSliding: boolean;
  comboCount: number;
  invincibleTimer: number;
  attackCooldown: number;
  dashCooldown: number;
  dashTimer: number;
  wallSlideTimer: number;
  coyoteTimer: number;
  jumpBufferTimer: number;
  animFrame: number;
  animTimer: number;
  state: PlayerAnimState;
  skin: string;
  hasKey: boolean;
}

export type PlayerAnimState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'fall'
  | 'land'
  | 'attack1'
  | 'attack2'
  | 'attack3'
  | 'dash'
  | 'hurt'
  | 'death'
  | 'wallslide'
  | 'climb'
  | 'swim'
  | 'glide'
  | 'slide';

export interface EnemyState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  type: EnemyType;
  facing: 1 | -1;
  isGrounded: boolean;
  isHurt: boolean;
  isAttacking: boolean;
  isDead: boolean;
  isStunned: boolean;
  isShielded: boolean;
  animFrame: number;
  animTimer: number;
  state: EnemyAnimState;
  patrolStart: number;
  patrolEnd: number;
  attackCooldown: number;
  stunTimer: number;
  hurtTimer: number;
  phase: number;
  rageMode: boolean;
  detectRange: number;
  attackRange: number;
  moveSpeed: number;
  damage: number;
  scoreValue: number;
  dropTable: DropItem[];
}

export type EnemyType =
  | 'wraith'
  | 'shield_knight'
  | 'bat'
  | 'boss_gatekeeper'
  | 'shooter'
  | 'charger'
  | 'jumper';

export type EnemyAnimState = 'idle' | 'patrol' | 'chase' | 'attack' | 'hurt' | 'death' | 'shield' | 'rage';

export interface DropItem {
  type: 'coin' | 'gem' | 'health' | 'energy' | 'key';
  chance: number; // 0-1
  minCount: number;
  maxCount: number;
}

export interface CollectibleState {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'gem' | 'health' | 'energy' | 'key' | 'chest';
  value: number;
  collected: boolean;
  bobOffset: number;
  magnetized: boolean;
  animFrame: number;
  width: number;
  height: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
  alpha: number;
  type: 'dust' | 'spark' | 'blood' | 'magic' | 'coin' | 'hit' | 'trail' | 'explosion';
}

export interface CheckpointState {
  x: number;
  y: number;
  activated: boolean;
  width: number;
  height: number;
}

export interface PlatformState {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'static' | 'moving' | 'breakable' | 'ice' | 'bounce';
  moveAxis: 'x' | 'y';
  moveSpeed: number;
  moveRange: number;
  moveOrigin: number;
  isBroken: boolean;
  currentPos: number;
}

export interface HazardState {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spikes' | 'lava' | 'pit';
  damage: number;
  isInstantKill: boolean;
}

export interface PortalState {
  x: number;
  y: number;
  width: number;
  height: number;
  targetLevel: number;
  isExit: boolean;
  isActive: boolean;
}

export interface CameraState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  shakeX: number;
  shakeY: number;
  shakeIntensity: number;
  shakeDecay: number;
  zoom: number;
}

export interface LevelData {
  id: number;
  name: string;
  biome: BiomeType;
  width: number;
  height: number;
  tileSize: number;
  tiles: number[][];
  playerSpawn: [number, number];
  enemies: EnemySpawn[];
  collectibles: CollectibleSpawn[];
  checkpoints: [number, number][];
  hazards: HazardSpawn[];
  platforms: PlatformData[];
  portals: PortalData[];
  targetTime: number;
  bgImage: string;
  parallaxSpeed: number;
  isBossLevel: boolean;
}

export type BiomeType = 'graveyard' | 'forest' | 'snow' | 'desert' | 'volcano' | 'castle' | 'sky' | 'underground';

export interface EnemySpawn {
  type: EnemyType;
  x: number;
  y: number;
  patrolDist?: number;
  phase?: number;
}

export interface CollectibleSpawn {
  type: 'coin' | 'gem' | 'health' | 'energy' | 'key' | 'chest';
  x: number;
  y: number;
  value?: number;
}

export interface HazardSpawn {
  type: 'spikes' | 'lava' | 'pit';
  x: number;
  y: number;
  width: number;
  height: number;
  isInstantKill?: boolean;
}

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'static' | 'moving' | 'breakable' | 'ice' | 'bounce';
  moveAxis?: 'x' | 'y';
  moveSpeed?: number;
  moveRange?: number;
}

export interface PortalData {
  x: number;
  y: number;
  isExit: boolean;
  isActive?: boolean;
}

export interface GameSettings {
  graphics: {
    quality: 'low' | 'medium' | 'high';
    fpsLimit: number;
    shadows: boolean;
    particles: boolean;
    screenShake: boolean;
  };
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
  };
  controls: {
    left: string;
    right: string;
    jump: string;
    attack: string;
    dash: string;
    interact: string;
    pause: string;
  };
  mobile: {
    joystickSize: number;
    buttonSize: number;
    buttonOpacity: number;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'consumable' | 'equipment' | 'material' | 'key';
  description: string;
  icon: string;
  quantity: number;
  maxStack: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  equipped: boolean;
  effects?: {
    hpBonus?: number;
    attackBonus?: number;
    speedBonus?: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  reward: {
    coins?: number;
    gems?: number;
    item?: string;
  };
  progress: number;
  maxProgress: number;
  category: 'combat' | 'exploration' | 'collection' | 'challenge';
}

export interface SkinData {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockCost: { coins?: number; gems?: number };
  preview: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'powerup' | 'upgrade' | 'consumable' | 'skin';
  cost: { coins?: number; gems?: number };
  icon: string;
  purchased: boolean;
  maxPurchase?: number;
  purchaseCount: number;
  effect: string;
}

export interface DamageNumber {
  x: number;
  y: number;
  value: number;
  isCritical: boolean;
  life: number;
  vy: number;
  color: string;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  damage: number;
  isEnemy: boolean;
  life: number;
  type: 'arrow' | 'magic' | 'fireball';
}

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  stars: number;
  bestTime: number;
  bestScore: number;
  deaths: number;
}

export interface SaveData {
  version: string;
  player: {
    hp: number;
    maxHp: number;
    coins: number;
    gems: number;
    xp: number;
    level: number;
    lives: number;
    currentSkin: string;
    unlockedSkins: string[];
    upgrades: {
      hpLevel: number;
      attackLevel: number;
      speedLevel: number;
      dashLevel: number;
    };
  };
  levels: Record<number, LevelProgress>;
  inventory: InventoryItem[];
  achievements: Record<string, { unlocked: boolean; unlockedAt?: string; progress: number }>;
  settings: GameSettings;
  stats: {
    totalCoins: number;
    totalGems: number;
    totalKills: number;
    totalDeaths: number;
    totalPlayTime: number;
    bestCombo: number;
    levelsCompleted: number;
    bossesDefeated: number;
  };
  lastPlayed: string;
  dailyReward: {
    lastClaimed: string;
    streak: number;
  };
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
  date: string;
  time: number;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  vy: number;
  fontSize: number;
}

export type GameScreen =
  | 'mainmenu'
  | 'dashboard'
  | 'levelselect'
  | 'worldmap'
  | 'playing'
  | 'paused'
  | 'gameover'
  | 'victory'
  | 'options'
  | 'profile'
  | 'achievements'
  | 'inventory'
  | 'shop'
  | 'skins'
  | 'dailyreward'
  | 'challenges'
  | 'bossrush'
  | 'leaderboard'
  | 'tutorial'
  | 'credits'
  | 'saveload'
  | 'settings-graphics'
  | 'settings-audio'
  | 'settings-controls';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'time_attack' | 'survival' | 'hardcore' | 'no_damage' | 'coin_rush';
  levelId: number;
  reward: { coins: number; gems: number };
  bestScore: number;
  completed: boolean;
  targetScore: number;
}

export interface ComboSystem {
  count: number;
  timer: number;
  maxCombo: number;
  multiplier: number;
}
